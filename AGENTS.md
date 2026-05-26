# AGENTS.md — foundry-vtt-types

`@league-of-foundry-developers/foundry-vtt-types` (npm) / `fvtt-types` (alias). A **declaration-only** TypeScript package providing types for [Foundry Virtual Tabletop](https://foundryvtt.com/). Every authored file is a `.d.mts` declaration file — no JavaScript ships.

## The single goal

**Update this repository to model Foundry VTT v14 accurately.** Type accuracy against the v14 runtime is the only objective right now. The `main` branch is the v14 work; older versions live on `foundry-<version>.x` branches.

> **The migration plan lives in `docs/agent/migration-v14.md` — the single source of truth for this multi-session effort.** Work is split across many agent sessions, so an accurate tracker is the only thing preventing lost context. **Every session doing v14 work MUST: (1) read it first to see what phase/file is next, and (2) keep it current as you go and before you finish** — the roadmap status row, the per-file checkboxes (`[x]`/`[~]`/`[ ]`), the running notes, and any scope discovery or cross-phase deferral. Treat updating the tracker as part of the task. Record later-phase work there so it is never silently dropped.

When writing or changing types, follow TypeScript best practices and **avoid hacks unless they are genuine type hacks** (i.e. a workaround for an upstream `tsc` / `tsgo` bug, a variance issue with no clean expression, or a documented FIXME that has no current solution). If you reach for a hack, leave a comment explaining what failed without it and link the upstream issue when one exists.

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

Before changing a type, **read the corresponding Foundry source file** at `D:\foundrydevelopment\FoundryV14\App\resources\app\` (mapping: `src/foundry/client/**` ↔ `client/**`, `src/foundry/common/**` ↔ `common/**`, `src/foundry/public/scripts/**` ↔ `public/scripts/**`). The Foundry source is ground truth.

For narrative Foundry API documentation, use the **`context7` MCP server** (`mcp__context7__resolve-library-id` then `mcp__context7__query-docs`). Prefer it over web search for any Foundry API question.

## Boundaries

Touch these only with explicit human review:

- **`src/configuration/`** — the user-extensible declaration-merging surface (`DocumentClassConfig`, `SourceConfig`, `DataConfig`, `SystemConfig`, `FlagConfig`, `SettingConfig`, `ModuleConfig`, `RequiredModules`, `AssumeHookRan`). Changes here ripple across every consumer's typed code. Adding a _new_ extension point requires explicit design discussion.
- **`src/utils/index.d.mts`** — the public utility-type surface exported as `fvtt-types/utils`. Changing or removing a helper is a breaking change.
- **`src/index.d.mts` and `src/index-lenient.d.mts`** — the package entry points. `index-lenient.d.mts` must NOT introduce new types — it only adjusts `AssumeHookRan`.
- **`src/foundry/common/abstract/document.d.mts`** — the core `Document` declaration. ~4k lines, intricately interconnected with every document type. Always read first, change last.
- **`eslint.config.js`** — the document/placeable indirection rules are load-bearing for the codebase's anti-bug story. Discuss before touching.
- **`package.json` `exports` and `imports` fields** — they define the public package surface and the internal path-alias contract. Adding a new alias is fine; removing or renaming one is breaking.
- **CI workflows in `.github/workflows/`** — particularly the `exactOptionalPropertyTypes false` and raw `tsgo` steps; both catch real regressions and must not be silently weakened.

## Architecture summary

```
src/
  index.d.mts            # entry — imports global side effects
  index-lenient.d.mts    # alt entry with AssumeHookRan pre-merged (excluded from in-repo typecheck)
  foundry/                # mirrors the Foundry runtime tree 1:1
    common/               # shared server/client (DataModel, Document, fields, packages, CONST...)
    client/               # browser-only (Applications, Canvas, Hooks, Game, CONFIG...)
    public/scripts/       # public static scripts (workers, ktx2, clipper, earcut)
  configuration/          # user-extensible declaration-merging surfaces
  types/                  # internal helper types (documentConfiguration, lib augments)
  utils/                  # exported as `fvtt-types/utils` — generic TS helpers
tests/
  foundry/                # mirrors src/foundry/ — one .test-d.ts per file where useful
  custom/                 # tests for the lenient/configured surface
docs/agent/               # this documentation set
```

Path aliases (from [package.json](package.json) `imports`):

| Alias            | Path                              |
| ---------------- | --------------------------------- |
| `#client/*`      | `./src/foundry/client/*`          |
| `#common/*`      | `./src/foundry/common/*`          |
| `#utils`         | `./src/utils/index.d.mts`         |
| `#configuration` | `./src/configuration/index.d.mts` |
| `#tests/*`       | `./tests/foundry/*` (test-only)   |
| `#testUtils`     | `./tests/utils.ts` (test-only)    |

The **`_module.d.mts` barrel pattern** is in every directory and matches Foundry's own `_module.mjs` re-export barrels. Inside `_module.d.mts`, imports use `.mjs` (not `.d.mts`) extensions — this is deliberate and the `import-x/extensions` rule is disabled at the file level for that reason.

The **`Implementation` indirection**: never write `typeof Actor` or `Actor` (as a value). Use `Actor.ImplementationClass` (constructor type) and `Actor.Implementation` (instance type). For documents with subtypes, `Actor.OfType<"character">`. The ESLint config warns on direct uses to push contributors here.

## Conventions (not enforceable by tooling)

Formatting is handled entirely by Prettier (see [.prettierrc.mjs](.prettierrc.mjs)). Lint rules are in [eslint.config.js](eslint.config.js). TypeScript strictness is set in [tsconfig.base.json](tsconfig.base.json) (notable flags: `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `verbatimModuleSyntax`). Do not duplicate any of those rules here.

**File naming.** All authored declarations are `.d.mts`. Never `.d.ts`. Filenames are `kebab-case` and usually match the primary class.

**Source mirroring.** `src/foundry/` mirrors `D:\foundrydevelopment\FoundryV14\App\resources\app\` 1:1. Member order within a class matches the upstream member order so side-by-side review is possible.

**Namespacing custom types.** For class `Foo`, related types live in `declare namespace Foo { ... }` in the same file (`Foo.Options`, `Foo.Implementation`, `Foo.Metadata`). Do not add custom types to the global namespace unless Foundry itself does.

**Imports.** Always include the extension. Use `import type` (verbatimModuleSyntax is on). Use the `#...` aliases over relative chains. Imports used only for `{@linkcode ...}` may need an `eslint-disable-next-line @typescript-eslint/no-unused-vars` directive.

**TSDoc (not JSDoc).** Permitted custom tags: `@remarks`, `@privateRemarks`, `@defaultValue`, `@typeParam`, `@immediate`. Align the `-` after each `@param` name (Prettier doesn't). Document runtime defaults with `@defaultValue` plus a fenced `typescript` block.

**Helper-type selection** (`src/utils/index.d.mts` has long doc-comments on each):

- `NullishProps<T>` — both `null` and `undefined` valid (most common).
- `InexactPartial<T>` — `undefined` valid, `null` not.
- `IntentionalPartial<T>` — explicit `undefined` would clobber a default during a merge.
- `AnyObject` instead of `Record<string, any>` or `{}`.
- `EmptyObject` (`Record<string, never>`) for "actually empty".
- `AnyArray` (`readonly unknown[]`) instead of `any[]`.
- `AnyConstructor` instead of `new (...args: any[]) => any`.

**Marker comments.** `// TODO:`, `// TODO(LukeAbby):`, `// FIXME:` (with `// This will be added in PR #...` when known), and `// @remarks TODO: Stub` for shell-only files. Preserve attribution when editing nearby code.

**Empty interfaces extending a single type** (`interface X extends _X {}`) are intentionally allowed and sometimes load-bearing for declaration merging, performance, or recursion-breaking. Do not "simplify" them.

## Anti-patterns — do not reintroduce

- **`Partial<T>` for option bags.** It caused conflation of "omitted" / "undefined" / "null" and broke under `exactOptionalPropertyTypes`. Use the helpers above.
- **`type-fest` imports.** They caused duplicate definitions and surface drift versus in-repo helpers. The ESLint `no-restricted-imports` rule blocks them.
- **Bare `typeof Document` / `typeof Placeable`.** They caused silent mis-typing when consumers configured `CONFIG.X.documentClass`. Use `.ImplementationClass`.
- **`{}` as "empty object".** It allows anything except `null`/`undefined`. Use `EmptyObject` or `AnyObject`.
- **Polluting `declare global { ... }` with custom helpers.** Caused collisions with system/module code. Keep helpers inside `declare namespace ClassName`.
- **Adding extension surfaces outside `src/configuration/`.** Created two sources of truth. Always go through `configuration/`.

## Workflows

| Command                 | Purpose                                              |
| ----------------------- | ---------------------------------------------------- |
| `npm run typecheck`     | `tsgo` against `tsconfig.json`                       |
| `npm run typecheck:all` | `tsgo --project tsconfig.all.json` (includes tests)  |
| `npm run lint`          | typecheck + eslint + prettier --check (full CI gate) |
| `npm run lint:fix`      | typecheck + eslint --fix + prettier --write          |
| `npm test`              | runtime tests (helpers, mostly)                      |
| `npm run test-types`    | type-level tests via `vitest --typecheck`            |
| `npm run test-all`      | both                                                 |
| `npm run format`        | Prettier                                             |

CI runs three jobs on PR — **typecheck** (with an additional `tsc --exactOptionalPropertyTypes false` step and a raw `tsgo` step), **lint**, **test**. All three must be green to merge.

Pre-commit hooks via `husky` + `lint-staged` enforce a subset. Do not bypass with `--no-verify` unless explicitly asked.

## Known bugs and gotchas

- **Branded-type field overrides** required on several documents (`ChatMessage`, `Drawing`, `MeasuredTemplate`, `JournalEntryPage`, `Playlist`, `Scene`) — search for `FIXME: overrides required to enforce branded type`. Leave the overrides in place.
- **`ClientDocumentMixin` constructor shape** is non-standard for a mixin — the FIXME at `src/foundry/client/documents/abstract/client-document.d.mts:632` is intentional.
- **`tsgo` recursion limit** on `_GetProperty` (`src/utils/index.d.mts:1385`) — tracked at https://github.com/microsoft/typescript-go/issues/1278. Do not deepen the recursion.
- **`_module.d.mts` imports use `.mjs` extensions deliberately** — matching Foundry's runtime barrels. The `eslint-disable import-x/extensions` at the top is correct.
- **Stub files** — many client applications are typed `@remarks TODO: Stub`. Search for that marker to enumerate the v14 to-do list. Filling these in is a primary work item.
- **Lenient mode masking** — `src/index-lenient.d.mts` is excluded from `tsconfig.json` because including it would hide real errors. If errors mysteriously disappear, you probably included it.

## Domain vocabulary

- **Document** — persistent entity (`Actor`, `Item`, `Scene`, `User`). Extends `foundry.abstract.Document`, which extends `DataModel`.
- **`Implementation` / `ImplementationClass`** — the user-configured class (via `CONFIG.X.documentClass`). Always prefer over the base class.
- **Subtype / `hasTypeData`** — whether the document allows system-registered subtypes with extra `system` schema. See the `documents` table in [eslint.config.js](eslint.config.js).
- **Placeable vs `*Document`** — canvas object vs underlying document data (`Token` ↔ `TokenDocument`, etc.).
- **`DataField` value flavours** — AssignmentType (write), InitializedType (runtime read), SourceType / PersistedType (DB shape). Mixing them is a frequent source of bugs.
- **`AssumeHookRan`** — declaration-merging surface that collapses the "uninitialized" branch of globals like `game`. The lenient entry point pre-merges every hook.
- **`ApplicationV1` vs `ApplicationV2`** — Foundry is mid-migration to v2. New typing work should default to v2.

## For more detail

For detailed reference files, see [`docs/agent/`](docs/agent/) — these are loaded automatically by Claude Code via CLAUDE.md and cover conventions, architecture, decisions, bugs, workflows, skills, and domain context in depth.
