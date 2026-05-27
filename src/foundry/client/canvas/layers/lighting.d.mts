import type { HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { AmbientLight } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      LightingLayer: LightingLayer.Any;
    }
  }
}

/**
 * The Lighting Layer which ambient light sources as part of the CanvasEffectsGroup.
 */
declare class LightingLayer extends PlaceablesLayer<"AmbientLight"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["lighting"];

  static override documentName: "AmbientLight";

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: LightingLayer.LayerOptions;

  /**
   * @defaultValue
   * ```
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "lighting",
   *  rotatableObjects: true,
   *  zIndex: 900
   * })
   * ```
   */
  static override get layerOptions(): LightingLayer.LayerOptions;

  override get hookName(): "LightingLayer";

  protected override _draw(options: HandleEmptyObject<LightingLayer.DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<LightingLayer.TearDownOptions>): Promise<void>;

  /**
   * Refresh the fields of all the ambient lights on this scene.
   */
  refreshFields(): void;

  protected override _activate(): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  // Note: v14 removed `LightingLayer#_onMouseWheel` (the v13 override is gone from source); the base
  // `PlaceablesLayer#_onMouseWheel` is inherited. Removed here as a prerequisite for `AmbientLightShapeControls`
  // (Batch 5.6e) — `LightingLayer` must satisfy `PlaceablesLayer.Any`. Full v14 member-diff of this layer is Phase 5.6f.

  /**
   * Actions to take when the darkness level of the Scene is changed
   * @param event - An event
   */
  protected _onDarknessChange(event: Canvas.Event.DarknessChange): void;
}

declare namespace LightingLayer {
  interface Any extends AnyLightingLayer {}
  interface AnyConstructor extends Identity<typeof AnyLightingLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<AmbientLight.ImplementationClass> {
    name: "lighting";
    rotatableObjects: true;
    zIndex: 900;
  }
}

export default LightingLayer;

declare abstract class AnyLightingLayer extends LightingLayer {
  constructor(...args: never);
}
