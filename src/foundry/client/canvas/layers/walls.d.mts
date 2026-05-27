import type { AnyObject, HandleEmptyObject, Identity, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { PlaceableObject, Wall } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";
import type WallPalette from "#client/applications/sheets/palette/wall-palette.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      WallsLayer: WallsLayer.Any;
    }
  }
}

/**
 * The Walls canvas layer which provides a container for Wall objects within the rendered Scene.
 */
declare class WallsLayer extends PlaceablesLayer<"Wall"> {
  /**
   * A graphics layer used to display chained Wall selection
   * @defaultValue `null`
   * @remarks Only `null` prior to first draw
   */
  chain: PIXI.Graphics | null;

  /**
   * Track whether we are currently within a chained placement workflow
   * @defaultValue `false`
   * @remarks Foundry marked `@internal`
   */
  protected _chain: boolean;

  /**
   * Reference the last interacted wall endpoint for the purposes of chaining
   * @defaultValue `{ point: null }`
   * @remarks Foundry marked `@internal`
   */
  protected _last: {
    point: Canvas.PointTuple | null;
  };

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["walls"];

  /**
   * @defaultValue
   * ```js
   * mergeObject(super.layerOptions, {
   *  name: "walls",
   *  controllableObjects: true,
   *  controlObjectAfterCreation: false,
   *  zIndex: 700
   * })
   * ```
   */
  static override get layerOptions(): WallsLayer.LayerOptions;

  /** @privateRemarks This is not overridden in foundry but reflects the real behavior. */
  override options: WallsLayer.LayerOptions;

  static override documentName: "Wall";

  static paletteClass: typeof WallPalette;

  override get hookName(): "WallsLayer";

  /**
   * An Array of Wall instances in the current Scene which act as Doors.
   */
  get doors(): Wall.Implementation[];

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _draw(options: HandleEmptyObject<WallsLayer.DrawOptions>): Promise<void>;

  protected override _deactivate(): void;

  /**
   * Given a point and the coordinates of a wall, determine which endpoint is closer to the point
   * @param point - The origin point of the new Wall placement
   * @param wall  - The existing Wall object being chained to
   * @returns The [x,y] coordinates of the starting endpoint
   */
  static getClosestEndpoint(point: Canvas.Point, wall: Wall.Implementation): Canvas.PointTuple;

  override releaseAll(options?: PlaceableObject.ReleaseOptions): number;

  /**
   * Get the wall endpoint coordinates for a given point.
   * @param  point - The candidate wall endpoint.
   * @returns The wall endpoint coordinates.
   * @remarks Foundry marked `@internal`
   */
  protected _getWallEndpointCoordinates(
    point: Canvas.Point,
    options?: WallsLayer.GetWallEndpointCoordinatesOptions, // not:null (destructured)
  ): Canvas.PointTuple;

  /**
   * Identify the interior enclosed by the given walls.
   * @param  walls - The walls that enclose the interior.
   * @returns The polygons of the interior.
   * @remarks Foundry marked `@license MIT`
   */
  identifyInteriorArea(walls: Wall.Implementation[]): PIXI.Polygon[];

  /**
   * Prepare data used by SceneControls to register tools used by this layer.
   */
  static override prepareSceneControls(): SceneControls.Control;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): AnyObject;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Custom undo for wall creation while chaining is active.
   * @returns An array of documents which were modified by the undo operation
   */
  protected override _onUndoCreate(event: PlaceablesLayer.HistoryEntry<"Wall">): Promise<WallDocument.Implementation[]>;
}

declare namespace WallsLayer {
  interface Any extends AnyWallsLayer {}
  interface AnyConstructor extends Identity<typeof AnyWallsLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Wall.ImplementationClass> {
    name: "walls";
    controllableObjects: true;
    controlObjectAfterCreation: false;
    objectClass: Wall.ImplementationClass;
    zIndex: 700;
  }

  /** @internal */
  type _Snap = NullishProps<{
    /**
     * Snap to the grid?
     * @defaultValue `true`
     */
    snap: boolean;
  }>;

  interface GetWallEndpointCoordinatesOptions extends _Snap {}
}

export default WallsLayer;

declare abstract class AnyWallsLayer extends WallsLayer {
  constructor(...args: never);
}
