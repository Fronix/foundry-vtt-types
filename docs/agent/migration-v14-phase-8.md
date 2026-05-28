# Phase 8 — Cleanup (repo-wide) — detail

> Per-phase detail for the v14 migration. Slim tracker: [migration-v14.md](migration-v14.md). Closed phases: [migration-v14-archive.md](migration-v14-archive.md).

**Status:** Not started (one item pulled forward — see below). **Risk:** Low (mostly mechanical) — except the operation-alias bulk prune touches the `document.d.mts` boundary.

## Progress (pulled forward from P7)

- **2026-05-28 — `package.json` version bumped `13.346.0` → `14.363.0`** (matches the v14.363.0 ground-truth build). The cheap P8 "bump to 14.x" usability win (item 2 below), pulled forward. CI green. The publish workflow appends `-beta.<timestamp>` for prereleases. The ~892-occurrence `removed in v14` prune (item 1) remains — a breaking change, left for a deliberate coordinated P8 pass.

## Scope

1. **Remove `@deprecated … removed in v14` types** now that we target v14.
2. **Bump `package.json` to `14.x`** — currently `13.346.0`, so the package presents to npm/consumers as v13. _Per the [usability discussion](migration-v14.md#scope-priority), this is the single highest-leverage near-zero-effort item — pull it forward._
3. Verify remaining v13-flavored comments against the v14 source; backfill missing tests.
4. The inherited deferred-stub removals (below).

## Removal inventory (the `removed in v14` prune — measured 2026-05-27)

`grep -rn "removed in v14" src/` → **~892 occurrences across 78 files**. Regenerate the list anytime with that grep. It is **a few repeated patterns, not 892 decisions** — split into two kinds:

### (a) Cosmetic / breaking-change cleanup — the bulk (~600+), DEFER-safe

The deprecated **database-operation type-alias renames**: `CreateDocumentsOperation`→`CreateOperation`, `OnDeleteOptions`→`OnDeleteDocumentsOperation`, `GetDocumentsOperation`→`GetOperation`, etc. — repeated ~20–24× across all 36 `client/documents/*.d.mts` files (that's why every document file shows ~20–21 hits). These are **harmless** (deprecated names pointing at the renamed types), removing them is a **breaking change** for anyone still using the old names, and it touches the **`document.d.mts` boundary file** (needs care/human review). **Not a usability gate** — do as one coordinated mechanical pass.

### (b) Accuracy wins — smaller (~80–100), worth doing

Members Foundry actually **removed or made hard-private at runtime** that the types still expose — phrasings: `Made hard private in v13 (this warning will be removed in v14)`, `Removed in v13 / without replacement`, `since v12 … will be removed in v14`. These let a consumer reference something the v14 runtime doesn't have. Scattered; low-risk to remove.

Also: **216 `until v14` markers** are kept-but-deprecated members — mostly fine, tidy opportunistically (don't conflate with the above).

### Per-file hit counts (top of the list)

```
client/client.d.mts:41          common/abstract/document.d.mts:29
client/documents/chat-message:26  client/documents/cards:24  active-effect:24  actor:23
client/helpers/interaction/client-keybindings:21  + token/table-result/scene/region/
  region-behavior/playlist/macro/journal-entry-page/item/folder/combatant/combatant-group/
  combat/card/actor-delta : ~21 each   (the operation-alias pattern)
~20 each: wall/user/tile/setting/roll-table/playlist-sound/note/measured-template/
  journal-entry/journal-entry-category/fog-exploration/drawing/ambient-sound/ambient-light/adventure
single-digit: chevron(10), keyboard-manager(6), gamepad-manager(6), nue-manager(5), pulse(5),
  highlight-matches(4), fields(4), localization(4), form-application-v1(4), …
```

## Inherited deferrals (action these in Phase 8)

_Folded in from the old central deferrals table. When you action one, strike it and note the commit._

| Deferred item                                                                                                                                                                                                             | From → To                        | Why deferred                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Deprecated-stub removals: `embedded-collection.d.mts` `update`/`_createOrUpdate`, `embedded-collection-delta.d.mts` `_createOrUpdate` ("removed in v13, warning removed in v14")                                          | **3 → 8**                        | Gone from v14 source; pure cleanup-phase work.                                                                             |
| `TypedObjectField` create-optionality: give it `SchemaField`'s implicit-`{}`-initial so a required `TypedObjectField` isn't wrongly required in `CreateData`, then drop the per-field workaround (`token.detectionModes`) | **3 → fields.d.mts improvement** | Candidate `common/data/fields.d.mts` improvement found during token schema work; action when convenient (not phase-gated). |
