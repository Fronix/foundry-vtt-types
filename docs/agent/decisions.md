# Architectural Decisions

## When to consult this file

Consult this file when making or evaluating an architectural or design choice — especially one that crosses files or affects the public surface. Not needed for routine within-file edits.

Format: lightweight ADR — **Context → Decision → Consequences**, dated. Each ADR has a `Recorded:` date (when the decision was written into this file) and may have a `Originated:` note (best-effort estimate of when the decision actually took effect — inferred from the codebase, CONTRIBUTING.md, or `package.json` history; treat as approximate).

All ADRs below were recorded on **2026-05-25** during the initial agent-documentation pass for v14. Future ADRs should carry their actual creation date.

---

## ADR-001: Mirror the Foundry runtime tree 1:1

**Recorded:** 2026-05-25. **Originated:** pre-v9 (codified in CONTRIBUTING.md, long predates this record).

**Context.** Foundry's source is split across `client/`, `common/`, and `public/`. Reviewers spend most of their time side-by-side-diffing the Foundry source against this repo.

**Decision.** `src/foundry/` mirrors the Foundry runtime tree exactly. Member order inside a class also matches the upstream order. Diverging requires a strong reason.

**Consequences.** Reviewers can navigate by Foundry path. Cost: when Foundry restructures (as v14 did in places), the repo must follow even if a different layout would be cleaner. Also forces the `.d.mts` ↔ `.mjs` extension dance in `_module.d.mts` files (see [bugs.md](bugs.md)).

---

## ADR-002: User-extensible types via declaration merging into `fvtt-types/configuration`

**Recorded:** 2026-05-25. **Originated:** pre-v9 (long-standing).

**Context.** Game systems need to swap document classes, declare system-specific `system` data, and register module APIs. A purely-static type set could not express this.

**Decision.** Expose a small set of empty interfaces (`DocumentClassConfig`, `SourceConfig`, `DataConfig`, `SystemConfig`, `FlagConfig`, `SettingConfig`, `ModuleConfig`, `RequiredModules`, `AssumeHookRan`) in `src/configuration/`. Users `declare module "fvtt-types/configuration" { interface X {...} }` to extend them. Internal types route through these.

**Consequences.** A new extension surface should _only_ be added in `src/configuration/`. Adding extension surfaces elsewhere creates two sources of truth. Cost: configuration types are intricately interconnected; adding a new one requires care.

---

## ADR-003: Use TypeScript `imports` aliases (`#client`, `#common`, `#utils`) instead of long relative paths

**Recorded:** 2026-05-25. **Originated:** during v13 work (approximate).

**Context.** Files five levels deep importing five other deep files produced unreadable `../../../../` chains.

**Decision.** Use Node `imports` field in [package.json](../../package.json). All imports inside `src/` go through `#client/*`, `#common/*`, `#utils`, `#configuration`. Tests get `#tests/*` and `#testUtils`. ESLint blocks `#tests` and `#testUtils` from `src/`.

**Consequences.** Imports are stable across moves. Requires `moduleResolution: "bundler"` (or Node ≥16) downstream — see [README.md](../../README.md) compiler-option notes.

---

## ADR-004: Disallow direct `typeof Document` / `Document` value references via ESLint

**Recorded:** 2026-05-25. **Originated:** during the document-class-config rollout (approximate).

**Context.** Many bugs came from code writing `typeof Actor` to mean "the Actor class consumers will see," forgetting that `CONFIG.Actor.documentClass` can replace it.

**Decision.** ESLint `no-restricted-syntax` flags every `typeof <DocumentName>` and bare-expression `<DocumentName>`. Warnings (not errors) push contributors to `.ImplementationClass` and `.Implementation`. Same treatment for placeables.

**Consequences.** New contributors hit the warnings often and need orientation. Cross-references: this rule and the `.Implementation` pattern are why [bugs.md § ChatMessage / Drawing branded-choice overrides](bugs.md) exists at all.

---

## ADR-005: Authored entirely as `.d.mts`, not `.d.ts`, with explicit import extensions

**Recorded:** 2026-05-25. **Originated:** during ESM migration (codified in [eslint.config.js](../../eslint.config.js)).

**Context.** Foundry runs ESM (`type: "module"` since v11+). `verbatimModuleSyntax` plus `moduleResolution: bundler` need the file extension to match what consumers will resolve.

