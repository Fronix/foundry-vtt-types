import type { FixedInstanceType, InexactPartial, Mixin } from "#utils";
import type { PrimaryCanvasObjectMixin } from "./_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class PrimaryOccludableObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * Is this occludable object hidden for Gamemaster visibility only?
   * @defaultValue `false`
   */
  hidden: boolean;

  /**
   * A flag which tracks whether the primary canvas object is currently in an occluded state.
   * @defaultValue `false`
   */
  occluded: boolean;

  /**
   * The occlusion mode of this occludable object (a union of {@linkcode CONST.OCCLUSION_MODES})
   * @defaultValue {@linkcode CONST.OCCLUSION_MODES.NONE}
   */
  occlusionMode: CONST.OCCLUSION_MODES;

  /**
   * Do surfaces at the same elevation as this object apply occlusion to this object?
   * This property only applies to SURFACE occlusion.
   * @defaultValue `true`
   * @internal
   */
  protected _occludedBySameElevationSurfaces: boolean;

  /**
   * The unoccluded alpha of this object.
   * @defaultValue `1`
   */
  unoccludedAlpha: number;

  /**
   * The occlusion alpha of this object.
   * @defaultValue `0`
   */
  occludedAlpha: number;

  /**
   * Fade this object on hover?
   */
  get hoverFade(): boolean;

  set hoverFade(value);

  /**
   * The amount of rendered FADE, RADIAL, VISION, and SURFACE occlusion.
   * @defaultValue
   * ```js
   * {
   *   fade: 0.0,
   *   radial: 0.0,
   *   vision: 0.0,
   *   surface: 0.0
   * }
   * ```
   * @internal
   * @remarks Accessed externally in {@linkcode foundry.canvas.rendering.shaders.DepthSamplerShader._preRender | DepthSamplerShader#_preRender}
   * and {@linkcode foundry.canvas.rendering.shaders.OccludableSamplerShader._preRender | OccludableSamplerShader#_preRender}
   */
  protected _occlusionState: PrimaryOccludableObjectMixin.OcclusionState;

  /**
   * The state of hover-fading.
   * @defaultValue
   * ```js
   * {
   *   hovered: false,
   *   hoveredTime: 0,
   *   _hoveredTime: 0,
   *   faded: false,
   *   fading: false,
   *   fadingTime: 0,
   *   occlusion: 0.0
   * }
   * ```
   * @internal
   * @remarks Properties accessed and set remotely in {@linkcode foundry.canvas.groups.PrimaryCanvasGroup._onMouseMove | PrimaryCanvasGroup#_onMouseMove}
   * and `##updateHoveredObjects`
   */
  protected _hoverFadeState: PrimaryOccludableObjectMixin.HoverFadeState;

  /**
   * Get the blocking option bitmask value.
   * @internal
   */
  protected get _restrictionState(): number;

  /**
   * Is this object blocking light?
   */
  get restrictsLight(): boolean;

  set restrictsLight(enabled);

  /**
   * Is this object blocking weather?
   */
  get restrictsWeather(): boolean;

  set restrictsWeather(enabled);

  /**
   * Is this occludable object... occludable?
   */
  get isOccludable(): boolean;

  /**
   * @remarks Actually an override of {@linkcode foundry.canvas.primary.PrimaryCanvasObjectMixin.AnyMixed.elevation | PrimaryCanvasObjectMixin#elevation};
   * the setter additionally resets the internal `#elevationNextDown` cache used by {@linkcode _occlusionElevation}.
   */
  get elevation(): number;

  set elevation(value);

  /**
   * The occlusion elevation of this object.
   * @internal
   */
  protected get _occlusionElevation(): number;

  /**
   * Debounce assignment of the PCO occluded state to avoid cases like animated token movement which can rapidly
   * change PCO appearance.
   * Uses a 50ms debounce threshold.
   * Objects which are in the hovered state remain occluded until their hovered state ends.
   * @remarks Actually the return value of an arrow function passed to {@linkcode foundry.utils.debounce} with a timeout of 50ms
   */
  debounceSetOcclusion: (occluded: boolean) => boolean;

  /**
   * @remarks Actually an override of `PIXI.Container#updateTransform`; additionally updates the hover-fade and occlusion states.
   */
  updateTransform(): void;

  /**
   * @remarks Actually an override of {@linkcode foundry.canvas.primary.PrimaryCanvasObjectMixin.AnyMixed._shouldRenderDepth | PrimaryCanvasObjectMixin#_shouldRenderDepth}
   */
  protected _shouldRenderDepth(): boolean;

  /**
   * Test whether a specific Token occludes this PCO.
   * @param token   - The Token to test
   * @returns Is the Token occluded by the PCO?
   */
  testOcclusion(token: Token.Implementation): boolean;

  #PrimaryOccludableObject: true;
}

declare function PrimaryOccludableObjectMixin<BaseClass extends PrimaryOccludableObjectMixin.BaseClass>(
  DisplayObject: BaseClass,
): Mixin<typeof PrimaryOccludableObject, ReturnType<typeof PrimaryCanvasObjectMixin<BaseClass>>>;

declare namespace PrimaryOccludableObjectMixin {
  interface AnyMixedConstructor extends ReturnType<typeof PrimaryOccludableObjectMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.Container.AnyConstructor;

  /**
   * @internal
   * @deprecated v14 removed the `options` parameter from {@linkcode PrimaryOccludableObject.testOcclusion | PrimaryOccludableObject#testOcclusion}.
   * This type is retained only so the (also-removed-in-v13) `Tile#testOcclusion`/`containsPixel` deprecation shims still resolve.
   */
  type _TestOcclusionOptions = InexactPartial<{
    /**
     * Test corners of the hit-box in addition to the token center?
     * @defaultValue `true`
     */
    corners: boolean;
  }>;

  /**
   * @deprecated v14's {@linkcode PrimaryOccludableObject.testOcclusion | PrimaryOccludableObject#testOcclusion} no longer
   * accepts options; retained only for the legacy `Tile` deprecation shim. (See {@linkcode _TestOcclusionOptions}.)
   */
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- intentionally re-exposing the deprecated internal type for the Tile shim
  interface TestOcclusionOptions extends _TestOcclusionOptions {}

  interface OcclusionState {
    /** The amount of FADE occlusion */
    fade: number;

    /** The amount of RADIAL occlusion */
    radial: number;

    /** The amount of VISION occlusion */
    vision: number;

    /** The amount of SURFACE occlusion */
    surface: number;
  }

  interface HoverFadeState {
    /**
     * The hovered state
     * @defaultValue `false`
     */
    hovered: boolean;

    /**
     * The last time when a mouse event was hovering this object
     * @defaultValue `0`
     */
    hoveredTime: number;

    /**
     * @defaultValue `0`
     * @remarks Gets set to the previous `hoveredTime` in {@linkcode foundry.canvas.groups.PrimaryCanvasGroup._onMouseMove | PrimaryCanvasGroup#_onMouseMove}
     */
    _hoveredTime: number;

    /**
     * The faded state
     * @defaultValue `false`
     */
    faded: boolean;

    /**
     * The fading state
     * @defaultValue `false`
     */
    fading: boolean;

    /**
     * The time the fade animation started
     * @defaultValue `0`
     */
    fadingTime: number;

    /**
     * The amount of occlusion
     * @defaultValue `0`
     */
    occlusion: number;
  }
}

export default PrimaryOccludableObjectMixin;
