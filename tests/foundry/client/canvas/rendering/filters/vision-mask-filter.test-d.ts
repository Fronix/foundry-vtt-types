import { expectTypeOf } from "vitest";

import VisionMaskFilter = foundry.canvas.rendering.filters.VisionMaskFilter;

const myVMF = VisionMaskFilter.create();
expectTypeOf(myVMF).toEqualTypeOf<VisionMaskFilter>();

expectTypeOf(myVMF.enabled).toEqualTypeOf<boolean>();
