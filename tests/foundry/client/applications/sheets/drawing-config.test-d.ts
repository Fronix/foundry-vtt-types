import { expectTypeOf } from "vitest";

import DrawingConfig = foundry.applications.sheets.DrawingConfig;

declare const doc: DrawingDocument.Implementation;
const config = new DrawingConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<DrawingDocument.Implementation>();
expectTypeOf(config).toExtend<foundry.applications.sheets.PlaceableConfig<DrawingDocument.Implementation>>();
expectTypeOf<DrawingConfig.RenderContext["userColor"]>().toEqualTypeOf<foundry.utils.Color>();
expectTypeOf(DrawingConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
