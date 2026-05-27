import type { Identity } from "#utils";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type WallConfig from "../wall-config.d.mts";

/**
 * A dialog that provides bulk operation or default values for newly-created walls.
 */
declare class WallPalette extends PlaceablePaletteMixin(WallConfig) {
  static override SETTING_KEY: "wallPalette";

  static override COMMIT_TOOL: "wall";

  static override documentName: "Wall";

  /**
   * Handle clicking a preset button in the scene controls.
   */
  static onClickPreset(event: PointerEvent): void;
}

declare namespace WallPalette {
  interface Any extends AnyWallPalette {}
  interface AnyConstructor extends Identity<typeof AnyWallPalette> {}
}

export default WallPalette;

declare abstract class AnyWallPalette extends WallPalette {
  constructor(...args: never);
}
