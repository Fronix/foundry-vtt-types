import { expectTypeOf } from "vitest";
import {
  RectangleShapeData,
  CircleShapeData,
  EllipseShapeData,
  ConeShapeData,
  RingShapeData,
  LineShapeData,
  EmanationShapeData,
  PolygonShapeData,
  TokenShapeData,
  GridShapeData,
} from "#client/data/shapes.mjs";
import type { Ray } from "#client/canvas/geometry/_module.mjs";
import type { Canvas } from "#client/canvas/_module.mjs";

declare const rect: RectangleShapeData;
declare const circle: CircleShapeData;
declare const ellipse: EllipseShapeData;
declare const cone: ConeShapeData;
declare const ring: RingShapeData;
declare const line: LineShapeData;
declare const emanation: EmanationShapeData;
declare const polygon: PolygonShapeData;
declare const token: TokenShapeData;
declare const grid: GridShapeData;

// The client subclasses are also assignable to the common base they mix in.
expectTypeOf(rect).toExtend<foundry.data.RectangleShapeData>();
expectTypeOf(token).toExtend<foundry.data.TokenShapeData>();

// ClientShapeDataMixin getters
expectTypeOf(rect.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(rect.grid).toEqualTypeOf<foundry.grid.BaseGrid>();
expectTypeOf(rect.gridlessGrid).toEqualTypeOf<foundry.grid.GridlessGrid>();
expectTypeOf(rect.isEmpty).toBeBoolean();
expectTypeOf(rect.polygons).toEqualTypeOf<ReadonlyArray<PIXI.Polygon>>();
expectTypeOf(rect.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(rect.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(rect.origin).toEqualTypeOf<Readonly<Canvas.Point>>();
expectTypeOf(rect.center).toEqualTypeOf<Readonly<Canvas.Point>>();
expectTypeOf(rect.area).toBeNumber();
expectTypeOf(rect.isAffectedByGrid).toBeBoolean();
expectTypeOf(rect.hasRotationalSymmetry).toBeBoolean();
expectTypeOf(rect.measuredSegments).toExtend<ReadonlyArray<{ winding: -1 | 0 | 1; distance: number }>>();
expectTypeOf(rect.controlHandles).toExtend<Readonly<Record<string, { visible: boolean }>>>();

// ClientShapeDataMixin methods
expectTypeOf(rect.testPoint({ x: 0, y: 0 })).toBeBoolean();
expectTypeOf(rect.move({ x: 0, y: 0 })).toBeVoid();
expectTypeOf(rect.move({ x: 0, y: 0 }, { snap: true })).toBeVoid();
expectTypeOf(rect.rotate(90)).toBeVoid();
expectTypeOf(rect.rotate(90, { pivot: { x: 1, y: 1 } })).toBeVoid();
expectTypeOf(rect.drawShape(new PIXI.Graphics())).toBeVoid();
expectTypeOf(rect.drawReferenceLines(new PIXI.Graphics())).toBeVoid();
expectTypeOf(rect.moveControlHandle("scale", { x: 0, y: 0 })).toBeVoid();
expectTypeOf(rect.moveControlHandle("scale", { x: 0, y: 0 }, { snap: true, unlinked: true })).toBeVoid();
expectTypeOf(rect.sampleInterior()).toEqualTypeOf<Canvas.Point>();
expectTypeOf(rect.sampleBoundary({ x: 0, y: 0 })).toEqualTypeOf<Canvas.Point>();

// Subclass-specific surface
expectTypeOf(rect["_getRays"]()).toEqualTypeOf<{ axisX: Ray; axisY: Ray }>();
expectTypeOf(ellipse["_getRays"]()).toEqualTypeOf<{ axisX: Ray; axisY: Ray }>();
expectTypeOf(line["_getRays"]()).toEqualTypeOf<{ axisX: Ray; axisY: Ray }>();
expectTypeOf(cone["_getRays"]()).toEqualTypeOf<{ left: Ray; center: Ray; right: Ray }>();
expectTypeOf(circle.isEmpty).toBeBoolean();
expectTypeOf(ring.drawReferenceLines(new PIXI.Graphics())).toBeVoid();
expectTypeOf(emanation.move({ x: 0, y: 0 }, { snap: false })).toBeVoid();
expectTypeOf(polygon["_calculateSize"](10, 0, { snap: true, round: false, allowZero: true })).toBeNumber();
expectTypeOf(grid.testPoint({ x: 0, y: 0 })).toBeBoolean();

// TokenShapeData specifics: the inner shape it delegates to, and the deferred PolygonTree (FIXME → P7)
expectTypeOf(token["_getTokenShape"]()).toEqualTypeOf<
  CircleShapeData | EllipseShapeData | PolygonShapeData | RectangleShapeData
>();
expectTypeOf(token.isEmpty).toBeBoolean();
