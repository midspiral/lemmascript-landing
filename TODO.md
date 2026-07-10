# LemmaScript Landing — Full Audit

Review only — no code was changed. Findings are grouped by severity. Each item
lists `file:line` and a suggested fix. Copy rules referenced are from
`.claude/skills/lemmascript-copy/SKILL.md`.

Audited: every page (`src/pages/**`), components (`Nav`, `Footer`, `Playground`,
`Analytics`, `BaseLayout`), styles (`tokens`, `base`, `components`), and
`astro.config.mjs`. External repos/files/domains were checked live (all resolve).

Legend: `[ ]` open · severity P0 (blocker) → P4 (confirm).

---

## P0 — Blockers (the site does not build)

- [x] **RESOLVED — `ecosystem.astro` smart-quote string delimiters.** Was failing the build
  (`esbuild: Unexpected "'"`). Fixed in the IDE; no smart-quote delimiters remain anywhere in
  `src/`, and `npm run build` now completes (20 pages, sitemap generated).

---

## P1 — Copy-rule violations / tensions

- [ ] **Homepage "Caught in the act" reads as bug-finding (Rule 4).** `index.astro:57–101`.
  Kicker `// caught in the act`, h2 "LemmaScript's contract **caught it**", body "The agent
  wrote **buggy** TypeScript". Rule 4 says never frame the product as catching/finding bugs;
  the in-progress state is "not correct yet," not "a bug." *Note: this section was built
  intentionally — flagging the tension for your call.* Suggested reframe: "// the loop, in
  action" / "The agent's first version wasn't correct yet — the contract said so — and it
  corrected the code before surfacing it."
- [ ] **"Verified in place" caption (Rule 3 — "verified" banned off `/how-it-works`).**
  `src/data/caseStudies.ts` (hono `snippet.caption`). → "Checked in place" or "Guaranteed
  in place." (The rest of the case-study copy correctly uses "guaranteed.")
- [ ] **`annotations.astro:8` "proving the code terminates" (Rule 3 — "prove").**
  → "guaranteeing the code terminates." Also `:7` "The engine uses it to reason about
  unbounded loops" leans mechanism/HOW — consider softening.
