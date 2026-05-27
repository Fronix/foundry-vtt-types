import { expectTypeOf } from "vitest";

import Region = foundry.canvas.placeables.Region;
import PlaceableObject = foundry.canvas.placeables.PlaceableObject;
import RegionGeometry = foundry.canvas.placeables.regions.RegionGeometry;
import RegionShape = foundry.data.regionShapes.RegionShape;
import RegionPolygonTree = foundry.data.regionShapes.RegionPolygonTree;
import BaseShapeData = foundry.data.BaseShapeData;

expectTypeOf(Region.embeddedName).toEqualTypeOf<"Region">();
expectTypeOf(Region.RENDER_FLAGS.redraw.propagate).toEqualTypeOf<
  | Array<
      | "refresh"
      | "refreshState"
      | "refreshVisibility"
      | "refreshShapes"
      | "refreshGeometry"
      | "refreshBorder"
      | "refreshMeasurements"
    >
  | undefined
>();

// deprecated since v13, until v15
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Region.CLIPPER_SCALING_FACTOR).toEqualTypeOf<100>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Region.MOVEMENT_SEGMENT_TYPES).toEqualTypeOf<Region.MovementSegmentTypes>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(Region.MOVEMENT_SEGMENT_TYPES.ENTER).toExtend<Region.MOVEMENT_SEGMENT_TYPES>();

declare const doc: RegionDocument.Stored;
const region = new CONFIG.Region.objectClass(doc);

expectTypeOf(region.controlIcon).toBeNull();
expectTypeOf(region.geometry).toEqualTypeOf<RegionGeometry>();
expectTypeOf(region.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(region.center).toEqualTypeOf<PIXI.Point>();
expectTypeOf(region.isVisible).toBeBoolean();
expectTypeOf(region.isInteractable).toBeBoolean();
expectTypeOf(region.isAnimating).toBeBoolean();
expectTypeOf(region.animationState.area).toBeNumber();
expectTypeOf(region.animationState.shapes).toExtend<ReadonlyArray<unknown>>();

// unconditionally throws
expectTypeOf(region.getSnappedPosition()).toBeNever();

// @ts-expect-error _draw always gets passed a value
expectTypeOf(region["_draw"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(region["_draw"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(region._redrawShapeControls()).toBeVoid();
expectTypeOf(region["_clear"]()).toBeVoid();
expectTypeOf(region["_getMeasuredShapes"]()).toEqualTypeOf<BaseShapeData[]>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.clear()).toEqualTypeOf<Region.Implementation>();

// @ts-expect-error an object must be passed
expectTypeOf(region["_applyRenderFlags"]()).toBeVoid();
expectTypeOf(region["_applyRenderFlags"]({})).toBeVoid();
// all falsey values have no effect
expectTypeOf(region["_applyRenderFlags"]({ refreshBorder: false, refreshState: undefined })).toBeVoid();
expectTypeOf(
  region["_applyRenderFlags"]({
    redraw: true,
    refresh: true,
    refreshState: true,
    refreshVisibility: true,
    refreshShapes: true,
    refreshGeometry: true,
    refreshBorder: true,
    refreshMeasurements: true,
  }),
).toBeVoid();

expectTypeOf(region["_refreshVisibility"]()).toBeVoid();
expectTypeOf(region["_refreshState"]()).toBeVoid();
expectTypeOf(region["_refreshShapes"]()).toBeVoid();
expectTypeOf(region["_refreshGeometry"]()).toBeVoid();
expectTypeOf(region["_refreshBorder"]()).toBeVoid();
expectTypeOf(region["_getCoveredGridSpaceOffsets"]()).toEqualTypeOf<foundry.grid.BaseGrid.Offset2D[]>();
expectTypeOf(region._onTokenAnimationFrame()).toBeVoid();
expectTypeOf(region["_onAnimationStateChange"]()).toBeVoid();

declare const someUser: User.Implementation;
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
expectTypeOf(region["_canDrag"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(region["_canHUD"](someUser, pointerEvent)).toBeBoolean();

// @ts-expect-error _onControl is always passed a value
expectTypeOf(region["_onControl"]()).toBeVoid();
expectTypeOf(region["_onControl"]({})).toBeVoid();
expectTypeOf(region["_onControl"]({ releaseOthers: false })).toBeVoid();

// @ts-expect-error _onRelease always gets passed a value
expectTypeOf(region["_onRelease"]()).toBeVoid();
expectTypeOf(region["_onRelease"]({})).toBeVoid();

expectTypeOf(region["_onHoverIn"](pointerEvent)).toEqualTypeOf<false | void>();
expectTypeOf(region["_onHoverIn"](pointerEvent, {})).toEqualTypeOf<false | void>();
expectTypeOf(region["_onHoverIn"](pointerEvent, { hoverOutOthers: true, updateLegend: false })).toEqualTypeOf<
  false | void
>();
expectTypeOf(region["_onHoverIn"](pointerEvent, { hoverOutOthers: null, updateLegend: null })).toEqualTypeOf<
  false | void
>();

expectTypeOf(region["_onHoverOut"](pointerEvent)).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, {})).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, { updateLegend: false })).toBeVoid();
expectTypeOf(region["_onHoverOut"](pointerEvent, { updateLegend: null })).toBeVoid();

expectTypeOf(region["_overlapsSelection"](new PIXI.Rectangle())).toBeBoolean();
expectTypeOf(region["_updateDragPreviews"](pointerEvent)).toBeVoid();

expectTypeOf(region["_prepareDragLeftDropUpdates"](pointerEvent)).toEqualTypeOf<
  PlaceableObject.AnyDragLeftDropUpdate[]
>();

// Deprecated since v13, until v15

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.shapes).toEqualTypeOf<RegionShape.Any[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.bottom).toBeNumber();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.top).toBeNumber();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.polygons).toEqualTypeOf<PIXI.Polygon[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.polygonTree).toEqualTypeOf<RegionPolygonTree>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.clipperPaths).toEqualTypeOf<ClipperLib.Paths>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.triangulation).toEqualTypeOf<Region.TriangulationData>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.testPoint({ x: 50, y: 50 })).toBeBoolean();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.testPoint({ x: 50, y: 50 }, 20)).toBeBoolean();

const waypoints = [
  { x: 50, y: 50, elevation: 0 },
  { x: 70, y: 90, elevation: 60 },
];
const samples = [
  { x: 52, y: 62 },
  { x: 500, y: 7000 },
];
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples)).toEqualTypeOf<Region.MovementSegment[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples, {})).toEqualTypeOf<Region.MovementSegment[]>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples, { teleport: true })).toEqualTypeOf<
  Region.MovementSegment[]
>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(region.segmentizeMovement(waypoints, samples, { teleport: null })).toEqualTypeOf<
  Region.MovementSegment[]
>();
