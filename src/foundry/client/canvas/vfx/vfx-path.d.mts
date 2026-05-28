import type { Identity } from "#utils";
import type { VFXBasePathPoint, VFXPathGenerator, VFXPathPoint } from "./_types.d.mts";

/**
 * A class responsible for constructing a path of points used for animation.
 */
declare class VFXPath {
  /**
   * Construct a VFXPath by providing an array of base point data.
   */
  constructor(points: VFXBasePathPoint[]);

  /**
   * The array of points in the path
   */
  get pathPoints(): VFXPathPoint[];

  /**
   * Total length of the traveled path across all segments.
   */
  get pathLength(): number;

  /**
   * Get the interpolated point for a value x on [0, 1]
   * @param x     - The animation progress on [0, 1]
   * @param index - A known index of the path which was already reached (default: `0`)
   */
  interpolatedPoint(x: number, index?: number): VFXPathPoint;

  /**
   * Compute an interpolated point along the path at a given distance.
   * @param distance - The desired distance along the path
   * @returns An interpolated point for object position at that distance
   */
  interpolatedPointAtDistance(distance: number): VFXPathPoint;

  /**
   * Get a configured path generator from `CONFIG.Canvas.vfx.paths`.
   * @param pathName - The named path type
   */
  static getPathGenerator(pathName: string): VFXPathGenerator;

  /**
   * Create a VFXPath instance of a certain named path type defined in `CONFIG.Canvas.vfx.paths`.
   * @param pathName   - The named path type to construct
   * @param points     - Path points to construct
   * @param parameters - Additional parameters used to construct the path (default: `{}`)
   */
  static create(pathName: string, points: VFXBasePathPoint[], parameters?: object): VFXPath;
}

declare namespace VFXPath {
  interface Any extends VFXPath {}
  interface AnyConstructor extends Identity<typeof VFXPath> {}
}

export default VFXPath;
