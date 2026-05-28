import { expectTypeOf } from "vitest";

import DiceConfig = foundry.applications.settings.menus.DiceConfig;

expectTypeOf(DiceConfig.SETTING).toEqualTypeOf<"diceConfiguration">();
expectTypeOf<DiceConfig.RenderContext["defaultMethod"]>().toEqualTypeOf<string>();
expectTypeOf<DiceConfig.RenderContext["methods"]>().toEqualTypeOf<{ value: string; label: string }[]>();
