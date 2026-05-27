import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MeasuredTemplateConfig: MeasuredTemplateConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single MeasuredTemplate document within a parent Scene.
 * @remarks Deprecated since v14 — the MeasuredTemplate document has been merged into the functionality of the
 * Region document. (A `@deprecated` tag is intentionally avoided here: it would make `@typescript-eslint/no-deprecated`
 * flag every internal self-reference in this file.)
 */
declare class MeasuredTemplateConfig<
  RenderContext extends MeasuredTemplateConfig.RenderContext = MeasuredTemplateConfig.RenderContext,
  Configuration extends MeasuredTemplateConfig.Configuration = MeasuredTemplateConfig.Configuration,
  RenderOptions extends MeasuredTemplateConfig.RenderOptions = MeasuredTemplateConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  MeasuredTemplateDocument.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;
}

declare namespace MeasuredTemplateConfig {
  interface Any extends AnyMeasuredTemplateConfig {}
  interface AnyConstructor extends Identity<typeof AnyMeasuredTemplateConfig> {}

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<MeasuredTemplateDocument.Implementation> {
    templateTypes: { circle: string; cone: string; rect: string; ray: string };
    units: { degrees: string; gridUnits: string; pixels: string };
    userColor: foundry.utils.Color;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends
      HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<MeasuredTemplateDocument.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyMeasuredTemplateConfig extends MeasuredTemplateConfig<
  MeasuredTemplateConfig.RenderContext,
  MeasuredTemplateConfig.Configuration,
  MeasuredTemplateConfig.RenderOptions
> {
  constructor(...args: never);
}
export default MeasuredTemplateConfig;
