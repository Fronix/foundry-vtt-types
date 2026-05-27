import type { AnyConstructor, AnyObject, DeepReadonly, FixedInstanceType, InexactPartial, Mixin } from "#utils";
import type {
  RectangleShapeData as BaseRectangleShapeData,
  CircleShapeData as BaseCircleShapeData,
  EllipseShapeData as BaseEllipseShapeData,
  ConeShapeData as BaseConeShapeData,
  RingShapeData as BaseRingShapeData,
  LineShapeData as BaseLineShapeData,
  EmanationShapeData as BaseEmanationShapeData,
  PolygonShapeData as BasePolygonShapeData,
  TokenShapeData as BaseTokenShapeData,
  GridShapeData as BaseGridShapeData,
} from "#common/data/data.mjs";
import type { Ray } from "#client/canvas/geometry/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Scene } from "#client/documents/_module.mjs";

/**
 * Mixin a {@linkcode foundry.data.BaseShapeData} subclass to add the client-side geometry, sampling, and
 * editing API used by the canvas placeable shapes.
 * @remarks `ClientShapeData` is module-private in Foundry — only the ten concrete subclasses below are exported.
 */
declare class ClientShapeData {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * Convert a path to a clipper path.
   * @param path - A path
   * @internal
   */
  protected static _toClipperPath(
    path: PIXI.Polygon.ClipperPoint[] | Canvas.Point[] | number[],
  ): PIXI.Polygon.ClipperPoint[];

  /** The scene that this shape is placed in, if any. */
  get scene(): Scene.Implementation | null;

  /** The grid that this shape is placed in. */
  get grid(): foundry.grid.BaseGrid;

  /** The gridless version of the grid that this shape is placed in. */
  get gridlessGrid(): foundry.grid.GridlessGrid;

  /** Is this shape empty? */
  get isEmpty(): boolean;

  /**
   * The polygons of this shape.
   *
   * The value of this property must not be mutated.
   */
  get polygons(): ReadonlyArray<PIXI.Polygon>;

  /**
   * The polygon tree of this shape.
   *
   * The value of this property must not be mutated.
   */
  // FIXME: PolygonTree // Awaiting `client/data/polygon-tree.d.mts` (the v14 `PolygonTree`), authored with the Scene Levels subsystem in Phase 7.
  get polygonTree(): AnyObject;

  /**
   * The Clipper paths of this shape.
   * The winding numbers are 1 or 0.
   *
   * The value of this property must not be mutated.
   */
  get clipperPaths(): DeepReadonly<PIXI.Polygon.ClipperPoint[][]>;

  /**
   * The Clipper polygon tree of this shape.
   *
   * The value of this property must not be mutated.
   */
  get clipperPolyTree(): ClipperLib.PolyTree;

  /**
   * The triangulation of this shape.
   *
   * The value of this property must not be mutated.
   */
  get triangulation(): Readonly<ClientShapeDataMixin.Triangulation>;

  /**
   * The bounds of this Region.
   *
   * The value of this property must not be mutated.
   */
  get bounds(): PIXI.Rectangle;

  /** The origin of this shape. */
  get origin(): Readonly<Canvas.Point>;

  /** The center point of this shape. */
  get center(): Readonly<Canvas.Point>;

  /** The area of this shape. */
  get area(): number;

  /**
   * The measured segments of this shape.
   * Each segment consist of a ray, winding order, distance in grid units, and the angle in degrees if it has one.
   * The ray represents the measured segment. If the winding order is ...
   *  - 1, the segment is an edge in positive orientation.
   *  - -1, the segment is an edge in negative orientation.
   *  - 0, the segment is not an edge.
   *
   * The distance is the actual grid distance if the shape is grid-based.
   * Otherwise the distance is the distance in pixels divided by of the ratio of grid distance and grid size.
   */
  get measuredSegments(): DeepReadonly<ClientShapeDataMixin.MeasuredSegment[]>;

  /**
   * The control handles of this shape.
   * Each handle has a position and a rotation in radians.
   */
  get controlHandles(): DeepReadonly<ClientShapeDataMixin.ControlHandles>;

  /**
   * Called when the shape was changed.
   * This function is not called when just the hole state is changed.
   * This function is not called if grid-based is changed and the grid is gridless.
   */
  protected _onShapeChange(): void;

  /**
   * Called when the grid this shape is placed in changes.
   * @param changed - The changes to the grid.
   */
  protected _onGridChange(changed: AnyObject): void;

  /** Is this shape currently affected by the grid? */
  get isAffectedByGrid(): boolean;

  /** Whether the shape is identical to itself after a rotation around its origin. */
  get hasRotationalSymmetry(): boolean;

