import { expectTypeOf } from "vitest";

import behaviors = foundry.data.regionBehaviors;

declare const apply: behaviors.ApplyActiveEffectRegionBehaviorType;
expectTypeOf(apply.effects.size).toEqualTypeOf<number>();

declare const changeLevel: behaviors.ChangeLevelRegionBehaviorType;
expectTypeOf(changeLevel.movementActions).toEqualTypeOf<Set<string>>();

declare const surface: behaviors.DefineSurfaceRegionBehaviorType;
expectTypeOf(surface.light).toEqualTypeOf<boolean>();
expectTypeOf(surface.exposure).toEqualTypeOf<boolean>();
expectTypeOf(surface.darkness).toEqualTypeOf<boolean>();

declare const movementCost: behaviors.ModifyMovementCostRegionBehaviorType;
expectTypeOf(movementCost.difficulties).toBeObject();

// All are RegionBehaviorType subtypes registrable on CONFIG
CONFIG.RegionBehavior.dataModels["applyActiveEffect"] = behaviors.ApplyActiveEffectRegionBehaviorType;
CONFIG.RegionBehavior.dataModels["changeLevel"] = behaviors.ChangeLevelRegionBehaviorType;
CONFIG.RegionBehavior.dataModels["defineSurface"] = behaviors.DefineSurfaceRegionBehaviorType;
CONFIG.RegionBehavior.dataModels["modifyMovementCost"] = behaviors.ModifyMovementCostRegionBehaviorType;
