import { expectTypeOf } from "vitest";

import AmplificationSamplerShader = foundry.canvas.rendering.shaders.AmplificationSamplerShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

const myASS = AmplificationSamplerShader.create();
expectTypeOf(myASS).toEqualTypeOf<AmplificationSamplerShader>();

expectTypeOf(AmplificationSamplerShader.defaultUniforms).toEqualTypeOf<AbstractBaseShader.Uniforms>();
expectTypeOf(AmplificationSamplerShader.classPluginName).toEqualTypeOf<string | null>();
// `AmplificationSamplerShader` is the v14 holdout that keeps the deprecated `fragmentShader`
// (as a method, deprecated since v14 until v16) rather than migrating to `_createFragmentShader`.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(AmplificationSamplerShader.fragmentShader()).toEqualTypeOf<string>();
expectTypeOf(AmplificationSamplerShader.registerPlugin({ force: true })).toEqualTypeOf<void>();
expectTypeOf(myASS.paused).toEqualTypeOf<boolean>;
expectTypeOf(myASS.pluginName).toEqualTypeOf<string | null>();
expectTypeOf(myASS.colorTint).toEqualTypeOf<Color.RGBColorVector>();
