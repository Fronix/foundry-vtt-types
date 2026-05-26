import { expectTypeOf } from "vitest";

import ColorizeBrightnessShader = foundry.canvas.rendering.shaders.ColorizeBrightnessShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const _myCBS = ColorizeBrightnessShader.create();

expectTypeOf(ColorizeBrightnessShader.classPluginName).toEqualTypeOf<string | null>();
expectTypeOf(ColorizeBrightnessShader["_createVertexShader"]()).toBeString();
expectTypeOf(ColorizeBrightnessShader["_createFragmentShader"]()).toBeString();
expectTypeOf(ColorizeBrightnessShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
