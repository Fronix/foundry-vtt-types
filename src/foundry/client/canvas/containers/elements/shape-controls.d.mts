import type { AnyObject, Identity, InterfaceToObject } from "#utils";
import type { Document } from "#common/abstract/_module.d.mts";
import type { BaseShapeData } from "#common/data/_module.mjs";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";
import type { PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";
import type { RenderFlag, RenderFlags, RenderFlagsMixin } from "#client/canvas/interaction/_module.d.mts";

/**
 * Controls for a shape.
 * @template DocumentClass - The document class of the shape's parent
 * @template ObjectClass   - The placeable object class of the shape's parent
 * @template LayerClass    - The placeables layer class of the shape's parent
 * @template ShapeClass    - The shape data class
 */
declare class ShapeControls<
  DocumentClass extends Document.Any = Document.Any,
  ObjectClass extends PlaceableObject.Any = PlaceableObject.Any,
  LayerClass extends PlaceablesLayer.Any = PlaceablesLayer.Any,
  ShapeClass extends BaseShapeData = BaseShapeData,
> extends RenderFlagsMixin<typeof PIXI.Container>(PIXI.Container) {
  /**
   * @param shape - The shape.
   */
  constructor(shape: ShapeClass);

  static override RENDER_FLAG_PRIORITY: "INTERFACE";

  static override RENDER_FLAGS: InterfaceToObject<ShapeControls.RENDER_FLAGS>;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<ShapeControls.RENDER_FLAGS>;

  /** The shape. */
  get shape(): ShapeClass;

  /** The Document of this shape. */
  get document(): DocumentClass;

  /** The PlaceableObject of this shape. */
  get object(): ObjectClass;

  /** The PlaceableLayer of this shape. */
  get layer(): LayerClass;

  /** The border of the shape. */
  get border(): PIXI.Graphics;

  /**
   * The handles of the shape.
   * @remarks Foundry types this `PIXI.Container<ShapeControlsHandle>`; the repo's PIXI types do not make
   * {@linkcode PIXI.Container} generic over its children.
   */
  get handles(): PIXI.Container;

  /**
   * The tint applied to these controls.
   * @defaultValue `0xFFFFFF`
   */
  get tint(): number;

  set tint(tint: number);

  /**
   * Are the controls editable?
   * @defaultValue `true`
   */
  editable: boolean;

  /**
   * Is the border dashed?
   * @defaultValue `false`
   */
  get dashed(): boolean;

  set dashed(value: boolean);

  override applyRenderFlags(): void;

  /** Refresh the visualization of these controls. */
  protected _refresh(): void;

  /** Refresh the visualization of these controls. */
  refresh(): void;

  /** Draw the shape. */
  protected _drawShape(graphics: PIXI.Graphics): void;

  /** Draw the visualization of these controls. */
  draw(): Promise<this>;

  /** Draw these controls. */
  protected _draw(): Promise<void>;

  /** Clear these controls. */
  protected _clear(): void;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * Can the handle be dragged?
   * @param event   - The pointer event
   * @param options - Options, used internally
   */
  protected _canDragStart(event: Canvas.Event.Pointer, options?: PlaceableObject.CanDragLeftStartOptions): boolean;

  /**
   * Handle the drag start event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragStart(event: Canvas.Event.Pointer): void;

  /**
   * Create and draw the drag preview for a placeable object.
   * @param object - The original placeable object
   * @returns The preview of the placeable object.
   * @internal
   */
  protected static _createDragPreview<ObjectClass extends PlaceableObject.Any>(object: ObjectClass): ObjectClass;

  /**
   * Handle the drag move event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragMove(event: Canvas.Event.Pointer): void;

  /**
   * Update the drag preview. Called when the shape has changed.
   * @param event - The pointer event.
   */
  protected _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected _onDragDrop(event: Canvas.Event.Pointer): void;

  /**
   * Prepare the database update that should occur as the result of a drop operation.
   * @param event - The pointer event.
   * @returns The update data and options (optional)
   */
  protected _prepareDragDropUpdate(event: Canvas.Event.Pointer): AnyObject | [data: AnyObject, options?: AnyObject];

  /**
   * Handle the drag cancel event of a handle.
   * @param event - The pointer event.
   */
  protected _onDragCancel(event: Canvas.Event.Pointer): void;

  /**
   * Handle the double left-click event of a handle.
   * @param event - The pointer event.
   */
  protected _onClick2(event: Canvas.Event.Pointer): void;

  #ShapeControls: true;
}

declare namespace ShapeControls {
  interface Any extends AnyShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyShapeControls> {}

  type RenderFlags = RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{}` */
    refresh: RenderFlag<this, "refresh">;
  }
}

declare abstract class AnyShapeControls extends ShapeControls<
  Document.Any,
  PlaceableObject.Any,
  PlaceablesLayer.Any,
  BaseShapeData
> {
  constructor(...args: never);
}

/**
 * A handle of a shape controls element.
 */
declare class ShapeControlsHandle extends PIXI.smooth.SmoothGraphics {
  /**
   * @param controls - The controls this handle belongs to.
   * @param name     - The name of this handle.
   */
  constructor(controls: ShapeControls.Any, name: string);

  /** The controls that this handle belongs to. */
  get controls(): ShapeControls.Any;

  /** Is hovered? */
  get hovered(): boolean;

  /**
   * Draw the handle.
   * @param style - The style.
   */
  draw(style: ShapeControlsHandle.DrawStyle): Promise<void>;

  #ShapeControlsHandle: true;
}

declare namespace ShapeControlsHandle {
  interface Any extends AnyShapeControlsHandle {}
  interface AnyConstructor extends Identity<typeof AnyShapeControlsHandle> {}

  interface DrawStyle {
    size: number;
    outlineThickness: number;
  }
}

declare abstract class AnyShapeControlsHandle extends ShapeControlsHandle {
  constructor(...args: never);
}

export { ShapeControls, ShapeControlsHandle };
