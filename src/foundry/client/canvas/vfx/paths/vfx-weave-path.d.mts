import type VFXPath from "../vfx-path.d.mts";
import type { VFXBasePathPoint } from "../_types.d.mts";

/**
 * Generate an oscillating weave path between provided control points using cubic hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters (default: `{}`)
 * @returns A generated weave path
 */
export default function weavePath(waypoints: VFXBasePathPoint[], params?: object): VFXPath;

/**
 * Generate cubic hermite spline points for a pair of control points.
 * @param origin      - Starting point of the arc
 * @param destination - Ending point of the arc
 * @param options     - Configuration options
 * @returns Array of path points
 */
export function generateWeavePoints(
  origin: VFXBasePathPoint,
  destination: VFXBasePathPoint,
  options?: {
    /**
     * Number of Hermite arcs (1 = single arc, 2 = up/down pair, etc.)
     * @defaultValue `1`
     */
    arcCount?: number | undefined;

    /**
     * Ratio of the path length that determines the peak displacement of the arcs (1 = full path length)
     * @defaultValue `0.15`
     */
    amplitude?: number | undefined;

    /**
     * Multiplier applied to the Hermite tangents
     * @defaultValue `1`
     */
    tangentScale?: number | undefined;

    /**
     * Starting direction of the weave (1 = "up", -1 = "down")
     * @defaultValue `1`
     */
    direction?: number | undefined;

    /**
     * Points generated per Hermite segment
     * @defaultValue `8`
     */
    segmentPoints?: number | undefined;

    /** An array of auxiliary parameter names */
    auxiliary?: string[] | undefined;
  },
): VFXBasePathPoint[];
