import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lemmascript.org',
  redirects: {
    '/integrations': '/ecosystem',
  },
  server: {
    allowedHosts: ["midspiral-blog.metareflective.space", "localhost4321.metareflective.space"],
  },
  markdown: {
    shikiConfig: {
      // Both themes ship in one pass; blog.css picks the dark one unless the
      // visitor has opted into the light theme.
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
