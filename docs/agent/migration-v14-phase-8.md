# Phase 8 — Cleanup (repo-wide) — detail

> Per-phase detail for the v14 migration. Slim tracker: [migration-v14.md](migration-v14.md). Closed phases: [migration-v14-archive.md](migration-v14-archive.md).

**Status:** DONE (pragmatic high-value scope) — CI green. **Risk:** realized Low — the `removed in v14` pass was done as remove-accuracy-wins / keep-and-reword-migration-aids (maintainer-agreed 2026-05-28), so it is **not** a breaking change.

## Progress

- **2026-05-28 — `package.json` version bumped `13.346.0` → `14.363.0`** (matches the v14.363.0 ground-truth build). The cheap P8 "bump to 14.x" usability win (item 2 below), pulled forward. CI green. The publish workflow appends `-beta.<timestamp>` for prereleases.

- **2026-05-28 — the `removed in v14` prune (item 1) — DONE, non-breaking** (commit `13dda9913`). Decided with the maintainer (see the scope question in this session): rather than the originally-feared breaking bulk-removal of the operation-alias renames, the pass **removes only category (b) accuracy wins** (members the v14 runtime genuinely removed / hard-privatised — verified absent against the v14.363.0 source) and **keeps category (a) migration aids, rewording** their now-stale `will be removed in v14` note → `removed in a future version`. Net: 79 files, +763 / −1270. CI green (typecheck, `tsc --eOPT false`, raw tsgo, eslint, prettier, test-types).
  - **Removed (b):** v12-deprecated `globalThis` re-exports in `client.d.mts` (`duplicate`, `Semaphore`, `orient2dFast`, `benchmark`, `deepClone`, `debounce`, `expandObject`, … — all dropped from v14 `client/client.mjs`); the hard-private `: never` placeholders across `client-keybindings`, `keyboard-`/`gamepad-`/`mouse-manager`, `chevron`, `pulse`, `nue-manager`, `tour`, `localization`, `chat-message`, `cards`, `actor`, `scene`, `playlist`, the `compendium`/`users`/`folders`/`scenes` collections, `audio/helper`, `ray`, prosemirror `highlight-matches`, `fields`; functional members absent in v14 (`Game#template`, `System#template`, `ChatMessage#user`, `ActiveEffect#icon` get/set, `ApplicationV2#bringToTop`, handlebars `colorPicker`/`select`, `BaseGrid#measureDistances` + `Segment`); the "removed without replacement in v13" stubs (`hooks` `initializeDarknessSources`, `combat-encounters` `_onDeleteToken`, `actors` `clearPrototypeToken`, `document-tags` `_validateDocument`, **`embedded-collection` `update`/`_createOrUpdate`** + **`embedded-collection-delta` `_createOrUpdate`** — the inherited P3 deferrals, now actioned). Narrowed editor `engine` to `"prosemirror"` (TinyMCE gone in v14). Updated `active-effect.test-d.ts`.
  - **Kept + reworded (a):** all ~760 operation-alias renames, the `_onXDocuments` operation-**bag** interfaces, residual deprecated type aliases, and the deprecated-but-still-present-in-v14 members (FormApplication FilePicker methods, handlebars `filePicker`, `StatusEffect.icon` — each verified present in the v14 source). These are TS-only / still-functional migration aids; keeping them eases v13→v14 migration with zero accuracy cost.

## Remaining (explicitly non-gating — Phase 8 closed without these)

1. **`_onCreateDocuments`/`_onUpdateDocuments`/`_onDeleteDocuments` static methods** (3 base in `document.d.mts` typed `never`, 35 leaf `override`s in `common/documents/*`): the v14 runtime removed these, but they are deprecated `protected static` **migration aids** for subclass authors, and structural removal cascades into the `document.d.mts` boundary type machinery (the `Extract`-branch `OnCreateDocumentsOperation` derivation carries `// TODO: remove ... in v14`). Per CLAUDE.md this boundary needs **explicit human sign-off** → kept, deferred to a coordinated boundary pass. They still carry stale `(since v12, until v14)` notes (see item 2).
2. **`until v14` markers (~210)** — a separate deprecation-window bucket (distinct from `removed in v14`). Now stale post-v14; reword opportunistically (`until v14` → `until a future version`) or drop the window. Includes the item-1 method notes.
3. **`TypedObjectField` create-optionality** (inherited P3 deferral, **not phase-gated**): give `TypedObjectField` `SchemaField`'s implicit-`{}`-initial so a required one isn't wrongly required in `CreateData`, then drop the per-field workaround at `client/documents/token.d.mts` `detectionModes` (`{ initial: Record<string, never> }`). The workaround works correctly today; this is an ergonomic `fields.d.mts` enhancement, action when convenient.
4. **Member-order parity** on `scene`/`active-effect` — out of scope per the [scope-priority decision](migration-v14.md#scope-priority).

## Scope

1. **Remove `@deprecated … removed in v14` types** now that we target v14.
2. ✅ **Bump `package.json` to `14.x`** — done (`14.363.0`).
3. **Verify remaining v13-flavored comments / backfill tests** — the concrete v13-comment risk (the `removed in v14` deprecation notes) is handled by the prune above; broader per-file source-diffing was done in P3–P7. `active-effect.test-d.ts` updated for the removed `icon`. No further backfill required for the closed scope.
4. ✅ **Inherited deferred-stub removals** — `embedded-collection`/`embedded-collection-delta` stubs removed in commit `13dda9913` (see Progress). The `TypedObjectField` deferral is **not phase-gated** → moved to the Remaining list above.

## How the `removed in v14` decision was reached

The originally-feared bulk was the **database-operation type-alias renames** (`CreateDocumentsOperation`→`CreateOperation`, etc., ~20×/document file). Investigation showed these are **TS-only convenience aliases**, not runtime members — so keeping them costs nothing in v14 accuracy and actively eases migration, while removing them would be a pure breaking change. The maintainer chose **keep-and-reword (a) / remove-accuracy-wins (b)** accordingly (see Progress + Remaining). Regenerate the raw inventory anytime with `grep -rn "removed in a future version\|until v14" src/`.