- [ ] **Page/nav name "Annotations" vs the term ban (Rule 3 lists "annotations as the
  mechanism").** Nav + `annotations.astro`. The preferred product word is "contract."
  Consider renaming the page/nav to "Contract reference." (Tension — your call; the `//@`
  syntax and "contract" are allowed everywhere.)
- [ ] **`install.astro:61` "the backends that power it" (Rule 3 — "backend").**
  → "the engines that power it."
- [ ] **`BaseLayout.astro:23` default meta description says "Formal verification for
  TypeScript" (Rule 3 — meta is in-scope).** This is the OG/Twitter fallback. → WHAT/IMPACT,
  e.g. "Contracts for TypeScript — code that's correct by construction, reviewable at a
  glance." Also `:38` `<meta keywords>` lists "formal verification, Lean 4, Dafny, proof"
  (HOW terms; near-zero SEO value) — consider trimming.
- [ ] **Borderline testing strawman (Rule 2).** `solutions.astro:19` "Output that's
  guaranteed correct — **not just tested**." and `index.astro:185` "Famously easy to get
  subtly wrong — **and a pain to test**." Both nudge testing toward "lesser." Re-contrast on
  scope/role, not adequacy.
- [ ] **`plugins/guard.astro:118` "where a real bug actually hides" (Rule 4, mild).**
  Consider reframing toward the composition guarantee rather than where bugs hide.

---

## P2 — Bugs & rendering

- [x] **FIXED — undefined design tokens collapsed properties to `0`.** `--sp-5` and `--sp-10`
  were referenced but didn't exist (the scale skipped them), so those margins/padding/gaps
  silently computed to `0`. Affected `solutions/{agents,algorithms,security,web-apps}.astro`
  (`.two-col h2` margin, `.ex-stats` margin-bottom) and `case-studies/[slug].astro`
  (`.cs-meta` margin, `.cs-cve` gap + padding — the hono CVE cards had no inner padding).
  Fix applied: defined `--sp-5: 20px;` and `--sp-10: 40px;` in `tokens.css` (matching the 4px
  grid / clear author intent) — resolves all 10 sites in one place. (`--sp-20` from the old
  single-file `solutions.astro` is moot; that file was replaced by the `solutions/*` sub-routes.)
- [ ] **Hero code comment is paraphrased, not verbatim.** `index.astro:23`. The shown
  line "43" (`// keep only the requests still inside the time window`) is a paraphrase; the
  real `core.verified.ts` line 43 is a different comment. The function body (lines 44–57)
  matches the source exactly. Either show the verbatim comment or drop the `43` label.
- [ ] **Hero anchor vs displayed range.** `index.astro:22` links `#L38-L57` but the block
  displays lines 43–57. Harmless (anchor includes the comment block) but slightly off. (Low.)
- [ ] **Wrapped `//@` clauses split a single rule across lines — invalid as real LemmaScript,
  a website-only transcription bug (not a real-code issue).** `//@` annotations are one
  complete statement per line; the toolchain doesn't concatenate a line onto the next. Real
  shipped code confirms this — `hono-lemmascript/src/utils/cookie.ts` keeps even its longest
  `ensures` (a nested `exists(...)` clause far longer than anything wrapped on this site) on
  one unbroken line. Four snippets wrap anyway, which silently truncates the rule the tool
  would actually read (e.g. an `X ==> Y` implication gets read as just `X`, an unconditional
  and wrong postcondition):
  - `solutions/agents.astro:40-41,44-45` ("Representative" example, not a repo excerpt)
  - `solutions/web-apps.astro` (`ensures \result === (` / `0 <= idx...` / `)` — illustrative,
    not tied to a specific line in `quota-lemmascript`)
  - `solutions/security.astro` (claims to excerpt the real `cookie.ts` — the real file doesn't
    wrap this clause)
  - `src/data/caseStudies.ts` (hono case study, same cookie snippet, same real-file mismatch)
  Fix: collapse each back onto a single line, matching the real convention, even where that
  makes for a long line.

---

## P3 — Consistency & polish

- [ ] **CLI name is inconsistent.** `npm install -D lemmascript` + `npx lemmascript check`
  (`index.astro:229,232`, `install.astro:27,49`) vs `lsc` — `lsc plugin add guard`, `lsc guard
  src/core.ts`, `lsc check` (`plugins/guard.astro:138,141,142`, `ecosystem.astro:56` "the `lsc`
  compiler") vs `lemmascript check` (`ecosystem.astro:31`). Three different invocation stories
  for what's presumably one binary. Decide the canonical binary/invocation and use it
  everywhere.
- [ ] **"Guaranteed" vs "Verified" badge label.** Most pages use **Guaranteed**
  (home, annotations, playground); `how-it-works.astro:66` uses **Verified** on the output
  badge. "Verified" is allowed only there, but standardize for visual consistency.
- [ ] **"Docs" appears twice in the nav.** `Nav.astro:8` (inside Product dropdown) and
  `Nav.astro:44` (standalone top-level). Redundant — drop one.
- [ ] **Footer omits "Solutions."** `Footer.astro` Product column lacks `/solutions`, though
  it's in the nav Product dropdown. Add for parity. (Also "Documentation" in footer vs "Docs"
  in nav — minor label drift.)
- [ ] **guard repo link casing.** `plugins/guard.astro:68` → `github.com/midspiral/LemmaScript-guard`;
  canonical repo is `lemmascript-guard` (works via redirect). Use canonical casing.
- [ ] **Playground "charge" tab note is mislabeled.** `Playground.astro:9` note "No
  overbooking" — `charge` is about not overdrawing a balance, not overbooking. → e.g.
  "Never goes negative."
- [ ] **Added `//@ contract` lines don't exist in the linked real source.** The "real code ↗"
  snippets (`index.astro` hero `pruneWindow`, `solutions/web-apps.astro` `hasRoom`) and the
  case-study excerpts (`caseStudies.ts` — `trimCookieWhitespace`, `hasRoom`) now show a
  `//@ contract` line for narrative consistency with the rest of the site, but the actual
  GitHub files behind their "View on GitHub ↗" / `href` links don't contain that line. Either
  add the contract to the upstream repos, or note the excerpt is illustrative.

---

## P4 — Content / claims to confirm (accuracy)

- [ ] **`pruneWindow`'s contract under-specifies "keeps only" (upstream code fix, not the
  site).** `hono-rate-limiter-with-lemmascript/src/core.verified.ts` — the site's hero
  snippet (`index.astro:23`) is a verbatim, faithful copy of the real contract, so this isn't
  a site-fidelity bug. The real `ensures` clauses only prove "no false positives" (every
  surviving entry is genuinely in-window) — they don't prove "no false negatives" (every
  in-window entry of `log` survives) or that `\result` is an order-preserving subsequence of
  `log`. Concretely, an implementation that always `return []` would satisfy both existing
  `ensures` clauses. For a rate limiter this is a real asymmetric risk: a regression that
  silently drops valid entries (under-counting usage) would pass the proof untouched. Fix in
  the upstream repo by adding a completeness clause (e.g. every `log[k]` that's in-window
  appears in `\result`, or a proper order-preserving-subsequence characterization), then the
  site snippet just needs to be re-synced to match.
