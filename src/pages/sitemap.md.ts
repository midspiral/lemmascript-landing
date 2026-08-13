import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { mdResponse, frontmatter } from '../lib/markdownMirror'
import { isoDate, sortPosts } from '../lib/blog'

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('blog', ({ data }) => data.published !== false))
  const postLines = posts.map(
    (p) =>
      `- [${p.data.title}](https://lemmascript.org/blog/${p.id}) — ${isoDate(p.data.date)} — [markdown](https://lemmascript.org/blog/${p.id}.md)`,
  )

  const body =
    frontmatter('LemmaScript — Sitemap', 'All pages on lemmascript.org, with markdown mirrors.') +
    `# Sitemap

Every page is also available as clean markdown at the same URL with \`.md\` appended.

## Pages

- [Home](https://lemmascript.org/) — [markdown](https://lemmascript.org/index.md)
- [Install](https://lemmascript.org/install) — [markdown](https://lemmascript.org/install.md)
- [Ecosystem](https://lemmascript.org/ecosystem) — [markdown](https://lemmascript.org/ecosystem.md)
- [Blog](https://lemmascript.org/blog) — [markdown](https://lemmascript.org/blog.md)
- [Changelog](https://lemmascript.org/changelog) — [markdown](https://lemmascript.org/changelog.md)
- [Contribute](https://lemmascript.org/contribute) — [markdown](https://lemmascript.org/contribute.md)
- [Emira](https://lemmascript.org/emira) — [markdown](https://lemmascript.org/emira.md)
- [Wall of Love](https://lemmascript.org/wall-of-love) — [markdown](https://lemmascript.org/wall-of-love.md)

## Blog posts

${postLines.length ? postLines.join('\n') : '_No posts published yet._'}

## Machine-readable

- [llms.txt](https://lemmascript.org/llms.txt)
- [sitemap-index.xml](https://lemmascript.org/sitemap-index.xml)
- [Blog RSS](https://lemmascript.org/blog/rss.xml)

## External

- [Documentation](https://docs.lemmascript.org)
- [GitHub](https://github.com/midspiral/LemmaScript)
`

  return mdResponse(body)
}
