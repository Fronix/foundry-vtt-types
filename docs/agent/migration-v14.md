# v14 Migration Plan & Tracker

## When to consult this file

This is the **slim structural tracker** — the single source of truth for _what's done and what's next_ in the Foundry v13 → v14 type migration. It holds the roadmap, the scope priority, and the next-session pointer. **Per-phase detail lives in separate files** (`migration-v14-phase-N.md`) — read only the one for the phase you're working. Closed phases 1–4 are in [migration-v14-archive.md](migration-v14-archive.md). Read this file before starting any v14 work; keep it current as phases progress.

Ground truth for every decision is the Foundry v14.363.0 source at `/home/fronix/git/foundry/resources/app/` (`client/`, `common/`, `public/scripts/`). When the source disagrees with this plan, the source wins — fix the plan.

> **This tracker stays slim by design.** Bulk content — per-batch findings, inherited deferrals, drift surveys — goes in the per-phase files, NOT here. The only things in this file are size-capped: the 8 roadmap rows, the scope priority, and a single overwritten next-session callout. If you're about to paste a paragraph here, it belongs in a phase file.

## Definition of "done" (the per-file bar)

A file is **migrated to v14** only when all three hold:

1. **Source-diffed** — members (order, signatures, additions, removals) compared against the corresponding v14 `.mjs`. Member order matches source (per [conventions.md](conventions.md)).
2. **CI-green** — `npm run typecheck` (tsgo), `npx tsc --exactOptionalPropertyTypes false`, raw `npx tsgo`, `npm run lint`, `npm run test-types`.
3. **Type-tested** — a `.test-d.ts` exercises the changed/added surface.

CI-green alone is **not** sufficient — CI doesn't know the v14 source, so silent v13 drift survives it. The diff is what catches drift.

## Sequencing principle

**Foundation-up by layer:** `common/abstract` → `common/documents` → `client/documents` → `client/canvas` → `client/applications` → greenfield (`vfx`, region-behaviors) → cleanup. The new `canvas/vfx/` subsystem (no v13 analog, no consumers) is intentionally last.

## Branch & merge strategy

