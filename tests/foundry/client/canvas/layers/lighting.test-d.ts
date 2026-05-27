import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import LightingLayer = foundry.canvas.layers.LightingLayer;
import AmbientLight = foundry.canvas.placeables.AmbientLight;

expectTypeOf(LightingLayer.documentName).toEqualTypeOf<"AmbientLight">();
expectTypeOf(LightingLayer.instance).toEqualTypeOf<LightingLayer | undefined>();
expectTypeOf(LightingLayer.layerOptions).toEqualTypeOf<LightingLayer.LayerOptions>();
expectTypeOf(LightingLayer.layerOptions.name).toEqualTypeOf<"lighting">();
expectTypeOf(LightingLayer.layerOptions.objectClass).toEqualTypeOf<AmbientLight.ImplementationClass>();

const layer = new LightingLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<AmbientLight.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<LightingLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"lighting">();

expectTypeOf(layer.hookName).toEqualTypeOf<"LightingLayer">();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer.refreshFields()).toBeVoid();
expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(LightingLayer.prepareSceneControls()).toEqualTypeOf<foundry.applications.ui.SceneControls.Control>();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const wheelEvent: foundry.canvas.Canvas.Event.Wheel;
declare const darknessChangeEvent: foundry.canvas.Canvas.Event.DarknessChange;
// `_canDragLeftStart` / the `_onDragLeft*` family come from the shared `ShapeLayerMixin`.
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_createDragShapeData"](pointerEvent)).toEqualTypeOf<AnyObject>();
expectTypeOf(layer["_updateDragPreview"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_updateMouseWheelPreview"]()).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](wheelEvent)).toEqualTypeOf<Promise<AmbientLight.Implementation[] | void>>();
expectTypeOf(layer["_onDarknessChange"](darknessChangeEvent)).toBeVoid();
