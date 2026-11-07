import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lemmascript.org',
  redirects: {
    '/integrations': '/ecosystem',
    // Blog moved to midspiral.com; keep old URLs alive.
    '/blog': 'https://midspiral.com/blog/',
    '/blog/rss.xml': 'https://midspiral.com/blog/rss.xml',
    '/blog/shallow-embedding': 'https://midspiral.com/blog/shallow-embedding-why-lemmascript-translates-typescript-straight-into-dafny/',
  },
  server: {
    allowedHosts: ["midspiral-blog.metareflective.space", "localhost4321.metareflective.space"],
  },
  markdown: {
    shikiConfig: {
      // Both themes ship in one pass; the dark one applies unless the visitor
      // has opted into the light theme.
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
  integrations: [
    sitemap({
      // lastmod lets crawlers (and AI agents) track change dates per page.
      serialize(item) {
        return { ...item, lastmod: new Date().toISOString() }
      },
    }),
  ],
})
