import { expectTypeOf } from "vitest";

import WallConfig = foundry.applications.sheets.WallConfig;

declare const doc: WallDocument.Implementation;
const config = new WallConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<WallDocument.Implementation>();
expectTypeOf<WallConfig.RenderContext["coordinates"]>().toEqualTypeOf<string>();
expectTypeOf<WallConfig.RenderContext["thresholdFields"]>().toEqualTypeOf<WallConfig.ThresholdField[]>();
