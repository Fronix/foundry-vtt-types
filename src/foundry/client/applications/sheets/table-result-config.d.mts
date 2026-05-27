import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TableResultConfig: TableResultConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single TableResult document within a parent RollTable.
 */
declare class TableResultConfig<
  RenderContext extends TableResultConfig.RenderContext = TableResultConfig.RenderContext,
  Configuration extends TableResultConfig.Configuration = TableResultConfig.Configuration,
  RenderOptions extends TableResultConfig.RenderOptions = TableResultConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  TableResult.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * TableResult types with localized labels
   */
  static get RESULT_TYPES(): TableResultConfig.ResultTypeChoice[];

  /**
   * Prepare the update data of a single TableResult document to ensure joint validation.
   * @param data - The TableResult update data
   */
  static prepareResultUpdateData(data: DeepPartial<TableResult.Source>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace TableResultConfig {
  interface Any extends AnyTableResultConfig {}
  interface AnyConstructor extends Identity<typeof AnyTableResultConfig> {}

  interface ResultTypeChoice {
    value: string;
    label: string;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<TableResult.Implementation> {
    types: ResultTypeChoice[];
    resultDocument: foundry.abstract.Document.Any | null;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<TableResult.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyTableResultConfig extends TableResultConfig<
  TableResultConfig.RenderContext,
  TableResultConfig.Configuration,
  TableResultConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TableResultConfig;
