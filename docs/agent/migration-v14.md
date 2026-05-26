# v14 Migration Plan & Tracker

## When to consult this file

This is the **single source of truth** for the Foundry v13 → v14 type migration: the phased roadmap, the per-file status, and the definition of "done". Consult it before starting any v14 migration work, and update it as files are completed.

Ground truth for every decision below is the Foundry v14.363.0 source at `/home/fronix/git/foundry/resources/app/` (`client/`, `common/`, `public/scripts/`). When the source disagrees with this plan, the source wins — fix the plan.

> **Closed phases live in the archive.** Completed phases' full detail (per-file checklists, drift surveys, commit lists, reusable findings) is moved to **[migration-v14-archive.md](migration-v14-archive.md)** so this tracker stays small enough to load every session. Nothing is deleted — read the archive on demand. This file owns what is **open**; the archive records what is **closed**.

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

| Phase | Scope                                                                                                                                                                                                                                                                                                                                                                                                                 | Layer                                  | Risk                                                    | Status                                                                                                                                                                                                                                                                                                                                                         |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | `createDialog` v14 signature: return `.Stored \| null`, add 4th `renderOptions` param (34 docs + mixin)                                                                                                                                                                                                                                                                                                               | client/documents                       | Low (bounded, mechanical)                               | **Done — CI green**                                                                                                                                                                                                                                                                                                                                            |
| **2** | Remove the `Temporary` create-operation concept entirely (~200 sites; v14 dropped `temporary` from `DatabaseCreateOperation`)                                                                                                                                                                                                                                                                                         | common/abstract (boundary) + documents | **High — touches `document.d.mts`, needs human review** | **Done — CI green** (85 files, +1041/−1872)                                                                                                                                                                                                                                                                                                                    |
| **3** | Verify `common/abstract` (`DataModel`, `Document`, fields) + `common/documents` base schemas against v14                                                                                                                                                                                                                                                                                                              | common                                 | High (boundary files)                                   | **DONE (modulo documented cross-phase deferrals) — CI green.** `common/abstract` 10/10 (incl. `document.d.mts` verified-clean), `common/data` complete (fields + shapes + validation + DataModelSchemaField), `common/documents` schemas done. Deferred: Scene Levels + **MeasuredTemplate reconciliation** + BaseLevel → Phase 7; wall EDGE rename → Phase 5. |
| **4** | Verify `client/documents` leaf classes member-by-member to the done bar (Phases 1–2 already touched them)                                                                                                                                                                                                                                                                                                             | client/documents                       | Medium                                                  | **In progress** — checklist expanded below; 33 leaf docs to diff against v14.363.0.                                                                                                                                                                                                                                                                            |
| **5** | Canvas: verify existing + fill canvas stubs + add missing canvas files (**excluding vfx**). **Inherits:** wall `EDGE_SENSE_TYPES`/`EDGE_DIRECTIONS` rename (from Phase 3 — see deferrals).                                                                                                                                                                                                                            | client/canvas                          | Medium                                                  | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **6** | Applications: fill the 65 stubs (HUD, sidebar, sheets, settings menus) + add missing application files (palette / sidebar-tabs / filters / ux / elements)                                                                                                                                                                                                                                                             | client/applications                    | Medium (volume)                                         | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **7** | Greenfield: new `canvas/vfx/` (~21 files), `data/region-behaviors/`, remaining missing files, **+ the v14 Scene Levels subsystem** **+ the MeasuredTemplate→client deprecation** (from Phase 3: move `BaseMeasuredTemplate` common→client as `@deprecated since v14`, drop its common `_module`/`_types` exports, un-embed it from Scene — all coordinated with the Scene embedded-collection rework). See deferrals. | client/canvas, client/data, common     | Medium–High (authoring from scratch)                    | Not started                                                                                                                                                                                                                                                                                                                                                    |
| **8** | Cleanup: remove `@deprecated … removed in v14` types now that we are v14; verify remaining v13-flavored comments; backfill tests; bump `package.json` to `14.x`. **Inherits:** deprecated embedded-collection stub removals (from Phase 3 — see deferrals).                                                                                                                                                           | repo-wide                              | Low                                                     | Not started                                                                                                                                                                                                                                                                                                                                                    |

