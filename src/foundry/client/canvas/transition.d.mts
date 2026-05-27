import type { Identity, InexactPartial } from "#utils";
import type { UnboundContainer } from "#client/canvas/containers/_module.d.mts";

/**
 * Persistent overlay dedicated to scene transitions.
 */
declare class TransitionContainer extends UnboundContainer {
  constructor();

  /**
   * Desired transition type to use for transitions when no explicit type is provided.
   * @defaultValue `CONFIG.Canvas.sceneTransitions.fade.id`
   */
  defaultTransitionType: string;

  /**
   * Default transition duration used by {@link TransitionContainer._play | `TransitionContainer#_play`}
   * when no explicit duration is provided (milliseconds).
   * @defaultValue `1000`
   */
  defaultDuration: number;

  /**
   * Flag indicating whether this container is reserved for an external workflow.
   * When true, core scene transitions should not use this container.
   * @defaultValue `false`
   */
  isLocked: boolean;

  /**
   * Flag indicating whether a transition animation is currently running.
   * Prevents overlapping calls to {@link TransitionContainer._play | `TransitionContainer#_play`}.
   */
  get isRunning(): boolean;

  /**
   * Promise that resolves when the current transition finishes or is cancelled.
   * Reused to return the same promise on repeated `_play` calls.
   */
  get promise(): Promise<void> | null;

  /**
   * Run a full transition around a given canvas operation.
   * Encapsulates captureCurrentScene → operation/scene switch → captureNextScene → play.
   * @param options - Run options
   * @returns Promise that resolves when the transition completes.
   */
  run(options?: TransitionContainer.RunOptions): Promise<void>;

  /**
   * Cancel any currently running transition and await its termination.
   */
  cancel(): Promise<void>;

  /**
   * Capture the currently displayed scene into a render texture and show it.
   * If `black` is true, uses a solid black frame instead of capturing the scene.
   * @param options - Capture options.
   * @returns The render texture of the current scene, or null if black.
   */
  protected _captureCurrentScene(options?: TransitionContainer.CaptureCurrentSceneOptions): PIXI.RenderTexture | null;

  /**
   * Capture the next rendered frame of the new scene into a render texture.
   * @param options - Capture options.
   * @returns Promise resolving to the captured render texture.
   */
  protected _captureNextScene(options?: TransitionContainer.CaptureNextSceneOptions): Promise<PIXI.RenderTexture>;

  /**
   * Run the transition animation from the captured "from" texture to the "to" texture.
   * @param opts - Animation options.
   * @returns Promise that resolves when the transition completes.
   */
  protected _play(opts?: TransitionContainer.PlayOptions): Promise<void>;

  /**
   * Reset the internal state of the transition container.
   */
  protected _reset(): void;
}

declare namespace TransitionContainer {
  interface Any extends AnyTransitionContainer {}
  interface AnyConstructor extends Identity<typeof AnyTransitionContainer> {}

  /** @internal */
  type _RunOptions = InexactPartial<{
    /** Async function performing canvas changes. */
    operation: () => Promise<void> | void;

    /** Scene document to view or activate as the "next" scene. */
    nextScene: Scene.Implementation;

    /**
     * When true, call {@link Scene.activate | `Scene#activate`} instead of {@link Scene.view | `Scene#view`}.
     * @defaultValue `false`
     */
    activate: boolean;

    /**
     * RGBA clear color in the 0-1 range.
     * @defaultValue `[0, 0, 0, 1]`
     */
    clearColor: number[];

    /**
     * When true, starts from a black frame instead of capturing.
     * @defaultValue `false`
     */
    fromBlack: boolean;

    /** Duration in milliseconds. Defaults to {@linkcode TransitionContainer.defaultDuration}. */
    duration: number;

    /** Transition type id to use for this run. */
    transitionType: string;

    /**
     * Easing function mapping `[0, 1]` to `[0, 1]`.
     * @defaultValue `t => t`
     */
    easing: (t: number) => number;
  }>;

  interface RunOptions extends _RunOptions {}

  /** @internal */
  type _CaptureCurrentSceneOptions = InexactPartial<{
    /**
     * RGBA clear color in the 0-1 range.
     * @defaultValue `[0, 0, 0, 1]`
     */
    clearColor: number[];

    /**
     * When true, uses a black frame instead of capturing.
     * @defaultValue `false`
     */
    black: boolean;
  }>;

  interface CaptureCurrentSceneOptions extends _CaptureCurrentSceneOptions {}

  /** @internal */
  type _CaptureNextSceneOptions = InexactPartial<{
    /**
     * RGBA clear color in the 0-1 range.
     * @defaultValue `[0, 0, 0, 1]`
     */
    clearColor: number[];

    /** Transition type id to use for this capture. */
    transitionType: string;
  }>;

  interface CaptureNextSceneOptions extends _CaptureNextSceneOptions {}

  /** @internal */
  type _PlayOptions = InexactPartial<{
    /** Duration in milliseconds. */
    duration: number;

    /** Easing function mapping `[0, 1]` to `[0, 1]`. */
    easing: (t: number) => number;
  }>;

  interface PlayOptions extends _PlayOptions {}
}

export default TransitionContainer;

declare abstract class AnyTransitionContainer extends TransitionContainer {
  constructor(...args: never);
}
