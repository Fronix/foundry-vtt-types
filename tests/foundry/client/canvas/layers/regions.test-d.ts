import { expectTypeOf } from "vitest";

import RegionLayer = foundry.canvas.layers.RegionLayer;
import Canvas = foundry.canvas.Canvas;
import Region = foundry.canvas.placeables.Region;

expectTypeOf(RegionLayer.documentName).toEqualTypeOf<"Region">();
expectTypeOf(RegionLayer.instance).toEqualTypeOf<RegionLayer | undefined>();
expectTypeOf(RegionLayer.layerOptions).toEqualTypeOf<RegionLayer.LayerOptions>();
expectTypeOf(RegionLayer.layerOptions.name).toEqualTypeOf<"regions">();
expectTypeOf(RegionLayer.layerOptions.objectClass).toEqualTypeOf<Region.ImplementationClass>();

const layer = new RegionLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Region.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<RegionLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"regions">();

expectTypeOf(layer.hookName).toEqualTypeOf<"RegionLayer">();
expectTypeOf(layer.templateMode).toBeBoolean();
expectTypeOf(layer._togglePaletteVisible).toBeBoolean();
expectTypeOf(layer._highlights).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer._shapeClipboard).toEqualTypeOf<RegionLayer.ShapeClipboard>();

expectTypeOf(layer["_deactivate"]()).toBeVoid();

// `storeHistory` tests omitted due to current breakage of document `.toObject()` typing
// The override does not change the signature, so they'd be redundant over the `PlaceablesLayer` tests in any case

expectTypeOf(layer.copyObjects()).toEqualTypeOf<ReadonlyArray<Region.Implementation>>();
expectTypeOf(layer.getSnappedPoint({ x: 10, y: 20 })).toEqualTypeOf<Canvas.Point>();
expectTypeOf(layer.getZIndex()).toBeNumber();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(RegionLayer.prepareSceneControls()).toEqualTypeOf<foundry.applications.ui.SceneControls.Control>();

declare const someShapeData: foundry.data.BaseShapeData;
expectTypeOf(layer["_highlightShape"]()).toBeVoid();
expectTypeOf(layer["_highlightShape"](null)).toBeVoid();
expectTypeOf(layer["_highlightShape"](someShapeData)).toBeVoid();

declare const someRegionData: RegionDocument.CreateData;
expectTypeOf(layer.placeRegion(someRegionData)).toEqualTypeOf<Promise<RegionDocument.Implementation | null>>();
expectTypeOf(layer.placeRegion(someRegionData, { create: false, allowRotation: true })).toEqualTypeOf<
  Promise<RegionDocument.Implementation | null>
>();
expectTypeOf(layer.placeRegions([someRegionData])).toEqualTypeOf<Promise<RegionDocument.Implementation[] | null>>();
expectTypeOf(layer._cancelPlacement()).toBeVoid();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const wheelEvent: foundry.canvas.Canvas.Event.Wheel;
declare const keyboardEvent: KeyboardEvent;
expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickLeft2"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftDrop"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onCutKey"](keyboardEvent)).toBeBoolean();
expectTypeOf(layer["_onCopyKey"](keyboardEvent)).toBeBoolean();
expectTypeOf(layer["_onPasteKey"](keyboardEvent)).toBeBoolean();
expectTypeOf(layer["_onDismissKey"](keyboardEvent)).toBeBoolean();
expectTypeOf(layer["_onMouseWheel"](wheelEvent)).toEqualTypeOf<Promise<Region.Implementation[] | void>>();