Phases are expanded into per-file checklists when they are reached (keeping this doc legible). Closed phases' full detail is archived in [migration-v14-archive.md](migration-v14-archive.md) — see [Closed-phase detail](#closed-phase-detail-archived) below.

---

## Cross-phase deferrals (live)

Work discovered while completing one phase but assigned to a later one. **This table is the authoritative live list — each item MUST be actioned by its receiving phase; do not let it drop.** When you start a receiving phase, fold the matching row(s) into that phase's expanded checklist. (Originating-phase rationale is preserved in the [archive](migration-v14-archive.md); the receiving phase is also flagged in its roadmap row above.)

| Deferred item                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | From → To                        | Why deferred                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wall `WALL_SENSE_TYPES`→`EDGE_SENSE_TYPES` / `WALL_DIRECTIONS`→`EDGE_DIRECTIONS` rename + the branded consts in `common/constants.d.mts` (and `wall.d.mts`'s EDGE-rename portion). **Incl. (flagged by P4):** the `WallDocument` class members `get edge(): Edge \| null`, `get darkness(): EdgeSenseType`, and `initializeEdge(options?)` — left unadded (inline `// TODO(v14 → Phase 5)` in `wall.d.mts`) because they reference the canvas `Edge` type + `EdgeSenseType`/`EdgeRestrictionType`. The non-edge members `isDoor`/`isOpen`/`prepareBaseData`/`getWallCategory` were already added in P4. | **3 → 5**                        | Deprecating `WALL_*` now cascades `no-deprecated` errors across canvas edge files. Travels with the canvas edges work.                                                                                                                   |
| MeasuredTemplate reconciliation: move `BaseMeasuredTemplate` common→client as `@deprecated since v14`, drop common `_module`/`_types` exports + the `MeasuredTemplateData` typedef, un-embed from Scene                                                                                                                                                                                                                                                                                                                                                                                                 | **3 → 7**                        | Cascades `no-deprecated`/missing-type errors into un-migrated Scene (P7), client MeasuredTemplate (P4), canvas (P5). Travels with the Scene embedded-collection rework.                                                                  |
| Scene Levels subsystem: new `Level` document + `BaseLevel`, `SceneLevelsSetField` (extends `SetField`), `LevelData`/`LevelTexture` typedefs, the Scene rework, and the `levels`/`level` fields on Scene/Token/ambient-light/ambient-sound/drawing/note/region/tile/wall (currently stubbed `// TODO(v14-levels)`)                                                                                                                                                                                                                                                                                       | **3 → 7**                        | New v14 subsystem entangled with the greenfield `Level` document. `common/data/_module.d.mts` `operators` re-export rides along (operators.mjs not authored yet).                                                                        |
| Deprecated-stub removals: `embedded-collection.d.mts` `update`/`_createOrUpdate`, `embedded-collection-delta.d.mts` `_createOrUpdate` ("removed in v13, warning removed in v14")                                                                                                                                                                                                                                                                                                                                                                                                                        | **3 → 8**                        | Gone from v14 source; pure cleanup-phase work.                                                                                                                                                                                           |
| `TypedObjectField` create-optionality: give it `SchemaField`'s implicit-`{}`-initial so a required `TypedObjectField` isn't wrongly required in `CreateData`, then drop the per-field workaround (`token.detectionModes`)                                                                                                                                                                                                                                                                                                                                                                               | **3 → fields.d.mts improvement** | Candidate `common/data/fields.d.mts` improvement found during token schema work; action when convenient (not phase-gated).                                                                                                               |
| `shape` derived property on the canvas leaf docs — `tile`/`ambient-light`/`ambient-sound`/`drawing` assign `this.shape = new <Rectangle\|Circle\|Cone>ShapeData(...)` in `prepareDerivedData`. Declare the typed `shape` member on each once the shape-data types exist. (Inline `// TODO(v14)` left in each file.)                                                                                                                                                                                                                                                                                     | **4 → 5/7**                      | Blocked on `client/data/shapes.d.mts` (the `RectangleShapeData`/`CircleShapeData`/`ConeShapeData` classes), a missing `client/data` file not yet authored — author it in the canvas/greenfield phase, then add the four `shape` members. |

---

## Closed-phase detail (archived)

Phases 1–3 are **complete and CI-green** (status in the roadmap above; deferrals lifted into the live table above). Their full detail — per-file checklists, drift surveys, commit lists, and reusable type-system findings — lives in **[migration-v14-archive.md](migration-v14-archive.md)**. Consult it when you need closed-phase specifics (which commit landed a change, the exact field rewrites, a reusable gotcha like the `GridOffsetField` dimensions wart).

- **Phase 1** — `createDialog` → v14 signature (`.Stored | null` + 4th `renderOptions` param). 35/35 files. → see the archive's _Phase 1_ section.
- **Phase 2** — remove the `Temporary` create-operation concept (atomic, ~85 files). → archive's _Phase 2_ section.
- **Phase 3** — verify `common/abstract` + `common/data` (fields) + `common/documents` base schemas. → archive's _Phase 3_ section.

---

## Phase 4 (active / in progress) — detail

**Scope.** Verify the `client/documents` **leaf classes member-by-member** to the done bar. Phases 1–2 already migrated their CRUD/`createDialog` surface, and Phase 3 authored their `Schema` interfaces (those interfaces physically live in `client/documents/<doc>.d.mts` — see the structural note in the archived Phase 3 scope decisions), so **Phase 4 owns the remaining methods/members** (getters/setters, instance + static methods, event handlers like `_preCreate`/`_onDelete`), not the schemas and not the CRUD/dialog surface. Diff each repo class body against its v14 `.mjs`; the namespace/`Schema` block above each class is out of Phase 4's scope unless a class member's signature references a type that is itself wrong.

**Inherited from deferrals:** none owned outright. `measured-template` is verified here for its class members, but the **MeasuredTemplate common→client reconciliation** (move `BaseMeasuredTemplate`, un-embed from Scene) stays Phase 7 — do not action it here; just flag if a class member depends on it. `level.mjs` has no repo file (Scene Levels → Phase 7), so it is **not** in this checklist.

**Ground truth:** `/home/fronix/git/foundry/resources/app/client/documents/<doc>.mjs` (v14.363.0).

### Per-file checklist (33 leaf docs)

Legend: `[x]` done (source-diffed + CI-green + type-tested), `[~]` partial (note), `[ ]` not started.

- [ ] `active-effect.d.mts`
- [x] `actor-delta.d.mts` — added the `get id()` override note (no sig change); the rest of the synthetic-actor surface was already v14-accurate.
- [ ] `actor.d.mts`
- [x] `adventure.d.mts` — added missing `static fromIndex(id, pack)` (v14's first member); import/prepareImport/importContent/fromSource already accurate.
- [x] `ambient-light.d.mts` — removed stale `_onUpdate`-override comment (v14 moved it to the `AmbientLight` placeable), added `prepareDerivedData`, fixed `animate` remark; `shape` deferred (→5/7).
- [x] `ambient-sound.d.mts` — added `prepareDerivedData`, fixed "Wall" copy-paste comment; `shape` deferred (→5/7).
- [x] `card.d.mts` — verified clean (all 14 getters/methods present in v14 order).
- [ ] `cards.d.mts`
- [ ] `chat-message.d.mts`
- [ ] `combat.d.mts`
- [x] `combatant-group.d.mts` — verified clean (defeated/hidden/members, prepareBaseData, clearMovementHistories all present & v14-accurate).
- [x] `combatant.d.mts` — added missing `turnNumber: number | null`; the rest (combat/isNPC/permission/visible/actor/token/players/isDefeated/initiative/\_prepareGroup/clearMovementHistory) already accurate.
- [x] `drawing.d.mts` — fixed `defaultDrawingFields` `@defaultValue` (v14 added elevation/levels/interface), added `prepareDerivedData`; `_shape` deferred (→5/7).
- [x] `fog-exploration.d.mts` — verified load/getTexture/\_on\* present; widened `LoadQuery.scene`/`.user` to `string | Scene.Implementation`/`string | User.Implementation` per v14. Deprecated `static get()` correctly marked "until v14" (P8 sweep).
- [ ] `folder.d.mts`
- [x] `item.d.mts` — fixed stale `_onCreateOperation`/`_onDeleteOperation` comment (v14 overrides `_preCreate`/`_onDelete`); class members otherwise v14-accurate.
- [x] `journal-entry-category.d.mts` — verified clean (`prepareDerivedData` only, matches v14).
- [ ] `journal-entry-page.d.mts`
- [x] `journal-entry.d.mts` — verified clean (visible/getUserLevel/sceneNote/show/panToNote/sortCategories + \_onUpdate/\_onDelete comment); added test file.
- [x] `macro.d.mts` — verified clean (isAuthor/canExecute/thumbnail/canUserExecute/execute/\_onClickDocumentLink + \_onCreate comment).
- [ ] `measured-template.d.mts` (class members only; reconciliation = P7)
- [x] `note.d.mts` — added missing `get isAuthor()` + `prepareDerivedData()`.
- [x] `playlist-sound.d.mts` — verified complete (VOLUME_DEBOUNCE_MS/sound/debounceVolume/\_createSound/fadeDuration/context/\_scheduleFadeOut/\_cancelFadeOut/sync/load/toAnchor/\_onStart/\_onEnd/\_onStop all present; effectiveVolume correctly `until v14` → P8).
- [ ] `playlist.d.mts`
- [x] `region-behavior.d.mts` — fixed `_handleRegionEvent` return (`void`→`Promise<void>`, it's `async`) + `active`/`viewed` doc drift; added test file.
- [ ] `region.d.mts`
- [ ] `roll-table.d.mts`
- [ ] `scene.d.mts`
- [x] `setting.d.mts` — verified clean (config/\_initialize/\_castType + \_onCreate/\_onUpdate comment).
- [x] `table-result.d.mts` — verified clean (icon/prepareBaseData/getHTML/documentToAnchor/getChatText + \_preUpdate comment; getChatText correctly `until V15`).
- [ ] `tile.d.mts`
- [ ] `token.d.mts`
- [ ] `user.d.mts`
- [~] `wall.d.mts` — added `isDoor`/`isOpen`/`prepareBaseData`/`getWallCategory` + the `WallCategory` type (class body was previously bare). `edge`/`darkness`/`initializeEdge` deferred to Phase 5 (EDGE rename / Edge type) — see deferrals row.

### Running notes

- Verification recipe per file: read the v14 `.mjs` class body (getters/setters/methods/event-handlers, ignoring the `@import` and typedef blocks), read the repo `declare class … { … }` body, diff member presence + order + signatures. The repo deliberately omits re-declaring inherited methods whose signature is unchanged (sometimes noting them in a comment) — verify those comments name the right v14 methods.
- **"Done" interpretation for Phase 4:** a file is `[x]` when its **live** member surface matches v14 (presence + order + signatures) **and** its deprecations carry the right `until vXX` markers. The actual _removal_ of `until v14` deprecations is **Phase 8's** sweep — leaving a correctly-marked `until v14` deprecation in place does **not** block a Phase-4 `[x]`. (Example: `FogExploration.static get()` is `until v14` → left for P8.)
- **`shape` derived property deferral (→ 5/7):** `tile`/`ambient-light`/`ambient-sound` assign `this.shape` and `drawing` assigns `this._shape` of a `client/data/shapes.mjs` type (`Rectangle`/`Circle`/`Cone`/`Ellipse`/`Polygon` ShapeData). That file is unauthored, so the typed member is omitted with an inline `// TODO(v14)` in each of the 4 docs. Add the members once `client/data/shapes.d.mts` lands.
- **Batch 1 committed (9 docs):** ambient-light, ambient-sound, combatant-group, drawing, fog-exploration, item, journal-entry-category, note, tile. Pattern observed: most leaf docs only add a few getters + `prepareBaseData`/`prepareDerivedData` overrides over the Phase-1/3 surface; the common drift is (a) stale "X is overridden" comments naming v13 methods, and (b) `@defaultValue`/remark text not updated for v14. Tests: each got `expectTypeOf` assertions for the new surface.
- **Batch 2 committed (7 docs):** adventure, card, journal-entry, macro, region-behavior, setting, table-result. 5 were already v14-clean (card/macro/setting/table-result/journal-entry — the bulk of these docs' surface was authored accurately). Fixes: adventure missing `static fromIndex`; region-behavior `_handleRegionEvent` was typed `void` but is `async`. New test files added for journal-entry + region-behavior (were missing).
- **Batch 3 committed (4 docs):** actor-delta, combatant, playlist-sound, wall. playlist-sound already complete. Fixes: combatant missing `turnNumber`; actor-delta `get id()` note. **wall is `[~]`** — its class body was essentially empty; added the non-edge members but `edge`/`darkness`/`initializeEdge` ride the Phase-5 EDGE-rename deferral. Watch for other docs whose class body is under-populated (wall was a surprise). **20/33 done** (1 partial: wall). Remaining: active-effect, actor, cards, chat-message, combat, folder, journal-entry-page, playlist, region, roll-table, scene, token, user.

---

## How to update this file

**This is the single source of truth for the v14 migration, and the work spans many separate agent sessions. Keeping it current is mandatory, not optional — an out-of-date tracker is how context gets lost between sessions.**

### Per-session protocol (do this every v14 session)

1. **At the start:** read this file. The next work is whatever the roadmap row marks "In progress" / "Not started" and whatever per-file box is still `[ ]` or `[~]` in the active phase. Also scan the **[Cross-phase deferrals](#cross-phase-deferrals-live)** table for anything your phase inherits. Don't re-derive the plan from scratch — trust and extend what's here. (Closed-phase specifics, if needed, are in [migration-v14-archive.md](migration-v14-archive.md).)
2. **As you work:** when you discover scope that wasn't anticipated (as the `Temporary` discovery reshaped Phases 1/2, and the Scene Levels discovery reshaped Phase 3/7), record it immediately — fix the roadmap, note why, and assign it to the right phase (add a row to the deferrals table if it crosses phases) so it is never silently dropped.
3. **Before you finish (and before each commit):** sync **all views** so they never disagree:
   - the **roadmap status row** for the phase,
   - the **per-file checkboxes** (`[x]` done & committed, `[~]` partial — add a note, `[ ]` not started),
   - the **[Cross-phase deferrals](#cross-phase-deferrals-live)** table (anything you deferred or actioned),
   - the **running notes** in the active phase's detail (commits landed, remaining items, type-system gotchas worth reusing).

### Maintenance rules

- Check a box only when a file meets all three done-bar criteria (source-diffed, CI-green, type-tested); use `[~]` with a note for partial work.
- When starting a phase, expand it into a per-file checklist like the archived Phase 1/3.
- Record the v14 source build you diffed against if it changes (currently 14.363.0).
- Record cross-phase deferrals in **both** the [Cross-phase deferrals](#cross-phase-deferrals-live) table (with receiving phase) **and** the receiving phase's roadmap row, so neither side loses them.
- **When a phase closes (CI-green & committed), move its expanded detail to [migration-v14-archive.md](migration-v14-archive.md)** and leave a one-line pointer under [Closed-phase detail](#closed-phase-detail-archived). Lift any cross-phase deferrals out of the detail into the live table _before_ archiving, so they stay loaded. This keeps the always-loaded tracker small (it is `@`-imported into every session — keep it well under ~40k chars); the archive is **not** `@`-imported. Nothing is deleted — archiving is a move, the commit message links the work.
