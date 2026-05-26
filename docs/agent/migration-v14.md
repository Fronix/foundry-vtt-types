# v14 Migration Plan & Tracker

## When to consult this file

This is the **single source of truth** for the Foundry v13 → v14 type migration: the phased roadmap, the per-file status, and the definition of "done". Consult it before starting any v14 migration work, and update it as files are completed.

Ground truth for every decision below is the Foundry v14.363.0 source at `/home/fronix/git/foundry/resources/app/` (`client/`, `common/`, `public/scripts/`). When the source disagrees with this plan, the source wins — fix the plan.

## Definition of "done" (the per-file bar)

A file counts as **migrated to v14** only when all three hold:

1. **Source-diffed** — its members (order, signatures, additions, removals) have been compared against the corresponding v14 `.mjs` file. Member order matches the source (per [conventions.md](conventions.md)).
2. **CI-green** — passes the full gate: `npm run typecheck` (tsgo), `npx tsc --exactOptionalPropertyTypes false`, raw `npx tsgo`, `npm run lint`, `npm run test-types`.
3. **Type-tested** — a `.test-d.ts` exercises the changed/added surface (extend the existing one or add a new mirror under `tests/foundry/`).

CI-green alone is **not** sufficient — CI does not know the v14 source, so silent v13 drift survives it. The diff is what catches drift.

## Sequencing principle

**Foundation-up by layer.** Lower layers are verified before the layers built on them: `common/abstract` → `common/documents` → `client/documents` → `client/canvas` → `client/applications` → greenfield (`vfx`, region-behaviors) → cleanup. The new `canvas/vfx/` subsystem (no v13 analog, no current consumers) is intentionally last.

## Branch & merge strategy (applies to every phase)

**All v14 work lives on a single long-running `v14` branch (off `main`). Commit every phase directly onto `v14` — do NOT cut per-phase branches.**

