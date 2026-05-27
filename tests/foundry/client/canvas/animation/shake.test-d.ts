import { expectTypeOf } from "vitest";

import CanvasShakeEffect = foundry.canvas.animation.CanvasShakeEffect;

expectTypeOf(CanvasShakeEffect.TAKEOVER_DURATION_MS).toBeNumber();

const shake = new CanvasShakeEffect({ duration: 6000, maxDisplacement: 20, smoothness: 0.6 });

expectTypeOf(shake.duration).toBeNumber();
expectTypeOf(shake.maxDisplacement).toBeNumber();
expectTypeOf(shake.smoothness).toBeNumber();
expectTypeOf(shake.returnSpeed).toBeNumber();
expectTypeOf(shake.randomOffset).toBeNumber();
expectTypeOf(shake.startTime).toBeNumber();
expectTypeOf(shake.playing).toBeBoolean();

expectTypeOf(shake.play()).toEqualTypeOf<Promise<void>>();
expectTypeOf(shake.stop()).toBeVoid();
expectTypeOf(shake.stop({ snap: false, release: false })).toBeVoid();
