import { expectTypeOf } from "vitest";

import borders = foundry.canvas.borders;

declare const graphics: PIXI.smooth.SmoothGraphics;
declare const rect: PIXI.Rectangle;

expectTypeOf(borders.drawBorder(graphics, rect)).toBeVoid();
expectTypeOf(borders.drawBorder(graphics, (g) => g.clear())).toBeVoid();
expectTypeOf(
  borders.drawBorder(graphics, rect, { color: 0xff0000, dashed: true, alignment: 0.5, clear: false }),
).toBeVoid();
