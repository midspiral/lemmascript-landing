import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// Blog posts live as flat markdown files in src/content/blog/<slug>.md.
// The filename is the slug (and therefore the URL), so renaming a file
// changes a published URL — treat filenames as permanent.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    authors: z.array(z.string()).default(['Fernanda Graciolli']),
    tags: z.array(z.string()).default([]),
    /* Set false to keep a draft out of the build, the RSS feed and the mirrors. */
    published: z.boolean().default(true),
    /* Path under /public, e.g. /og.png. Falls back to the site-wide card. */
    image: z.string().optional(),
  }),
})

export const collections = { blog }
