import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter('LemmaScript — Sitemap', 'All pages on lemmascript.org, with markdown mirrors.') +
  `# Sitemap

Every page is also available as clean markdown at the same URL with \`.md\` appended.

## Pages

- [Home](https://lemmascript.org/) — [markdown](https://lemmascript.org/index.md)
- [Install](https://lemmascript.org/install) — [markdown](https://lemmascript.org/install.md)
- [Ecosystem](https://lemmascript.org/ecosystem) — [markdown](https://lemmascript.org/ecosystem.md)
- [Changelog](https://lemmascript.org/changelog) — [markdown](https://lemmascript.org/changelog.md)
- [Contribute](https://lemmascript.org/contribute) — [markdown](https://lemmascript.org/contribute.md)
- [Emira](https://lemmascript.org/emira) — [markdown](https://lemmascript.org/emira.md)
- [Wall of Love](https://lemmascript.org/wall-of-love) — [markdown](https://lemmascript.org/wall-of-love.md)

## Machine-readable

- [llms.txt](https://lemmascript.org/llms.txt)
- [sitemap-index.xml](https://lemmascript.org/sitemap-index.xml)

## External

- [Documentation](https://docs.lemmascript.org)
- [GitHub](https://github.com/midspiral/LemmaScript)
`

export const GET: APIRoute = () => mdResponse(body)
