import { expectTypeOf } from "vitest";

import ActiveEffectConfig = foundry.applications.sheets.ActiveEffectConfig;

declare const effect: ActiveEffect.Implementation;
const config = new ActiveEffectConfig({ document: effect });

expectTypeOf(config.document).toEqualTypeOf<ActiveEffect.Implementation>();

expectTypeOf(
  ActiveEffectConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(ActiveEffectConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(ActiveEffectConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

expectTypeOf<ActiveEffectConfig.RenderChangeContext["change"]>().toEqualTypeOf<ActiveEffect.ChangeData>();
expectTypeOf<ActiveEffectConfig.RenderChangeContext["changeTypes"]>().toEqualTypeOf<Record<string, string>>();