- [ ] **IMPORTANT — `number` is modeled as `int` by default (SPEC.md §2.4), creating a real gap
  between "proven" and "runtime-safe" for money/count values (upstream toolchain, not a site
  bug).** Example: `index.astro`'s `allocate`/`allocateNaive` — `//@ requires total >= 0`, with
  `total: number`. In the verification model, `total` is already an integer by construction
  (the default `number` → `int` mapping), so the proof of `sum(\result) === total` is airtight
  *within that model*. But at actual JS runtime, `number` is IEEE754 float — nothing stops a
  caller from passing `allocate(10.5, [1,1,1])` for real. That call is outside the domain the
  proof ever reasoned about, and the real upstream `allocate.ts` has no runtime guard
  (`Number.isInteger` or otherwise) to reject it before the "guaranteed correct" logic runs.
  This isn't specific to `allocate` — it's a structural property of the whole `number`→`int`
  convention, so it likely affects every money/count-typed function across every repo. Worth
  resolving deliberately (either a compiler-inserted runtime check at verified-function
  boundaries, or a documented caller obligation) rather than leaving as an implicit assumption,
  since "guaranteed correct for every input" is the site's core claim and this is the kind of
  gap that undermines it if a caller doesn't know to avoid non-integer `number`s.
- [ ] **Two backends?** `how-it-works.astro` claims **Lean 4 and Dafny** ("Choose the proof
  system"). All four case studies use **Dafny only**. Confirm Lean 4 is actually available, or
  adjust the framing.
- [ ] **npm package ownership.** `registry.npmjs.org/lemmascript` returns 200, but confirm
  it's *midspiral's* package (not a name-squat) and that `npx lemmascript check` is the real
  command. (`lsc` on npm 200 is an unrelated historical package.)
- [ ] **guard numbers.** `plugins/guard.astro:119` perf "≈1.0–1.5×, tens to hundreds of
  nanoseconds" and `:117` "13 functions" (eventab) — confirm.
- [ ] **Footer version string.** `Footer.astro:62` "v0.1 · Tech Preview" — confirm current.
- [ ] **Ecosystem status labels.** Available/Tech preview/Planned for VS Code, Claude Code,
  GitHub Actions, Cursor/Windsurf, MCP, etc. — confirm each is accurate.
- [ ] **`claimcheck` plugin** (ecosystem) is "Available" but has no page (`href: null`).
  Confirm availability; add a page or adjust status.
- [ ] **Emira waitlist goes nowhere.** `emira.astro:110` — submit shows a fake success
  message client-side only; there's a `TODO: wire to a real waitlist endpoint`. Wire it
  before driving signups, or the addresses are discarded.

---

## Accessibility

- [ ] **No default social-share image.** `BaseLayout.astro:43,47` only emit `og:image` /
  `twitter:image` when an `image` prop is passed — no page passes one. Link previews will be
  imageless; `twitter:card` is `summary` (not `summary_large_image`). Add a default share image.
- [ ] **Analytics with no consent.** `Analytics.astro` loads Google Analytics
  (`G-N1WYMB72XF`) unconditionally on every page. Confirm the property ID is correct and
  decide on a consent/cookie banner (GDPR).
- [ ] **Playground tab ARIA incomplete.** `Playground.astro` tabs have `role="tab"` but the
  output isn't `role="tabpanel"` and there's no `aria-controls` linking tab→panel.
  (`aria-live="polite"` on the output is good.)
- [ ] **Confirm `--text-faint` (#75869C) meets AA** at the caption/small sizes it's used for
  (line numbers, disclaimers, footer). Likely borderline.
- [ ] **Nav dropdown** is hover/focus-only; the Product button has no click/keyboard toggle
  (works via `focus-within` when tabbing). Consider a click handler for touch devices.

---

## Dead code / cleanup  — ✅ DONE (this pass)

- [x] **Removed commented-out blocks in `index.astro`:** hero lede, hero trust badges, and the
  entire "BUILT FOR AGENTS" section. *(The removed copy is recoverable from git if wanted.)*
  ⚠️ Open question stands: the hero now has **no descriptive sentence** (eyebrow → title →
  code → buttons). Confirm that's intended.
- [x] **Removed dead CSS** in `index.astro`: `.hero-lede(+strong)`, `.hero-trust`,
  `.trust-note`, `.example-art`, `.narrow` helpers, the duplicate scoped `.center`
  (global exists in `components.css`), `.contrast`, `.ct-*`, plus the orphaned descendant
  rules `.two-col .section-desc strong` and `.two-col .link-arrow`.
- [x] **Removed dead CSS in `Playground.astro`:** `.pg-backend` / `.pg-be` / `.pg-be.active`
  (backend toggle no longer in markup) and `.pg-proof` / `.pg-ok .pg-proof` (unused by `render()`).
- [x] **Removed leftover "traffic-light" dots markup** (hidden via `display:none`) from the
  `index.astro` terminal and `annotations.astro` code bars, and deleted the now-dead
  `.code-bar .dots` rule in `components.css`. (Playground's visible editor-bar dots kept.)
- [x] **`/integrations` → `/ecosystem` redirect** verified — nothing links to `/integrations`.
- A full-tree scan found **no other defined-but-unused scoped classes**.

**Left intentionally (not dead — would change rendering / co-location is the Astro norm):**
duplicate `.inline` (plain in annotations/try/install vs chip variant in ecosystem/guard),
and parallel `.two-col` / `.why` definitions across pages. Say the word to consolidate these
into `components.css`.

---

## Verified OK (no action)

- All referenced repos, files, and external domains resolve (200): LemmaScript,
  lemmascript-guard, hono-rate-limiter-with-lemmascript, eventab-lemmascript, the four case
  study repos; `examples/binarySearch.ts`, `allocate.ts`, `allocateNaive.ts`,
  `core.verified.ts`; docs.lemmascript.org, lemmascript.org, midspiral.com; CNAME = lemmascript.org.
- `base.css` has strong a11y foundations: skip-nav, `:focus-visible`, `prefers-reduced-motion`,
  mobile heading scale, `overflow-x` guard.
- `how-it-works.astro` correctly uses HOW vocabulary (the one page allowed to).
- Playground result copy ("Not correct yet", "Guaranteed", "correct by construction") is
  exemplary per the copy rules.
- All internal nav/footer links point to pages that exist.
