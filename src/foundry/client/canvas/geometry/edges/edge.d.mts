import type PolygonVertex from "./vertex.d.mts";
import type { LineIntersection } from "#common/utils/geometry.d.mts";
import type { Identity, InexactPartial } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

/**
 * A data structure used to represent potential edges used by the ClockwiseSweepPolygon.
 * Edges are not polygon-specific, meaning they can be reused across many polygon instances.
 */
declare class Edge {
  /**
   * Construct an Edge by providing the following information.
   * @param a - The first endpoint of the edge
   * @param b - The second endpoint of the edge
   * @param options - Additional options which describe the edge
   */
  constructor(a: Canvas.Point, b: Canvas.Point, options?: Edge.ConstructorOptions);

  /**
   * The first endpoint of the edge.
   */
  a: PIXI.Point;

  /**
   * The second endpoint of the edge.
   */
  b: PIXI.Point;

  /**
   * The endpoint of the edge which is oriented towards the top-left.
   */
  nw: Canvas.Point;

  /**
   * The endpoint of the edge which is oriented towards the bottom-right.
   */
  se: Canvas.Point;

  /**
   * The rectangular bounds of the edge. Used by the quadtree.
   */
  bounds: PIXI.Rectangle;

  /**
   * The direction of effect for the edge.
   * @defaultValue {@linkcode CONST.EDGE_DIRECTIONS.BOTH}
   */
  direction: CONST.EDGE_DIRECTIONS;

  /**
   * A string used to uniquely identify this edge, if any.
   * @defaultValue `object?.id ?? undefined`
   */
  id: string | undefined;

  /**
   * The Document/PlaceableObject the edge belongs to, if any.
   */
  object: Document.Any | PlaceableObject.Any | undefined;

  /**
   * The type of edge
   * @defaultValue `"wall"`
   * @remarks Assigned in the constructor (`type || "wall"`); not declared as a field in the Foundry source.
   */
  type: Edge.EdgeTypes;

  /**
   * How this edge restricts light.
   * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
   */
  light: CONST.EDGE_SENSE_TYPES;

  /**
   * How this edge restricts darkness.
   * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
   */
  darkness: CONST.EDGE_SENSE_TYPES;

  /**
   * How this edge restricts movement.
   * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
   */
  move: CONST.EDGE_SENSE_TYPES;

  /**
   * How this edge restricts sight.
   * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
   */
  sight: CONST.EDGE_SENSE_TYPES;

  /**
   * How this edge restricts sound.
   * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
   */
  sound: CONST.EDGE_SENSE_TYPES;

  /**
   * Specialized threshold data for this edge.
   * @defaultValue `null`
   */
  threshold: Edge.ThresholdData | null;

  /**
   * A source priority for this edge. Typically zero unless this edge was contributed by a high-priority source.
   * @defaultValue `0`
   * @remarks Assigned in the constructor (`priority ?? 0`); not declared as a field in the Foundry source.
   */
  priority: number;

  /**
   * Record other edges which this one intersects with, keyed by the ID of the Level the edges are in.
   * @defaultValue `{}`
   */
  intersections: Record<string, Edge.IntersectionEntry[]>;

  /**
   * A PolygonVertex instance.
   * Used as part of {@linkcode ClockwiseSweepPolygon} computation.
   * @remarks Only set in {@link ClockwiseSweepPolygon._identifyVertices | `ClockwiseSweepPolygon#_identifyVertices`} (part of CSP initialization)
   */
  vertexA: PolygonVertex | undefined;

  /**
   * A PolygonVertex instance.
   * Used as part of {@linkcode ClockwiseSweepPolygon} computation.
   * @remarks Only set in {@link ClockwiseSweepPolygon._identifyVertices | `ClockwiseSweepPolygon#_identifyVertices`} (part of CSP initialization)
   */
  vertexB: PolygonVertex | undefined;

  /**
   * Is this edge limited for a particular type?
   */
  isLimited(type: CONST.EDGE_RESTRICTION_TYPES): boolean;

  /**
   * Create a copy of the Edge which can be safely mutated.
   */
  clone(): this;

  /**
   * Get an intersection point between this Edge and another.
   */
  getIntersection(other: Edge): LineIntersection | void;

