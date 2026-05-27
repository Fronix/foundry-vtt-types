import { expectTypeOf } from "vitest";

import CombatTrackerConfig = foundry.applications.apps.CombatTrackerConfig;

expectTypeOf<CombatTrackerConfig.RenderContext["rootId"]>().toEqualTypeOf<string>();
expectTypeOf<CombatTrackerConfig.RenderContext["canConfigure"]>().toEqualTypeOf<boolean>();
expectTypeOf<CombatTrackerConfig.RenderContext["selectedTheme"]>().toEqualTypeOf<string>();
expectTypeOf(CombatTrackerConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
