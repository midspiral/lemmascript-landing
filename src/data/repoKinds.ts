// ============================================================
//  ECOSYSTEM REPO TAXONOMY
//  Every midspiral repo *except* LemmaScript itself is classified
//  here. LemmaScript is the core language/compiler and is handled
//  by the changelog's scope toggle, so it is intentionally absent.
//
//  - Case Study: a project that demonstrates LemmaScript on real code.
//      · Greenfield      — a new project built around proofs from scratch
//      · Brownfield      — proofs retrofitted onto an existing/forked codebase
//      · Green-in-brown  — a new, proven feature added inside a brownfield fork
//  - Tooling: editor/CLI/build tooling and the site itself.
//  - Skills:  Claude skills for working with LemmaScript.
//
//  Edit freely — the changelog page validates at build time that every
//  repo with entries (other than LemmaScript) appears here.
// ============================================================

export type RepoKind = 'Case Study' | 'Tooling' | 'Skills'
export type CaseStudyFlavor = 'Greenfield' | 'Brownfield' | 'Green-in-brown'

export interface RepoMeta {
  kind: RepoKind
  flavor?: CaseStudyFlavor // present only when kind === 'Case Study'
}

export const CORE_REPO = 'LemmaScript'

export const repoKinds: Record<string, RepoMeta> = {
  // ---- Case Study · Brownfield (forks of existing production code) ----
  'hono-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'opencode-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'infisical-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'node-casbin-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'rallly-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'balanced-match-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'pi-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'vscode-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'guardians-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },
  'anthropic-sdk-lemmascript': { kind: 'Case Study', flavor: 'Brownfield' },

  // ---- Case Study · Greenfield (new projects built around proofs) ----
  'quota-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'quorum-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'quorum-tutorial-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'eventab-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'henri-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'equality-game-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'colorwheel-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'clear-split-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'collab-todo-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'trace-solo-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'hono-rate-limiter-with-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'eslint-plugin-with-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },
  'github-star-checker-lemmascript': { kind: 'Case Study', flavor: 'Greenfield' },

  // ---- Case Study · Green-in-brown (new proven feature inside a fork) ----
  'xyflow-lemmascript': { kind: 'Case Study', flavor: 'Green-in-brown' },

  // ---- Tooling ----
  'lemmascript-vscode': { kind: 'Tooling' },
  'lemmascript-kit': { kind: 'Tooling' },
  'lemmascript-claimcheck': { kind: 'Tooling' },

  // ---- Skills ----
  'lemmascript-skills': { kind: 'Skills' },
}
