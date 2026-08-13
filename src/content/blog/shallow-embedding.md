---
title: 'Shallow embedding: why LemmaScript translates TypeScript straight into Dafny'
date: 2026-08-12
description: >-
  Most verification tools lower your program into logic formulas for a solver.
  LemmaScript turns it into readable, high-level Dafny instead. It's an unconventional
  trade made on purpose, because the proofs are written by LLMs. 
authors: ['Nada Amin', 'Fernanda Graciolli']
tags: ['internals', 'design']
published: true
---

There's a standard way to build a verification tool, and LemmaScript doesn't use it. This post explains what we do instead, why, and the tradeoffs we contend with. 

## The two conventional routes of formal verification

Suppose you want to prove facts about a program — not test it on some inputs, but establish that a property holds for *every* input. There are two well-trodden roads.

**Road one: compile the program into logic.** The tool walks your code and generates *verification conditions*: a pile of logic formulas, one for each thing that must be true (this index is in bounds, this loop makes progress, this postcondition holds on every path). Then it hands the pile to an SMT solver, a program that grinds through logic formulas and answers "always true" or "here's a case where it isn't." [Dafny](https://dafny.org/), the verification language LemmaScript builds on, works this way itself, with a layer of indirection: Dafny compiles to an intermediate language called [Boogie](https://github.com/boogie-org/boogie), and Boogie produces the verification conditions. The process is semi-automated; when the solver gets stuck, a human guides it with assertions and hints in the source.

**Road two: embed the program in a proof assistant.** In Lean or Rocq you can do a *deep embedding*: represent the program as a piece of data (a syntax tree), define an interpreter that says what that data means, and prove theorems about the interpreter's behavior. You get the full proof machinery of the proof assistant, at the cost of working one level removed: every theorem is about an encoded representation of your program, not the program itself.

LemmaScript doesn't take either of these two routes.

## What we do instead

LemmaScript translates your TypeScript into Dafny *source code* — construct for construct. While a pure function remains a function, an impure function becomes a Dafny `method`. An `if` becomes an `if`. A `while` becomes a `while`. A `number` becomes an `int`. The `//@ requires` and `//@ ensures` annotations in your comments become Dafny's `requires` and `ensures` clauses. The output is a Dafny program a person could have written, and Dafny's own machinery (through Boogie, through the SMT solver) does the proving. The Lean backend has the same shape: it targets [Velvet](https://github.com/verse-lab/velvet), a Dafny-flavored verification layer embedded in Lean 4, rather than raw Lean.

The technical name for this is a *shallow embedding*: instead of representing TypeScript as data inside the prover (that's deep embedding), each TypeScript construct is mapped onto the prover's *native* construct that means the same thing. There is no interpreter and no encoded syntax tree. The meaning of your program is carried by Dafny's own semantics, because each piece of the translation *is* the corresponding piece of Dafny.

Here's an example of TypeScript and Dafny, side by side, from [`binarySearch.ts`](https://github.com/midspiral/LemmaScript/blob/main/examples/binarySearch.ts):

TypeScript:
```typescript
let lo = 0;
let hi = arr.length - 1;
let result = -1;
while (lo <= hi) {
  //@ decreases (hi - lo + 1).toNat
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) { result = mid; break; }
  else if (arr[mid] < target) { lo = mid + 1; }
  else { hi = mid - 1; }
}
```

Dafny:

```dafny
var lo := 0;
var hi := (|arr| - 1);
var result := -1;
while (lo <= hi)
  decreases ((hi - lo) + 1)
{
  var mid := JSFloorDiv((lo + hi), 2);
  if (arr[mid] == target) { result := mid; break; }
  else if (arr[mid] < target) { lo := (mid + 1); }
  else { hi := (mid - 1); }
}
```
*See below for caveat regarding numbers*

This is a mirror, line for line. Which raises the obvious question: if Dafny compiles to Boogie anyway, why doesn't LemmaScript skip the middleman and generate Boogie, or verification conditions, directly? 

We put that question to Rustan Leino, Dafny's designer. The short answer: at the level LemmaScript operates, there's no reason to go lower. Targeting high-level Dafny saves us an enormous amount of backend work. It also causes us a specific kind of trouble in exchange, as we'll get to later in the post. That exchange is the whole story of this design.

The important thing to understand about the design is that it's anchored on the question: "who writes the proofs?"

## The LLM is the proof engine

In a conventional verifier, the automation is the SMT solver, and when the solver can't finish on its own, a human supplies the missing steps. When we set out to bring formal verification into mainstream development, one thing had to remain true across all of our endeavors: the human should not need to touch anything formal, ever. In LemmaScript, an LLM is responsible for supplying the proofs. The generated Dafny arrives with holes (proof obligations the solver can't discharge unaided), and an AI agent iterates on it, adding invariants, lemmas, and hints until everything checks. 

Once you decide an LLM is doing that work, the choice of target language is no longer an implementation detail, now it's the most important interface in the system. LLMs are pretty good at Dafny: there's a real corpus of human-written Dafny in the world, and models have learned the idioms, the proof style, and can use these techniques similarly to the way an experienced user would coax the verifier. There is no comparable corpus of Boogie, and nobody hand-writes verification conditions. A lower-level target would be more "correct" as compiler engineering but much worse as a prompt.

So the embedding is shallow to keep the generated Dafny inside the model's competence: everything the model knows about proving things in Dafny, it learned from human-written Dafny, so the closer our output stays to that, the more of the model's proving ability we get to use. 

There are costs associated with shallow embedding which we must pay in order to satisfy the agent-first approach. 

## Cost one: the translation must type-check twice

A shallow translation has a hard constraint: whatever comes out the other side must be a *valid Dafny program*. Your TypeScript already type-checks under `tsc`; the translation of it must also type-check under Dafny. That is a genuinely hard ask, because the two type systems sometimes disagree.

TypeScript's types are flexible in ways Dafny's are not. The sharpest example is union types. In TypeScript you can say a value is `string | Part[]` (no name, no tag, no declaration) and then discriminate it anywhere with a runtime check, after which the compiler *narrows* the type along that branch:

```typescript
function partsOrEmpty(content: string | Part[]): Part[] {
  //@ ensures Array.isArray(content) ==> \result.length === content.length
  //@ ensures !Array.isArray(content) ==> \result.length === 0
  if (Array.isArray(content)) {
    return content;   // here, content IS Part[]
  }
  return [];
}
```

Dafny has no untagged unions and no flow-based narrowing. Its equivalent is a `datatype` (named, tagged, every case declared up front), and you refine a value by pattern-matching, which introduces a *new* binding for the payload. So the toolchain has to synthesize what TypeScript left implicit ([the real generated output](https://github.com/midspiral/LemmaScript/blob/main/examples/contentDispatch.dfy.gen)):

```dafny
datatype ArrayOf_Part_Or_string = ArrayBranch(arr: seq<Part>) | NonArrayBranch(val: string)

function partsOrEmpty(content: ArrayOf_Part_Or_string): seq<Part>
{
  match content {
    case ArrayBranch(i_content_arr) => i_content_arr
    case NonArrayBranch(i_content_val) => []
  }
}
```

The `if` became a `match`; the narrowed `content` became a fresh binder, `i_content_arr`. Every TypeScript way of discriminating a union (`Array.isArray`, `typeof`, `x.kind === "..."`, `"key" in x`, `!== undefined`) has to be recognized and rebuilt as a match on a synthesized tag.

Two admissions are necessary here. First, we don't cover everything yet: TypeScript's union idioms run deep, and some can't be discriminated; those collapse to a single opaque type that can be passed through but never inspected. Second, when we chose the shallow embedding, we did not anticipate how much of the toolchain's total complexity would end up living right here in the narrowing. Narrowing turned out to be the one construct with no direct image in Dafny, and it eventually earned [its own dedicated compiler pass](https://github.com/midspiral/LemmaScript/blob/main/tools/src/transform.ts).

## Cost two: the numbers are idealized

JavaScript numbers are IEEE 754 doubles: quirky, and unusual for a verification target. Above 2⁵³ they lose precision: they can round, hit `Infinity`, produce `NaN`. Dafny's `int` is a mathematical integer: unbounded, exact.

Today, LemmaScript maps `number` to `int` and verifies against ideal integers. That means the guarantees are relative to idealized arithmetic: floating-point precision loss is not modeled. We're upfront about this [here](https://docs.lemmascript.org/spec/#9-not-yet-supported). 

The idealization is a choice about *values*, not about *operations*. Where JavaScript's arithmetic has a definite shape, the translation keeps it. `Math.floor((lo + hi) / 2)` does not become Dafny's `/`, which behaves differently on negative operands; it becomes a generated helper that computes exactly what JavaScript computes:

```dafny
function JSFloorDiv(a: int, b: int): int
  requires b != 0
{
  if b > 0 then (if a >= 0 then a / b else -((-a - 1) / b) - 1)
  else (if a <= 0 then (-a) / (-b) else -((a - 1) / (-b)) - 1)
}
```

Fully faithful number semantics is future work we've scoped deliberately: likely an opt-in mode for programs that need it, plus warnings from crosscheck, a companion tool we're now testing, for the places where the idealization could matter.

## Cost three: the proofs live inside the generated code

Because the proof engine is an LLM editing Dafny, the proofs end up *in* the generated file. That forces a mechanism: for each source file, `lsc` emits a `foo.dfy.gen` (the pure translation, regeneratable at any time), and the proof work happens in `foo.dfy`, which must contain every line of the `.gen` file plus additions. Regenerating never clobbers proofs; a checker enforces that nothing generated was dropped or altered.

To be blunt, this is a hacky corner of the design. You could imagine an architecture where proofs live somewhere more separate. For example, the Lean backend, where Velvet keeps definitions and proofs in different files, is closer to an ideal design. The line-additive discipline also produces some clunk. Sometimes the natural place for a derived fact is an `ensures` on the function itself, but since the generated clauses must stay exactly as generated, the fact goes into an auxiliary lemma instead. You can see it in the generated output above, where the postconditions ride alongside the function rather than on it:

```dafny
lemma partsOrEmpty_ensures(content: ArrayOf_Part_Or_string)
  ensures (match content { case ArrayBranch(i_content_arr) => (|partsOrEmpty(content)| == |i_content_arr|) case _ => true })
  ensures (match content { case NonArrayBranch(i_content_val) => (|partsOrEmpty(content)| == 0) case _ => true })
```

Here the LLM-centric design pays us back: boilerplate costs the model nothing, so clunky plumbing is a price we'll accept — what we won't accept is tangled reasoning, which degrades its proofs.

## Where the trade has landed

The costs:

- Not all of TypeScript's type system is covered: untagged unions and flow narrowing have to be reconstructed, and some idioms don't make it.
- Numbers are idealized: verification is against mathematical integers, not IEEE 754 doubles, until faithful-numbers mode lands.
- Proofs live inside the generated code: the `.dfy.gen`/`.dfy` line-additive mechanism is more entangled than we'd like.

The advantages:

- No compiler backend to build or maintain: Dafny's whole stack (Boogie, the SMT solver, decades of automation engineering) works for us for free, and the solver discharges most obligations before the agent ever gets involved.
- The generated Dafny stays inside the model's competence, so the agent can actually discharge the remaining proofs.
- The proof obligations are about the real computation, not an interpreter running over an encoded syntax tree, so they're as direct as Dafny's own.
- Your spec vocabulary is just more TypeScript: `sorted(arr)` in a contract is an ordinary pure function you wrote, translated like everything else.
- The annotations are comments: invisible to `tsc` and the bundler, zero runtime cost, so it drops onto existing codebases without changing what ships.
- One annotated source retargets to more than one prover: the same construct-for-construct translation drives both the Dafny backend and the Lean (Velvet) backend.

In practice: greenfield code, written with contracts from the start, works very well. Brownfield, pointing the toolchain at existing TypeScript, mostly works, with the type-system gaps above being exactly where it strains.

A shallow embedding of TypeScript in Dafny, with an LLM discharging the proof obligations, is not the obvious way to build a verification tool, and we suspect some verification folks would raise an eyebrow at it. It wasn't an obvious trade when we made it either. But for what we're building — agents that produce code that's correct by construction, in a language agents are already fluent in — it has been the right one.

We think the approach could work well for other typed languages, to add a twin verification toolchain.
We are experimenting with differential testing to ensure the source and target of the verification toolchains have same semantics.