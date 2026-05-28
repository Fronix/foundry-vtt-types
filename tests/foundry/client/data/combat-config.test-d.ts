import { expectTypeOf } from "vitest";

import CombatConfiguration = foundry.data.CombatConfiguration;

declare const cc: CombatConfiguration;
expectTypeOf(CombatConfiguration.CONFIG_SETTING).toEqualTypeOf<"combatTrackerConfig">();
expectTypeOf(cc.resource).toEqualTypeOf<string>();
expectTypeOf(cc.skipDefeated).toEqualTypeOf<boolean>();
expectTypeOf(cc.turnMarker).toEqualTypeOf<CombatConfiguration.TurnMarker>();
