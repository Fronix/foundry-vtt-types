import type { Identity, InexactPartial } from "#utils";
import type PointSourcePolygon from "./source-polygon.d.mts";

// FIXME(v14): `compute`/`result` return `client/data/polygon-tree.d.mts`'s `PolygonTree | null`.
// That file is not yet authored (Phase 7 — client/data). Typed loosely as `object | null` until it
// exists, at which point the import + return types should reference `PolygonTree`.

/**
 * This class computes the elevated surface exposure polygon tree.
 */
declare class ElevatedSurfaceExposureGenerator {
  /**
   * @param polygon - The source polygon the exposure is computed for
   * @param options - The surface exposure options
   */
  constructor(polygon: PointSourcePolygon, options?: ElevatedSurfaceExposureGenerator.Options);

  /**
   * Compute the elevated surface exposure for the given source polygon using the
   * {@linkcode ElevatedSurfaceExposureGenerator}.
   * @param polygon - The source polygon the exposure is computed for
   * @param options - The surface exposure options
   * @returns The computed elevated surface exposure or `null` if empty
   */
  static compute(polygon: PointSourcePolygon, options?: ElevatedSurfaceExposureGenerator.Options): object | null;

  /**
   * The source polygon the exposure is computed for.
   */
  get polygon(): PointSourcePolygon;

  /**
   * Points with at most this distance (grid units) from the surface are exposed.
   */
  get threshold(): number;

  /**
   * The result of the computation, which is `null` if the surface exposure is empty.
   * @throws If {@linkcode ElevatedSurfaceExposureGenerator.compute | ElevatedSurfaceExposureGenerator#compute} wasn't called yet.
   */
  get result(): object | null;

  /**
   * Compute the surface exposure.
   * @returns The computed elevated surface exposure or `null` if empty
   */
  compute(): object | null;
}

declare namespace ElevatedSurfaceExposureGenerator {
  interface Any extends AnyElevatedSurfaceExposureGenerator {}
  interface AnyConstructor extends Identity<typeof AnyElevatedSurfaceExposureGenerator> {}

  /** @internal */
  type _Options = InexactPartial<{
    /**
     * Points with at most this distance (grid units) from the surface are exposed.
     * @defaultValue `0`
     */
    threshold: number;
  }>;

  /** The surface exposure options. */
  interface Options extends _Options {}
}

declare abstract class AnyElevatedSurfaceExposureGenerator extends ElevatedSurfaceExposureGenerator {
  constructor(...args: never);
}

export default ElevatedSurfaceExposureGenerator;
