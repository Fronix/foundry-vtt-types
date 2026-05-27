import type { AnyObject, Identity } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import Canvas = foundry.canvas.Canvas;
import type AmbientSound from "../sound.mjs";
import type { SoundsLayer } from "#client/canvas/layers/_module.d.mts";

/**
 * Controls for a AmbientSound shape.
 */
// @privateRemarks The v14 source parameterizes `ShapeControls`'s `ShapeClass` with the specific shape data
// (`CircleShapeData`), but it is omitted here (defaulting to
// `BaseShapeData`, matching `RegionShapeControls`): declaring that client-shape `ShapeClass` argument
// tripped a `tsc` internal assertion during type-aware ESLint (a spurious crash in an unrelated
// `DialogV2.input` overload). `tsgo`, `tsc`, and the type tests are unaffected.
declare class AmbientSoundShapeControls extends ShapeControls<
  AmbientSoundDocument.Implementation,
  AmbientSound.Implementation,
  SoundsLayer
> {
  protected override _onDragStart(event: Canvas.Event.Pointer): void;

  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): AnyObject;

  protected override _onDragDrop(event: Canvas.Event.Pointer): void;

  #AmbientSoundShapeControls: true;
}

declare namespace AmbientSoundShapeControls {
  interface Any extends AnyAmbientSoundShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundShapeControls> {}
}

declare abstract class AnyAmbientSoundShapeControls extends AmbientSoundShapeControls {
  constructor(...args: never);
}

export default AmbientSoundShapeControls;
