import { expectTypeOf } from "vitest";

import Compendium = foundry.applications.sidebar.apps.Compendium;

declare const pack: Compendium<Item.ImplementationClass>;
expectTypeOf(pack.isPopout).toEqualTypeOf<boolean>();
expectTypeOf(pack.title).toEqualTypeOf<string>();
expectTypeOf(pack.documentClass).toEqualTypeOf<Item.ImplementationClass>();
expectTypeOf(pack).toExtend<foundry.applications.sidebar.DocumentDirectory<Item.ImplementationClass>>();
