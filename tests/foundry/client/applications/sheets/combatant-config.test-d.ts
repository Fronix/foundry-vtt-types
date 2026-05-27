import { expectTypeOf } from "vitest";

import CombatantConfig = foundry.applications.sheets.CombatantConfig;

declare const doc: Combatant.Implementation;
const config = new CombatantConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Combatant.Implementation>();
expectTypeOf(config.title).toEqualTypeOf<string>();
expectTypeOf<CombatantConfig.RenderContext["buttons"]>().toEqualTypeOf<
  foundry.applications.api.ApplicationV2.FormFooterButton[]
>();
