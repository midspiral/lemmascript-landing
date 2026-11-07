import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import { mdResponse } from '../../lib/markdownMirror'
import { authorList, isoDate, sortPosts, type Post } from '../../lib/blog'

// The markdown mirror of each post (llms.txt convention). The post is already
// markdown, so this serves the source with a normalised frontmatter block.
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = sortPosts(await getCollection('blog', ({ data }) => data.published !== false))
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}

export const GET: APIRoute = ({ props }) => {
  const post = props.post as Post

  const head = `---
title: ${JSON.stringify(post.data.title)}
description: ${JSON.stringify(post.data.description.replace(/\s+/g, ' ').trim())}
authors: ${JSON.stringify(post.data.authors)}
date: ${isoDate(post.data.date)}
canonical: https://lemmascript.org/blog/${post.id}
---

`

  return mdResponse(
    head +
      `# ${post.data.title}

*${authorList(post.data.authors)} · ${isoDate(post.data.date)}*

${post.body ?? ''}

---

[All posts](https://lemmascript.org/blog.md) · [All pages](https://lemmascript.org/sitemap.md)
`,
  )
}
