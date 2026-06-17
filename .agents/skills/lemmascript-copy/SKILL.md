---
name: lemmascript-copy
description: Copywriting rules and voice for LemmaScript user-facing copy. Use whenever writing or editing marketing/site copy — landing page, section copy, headlines, taglines, CTAs, badges, meta descriptions, social, docs intros. Enforces: no "and hope" phrasing, never strawman testing, and keep HOW (proofs/Lean/Dafny/formal verification) confined to the "How it works" page only.
---

# LemmaScript Copy

Rules for any user-facing words on the LemmaScript site. When you write or edit copy, check it against all three rules below before finishing.

## Positioning (the north star)

LemmaScript **is TypeScript with syntax for contracts** (mirrors "TypeScript is JavaScript with syntax for types").

**Agent-first.** LemmaScript is built for AI agents to use: the agent writes the contracts and iterates until the code is correct by construction. Engineers do **not** have to write LemmaScript themselves — but it's friendly enough to **review at a glance**, and to write by hand when they want to. Lead with the agent workflow; cast the engineer as the reviewer (who can also author). Don't imply engineers must learn or write it.

Copy sells the **WHAT** and the **IMPACT**, never the HOW. Talk about: correctness, contracts, guarantees, trust, code that's correct by construction, zero runtime cost, works on existing code, agent-written, human-reviewable.

**Don't anthropomorphize the agents.** Emira (and any agent) is a tool, not a person — never "she/her/he/him." Use the name "Emira" or "it", or rephrase to focus on the output. Avoid personality verbs that imply a mind ("she thinks", "she decides"); prefer functional ones ("writes", "emits", "produces", "checks").

---

## Rule 1 — Never use "and hope"

Do not use the phrase **"and hope"** (or the "ship it and hope" / "hope it's right" cliché). It's a tired trope and it frames the value negatively.

- ❌ "Stop shipping code and hoping it works."
- ❌ "...so you don't have to write it and hope."
- ✅ "Ship code you can trust."
- ✅ "Know it's correct before it ships."

Lead with the positive outcome (trust, certainty, guarantee), not the absence of hope.

---

## Rule 2 — Never strawman testing

Testing is **complementary and valuable** — do not diminish it. The message is *not* "tests are bad." The message is that LemmaScript builds these functions **correct from the ground up**, so for the behavior covered by a contract, testing that path becomes unnecessary. Testing still does real, important work elsewhere — boundaries, integration, end-to-end, things contracts don't cover.

- ❌ "Tests only catch the handful of cases someone remembered to write."
- ❌ "Tests sample; bugs slip through." (dismissive)
- ❌ Any framing where tests look lazy, weak, or obsolete.
- ✅ "Contracts make a function correct by construction — no test can give you that coverage. Keep your tests for the boundaries and integration where they shine."
- ✅ "LemmaScript and your test suite do different jobs. Contracts guarantee the core logic; tests cover everything around it."

When contrasting with testing, contrast on **scope/role**, not on competence. Respect the craft of testing.

---

## Rule 3 — HOW lives only on the "How it works" page

The **only** page that may use the inner-workings vocabulary is **`/how-it-works`**. Everywhere else (home, integrations, case studies, about, nav, CTAs, meta, social) stays on WHAT/IMPACT.

**Banned outside `/how-it-works`:**
formal verification · verification / verify / verifier · proof / prove / proved / theorem / QED · Lean 4 · Dafny · proof obligations · counterexample · "compile to a model" / backend · "annotate / annotations" (as the mechanism)

**Use instead (everywhere):**
| Don't say (off the how page) | Say |
|---|---|
| verify / verified | check / guaranteed / correct |
| proof / prove | guarantee / proof-of-correctness → "guarantee" |
| counterexample | bug / the exact input that breaks it |
| formal verification | correctness, guaranteed correctness |
| Lean 4 / Dafny | (omit — it's an implementation detail) |
| annotate a function | write a contract / add a contract |
| proof obligations | (omit) |

Note: **"contract"** and the `//@ requires` / `//@ ensures` syntax ARE allowed everywhere — that's the product's surface (the WHAT), not the HOW.

---

## Rule 4 — Correct by construction, not bug-finding

LemmaScript is **not** a bug scanner, linter, or bug-finder. The story is: code is **built correct from the ground up**. With a contract in place, the agent (or developer) iterates until the code is correct — and what surfaces is **correct code**. Never frame the product as "finding" or "catching" bugs in finished code.

- ❌ "Catch the bugs that slip past tests." · "LemmaScript finds the bug." · "Bug found." · "Watch it catch the bug."
- ✅ "Code that's correct by construction." · "The agent iterates until it's correct — and only correct code ships." · "What surfaces is correct code."

The in-progress / failing state is **"not correct yet"** — a step in the loop toward correct — never "a bug we found." The end state is correct code, not a bug report.

---

## Quick checklist before shipping copy

1. No "and hope" (or hope-cliché) anywhere.
2. Testing is treated with respect — contrasted on role, never strawmanned.
3. No HOW terms unless this is the `/how-it-works` page.
4. Framed as correct-by-construction, not bug-finding ("not correct yet", never "bug found").
5. Agent-first: the agent writes contracts; engineers review (and may author). Never imply engineers must write LemmaScript.
6. Reads as WHAT + IMPACT (trust, correctness, code you can rely on), not mechanism.
