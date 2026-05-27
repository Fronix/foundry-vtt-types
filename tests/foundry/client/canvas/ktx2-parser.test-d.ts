import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import KTX2Parser = foundry.canvas.KTX2Parser;

expectTypeOf(KTX2Parser.WASM_PATH).toBeString();
expectTypeOf(KTX2Parser.initialized).toBeBoolean();
expectTypeOf(KTX2Parser.module).toEqualTypeOf<AnyObject | null>();
expectTypeOf(KTX2Parser.initialize()).toEqualTypeOf<Promise<AnyObject>>();
expectTypeOf(KTX2Parser.initialize({ wasmPath: "scripts/ktx2/libktx.wasm" })).toEqualTypeOf<Promise<AnyObject>>();

declare const buffer: ArrayBuffer;
expectTypeOf(KTX2Parser.parse(buffer)).toEqualTypeOf<Promise<PIXI.CompressedTextureResource>>();
expectTypeOf(KTX2Parser.loadResource("foo.ktx2", { transcodeTarget: "BC7_RGBA" })).toEqualTypeOf<
  Promise<PIXI.CompressedTextureResource>
>();
