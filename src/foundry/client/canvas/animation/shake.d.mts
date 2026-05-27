import type { Identity, InexactPartial } from "#utils";

/**
 * A lightweight screen/object shake utility.
 *
 * `CanvasShakeEffect` applies a smooth, time-based positional jitter to a target {@link PIXI.DisplayObject}
 * by offsetting its `x` and `y` coordinates relative to a captured reference point. The shake motion is
 * produced using two independent {@link foundry.canvas.animation.SmoothNoise | `SmoothNoise`} generators
 * (one per axis) to provide a more natural camera-like shake.
 */
declare class CanvasShakeEffect {
  /**
   * Create a new CanvasShakeEffect
   */
  constructor(options: CanvasShakeEffect.ConstructorOptions);

  /**
   * Duration in ms of the smooth takeover transition when a new shake replaces an active shake.
   * @defaultValue `150`
   */
  static TAKEOVER_DURATION_MS: number;

  /**
   * Total shake duration in MS. After this duration elapses, the effect transitions into a return-to-origin
   * phase.
   */
  duration: number;

  /**
   * Maximum displacement in pixels during the shake. This value is used as the target maximum offset along
   * each axis.
   */
  maxDisplacement: number;

  /**
   * Smoothness parameter in the range `[0, 1]`. Higher values produce smoother, lower-frequency motion.
   */
  smoothness: number;

  /**
   * Return-to-origin interpolation factor per tick, in the range `[0, 1]`.
   */
  returnSpeed: number;

  /**
   * The deterministic time offset derived from the seed. Applied to the elapsed time before generating noise.
   */
  randomOffset: number;

  /**
   * The time (in ticker milliseconds) at which the active shake started.
   * @remarks Assigned when {@link CanvasShakeEffect.play | `play`} begins.
   */
  startTime: number;

  /**
   * Whether the shake effect is currently active.
   */
  get playing(): boolean;

  /**
   * Start the shake effect.
   * Registers a ticker callback and returns a promise that resolves once the effect ends.
   * @returns A promise that resolves when the effect completes or is stopped.
   */
  play(): Promise<void>;

  /**
   * Stop the shake effect immediately. Removes the ticker callback, optionally snaps the target back to its
   * base position, and resolves the active promise.
   * @param options - Stop options
   */
  stop(options?: CanvasShakeEffect.StopOptions): void;
}

declare namespace CanvasShakeEffect {
  interface Any extends AnyCanvasShakeEffect {}
  interface AnyConstructor extends Identity<typeof AnyCanvasShakeEffect> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The target PIXI display object to shake.
     * @defaultValue `canvas.stage`
     */
    target: PIXI.DisplayObject;

    /**
     * Total shake duration in MS.
     * @defaultValue `5000`
     */
    duration: number;

    /**
     * Maximum displacement in pixels.
     * @defaultValue `35`
     */
    maxDisplacement: number;

    /**
     * Smoothness in the range `[0, 1]`. Higher is smoother.
     * @defaultValue `0.5`
     */
    smoothness: number;

    /**
     * "Return to origin" lerp factor per tick in the range `[0, 1]`.
     * @defaultValue `0.1`
     */
    returnSpeed: number;

    /**
     * Should hidden canvas group masks be invalidated each frame?
     * @defaultValue `false`
     */
    invalidateMasks: boolean;

    /**
     * Optional seed used to derive a deterministic time offset.
     * @defaultValue `null`
     */
    seed: number | null;

    /**
     * Optional PIXI ticker. Defaults to {@linkcode foundry.canvas.animation.CanvasAnimation.ticker}.
     * @defaultValue `null`
     */
    ticker: PIXI.Ticker | null;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  /** @internal */
  type _StopOptions = InexactPartial<{
    /**
     * Snap the target back to its base position.
     * @defaultValue `true`
     */
    snap: boolean;

    /**
     * Release the target shake state if no other shake is active.
     * @defaultValue `true`
     */
    release: boolean;
  }>;

  interface StopOptions extends _StopOptions {}
}

export default CanvasShakeEffect;

declare abstract class AnyCanvasShakeEffect extends CanvasShakeEffect {
  constructor(...args: never);
}
