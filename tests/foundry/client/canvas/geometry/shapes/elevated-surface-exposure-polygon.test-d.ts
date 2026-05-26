import { expectTypeOf } from "vitest";

import ElevatedSurfaceExposureGenerator = foundry.canvas.geometry.ElevatedSurfaceExposureGenerator;
import PointSourcePolygon = foundry.canvas.geometry.PointSourcePolygon;

declare const polygon: PointSourcePolygon;

new ElevatedSurfaceExposureGenerator(polygon);
new ElevatedSurfaceExposureGenerator(polygon, {});
new ElevatedSurfaceExposureGenerator(polygon, { threshold: undefined });
const gen = new ElevatedSurfaceExposureGenerator(polygon, { threshold: 5 });

expectTypeOf(gen.polygon).toEqualTypeOf<PointSourcePolygon>();
expectTypeOf(gen.threshold).toBeNumber();

// FIXME(v14): returns `PolygonTree | null` once `client/data/polygon-tree.d.mts` is authored (Phase 7).
expectTypeOf(gen.result).toEqualTypeOf<object | null>();
expectTypeOf(gen.compute()).toEqualTypeOf<object | null>();
expectTypeOf(ElevatedSurfaceExposureGenerator.compute(polygon)).toEqualTypeOf<object | null>();
expectTypeOf(ElevatedSurfaceExposureGenerator.compute(polygon, { threshold: 5 })).toEqualTypeOf<object | null>();
