---
name: lemmascript-copy
description: Copywriting rules and voice for LemmaScript user-facing copy. Use whenever writing or editing site copy — landing/marketing pages, section copy, headlines, taglines, CTAs, badges, meta descriptions, social, docs intros, and blog posts. Enforces: no "and hope" phrasing, never strawman testing, correct-by-construction over bug-finding, and HOW vocabulary (proofs/Lean/Dafny/formal verification) kept off marketing surfaces while staying fully open on the blog and "How it works".
---

# LemmaScript Copy

Rules for any user-facing words on the LemmaScript site. When you write or edit copy, check it against the rules below before finishing.

## First: which register are you writing in?

The site has two registers, and only one of them is constrained on mechanism.

**Marketing surface** — the landing page, `/install`, `/ecosystem`, `/emira`, `/contribute`, `/wall-of-love`, `/changelog`, nav labels, CTAs, badges, meta descriptions, social, `llms.txt`, and the *chrome* of the blog (its index page headline and lede, post CTAs, the nav entry). Here the reader is deciding whether LemmaScript is for them. **All rules apply, including Rule 3.**

**Technical surface** — `/how-it-works` and **blog posts**. Here the reader has already opted in and wants the actual engineering. **Rule 3 does not apply** — say Dafny, say proof, say verification, show the generated code. Rules 1, 2 and 4, the positioning, and the no-anthropomorphizing line still hold.

When a page mixes the two — a blog post's title and description are read on the index and in search results, a landing section that goes one level deep — write the body in the technical register and keep the surrounding chrome (headline, lede, CTA, meta description) on WHAT/IMPACT.

## Positioning (the north star)

LemmaScript **is TypeScript with syntax for contracts** (mirrors "TypeScript is JavaScript with syntax for types").

**Agent-first.** LemmaScript is built for AI agents to use: the agent writes the contracts and iterates until the code is correct by construction. Engineers do **not** have to write LemmaScript themselves — but it's friendly enough to **review at a glance**, and to write by hand when they want to. Lead with the agent workflow; cast the engineer as the reviewer (who can also author). Don't imply engineers must learn or write it.

Marketing copy sells the **WHAT** and the **IMPACT**, never the HOW. Talk about: correctness, contracts, guarantees, trust, code that's correct by construction, zero runtime cost, works on existing code, agent-written, human-reviewable. (The blog and `/how-it-works` sell the HOW too — see Rule 3.)

**Don't anthropomorphize the agents.** Emira (and any agent) is a tool, not a person — never "she/her/he/him." Use the name "Emira" or "it", or rephrase to focus on the output. Avoid personality verbs that imply a mind ("she thinks", "she decides"); prefer functional ones ("writes", "emits", "produces", "checks").

---

## Rule 1 — Never use "and hope"

**Applies everywhere, both registers.**

Do not use the phrase **"and hope"** (or the "ship it and hope" / "hope it's right" cliché). It's a tired trope and it frames the value negatively.

- ❌ "Stop shipping code and hoping it works."
- ❌ "...so you don't have to write it and hope."
- ✅ "Ship code you can trust."
- ✅ "Know it's correct before it ships."

Lead with the positive outcome (trust, certainty, guarantee), not the absence of hope.

---

## Rule 2 — Never strawman testing

**Applies everywhere, both registers.**

Testing is **complementary and valuable** — do not diminish it. The message is *not* "tests are bad." The message is that LemmaScript builds these functions **correct from the ground up**, so for the behavior covered by a contract, testing that path becomes unnecessary. Testing still does real, important work elsewhere — boundaries, integration, end-to-end, things contracts don't cover.

- ❌ "Tests only catch the handful of cases someone remembered to write."
- ❌ "Tests sample; bugs slip through." (dismissive)
- ❌ Any framing where tests look lazy, weak, or obsolete.
- ✅ "Contracts make a function correct by construction — no test can give you that coverage. Keep your tests for the boundaries and integration where they shine."
- ✅ "LemmaScript and your test suite do different jobs. Contracts guarantee the core logic; tests cover everything around it."

When contrasting with testing, contrast on **scope/role**, not on competence. Respect the craft of testing.

---

## Rule 3 — HOW stays off the marketing surface (but belongs on the blog)

**Applies to: marketing surface only.** On `/how-it-works` and in blog posts, ignore this rule entirely.

