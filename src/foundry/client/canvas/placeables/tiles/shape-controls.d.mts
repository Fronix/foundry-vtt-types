import type { AnyObject, Identity } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import Canvas = foundry.canvas.Canvas;
import type Tile from "../tile.mjs";
import type { TilesLayer } from "#client/canvas/layers/_module.d.mts";

/**
 * Controls for a Tile shape.
 */
// @privateRemarks The v14 source parameterizes `ShapeControls`'s `ShapeClass` with the specific shape data
// (`RectangleShapeData`), but it is omitted here (defaulting to
// `BaseShapeData`, matching `RegionShapeControls`): declaring that client-shape `ShapeClass` argument
// tripped a `tsc` internal assertion during type-aware ESLint (a spurious crash in an unrelated
// `DialogV2.input` overload). `tsgo`, `tsc`, and the type tests are unaffected.
declare class TileShapeControls extends ShapeControls<TileDocument.Implementation, Tile.Implementation, TilesLayer> {
  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _prepareDragDropUpdate(event: Canvas.Event.Pointer): AnyObject;

  protected override _onClick2(event: Canvas.Event.Pointer): void;

  #TileShapeControls: true;
}

declare namespace TileShapeControls {
  interface Any extends AnyTileShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyTileShapeControls> {}
}

declare abstract class AnyTileShapeControls extends TileShapeControls {
  constructor(...args: never);
}

export default TileShapeControls;
