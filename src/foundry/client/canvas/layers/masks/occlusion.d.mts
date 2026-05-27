import type { AnyObject, Identity } from "#utils";
import type { CachedContainer } from "#client/canvas/containers/_module.d.mts";
import type { PrimaryCanvasObjectMixin } from "#client/canvas/primary/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

/**
 * The occlusion mask which contains radial occlusion and vision occlusion from tokens.
 * Red channel: Fade occlusion.
 * Green channel: Radial occlusion.
 * Blue channel: Vision occlusion.
 * Alpha channel: Surface occlusion.
 */
declare class CanvasOcclusionMask extends CachedContainer {
  /**
   * @defaultValue
   * ```js
   * {
   *   scaleMode: PIXI.SCALE_MODES.NEAREST,
   *   format: PIXI.FORMATS.RGBA,
   *   multisample: PIXI.MSAA_QUALITY.NONE
   * }
   * ```
   */
  static override textureConfiguration: CachedContainer.TextureConfiguration;

  /**
   * Graphics in which token radial and vision occlusion shapes are drawn.
   * @remarks The `blendMode` of this `LegacyGraphics` is set to `PIXI.BLEND_MODES.MIN_ALL`
   */
  tokens: PIXI.LegacyGraphics;

  /**
   * Graphics in which surface occlusion shapes are drawn.
   * @remarks The `blendMode` of this `LegacyGraphics` is set to `PIXI.BLEND_MODES.MIN_ALL`, and its `mask`'s
   * `colorMask` is set to `PIXI.COLOR_MASK_BITS.ALPHA`
   */
  surfaces: PIXI.LegacyGraphics;

  /**
   * @defaultValue `[0, 1, 1, 1]`
   */
  override clearColor: Color.RGBAColorVector;

  override autoRender: boolean;

  /**
   * The set of currently occluded canvas objects.
   */
  get occluded(): Set<PrimaryCanvasObjectMixin.AnyMixed>;

  /** @remarks No setter is provided */
  set occluded(value: never);

  /**
   * The occluded surfaces.
   * @remarks Backed by a private `Set`.
   */
  // FIXME: RegionSurface (client/documents/_types) → P7; element type is `DeepReadonly<RegionSurface>`.
  get occludedSurfaces(): ReadonlySet<object>;

  /** @remarks No setter is provided */
  set occludedSurfaces(value: never);

  /**
   * Is vision occlusion active?
   */
  get vision(): boolean;

  /** @remarks No setter is provided */
  set vision(value: never);

  /**
   * Clear the occlusion mask.
   */
  override clear(): this;

  /**
   * Map an elevation to a value in the range (0, 1] with 8-bit precision.
   * The radial and vision shapes are drawn with these values into the render texture.
   * @param elevation - The elevation in distance units
   * @returns The value for this elevation in the range (0, 1] with 8-bit precision
   */
  mapElevation(elevation: number): number;

  /**
   * Update the occludable tokens.
   */
  protected _updateOccludableTokens(): void;

  /**
   * Draw occlusion shapes to the occlusion mask.
   * Fade occlusion draws to the red channel with varying intensity from [0, 1] based on elevation.
   * Radial occlusion draws to the green channel with varying intensity from [0, 1] based on elevation.
   * Vision occlusion draws to the blue channel with varying intensity from [0, 1] based on elevation.
   * Surface occlusion draws to the alpha channel with varying intensity from [0, 1] based on elevation.
   */
  protected _updateOcclusionMask(): void;

  /**
   * Update the current occlusion status of all PCOs.
   */
  protected _updateOccludedObjects(): void;

  /**
   * Determine the set of objects which should be currently occluded by a Token.
   * @param tokens - The occludable Tokens
   * @returns The PCO objects which should be currently occluded
   */
  protected _identifyOccludedObjects(tokens: Token.Implementation[]): Set<PrimaryCanvasObjectMixin.AnyMixed>;

  /**
   * Determine the occluded surfaces.
   * @param flags - The perception render flags that are processed
   */
  protected _updateOccludedSurfaces(flags: AnyObject): void;

  /**
   * @deprecated since v14, until v16
   * @remarks "CanvasOcclusionMask#updateOcclusion is deprecated. Use `canvas.perception.update({refreshOcclusion: true})` instead."
   */
  updateOcclusion(): void;
}

declare namespace CanvasOcclusionMask {
  interface Any extends AnyCanvasOcclusionMask {}
  interface AnyConstructor extends Identity<typeof AnyCanvasOcclusionMask> {}
}

export default CanvasOcclusionMask;

declare abstract class AnyCanvasOcclusionMask extends CanvasOcclusionMask {
  constructor(...args: never);
}
