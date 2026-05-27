import type { AnyObject, HandleEmptyObject, Identity, InexactPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type ShapeLayerMixin from "./mixins/shapes.d.mts";
import type { ShapeLayerPlaceablesLayer } from "./mixins/shapes.d.mts";
import type { Region } from "#client/canvas/placeables/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";
import type RegionPalette from "#client/applications/sheets/palette/region-palette.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      RegionLayer: RegionLayer.Any;
    }
  }
}

/**
 * The Regions Container.
 */
declare class RegionLayer extends ShapeLayerPlaceablesLayer<"Region"> {
  #regionLayer: true;

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["regions"];

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   name: "regions",
   *   controllableObjects: true,
   *   confirmDeleteKey: true,
   *   quadtree: false,
   *   zIndex: 100,
   *   zIndexActive: 600
   * })
   * ```
   */
  static override get layerOptions(): RegionLayer.LayerOptions;

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: RegionLayer.LayerOptions;

  static override documentName: "Region";

  static paletteClass: typeof RegionPalette;

  override get hookName(): "RegionLayer";

  /**
   * The highlight meshes of the Regions.
   * @internal
   */
  _highlights: PIXI.Container;

  /**
   * The shape clipboard.
   * @internal
   */
  _shapeClipboard: RegionLayer.ShapeClipboard;

  /**
   * The placement context.
   * @internal
   */
  _placementContext: AnyObject | null;

  /**
   * Is Measured Template Mode enabled?
   */
  get templateMode(): boolean;

  set templateMode(value);

  /**
   * Is the palette toggle visible?
   * @internal
   */
  _togglePaletteVisible: boolean;

  protected override _deactivate(): void;

  override storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, "Region">,
    options?: AnyObject,
  ): void;

  override copyObjects(options?: PlaceablesLayer.CopyObjectsOptions): ReadonlyArray<Region.Implementation>;

  override getZIndex(): number;

  protected override _draw(options: HandleEmptyObject<RegionLayer.DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<RegionLayer.TearDownOptions>): Promise<void>;

  /**
   * Highlight the shape or clear the highlight.
   * @param shape - The shape to highlight, or null to clear the highlight
   * @remarks Foundry marked `@internal`. If `shape` is falsey, clears the current highlight and returns early
   */
  protected _highlightShape(shape?: BaseShapeData | null): void;

  static override prepareSceneControls(): SceneControls.Control;

  /**
   * Place a Region at the cursor.
   * The Region can have multiple shapes but must have at least one.
   * Each shape is placed one after the other in the given order.
   * Only one Region can be placed at a time.
   * The placed Region shapes can be rotated with the mouse wheel unless `allowRotation` is false.
   * Left-click confirms the placement of a shape. Right-click skips the placement of a shape.
   * The Region layer is activated unless the Token layer is active.
   * @param data    - The data of the Region to place
   * @param options - Additional options
   * @returns The Region document that was placed or null if
   *   - the placements of all shapes were skipped unless `allowEmpty` is true,
   *   - the dismiss key was pressed,
   *   - the placement was rejected by `preCommit`,
   *   - the game was paused, the user is not a GM, and the `create` option is true, or
   *   - the Region creation was rejected by preCreate.
   */
  placeRegion(
    data: RegionDocument.CreateData,
    options?: RegionLayer.PlacementOptions,
  ): Promise<RegionDocument.Implementation | null>;

  /**
   * Place one or multiple Regions at the cursor.
   * The Region can have multiple shapes but must have at least one.
   * Each Region is placed one after the other in the given order.
   * Each shape of a Region is placed one after the other in the given order.
   * The placed Region shapes can be rotated with the mouse wheel unless `allowRotation` is false.
   * Left-click confirms the placement of a shape. Right-click skips the placement of a shape.
   * @param data    - The data of the Regions to place
   * @param options - Additional options
   * @returns The Region documents that were placed and not rejected by preCreate, or null if
   *   - the placement was rejected by `preCommit`,
   *   - the dismiss key was pressed, or
   *   - the game was paused, the user is not a GM, and the `create` option is true.
   */
  placeRegions(
    data: Iterable<RegionDocument.CreateData>,
    options?: RegionLayer.PlacementOptions,
  ): Promise<RegionDocument.Implementation[] | null>;

  protected override _createDragPreviewData(event: Canvas.Event.Pointer): AnyObject;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _onDeleteKey(event: Canvas.Event.DeleteKey): boolean;

  protected override _onCutKey(event: KeyboardEvent): boolean;

  protected override _onCopyKey(event: KeyboardEvent): boolean;

  protected override _onPasteKey(event: KeyboardEvent): boolean;

  /**
   * @privateRemarks The runtime override is synchronous, but its return type is kept assignable to
   * {@link PlaceablesLayer._onMouseWheel | `PlaceablesLayer#_onMouseWheel`}'s.
   */
  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<Region.Implementation[] | void>;

  protected override _onDismissKey(event: KeyboardEvent): boolean;

  /**
   * Cancel the placement.
   * @internal
   */
  _cancelPlacement(): void;

  protected override _confirmDeleteKey(documents: RegionDocument.Implementation[]): Promise<boolean>;
}

