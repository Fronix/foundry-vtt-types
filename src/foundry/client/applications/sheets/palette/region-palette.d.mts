import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type RegionConfig from "../region-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created regions.
 */
declare class RegionPalette extends PlaceablePaletteMixin(RegionConfig) {
  static override SETTING_KEY: "regionPalette";

  static override documentName: "Region";
}

declare namespace RegionPalette {
  interface Any extends AnyRegionPalette {}
  interface AnyConstructor extends Identity<typeof AnyRegionPalette> {}
}

export default RegionPalette;

declare abstract class AnyRegionPalette extends RegionPalette {
  constructor(...args: never);
}
