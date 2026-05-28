import type DataModel from "#common/abstract/data.d.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The base TerrainData.
 */
declare abstract class BaseTerrainData<Schema extends DataSchema> extends DataModel<Schema> {
  /**
   * Create the terrain data from the given array of terrain effects.
   * The type of the terrain effects and data is system-defined. Returns `null` if the array is empty.
   * @param effects - An array of terrain effects.
   * @param options - Additional options.
   */
  static resolveTerrainEffects(effects: readonly unknown[], options?: object): BaseTerrainData.Any | null;

  /**
   * Create the terrain movement cost function for the given token.
   * @param token   - The Token that moves.
   * @param options - Additional options that affect cost calculations.
   * @privateRemarks Returns a `TokenMovementCostFunction | void`; typed loosely pending that helper.
   */
  static getMovementCostFunction(token: TokenDocument.Implementation, options?: object): unknown;

  /**
   * Is this terrain data the same as some other terrain data?
   * @param other - Some other terrain data.
   */
  abstract equals(other: unknown): boolean;
}

declare namespace BaseTerrainData {
  interface Any extends BaseTerrainData<DataSchema> {}
}

/**
 * The core TerrainData implementation.
 */
declare class TerrainData<Schema extends TerrainData.Schema = TerrainData.Schema> extends BaseTerrainData<Schema> {
  static override defineSchema(): TerrainData.Schema;

  static override resolveTerrainEffects(effects: readonly unknown[], options?: object): BaseTerrainData.Any | null;

  static override getMovementCostFunction(token: TokenDocument.Implementation, options?: object): unknown;

  override equals(other: unknown): boolean;
}

declare namespace TerrainData {
  interface Schema extends DataSchema {}
}

export { BaseTerrainData, TerrainData };
