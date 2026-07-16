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
      theme: 'github-light',
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
