import { expectTypeOf } from "vitest";

// The client shape subclasses (not the common `foundry.data.*` bases) — imported directly because the
// client-data barrel re-export is deferred to Phase 7 (see client/data/_module.d.mts).
import type { CircleShapeData, ConeShapeData } from "#client/data/shapes.mjs";

const light = new AmbientLightDocument.implementation();
expectTypeOf(light).toEqualTypeOf<AmbientLightDocument.Implementation>();

expectTypeOf(light.isGlobal).toEqualTypeOf<boolean>();
expectTypeOf(light.shape).toEqualTypeOf<CircleShapeData | ConeShapeData>();
expectTypeOf(light.prepareDerivedData()).toEqualTypeOf<void>();
