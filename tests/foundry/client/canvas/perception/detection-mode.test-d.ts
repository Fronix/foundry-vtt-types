import { describe, expectTypeOf, test } from "vitest";

import DetectionMode = foundry.canvas.perception.DetectionMode;
import PointVisionSource = foundry.canvas.sources.PointVisionSource;
import Token = foundry.canvas.placeables.Token;
import CanvasVisibility = foundry.canvas.groups.CanvasVisibility;

declare const visionSource: PointVisionSource.Initialized;
declare const token: Token.Implementation;
declare const level: Level.Implementation;

describe("DetectionMode tests", () => {
  const source = {
    id: "foo",
    label: "bar",
    type: DetectionMode.DETECTION_TYPES.OTHER,
    angle: false,
    walls: true,
    tokenConfig: false,
  } satisfies DetectionMode.CreateData;

  // `level` is FIXME-typed `object` until the v14 `Level` document exists (Phase 7)
  const visibilityTests = [
    {
      los: new Map([[visionSource, true]]),
      level: {},
      point: { x: 50, y: 50, elevation: 20 },
      // deprecated since v13 until v15 (use the point's elevation instead)
      elevation: 20,
    },
    {
      los: new Map([[visionSource, true]]),
      level: {},
      point: { x: 200, y: 300, elevation: -5 },
    },
  ] satisfies CanvasVisibility.Test[];

  const dmData = {
    enabled: true,
    range: 600,
  } satisfies TokenDocument.DetectionModeData;

  test("Construction", () => {
    new DetectionMode();
    new DetectionMode(source);
  });

  const myDetectionMode = new DetectionMode(source);

  test("Miscellaneous", () => {
    expectTypeOf(DetectionMode.getDetectionFilter()).toEqualTypeOf<PIXI.Filter | undefined>();
    expectTypeOf(DetectionMode.DETECTION_TYPES).toExtend<
      Record<keyof DetectionMode.DetectionTypes, DetectionMode.DETECTION_TYPES>
    >();
    expectTypeOf(DetectionMode.BASIC_MODE_ID).toEqualTypeOf<"basicSight">();
  });

  test("Schema properties", () => {
    expectTypeOf(myDetectionMode.id).toEqualTypeOf<string | undefined>();
    expectTypeOf(myDetectionMode.label).toEqualTypeOf<string | undefined>();
    expectTypeOf(myDetectionMode.tokenConfig).toBeBoolean();
    expectTypeOf(myDetectionMode.walls).toBeBoolean();
    expectTypeOf(myDetectionMode.angle).toBeBoolean();
    expectTypeOf(myDetectionMode.type).toEqualTypeOf<DetectionMode.DETECTION_TYPES>();
  });

  test("Visibility Testing", () => {
    // `level` on the config is FIXME-typed `object` until the v14 `Level` document exists (Phase 7)
    expectTypeOf(
      myDetectionMode.testVisibility(
        visionSource,
        { enabled: true, range: 3 },
        { object: token, tests: visibilityTests, level: {} },
      ),
    ).toBeBoolean();
    expectTypeOf(
      myDetectionMode.testVisibility(visionSource, dmData, { object: null, tests: visibilityTests, level: {} }),
    ).toBeBoolean();
    expectTypeOf(
      myDetectionMode.testVisibility(visionSource, dmData, { object: undefined, tests: visibilityTests, level: {} }),
    ).toBeBoolean();

    expectTypeOf(myDetectionMode["_canDetect"](visionSource, token, level)).toBeBoolean();
    expectTypeOf(myDetectionMode["_testPoint"](visionSource, dmData, token, visibilityTests[0]!)).toBeBoolean();
    expectTypeOf(myDetectionMode["_testLOS"](visionSource, dmData, token, visibilityTests[0]!)).toBeBoolean();
    expectTypeOf(myDetectionMode["_testAngle"](visionSource, dmData, token, visibilityTests[0]!)).toBeBoolean();
    expectTypeOf(myDetectionMode["_testRange"](visionSource, dmData, token, visibilityTests[0]!)).toBeBoolean();

    // Static `_testCollision` (new in v14): config-form and los-form third argument
    expectTypeOf(
      DetectionMode["_testCollision"](visionSource, { point: visibilityTests[0]!.point }, { type: "sight" }),
    ).toBeBoolean();
  });

  test("Deprecated", () => {
    // Deprecated since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    expectTypeOf(myDetectionMode.BASIC_MODE_ID).toEqualTypeOf<"basicSight">();
  });
});