declare namespace RegionLayer {
  interface Any extends AnyRegionLayer {}
  interface AnyConstructor extends Identity<typeof AnyRegionLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface LayerOptions extends ShapeLayerMixin.LayerOptions<Region.ImplementationClass> {
    name: "regions";
    controllableObjects: true;
    confirmDeleteKey: true;
    quadtree: false;
    zIndex: 100;
    zIndexActive: 600;
  }

  /** The shape clipboard tracked by {@link RegionLayer._shapeClipboard | `RegionLayer#_shapeClipboard`}. */
  interface ShapeClipboard {
    shape: BaseShapeData | null;
    cut: boolean;
  }

  /**
   * Information about the shape being placed, passed to the {@link RegionLayer.PlacementOptions | placement}
   * callbacks that do not receive a `preview`.
   */
  interface ShapePlacementInfo {
    document: RegionDocument.Implementation;
    regionIndex: number;
    regionCount: number;
    shape: BaseShapeData;
    shapeIndex: number;
    shapeCount: number;
  }

  /** {@linkcode ShapePlacementInfo} plus the in-progress preview Region. */
  interface ShapePlacementPreviewInfo extends ShapePlacementInfo {
    preview: Region.Implementation;
  }

  /**
   * Options for {@link RegionLayer.placeRegion | `RegionLayer#placeRegion`} and
   * {@link RegionLayer.placeRegions | `RegionLayer#placeRegions`}.
   *
   * @remarks Corresponds to Foundry's `RegionPlacementOptions` typedef in `layers/_types.mjs`.
   */
  interface PlacementOptions extends InexactPartial<{
    /**
     * Create the Region? If false, the preview document is returned. Non-GMs cannot create Regions while
     * the game is paused.
     * @defaultValue `true`
     */
    create: boolean;

    /**
     * Optional creation options. By default the creation option `controlObject` is true.
     */
    createOptions: AnyObject;

    /**
     * Allow rotation of the Region?
     * @defaultValue `true`
     */
    allowRotation: boolean;

    /**
     * Create/return an empty Region if all shapes are skipped?
     * @defaultValue `false`
     */
    allowEmpty: boolean;

    /**
     * Attach the Region to Tokens? If true, the initial elevation range passed in `data` is relative to the
     * attached Token.
     * @defaultValue `false`
     */
    attachToToken: boolean;

    /**
     * Called when the pointer is moved and after starting the placement of the next shape on confirm and
     * skip. This callback replaces the default behavior if false is returned.
     */
    onMove: (
      args: ShapePlacementPreviewInfo & { event: PIXI.FederatedEvent; position: Canvas.Point; snap: boolean },
    ) => boolean | void;

    /**
     * Called when the mouse wheel is scrolled. This callback replaces the default behavior if false is
     * returned.
     */
    onRotate: (args: ShapePlacementPreviewInfo & { event: WheelEvent; precise: boolean }) => boolean | void;

    /**
     * Called when the Region shape that is placed has changed.
     */
    onChange: (args: ShapePlacementPreviewInfo) => void;

    /**
     * Called before the confirmation (left-click) of a shape placement. May return false to prevent the
     * placement of the Region shape and display a warning.
     */
    preConfirm: (args: ShapePlacementInfo & { event: PIXI.FederatedEvent }) => boolean | void;

    /**
     * Called before skipping (right-click) of a shape placement. May return false to prevent skipping of the
     * Region shape and display a warning.
     */
    preSkip: (args: ShapePlacementInfo & { event: PIXI.FederatedEvent }) => boolean | void;

    /**
     * Called at the end of the workflow before the Region documents are created/returned. May return a
     * falsely value other than undefined to prevent the Regions from being created/returned.
     */
    preCommit: (documents: ReadonlyArray<RegionDocument.Implementation>) => Promise<unknown> | void;
  }> {}
}

export default RegionLayer;

declare abstract class AnyRegionLayer extends RegionLayer {
  constructor(...args: never);
}
