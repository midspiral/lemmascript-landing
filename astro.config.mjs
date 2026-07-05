import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lemmascript.com',
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
  integrations: [sitemap()],
})
