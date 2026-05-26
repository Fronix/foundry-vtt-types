import type { Identity, InexactPartial, InterfaceToObject } from "#utils";
import type { PreciseText } from "#client/canvas/containers/_module.mjs";
import type { RenderFlag, RenderFlags, RenderFlagsMixin } from "#client/canvas/interaction/_module.d.mts";

/**
 * A generic helper for drawing a standard Control Icon
 */
declare class ControlIcon extends RenderFlagsMixin<typeof PIXI.Container>(PIXI.Container) {
  /**
   * @remarks Foundry marks the entire `options` bag as optional via `={}`.
   * @throws (Deprecated until v16) Passing `null` for `tint` logs a compatibility warning and is coerced to `0xFFFFFF`.
   */
  constructor(options?: ControlIcon.ConstructorOptions);

  static override RENDER_FLAG_PRIORITY: "INTERFACE";

  static override RENDER_FLAGS: InterfaceToObject<ControlIcon.RENDER_FLAGS>;

  // Note: This isn't a "real" override but `renderFlags` is set corresponding to the
  // `RENDER_FLAGS` and so it has to be adjusted here.
  renderFlags: RenderFlags<ControlIcon.RENDER_FLAGS>;

  /**
   * The (URL of the) icon texture used by this control icon.
   */
  get texture(): PIXI.Texture | string;

  set texture(value);

  /**
   * The size of the control icon.
   */
  get size(): number;

  set size(value);

  /**
   * The elevation of the control icon, which is displayed in its tooltip text.
   * @throws If passed a non-finite numeric value
   */
  get elevation(): number;

  set elevation(value);

  /**
   * The background of this control icon.
   */
  bg: PIXI.Graphics;

  /**
   * The border of this control icon.
   */
  border: PIXI.Graphics;

  /**
   * The icon of this control icon.
   */
  icon: PIXI.Sprite;

  /**
   * The tooltip of this control icon.
   */
  tooltip: PreciseText;

  override applyRenderFlags(): void;

  /**
   * Draw the visualization of this control icon.
   */
  draw(): Promise<this>;

  /**
   * Draw this control icon.
   */
  protected _draw(): Promise<void>;

  /**
   * Clear this control icon.
   */
  protected _clear(): void;

  /**
   * Refresh the visualization of this control icon.
   */
  protected _refresh(): void;

  /**
   * Refresh the visualization of this control icon.
   */
  refresh(): void;

  /**
   * @param options - Deprecated options bag.
   * @deprecated since v14, until v16. Set {@linkcode ControlIcon.visible | ControlIcon#visible},
   * {@linkcode ControlIcon.icon | ControlIcon#icon#tint}, and {@linkcode ControlIcon.border | ControlIcon#border#tint} instead.
   */
  refresh(options: ControlIcon.RefreshOptions): this;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  /**
   * @deprecated since v14, until v16. Replaced by {@linkcode ControlIcon.size | ControlIcon#size}.
   */
  get rect(): [number, number, number, number];

  /**
   * @deprecated since v14, until v16. Replaced by {@linkcode ControlIcon.icon | ControlIcon#icon.tint}.
   */
  get tintColor(): PIXI.ColorSource;

  /**
   * @deprecated since v14, until v16. Replaced by {@linkcode ControlIcon.border | ControlIcon#border.tint}.
   */
  get borderColor(): PIXI.ColorSource;

  /**
   * @deprecated since v14, until v16. Replaced by {@linkcode ControlIcon.texture | ControlIcon#texture}.
   */
  get iconSrc(): PIXI.Texture | string;

  set iconSrc(value);

  #ControlIcon: true;
}

declare namespace ControlIcon {
  interface Any extends AnyControlIcon {}
  interface AnyConstructor extends Identity<typeof AnyControlIcon> {}

  type RenderFlags = RenderFlagsMixin.ToBooleanFlags<RENDER_FLAGS>;

  interface RENDER_FLAGS {
    /** @defaultValue `{ propagate: ["refresh"] }` */
    redraw: RenderFlag<this, "redraw">;

    /** @defaultValue `{}` */
    refresh: RenderFlag<this, "refresh">;
  }

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The (URL of the) icon texture
     * @defaultValue {@linkcode PIXI.Texture.EMPTY}
     */
    texture: PIXI.Texture | string;

    /**
     * The size of the icon
     * @defaultValue `40`
     */
    size: number;

    /**
     * The icon tint
     * @defaultValue `0xFFFFFF`
     * @remarks Passing `null` is deprecated since v14, until v16; it is coerced to `0xFFFFFF`.
     */
    tint: PIXI.ColorSource | null;

    /**
     * The border color
     * @defaultValue `CONFIG.Canvas.dispositionColors.CONTROLLED`
     */
    borderColor: PIXI.ColorSource;

    /**
     * The elevation
     * @defaultValue `0`
     */
    elevation: number;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  /** @internal */
  type _RefreshOptions = InexactPartial<{
    visible: boolean;
    iconColor: PIXI.ColorSource;
    borderColor: PIXI.ColorSource;
    borderVisible: boolean;
  }>;

  interface RefreshOptions extends _RefreshOptions {}
}

export default ControlIcon;

declare abstract class AnyControlIcon extends ControlIcon {
  constructor(...args: never);
}
