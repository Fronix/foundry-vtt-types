import { expectTypeOf } from "vitest";

import PrototypeTokenConfig = foundry.applications.sheets.PrototypeTokenConfig;

declare const config: PrototypeTokenConfig;

expectTypeOf(config.token).toEqualTypeOf<foundry.data.PrototypeToken>();
expectTypeOf(config.actor).toEqualTypeOf<Actor.Implementation>();
expectTypeOf(config.isPrototype).toEqualTypeOf<boolean>();
expectTypeOf(config.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(config.title).toEqualTypeOf<string>();