  /**
   * Create a ray.
   * @param x         - The x-coordinate of the origin of the ray.
   * @param y         - The y-coordinate of the origin of the ray.
   * @param direction - The direction of the ray in degrees.
   * @param length    - The length of the ray in pixels.
   * @param alignment - The alignment to ray. (default: `0`)
   * @internal
   */
  protected _createRay(x: number, y: number, direction: number, length: number, alignment?: number): Ray;

  /**
   * Snap the given point.
   * @param point - The point that is to be snapped.
   * @returns The snapped point.
   * @internal
   */
  protected _getSnappedPoint(point: Canvas.Point): Canvas.Point;

  /**
   * Get the size for the given ray defined by a length and direction.
   * @param length    - The length of the ray in pixels.
   * @param direction - The direction of the ray in radians.
   * @param options   - Additional options.
   * @returns The snapped size in pixels.
   * @internal
   */
  protected _calculateSize(
    length: number,
    direction: number,
    options?: ClientShapeDataMixin.CalculateSizeOptions,
  ): number;

  /**
   * Snap the given rotation.
   * @param rotation - The rotation to be snapped in degrees.
   * @returns The snapped rotation in degrees.
   * @internal
   */
  protected _getSnappedRotation(rotation: number): number;

  /**
   * Test whether given point is contained within this shape.
   * @param point - The point.
   */
  testPoint(point: Canvas.Point): boolean;

  /**
   * Create the Clipper polygon tree of this shape.
   * This function may return a single positively-orientated and non-selfintersecting Clipper path instead of a tree,
   * which is automatically converted to a Clipper polygon tree.
   * This function is called only once. It is not called if the shape is empty.
   * @remarks Abstract: throws unless overridden by a subclass.
   */
  protected _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  /** Create the origin point of this shape. */
  protected _createOrigin(): Canvas.Point;

  /** Create the center point of this shape. */
  protected _createCenter(): Canvas.Point;

  /** Calculate the area of this shape. */
  protected _calculateArea(): number;

  /**
   * Move the shape to the given origin.
   * @param origin  - The (unsnapped) origin.
   * @param options - Additional options.
   */
  move(origin: Canvas.Point, options?: ClientShapeDataMixin.MoveOptions): void;

  /**
   * Rotate the shape by the given angle in degrees around the origin (or pivot).
   * @param angle   - The angle in degrees.
   * @param options - Additional options.
   */
  rotate(angle: number, options?: ClientShapeDataMixin.RotateOptions): void;

  /**
   * Rotate the shape by the given angle in degrees around the origin.
   * @param angle - The angle in degrees.
   */
  protected _rotate(angle: number): void;

  /**
   * Draw the shape into the Graphics element.
   * @param graphics - The Graphics element
   */
  drawShape(graphics: PIXI.Graphics): void;

  /**
   * Draw reference lines of the shape into the Graphics element, if it has any.
   * @param graphics - The Graphics element
   */
  drawReferenceLines(graphics: PIXI.Graphics): void;

  /**
   * Create a measured segment.
   * @param x         - The x-coordinate of the origin of the ray.
   * @param y         - The y-coordinate of the origin of the ray.
   * @param direction - The direction of the ray in degrees.
   * @param length    - The length of the ray in pixels.
   * @param alignment - The alignment of the ray.
   * @param winding   - The winding order.
   * @param angle     - The angle in degrees.
   * @internal
   */
  protected _createMeasuredSegment(
    x: number,
    y: number,
    direction: number,
    length: number,
    alignment: number,
    winding: -1 | 0 | 1,
    angle?: number,
  ): ClientShapeDataMixin.MeasuredSegment;

  /**
   * Create the measured segments of this shape.
   * @remarks Abstract: throws unless overridden by a subclass.
   */
  protected _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  /**
   * Get the control handles for this shape.
   * @returns The position, rotation in radians, and visible state for each handle.
   * @remarks Abstract: throws unless overridden by a subclass.
   */
  protected _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  /**
   * Move the control handle to the destination position.
   * @param name        - The handle name.
   * @param destination - The destination of the handle.
   * @param options     - Additional options.
   * @remarks Abstract: throws unless overridden by a subclass.
   */
  moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  /**
   * Transform this shape by moving a scale handle.
   * @param fieldName   - The field name of the axis that is scaled.
   * @param origin      - The origin.
   * @param direction   - The direction of the axis in degrees.
   * @param alignment   - The alignment of the axis.
   * @param destination - The handle destination.
   * @param snap        - Snap?
   * @param allowZero   - Allow zero size? (default: `false`)
   * @param max         - The maximum value.
   * @internal
   */
  protected _moveScaleHandle(
    fieldName: string,
    origin: Canvas.Point,
    direction: number,
    alignment: number,
    destination: Canvas.Point,
    snap: boolean,
    allowZero?: boolean,
    max?: number,
  ): void;

