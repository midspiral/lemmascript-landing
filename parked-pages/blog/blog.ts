import type { CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'blog'>

/** Newest first — the order the index, the feed and the mirrors all use. */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

/** Dates are authored as bare YYYY-MM-DD, so read them back in UTC. */
export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  })
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function authorList(authors: string[]): string {
  return authors.length === 2 ? authors.join(' & ') : authors.join(', ')
}
