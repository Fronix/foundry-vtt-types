import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type TileConfig from "../tile-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created tiles.
 */
declare class TilePalette extends PlaceablePaletteMixin(TileConfig) {
  static override SETTING_KEY: "tilePalette";

  static override documentName: "Tile";
}

declare namespace TilePalette {
  interface Any extends AnyTilePalette {}
  interface AnyConstructor extends Identity<typeof AnyTilePalette> {}
}

export default TilePalette;

declare abstract class AnyTilePalette extends TilePalette {
  constructor(...args: never);
}
