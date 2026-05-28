import { expectTypeOf } from "vitest";

declare const scene: Scene.Implementation;
declare const token: TokenDocument.Implementation;
declare const myRegion: RegionDocument.Stored;

// Construction
new RegionDocument.implementation({ name: "Region" }, { parent: scene });

// @ts-expect-error `name` is required.
new RegionDocument.implementation({}, { parent: scene });

// Geometry getters
expectTypeOf(myRegion.isSingleShape).toEqualTypeOf<boolean>();
expectTypeOf(myRegion.polygons).toEqualTypeOf<ReadonlyArray<PIXI.Polygon>>();
expectTypeOf(myRegion.clipperPolyTree).toEqualTypeOf<ClipperLib.PolyTree>();
expectTypeOf(myRegion.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(myRegion.area).toEqualTypeOf<number>();

// `attachment.token` is resolved to the Token document at preparation time (not the id string).
expectTypeOf(myRegion.attachment.token).toEqualTypeOf<TokenDocument.Implementation | null>();

expectTypeOf(myRegion.tokens).toEqualTypeOf<ReadonlySet<TokenDocument.Implementation>>();

// Methods
expectTypeOf(myRegion.prepareBaseData()).toEqualTypeOf<void>();
expectTypeOf(myRegion.clampElevation(10)).toEqualTypeOf<number>();
expectTypeOf(myRegion.clampElevation(10, 2)).toEqualTypeOf<number>();
expectTypeOf(myRegion.updateShapeConstraints()).toEqualTypeOf<void>();
expectTypeOf(myRegion.updateShapeConstraints({ save: true })).toEqualTypeOf<void>();

// API methods
expectTypeOf(RegionDocument.createTokenEmanation(token, 5, { name: "Aura" })).toEqualTypeOf<
  Promise<RegionDocument.Implementation | void>
>();
expectTypeOf(myRegion.teleportToken(token)).toEqualTypeOf<Promise<TokenDocument.Implementation>>();
expectTypeOf(myRegion.teleportToken(token, { placement: "center", pan: true })).toEqualTypeOf<
  Promise<TokenDocument.Implementation>
>();
expectTypeOf(myRegion.teleportTokens([token])).toEqualTypeOf<
  Promise<Map<TokenDocument.Implementation, TokenDocument.Implementation>>
>();
expectTypeOf(myRegion.spawnTokens([{ name: "T" }])).toEqualTypeOf<Promise<TokenDocument.Implementation[]>>();
expectTypeOf(myRegion.spawnTokens([token], { create: false })).toEqualTypeOf<Promise<TokenDocument.Implementation[]>>();

expectTypeOf(myRegion.removeShapeDialog(0)).toEqualTypeOf<Promise<boolean>>();

// Deprecated shape accessor
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myRegion.regionShapes).toEqualTypeOf<foundry.data.regionShapes.RegionShape.Any[]>();

// Surface namespace type
declare const surface: RegionDocument.Surface;
expectTypeOf(surface.region).toEqualTypeOf<RegionDocument.Implementation>();
expectTypeOf(surface.elevation).toEqualTypeOf<number>();
expectTypeOf(surface.occlusion).toEqualTypeOf<boolean>();

await RegionDocument.create({ name: "Region" }, { parent: scene });
