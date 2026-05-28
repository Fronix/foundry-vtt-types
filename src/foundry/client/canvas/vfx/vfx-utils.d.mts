import type { AnyObject } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { VFXBasePathPoint, VFXComponentAnimation } from "./_types.d.mts";

/**
 * Interpolate rotation in radians between two angles.
 */
export function interpolateRotation(r1: number, r2: number, i: number): number;

/**
 * Parse rotation options normalized to radians from shared config objects
 */
export function parseRotation(data: {
  /** Initial rotation in degrees */
  angle?: number | undefined;

  /** Initial rotation in radians */
  rotation?: number | undefined;

  /** Incremental rotation towards a destination position */
  rotateTowards?: Canvas.Point | undefined;

  /** Rotate from an origin position, needed if using `rotateTowards` */
  origin?: Canvas.Point | undefined;
}): number;

/**
 * Resolves a component animation by name.
 * @param functionName - Name of the animation object in `CONFIG.Canvas.vfx.animations`
 */
export function resolveAnimation(functionName: string): VFXComponentAnimation;

/**
 * Resolves an anime.js easing function by name and initializes it with parameters.
 * @param functionName - Name of the easing function
 * @param easingParams - Optional positional parameters to initialize the easing function
 */
export function resolveEasing(functionName: string, easingParams?: unknown): (time: number) => number;

/**
 * Generates points along a cubic Hermite spline segment.
 * @param p0        - Start control point
 * @param m0        - Tangent vector at start point
 * @param p1        - End control point
 * @param m1        - Tangent vector at end point
 * @param numPoints - Number of points to generate along the segment
 * @param auxiliary - An array of auxiliary numeric attributes to interpolate
 */
export function generateHermiteSegment(
  p0: VFXBasePathPoint,
  m0: Canvas.Point,
  p1: VFXBasePathPoint,
  m1: Canvas.Point,
  numPoints: number,
  auxiliary?: string[],
): VFXBasePathPoint[];

/**
 * Interpolate auxiliary attributes between two points.
 * @param p0        - Start control point
 * @param p1        - End control point
 * @param t         - Interpolation parameter
 * @param auxiliary - An array of auxiliary numeric attributes to interpolate
 */
export function interpolateProperties(
  p0: VFXBasePathPoint,
  p1: VFXBasePathPoint,
  t: number,
  auxiliary?: string[],
): AnyObject;
