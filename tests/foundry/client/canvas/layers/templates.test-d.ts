import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import MeasuredTemplate = foundry.canvas.placeables.MeasuredTemplate;

expectTypeOf(TemplateLayer.documentName).toEqualTypeOf<"MeasuredTemplate">();
expectTypeOf(TemplateLayer.instance).toEqualTypeOf<TemplateLayer | undefined>();
expectTypeOf(TemplateLayer.layerOptions).toEqualTypeOf<TemplateLayer.LayerOptions>();
expectTypeOf(TemplateLayer.layerOptions.name).toEqualTypeOf<"templates">();
expectTypeOf(TemplateLayer.layerOptions.objectClass).toEqualTypeOf<MeasuredTemplate.ImplementationClass>();
expectTypeOf(TemplateLayer.registerSettings()).toEqualTypeOf<void>();
expectTypeOf(TemplateLayer.prepareSceneControls()).toEqualTypeOf<foundry.applications.ui.SceneControls.Control>();

const layer = new TemplateLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<MeasuredTemplate.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<TemplateLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"templates">();

expectTypeOf(layer.hookName).toEqualTypeOf<"TemplateLayer">;
expectTypeOf(layer.placeables).toEqualTypeOf<MeasuredTemplate.Implementation[]>();
expectTypeOf(layer.activate()).toEqualTypeOf<TemplateLayer>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someWheelEvent: WheelEvent;
expectTypeOf(layer["_getCopyableObjects"]({ cut: false })).toEqualTypeOf<MeasuredTemplate.Implementation[]>();
expectTypeOf(layer["_createDragPreviewData"](pointerEvent)).toEqualTypeOf<AnyObject>();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](someWheelEvent)).toEqualTypeOf<Promise<MeasuredTemplate.Implementation> | void>();
