import { expectTypeOf } from "vitest";

import CardConfig = foundry.applications.sheets.CardConfig;

declare const doc: Card.Implementation;
const config = new CardConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Card.Implementation>();
expectTypeOf(CardConfig.TYPES).toEqualTypeOf<Record<string, string>>();
expectTypeOf(CardConfig.TABS).toEqualTypeOf<Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>>();