**All v14 work lives on the single long-running `v14` branch (off `main`). Commit every phase directly onto `v14` — no per-phase branches.** Push only to `origin` (the Fronix fork) — never `upstream` (League). When ready, merge `v14` into `main` in one fast-forward (`main` doesn't drift — fork-only — so the merge stays conflict-free).

---

## Roadmap

Status is one line per phase. Open the linked **phase file** for batch-level detail and that phase's inherited deferrals.

| Phase | Scope (short)                                                                                         | Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Detail                              |
| ----- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **1** | `createDialog` → `.Stored \| null` + `renderOptions` param                                            | **Done — CI green**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [archive](migration-v14-archive.md) |
| **2** | Remove the `Temporary` create-operation concept (~85 files)                                           | **Done — CI green**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [archive](migration-v14-archive.md) |
| **3** | Verify `common/abstract` + `common/data` + `common/documents` schemas                                 | **Done** (deferrals → P5/P7/P8)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | [archive](migration-v14-archive.md) |
| **4** | Verify `client/documents` leaf classes member-by-member                                               | **Done — CI green** (28 `[x]`; 4 Tier-B giants + measured-template → P7)                                                                                                                                                                                                                                                                                                                                                                                                                                                | [archive](migration-v14-archive.md) |
| **5** | Canvas: verify + fill + add (ex-vfx)                                                                  | **Done — CI green** (5.1–5.7 all done; commit `22b8d9225`. Scene-Levels-coupled bits FIXME'd → P7)                                                                                                                                                                                                                                                                                                                                                                                                                      | [phase-5](migration-v14-phase-5.md) |
| **6** | Applications: fill 65 stubs + missing files                                                           | **DONE — CI green**: all 65 stubs migrated (sheets, apps, hud, settings, sidebar, quickstart, client/data) + missing journal sheets + new `PlaceableConfig` base + `TokenApplication`/`DocumentDirectory` foundations. `client/` is stub-free. (Scene-Levels precision in scene-config/PlaceableConfig FIXME'd → P7.)                                                                                                                                                                                                   | [phase-6](migration-v14-phase-6.md) |
| **7** | Greenfield: vfx, region-behaviors, **Scene Levels**, 4 Tier-B giants, MeasuredTemplate, shapes barrel | **DONE (pragmatic high-value scope) — CI green.** All 4 Tier-B giants, Scene Levels, region-behaviors, operators, the full **`canvas/vfx/`** subsystem (27 files), source-polygon Level/surfaceExposure, and the **MeasuredTemplate deprecation surface**. The MeasuredTemplate structural un-embed + shapes-barrel are **WON'T-DO** (descoped — subtract usable deprecated surface, no consumer value pre-v16). Optional leftovers: member-order parity (out of scope per scope-priority) + P8 `removed in v14` prune. | [phase-7](migration-v14-phase-7.md) |
| **8** | Cleanup: remove `removed in v14` deprecations, bump to `14.x`, backfill tests                         | Not started — **inherits deferrals**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [phase-8](migration-v14-phase-8.md) |

Closed phases' full detail (per-file checklists, drift surveys, commit lists, reusable findings) and the original baseline-landscape survey are in [migration-v14-archive.md](migration-v14-archive.md).

---

## Scope priority

**Decided 2026-05-27 — pursue a pragmatic high-value subset, NOT full member-by-member parity.** Full parity ≈ 27–40 more sessions; the long tail (sidebar UI, vfx) is high-volume / low-consumer-value. Reordered priority (overrides the numeric phase order):

1. ~~**Finish Phase 5 canvas**~~ **DONE** (commit `22b8d9225`) — canvas fully migrated; Scene-Levels bits FIXME'd → P7.
2. **Sheets** (Phase 6 subset) — high consumer value; **interleaved now**. Order: `base-sheet` ✅ → journal → Tier A → media; Tier B (placeable configs) deferred. See [phase-6](migration-v14-phase-6.md).
3. **Phase 7 document giants + Scene Levels** — the most-consumed types; highest remaining leverage.
4. **Usability MVP items** (cheap — pull forward from P8): bump `package.json` → `14.x`; prune the `removed in v14` accuracy-wins. See [phase-8](migration-v14-phase-8.md).

**Deprioritized — do only if explicitly requested:** `sidebar/` tabs, `settings/` menus, and **`canvas/vfx/`** (no v13 analog, no consumers). Revisit once 1–3 land.

The package is **already substantially usable on v14** for backward-compatible usage — the migrated document/data/config core covers what most consumers touch, and unmigrated giants keep a working v13-compatible surface (they only lack v14's _new_ members).

---

> ### ▶ Next session — start here
>
> **Phase 7 is IN PROGRESS (2026-05-28) — CI green. ALL 4 Tier-B giants are now DONE** (active-effect, scene, region, token). This batch closed the **token giant**: set-diffed `client/documents/token.d.mts` against the v14 source and added the ~22 missing members (`get scene`, `_returnedMovementPromises`/`attachments`, `isLazyDelta`/`_forceDeltaActor`/`_onDeltaMaterialized`, `includedInLevel`, `prepareData`, `_prepareBars`, `startMovement`, `getOccupiedGridSpaceOffsets`, `_onMovementPlanned`, the origin family `getMovementOrigin`/`getLightOrigin`/`getVisionOrigin`/`getSoundOrigin`/`getListenerPosition`, the test-point family `getContainmentTestPoints`/`getVisibilityTestPoints`/`getOcclusionTestPoints`/`_constrainTestPoints`, and the active-effect family `applyActiveEffects`/`_renderActiveEffectChanges`/`_onOverrideSize`/`_getReplacementData`). The token-movement `_types` were already authored in prior batches, so this was a true member-diff. Convention-omitted the signature-unchanged operation/document handlers. Extended `token.test-d.ts`.
>
> **Phase 7 is DONE (pragmatic high-value scope) — CI green.** This session landed both remaining Tier-B giants (region, token), the token `Position` depth/level drift, the **`canvas/vfx/` subsystem (all 27 files)**, the **Level/surfaceExposure source-polygon loose-ends**, the **MeasuredTemplate deprecation surface** (`@remarks` prose + `_fromRegion`), and the P8 `package.json`→`14.363.0` pull-forward.
>
> **The MeasuredTemplate structural un-embed + the shapes-barrel unification are WON'T-DO (descoped 2026-05-28, maintainer-agreed).** MeasuredTemplate is deprecated-but-fully-functional through v16; un-embedding would subtract still-usable `scene.templates` from the types and requires a core-type redesign (`ALL_DOCUMENT_TYPES`, `AnyCanvasDocument`←`Scene.Embedded.Name`, `documentConfiguration`, `src/configuration/`) of no consumer value pre-v16. New code should extend `RegionDocument`, not MeasuredTemplate. The shapes-barrel is descoped on the same grounds. (Full cascade analysis + a design proposal retained in [phase-7](migration-v14-phase-7.md) for the eventual v16 cleanup.)
>
> **Only truly-optional leftovers remain:**
>
> 1. **Member-order parity** on `scene`/`active-effect` — **out of scope** per the [scope-priority decision](#scope-priority) ("NOT full member-by-member parity"). Cosmetic, high-churn, no functional gain.
> 2. **P8** (separate phase) — the `removed in v14` deprecation-alias prune (~892 occ / 78 files) is a breaking change touching the `document.d.mts` boundary; do as one coordinated P8 pass with sign-off. (Version bump already done.)
>
> **Assessment:** Phase 7's pragmatic high-value scope is complete and CI-green. Nothing remaining is consumer-blocking; the leftovers are explicitly-descoped parity polish and a Phase-8 breaking prune. **Phase 7 can be closed** (flip its Detail link to the archive when ready).
>
> **Kickoff message** (paste verbatim):
>
> ```
> Phase 7 is complete (pragmatic high-value scope) and CI-green; the MeasuredTemplate/shapes-barrel structural un-embed is descoped as WON'T-DO (see migration-v14-phase-7.md). If continuing the migration, move to Phase 8 cleanup: the `removed in v14` deprecation-alias prune (~892 occ across 78 files, a breaking change touching the document.d.mts boundary) as one coordinated pass, plus backfilling any missing tests. Member-order parity remains out of scope per the scope-priority decision.
> ```
>
> _Maintainers: overwrite this block (not append) when a batch/phase closes._

---

## How to update this file

Single source of truth for _status_; the work spans many sessions, so keeping it current is mandatory.

### Per-session protocol

1. **Start:** read this file (roadmap + scope priority + next-session). Open the **phase file** for the active phase for batch detail + that phase's inherited deferrals. Don't re-derive the plan.
2. **As you work:** if you discover scope that crosses phases, **append it to the _receiving_ phase's file** under its `## Inherited deferrals` section — NOT here (there is no central deferral list, by design). If it reshapes a phase, fix that phase's roadmap row + file.
3. **Before finishing / each commit:** sync (a) the **roadmap status row**, (b) the active **phase file** (checkboxes, commits landed, findings, remaining items), (c) the **next-session callout** (overwrite, don't append), and (d) any **inherited deferral** you added or actioned (in the receiving phase file).

### Maintenance rules

- Check a box only when a file meets all three done-bar criteria; use `[~]` + a note for partial work.
- **This tracker stays slim** — detail, findings, and deferrals go in phase files. Never grow this file with per-batch prose.
- Record the v14 source build diffed against if it changes (currently 14.363.0).
- The global "nothing-dropped" deferral view is reconstructable on demand: `grep -l "Inherited deferrals" docs/agent/migration-v14-phase-*.md`, then read those sections.
- **When a phase closes (CI-green & committed):** flip its roadmap status, point its Detail link at the archive, and move the phase file's content into [migration-v14-archive.md](migration-v14-archive.md) (lift any still-open inherited deferrals into the _next_ receiving phase file first). Nothing is deleted — archiving is a move.
