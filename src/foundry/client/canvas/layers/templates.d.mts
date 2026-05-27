import type { AnyObject, HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer, InteractionLayer } from "./_module.d.mts";
import type { MeasuredTemplate } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TemplateLayer: TemplateLayer.Any;
    }
  }
}

/**
 * This Canvas Layer provides a container for MeasuredTemplate objects.
 * @see {@linkcode MeasuredTemplate}
 *
 * @privateRemarks v14 marks the whole class `@deprecated since v14` (Measured Templates are superseded by
 * Regions). The class-level `@deprecated` annotation — and its cascade into `CONFIG.Canvas.layers.templates`,
 * the `globals`/`client` re-exports, the interface group `templates` accessor, and the consumers' tests —
 * travels with the Phase 7 MeasuredTemplate reconciliation, which owns the MeasuredTemplate document/placeable
 * deprecation coherently. Only the v14 member surface is verified here (Batch 5.5b).
 */
declare class TemplateLayer extends PlaceablesLayer<"MeasuredTemplate"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["templates"];

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: TemplateLayer.LayerOptions;

  /**
   * @defaultValue
   * ```
   * mergeObject(super.layerOptions, {
   *   name: "templates",
   *   rotatableObjects: true,
   *   zIndex: 400
   * })
   * ```
   */
  static override get layerOptions(): TemplateLayer.LayerOptions;

  static override documentName: "MeasuredTemplate";

  override get hookName(): "TemplateLayer";

  /**
   * @remarks Returns `canvas.scene?.templates.map(document => document.object) || []`. The layer's own
   * `objects` container stays empty in v14 — only preview Measured Templates are possible.
   */
  override get placeables(): MeasuredTemplate.Implementation[];

  protected override _getCopyableObjects(
    options: PlaceablesLayer.GetCopyableObjectsOptions,
  ): MeasuredTemplate.Implementation[];

  /**
   * @remarks Activates the {@link foundry.canvas.layers.RegionLayer | `RegionLayer`} instead of this layer.
   */
  override activate(options?: InteractionLayer.ActivateOptions): this;

  protected override _draw(options: HandleEmptyObject<TemplateLayer.DrawOptions>): Promise<void>;

  /**
   * Register game settings used by the TemplatesLayer
   */
  static registerSettings(): void;

  /**
   * Prepare data used by SceneControls to register tools used by this layer.
   * @remarks The control is registered with `visible: false` because Measured Templates are deprecated.
   */
  static override prepareSceneControls(): SceneControls.Control;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): AnyObject;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  // @ts-expect-error Foundry is changing the return type here from Promise<PlaceableObject[]> to Promise<MeasuredTemplate>
  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<MeasuredTemplate.Implementation> | void;
}

declare namespace TemplateLayer {
  interface Any extends AnyTemplateLayer {}
  interface AnyConstructor extends Identity<typeof AnyTemplateLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<MeasuredTemplate.ImplementationClass> {
    name: "templates";
    rotatableObjects: true;
    zIndex: 400;
  }
}

export default TemplateLayer;

declare abstract class AnyTemplateLayer extends TemplateLayer {
  constructor(...args: never);
}
