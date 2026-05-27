import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type AmbientSoundConfig from "../ambient-sound-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created ambient sounds.
 */
declare class AmbientSoundPalette extends PlaceablePaletteMixin(AmbientSoundConfig) {
  static override SETTING_KEY: "ambientSoundPalette";

  static override documentName: "AmbientSound";
}

declare namespace AmbientSoundPalette {
  interface Any extends AnyAmbientSoundPalette {}
  interface AnyConstructor extends Identity<typeof AnyAmbientSoundPalette> {}
}

export default AmbientSoundPalette;

declare abstract class AnyAmbientSoundPalette extends AmbientSoundPalette {
  constructor(...args: never);
}
