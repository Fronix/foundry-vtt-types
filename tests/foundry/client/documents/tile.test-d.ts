import { expectTypeOf } from "vitest";

// The client shape subclass (not the common `foundry.data.*` base) — imported directly because the
// client-data barrel re-export is deferred to Phase 7 (see client/data/_module.d.mts).
import type { RectangleShapeData } from "#client/data/shapes.mjs";

// @ts-expect-error requires width and height
new TileDocument.implementation();

// @ts-expect-error requires width and height
new TileDocument.implementation({});

const tile = new TileDocument.implementation({ width: 400, height: 400 });
expectTypeOf(tile).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(tile.shape).toEqualTypeOf<RectangleShapeData>();
expectTypeOf(tile.prepareDerivedData()).toEqualTypeOf<void>();
expectTypeOf(tile.prepareBaseData()).toEqualTypeOf<void>();