On marketing pages, the inner-workings vocabulary is banned. The reader is deciding whether this is for them; mechanism at that moment is noise, and it makes the product sound like a research project instead of something you install.

**Banned on the marketing surface:**
formal verification · verification / verify / verifier · proof / prove / proved / theorem / QED · Lean 4 · Dafny · proof obligations · counterexample · "compile to a model" / backend · "annotate / annotations" (as the mechanism)

**Use instead:**
| Don't say (marketing surface) | Say |
|---|---|
| verify / verified | check / guaranteed / correct |
| proof / prove | guarantee / proof-of-correctness → "guarantee" |
| counterexample | bug / the exact input that breaks it |
| formal verification | correctness, guaranteed correctness |
| Lean 4 / Dafny | (omit — it's an implementation detail) |
| annotate a function | write a contract / add a contract |
| proof obligations | (omit) |

Note: **"contract"** and the `//@ requires` / `//@ ensures` syntax ARE allowed everywhere — that's the product's surface (the WHAT), not the HOW.

### On the blog: go deep, on purpose

The blog is where the HOW earns its keep. A post that gestures at mechanism without showing it is worse than no post. So:

- **Name the real things.** Dafny, Lean, the shallow embedding, the `extract → resolve → narrow → transform → emit` pipeline, the generated `.dfy.gen` stub, the pass that owns narrowing. Precision is the point.
- **Show real code.** Real TypeScript with real `//@` contracts, and the real generated output next to it. Don't sanitize it into pseudocode.
- **State the honest edges.** What the toolchain can't narrow, where you have to bind first, what collapses to an opaque type. Naming a limitation is credibility on this surface, not a weakness — it's the opposite of the marketing register, where you lead with the outcome.
- **Explain the vocabulary once, then use it.** Assume a strong engineer who has not read a verification paper. Define "shallow embedding" the first time; don't keep apologizing for it.

Still true on the blog: contracts are the product's surface, correctness is the payoff, agents write the contracts, and testing is a respected sibling (Rules 1, 2, 4 below).

**The one place a blog post touches the marketing surface** is its own frontmatter `title` and `description` — those render on the index, in search results, and in the RSS feed. HOW terms are fine in a post title when they're the actual subject ("LemmaScript as a shallow embedding of TypeScript in Dafny" is a good title), but the `description` should still land a reason to read, not just a mechanism dump.

---

## Rule 4 — Correct by construction, not bug-finding

**Applies everywhere, both registers** — it's a claim about what the product *is*, not a vocabulary restriction.

LemmaScript is **not** a bug scanner, linter, or bug-finder. The story is: code is **built correct from the ground up**. With a contract in place, the agent (or developer) iterates until the code is correct — and what surfaces is **correct code**. Never frame the product as "finding" or "catching" bugs in finished code.

- ❌ "Catch the bugs that slip past tests." · "LemmaScript finds the bug." · "Bug found." · "Watch it catch the bug."
- ✅ "Code that's correct by construction." · "The agent iterates until it's correct — and only correct code ships." · "What surfaces is correct code."

The in-progress / failing state is **"not correct yet"** — a step in the loop toward correct — never "a bug we found." The end state is correct code, not a bug report.

On the blog you can describe that intermediate state in full technical detail — the clause that doesn't discharge, the input the checker hands back, the proof hint that was missing. That's the loop working, and it's exactly the sort of thing a post should show. What stays out, on every surface, is the framing that LemmaScript's *job* is to find bugs in code someone already wrote.

---

## Quick checklist before shipping copy

**Every surface:**

1. No "and hope" (or hope-cliché) anywhere.
2. Testing is treated with respect — contrasted on role, never strawmanned.
3. Framed as correct-by-construction, not bug-finding ("not correct yet", never "bug found").
4. Agent-first: the agent writes contracts; engineers review (and may author). Never imply engineers must write LemmaScript.
5. Agents aren't people — no "she/her," no verbs that imply a mind.

**Marketing surface, additionally:**

6. No HOW terms (Rule 3 table).
7. Reads as WHAT + IMPACT (trust, correctness, code you can rely on), not mechanism.

**Blog post, additionally:**

8. The mechanism is actually shown — real code, real generated output, the real names of things — not gestured at.
9. The limitations are stated where they're relevant.
10. Title and `description` still give a reason to read, since they render on the index and in search.
