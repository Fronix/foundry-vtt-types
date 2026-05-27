import type { HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { ShapeLayerPlaceablesLayer } from "./mixins/shapes.d.mts";
import type { Drawing } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      DrawingsLayer: DrawingsLayer.Any;
    }
  }
}

/**
 * The DrawingsLayer subclass of PlaceablesLayer.
 * This layer implements a container for drawings.
 */
declare class DrawingsLayer extends ShapeLayerPlaceablesLayer<"Drawing"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["drawings"];

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: DrawingsLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   name: "drawings",
   *   controllableObjects: true,
   *   rotatableObjects: true,
   *   zIndex: 500,
   *   allowedEmptyShapes: ["polygon"],
   *   discardClosingPoint: false
   * })
   * ```
   */
  static override get layerOptions(): DrawingsLayer.LayerOptions;

  static override documentName: "Drawing";

  // FIXME: DrawingPalette // `static paletteClass = DrawingPalette` is added with the `applications/sheets/palette/` files in Batch 5.6g.

  /**
   * The collection of drawing objects which are rendered in the interface.
   */
  graphics: Collection<Drawing.Implementation>;

  override get hud(): NonNullable<Canvas["hud"]>["drawing"];

  override get hookName(): "DrawingsLayer";

  protected override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Drawing.Implementation[];

  protected override _deactivate(): void;

  protected override _draw(options: HandleEmptyObject<DrawingsLayer.DrawOptions>): Promise<void>;

  /**
   * Get initial data for a new drawing.
   * Start with some global defaults, apply user default config, then apply mandatory overrides per tool.
   * @param origin - The initial coordinate
   * @returns The new drawing data
   * @privateRemarks This isn't called externally (anymore?) but seems too useful to make protected without any indication on Foundry's side of such intent
   */
  _getNewDrawingData(origin: Canvas.Point): DrawingDocument.CreateData;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): DrawingDocument.CreateData;

  protected override _createDragShapeData(event: Canvas.Event.Pointer): DrawingsLayer.DragShapeData;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _updateMouseWheelPreview(): void;
}

declare namespace DrawingsLayer {
  interface Any extends AnyDrawingsLayer {}
  interface AnyConstructor extends Identity<typeof AnyDrawingsLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<Drawing.ImplementationClass> {
    name: "drawings";
    controllableObjects: true;
    rotatableObjects: true;
    zIndex: 500;
    discardClosingPoint: false;
  }

  /** The shape data produced by {@link DrawingsLayer._createDragShapeData | `DrawingsLayer#_createDragShapeData`}. */
  type DragShapeData =
    | { type: "rectangle"; x: 0; y: 0; width: 0; height: 0; anchorX: 0.5; anchorY: 0.5 }
    | { type: "ellipse"; x: 0; y: 0; radiusX: 0; radiusY: 0 }
    | { type: "polygon"; points: [0, 0, 0, 0] };
}

export default DrawingsLayer;

declare abstract class AnyDrawingsLayer extends DrawingsLayer {
  constructor(...args: never);
}
