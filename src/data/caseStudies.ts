// ============================================================
//  CASE STUDY CONTENT
//  Real projects, real repos. Copy is WHAT/IMPACT only — the
//  inner workings (and the proof artifacts) live in the repos,
//  never on these pages. See .claude/skills/lemmascript-copy.
// ============================================================

export interface Guarantee {
  title: string
  body: string
}

export interface Cve {
  id: string
  href: string
  summary: string
}

export interface Snippet {
  file: string
  href: string
  caption: string
  code: string
}

export interface Stat {
  value: string
  label: string
}

export interface CaseStudy {
  slug: string
  kind: 'Greenfield' | 'Brownfield'
  repoName: string
  repo: string
  diff?: string
  upstream?: { label: string; href: string }
  title: string
  tagline: string
  stats: Stat[]
  stakes: string
  cves?: Cve[]
  guaranteesHead: string
  guarantees: Guarantee[]
  snippet?: Snippet
  outcome: string
  // index-card fields
  cardDesc: string
}

export const caseStudies: CaseStudy[] = [
  // ----------------------------------------------------------
  {
    slug: 'hono',
    kind: 'Brownfield',
    repoName: 'hono-lemmascript',
    repo: 'https://github.com/midspiral/hono-lemmascript',
    diff: 'https://github.com/midspiral/hono-lemmascript/compare/main..lemmascript',
    upstream: { label: 'honojs/hono', href: 'https://github.com/honojs/hono' },
    title: 'Four CVEs in a production web framework — guaranteed closed.',
    tagline:
      'Hono is a fast web framework running on edge platforms everywhere. We forked its security-critical middleware and made the fixes guaranteed — not just for the inputs in the advisory, but for every input.',
    cardDesc:
      'A fork of the Hono web framework with four real CVEs guaranteed closed — IP restriction, cookie validation, and static-file path handling — on production-grade, third-party code.',
    stats: [
      { value: '4', label: 'real CVEs guaranteed closed' },
      { value: '6/6', label: 'existing middleware tests still pass' },
      { value: 'in-place', label: 'function behavior left unchanged' },
    ],
    stakes:
      'IP allow-lists, cookie validation, and static file serving are the first things an attacker probes — and the last things you want to get subtly wrong. A single bypass in any of them is a real breach, not a cosmetic bug. These are the parts of a framework that have to be right for every input, because an attacker only needs one they thought of and you didn’t.',
    cves: [
      {
        id: 'CVE-2026-39409',
        href: 'https://github.com/honojs/hono/security/advisories/GHSA-3mpf-rcc7-5347',
        summary:
          'IP restriction bypass — a request from `::ffff:192.168.1.1` slipped past a rule written for `192.168.1.1`.',
      },
      {
        id: 'CVE-2026-39410',
        href: 'https://github.com/honojs/hono/security/advisories/GHSA-r5rp-j6wh-rvv4',
        summary:
          'Cookie-name bypass — a non-breaking space let `\\xA0sessionId=secret` masquerade as a valid cookie name.',
      },
      {
        id: 'CVE-2024-32869',
        href: 'https://github.com/honojs/hono/security/advisories/GHSA-q5w7-8mq6-2hxq',
        summary:
          'Directory traversal — a URL-encoded `..` (`%2e%2e`) walked out of the directory a static handler was meant to serve.',
      },
      {
        id: 'CVE-2026-39407',
        href: 'https://github.com/honojs/hono/security/advisories/GHSA-jw53-c2g8-vmwm',
        summary:
          'Repeated-slash traversal — the same static-path check missed slash-padded escape patterns.',
      },
    ],
    guaranteesHead: 'What’s guaranteed',
    guarantees: [
      {
        title: 'An IP rule can’t be dodged with an alternate address form',
        body: 'Matching any address against a rule gives the identical result for its `::ffff:` IPv6-mapped form — for every address, not only the one in the advisory’s proof-of-concept.',
      },
      {
        title: 'Only spaces and tabs are ever trimmed from a cookie name',
        body: 'No Unicode whitespace can slip through to forge a valid name. The guarantee lives directly in the production cookie parser — no separate copy to drift out of sync.',
      },
      {
        title: 'A served path can never escape its directory',
        body: 'The decode-then-check pipeline always returns the decoded request with no parent-directory escape — closing the URL-encoded and repeated-slash bypasses together, in one guaranteed step.',
      },
    ],
    snippet: {
      file: 'src/utils/cookie.ts',
      href: 'https://github.com/midspiral/hono-lemmascript/blob/lemmascript/src/utils/cookie.ts#L79',
      caption:
        'Verified in place — the production cookie parser itself carries the guarantee (excerpt).',
      code: `const trimCookieWhitespace = (value: string): string => {
  //@ verify
  //@ ensures \\result.length <= value.length
  // CVE-2026-39410: only space (0x20) and tab (0x09) are stripped — nothing else (e.g. 0xA0).
  //@ ensures \\result.length > 0 ==> \\result.charCodeAt(0) !== 0x20 && \\result.charCodeAt(0) !== 0x09
  let start = 0
  let end = value.length
  while (start < end) {
    const charCode = value.charCodeAt(start)
    if (charCode !== 0x20 && charCode !== 0x09) break
    start++
  }
  // …the end of the string is trimmed by the same rule…
  return value.slice(start, end)
}`,
    },
    outcome:
      'Same framework, same API, every existing middleware test still green. The difference is that the four bypasses can’t come back — not in a future refactor, not on an input nobody thought to test.',
  },

  // ----------------------------------------------------------
  {
    slug: 'opencode',
    kind: 'Brownfield',
    repoName: 'opencode-lemmascript',
    repo: 'https://github.com/midspiral/opencode-lemmascript',
    diff: 'https://github.com/midspiral/opencode-lemmascript/compare/dev..lemmascript',
    upstream: { label: 'opencode', href: 'https://github.com/sst/opencode' },
    title: 'A coding agent’s permission system — guaranteed to hold the line.',
    tagline:
      'opencode is an open-source coding agent. What it’s allowed to edit, run, and apply is decided by its permission engine. We made eleven of those functions guaranteed correct — so “deny edits in plan mode” actually means it, for every ruleset.',
    cardDesc:
      'A fork of the opencode agent with its permission system locked down — eleven access-control functions guaranteed to honor their rules, including a real Plan-Mode bypass closed for good.',
    stats: [
      { value: '11', label: 'permission functions guaranteed' },
      { value: 'in-place', label: 'bodies & signatures unchanged' },
      { value: '#26514', label: 'real Plan-Mode bypass closed' },
    ],
    stakes:
      'When an agent writes code, the permission system is the line between “review the diff first” and “it already ran.” It decides what the agent can edit, which commands it can execute, and which patches it can apply. A subtle bug there isn’t a UI glitch — it’s the agent doing the precise thing you forbade. This is exactly the kind of logic that has to be right for every ruleset, not just the ones in the test suite.',
    guaranteesHead: 'What’s guaranteed',
    guarantees: [
      {
        title: 'Deny always wins',
        body: 'Append a deny rule and every matching request after it is denied — no earlier allow can sneak through. Locking something down stays locked down.',
      },
      {
        title: 'No match means ask, never allow',
        body: 'An empty or non-matching ruleset can never silently grant access. The absence of a rule is never mistaken for permission.',
      },
      {
        title: 'Plan Mode holds for subagents',
        body: 'A subagent spawned by the task tool inherits every edit-deny from its parent — closing a real bug where subagents silently bypassed Plan Mode’s file-edit restriction.',
      },
      {
        title: 'Rules attach to the right command',
        body: '“npm run dev” matches whether you typed it bare or with extra flags — the longest matching command always wins, so a rule lands where you meant it to.',
      },
      {
        title: 'The patch tool can’t run off the rails',
        body: 'The unified-diff parser behind apply_patch always makes forward progress and stays within bounds — it can’t loop forever or read past the input.',
      },
    ],
    outcome:
      'The agent works exactly as before — same engine, same rules, annotations added in place. What changed is that the guarantees an operator relies on (deny means deny, plan mode means plan mode) now hold for every ruleset, not just the ones anyone happened to try.',
  },

  // ----------------------------------------------------------
  {
    slug: 'quota',
    kind: 'Greenfield',
    repoName: 'quota-lemmascript',
    repo: 'https://github.com/midspiral/quota-lemmascript',
    title: 'A booking app that can’t overbook — by construction.',
    tagline:
      'Quota lets providers publish a limited number of slots and signed-in users grab them. Its core counting logic is guaranteed never to oversell — no matter how many people book at once, or in what order.',
    cardDesc:
      'A booking application whose core allocation logic is guaranteed never to overbook — deployable local-first or on Cloudflare, correct for every input.',
    stats: [
      { value: '0', label: 'chance of overselling a slot' },
      { value: 'order', label: 'invariant — timing can’t corrupt counts' },
      { value: '1', label: 'verified core, browser + edge' },
    ],
    stakes:
      'Booking is just counting under a limit — until two people grab the last slot at the same instant. That’s where booking systems quietly oversell: a race between “is there room?” and “take it.” Quota’s core is built so the limit holds regardless of timing or arrival order, which is what makes a lock-free, multi-device design safe in the first place.',
    guaranteesHead: 'What’s guaranteed',
    guarantees: [
      {
        title: 'It never oversells',
        body: 'The number of confirmed bookings against a slot can never exceed its capacity — for any sequence of requests, however they interleave.',
      },
      {
        title: 'Order doesn’t change the answer',
        body: 'Bookings arriving in any order produce the same counts. That order-independence is the formal license for the lock-free, multi-device design.',
      },
      {
        title: 'Accept and reject are honest',
        body: 'A booking is confirmed only if it genuinely fits; a rejection means the slot was actually full, never a lost race.',
      },
    ],
    snippet: {
      file: 'src/domain.ts',
      href: 'https://github.com/midspiral/quota-lemmascript/blob/main/src/domain.ts',
      caption:
        'The booking core in ordinary TypeScript — the `//@ ensures` pins the rule that keeps it from overselling.',
      code: `// Room at slot \`idx\` iff it's in range and its confirmed count is below capacity.
export function hasRoom(p: Page, idx: number): boolean {
  //@ ensures \\result === (0 <= idx && idx < p.slots.length && confirmedCount(p.bookings, idx) < capacityAt(p.slots, idx))
  return confirmedCount(p.bookings, idx) < capacityAt(p.slots, idx)
}`,
    },
    outcome:
      'The same verified core runs in the browser (local-first) and inside a Cloudflare Durable Object — one implementation, guaranteed once, used everywhere.',
  },

  // ----------------------------------------------------------
  {
    slug: 'quorum',
    kind: 'Greenfield',
    repoName: 'quorum-lemmascript',
    repo: 'https://github.com/midspiral/quorum-lemmascript',
    title: 'A group scheduler whose “best time” is guaranteed right.',
    tagline:
      'Quorum is a login-free group scheduler — paint your availability on a grid and it surfaces the time the most people can make. The number it shows is guaranteed to be the real count, every time.',
    cardDesc:
      'A login-free group scheduler whose recommendation is guaranteed correct — the chosen slot always satisfies the most participants, for every input.',
    stats: [
      { value: 'exact', label: 'every count matches who’s actually free' },
      { value: 'order', label: 'independent — any device, any order' },
      { value: '1', label: 'verified core, client + server' },
    ],
    stakes:
      'A scheduler is only as trustworthy as its headline number. If the heatmap says five people are free at 3pm, five people had better be free at 3pm — and the slot it recommends had better genuinely be the best one, not a near-miss. Get that wrong and people show up to the wrong meeting.',
    guaranteesHead: 'What’s guaranteed',
    guarantees: [
      {
        title: 'The count is exactly right',
        body: 'Every slot’s number is exactly how many participants are free then — and the tooltip listing who they are can never disagree with the number shown.',
      },
      {
        title: 'The recommendation is genuinely the best',
        body: 'The highlighted slots are exactly the ones the most people can make — never a near-miss, never a tie reported as a winner.',
      },
      {
        title: 'Order can’t corrupt it',
        body: 'Edits arriving in any order, from any device, converge to the same result — the formal basis for the lock-free, no-login design.',
      },
    ],
    outcome:
      'One verified core runs in the browser, behind the in-app query, and on the server — no second implementation to drift, no number on screen that the math doesn’t back.',
  },
]

export const byKind = (kind: CaseStudy['kind']) => caseStudies.filter((c) => c.kind === kind)
