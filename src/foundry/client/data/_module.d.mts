// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.
/* eslint-disable import-x/extensions */

export * as types from "./_types.mjs";
export * from "#common/data/_module.mjs";
export * as regionBehaviors from "./region-behaviors/_module.mjs";
export * as regionShapes from "./region-shapes/_module.mjs";
export * as fields from "./fields.mjs";
export * from "./terrain-data.mjs";
export { default as CombatConfiguration } from "./combat-config.mjs";
export { default as ClientDatabaseBackend } from "./client-backend.mjs";
export { default as CalendarData } from "./calendar.mjs";
export * from "./calendar.mjs";

// TODO(v14, P7): The v14 source barrel additionally re-exports the client shape classes from `./shapes.mjs`
// (`RectangleShapeData`, `CircleShapeData`, …) under the SAME names as the common `BaseShapeData` subclasses
// already pulled in by `export * from "#common/data/_module.mjs"` above. At the type level that re-export
// would *shadow* `foundry.data.RectangleShapeData` with the namespace-less client subclass — dropping the
// common class's `.Schema`/`.Source`/`.CreateData`/… namespaces and breaking `RegionDocument#shapes` typing
// (which is built from the common `BaseShapeData.Types` registry). Adding it coherently requires the client
// subclasses to re-expose the common namespaces AND `region.shapes` to resolve to the client subclasses — a
// cross-cutting region/Scene/common-`Types` unification, deferred to Phase 7. The classes are authored in
// `./shapes.d.mts` and importable directly until then (used by the 5.6e shape leaf placeables).
