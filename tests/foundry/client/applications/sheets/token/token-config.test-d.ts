import { expectTypeOf } from "vitest";

import TokenConfig = foundry.applications.sheets.TokenConfig;

declare const doc: TokenDocument.Implementation;
const config = new TokenConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(config.token).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(config.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(config.isPrototype).toEqualTypeOf<boolean>();
expectTypeOf(config.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(config).toExtend<foundry.applications.sheets.PlaceableConfig<TokenDocument.Implementation>>();
expectTypeOf(TokenConfig.DISPLAY_MODES).toEqualTypeOf<Record<string, string>>();
expectTypeOf(TokenConfig.TOKEN_SHAPES).toEqualTypeOf<Record<string, string>>();
