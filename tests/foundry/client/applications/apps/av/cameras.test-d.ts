import { expectTypeOf } from "vitest";

import CameraViews = foundry.applications.apps.av.CameraViews;

declare const views: CameraViews;

expectTypeOf(views.hidden).toEqualTypeOf<boolean>();
expectTypeOf(views.isHorizontal).toEqualTypeOf<boolean>();
expectTypeOf(views.popouts).toEqualTypeOf<foundry.applications.apps.av.CameraPopout[]>();
expectTypeOf(views.users).toEqualTypeOf<Record<string, CameraViews.UserContext>>();
expectTypeOf(views.getUserCameraView("x")).toEqualTypeOf<HTMLElement | null>();
expectTypeOf<CameraViews.UserContext["user"]>().toEqualTypeOf<User.Stored>();
