import { expectTypeOf } from "vitest";

import Settings = foundry.applications.sidebar.tabs.Settings;

expectTypeOf(Settings.tabName).toEqualTypeOf<string>();
expectTypeOf<Settings.RenderContext["system"]>().toEqualTypeOf<foundry.packages.System>();
expectTypeOf<Settings.RenderContext["coreUpdate"]>().toEqualTypeOf<string | null>();
expectTypeOf<Settings.RenderContext["issues"]>().toEqualTypeOf<number>();
