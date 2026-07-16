import type { APIRoute } from 'astro'
import { mdResponse, frontmatter } from '../lib/markdownMirror'

const body =
  frontmatter(
    'Install LemmaScript',
    'Two ways in: the npm package plus the agent skills, or the source kit with everything bundled.',
  ) +
  `# Install LemmaScript

Two ways in. Use the package if you're **using** LemmaScript; take the kit if you're **changing** it.

## Option A — the package

The standard setup: the \`lsc\` toolchain from npm, plus the skills that teach your agent to drive it.

1. **Check the prerequisites** — Node ≥ 18, Dafny ≥ 4.x (the engine that does the checking), and git.

   \`\`\`sh
   node -v          # ≥ 18
   dafny --version  # ≥ 4.x
   \`\`\`

2. **Install the package** — one global install puts \`lsc\` (and companions like \`lsc claimcheck\`) on your PATH.

   \`\`\`sh
   npm install -g lemmascript
   \`\`\`

3. **Add the skills** — mount the skills repo at your project's skills directory. Your agent picks them up and drives the whole loop itself — contracts, checks, iteration.

   \`\`\`sh
   git submodule add https://github.com/midspiral/lemmascript-skills .claude/skills
   \`\`\`

4. **Check something** — point it at a file or your whole project.

   \`\`\`sh
   lsc check --backend=dafny src/
   \`\`\`

## Option B — from source: lemmascript-kit

Working on the toolchain itself, or want the tools and skills pinned together? The kit bundles the toolchain source and the skills as git submodules — one clone, one setup script, skills already in place.

\`\`\`sh
git clone --recurse-submodules https://github.com/midspiral/lemmascript-kit.git
cd lemmascript-kit
./setup.sh
\`\`\`

Run the same commands straight out of the source tree (the skills write the CLI as \`npx lsc\`; in the kit, substitute this form or \`npm link\` the package):

\`\`\`sh
npx tsx LemmaScript/tools/src/lsc.ts check --backend=dafny path/to/file.ts
\`\`\`

The kit already mounts the skills at \`.claude/skills/\` — no separate step.

## Next

- [Documentation](https://docs.lemmascript.org)
- [Ecosystem](https://lemmascript.org/ecosystem.md)

## Sitemap

- [All pages](https://lemmascript.org/sitemap.md)
`

export const GET: APIRoute = () => mdResponse(body)
