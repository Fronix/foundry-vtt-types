import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type NoteConfig from "../note-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created notes.
 */
declare class NotePalette extends PlaceablePaletteMixin(NoteConfig) {
  static override SETTING_KEY: "notePalette";

  static override documentName: "Note";
}

declare namespace NotePalette {
  interface Any extends AnyNotePalette {}
  interface AnyConstructor extends Identity<typeof AnyNotePalette> {}
}

export default NotePalette;

declare abstract class AnyNotePalette extends NotePalette {
  constructor(...args: never);
}
