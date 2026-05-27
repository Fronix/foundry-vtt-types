import { expectTypeOf } from "vitest";
import type ShapeObjectMixin from "#client/canvas/placeables/mixins/shapes.mjs";

import ShapeControlsHandle = foundry.canvas.containers.ShapeControlsHandle;

declare const shapeObject: ShapeObjectMixin.AnyMixed;

// The currently-hovered shape controls handle.
expectTypeOf(shapeObject.hoveredHandle).toEqualTypeOf<ShapeControlsHandle | null>();
expectTypeOf(shapeObject._hoveredHandle).toEqualTypeOf<ShapeControlsHandle | null>();

// PlaceableObject overrides supplied by the mixin.
expectTypeOf(shapeObject.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(shapeObject.center).toEqualTypeOf<PIXI.Point>();

// New protected measurement helpers.
expectTypeOf(shapeObject["_getMeasurementTextStyle"]()).toEqualTypeOf<PIXI.TextStyle>();
expectTypeOf(shapeObject["_formatMeasuredDistance"](5)).toBeString();
expectTypeOf(shapeObject["_refreshMeasurements"]()).toBeVoid();
