import { expectTypeOf } from "vitest";

declare const scene: foundry.documents.Scene;
const doc = new TokenDocument.implementation({}, { parent: scene });
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(doc.isOwner).toEqualTypeOf<boolean>();
expectTypeOf(doc.isLinked).toEqualTypeOf<boolean>();
expectTypeOf(doc.combatant).toEqualTypeOf<Combatant.Implementation | null>();
expectTypeOf(doc.inCombat).toEqualTypeOf<boolean>();
expectTypeOf(doc.clone()).toEqualTypeOf<TokenDocument.Implementation>();
expectTypeOf(doc.clone({}, { save: true })).toEqualTypeOf<Promise<TokenDocument.Stored | undefined>>();
expectTypeOf(doc.actor).toEqualTypeOf<Actor.Implementation | null>();

// Can't get more specific due to delta concerns
expectTypeOf(doc.getEmbeddedCollection("Item")).toEqualTypeOf<foundry.utils.Collection<Item.Implementation>>();
expectTypeOf(doc.getEmbeddedCollection("ActiveEffect")).toEqualTypeOf<
  foundry.utils.Collection<ActiveEffect.Implementation>
>();

// v14 additive members
expectTypeOf(doc.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(doc.isLazyDelta).toEqualTypeOf<boolean>();
expectTypeOf(doc._forceDeltaActor()).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(doc.attachments).toEqualTypeOf<Readonly<{ regions: ReadonlySet<RegionDocument.Implementation> }>>();
expectTypeOf(doc.regions).toEqualTypeOf<Set<RegionDocument.Implementation> | null>();
expectTypeOf(doc._returnedMovementPromises).toEqualTypeOf<Map<string, Promise<boolean>>>();
expectTypeOf(doc.includedInLevel("level-id")).toEqualTypeOf<boolean>();

expectTypeOf(doc.startMovement()).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.startMovement("movement-id")).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(doc.getOccupiedGridSpaceOffsets()).toEqualTypeOf<foundry.grid.BaseGrid.Offset3D[]>();

// Origin family
expectTypeOf(doc.getMovementOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(doc.getLightOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(doc.getVisionOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(doc.getSoundOrigin()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();
expectTypeOf(doc.getListenerPosition()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint>();

// Test-point family
expectTypeOf(doc.getContainmentTestPoints()).toEqualTypeOf<foundry.canvas.Canvas.Point[]>();
expectTypeOf(doc.getVisibilityTestPoints()).toEqualTypeOf<foundry.canvas.Canvas.ElevatedPoint[]>();
expectTypeOf(doc.getOcclusionTestPoints()).toEqualTypeOf<foundry.canvas.Canvas.Point[]>();

// Active-effect application
expectTypeOf(doc.applyActiveEffects("initial")).toEqualTypeOf<void>();