> History note: Phases 1–3 were originally done on stacked per-phase branches (`v14/createDialog-stored` → `v14/remove-temporary` → `v14/verify-common`). On 2026-05-26 those were collapsed into a single `v14` branch (the stack was already linear, so nothing was lost; the old labels were deleted, their commits remain in `v14`'s history with `(Phase N)` in the messages). The stacked scheme was abandoned because the only thing it bought was per-phase PR granularity, which isn't worth the ceremony on a solo fork.

The stack was always linear (each phase only ever appended commits), so there was never a merge-**conflict** problem to solve — `v14` is simply that linear history under one name. When the migration (or a chosen checkpoint) is ready, merge `v14` into `main` in one fast-forward. `main` does not drift independently (fork-only), so the merge stays conflict-free.

**Remote:** push only to `origin` (the Fronix fork) — never `upstream` (League). As of the collapse, `v14` is local-only; the stale `origin/v14/createDialog-stored` (the old Phase-1 push) can be deleted whenever convenient.

## The migration landscape (baseline, 2026-05-25)

Measured against v14.363.0. Directory structure already mirrors v14 1:1 — **no restructuring needed**; this is a content-accuracy migration.

| Category                                          | Size                                                                   | Concentration                                                                                                                                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Missing files** (in v14 source, absent here) | 97                                                                     | new `canvas/vfx/` (~21), placeable UI: `applications/sheets/palette/` (8), `applications/sidebar/tabs/` (10), `.../filters/` (4); `data/region-behaviors/` (4); misc canvas/elements/ux |
| **B. Stub files** (`@remarks TODO: Stub`)         | 65                                                                     | ~98% in `applications/` (HUD, sidebar, sheets, settings menus); 2 in `data/`                                                                                                            |
| **C. In-file drift**                              | ~34 docs (createDialog `.Stored`) + ~200 `Temporary` sites + scattered | `client/documents/`, `common/abstract/document.d.mts`, canvas                                                                                                                           |

Files in the repo but not in v14 source (19) are almost all barrel/index files and renames (`quad-tree`→`quadtree`, `region-legend` removed, `measured-template` moved) — handled opportunistically within the relevant phase, not a category of their own.

---

## Roadmap

| Phase | Scope                                                                                                                                                                                                                                                                                                                                                                                                                  | Layer                                                  | Risk                                                    | Status                                                                                                                                                                                                                                                                                                                                                         |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| **1** | `createDialog` v14 signature: return `.Stored                                                                                                                                                                                                                                                                                                                                                                          | null`, add 4th `renderOptions` param (34 docs + mixin) | client/documents                                        | Low (bounded, mechanical)                                                                                                                                                                                                                                                                                                                                      | **Done — CI green** |
| **2** | Remove the `Temporary` create-operation concept entirely (~200 sites; v14 dropped `temporary` from `DatabaseCreateOperation`)                                                                                                                                                                                                                                                                                          | common/abstract (boundary) + documents                 | **High — touches `document.d.mts`, needs human review** | **Done — CI green** (branch `v14/remove-temporary`, stacked on Phase 1; 85 files, +1041/−1872)                                                                                                                                                                                                                                                                 |
| **3** | Verify `common/abstract` (`DataModel`, `Document`, fields) + `common/documents` base schemas against v14                                                                                                                                                                                                                                                                                                               | common                                                 | High (boundary files)                                   | **DONE (modulo documented cross-phase deferrals) — CI green.** `common/abstract` 10/10 (incl. `document.d.mts` verified-clean), `common/data` complete (fields + shapes + validation + DataModelSchemaField), `common/documents` schemas done. Deferred: Scene Levels + **MeasuredTemplate reconciliation** + BaseLevel → Phase 7; wall EDGE rename → Phase 5. |
| **4** | Verify `client/documents` leaf classes member-by-member to the done bar (Phases 1–2 already touched them)                                                                                                                                                                                                                                                                                                              | client/documents                                       | Medium                                                  | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **5** | Canvas: verify existing + fill canvas stubs + add missing canvas files (**excluding vfx**)                                                                                                                                                                                                                                                                                                                             | client/canvas                                          | Medium                                                  | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **6** | Applications: fill the 65 stubs (HUD, sidebar, sheets, settings menus) + add missing application files (palette / sidebar-tabs / filters / ux / elements)                                                                                                                                                                                                                                                              | client/applications                                    | Medium (volume)                                         | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **7** | Greenfield: new `canvas/vfx/` (~21 files), `data/region-behaviors/`, remaining missing files, **+ the v14 Scene Levels subsystem** (see note below) **+ the MeasuredTemplate→client deprecation** (from Phase 3: move `BaseMeasuredTemplate` common→client as `@deprecated since v14`, drop its common `_module`/`_types` exports, un-embed it from Scene — all coordinated with the Scene embedded-collection rework) | client/canvas, client/data, common                     | Medium–High (authoring from scratch)                    | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **8** | Cleanup: remove `@deprecated … removed in v14` types now that we are v14; verify remaining v13-flavored comments; backfill tests; bump `package.json` to `14.x`                                                                                                                                                                                                                                                        | repo-wide                                              | Low                                                     | Not started                                                                                                                                                                                                                                                                                                                                                    |

Phases are expanded into per-file checklists when they are reached (keeping this doc legible). Phase 1 is fully enumerated below.

---

## Phase 1 — detail: `createDialog` → v14 signature

### What changed in v14 (verified against source)

- `ClientDocument.createDialog` (`client/documents/abstract/client-document.mjs:763`) returns `Promise<Document | null>` — **always a stored document** or `null`. There is no `temporary` path.
- It gains a **4th parameter `renderOptions={}`** (forwarded to the created document's sheet render): `createDialog(data, createOptions, {folders, types, template, context, ...dialogOptions}, renderOptions)`.
- The 2nd parameter `createOptions` is a `DatabaseCreateOperation` (note: in v14 that type no longer has `temporary` — but the full removal of `Temporary` is **Phase 2**, not here).
- The v13 deprecated calling convention is retained until **v15** (`CreateDialogDeprecatedOptions` is marked "removed in v15"), so **do not delete the deprecated path in this phase**.

### The change, per file

1. In each document namespace, change `CreateDialogReturn` from taking a `Temporary` type parameter and resolving via `TemporaryIf<Temporary>` to inlining `.Stored`:
   - Before: `type CreateDialogReturn<Temporary, Config> = Document.CreateDialogReturn<X.TemporaryIf<Temporary>, Config>;`
   - After: `type CreateDialogReturn<Config> = Document.CreateDialogReturn<X.Stored, Config>;`
   - Remove the now-redundant `// TODO: inline .Stored in v14 instead of taking Temporary` comment.
2. Add the `renderOptions` 4th parameter to the `createDialog` signature surface (the mixin overload at `client-document.d.mts:483` and any per-document override). Type it against the document sheet's render options.
3. Update/extend each document's `*.test-d.ts` to assert the return is `.Stored | null` and that `renderOptions` is accepted.

Keep `common/abstract/document.d.mts` edits **surgical** — only what `Document.CreateDialogReturn` requires. Anything deeper (the `Temporary` plumbing) is Phase 2.

### Phase 1 file checklist (34 documents + mixin)

- [x] `client/documents/abstract/client-document.d.mts` (base `createDialog` overload + `renderOptions` param)
- [x] `client/documents/active-effect.d.mts`
- [x] `client/documents/actor.d.mts`
- [x] `client/documents/actor-delta.d.mts`
- [x] `client/documents/adventure.d.mts`
- [x] `client/documents/ambient-light.d.mts`
- [x] `client/documents/ambient-sound.d.mts`
- [x] `client/documents/card.d.mts`
- [x] `client/documents/cards.d.mts`
- [x] `client/documents/chat-message.d.mts`
- [x] `client/documents/combat.d.mts`
- [x] `client/documents/combatant.d.mts`
- [x] `client/documents/combatant-group.d.mts`
- [x] `client/documents/drawing.d.mts`
- [x] `client/documents/fog-exploration.d.mts`
- [x] `client/documents/folder.d.mts`
- [x] `client/documents/item.d.mts`
- [x] `client/documents/journal-entry.d.mts`
- [x] `client/documents/journal-entry-category.d.mts`
- [x] `client/documents/journal-entry-page.d.mts`
- [x] `client/documents/macro.d.mts`
- [x] `client/documents/measured-template.d.mts`
- [x] `client/documents/note.d.mts`
- [x] `client/documents/playlist.d.mts`
- [x] `client/documents/playlist-sound.d.mts`
- [x] `client/documents/region.d.mts`
- [x] `client/documents/region-behavior.d.mts`
- [x] `client/documents/roll-table.d.mts`
- [x] `client/documents/scene.d.mts`
- [x] `client/documents/setting.d.mts`
- [x] `client/documents/table-result.d.mts`
- [x] `client/documents/tile.d.mts`
- [x] `client/documents/token.d.mts`
- [x] `client/documents/user.d.mts`
- [x] `client/documents/wall.d.mts`

### Phase 1 exit criteria

All 35 boxes checked to the done bar; `grep -r "inline .Stored in v14" src/` returns nothing; full CI green.

---

## Phase 2 — detail: remove the `Temporary` create-operation concept

### What changed in v14 (verified against source)

- `DatabaseCreateOperation` (`common/abstract/_types.mjs:114`) has **no `temporary` field**.
- `DocumentCloneOptions` (`common/abstract/_types.mjs:206`) has **no `temporary`** (`save`/`keepId`/`addSource`/`discardInvalidEmbedded`).
- `importFromCompendium` (`client/documents/abstract/world-collection.mjs:80`) always returns a stored document.
- The `temporary?` field on `DatabaseBackend.CreateOperation` was deprecated "since v12, until v14" — removed now.

Net: every create/clone/import resolves to `.Stored` (or `null`/`undefined` on cancellation). The `Temporary` type parameter, `X.TemporaryIf<Temporary>`, and `Document.TemporaryIfForName` are all deleted. This is one **atomic** change — a half-removed type parameter does not typecheck, so there is no independently-compiling sub-slice.

### The change, by layer

1. **Core boundary files** (edit first, carefully):
   - `common/abstract/backend.d.mts` — drop `Temporary` type param + the `temporary?: Temporary` field from `CreateOperation`.
   - `common/abstract/_types.d.mts` — drop `Temporary` from the `CreateOperation` alias.
   - `common/abstract/document.d.mts` — drop `Temporary` from the 5 `*ForName` create lookups + `Internal.Lookup`; remove `"temporary"` from the `OnCreateOptions` / `OnCreateOperation` / `CloneContext` omits; remove the `temporary?` field from `ModificationContext`; **delete `TemporaryIfForName`**.
2. **`client/documents/*` (34)** — drop `Temporary` from `CreateOperation` + the 5 derived create interfaces, `OperationNameMap`, the deprecated `Create` alias, `CreateDialogDeprecatedOptions`, and the deprecated `createDialog` overload; collapse `CreateReturn<Data, Temporary>` → `CreateReturn<Data>` and the body's `TemporaryIf<Temporary>` → `.Stored`; **delete each `TemporaryIf`**.
3. **`common/documents/*` (34)** — drop `Temporary` from `create`/`createDocuments` overrides (return `.Stored` / `CreateReturn<Data>`); remove `export import TemporaryIf`.
4. **`client/documents/abstract/world-collection.d.mts`** — `importFromCompendium` returns `Document.StoredForName<DocumentName>`; drop `Temporary` from it and from `ImportFromCompendiumOptions`.
5. **Tests (~19 `.test-d.ts`)** — drop `Temporary` type args / `TemporaryIf` assertions; assert `.Stored`.

The deprecated v13 `createDialog` _calling convention_ (`CreateDialogDeprecatedOptions`, "until v15") stays — it only loses its now-pointless `Temporary` param.

### Phase 2 exit criteria

`grep -rn "Temporary" src/ tests/` returns only prose about "temporary Users" / "temporary documents" (the runtime concept), never a `Temporary` type parameter, `TemporaryIf`, or `TemporaryIfForName`. Full CI green.

### Merge plan

**Superseded** (2026-05-26): per-phase branches were collapsed into the single `v14` branch — see [Branch & merge strategy](#branch--merge-strategy-applies-to-every-phase). Phases 1–3 now live as linear history on `v14`; merge `v14` → `main` once when ready.

---

## Phase 3 — detail: verify `common/abstract` + `common/data` (fields) + `common/documents` base schemas

Branch `v14/verify-common`, stacked on `v14/remove-temporary` (Phase 2). Diffed against Foundry **v14.363.0** at `/home/fronix/git/foundry/resources/app/`.

### Scope decisions (recorded at phase start)

- **In scope:** every `common/abstract/*.d.mts`, the `common/data/*.d.mts` field/schema infrastructure ("fields"), and every existing `common/documents/*.d.mts` base-schema file (34).
- **Deferred to Phase 7 (missing files, not drift):** `common/documents/level.mjs` (new v14 `Level` Document — also needs client class + CONFIG wiring), `common/data/active-effect.mjs`, `common/data/operators.mjs`. None exist in the repo yet; authoring new files is greenfield work.
- **Structural note — where schemas physically live:** the canonical per-document `Schema` interface (the field-by-field `DataSchema`) is authored in the **client** namespace (`client/documents/<doc>.d.mts`, `declare namespace <Doc> { interface Schema … }`) and the common `Base<Doc>` document re-imports it via `export import Schema = <Doc>.Schema`. The source of truth for the field list is `common/documents/<doc>.mjs::defineSchema()`. So verifying a "base schema" touches **both** the common base file (class shape, `Metadata`, `defineSchema` return, hierarchy) and the client file's `Schema` interface. Editing those `Schema` interfaces here is Phase 3 work; Phase 4 still owns the client leaf classes' **methods/members**.

> **Checkbox legend:** `[x]` = verified to the done bar & committed; `[~]` = partially done (see note); `[ ]` = not started. **NEXT UP is everything still `[ ]`/`[~]` below.**

### `common/abstract` checklist (10) — 10/10 done

- [x] `_module.d.mts`
- [x] `_types.d.mts`
- [x] `socket.d.mts`
- [x] `singleton-collection.d.mts`
- [x] `embedded-collection.d.mts`
- [x] `embedded-collection-delta.d.mts`
- [x] `type-data.d.mts`
- [x] `data.d.mts` — `DataModel`; internals deliberately unmodeled (noted above)
- [x] `backend.d.mts` — `DatabaseBackend`
- [x] `document.d.mts` — **boundary file, verified clean (no code change needed beyond the earlier `Metadata.baseTypeAllowed` add in `a3d8b71a2`).** Verified via method-name diff vs v14 `document.mjs` (only `_preCleanData`/`_updateDiff` are source-only — protected DataModel pipeline internals the repo omits by policy) + `Document.Metadata` field-by-field against v14 `DocumentClassMetadata` (all 12 fields present: name/label/coreTypes/collection/embedded/permissions/hasTypeData/baseTypeAllowed/indexed/compendiumIndexFields/preserveOnImport/schemaVersion). CRUD/createDialog signatures already covered by Phases 1–2.

### `common/data` checklist (6) — 5/6 done (6th is Phase-7-blocked only)

- [~] `_module.d.mts` — verified clean; only diff is the Phase-7-deferred `export * as operators from "./operators.mjs"` (operators.mjs not authored yet).
- [x] `_types.d.mts` — non-exporting discoverability stub (commit `80a7c9f59`). Added `TypedObjectFieldOptions`, `GridOffsetFieldOptions`, `GridOffsetsFieldOptions`. The 4 DataModel cleaning/update/sanitization pipeline typedefs (`DataModelCleaningOptions`, `DataModelUpdateState`, `DataModelSanitizationOptions`, `EmbeddedCollectionUpdateContext`) map to deliberately-unmodeled DataModel internals — documented in a comment rather than aliased.
- [x] `validation-failure.d.mts` — v14 rewrite (commit `b4924a4d1`). Constructor `(message, options)`; `fallback`→`fallbackValue` + `isEmpty()`→`empty` getter (old names `@deprecated` until v16); added `fieldPath`/`joint`/`options`/`copyTo`/`getFailure`/`getAllFailures`/`logAsTable`/`asHTML`; Error class gains the same query methods + `toString`.
- [x] `validators.d.mts` — verified clean (5 functions, same order; commit `b4924a4d1`).
- [x] `data.d.mts` — done (commits `946efd4ba` shapes, `b70522096` PrototypeTokenOverrides). `BaseShapeData.Types` now 10; authored the 6 new shapes (`Emanation`/`Cone`/`Ring`/`Line`/`Token`/`Grid`ShapeData) + reworked the 4 existing (gain `gridBased`, `anchorX/Y`, `origin`, `min:0`); `BaseShapeData` gains `LOCALIZATION_PREFIXES` + internal `_index`; added `PrototypeTokenOverrides` (per-Actor-type setting model, full static API); `PrototypeToken.LOCALIZATION_PREFIXES` → `["DOCUMENT","TOKEN"]`. Type-tested in `data.test-d.ts`; `region.test-d.ts` shape union grown to 10. NB: `ConeShapeData.curvature`/`TokenShapeData.shape` + the `PrototypeTokenOverrides` display fields use the explicit-type-param branded-choice pattern (FIXME, same as token.d.mts).
- [x] `fields.d.mts` — done. All 4 missing classes authored: `GridOffsetField`/`GridOffsetsField`/`ShapesField` (`50b766c02`) + `DataModelSchemaField` base inserted between `SchemaField` and `EmbeddedDataField` (`f22886e35`, namespace thin-aliased so `EmbeddedDataField.*` refs are unchanged; `validate` kept on `EmbeddedDataField` since v14 overrides it on neither — conservative). Member-by-member verification done via method-name diff vs v14 `fields.mjs` (`5326ad0d9`): only real public gap was `SchemaField.extendFields`/`removeFields`/`expandObject`/`reconstructOperator` (added); everything else source-only is protected-internal plumbing the repo omits by policy. (`SceneLevelsSetField` is Phase 7.)

### `common/documents` base-schema checklist (34) — 31/34 done (3 deferred/remaining)

- [~] `_module.d.mts` — **all remaining work deferred to Phase 7.** v14 moved `BaseMeasuredTemplate` out of `common/` into the client `measured-template.mjs` (now `@deprecated since v14`) and dropped its `_module` export; `_module.mjs` also adds `BaseLevel`. Both edits cascade into the un-migrated `Scene` (which still embeds `MeasuredTemplate`) → deferred to Phase 7 with the Scene rework (same no-deprecated-cascade rationale as wall's EDGE rename → Phase 5).
- [~] `_types.d.mts` — **deferred to Phase 7.** v14 removed the `MeasuredTemplateData` typedef (repo still has `MeasuredTemplateData = MeasuredTemplateDocument.InitializedData`); `PrototypeTokenData` is a `unknown` stub (also gone in v14). Removing them cascades into Scene → Phase 7. `LevelData`/`LevelTexture` are Phase 7.
- [x] `active-effect.d.mts`
- [x] `actor.d.mts`
- [x] `actor-delta.d.mts` (clean)
- [x] `adventure.d.mts`
- [x] `ambient-light.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `ambient-sound.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `card.d.mts`
- [x] `cards.d.mts`
- [x] `chat-message.d.mts`
- [x] `combat.d.mts`
- [x] `combatant.d.mts`
- [x] `combatant-group.d.mts` (clean)
- [x] `drawing.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `fog-exploration.d.mts`
- [x] `folder.d.mts` (clean)
- [x] `item.d.mts` (clean)
- [x] `journal-entry.d.mts`
- [x] `journal-entry-category.d.mts` (clean)
- [x] `journal-entry-page.d.mts` (clean)
- [x] `macro.d.mts` (clean)
- [~] `measured-template.d.mts` — **deferred to Phase 7.** v14 reality (discovered this session): there is **no** `common/documents/measured-template.mjs` — `BaseMeasuredTemplate` lives in the client `measured-template.mjs` as a `@deprecated since v14` shim (frozen `schemaVersion: "13.341"`, still `isEmbedded`/`collection: "templates"`). Annotating/moving it cascades `no-deprecated` errors into Scene (Phase 7) + the client MeasuredTemplate (Phase 4) + canvas (Phase 5), so it defers with the Scene embedded-collection rework (Phase 7).
- [x] `note.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `playlist.d.mts`
- [x] `playlist-sound.d.mts` (clean)
- [x] `region.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `region-behavior.d.mts`
- [x] `roll-table.d.mts`
- [~] `scene.d.mts` — **mostly deferred to Phase 7** (Levels rework + background/foreground shim + `levels` collection).
- [x] `setting.d.mts` (clean)
- [x] `table-result.d.mts` (clean)
- [x] `tile.d.mts` (non-Levels parts; `levels` → Phase 7)
- [x] `token.d.mts` (non-Levels parts; `level` → Phase 7)
- [x] `user.d.mts` (clean)
- [~] `wall.d.mts` — **deferred**: `levels` → Phase 7; `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` rename → Phase 5 (canvas edges).

### Phase 3 drift survey (2026-05-25)

Done so far (typecheck + test-types green):

- **`common/abstract` (committed `b2fa434b1`):** `socket.d.mts` (+`timestamp`, +`sideEffect`), `embedded-collection.d.mts` (+`manages`), `type-data.d.mts` (+`onEmbed`), `data.d.mts` DataModel (+`getFieldForProperty`), `backend.d.mts` `CreateOperation` (+`controlObject`). `_module`/`_types` (abstract) clean.
- **Boundary file (uncommitted, awaiting human review):** `common/abstract/document.d.mts` — `Document.Metadata` gains `baseTypeAllowed?: boolean` (`:~2196`, after `hasTypeData`). Source `DocumentClassMetadata` (`_types.mjs`).
- **Metadata-only doc fixes (uncommitted):** `baseTypeAllowed` set per source — `true` on combatant-group/combatant/card/chat-message/combat/active-effect, **`false` on item/actor** (survey wrongly said item=true; source verified). `cards` permission `create: "CARDS_CREATE"`. `BaseCombatant`/`BaseJournalEntry` gain `LOCALIZATION_PREFIXES`. `region-behavior` `schemaVersion` → `14.352` (schema confirmed clean). NB: `schemaVersion` is **not** bumped independently for field-drifted docs — it moves with the field fix (else the type falsely claims v14).

**`DataModel` internals deliberately left unmodeled (human-review note):** `_preCleanData`, `_cleanData`, `_getInnerModel`, `_preUpdateSource`, `_updateDiff`, `_updateCommit` — protected `updateSource`/`cleanData` plumbing, consistent with the repo's existing omission policy.

**Phase 8 candidates found:** `embedded-collection.d.mts` `update`/`_createOrUpdate` and `embedded-collection-delta.d.mts` `_createOrUpdate` are deprecated stubs ("removed in v13, warning removed in v14") — gone from v14 source.

#### `common/documents` schema drift (34 docs surveyed)

**Clean (12):** actor-delta, combatant-group, folder, item, journal-entry-category, journal-entry-page, macro, playlist-sound, region-behavior, setting, table-result, user.

**THE BIG DISCOVERY — v14 Scene Levels subsystem (unplanned, cross-cutting).** v14 added a `Level` embedded document and reworked elevation/levels across the canvas. This entangles Phase 3 with Phase 7 (which owns the new `Level` document):

- New field type **`SceneLevelsSetField`** (extends `SetField`) — not in repo `fields.d.mts`. Used as a `levels` field on: ambient-light, ambient-sound, drawing, note, region, tile, wall.
- **Scene** schema heavily reworked: REMOVED `background`/`foreground`/`foregroundElevation`/`backgroundColor`/`fog.exploration`/`fog.overlay` (now shims from `levels[0]`); ADDED `shiftX`/`shiftY`/`initialLevel`/`fog.mode`/`transition`/`levels: EmbeddedCollectionField(BaseLevel)`; metadata `embedded` drops `MeasuredTemplate`, adds `Level: "levels"`; `defaultLevelId`.
- **Token** gains `level: DocumentIdField` (references a Level id) and `depth` in `#defineMovementFields`.
- `_module.d.mts` must export `BaseLevel`, drop `BaseMeasuredTemplate`; `_types.d.mts` needs `LevelData`/`LevelTexture` typedefs.

**Non-Levels drift (the clearly-Phase-3 part):**

- _Metadata-only:_ widespread `schemaVersion` bumps (`"13.341"` → `"14.35x"`); `baseTypeAllowed: true` added on active-effect/card/chat-message/combat/combatant/combatant-group/item — **requires `Document.Metadata` to gain `baseTypeAllowed` (boundary file `document.d.mts:~2182`)**; adventure `compendiumIndexFields` (+caption/description/flags.core.sheetClass); active-effect `indexed`+`compendiumIndexFields`; `LOCALIZATION_PREFIXES` missing on `BaseCombatant` (`["DOCUMENT","COMBATANT"]`) and `BaseJournalEntry` (`["DOCUMENT","JOURNAL"]`).
- _Permissions:_ cards `create: "CARDS_CREATE"` (repo wrong `"OWNER"`); active-effect `create` is a `#canCreate` function (repo wrong `"OWNER"`).
- _Field add/restructure:_ active-effect — `changes` moved to `system`, `duration` restructured to `{value,units,expiry,expired}`, +`start`/`showIcon`/`folder`, `origin`→`DocumentUUIDField({relative:true})`. chat-message +`title`, `timestamp` opts (`nullable:true,initial:null`). combat +`name`. combatant +`roundJoined`. drawing +`name`/`interface`, `fontFamily` opts. ambient-light/ambient-sound +`name`/`locked` (and `levels`=Levels), ambient-sound `intensity` opts. note +`author`/`locked` (and `levels`=Levels), `fontFamily` opts. fog-exploration +`level` (DocumentIdField, **not** Level-doc-dependent) + field order (`user,scene`). region +`restriction`/`attachment`/`highlightMode`/`displayMeasurements`/`hidden`/`ownership`/`_shapeConstraints`/`elevation.topInclusive`, `visibility` initial→`LAYER_UNLOCKED`. tile `occlusion.mode`→`occlusion.modes: SetField`. token `detectionModes` Array→`TypedObjectField`, +`_movementHistory[].subpathId`, `width`/`height` lose `step:0.5` (PrototypeToken-only), `cost` `nullable:true`. roll-table `description`→`HTMLField`. playlist `channel` +`required:true`. wall `WALL_SENSE_TYPES`→`EDGE_SENSE_TYPES`, `WALL_DIRECTIONS`→`EDGE_DIRECTIONS`. measured-template is a v14 `@deprecated`-until-v16 shim proxying to Region.
- _Constants gaps (dependency, `common/constants.d.mts`):_ `REGION_VISIBILITY.OBSERVER`/`LAYER_UNLOCKED`, `EDGE_SENSE_TYPES`, `EDGE_DIRECTIONS`, (verify `FOG_EXPLORATION_MODES`).

> **Schema interfaces live in `client/documents/*.d.mts`** (per the structural note above), so fixing these edits Phase 4 files; coordinate the boundary.

#### Commits this session (all CI-green)

- `b2fa434b1` — common/abstract layer.
- `a3d8b71a2` — document metadata + `Document.Metadata.baseTypeAllowed` (boundary).
- `76a16aa7b` — non-Levels document schemas + constants + `DocumentUUIDField.relative` + test migrations.
- `b4924a4d1` — `common/data/validation-failure.d.mts` v14 rewrite + test; verified `validators.d.mts`/`_module.d.mts` clean.
- `50b766c02` — `common/data/fields.d.mts`: authored `GridOffsetField`/`GridOffsetsField`/`ShapesField` + `fields.test-d.ts` coverage.
- `946efd4ba` — `common/data/data.d.mts`: 10-shape `BaseShapeData` family (6 new + 4 reworked) + tests.
- `b70522096` — `common/data/data.d.mts`: `PrototypeTokenOverrides` + `PrototypeToken` localization fix.
- `80a7c9f59` — `common/data/_types.d.mts`: new field-option typedef maps.
- `f22886e35` — `common/data/fields.d.mts`: `DataModelSchemaField` base + `EmbeddedDataField` refactor.
- `5326ad0d9` — `common/data/fields.d.mts`: missing `SchemaField` public API (member verification).

- `f22886e35` / `5326ad0d9` — `common/data/fields.d.mts`: `DataModelSchemaField` + `SchemaField` public API.

**PHASE 3 IS COMPLETE** (modulo the documented cross-phase deferrals below), full CI green.

- `common/abstract` 10/10 — `document.d.mts` verified clean (method + Metadata diff vs v14; no change needed).
- `common/data` complete — validation-failure, validators, \_module, \_types, data.d.mts (10-shape family + PrototypeTokenOverrides), fields.d.mts (4 new classes + member verification).
- `common/documents` schemas done; the remaining `[~]` files are **deferred** (see below), not incomplete Phase-3 work.

**Deferred out of Phase 3 (recorded in the receiving phase's row):**

1. **MeasuredTemplate reconciliation → Phase 7.** v14 moved `BaseMeasuredTemplate` common→client as a `@deprecated since v14` shim, dropped the common `_module`/`_types` exports, removed the `MeasuredTemplateData` typedef, and un-embedded it from Scene. All of this cascades `no-deprecated`/missing-type errors into the un-migrated Scene (Phase 7), client MeasuredTemplate (Phase 4) and canvas (Phase 5), so it travels with the Phase-7 Scene embedded-collection rework. (Same rationale as wall's EDGE rename → Phase 5.)
2. **Scene Levels subsystem + `BaseLevel`/`LevelData`/`LevelTexture` → Phase 7.**
3. **wall `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` rename → Phase 5.**
4. **`common/data/_module.d.mts` `operators` re-export → Phase 7** (operators.mjs not authored yet).

#### Document schema rewrites (done this session, pre-gate)

Non-Levels field rewrites applied across: combat (+name), combatant (+roundJoined), drawing (+name/interface, fontFamily, textColor), fog-exploration (+level, order, scene.initial), roll-table (description→HTMLField), playlist (channel required), active-effect (changes→system removed, duration→{value,units,expiry,expired}, +start/showIcon/folder, origin→DocumentUUIDField, indexed+compendiumIndexFields, create perm fn), chat-message (+title, timestamp opts), region (restriction/attachment/highlightMode/displayMeasurements/hidden/ownership/\_shapeConstraints/elevation.topInclusive, visibility→LAYER_UNLOCKED), token (detectionModes Array→TypedObjectField, +subpathId, +depth, cost→nullable, width/height drop step:0.5, order), tile (occlusion.mode→occlusion.modes SetField), ambient-light/ambient-sound (+name/locked, intensity opts), note (+author/locked, fontFamily), adventure (compendiumIndexFields), actor (field order). Each paired its `schemaVersion` bump. `levels` fields stubbed `// TODO(v14-levels)` (Phase 7). Supporting: active-effect agent added consts `ACTIVE_EFFECT_DURATION_UNITS`/`ACTIVE_EFFECT_TIME_DURATION_UNITS`/`ACTIVE_EFFECT_EXPIRY_EVENTS`/`ACTIVE_EFFECT_SHOW_ICON` and a `relative` option on `DocumentUUIDField`.

**`TypedObjectField` create-optionality finding:** a bare required `TypedObjectField` (e.g. `token.detectionModes`) was wrongly _required_ in `CreateData` because its assignment-data isn't nullish — unlike `SchemaField` (which has `_EffectiveOptions` giving required schemas an implicit `{}` initial). Worked around by modeling the effective `initial: {}` (runtime `ObjectField#getInitialValue` returns `{}`). **Candidate fields.d.mts improvement:** give `TypedObjectField` the same implicit-`{}`-initial create-optionality `SchemaField` has, then drop the per-field workaround.

#### `common/data` fields findings

Field-class roster diff (source `common/data/fields.mjs` vs repo `fields.d.mts`): **4 classes were present in v14 source, missing from repo** — `DataModelSchemaField` (base of `EmbeddedDataField`), `GridOffsetField`, `GridOffsetsField`, `ShapesField` (the proper type for `region.shapes`). Plus `SceneLevelsSetField` (deferred → Phase 7 Levels). **3 authored** (`GridOffsetField`/`GridOffsetsField`/`ShapesField`, commit `50b766c02`). `DataModelSchemaField` remains — it's a refactor of the existing `EmbeddedDataField` hierarchy rather than a standalone add (see the `fields.d.mts` checkbox note). Per-class member-by-member verification of the 34 existing field classes also remains.

**`GridOffsetField` dimensions gotcha (reusable):** the class is `GridOffsetField<Dimensions extends 2 | 3 = 2, Options extends GridOffsetField.Options<Dimensions>, …>`. `Dimensions` is **not** inferred from the runtime `{dimensions: 3}` arg (no parameter ties to it), and `DefaultOptions.dimensions` is the literal `2`, so a bare `new GridOffsetField({dimensions: 3})` rejects `3`. To get a 3D offset you must parameterize: `new GridOffsetField<3, {dimensions: 3}>({dimensions: 3})`, or just assert `SchemaField.InitializedData<GridOffsetField.Schema<3>>` at the type level (what the test does). The in-scope consumer (`GridShapeData.offsets` = `GridOffsetsField()`) is 2D, so this wart is harmless for Phase 3; 3D consumers are canvas/token (Phases 4–5).

#### Constants (done this phase)

`REGION_VISIBILITY` +`OBSERVER`(3)/`LAYER_UNLOCKED`(4); new `EDGE_RESTRICTION_TYPES` (`["light","darkness","sight","sound","move"]`, for `region.restriction.type`). The branded `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` (replacing `WALL_SENSE_TYPES`/`WALL_DIRECTIONS`) are **deferred to Phase 5** (canvas edges) — deprecating `WALL_*` now would cascade `no-deprecated` errors across canvas edge files. `wall`'s EDGE rename therefore defers with it.

### Phase 3 exit criteria

Every box above checked to the done bar (source-diffed, CI-green, type-tested). Full CI green: `npm run typecheck`, `npx tsc --exactOptionalPropertyTypes false`, raw `npx tsgo`, `npm run lint`, `npm run test-types`. Missing-file findings for Phase 7 recorded above.

---

## How to update this file

**This is the single source of truth for the v14 migration, and the work spans many separate agent sessions. Keeping it current is mandatory, not optional — an out-of-date tracker is how context gets lost between sessions.**

### Per-session protocol (do this every v14 session)

1. **At the start:** read this file. The next work is whatever the roadmap row marks "In progress" / "Not started" and whatever per-file box is still `[ ]` or `[~]` (legend in the active phase). Don't re-derive the plan from scratch — trust and extend what's here.
2. **As you work:** when you discover scope that wasn't anticipated (as the `Temporary` discovery reshaped Phases 1/2, and the Scene Levels discovery reshaped Phase 3/7), record it immediately — fix the roadmap, note why, and assign it to the right phase so it is never silently dropped.
3. **Before you finish (and before each commit):** sync **all three views** so they never disagree:
   - the **roadmap status row** for the phase,
   - the **per-file checkboxes** (`[x]` done & committed, `[~]` partial — add a note, `[ ]` not started),
   - the **running notes** (commits landed, remaining items, cross-phase deferrals, and any type-system gotchas worth reusing).

### Maintenance rules

- Check a box only when a file meets all three done-bar criteria (source-diffed, CI-green, type-tested); use `[~]` with a note for partial work.
- When starting a phase, expand it into a per-file checklist like Phase 1/3.
- Record the v14 source build you diffed against if it changes (currently 14.363.0).
- Record cross-phase deferrals explicitly in both the originating phase's notes and the receiving phase's row, so neither side loses them.
- Move finished phases' detail out once merged — link the PR/commit in the commit message rather than keeping closed checklists here.
