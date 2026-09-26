import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'
import { changelog } from '../data/changelog'

// Generated from the same data as /changelog, so it can't drift.
const RECENT = 60

const entries = [...changelog]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, RECENT)

const lines = entries.map(
  (e) => `- **${e.date}** · [${e.repo}](${e.repoHref}) · ${e.category}: ${e.summary} ([details](${e.href}))`,
)

const body =
  frontmatter(
    'LemmaScript Changelog',
    'Dated changes across the LemmaScript toolchain and ecosystem, generated from public repos.',
  ) +
  `# LemmaScript Changelog

The ${RECENT} most recent entries across the LemmaScript toolchain and its ecosystem (of ${changelog.length} total — see [the full changelog](https://lemmascript.org/changelog) for everything).

${lines.join('\n')}

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
`

export const GET: APIRoute = () => mdResponse(body)
