import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'
import { AGENT_PROMPT } from '../lib/agentPrompt'

// If an agent fetches /go (or /go.md) directly, hand it the prompt as-is.
const body =
  frontmatter('Start using LemmaScript', 'Paste this into your coding agent. It does the rest.') +
  `# Start using LemmaScript

LemmaScript is TypeScript with syntax for contracts — the way TypeScript is JavaScript with syntax for types. Your agent writes a \`//@ contract\` above a function and iterates until the code is proven to meet it. Zero runtime cost; works on the TypeScript you already have.

Paste the block below into your coding agent (Claude Code, Cursor, Codex, …). If you *are* the agent reading this: follow it.

\`\`\`text
${AGENT_PROMPT}
\`\`\`

- [Install, step by step](https://lemmascript.org/install.md)
- [Documentation](https://docs.lemmascript.org)
`

export const GET: APIRoute = () => mdResponse(body)
