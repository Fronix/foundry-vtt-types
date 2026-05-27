import { expectTypeOf } from "vitest";

import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;

declare const config: PlaceableConfig<DrawingDocument.Implementation>;

expectTypeOf(config.document).toEqualTypeOf<DrawingDocument.Implementation>();
expectTypeOf(PlaceableConfig.DEFAULT_OPTIONS).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf<PlaceableConfig.Configuration<DrawingDocument.Implementation>["preview"]>().toEqualTypeOf<boolean>();
expectTypeOf<PlaceableConfig.RenderContext<DrawingDocument.Implementation>["gridUnits"]>().toEqualTypeOf<string>();
expectTypeOf<PlaceableConfig.RenderContext<DrawingDocument.Implementation>["selectableLevels"]>().toEqualTypeOf<
  { value: string; label: string }[]
>();
