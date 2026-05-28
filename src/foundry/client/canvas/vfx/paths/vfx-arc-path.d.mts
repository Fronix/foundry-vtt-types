import type VFXPath from "../vfx-path.d.mts";
import type { VFXBasePathPoint } from "../_types.d.mts";

/**
 * Generate an arcing path between provided control points using cubic hermite splines.
 * @param waypoints - Explicit waypoints to interpolate
 * @param params    - Spline interpolation parameters (default: `{}`)
 * @returns A generated arc path
 */
export default function arcPath(waypoints: VFXBasePathPoint[], params?: object): VFXPath;

/**
 * Generate cubic hermite spline points for a pair of control points.
 * @param origin      - Starting point of the arc
 * @param destination - Ending point of the arc
 * @param options     - Configuration options
 * @returns Array of path points
 */
export function generateArcPoints(
  origin: VFXBasePathPoint,
  destination: VFXBasePathPoint,
  options?: {
    /** Number of points to generate (default: half of distance in pixels) */
    numPoints?: number | undefined;

    /**
     * Position along path where arc peaks (0-1)
     * @defaultValue `0.5`
     */
    peakRatio?: number | undefined;

    /**
     * Height of arc as ratio of path length
     * @defaultValue `0.3`
     */
    peakHeight?: number | undefined;

    /**
     * Direction of arc perpendicular to path (1 for "up", -1 for "down")
     * @defaultValue `1`
     */
    direction?: number | undefined;

    /**
     * Scaling factor for tangent vectors. Determines how curvy the arc is
     * @defaultValue `1`
     */
    tangentScale?: number | undefined;

    /** An array of auxiliary parameter names */
    auxiliary?: string[] | undefined;
  },
): VFXBasePathPoint[];
