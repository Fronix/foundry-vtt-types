import { expectTypeOf } from "vitest";

import CameraPopout = foundry.applications.apps.av.CameraPopout;

declare const popout: CameraPopout;

expectTypeOf(popout.user).toEqualTypeOf<User.Stored>();
expectTypeOf<CameraPopout.Configuration["user"]>().toEqualTypeOf<User.Stored>();
