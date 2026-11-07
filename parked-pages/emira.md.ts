import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter(
    'Emira — the agent that writes correct TypeScript natively',
    'Emira writes a contract and the code together, and emits a function only once it is correct. Join the waitlist for early access.',
  ) +
  `# Meet Emira — the agent that writes correct TypeScript, guaranteed

No duct-taped harnesses, no token-heavy workflows. Emira doesn't check correctness after the fact. It writes a contract and the code together, and emits a function only once it's correct.

Emira is Midspiral's coding agent built natively on LemmaScript. What makes it different:

- **Correct by construction.** Every function Emira ships comes with a contract it can't violate. There are no bugs to chase down later — correctness is built in from the first line.
- **Native, not bolted on.** Correctness isn't a tool Emira calls at the end. It's how the code gets written — no prompt gymnastics, no retry-until-it-looks-right.
- **Reviewable in seconds.** Emira emits plain TypeScript with declarative contracts. You review the intent at a glance, never the implementation.

**Status:** coming soon — early access waitlist at [lemmascript.org/emira](https://lemmascript.org/emira).

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
`

export const GET: APIRoute = () => mdResponse(body)
