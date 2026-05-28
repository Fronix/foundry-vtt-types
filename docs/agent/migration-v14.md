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

| Phase | Scope (short)                                                                                         | Status                                                                                                                                                                                                                                                                                                                                                                                                                          | Detail                              |
| ----- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **1** | `createDialog` → `.Stored \| null` + `renderOptions` param                                            | **Done — CI green**                                                                                                                                                                                                                                                                                                                                                                                                             | [archive](migration-v14-archive.md) |
| **2** | Remove the `Temporary` create-operation concept (~85 files)                                           | **Done — CI green**                                                                                                                                                                                                                                                                                                                                                                                                             | [archive](migration-v14-archive.md) |
| **3** | Verify `common/abstract` + `common/data` + `common/documents` schemas                                 | **Done** (deferrals → P5/P7/P8)                                                                                                                                                                                                                                                                                                                                                                                                 | [archive](migration-v14-archive.md) |
| **4** | Verify `client/documents` leaf classes member-by-member                                               | **Done — CI green** (28 `[x]`; 4 Tier-B giants + measured-template → P7)                                                                                                                                                                                                                                                                                                                                                        | [archive](migration-v14-archive.md) |
| **5** | Canvas: verify + fill + add (ex-vfx)                                                                  | **Done — CI green** (5.1–5.7 all done; commit `22b8d9225`. Scene-Levels-coupled bits FIXME'd → P7)                                                                                                                                                                                                                                                                                                                              | [phase-5](migration-v14-phase-5.md) |
| **6** | Applications: fill 65 stubs + missing files                                                           | **DONE — CI green**: all 65 stubs migrated (sheets, apps, hud, settings, sidebar, quickstart, client/data) + missing journal sheets + new `PlaceableConfig` base + `TokenApplication`/`DocumentDirectory` foundations. `client/` is stub-free. (Scene-Levels precision in scene-config/PlaceableConfig FIXME'd → P7.)                                                                                                           | [phase-6](migration-v14-phase-6.md) |
| **7** | Greenfield: vfx, region-behaviors, **Scene Levels**, 4 Tier-B giants, MeasuredTemplate, shapes barrel | **In progress** — DONE this batch: Scene Levels (`6632620a0`/`ed5eb4a0d`/`e244d7bfa`), `common/data/operators` (`0e533917e`), all 4 missing region-behaviors. CI green. **Remaining: the 4 Tier-B giants** (active-effect, region, scene, token — scene/region/token prereqs `Level`+`operators` now met), vfx (~21, deprioritized), MeasuredTemplate reconcile, shapes barrel, polygon `Config.level`. **Inherits deferrals.** | [phase-7](migration-v14-phase-7.md) |
| **8** | Cleanup: remove `removed in v14` deprecations, bump to `14.x`, backfill tests                         | Not started — **inherits deferrals**                                                                                                                                                                                                                                                                                                                                                                                            | [phase-8](migration-v14-phase-8.md) |

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
> **Phase 7 is IN PROGRESS (2026-05-28) — CI green.** This batch landed the entire Scene Levels foundation (`6632620a0`/`ed5eb4a0d`/`e244d7bfa`), the `common/data/operators` module (`0e533917e`), and all 4 missing region-behavior data models — so the **`operators.mjs` blocker and the `region-behaviors` greenfield are both cleared.**
>
> **Next, in priority order — the remaining work is the large items:**
>
> 1. **The 4 Tier-B document giants** (highest leverage, **one giant per session** — each 1.1k–4k lines, authored prerequisite-first then member-diff):
>    - `active-effect` (1154) — independent; needs `ActiveEffectRegistry` (`client/helpers/active-effect-registry`), `CONFIG.ActiveEffect` additions (`phases`/`changeTypes`/`expiryEvents`), `ActiveEffectDuration` rework, and the change-application family moved instance→static (v13 instance methods become `@deprecated` shims).
>    - `scene` (1780) — **first batch DONE** (commit `4773af838`, `[~]`): Levels/edges/surfaces members added. **Remaining:** the `background`/`foreground`/`backgroundColor`/`foregroundElevation` schema→`@deprecated`-getter migration (v14 moved these fields to `Level` — a schema removal with consumer/test cascade) + a final member-order verification.
>    - `region` (2718) — needs `Level` (done) + `RegionSurface` (`client/documents/_types`) for `occludedSurfaces`/`define-surface`; ~25 missing live members listed in the phase-7 Tier-B deferral row.
>    - `token` (4009) — needs the token-movement subsystem (~15 `TokenMovement*` `_types` + `TokenConstrainMovementPathOptions`); also unblocks the deferred Token-placeable drag/movement surface and `ModifyMovementCost._getTerrainEffects`.
> 2. **Remaining Level loose-ends:** `PointSourcePolygon.Config.level` + `ClockwiseSweepPolygon` level internals (source-polygon not yet touched).
> 3. **`canvas/vfx/`** (~21 files, deprioritized — no consumers).
> 4. **MeasuredTemplate reconciliation** (the `@deprecated`-class cascade) + **shapes barrel** + **P8 cleanup** (bump `package.json` → `14.x`, prune `removed in v14`).
>
> **Kickoff message** (paste verbatim):
>
> ```
> Continue the v14 migration (Phase 7 — the scene Tier-B giant: its prereqs Level+operators are now met, so member-diff client/documents/scene.d.mts against v14 common+client scene.mjs)
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
