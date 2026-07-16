import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter(
    'LemmaScript — TypeScript with syntax for contracts',
    'Agents write code that is correct by construction; engineers review it at a glance. Zero runtime cost, works on existing code.',
  ) +
  `# LemmaScript is TypeScript with syntax for contracts

The way TypeScript is JavaScript with syntax for types, LemmaScript is TypeScript with syntax for contracts. An AI agent writes a \`//@ contract\` above a function and iterates until the code is correct by construction. Engineers review the contract — a few declarative lines — instead of the implementation.

- **Zero runtime cost.** Contracts are checked before code ships; nothing is added at runtime.
- **Works on existing code.** Add a contract to a single function in any TypeScript codebase and grow from there.
- **Agent-first.** The agent writes the contracts and the code; you review intent, not implementation.

## A real example

From a production rate limiter ([source](https://github.com/midspiral/hono-rate-limiter-with-lemmascript/blob/main/src/core.verified.ts#L38-L57)):

\`\`\`typescript
//@ contract Keeps only the requests still inside the sliding time window.
export function pruneWindow(log: number[], now: number, W: number): number[] {
  //@ requires forall(k, 0 <= k && k < log.length ==> log[k] <= now)
  //@ decreases log.length
  //@ ensures \\result.length <= log.length
  //@ ensures forall(k, 0 <= k && k < \\result.length ==> now - W < \\result[k] && \\result[k] <= now)
  if (log.length === 0) {
    return [];
  }
  // ... implementation the agent iterated until it satisfied the contract
}
\`\`\`

## The loop, in action

While splitting $10 three ways, an agent's first attempt floored each share and called it done — \`allocate(10, [1,1,1]) → [3,3,3]\`: that's 9, not 10; a cent vanished. The contract said the parts must sum to the total, so the agent corrected the code before surfacing it — the fixed version hands the leftover back out, and every cent is accounted for. Only correct code ships.

## You review the spec; the agent writes the rest

A few declarative contracts say exactly what the code must do. The implementation that satisfies them is the agent's job — you don't have to read it. Contracts and testing do different jobs: contracts guarantee the core logic; keep your tests for integration and boundaries, where they shine.

## Get started

\`\`\`sh
# install the LemmaScript toolchain
npm install -g lemmascript

# check your code against its contracts
lsc check src/
\`\`\`

- [Install guide](https://lemmascript.org/install.md)
- [Documentation](https://docs.lemmascript.org)
- [GitHub](https://github.com/midspiral/LemmaScript)

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
- [LLM index](https://lemmascript.org/llms.txt)
`

export const GET: APIRoute = () => mdResponse(body)
