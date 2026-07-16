import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter(
    'Contribute to LemmaScript',
    'Pick your on-ramp — start small, bring your own code, or go deep — and help shape how correct-by-construction software gets built.',
  ) +
  `# Contribute to LemmaScript

LemmaScript is young, and the ground floor is wide open. The people who show up now will shape how correct-by-construction software gets built — the language, the tools, and what agents can guarantee.

## First time contributing?

Pick the on-ramp that matches the time you have; all three are real contributions.

- **Start small** — a typo, a docs gap, a confusing error message. Open an issue or a pull request straight away. [Good first issues](https://github.com/midspiral/LemmaScript/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- **Bring your own code** — point LemmaScript at a module you know well. Wherever it can't express a property you care about, that gap is the contribution — [open an issue](https://github.com/midspiral/LemmaScript/issues) with the case.
- **Go deep** — take on one of the known limits of what the toolchain can express. Highest leverage, most effort.

No gatekeeping: a good bug report with a minimal reproduction is a real contribution on its own; you don't need to write the fix.

## What can I contribute to?

- **The language & compiler** — the core toolchain: the contract language, what it can express, and the walls that still stand.
- **The ecosystem** — tools that snap onto the core: lint rules, editor helpers, CI surfaces. Build the one you wish existed.
- **Errors & diagnostics** — anywhere the toolchain is confusing, unhelpful, or just wrong.
- **Docs & skills** — if something took you or your agent longer to figure out than it should have, that's a gap worth fixing.

## Using LLMs? Of course.

LemmaScript is built for a future where agents write the majority of the code. The ground rules are about ownership and excellence, not the tools you use:

1. **Agent-driven implementation is okay; agent-driven thinking is not.** Zoom out — make fixes broad enough to cover a class of issues, not one case.
2. **You alone are the author of record.** Review and understand everything you submit; if you can't explain it, it isn't ready.
3. **Never let an agent weaken a guarantee.** The fastest way to make something pass is to relax a contract. Don't. Contributions must strengthen the system.

A drop-in skill that lets your agent file issues and submit fixes as it works is coming soon.

## Built something with LemmaScript? Show it off.

Ship a project with a contract-backed core and [submit it to the showcase](https://docs.google.com/forms/d/e/1FAIpQLSd5bT9U27Gn4gfJChWki865T7I9VjoAwMopHxkvtmjTlNyk5w/viewform) — the best ones get featured with full credit.

## Links

- [GitHub](https://github.com/midspiral/LemmaScript)
- [Open issues](https://github.com/midspiral/LemmaScript/issues)
- [Documentation](https://docs.lemmascript.org)

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
`

export const GET: APIRoute = () => mdResponse(body)
