import { expectTypeOf } from "vitest";

import UIConfig = foundry.applications.settings.menus.UIConfig;

expectTypeOf(UIConfig.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
expectTypeOf<UIConfig.GameUIConfiguration["chatNotifications"]>().toEqualTypeOf<"cards" | "pip">();
expectTypeOf<UIConfig.RenderContext["setting"]>().toEqualTypeOf<UIConfig.GameUIConfiguration>();
