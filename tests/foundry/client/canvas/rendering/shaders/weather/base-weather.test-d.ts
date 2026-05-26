import { expectTypeOf } from "vitest";

import AbstractWeatherShader = foundry.canvas.rendering.shaders.AbstractWeatherShader;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

declare class MyWeatherShader extends AbstractWeatherShader<{
  foo: number;
  bar: [number, number];
}> {}
const AWS = MyWeatherShader;
let myAWS;

expectTypeOf(AWS["_createFragmentShader"]()).toEqualTypeOf<string>();
expectTypeOf(AWS["_createVertexShader"]()).toEqualTypeOf<string>();
expectTypeOf((myAWS = AWS.create())).toEqualTypeOf<AbstractWeatherShader>();

expectTypeOf(myAWS.speed).toEqualTypeOf<number>();
expectTypeOf(myAWS["_preRender"]).toEqualTypeOf<AbstractBaseShader.PreRenderFunction>();

// dynamic properties
expectTypeOf(myAWS.foo).toBeNumber();
expectTypeOf(myAWS.bar).toEqualTypeOf<[number, number]>();
