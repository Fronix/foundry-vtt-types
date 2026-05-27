import { expectTypeOf } from "vitest";

import ShapeControls = foundry.canvas.containers.ShapeControls;
import ShapeControlsHandle = foundry.canvas.containers.ShapeControlsHandle;

declare const controls: ShapeControls.Any;

expectTypeOf(controls.border).toEqualTypeOf<PIXI.Graphics>();
expectTypeOf(controls.handles).toEqualTypeOf<PIXI.Container>();
expectTypeOf(controls.tint).toBeNumber();
controls.tint = 0xff0000;
expectTypeOf(controls.editable).toBeBoolean();
expectTypeOf(controls.dashed).toBeBoolean();
controls.dashed = true;
expectTypeOf(controls.applyRenderFlags()).toBeVoid();
expectTypeOf(controls.refresh()).toBeVoid();
expectTypeOf(controls.draw()).toExtend<Promise<ShapeControls.Any>>();
expectTypeOf(controls.destroy()).toBeVoid();
expectTypeOf(controls.destroy(true)).toBeVoid();

// static drag-preview helper preserves the placeable object's type
declare const someToken: foundry.canvas.placeables.Token.Implementation;
expectTypeOf(
  ShapeControls["_createDragPreview"](someToken),
).toEqualTypeOf<foundry.canvas.placeables.Token.Implementation>();

declare const handle: ShapeControlsHandle;

expectTypeOf(handle.controls).toEqualTypeOf<ShapeControls.Any>();
expectTypeOf(handle.hovered).toBeBoolean();
expectTypeOf(handle.draw({ size: 16, outlineThickness: 2 })).toEqualTypeOf<Promise<void>>();
