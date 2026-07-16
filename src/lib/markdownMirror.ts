// Markdown mirrors of the site's pages, per the llms.txt convention
// (https://llmstxt.org): each HTML page has a clean markdown version at
// the same URL with `.md` appended. Served as static endpoints.
//
// Keep these in sync with the corresponding .astro pages when copy changes.

export const LAST_UPDATED = new Date().toISOString().slice(0, 10)

export function mdResponse(body: string): Response {
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export function frontmatter(title: string, description: string): string {
  return `---
title: ${JSON.stringify(title)}
description: ${JSON.stringify(description)}
last_updated: ${LAST_UPDATED}
---

`
}