**Decision.** All source is `.d.mts`. `import-x/extensions` is `["error", "always"]`. `_module.d.mts` files use `.mjs` extensions in their imports (matching Foundry's runtime barrel files) — these are deliberately not `.d.mts` and the rule is locally disabled.

**Consequences.** No `.d.ts` should appear under `src/`. Adding one breaks consumer resolution under modern moduleResolution settings.

---

## ADR-006: Custom partial helpers (`NullishProps`, `InexactPartial`, `IntentionalPartial`) instead of `Partial<T>`

**Recorded:** 2026-05-25. **Originated:** long-standing.

**Context.** Plain `Partial<T>` conflates "may be omitted," "may be `undefined`," and "may be `null`," and breaks differently under `exactOptionalPropertyTypes`. Foundry's option-bag style mixes all three.

**Decision.** Provide three distinct helpers in `src/utils/index.d.mts` (their long doc-comments explain when to pick each). `IntentionalPartial` is itself an alias for `Partial<T>` — its purpose is to make audit easy.

**Consequences.** Picking the wrong one produces real bugs. Authors must read the helper picker section in `src/utils/index.d.mts` or in [conventions.md](conventions.md).

---

## ADR-007: Maintain compatibility with both `tsc` and `tsgo`

**Recorded:** 2026-05-25. **Originated:** with `@typescript/native-preview` adoption (approximate).

**Context.** The Go-based `tsgo` rewrite type-checks the same project meaningfully faster, but is still in preview and behaves differently in edge cases.

**Decision.** Both must pass in CI. `npm run typecheck` uses `tsgo`. The lint job runs the standard suite. A separate CI step runs raw `tsc` with `--exactOptionalPropertyTypes false` to catch a class of regression that the strict setting hides.

**Consequences.** Type expressions that trip `tsgo` bugs must be worked around with TODO references to the upstream tsgo issue (see [bugs.md](bugs.md) for examples). Both runners stay green.

---

## ADR-008: Two entry points — strict (`fvtt-types`) and lenient (`fvtt-types/lenient`)

**Recorded:** 2026-05-25. **Originated:** long-standing.

**Context.** Globals like `game` are only valid after the `init` hook. Modelling this strictly forces a type guard on every access; modelling it loosely loses correctness. Different users want different defaults.

**Decision.** Default entry point is strict. `fvtt-types/lenient` pre-merges `AssumeHookRan` so all globals are typed as their initialized form. `src/index-lenient.d.mts` is in the `tsconfig.json` `exclude` list so the lenient mode does not mask internal type errors.

**Consequences.** Two surfaces to keep coherent. `src/index-lenient.d.mts` must not introduce new types — it only adjusts `AssumeHookRan`. Cross-references: see [bugs.md § Lenient mode masking](bugs.md) if symptoms suggest the wrong entry point is being typechecked.

---

## ADR-009: ESLint warnings (not errors) for the document/placeable indirection rules

**Recorded:** 2026-05-25. **Originated:** current setting at time of record.

**Context.** Making the document/placeable rules errors would block too many in-progress files and tests where direct references are intentional.

**Decision.** Use `warn`. The `directExpressionSelector` is also intentionally relaxed (the `allowedPropsRegex` parameter is currently unused — see the comment in [eslint.config.js](../../eslint.config.js)).

**Consequences.** Reviewers must still notice and call out unjustified bare-document references. Tightening to `error` is a deliberate future step — not yet taken.

---

## ADR-010: Remove the `Temporary` document concept for v14

**Recorded:** 2026-05-25. **Originated:** 2026-05-25 (during v14-migration planning).

**Context.** In v13, a create operation could be `temporary: true`, producing an in-memory, unsaved document (`_id: null`). The types modelled this with a `Temporary` type parameter and a `X.TemporaryIf<Temporary>` helper threaded through ~234 sites (`CreateOperation`, `CreateReturn`, `PreCreateOptions`, `BackendCreateOperation`, `CreateDialogReturn`, and the `Document.TemporaryIfForName` dispatcher). Foundry **v14 removed the `temporary` create option entirely** — `DatabaseCreateOperation` (`common/abstract/_types.mjs`) no longer has the field, and `createDialog` returns `Promise<Document | null>` (always stored, or null). The repo's `Temporary` machinery is now stale v13 modeling. See [migration-v14.md](migration-v14.md).

**Decision.** Remove the `Temporary` / `TemporaryIf` concept across the type surface. Creates resolve to `X.Stored`. Done in two steps: the bounded `createDialog`-return slice (migration Phase 1) first, then the full removal rooted in the `common/abstract/document.d.mts` boundary file (Phase 2, under human review).

**Consequences.** This is a **breaking change** for downstream consumers that reference `X.TemporaryIf` or pass a `Temporary` type argument — those references must be dropped or replaced with `X.Stored`. It simplifies the create surface considerably (one fewer type parameter on a large family of helpers). Because it touches the `document.d.mts` boundary file at ~234 sites, it carries real regression risk and is gated behind the Phase 2 human review. Cross-reference: [context.md § Temporary vs Stored document](context.md).

---

## Anti-patterns (architectural approaches considered and rejected)

- **Single global `declare global { ... }` block for all Foundry globals.** Considered for simplicity — rejected because it forced every module/system consumer to pollute their own globals and made tree-shaking unreliable. Globals are introduced narrowly in `src/configuration/globals.d.mts`.
- **Re-exporting `type-fest` as the utility surface.** Considered to avoid reinventing helpers — rejected because it tied the public type surface to an external versioning cadence and several `type-fest` helpers (`PartialDeep`, etc.) had subtly wrong semantics for our use case. The `no-restricted-imports` rule blocks `type-fest` imports outside dev tooling.
- **Single `documents.d.mts` file listing every Document.** Considered to avoid the deep tree — rejected because it scaled poorly during v9/v10 migrations and made conflict resolution impossible during version bumps.
- **Auto-generated types from Foundry's JSDoc.** Considered — rejected because Foundry's JSDoc is incomplete, sometimes incorrect, and lacks the variance/branding nuance these types require. The maintained hand-written types catch bugs the JSDoc never could.

## How to contribute to this file

Update this file when:

- A decision crosses files or affects the public surface.
- A previously-tried architectural approach is rejected (add to Anti-patterns with a brief reason).
- A decision becomes the documented cause of a [bugs.md](bugs.md) entry — cross-reference it.

Date-stamp every new entry (`YYYY-MM-DD`). Keep ADRs short — Context, Decision, Consequences. Link out for details.
