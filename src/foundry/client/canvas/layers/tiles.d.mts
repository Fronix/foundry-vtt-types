import type { AnyObject, HandleEmptyObject, Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { ShapeLayerPlaceablesLayer } from "./mixins/shapes.d.mts";
import type { Tile } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";
import type TilePalette from "#client/applications/sheets/palette/tile-palette.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TilesLayer: TilesLayer.Any;
    }
  }
}

/**
 * A PlaceablesLayer designed for rendering the visual Scene for a specific vertical cross-section.
 */
declare class TilesLayer extends ShapeLayerPlaceablesLayer<"Tile"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["tiles"];

  static override documentName: "Tile";

  static paletteClass: typeof TilePalette;

  override options: TilesLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   name: "tiles",
   *   zIndex: 300,
   *   controllableObjects: true,
   *   rotatableObjects: true,
   *   confirmBeforeCreation: true
   * })
   * ```
   */
  static override get layerOptions(): TilesLayer.LayerOptions;

  override get hookName(): "TilesLayer";

  override get hud(): NonNullable<Canvas["hud"]>["tile"];

  /**
   * An array of Tile objects which are rendered within the objects container
   */
  get tiles(): Tile.Implementation[];

  protected override _tearDown(options: HandleEmptyObject<TilesLayer.TearDownOptions>): Promise<void>;

  static override prepareSceneControls(): SceneControls.Control;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): AnyObject;

  protected override _createDragShapeData(event: Canvas.Event.Pointer): AnyObject;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _updateMouseWheelPreview(): void;

  /**
   * Handle drop events for Tile data on the Tiles Layer
   * @param event - The concluding drag event
   * @param data  - The extracted Tile data
   * @remarks Foundry marked `@private`
   */
  protected _onDropData(
    event: DragEvent,
    data: TilesLayer.DropData,
  ): Promise<TileDocument.Implementation | false | void>;

  /**
   * Prepare the data object when a new Tile is dropped onto the canvas
   * @param event - The concluding drag event
   * @param data  - The extracted Tile data
   * @returns The prepared data to create
   */
  protected _getDropData(event: DragEvent, data: TilesLayer.DropData): Promise<TileDocument.CreateData>;
}

declare namespace TilesLayer {
  interface Any extends AnyTilesLayer {}
  interface AnyConstructor extends Identity<typeof AnyTilesLayer> {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<Tile.ImplementationClass> {
    name: "tiles";
    zIndex: 300;
    controllableObjects: true;
    rotatableObjects: true;
    confirmBeforeCreation: true;
  }

  /** @internal  */
  type _DropData = Required<Pick<TileDocument.CreateData, "elevation" | "height" | "width" | "sort">>;

  interface DropData extends Canvas.DropPosition, _DropData {
    type: "Tile";
    fromFilePicker: boolean;
    tileSize: number;
    texture: { src: string };
    occlusion: { mode: foundry.CONST.OCCLUSION_MODES };
  }
}

export default TilesLayer;

declare abstract class AnyTilesLayer extends TilesLayer {
  constructor(...args: never);
}
