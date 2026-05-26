import { describe, expectTypeOf, test } from "vitest";

import ControlIcon = foundry.canvas.containers.ControlIcon;
import PreciseText = foundry.canvas.containers.PreciseText;

describe("ControlIcon tests", () => {
  test("Construction", () => {
    new ControlIcon();
    new ControlIcon({ texture: "path/to/image.webp" });
    new ControlIcon({ texture: PIXI.Texture.EMPTY });
    new ControlIcon({
      texture: "path/to/image.webp",
      borderColor: 0x00ff00,
      elevation: 20,
      size: 64,
      tint: 0x373964,
    });
  });

  const myControlIcon = new ControlIcon({
    texture: "path/to/image.webp",
    borderColor: 0x00ff00,
    elevation: 20,
    size: 64,
    tint: 0x373964,
  });

  test("Miscellaneous", () => {
    expectTypeOf(myControlIcon.texture).toEqualTypeOf<PIXI.Texture | string>();
    expectTypeOf(myControlIcon.size).toBeNumber();
    myControlIcon.size = 80; // Setter

    expectTypeOf(myControlIcon.bg).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(myControlIcon.icon).toEqualTypeOf<PIXI.Sprite>();
    expectTypeOf(myControlIcon.border).toEqualTypeOf<PIXI.Graphics>();
    expectTypeOf(myControlIcon.tooltip).toEqualTypeOf<PreciseText>();

    expectTypeOf(myControlIcon.elevation).toBeNumber();
    myControlIcon.elevation = 20; // Setter

    expectTypeOf(myControlIcon.applyRenderFlags()).toBeVoid();
    expectTypeOf(myControlIcon.draw()).toEqualTypeOf<Promise<ControlIcon>>();
    expectTypeOf(myControlIcon.refresh()).toBeVoid();

    expectTypeOf(myControlIcon.destroy()).toBeVoid();
    expectTypeOf(myControlIcon.destroy(true)).toBeVoid();
    expectTypeOf(myControlIcon.destroy({ children: true })).toBeVoid();
  });

  test("Deprecated (until v16)", () => {
    /* eslint-disable @typescript-eslint/no-deprecated -- deliberately testing deprecated members */
    expectTypeOf(myControlIcon.iconSrc).toEqualTypeOf<PIXI.Texture | string>();
    expectTypeOf(myControlIcon.rect).toEqualTypeOf<[number, number, number, number]>();
    expectTypeOf(myControlIcon.borderColor).toEqualTypeOf<PIXI.ColorSource>();
    expectTypeOf(myControlIcon.tintColor).toEqualTypeOf<PIXI.ColorSource>();

    expectTypeOf(
      myControlIcon.refresh({
        visible: true,
        iconColor: 0xdeadea,
        borderColor: 0xff0000,
        borderVisible: true,
      }),
    ).toEqualTypeOf<ControlIcon>();
    expectTypeOf(
      myControlIcon.refresh({
        visible: undefined,
        iconColor: undefined,
        borderColor: undefined,
        borderVisible: undefined,
      }),
    ).toEqualTypeOf<ControlIcon>();
    /* eslint-enable @typescript-eslint/no-deprecated */
  });
});
