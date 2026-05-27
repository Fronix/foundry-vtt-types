import { expectTypeOf } from "vitest";

// The client shape subclass (not the common `foundry.data.*` base) — imported directly because the
// client-data barrel re-export is deferred to Phase 7 (see client/data/_module.d.mts).
import type { CircleShapeData } from "#client/data/shapes.mjs";

const sound = new AmbientSoundDocument.implementation();
expectTypeOf(sound).toEqualTypeOf<AmbientSoundDocument.Implementation>();

expectTypeOf(sound.shape).toEqualTypeOf<CircleShapeData>();
expectTypeOf(sound.prepareDerivedData()).toEqualTypeOf<void>();
