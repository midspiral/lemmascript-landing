---
title: 'We started proving our own compiler, and the proofs found bugs'
date: 2026-07-28
description: >-
  LemmaScript proves your TypeScript. So we pointed it at its own compiler.
  The first two machine-checked passes surfaced real engine bugs — a scan that
  stopped too early, tree nodes a rewriter silently skipped, and three unproven
  obligations hiding behind a timeout.
authors: ['Fernanda Graciolli']
tags: ['internals', 'self-hosting', 'proofs']
published: false
---

LemmaScript's pitch is that you write ordinary TypeScript, add `//@ `
annotations, and the toolchain proves your code correct in Dafny. Which
invites an obvious question: **who proves the toolchain?**

The compiler is itself written in TypeScript. So a few weeks ago, on a branch
we call [`ls-in-ls`](https://github.com/midspiral/LemmaScript/tree/ls-in-ls),
we started feeding the compiler to itself — running `lsc` on its own source
and proving theorems about its own passes. Two compiler modules now carry
machine-checked proofs, verified continuously in CI alongside every example in
the repo.

**Writing those proofs found real bugs.** Not hypothetical gaps, not style
issues — bugs in code that was already tested, already reviewed, and already
shipping its output through the rest of the pipeline. "The proof wouldn't go
through" turned out to be the best code review the compiler ever had.

## The first patient: peephole

The [peephole pass](https://github.com/midspiral/LemmaScript/blob/ls-in-ls/tools/src/peephole.ts)
is the compiler's cleanup crew. After the main translation runs, the
intermediate representation is littered with wrap-then-unwrap ceremony, and
peephole rewrites it away with a handful of local rules. Things like:

```
if c then true else false   →   c
if c then b else false      →   c && b
match m.get(k) { Some(v) => sb, None => nb }
                            →   if k in m then sb[v := m[k]] else nb
```

Simple rules, applied bottom-up over the whole tree, repeatedly, until nothing
fires anymore. At 369 lines of TypeScript it's the smallest pass we have —
which is exactly why it went first.

What did we prove about it? Three properties, which in plain language are:

- **Termination** — the rewriting always finishes. No input can make the
  engine loop forever.
- **Normalization** — when the engine says it's done, it's actually done:
  the output provably contains no leftover rewrite opportunity *anywhere* in
  the tree.
- **Idempotence** — running the pass on already-clean input provably returns
  it unchanged. Running peephole twice is never different from running it
  once.

In the proof file these last two are literally two `ensures` lines sitting on
the engine's own signature — the generated Dafny for `peepholeExpr`, with the
hand-written postconditions attached:

```dafny
function peepholeExpr(e: Expr, backend: Backend): Expr
  ensures normE(peepholeExpr(e, backend), backend)          // normalization
  ensures normE(e, backend) ==> peepholeExpr(e, backend) == e  // idempotence
```

All told: [551 proof obligations, zero errors](https://github.com/midspiral/LemmaScript/blob/ls-in-ls/tools/src/peephole.dfy),
checked by Dafny on every CI run of the self-verification suite.

## What the proof caught

The prover will not let you claim "done means done" unless it's true. It
wasn't. Three times.

**Bug one: the scan that stopped too early.** Peephole has a statement-level
rule that merges an adjacent pair of statements — a `let x = m.get(k)`
immediately followed by a `match` on `x` — into one construct. The engine
scanned the statement list for such pairs *once*. But merging a pair shortens
the list and can bring two previously-separated statements next to each
other, exposing a brand-new pair the single scan never sees. The
normalization proof refused to close, and the fix was
[a five-line function](https://github.com/midspiral/LemmaScript/commit/65579d38ec613806324a2b9ed6dab62b6155d86c)
that rescans until a pass merges nothing:

```typescript
/** Pair-scan to a fixed point: a merge can flip a later gate and expose a new
 *  adjacent pair, so rescan until a pass merges nothing. Each merge shortens
 *  the list, so passes are bounded by the list length. */
function pairScanToFix(stmts: Stmt[], backend: Backend): Stmt[] {
  const once = rewriteStmtListPairs(stmts, backend);
  return once.length < stmts.length ? pairScanToFix(once, backend) : once;
}
```

**Bug two: the rooms the cleaner never entered.** The rewriter walks the tree
by recursing into each node's children. Except it didn't — not all of them.
Constructor arguments and the entries of map literals were listed among the
"leaf" cases with nothing inside to visit, so any redex sitting inside them
was silently skipped, forever. Again the normalization claim — *no leftover
rewrite anywhere* — is precisely the kind of statement that flushes this out,
because "anywhere" includes the rooms you forgot existed. The fix is
[two lines in the child-walk](https://github.com/midspiral/LemmaScript/commit/e33b30113593654b5193c2031706365f5136c2da):

```typescript
case "constructor": return { ...e, args: e.args.map(a => peepholeExpr(a, backend)) };
case "mapLiteral":  return { ...e, entries: e.entries.map(en => ({
  key: peepholeExpr(en.key, backend), value: peepholeExpr(en.value, backend) })) };
```

**Bug three: the undocumented assumption.** `while`
loops in the IR carry specification fields (`decreasing`, `doneWith`) that the
rewriter deliberately leaves alone. Before the proof, "deliberately" lived in
somebody's head. The normality predicate forced the decision onto paper: the
proof's definition of "fully rewritten" explicitly *excludes* those fields,
with a comment saying so. Nothing changed in the engine — but an unwritten
assumption became a written, machine-checked one. A lot of proving feels like
this: the prover is a colleague who refuses to accept "oh, that case can't
happen" without a reason.

None of these bugs were caught by the test suite. All three were caught by a
theorem that says nothing more profound than *"done means done."*

## Why termination was the hard part

Termination — "the loop finishes" — sounds like the boring property. It
isn't, because **rewrite rules duplicate things.** The map-get rule copies the receiver `m` into both the `k in m`
test and the `m[k]` lookup. If your measure of progress is "the tree got
smaller," you're stuck — the tree can get *bigger* after a rewrite.

The trick (the proof calls it **active weight**) is to weigh only the part of
the tree that could still be rewritten. Subtrees that are already in normal
form weigh zero. That works because peephole runs bottom-up: by the time a
rule fires, everything it duplicates has already been rewritten — the copies
are normal, so the copies are *weightless*. Every rule
strictly shrinks the weight, weight is a natural number, done. No fuel
counters, no "give up after 100 iterations" guards — the engine had one of
those, and the proof let us delete the concept.

## The second patient: narrow

The second module is much bigger:
[`narrow.ts`](https://github.com/midspiral/LemmaScript/blob/ls-in-ls/tools/src/narrow.ts),
the structural-narrowing pass — 1,086 lines of TypeScript. It's the pass that
understands TypeScript idioms like

```typescript
if (x !== undefined && x.kind === "circle") return x.r;
```

and rewrites them into the explicit option-matching that a prover can reason
about. It's mutually recursive, it re-walks nodes it just constructed, and
some of its rules *copy un-rewritten code* into several branches of their
output. For a termination proof, that's the nightmare configuration: the
peephole trick ("duplicated things are already normal, hence weightless")
doesn't apply, because narrow duplicates things that *haven't been walked
yet*.

Two ideas carried the proof. The first is a lemma the proof file calls the
engine of the whole family — **walk stability**:

> An inert walker result is the untouched input. Walking can remove a redex;
> it can never *arm* one.

In plain terms: the pattern detectors that decide "a rule fires here" only
match plain shapes — variable accesses, field reads, the boolean spines built
over them. But every rule *outputs* a match or a guarded ternary, shapes no
detector reads. So a walk can consume rewrite opportunities but can never
manufacture a new one out of thin air. Without that, a rule could become
firable *because* of the walk, and no measure would survive.

The second idea: for the two rules that duplicate an un-walked branch under a
leftover guard, a constant "charge" in the measure provably cannot work — the
copied node re-bills exactly what the original paid, and the two cancel. The
measure has to be **multiplicative**, scaled by a quantity the rewrite
strictly shrinks (the size of the guard it consumes). Z3 handles nonlinear
arithmetic badly, so every multiplication step is hand-held — the
[design notes](https://github.com/midspiral/LemmaScript/blob/ls-in-ls/DESIGN_LS_IN_LS.md)
record rules of thumb like "a product of two counts is tolerable, a product
of three poisons the solver."

## What *this* proof caught

The measure design itself flushed out real defects — in the proof's first
draft *and* in the engine:

- **A weight on something the walker never visits.** The first measure
  weighed a `someMatch` scrutinee. The walkers only descend into the arms —
  mirroring what `narrow.ts` actually does — so the accounting claimed
  progress in a room nobody enters, and a key equation was simply false.
- **Double-billing conditions.** Several rule-triggering shapes can hold on
  the same condition at once (`!Array.isArray(p)` is both a presence-shaped
  check and an isArray check). Summing a charge per shape charged more than
  any single fired rule could ever pay back; the charges had to be merged
  into one.

One method's verification had
been *timing out*, and the timeouts were being shrugged at — big mutually
recursive files are slow, surely it just needs more time. Splitting that
method up revealed that **the timeout was masking three genuinely unproven
obligations** — two loop invariants and a missing witness — and fixing them
also simplified the engine, because a piece of ghost bookkeeping
(`firstDet`) turned out to be redundant once the real invariant was stated.
*A proof that times out is not a slow proof. It's no proof at all, and it may
be hiding exactly the thing you'd want to know.*

The final state, in the
[completion commit](https://github.com/midspiral/LemmaScript/commit/a1b358e3598d5ea3715bc6648df3f1b62b0e0dcf):
narrow verifies with **499 obligations, zero errors, no timeouts**, and
`grep assume` over the proof file comes back empty. `narrow.ts` itself is
byte-for-byte unchanged — the entire proof lives as roughly 2,500
hand-written lines woven between the ~1,400 lines of Dafny the compiler
generates from its own source, under a merge discipline that forbids ever
editing a generated line.

## What this does and doesn't prove

Termination, normalization, and idempotence are *not* "the
compiler is correct." They say the passes finish, finish completely, and are
stable — they don't yet say the output means the same thing as the input.
And each module currently treats the functions it imports from other modules
as axioms (their contracts are stated, not yet cross-checked); discharging
that boundary is scheduled work, not an oversight — it's written down as the
named trust surface.

Still, these properties are the right place to start, for one empirical
reason: **this is where the compiler's actual bug history lives.**
The bugs we've shipped were never "the theory was wrong" — they were a scan
that stopped early, a child that never got visited, a name that collided.
Boring structural bugs. Termination and normalization proofs are boring
structural truths, and they caught boring structural bugs, in the first two
modules we tried, in a pass small enough to hold in your head.

The scoreboard for the self-run today: five compiler modules in CI with
**1,096 machine-checked obligations** (peephole 551, narrow 499, plus the
type directory, IR, and condition-analysis modules). Next up, per the
[property catalog](https://github.com/midspiral/LemmaScript/blob/ls-in-ls/DESIGN_LS_IN_LS.md):
desugaring completeness — after narrow, no optional-chain node survives —
and the narrow/transform contract, which would replace a runtime throw with
an invariant. One known violation of the eventual "narrowing completeness"
property is already catalogued in the design doc, because a proof effort that
only records its successes is doing PR, not verification.

## Proof as code review

The theorems were almost beside the point.
**Writing the proof is an adversarial code review by a reviewer with infinite
patience and zero charity.** It read a 369-line pass that had been tested,
exercised, and shipped through daily use — and found a scan that stopped too
early, tree nodes nobody visited, and an undocumented assumption. It read the
proof's own first draft and found the accounting errors there too. It refused
to let a timeout stand in for an argument.

We built LemmaScript so that TypeScript codebases could get this kind of
review. It's only fair that the compiler goes through it first.
