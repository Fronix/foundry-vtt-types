# Phase 6 — Applications (`client/applications`) — detail

> Per-phase detail for the v14 migration. Slim tracker: [migration-v14.md](migration-v14.md). Closed phases: [migration-v14-archive.md](migration-v14-archive.md).

**Status:** In progress (interleaved with Phase 5 per the [scope-priority decision](migration-v14.md#scope-priority)). **Risk:** Medium (volume).

## Scope

Fill the **65 stub files** (`@remarks TODO: Stub`) + add the missing application files (`applications/sheets/palette/`, `applications/sidebar/tabs/`, `filters/`, `ux/`, `elements/`).

Stub distribution (measured 2026-05-27 — `grep -rl "@remarks TODO: Stub" src/foundry/client/applications/`):

| Area                                           | Stubs |
| ---------------------------------------------- | ----- |
| `sheets/`                                      | 25    |
| `sidebar/`                                     | 21    |
| `settings/`                                    | 6     |
| `hud/`                                         | 5     |
| `apps/`                                        | 5     |
| `quickstart.d.mts`                             | 1     |
| (+ `client/data/` terrain-data, combat-config) | 2     |

## Sheets — the priority focus

Per the scope decision, **sheets are the high-value subset** (systems live in them). The most-overridden sheets — `actor-sheet`, `item-sheet`, the 7 journal _page-type_ sheets, region/ambient configs, folder/user configs — are **already developed**. The 25 remaining sheet stubs, in chosen priority order:

| Order                       | Files                                                                                                                                                                                                | Notes                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **1 (done)**                | `base-sheet`                                                                                                                                                                                         | ✅ **DONE** — generic fallback sheet; first Phase-6 file (uncommitted at time of writing) |
| **2 — Journal (done)**      | `journal-entry-sheet` (1443 src — giant), `journal-entry-page-sheet` (134), `journal-entry-page-hbs-sheet` (111), `journal-entry-category-config` (146), `dialog-show` (148)                         | ✅ **DONE** — all 5 stubs filled + tests; CI green. Missing siblings → see note below     |
| **3 — Tier A**              | `active-effect-config` ✅ (263), `scene-config` (980), `token/token-config` (159 ⚠), `token/prototype-config` (383 ⚠)                                                                                | `active-effect-config` DONE. token/prototype ⚠ blocked on `PlaceableConfig` (see below)   |
| **4 — Tier D (media/misc)** | `playlist-config`, `playlist-sound-config`, `cards-config`, `card-config`, `macro-config`, `roll-table-sheet`, `table-result-config`, `combatant-config`, `adventure-importer`, `adventure-exporter` | lower frequency                                                                           |
| **Deferred — Tier B**       | `drawing-config`, `note-config`, `tile-config`, `wall-config`, `template-config`                                                                                                                     | placeable configs — "standalone for now" (maintainer call)                                |

`base-sheet` is **not** a shared base (nothing extends it but the barrel); every config sheet builds directly on the already-developed `DocumentSheetV2` / `HandlebarsApplicationMixin(DocumentSheetV2)`. So the 25 are **independent** — prioritize freely.

### Recipe (from `base-sheet`, mirrors developed `UserConfig`)

Drop the `@remarks TODO: Stub`; declare the v14 members in source order — typically `static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions`, `static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>`, the `_prepareContext` override, plus a `#private: true` duck-typing guard; the `RenderContext`/`Configuration`/`RenderOptions` namespaces capture the type surface. Add/extend a `.test-d.ts` mirror.

### Journal cluster — missing files ✅ DONE (2026-05-28)

Foundry's `sheets/journal/_module.mjs` exported two page-sheet classes that had **no file in the repo**. Both now added + barreled (source order), CI-green:

- `journal-entry-page-code-mirror-sheet` → `JournalEntryPageCodeMirrorSheet` ✅
- `journal-entry-page-html-sheet` → `JournalEntryPageHTMLSheet` ✅

The journal subdir is now structurally complete (all 14 source files mirrored).

### Scope discovery — `PlaceableConfig` base (2026-05-28)

v14 introduced **`sheets/placeable-config.mjs`** (`PlaceableConfig extends HandlebarsApplicationMixin(DocumentSheetV2)`, 179 src) as the shared base for **every placeable config**: token, prototype-token, drawing, note, tile, wall, template, ambient-light, ambient-sound, region. **The repo has no `placeable-config.d.mts`.** The current `token-config`/`prototype-config` stubs use `TokenApplicationMixin(DocumentSheetV2)` / `TokenApplicationMixin(ApplicationV2)` as placeholder bases — that's wrong; v14 is `TokenApplicationMixin(PlaceableConfig)`.

Two consequences for Tier A:

1. **`token/token-config` + `token/prototype-config` are blocked** on authoring `PlaceableConfig` first. They also override shared members (`token`, `actor`, `_fields`, `_prepareAppearanceTab`, `_previewChanges`, `isPrototype`) that live on **`TokenApplicationMixin`** — whose `mixin.d.mts` `TokenApplication` class is currently an **empty stub** (only a constructor). So filling token configs needs: (a) author `PlaceableConfig`, (b) fill the `TokenApplication` mixin members, (c) then the two configs.
2. **`PlaceableConfig._prepareContext` couples to Scene Levels** (`scene.levels`, `scene.availableLevels`, `level.id/name`) — a **Phase 7 deferral**. Author the Level-coupled bits with loose (`object`) typing + `// FIXME … → P7`, mirroring the Phase 5 approach.

`PlaceableConfig` is high-leverage (unblocks ~9 configs incl. the deferred Tier B) and squarely Phase 6 — author it as its own focused batch.

## Deprioritized (do only if explicitly requested)

`sidebar/` tabs (21) + `settings/` menus (6) — mostly Foundry-internal UI, low consumer reach. See the scope-priority decision.

## Inherited deferrals (action these in Phase 6)

None currently. (The `paletteClass` / palette-app deferral lives in Phase 5's `5.6g`, since the palette classes are authored there.)
