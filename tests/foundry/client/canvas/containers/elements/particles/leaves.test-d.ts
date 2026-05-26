/* eslint-disable @typescript-eslint/no-deprecated -- AutumnLeavesWeatherEffect is @deprecated (until v16); this whole file tests it */
import { describe, expectTypeOf, test } from "vitest";

import AutumnLeavesWeatherEffect = foundry.canvas.containers.AutumnLeavesWeatherEffect;

describe("AutumnLeavesWeatherEffect tests", () => {
  const myLeaves = new AutumnLeavesWeatherEffect();
  test("Miscellaneous", () => {
    // @ts-expect-error LEAF_CONFIG is not a fully valid `EmitterConfigV3`, it is completed inside `#getParticleEmitters`
    expectTypeOf(myLeaves.createEmitter(AutumnLeavesWeatherEffect.LEAF_CONFIG)).toEqualTypeOf<PIXI.particles.Emitter>();
    expectTypeOf(myLeaves.getParticleEmitters()).toEqualTypeOf<PIXI.particles.Emitter[]>();
  });
});
