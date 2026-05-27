import { expectTypeOf } from "vitest";

import TransitionContainer = foundry.canvas.TransitionContainer;

declare const container: TransitionContainer;

expectTypeOf(container.defaultTransitionType).toBeString();
expectTypeOf(container.defaultDuration).toBeNumber();
expectTypeOf(container.isLocked).toBeBoolean();
expectTypeOf(container.isRunning).toBeBoolean();
expectTypeOf(container.promise).toEqualTypeOf<Promise<void> | null>();

expectTypeOf(container.run()).toEqualTypeOf<Promise<void>>();
expectTypeOf(container.run({ duration: 800, transitionType: "dots", easing: (t) => t })).toEqualTypeOf<Promise<void>>();
expectTypeOf(container.cancel()).toEqualTypeOf<Promise<void>>();
expectTypeOf(container["_captureCurrentScene"]()).toEqualTypeOf<PIXI.RenderTexture | null>();
expectTypeOf(container["_captureNextScene"]()).toEqualTypeOf<Promise<PIXI.RenderTexture>>();
expectTypeOf(container["_play"]({ duration: 500 })).toEqualTypeOf<Promise<void>>();
expectTypeOf(container["_reset"]()).toBeVoid();
