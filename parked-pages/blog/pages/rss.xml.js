import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { sortPosts } from '../../lib/blog'

export async function GET(context) {
  const posts = sortPosts(await getCollection('blog', ({ data }) => data.published !== false))

  return rss({
    title: 'LemmaScript Blog',
    description:
      "Notes from the team building LemmaScript: how contracts hold up in real TypeScript codebases, what agents do with them, and what we learn shipping code that's correct by construction.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      author: post.data.authors.join(', '),
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
    customData: '<language>en-us</language>',
  })
}
