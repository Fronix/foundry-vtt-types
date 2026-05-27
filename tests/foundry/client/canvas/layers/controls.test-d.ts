import { expectTypeOf } from "vitest";

import utils = foundry.utils;
import Canvas = foundry.canvas.Canvas;
import Cursor = foundry.canvas.containers.Cursor;
import UnboundContainer = foundry.canvas.containers.UnboundContainer;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;
import ControlsLayer = foundry.canvas.layers.ControlsLayer;
import Ruler = foundry.canvas.interaction.Ruler;
import Ray = foundry.canvas.geometry.Ray;

expectTypeOf(ControlsLayer.instance).toExtend<ControlsLayer.Implementation | undefined>();
expectTypeOf(ControlsLayer.layerOptions).toEqualTypeOf<ControlsLayer.LayerOptions>();

const layer = new ControlsLayer();

// v14: ControlsLayer extends CanvasLayer directly (no longer an InteractionLayer)
expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.options).toEqualTypeOf<ControlsLayer.LayerOptions>();

expectTypeOf(layer.doors).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.pings).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.cursors).toEqualTypeOf<UnboundContainer>();
expectTypeOf(layer._rulerPaths).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer.debug).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(layer.select).toEqualTypeOf<PIXI.Graphics | undefined>();

expectTypeOf(layer._cursors).toEqualTypeOf<Record<string, Cursor>>();
expectTypeOf(layer["_rulers"]).toEqualTypeOf<Record<string, Ruler.Implementation>>();
expectTypeOf(layer["_offscreenPings"]).toEqualTypeOf<Record<string, Canvas.Point>>();

expectTypeOf(layer.ruler).toEqualTypeOf<Ruler.Implementation | null>();
expectTypeOf(layer.getRulerForUser("afasfasg")).toEqualTypeOf<Ruler.Implementation | null>();
expectTypeOf(layer.getCursorForUser("afasfasg")).toEqualTypeOf<Cursor | null>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer.drawCursors()).toBeVoid();
expectTypeOf(layer.drawRulers()).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.drawDoors()).toBeVoid();

declare const someRect: PIXI.ICanvasRect;
expectTypeOf(layer.drawSelect(someRect)).toBeVoid();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const somePoint: PIXI.Point;

expectTypeOf(layer["_deactivate"]()).toBeVoid();
expectTypeOf(layer["_onMouseMove"](somePoint)).toBeVoid();
expectTypeOf(layer["_onLongPress"](pointerEvent, somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer["_onCanvasPan"]()).toBeVoid();

declare const someUser: User.Stored;
expectTypeOf(layer.drawCursor(someUser)).toEqualTypeOf<Cursor>();
expectTypeOf(layer.drawRuler(someUser)).toEqualTypeOf<Promise<Ruler.Implementation>>();
expectTypeOf(layer.updateCursor(someUser, somePoint)).toBeVoid();
expectTypeOf(layer.updateCursor(someUser, null)).toBeVoid();

expectTypeOf(layer.updateRuler(someUser)).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.updateRuler(someUser, null)).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.updateRuler(someUser, { hidden: true, path: [{ x: 1, y: 2, elevation: 3 }] })).toEqualTypeOf<
  Promise<void>
>();

// @ts-expect-error handlePing requires a `scene` ID in its options
expectTypeOf(layer.handlePing(someUser, somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer.handlePing(someUser, somePoint, { scene: "some scene ID" })).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  layer.handlePing(someUser, somePoint, {
    scene: "some scene ID",
    color: 0xfaddaf,
    duration: 2323,
    name: "SomePing.ASFASDFAS",
    pull: null,
    size: 120,
    style: "alert",
    zoom: 2.6,
  }),
).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(layer.drawOffscreenPing(somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer.drawOffscreenPing(somePoint, {})).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  layer.drawOffscreenPing(somePoint, {
    color: [0.2, 0.7, 0.3],
    duration: 500,
    name: Symbol.toPrimitive,
    size: 500,
    style: "chevron",
    user: someUser,
  }),
).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(layer.drawPing(somePoint)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer.drawPing(somePoint, {})).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(
  layer.drawPing(somePoint, {
    color: "#ABCDEF",
    name: "bizzfuzz",
    duration: 1000,
    size: 250,
    style: null,
    user: null,
  }),
).toEqualTypeOf<Promise<boolean>>();

expectTypeOf(layer["_findViewportIntersection"](somePoint)).toEqualTypeOf<{
  ray: Ray;
  intersection: utils.LineIntersection | undefined;
}>();

// v14: ControlsLayer is a CanvasLayer, so it has draw/tearDown hooks but no activate/deactivate hooks
Hooks.on("drawControlsLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<ControlsLayer.Implementation>();
});

Hooks.on("tearDownControlsLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<ControlsLayer.Implementation>();
});
