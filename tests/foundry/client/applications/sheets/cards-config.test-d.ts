import { expectTypeOf } from "vitest";

import CardsConfig = foundry.applications.sheets.CardsConfig;
import CardDeckConfig = foundry.applications.sheets.CardDeckConfig;
import CardHandConfig = foundry.applications.sheets.CardHandConfig;
import CardPileConfig = foundry.applications.sheets.CardPileConfig;

declare const doc: Cards.Implementation;
const config = new CardsConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Cards.Implementation>();
expectTypeOf(CardsConfig.DEFAULT_OPTIONS).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf<CardsConfig.RenderContext["inCompendium"]>().toEqualTypeOf<boolean>();
expectTypeOf<CardsConfig.SortMode>().toEqualTypeOf<"standard" | "shuffled">();

// Subclasses extend the base.
expectTypeOf(new CardDeckConfig({ document: doc })).toExtend<CardsConfig>();
expectTypeOf(new CardHandConfig({ document: doc })).toExtend<CardsConfig>();
expectTypeOf(new CardPileConfig({ document: doc })).toExtend<CardsConfig>();
expectTypeOf(CardDeckConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
