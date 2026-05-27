import type { InexactPartial } from "#utils";

/**
 * Draw a border.
 * @param graphics - The graphics to draw the shape into.
 * @param shape    - The shape to draw or a draw callback.
 * @param options  - Additional options.
 */
export declare function drawBorder(
  graphics: PIXI.smooth.SmoothGraphics,
  shape: drawBorder.BorderShape,
  options?: drawBorder.Options,
): void;

declare namespace drawBorder {
  /** A drawable shape, or a callback which draws into the provided graphics. */
  type BorderShape =
    | PIXI.Rectangle
    | PIXI.RoundedRectangle
    | PIXI.Circle
    | PIXI.Ellipse
    | PIXI.Polygon
    | ((graphics: PIXI.smooth.SmoothGraphics) => void);

  /** @internal */
  type _Options = InexactPartial<{
    /**
     * The border color.
     * @defaultValue `0xFFFFFF`
     */
    color: PIXI.ColorSource;

    /**
     * Dashed border?
     * @defaultValue `false`
     */
    dashed: boolean;

    /**
     * The alignment of the outline.
     * @defaultValue `0.5`
     */
    alignment: number;

    /**
     * Clear the graphics before drawing the border?
     * @defaultValue `true`
     */
    clear: boolean;
  }>;

  interface Options extends _Options {}
}
