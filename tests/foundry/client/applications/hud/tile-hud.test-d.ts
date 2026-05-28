import { expectTypeOf } from "vitest";

import TileHUD = foundry.applications.hud.TileHUD;
import Tile = foundry.canvas.placeables.Tile;

declare const hud: TileHUD;

expectTypeOf(hud.object).toEqualTypeOf<Tile.Implementation>();
expectTypeOf<TileHUD.RenderContext["isVideo"]>().toEqualTypeOf<boolean>();
expectTypeOf<TileHUD.RenderContext["videoIcon"]>().toEqualTypeOf<string>();