  /**
   * Transform this shape by moving a rotation handle.
   * @param direction   - The direction of the rotation handle in degrees.
   * @param destination - The handle destination.
   * @param snap        - Snap?
   * @internal
   */
  protected _moveRotationHandle(direction: number, destination: Canvas.Point, snap: boolean): void;

  /**
   * Transform this shape by moving the sweep handle.
   * @param maxAngle    - The maximum angle possible.
   * @param destination - The handle destination.
   * @param snap        - Snap?
   * @internal
   */
  protected _moveSweepHandle(maxAngle: number, destination: Canvas.Point, snap: boolean): void;

  /**
   * Handle the drag start event for the creation of this shape.
   * @param event - The pointer event.
   * @internal
   */
  protected _onDragStart(event: PIXI.FederatedEvent): void;

  /**
   * Handle the drag move event for the creation of this shape.
   * @param event - The pointer event.
   * @remarks Abstract: throws unless overridden by a subclass.
   * @internal
   */
  protected _onDragMove(event: PIXI.FederatedEvent): void;

  /**
   * Sample a point from the shape interior.
   * @param out - A point to write to.
   * @returns The sampled point.
   * @throws If the shape is empty.
   */
  sampleInterior(out?: Canvas.Point): Canvas.Point;

  /**
   * Sample a point from the shape boundary.
   * @param out - A point to write to.
   * @returns The sampled point.
   * @throws If the shape is empty.
   */
  sampleBoundary(out?: Canvas.Point): Canvas.Point;

  #ClientShapeData: true;
}

declare function ClientShapeDataMixin<BaseClass extends ClientShapeDataMixin.BaseClass>(
  ShapeData: BaseClass,
): Mixin<typeof ClientShapeData, BaseClass>;

declare namespace ClientShapeDataMixin {
  interface AnyMixedConstructor extends ReturnType<typeof ClientShapeDataMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = AnyConstructor;

  /** The triangulation of a shape. */
  interface Triangulation {
    vertices: Float32Array;
    indices: Uint16Array | Uint32Array;
  }

  /** A measured segment of a shape. */
  interface MeasuredSegment {
    ray: Ray;
    winding: -1 | 0 | 1;
    distance: number;
    angle?: number;
  }

  /** A single control handle of a shape: a position, a rotation in radians, and a visible state. */
  interface ControlHandle {
    position: Canvas.Point;
    rotation: number;
    visible: boolean;
  }

  /** The control handles of a shape, keyed by handle name. */
  type ControlHandles = Record<string, ControlHandle>;

  /** The return type of {@linkcode ClientShapeData._createClipperPolyTree}. */
  type ClipperPolyTreeResult = ClipperLib.PolyTree | PIXI.Polygon.ClipperPoint[] | Canvas.Point[] | number[];

  /** @internal */
  type _MoveOptions = InexactPartial<{
    /**
     * Snap the origin?
     * @defaultValue `false`
     */
    snap: boolean;
  }>;

  interface MoveOptions extends _MoveOptions {}

  /** @internal */
  type _RotateOptions = InexactPartial<{
    /**
     * The pivot of rotation.
     * @defaultValue origin
     */
    pivot: Canvas.Point;
  }>;

  interface RotateOptions extends _RotateOptions {}

  /** @internal */
  type _MoveControlHandleOptions = InexactPartial<{
    /**
     * Snapping?
     * @defaultValue `false`
     */
    snap: boolean;

    /**
     * Unlinked scaling?
     * @defaultValue `false`
     */
    unlinked: boolean;
  }>;

  interface MoveControlHandleOptions extends _MoveControlHandleOptions {}

  /** @internal */
  type _CalculateSizeOptions = InexactPartial<{
    /**
     * Snap the size to with defined grid snapping precision?
     * @defaultValue `false`
     */
    snap: boolean;

    /**
     * Round the size to integer?
     * @defaultValue `!snap`
     */
    round: boolean;

    /**
     * Allow the size to be zero?
     * @defaultValue `false`
     */
    allowZero: boolean;
  }>;

  interface CalculateSizeOptions extends _CalculateSizeOptions {}
}

/**
 * The data model for a rectangle shape.
 */
