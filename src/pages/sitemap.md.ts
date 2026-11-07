import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

export const GET: APIRoute = async () => {
  const body =
    frontmatter('LemmaScript — Sitemap', 'All pages on lemmascript.org, with markdown mirrors.') +
    `# Sitemap

Every page is also available as clean markdown at the same URL with \`.md\` appended.

## Pages

- [Home](https://lemmascript.org/) — [markdown](https://lemmascript.org/index.md)
- [Install](https://lemmascript.org/install) — [markdown](https://lemmascript.org/install.md)
- [Ecosystem](https://lemmascript.org/ecosystem) — [markdown](https://lemmascript.org/ecosystem.md)
- [Contribute](https://lemmascript.org/contribute) — [markdown](https://lemmascript.org/contribute.md)
- [Wall of Love](https://lemmascript.org/wall-of-love) — [markdown](https://lemmascript.org/wall-of-love.md)

## Machine-readable

- [llms.txt](https://lemmascript.org/llms.txt)
- [sitemap-index.xml](https://lemmascript.org/sitemap-index.xml)

## External

- [Blog](https://midspiral.com/blog)
- [Documentation](https://docs.lemmascript.org)
- [GitHub](https://github.com/midspiral/LemmaScript)
`

  return mdResponse(body)
}
