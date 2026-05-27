import type { AnyObject, HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { ShapeLayerPlaceablesLayer } from "./mixins/shapes.d.mts";
import type { AmbientLight } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";
import type AmbientLightPalette from "#client/applications/sheets/palette/ambient-light-palette.d.mts";

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
declare class LightingLayer extends ShapeLayerPlaceablesLayer<"AmbientLight"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["lighting"];

  static override documentName: "AmbientLight";

  static paletteClass: typeof AmbientLightPalette;

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: LightingLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   name: "lighting",
   *   controllableObjects: true,
   *   rotatableObjects: true,
   *   zIndex: 900
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

  static override prepareSceneControls(): SceneControls.Control;

  protected override _createDragShapeData(event: Canvas.Event.Pointer): AnyObject;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _updateMouseWheelPreview(): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

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

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<AmbientLight.ImplementationClass> {
    name: "lighting";
    controllableObjects: true;
    rotatableObjects: true;
    zIndex: 900;
  }
}

export default LightingLayer;

declare abstract class AnyLightingLayer extends LightingLayer {
  constructor(...args: never);
}