export class RectangleShapeData extends ClientShapeDataMixin(BaseRectangleShapeData) {
  /**
   * Get the rays for both axes.
   * @internal
   */
  protected _getRays(): { axisX: Ray; axisY: Ray };

  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createCenter(): Canvas.Point;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  override drawShape(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for a circle shape.
 */
export class CircleShapeData extends ClientShapeDataMixin(BaseCircleShapeData) {
  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  protected override _rotate(angle: number): void;

  override drawShape(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for an ellipse shape.
 */
export class EllipseShapeData extends ClientShapeDataMixin(BaseEllipseShapeData) {
  /**
   * Get the rays for both axes.
   * @internal
   */
  protected _getRays(): { axisX: Ray; axisY: Ray };

  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override drawShape(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for a cone shape.
 */
export class ConeShapeData extends ClientShapeDataMixin(BaseConeShapeData) {
  /**
   * Get the rays for the left edge, center, and right edge.
   * @internal
   */
  protected _getRays(): { left: Ray; center: Ray; right: Ray };

  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createCenter(): Canvas.Point;

  protected override _calculateArea(): number;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for a ring shape.
 */
export class RingShapeData extends ClientShapeDataMixin(BaseRingShapeData) {
  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  override drawShape(graphics: PIXI.Graphics): void;

  override drawReferenceLines(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for a line shape.
 */
export class LineShapeData extends ClientShapeDataMixin(BaseLineShapeData) {
  /**
   * Get the rays for both axes.
   * @internal
   */
  protected _getRays(): { axisX: Ray; axisY: Ray };

  override get isEmpty(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createCenter(): Canvas.Point;

  protected override _calculateArea(): number;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for an emanation shape.
 */
export class EmanationShapeData extends ClientShapeDataMixin(BaseEmanationShapeData) {
  override get isEmpty(): boolean;

  override get isAffectedByGrid(): boolean;

  override get hasRotationalSymmetry(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createOrigin(): Canvas.Point;

  override move(origin: Canvas.Point, options?: ClientShapeDataMixin.MoveOptions): void;

  protected override _rotate(angle: number): void;

  override drawReferenceLines(graphics: PIXI.Graphics): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for a polygon shape.
 */
export class PolygonShapeData extends ClientShapeDataMixin(BasePolygonShapeData) {
  override get hasRotationalSymmetry(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createOrigin(): Canvas.Point;

  protected override _getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _calculateSize(
    length: number,
    direction: number,
    options?: ClientShapeDataMixin.CalculateSizeOptions,
  ): number;

  override move(origin: Canvas.Point, options?: ClientShapeDataMixin.MoveOptions): void;

  protected override _rotate(angle: number): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;

  protected override _onDragStart(event: PIXI.FederatedEvent): void;

  protected override _onDragMove(event: PIXI.FederatedEvent): void;
}

/**
 * The data model for a token shape.
 */
export class TokenShapeData extends ClientShapeDataMixin(BaseTokenShapeData) {
  /**
   * Get the token shape.
   * @internal
   * @privateRemarks Foundry's JSDoc types this as `CircleShapeData | EllipseShapeData | PolygonShapeData`, but
   * the runtime also constructs a {@linkcode RectangleShapeData} for square grids, so it is included here.
   */
  protected _getTokenShape(): CircleShapeData | EllipseShapeData | PolygonShapeData | RectangleShapeData;

  override get isEmpty(): boolean;

  // FIXME: PolygonTree // Awaiting `client/data/polygon-tree.d.mts` (the v14 `PolygonTree`), authored with the Scene Levels subsystem in Phase 7.
  override get polygonTree(): AnyObject;

  override sampleInterior(out?: Canvas.Point): Canvas.Point;

  override sampleBoundary(out?: Canvas.Point): Canvas.Point;

  override get isAffectedByGrid(): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createOrigin(): Canvas.Point;

  override move(origin: Canvas.Point, options?: ClientShapeDataMixin.MoveOptions): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;
}

/**
 * The data model for a grid shape.
 */
export class GridShapeData extends ClientShapeDataMixin(BaseGridShapeData) {
  override get isEmpty(): boolean;

  override get isAffectedByGrid(): boolean;

  override get hasRotationalSymmetry(): boolean;

  override testPoint(point: Canvas.Point): boolean;

  protected override _createClipperPolyTree(): ClientShapeDataMixin.ClipperPolyTreeResult;

  protected override _createOrigin(): Canvas.Point;

  override move(origin: Canvas.Point, options?: ClientShapeDataMixin.MoveOptions): void;

  protected override _rotate(angle: number): void;

  protected override _createMeasuredSegments(): ClientShapeDataMixin.MeasuredSegment[];

  protected override _createControlHandles(): ClientShapeDataMixin.ControlHandles;

  override moveControlHandle(
    name: string,
    destination: Canvas.Point,
    options?: ClientShapeDataMixin.MoveControlHandleOptions,
  ): void;
}
