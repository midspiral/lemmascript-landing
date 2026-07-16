import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter(
    'LemmaScript Ecosystem',
    'Everything that snaps onto the core: claimcheck, CI, CLI, agent skills, VSCode extension, runtime-guard, sepui, and lemmascript-seal.',
  ) +
  `# A growing agent-native ecosystem

LemmaScript works well on its own, but it works better with support from these tools. The compiler is the free, open core; around it, eight pieces.

## claimcheck

Confirms your contract says exactly what you meant — it reads the plain-English claim against the formal clauses and surfaces gaps. How to use: https://github.com/midspiral/lemmascript-claimcheck#readme

## CI

A GitHub Action that fails the build on any unmet contract — enforced on every pull request, no matter who (or what) opened it. How to use: https://github.com/midspiral/LemmaScript#readme

## CLI

The whole toolchain from your terminal. Every step of the loop is a command, so you or your agent can run any of it anywhere a shell runs. How to use: https://github.com/midspiral/LemmaScript#usage

## Skills

Drop-in skills that teach agents when and how to use LemmaScript. Use them with any agent and extend them to your codebase and workflow. Repo: https://github.com/midspiral/lemmascript-skills

## VSCode extension

Makes contracts a first-class part of your editor: \`//@\` clauses get real syntax highlighting, so they read as language, not comments. Deeper editor support coming soon. How to use: https://github.com/midspiral/lemmascript-vscode#readme

## lemmascript-seal

An append-only ledger of your guarantees. Freezes every contract so edits can never weaken or remove existing guarantees. How to use: https://github.com/midspiral/lemmascript-seal#readme

## runtime-guard *(coming soon)*

Keeps the guarantees alive in the running app: a call that breaks a contract fails loudly and points at the problem, instead of returning a wrong answer. Your UI can also ask "is this call allowed?" before making it.

## sepui *(coming soon)*

Keeps business logic out of your UI. Flags any component deciding or computing on domain data and prints the exact chain, so the rules live only in the core.

## Contribute a tool

Have ideas for useful tools? The next piece comes from you — use LemmaScript, notice the gap, and [contribute to the ecosystem](https://lemmascript.org/contribute.md).

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
`

export const GET: APIRoute = () => mdResponse(body)
