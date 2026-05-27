import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type AmbientLightConfig from "../ambient-light-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created ambient lights.
 */
declare class AmbientLightPalette extends PlaceablePaletteMixin(AmbientLightConfig) {
  static override SETTING_KEY: "ambientLightPalette";

  static override documentName: "AmbientLight";
}

declare namespace AmbientLightPalette {
  interface Any extends AnyAmbientLightPalette {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightPalette> {}
}

export default AmbientLightPalette;

declare abstract class AnyAmbientLightPalette extends AmbientLightPalette {
  constructor(...args: never);
}
