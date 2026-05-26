# CLAUDE.md — foundry-vtt-types

`@league-of-foundry-developers/foundry-vtt-types` (npm) / `fvtt-types` (alias). A **declaration-only** TypeScript package providing types for [Foundry Virtual Tabletop](https://foundryvtt.com/). Every authored file is a `.d.mts` declaration file — no JavaScript ships.

## The single goal

**Update this repository to model Foundry VTT v14 accurately.** Type accuracy against the v14 runtime is the only objective right now. The `main` branch is the v14 work; older versions live on `foundry-<version>.x` branches.

> **The migration plan lives in @docs/agent/migration-v14.md — the single source of truth for this multi-session effort.** This work is split across many agent sessions, so the only thing preventing lost context is an accurate tracker. **Every session doing v14 work MUST: (1) read it first to see what phase/file is next, and (2) keep it current as you go and before you finish** — the roadmap status row, the per-file checkboxes (`[x]`/`[~]`/`[ ]`), the running notes, and any scope discovery or cross-phase deferral. Treat updating the tracker as part of the task, not optional cleanup. If you discover work that belongs to a later phase, record it there so it is never silently dropped.

When writing or changing types, follow TypeScript best practices and **avoid hacks unless they are genuine type hacks** — a workaround for an upstream `tsc` / `tsgo` bug, a variance issue with no clean expression, or a documented FIXME. If you reach for a hack, leave a comment explaining what failed without it and link the upstream issue when one exists.

## Quick Start

```sh
# install
npm install

# the gates CI runs (all three must pass before merge)
npm run typecheck     # tsgo against default tsconfig.json
npm run lint          # typecheck + eslint + prettier --check
npm run test-types    # vitest --typecheck for .test-d.ts files

# fix what you can fix automatically
npm run lint:fix
```

Before changing a type, **read the corresponding Foundry source file** at `/home/fronix/git/foundry/resources/app` (mapping: `src/foundry/client/**` ↔ `client/**`, `src/foundry/common/**` ↔ `common/**`, `src/foundry/public/scripts/**` ↔ `public/scripts/**`). The Foundry source is ground truth.

For narrative Foundry API documentation, use the **`context7` MCP server** (`mcp__context7__resolve-library-id` then `mcp__context7__query-docs`). Prefer it over web search for any Foundry API question.

## Boundaries

Touch these only with explicit human review:

- **`src/configuration/`** — the user-extensible declaration-merging surface (`DocumentClassConfig`, `SourceConfig`, `DataConfig`, `SystemConfig`, `FlagConfig`, `SettingConfig`, `ModuleConfig`, `RequiredModules`, `AssumeHookRan`). Changes here ripple across every consumer's typed code. Adding a _new_ extension point requires explicit design discussion.
- **`src/utils/index.d.mts`** — the public utility-type surface exported as `fvtt-types/utils`. Changing or removing a helper is a breaking change.
- **`src/index.d.mts` and `src/index-lenient.d.mts`** — the package entry points. `index-lenient.d.mts` must NOT introduce new types — it only adjusts `AssumeHookRan`.
- **`src/foundry/common/abstract/document.d.mts`** — the core `Document` declaration. ~4k lines, intricately interconnected. Always read first, change last.
- **`eslint.config.js`** — the document/placeable indirection rules are load-bearing for the codebase's anti-bug story.
- **`package.json` `exports` and `imports` fields** — they define the public package surface and the internal path-alias contract.
- **CI workflows in `.github/workflows/`** — particularly the `exactOptionalPropertyTypes false` and raw `tsgo` steps; both catch real regressions.

## Reference Files

Consult these files only when the condition applies — do not load all of them by default:

- @docs/agent/migration-v14.md — **always, for any v14 migration work**: the phased roadmap, per-file status, and definition of "done". Read it first; keep it current before finishing (see "The single goal" above).
- @docs/agent/conventions.md — when writing, editing, or reviewing TypeScript declarations
- @docs/agent/architecture.md — when navigating the codebase, deciding where a new type belongs, or proposing structural changes
- @docs/agent/decisions.md — when making or evaluating an architectural or design choice
- @docs/agent/bugs.md — when debugging an unexpected typecheck error, when a previously-working type starts failing, or when an `@ts-expect-error` / FIXME / TODO marker is unclear
- @docs/agent/workflows.md — when running typechecks, lint, or tests; when verifying a change against CI; or when publishing
- @docs/agent/skills.md — when onboarding or unsure whether an unfamiliar piece of the stack is in scope
- @docs/agent/context.md — when interpreting Foundry-specific terms or when a type decision hinges on Foundry's runtime semantics

The companion [AGENTS.md](AGENTS.md) is the self-contained version of this guidance for agents (GitHub Copilot, others) that don't support `@`-imports.
