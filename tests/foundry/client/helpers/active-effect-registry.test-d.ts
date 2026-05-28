import { expectTypeOf } from "vitest";

import ActiveEffectRegistry = foundry.helpers.ActiveEffectRegistry;

const registry = new ActiveEffectRegistry();

expectTypeOf(registry.initialized).toEqualTypeOf<boolean>();
expectTypeOf(registry._initialize()).toEqualTypeOf<void>();

declare const effect: ActiveEffect.Implementation;
expectTypeOf(registry.add(effect)).toEqualTypeOf<ActiveEffectRegistry>();
expectTypeOf(registry.has(effect)).toEqualTypeOf<boolean>();

declare const actor: Actor.Implementation;
expectTypeOf(registry.addFromParent(actor)).toEqualTypeOf<ActiveEffectRegistry>();
expectTypeOf(registry.deleteFromParent(actor)).toEqualTypeOf<boolean>();

expectTypeOf(registry.refresh("turnEnd")).toEqualTypeOf<Promise<void>>();
expectTypeOf(registry.refresh("turnEnd", { actors: new Set([actor]) })).toEqualTypeOf<Promise<void>>();
