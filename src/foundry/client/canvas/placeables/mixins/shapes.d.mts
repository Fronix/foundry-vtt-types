import type { FixedInstanceType, HandleEmptyObject, Mixin } from "#utils";
import type { ShapeControlsHandle } from "#client/canvas/containers/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class ShapeObject {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The measurement lines.
   */
  protected _measurementLines: PIXI.Graphics;

  /**
   * The measurement labels.
   */
  protected _measurementLabels: PIXI.Container;

  /**
   * The solid measurement line style.
   */
  protected _measurementSolidLineStyle: PIXI.ILineStyleOptions;

  /**
   * The dashed measurement line style.
   */
  protected _measurementDashLineStyle: PIXI.ILineStyleOptions;

  /** The controls handle that is currently hovered, if any. */
  get hoveredHandle(): ShapeControlsHandle | null;

  /**
   * @defaultValue `null`
   * @internal
   */
  _hoveredHandle: ShapeControlsHandle | null;

  /**
   * @remarks Actually an override of {@linkcode foundry.canvas.placeables.PlaceableObject.bounds | PlaceableObject#bounds}.
   */
  get bounds(): PIXI.Rectangle;

  /**
   * @remarks Actually an override of {@linkcode foundry.canvas.placeables.PlaceableObject.center | PlaceableObject#center}.
   */
  get center(): PIXI.Point;

  protected _getTargetAlpha(): number;

  protected _overlapsSelection(rectangle: PIXI.Rectangle): boolean;

  protected _onClickLeft(event: Canvas.Event.Pointer): void;

  protected _onClickLeft2(event: Canvas.Event.Pointer): void;

  protected _canDragLeftStart(
    user: User.Implementation,
    event?: Canvas.Event.Pointer,
    options?: PlaceableObject.CanDragLeftStartOptions,
  ): boolean;

  protected _onDragLeftStart(event: Canvas.Event.Pointer): void;

  protected _onDragLeftMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the drag previews. Called when the shape has changed.
   * @param event - The pointer event
   */
  protected _updateDragPreviews(event: Canvas.Event.Pointer): void;

  protected _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  protected _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected _initializeDragLeft(event: Canvas.Event.Pointer): void;

  /**
   * Initialize the shape for dragging.
   * @param event - The pointer event
   * @returns The shape that is dragged
   */
  protected _initializeDragShape(event: Canvas.Event.Pointer): BaseShapeData;

  /**
   * @remarks Actually an override of
   * {@linkcode foundry.canvas.placeables.PlaceableObject._prepareDragLeftDropUpdates | PlaceableObject#_prepareDragLeftDropUpdates}.
   * The runtime returns shape/position update objects keyed by `_id`; the base union type is used because of the
   * documented unsound subclassing around this method.
   */
  protected _prepareDragLeftDropUpdates(event: Canvas.Event.Pointer): PlaceableObject.AnyDragLeftDropUpdate[];

  protected _finalizeDragLeft(event: Canvas.Event.Pointer): void;

  protected _draw(options: HandleEmptyObject<PlaceableObject.DrawOptions>): Promise<void>;

  /**
   * Define a PIXI TextStyle object which is used for the measurement labels.
   */
  protected _getMeasurementTextStyle(): PIXI.TextStyle;

  /**
   * Get the shape that should be measured.
   */
  protected _getMeasuredShapes(): BaseShapeData[];

  /**
   * Format a distance that is displayed in a measurement label.
   * @param distance - The distance
   * @returns The distance label
   */
  protected _formatMeasuredDistance(distance: number): string;

  /**
   * Refresh the measurements.
   */
  protected _refreshMeasurements(): void;

  #ShapeObject: true;
}

/**
 * A mixin for UX shared between PlaceableObjects that have shapes.
 */
declare function ShapeObjectMixin<BaseClass extends ShapeObjectMixin.BaseClass>(
  Base: BaseClass,
): Mixin<typeof ShapeObject, BaseClass>;

declare namespace ShapeObjectMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ShapeObjectMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PlaceableObject.AnyConstructor;
}

export default ShapeObjectMixin;
