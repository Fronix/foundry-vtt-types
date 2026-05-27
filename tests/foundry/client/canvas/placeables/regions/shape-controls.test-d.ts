import { expectTypeOf } from "vitest";

import RegionShapeControls = foundry.canvas.placeables.regions.RegionShapeControls;

declare const controls: RegionShapeControls;

// The generic type arguments resolve to the Region document / placeable / layer.
expectTypeOf(controls.document).toEqualTypeOf<RegionDocument.Implementation>();
expectTypeOf(controls.object).toEqualTypeOf<foundry.canvas.placeables.Region.Implementation>();
expectTypeOf(controls.layer).toEqualTypeOf<foundry.canvas.layers.RegionLayer>();

expectTypeOf(controls.refresh()).toBeVoid();
expectTypeOf(controls.editable).toBeBoolean();
