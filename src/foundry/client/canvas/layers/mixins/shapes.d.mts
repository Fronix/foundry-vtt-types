import type { AnyObject, FixedInstanceType, HandleEmptyObject, Mixin } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class ShapeLayer {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The mouse wheel context.
   * @defaultValue `null`
   * @internal
   */
  _mouseWheelContext: ShapeLayerMixin.MouseWheelContext | null;

  getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected _deactivate(): void;

  protected _tearDown(options: HandleEmptyObject<PlaceablesLayer.TearDownOptions>): Promise<void>;

  protected _onClickLeft(event: Canvas.Event.Pointer): void;

  protected _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected _commitDragLeftDrop(event: Canvas.Event.Pointer): Promise<void>;

  protected _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Create the shape data from the drag start event.
   * @param event - The pointer event
   * @returns The initial shape data
   */
  protected _createDragShapeData(event: Canvas.Event.Pointer): AnyObject;

  /**
   * Update the drag preview. Called when the shape has changed.
   * @param event - The pointer event
   */
  protected _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected _onMouseWheel(event: Canvas.Event.Wheel): void;

  /**
   * Rotate the shape of the preview.
   * @param event - The mouse wheel event
   */
  protected _updateMouseWheelShape(event: WheelEvent): void;

  /**
   * Update the mouse wheel rotation preview.
   */
  protected _updateMouseWheelPreview(): void;

  /**
   * Cancel mouse wheel rotation.
   */
  protected _cancelMouseWheel(): void;

  /**
   * Prepare the database update that should occur as the result of a mouse wheel rotation.
   * @returns The update data and options (optional)
   */
  protected _prepareMouseWheelUpdate(): AnyObject | [data: AnyObject, options?: AnyObject];

  #ShapeLayer: true;
}

/**
 * The layer produced by `ShapeLayerMixin(PlaceablesLayer)`, modeled as a concrete abstract subclass of
 * {@linkcode PlaceablesLayer} that the shape leaf layers (`DrawingsLayer`, `LightingLayer`, `SoundsLayer`,
 * `RegionLayer`, `TilesLayer`) extend directly.
 *
 * @privateRemarks fvtt-types cannot model these layers as `extends ShapeLayerMixin(PlaceablesLayer)`
 * (the source form) because a mixin **call** in an `extends` clause forces tsgo to evaluate the base
 * eagerly while the subclass module is still loading; that eager evaluation transitively resolves
 * `Canvas` → the `foundry.canvas` namespace → the canvas barrel's `export * as layers` → the layers
 * barrel, which re-exports the very subclass being declared, yielding a circular import alias
 * (`TS2506`/`TS2303`). This is the exact problem solved for the shape placeables by
 * {@linkcode foundry.canvas.placeables.ShapeObjectMixin | ShapePlaceableObject}. Extending this
 * intermediate `declare class` is a lazy direct-generic heritage reference (like every other layer's
 * `extends PlaceablesLayer<DocumentName>`) and so avoids the cycle.
 */
declare abstract class ShapeLayerPlaceablesLayer<
  out DocumentName extends PlaceablesLayer.DocumentNames,
> extends PlaceablesLayer<DocumentName> {
  /**
   * The mouse wheel context.
   * @defaultValue `null`
   * @internal
   */
  _mouseWheelContext: ShapeLayerMixin.MouseWheelContext<DocumentName> | null;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   allowedEmptyShapes: [],
   *   discardClosingPoint: true
   * })
   * ```
   */
  static override get layerOptions(): ShapeLayerMixin.LayerOptions.Any;

  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _deactivate(): void;

  protected override _tearDown(options: HandleEmptyObject<PlaceablesLayer.TearDownOptions>): Promise<void>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftMove(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected override _commitDragLeftDrop(event: Canvas.Event.Pointer): Promise<void>;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  /**
   * Create the shape data from the drag start event.
   * @param event - The pointer event
   * @returns The initial shape data
   */
  protected _createDragShapeData(event: Canvas.Event.Pointer): AnyObject;

  /**
   * Update the drag preview. Called when the shape has changed.
   * @param event - The pointer event
   */
  protected _updateDragPreview(event: Canvas.Event.Pointer): void;

  /**
   * @privateRemarks The runtime override is synchronous (returns `void`/`false`), but its return type is
   * kept assignable to {@link PlaceablesLayer._onMouseWheel | `PlaceablesLayer#_onMouseWheel`}'s.
   */
  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<Document.ObjectFor<DocumentName>[] | void>;

  /**
   * Rotate the shape of the preview.
   * @param event - The mouse wheel event
   */
  protected _updateMouseWheelShape(event: WheelEvent): void;

  /**
   * Update the mouse wheel rotation preview.
   */
  protected _updateMouseWheelPreview(): void;

  /**
   * Cancel mouse wheel rotation.
   */
  protected _cancelMouseWheel(): void;

  /**
   * Prepare the database update that should occur as the result of a mouse wheel rotation.
   * @returns The update data and options (optional)
   */
  protected _prepareMouseWheelUpdate(): AnyObject | [data: AnyObject, options?: AnyObject];
}

/**
 * A mixin for UX shared between PlaceablesLayer with objects that have shapes.
 *
 * @privateRemarks Kept for source fidelity (`export default function ShapeLayerMixin`). It cannot be
 * used as a base in an `extends` clause without tripping a tsgo circular-alias bug — see
 * {@linkcode ShapeLayerPlaceablesLayer}, which the shape leaf layers extend instead.
 */
declare function ShapeLayerMixin<BaseClass extends ShapeLayerMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof ShapeLayer, BaseClass>;

declare namespace ShapeLayerMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ShapeLayerMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PlaceablesLayer.AnyConstructor;

  /** The mouse wheel rotation context tracked while a shape is being rotated. */
  interface MouseWheelContext<DocumentName extends PlaceablesLayer.DocumentNames = PlaceablesLayer.DocumentNames> {
    preview: Document.ObjectFor<DocumentName>;
    shape: BaseShapeData;
  }

  interface LayerOptions<
    ConcretePlaceable extends foundry.canvas.placeables.PlaceableObject.AnyConstructor,
  > extends PlaceablesLayer.LayerOptions<ConcretePlaceable> {
    /**
     * The shape types that are allowed to be empty for the creation of a drawn object.
     * @defaultValue `[]`
     */
    allowedEmptyShapes: string[];

    /**
     * Discard the closing point of a polygon shape?
     * @defaultValue `true`
     */
    discardClosingPoint: boolean;
  }

  namespace LayerOptions {
    interface Any extends LayerOptions<any> {}
  }
}

export default ShapeLayerMixin;
export { ShapeLayerPlaceablesLayer };
