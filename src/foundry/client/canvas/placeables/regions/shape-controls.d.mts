import type { Identity } from "#utils";
import type { ShapeControls } from "#client/canvas/containers/_module.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { Region } from "#client/canvas/placeables/_module.d.mts";
import type { RegionLayer } from "#client/canvas/layers/_module.d.mts";

/**
 * Controls for a Region shape.
 */
declare class RegionShapeControls extends ShapeControls<
  RegionDocument.Implementation,
  Region.Implementation,
  RegionLayer
> {
  protected override _updateDragPreview(event: Canvas.Event.Pointer): void;

  protected override _onClick2(event: Canvas.Event.Pointer): void;

  #RegionShapeControls: true;
}

declare namespace RegionShapeControls {
  interface Any extends AnyRegionShapeControls {}
  interface AnyConstructor extends Identity<typeof AnyRegionShapeControls> {}
}

declare abstract class AnyRegionShapeControls extends RegionShapeControls {
  constructor(...args: never);
}

export default RegionShapeControls;
