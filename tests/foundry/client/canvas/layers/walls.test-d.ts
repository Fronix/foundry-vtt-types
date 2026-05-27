import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import WallsLayer = foundry.canvas.layers.WallsLayer;
import PlaceablesLayer = foundry.canvas.layers.PlaceablesLayer;
import Wall = foundry.canvas.placeables.Wall;
import Canvas = foundry.canvas.Canvas;
import SceneControls = foundry.applications.ui.SceneControls;

expectTypeOf(WallsLayer.documentName).toEqualTypeOf<"Wall">();
expectTypeOf(WallsLayer.prepareSceneControls()).toEqualTypeOf<SceneControls.Control>();
expectTypeOf(WallsLayer.instance).toEqualTypeOf<WallsLayer | undefined>();
expectTypeOf(WallsLayer.layerOptions).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(WallsLayer.layerOptions.name).toEqualTypeOf<"walls">();
expectTypeOf(WallsLayer.layerOptions.objectClass).toEqualTypeOf<Wall.ImplementationClass>();
declare const somePoint: PIXI.Point;
declare const someWall: Wall.Implementation;
expectTypeOf(WallsLayer.getClosestEndpoint(somePoint, someWall)).toEqualTypeOf<Canvas.PointTuple>();

const layer = new WallsLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Wall.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"walls">();

expectTypeOf(layer.hookName).toEqualTypeOf<"WallsLayer">();
expectTypeOf(layer.doors).toEqualTypeOf<Wall.Implementation[]>();
expectTypeOf(layer["_chain"]).toBeBoolean();
expectTypeOf(layer["_last"]).toEqualTypeOf<{ point: Canvas.PointTuple | null }>();

expectTypeOf(layer.getSnappedPoint({ x: 71, y: 59 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

expectTypeOf(layer.releaseAll()).toBeNumber();

expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint)).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint, { snap: true })).toEqualTypeOf<Canvas.PointTuple>();
expectTypeOf(layer["_getWallEndpointCoordinates"](somePoint, { snap: null })).toEqualTypeOf<Canvas.PointTuple>();

expectTypeOf(layer.identifyInteriorArea([someWall, someWall])).toEqualTypeOf<PIXI.Polygon[]>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(layer["_createDragPreviewData"](pointerEvent)).toEqualTypeOf<AnyObject>();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();

declare const histEntry: PlaceablesLayer.HistoryEntry<"Wall">;
expectTypeOf(layer["_onUndoCreate"](histEntry)).toEqualTypeOf<Promise<WallDocument.Implementation[]>>();