  /**
   * Test whether to apply a proximity threshold to this edge.
   * If the proximity threshold is met, this edge excluded from perception calculations.
   * @param sourceType     - Sense type for the source
   * @param sourceOrigin   - The origin or position of the source on the canvas
   * @param externalRadius - The external radius of the source (default: `0`)
   * @returns True if the edge has a threshold greater than `0` for the source type,
   * and the source type is within that distance.
   */
  applyThreshold(sourceType: Edge.AttenuationTypes, sourceOrigin: Canvas.Point, externalRadius?: number): boolean;

  /**
   * Determine the orientation of this Edge with respect to a reference point.
   * @param point - Some reference point, relative to which orientation is determined
   * @returns An orientation in {@linkcode CONST.EDGE_DIRECTIONS} which indicates whether the Point is left,
   * right, or collinear (both) with the Edge
   */
  orientPoint(point: Canvas.Point): CONST.EDGE_DIRECTIONS;

  /**
   * Identify intersections between a provided iterable of edges.
   * @param edges - An iterable of edges
   * @param level - The ID of the Level the edges are in
   */
  static identifyEdgeIntersections(edges: Iterable<Edge>, level: string): void;

  /**
   * Record the intersections between two edges.
   * @param other - Another edge to test and record
   * @param level - The ID of the Level the edges are in
   */
  recordIntersections(other: Edge, level: string): void;

  /**
   * Remove intersections of this edge with all other edges.
   * @param level - The ID of the Level the edges are in
   */
  removeIntersections(level: string): void;
}

declare namespace Edge {
  interface Any extends AnyEdge {}
  interface AnyConstructor extends Identity<typeof AnyEdge> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * A string used to uniquely identify this edge
     */
    id: string | null;

    /**
     * A PlaceableObject that is responsible for this edge, if any
     */
    object: Document.Any | PlaceableObject.Any;

    /**
     * The type of edge
     * @defaultValue `"wall"`
     */
    type: Edge.EdgeTypes;

    /**
     * How this edge restricts light
     * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
     */
    light: CONST.EDGE_SENSE_TYPES;

    /**
     * How this edge restricts darkness
     * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
     */
    darkness: CONST.EDGE_SENSE_TYPES;

    /**
     * How this edge restricts movement
     * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
     */
    move: CONST.EDGE_SENSE_TYPES;

    /**
     * How this edge restricts sight
     * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
     */
    sight: CONST.EDGE_SENSE_TYPES;

    /**
     * How this edge restricts sound
     * @defaultValue {@linkcode CONST.EDGE_SENSE_TYPES.NONE}
     */
    sound: CONST.EDGE_SENSE_TYPES;

    /**
     * A direction of effect for the edge
     * @defaultValue {@linkcode CONST.EDGE_DIRECTIONS.BOTH}
     */
    direction: CONST.EDGE_DIRECTIONS;

    /**
     * Configuration of threshold data for this edge
     * @defaultValue `null`
     */
    threshold: Edge.ThresholdData;

    /**
     * A source priority for this edge. Typically zero unless this edge was contributed by a high-priority source.
     * @defaultValue `0`
     */
    priority: number;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  type EdgeTypes = "wall" | "source" | "innerBounds" | "outerBounds";

  type AttenuationTypes = Exclude<foundry.CONST.EDGE_RESTRICTION_TYPES, "move">;

  interface IntersectionEntry {
    edge: Edge;
    intersection: LineIntersection;
  }

  /**
   * Specialized threshold data for an Edge.
   * @remarks Foundry's `EdgeThresholdData`.
   */
  interface ThresholdData {
    /** Minimum distance in pixels from a light source for which this edge blocks light */
    light?: number | undefined;

    /** Minimum distance in pixels from a light source for which this edge blocks darkness */
    darkness?: number | undefined;

    /** Minimum distance in pixels from a vision source for which this edge blocks vision */
    sight?: number | undefined;

    /** Minimum distance in pixels from a sound source for which this edge blocks sound */
    sound?: number | undefined;

    /**
     * Whether to attenuate the source radius when passing through the edge
     * @defaultValue `true`
     */
    attenuation?: boolean | undefined;
  }
}

declare abstract class AnyEdge extends Edge {
  constructor(...args: never);
}

export default Edge;
