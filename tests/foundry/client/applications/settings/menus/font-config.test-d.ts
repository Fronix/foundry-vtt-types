import { expectTypeOf } from "vitest";

import FontConfig = foundry.applications.settings.menus.FontConfig;

declare const config: FontConfig;
expectTypeOf(FontConfig.SETTING).toEqualTypeOf<"fonts">();
expectTypeOf(FontConfig.getAvailableFonts()).toEqualTypeOf<string[]>();
expectTypeOf(FontConfig.getAvailableFontChoices()).toEqualTypeOf<Record<string, string>>();
expectTypeOf(config.object).toEqualTypeOf<FontConfig.NewFontDefinition>();
