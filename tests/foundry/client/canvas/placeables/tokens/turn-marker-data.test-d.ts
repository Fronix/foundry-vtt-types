import { expectTypeOf } from "vitest";

import TurnMarkerData = foundry.canvas.placeables.tokens.TurnMarkerData;
import AbstractBaseShader = foundry.canvas.rendering.shaders.AbstractBaseShader;

new TurnMarkerData();
new TurnMarkerData({});

const myTMD = new TurnMarkerData({
  id: "spin",
  label: "MYSYSTEM.TurnMarker.spin",
  config: {
    shader: undefined,
    spin: 1,
    pulse: {
      speed: 0.5,
      min: 0.8,
      max: 1,
    },
  },
});

expectTypeOf(myTMD.id).toEqualTypeOf<string | undefined>();
expectTypeOf(myTMD.label).toEqualTypeOf<string | undefined>();
expectTypeOf(myTMD.config.shader).toEqualTypeOf<typeof AbstractBaseShader | null | undefined>();
expectTypeOf(myTMD.config.spin).toBeNumber();
expectTypeOf(myTMD.config.pulse.speed).toBeNumber();
expectTypeOf(myTMD.config.pulse.min).toBeNumber();
expectTypeOf(myTMD.config.pulse.max).toBeNumber();

// The mixed-in typedefs
declare const animationData: TurnMarkerData.TurnMarkerAnimationData;
expectTypeOf(animationData.id).toBeString();
expectTypeOf(animationData.config).toEqualTypeOf<TurnMarkerData.TurnMarkerAnimationConfigData | undefined>();
expectTypeOf(animationData.config!.shader).toEqualTypeOf<typeof AbstractBaseShader | null | undefined>();
