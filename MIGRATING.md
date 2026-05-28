# Migrating from v13 to v14

This guide is for **system and module developers** upgrading their TypeScript code from the
v13 line of `fvtt-types` to the v14 types. It covers what breaks, what merely warns, and how to
fix each — with copy‑pasteable before/after.

The v14 types model the **Foundry VTT v14 runtime**. Most of what changes here reflects changes
Foundry itself made between v13 and v14 — the types just surface them at compile time instead of
letting you find out at runtime.

> **Heads‑up — this is a prerelease fork.** These types target Foundry **v14.363.0** and are
> published from the [`Fronix/foundry-vtt-types`](https://github.com/Fronix/foundry-vtt-types)
> fork, not the npm registry. See [Install](#install) and [Caveats](#caveats).

---

## Install

```sh
npm add -D fvtt-types@github:Fronix/foundry-vtt-types#v14.363.0
```

`#v14.363.0` pins a frozen version tag. Use `#v14` instead to track the rolling dev branch (it
moves; your lockfile still pins the commit you installed, so re‑run the command to update).

Then in `tsconfig.json` (unchanged from v13):

```jsonc
{
  "compilerOptions": {
    "types": ["fvtt-types"],
    "target": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
  },
}
```

---

## The fastest migration path

**Most renamed and relocated symbols still exist as `@deprecated` aliases that point at their
replacement** — your code keeps compiling, just with deprecation warnings. The quickest way to
get a complete, actionable to‑do list of everything to update is to turn on the
`@typescript-eslint/no-deprecated` rule in your own project:

```js
// eslint.config.js (flat config)
export default [
  // …your config…
  { rules: { "@typescript-eslint/no-deprecated": "warn" } },
];
```

Every deprecated symbol then shows up as a lint warning whose message names the replacement
(e.g. _"Use `GetOperation` instead"_), and IDEs render the call site with a ~~strikethrough~~.
Work through the list and you've handled the bulk of the migration.

The hard breaks below are the ones this _won't_ catch — fix those first.

---

## Hard breaks (these error — fix first)

These have **no deprecation bridge**: your code stops compiling until you change it.

### 1. The `Temporary` create concept is gone

Foundry v14 removed the `temporary: true` create option entirely. The types dropped the
matching `Temporary` type parameter and the `X.TemporaryIf<…>` helper. Documents created through
`createDocuments` / `create` / `createDialog` are now always **stored** (or `null`).

```ts
// ❌ v13
const made: Actor.TemporaryIf<true>[] = await Actor.createDocuments(data, { temporary: true });
function take<T extends boolean>(a: Actor.TemporaryIf<T>) {}

// ✅ v14 — drop the type param / option; results are always `.Stored`
const made: Actor.Stored[] = await Actor.createDocuments(data);
function take(a: Actor.Stored) {}
```

If you need an unsaved, in‑memory document, construct it directly (`new Actor.implementation(data)`)
rather than relying on a temporary create.

### 2. `createDialog` returns `.Stored | null` and gained `renderOptions`

```ts
// ❌ v13 — could resolve to a temporary doc
const created: Actor | null = await Actor.createDialog(data);

// ✅ v14 — always a stored document or null; extra optional renderOptions arg
const created: Actor.Stored | null = await Actor.createDialog(data, createOptions, options, renderOptions);
```

---

## Runtime‑removed members (these error — Foundry deleted them)

Foundry removed or hard‑privatised these in v14, so the types no longer expose them. Switch to
the replacement.

| Removed (v13)                       | Use instead (v14)                                  |
| ----------------------------------- | -------------------------------------------------- |
| `game.template`                     | `game.system.documentTypes` or `game.model`        |
| `system.template`                   | `system.documentTypes`                             |
| `chatMessage.user`                  | `chatMessage.author`                               |
| `activeEffect.icon` (get/set)       | `activeEffect.img`                                 |
| `applicationV2.bringToTop()`        | `applicationV2.bringToFront()`                     |
| `grid.measureDistances(segments)`   | `grid.measurePath(waypoints)`                      |
| `{{colorPicker}}` Handlebars helper | the `<color-picker>` custom HTML element           |
| `{{select}}` Handlebars helper      | `{{selectOptions}}` / a plain `<select>`           |
| TinyMCE editor `engine: "tinymce"`  | ProseMirror — `engine` is now `"prosemirror"` only |

### Global utility functions are no longer global

v14 stopped exposing the `foundry.utils.*` helpers as bare globals. Calls to the unqualified
names now error — prefix them with `foundry.utils.`:

```ts
// ❌ v13
const copy = duplicate(obj);
mergeObject(a, b);
const v = getProperty(obj, "a.b.c");

// ✅ v14
const copy = foundry.utils.duplicate(obj);
foundry.utils.mergeObject(a, b);
const v = foundry.utils.getProperty(obj, "a.b.c");
```

Affected (non‑exhaustive): `duplicate`, `deepClone`, `mergeObject`, `diffObject`, `objectsEqual`,
`expandObject`, `flattenObject`, `filterObject`, `invertObject`, `isEmpty`, `getProperty`,
`setProperty`, `hasProperty`, `getType`, `randomID`, `debounce`, `benchmark`, `getRoute`,
`fetchWithTimeout`, `fetchJsonWithTimeout`, `parseUuid`, `logCompatibilityWarning`, the geometry
helpers (`lineSegmentIntersects`, `lineLineIntersection`, …), `Semaphore`, `IterableWeakMap`.

---

## Deprecated but still working (migrate at your leisure)

These keep compiling with a deprecation warning — handle them via the
[`no-deprecated` workflow](#the-fastest-migration-path) whenever convenient.

- **Database‑operation type‑alias renames** — `X.Get` → `X.GetOperation`,
  `X.CreateDocumentsOperation` family, the `OnXDocumentsContext`/`OnXDocumentsOperation` types,
  etc. These are pure type renames; the old names still resolve.
- **`FormApplication` (AppV1) FilePicker helpers** — `filepickers`, `_activateFilePicker`,
  `_getFilePickerOptions`, `_onSelectFile` remain but are deprecated; new code should use the
  `<file-picker>` element. The `{{filePicker}}` Handlebars helper likewise still exists.
- **`CONFIG.statusEffects` entries** still accept `icon`/`label`, but prefer `img`/`name`.
- **`_onCreateDocuments` / `_onUpdateDocuments` / `_onDeleteDocuments` static handlers** are
  still present as deprecated shims; new code should override `_onCreateOperation` /
  `_onUpdateOperation` / `_onDeleteOperation`.

### Tip: `fvtt-types/lenient`

If guarding `game`/`CONFIG`/`ui` access before the `init` hook is friction, importing from
`fvtt-types/lenient` (instead of `fvtt-types`) pre‑assumes initialization so those globals are
typed as their ready‑state form. Trade‑off: you lose the "is it initialized yet?" safety. This is
unchanged from v13.

---

## Caveats

- **Prerelease fork.** Published from a fork as a git tag, not on npm. Pin a tag for stability.
- **Pragmatic scope.** The v14 migration targeted the high‑value, most‑consumed surface
  (documents, data/config core, canvas, the common applications). A few low‑traffic areas keep a
  working v13‑compatible shape and only lack v14's _new_ members — they won't block you, but they
  may not yet reflect every v14 addition.
- **A handful of deprecated shims remain by design** (e.g. the `_onXDocuments` static handlers
  above) to ease this very migration; they'll be removed in a future coordinated pass.

## Getting help

- Compiler‑option details and general usage: [README.md](README.md).
- Found a type that disagrees with the v14 runtime? Please
  [open an issue](https://github.com/Fronix/foundry-vtt-types/issues) with a minimal repro.
