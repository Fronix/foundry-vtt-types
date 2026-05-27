import { expectTypeOf } from "vitest";

import MeasuredTemplateConfig = foundry.applications.sheets.MeasuredTemplateConfig;

declare const doc: MeasuredTemplateDocument.Implementation;
const config = new MeasuredTemplateConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<MeasuredTemplateDocument.Implementation>();
expectTypeOf<MeasuredTemplateConfig.RenderContext["templateTypes"]>().toEqualTypeOf<{
  circle: string;
  cone: string;
  rect: string;
  ray: string;
}>();
