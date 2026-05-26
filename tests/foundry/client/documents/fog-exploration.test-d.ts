import { expectTypeOf } from "vitest";

new FogExploration.implementation();
new FogExploration.implementation({});

declare const scene: string;
declare const user: string;

expectTypeOf(FogExploration.load()).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({})).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({ user })).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({ scene })).toEqualTypeOf<Promise<FogExploration.Stored | null>>();
expectTypeOf(FogExploration.load({ scene, user }, {})).toEqualTypeOf<Promise<FogExploration.Stored | null>>();

// v14: `load` also accepts the Scene/User documents directly (normalized to their `id`).
declare const sceneDoc: Scene.Implementation;
declare const userDoc: User.Implementation;
expectTypeOf(FogExploration.load({ scene: sceneDoc, user: userDoc })).toEqualTypeOf<
  Promise<FogExploration.Stored | null>
>();

const fogExploration = new FogExploration.implementation();
expectTypeOf(fogExploration).toEqualTypeOf<FogExploration.Implementation>();

expectTypeOf(fogExploration.getTexture()).toEqualTypeOf<PIXI.Texture | null>();
