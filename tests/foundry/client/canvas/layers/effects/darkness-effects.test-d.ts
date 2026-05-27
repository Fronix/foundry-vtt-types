import { expectTypeOf } from "vitest";

import CanvasDarknessEffects = foundry.canvas.layers.CanvasDarknessEffects;
import CanvasLayer = foundry.canvas.layers.CanvasLayer;
import VoidFilter = foundry.canvas.rendering.filters.VoidFilter;

const layer = new CanvasDarknessEffects();

expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof CanvasLayer>();
expectTypeOf(layer.filter).toEqualTypeOf<VoidFilter | undefined>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<CanvasDarknessEffects>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.clear()).toBeVoid();
