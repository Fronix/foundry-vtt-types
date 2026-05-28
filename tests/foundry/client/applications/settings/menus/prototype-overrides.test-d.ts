import { expectTypeOf } from "vitest";

import PrototypeOverridesConfig = foundry.applications.settings.menus.PrototypeOverridesConfig;

declare const config: PrototypeOverridesConfig;
expectTypeOf(config.tabGroups).toEqualTypeOf<Record<string, string>>();
expectTypeOf<PrototypeOverridesConfig.RenderContext["booleanOptions"]>().toEqualTypeOf<{
  true: string;
  false: string;
}>();
