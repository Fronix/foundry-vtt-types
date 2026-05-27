import { expectTypeOf } from "vitest";

import TileConfig = foundry.applications.sheets.TileConfig;

declare const doc: TileDocument.Implementation;
const config = new TileConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(config).toExtend<foundry.applications.sheets.PlaceableConfig<TileDocument.Implementation>>();
expectTypeOf<TileConfig.RenderContext["tabClasses"]>().toEqualTypeOf<string>();
