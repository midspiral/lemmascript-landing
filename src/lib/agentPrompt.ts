// The one-paste prompt behind lemmascript.org/go (the sticker QR code).
// Keep it self-contained: a reader's agent should be able to go from zero to
// a verified contract with nothing but this text.
export const AGENT_PROMPT = `Set up LemmaScript in this project and start using it. LemmaScript is TypeScript with syntax for contracts: you write a \`//@\` contract above a function and iterate until the checker proves the code meets it. Zero runtime cost, works on existing TypeScript.

Do this in order:

1. Prerequisites: check for node >= 18 and dafny >= 4.x. If dafny is missing, install it (https://dafny.org/latest/Installation) and confirm with \`dafny --version\`.
2. Install LemmaScript from npm: \`npm install -g lemmascript\`, then confirm with \`lsc version\`. Do not clone any repositories.
3. Learn how to drive it: read https://lemmascript.org/llms.txt for the key facts, https://docs.lemmascript.org for the contract syntax, and the agent skills at https://github.com/midspiral/lemmascript-skills (read them in place; they describe the write-contract → check → fix loop you will follow).
4. Pick one pure domain-logic function in this codebase. Write a \`//@\` contract above it stating what it must guarantee, then run \`lsc check --backend=dafny <that file.ts>\` and iterate on the code until it reports the function correct. Show me the contract and the result.

From now on, when you write or change TypeScript domain logic here: write the contract first, and run \`lsc check --backend=dafny\` on the file before you call the work done.`
