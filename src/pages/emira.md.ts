import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter(
    'Emira — the agent that writes correct TypeScript natively',
    'Emira writes a contract and the code together, and emits a function only once it is correct. Join the waitlist for early access.',
  ) +
  `# Emira

Emira doesn't check correctness after the fact. It writes a contract and the code together, and emits a function only once it's correct.

Emira is Midspiral's coding agent built natively on LemmaScript: every function it produces carries a contract stating what it guarantees, and only correct code surfaces.

**Status:** early access waitlist — [join at lemmascript.org/emira](https://lemmascript.org/emira).

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
`

export const GET: APIRoute = () => mdResponse(body)
