import { expectTypeOf } from "vitest";

import CombatTracker = foundry.applications.sidebar.tabs.CombatTracker;

declare const tracker: CombatTracker;
expectTypeOf(tracker.combats).toEqualTypeOf<Combat.Stored[]>();
expectTypeOf(tracker.viewed).toEqualTypeOf<Combat.Stored | null>();
expectTypeOf(tracker.scene).toEqualTypeOf<Scene.Stored | null>();
expectTypeOf<CombatTracker.TurnContext["initiative"]>().toEqualTypeOf<number | null>();
