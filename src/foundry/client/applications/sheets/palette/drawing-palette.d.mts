import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type DrawingConfig from "../drawing-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created drawings.
 */
declare class DrawingPalette extends PlaceablePaletteMixin(DrawingConfig) {
  static override SETTING_KEY: "drawingPalette";

  static override documentName: "Drawing";

  /**
   * Migrate existing default drawing settings into the palette.
   * @internal
   */
  static _migrateDefaultDrawingConfig(): void;
}

declare namespace DrawingPalette {
  interface Any extends AnyDrawingPalette {}
  interface AnyConstructor extends Identity<typeof AnyDrawingPalette> {}
}

export default DrawingPalette;

declare abstract class AnyDrawingPalette extends DrawingPalette {
  constructor(...args: never);
}
