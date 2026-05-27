import type { AnyObject, DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActiveEffectConfig: ActiveEffectConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
 */
declare class ActiveEffectConfig<
  RenderContext extends ActiveEffectConfig.RenderContext = ActiveEffectConfig.RenderContext,
  Configuration extends ActiveEffectConfig.Configuration = ActiveEffectConfig.Configuration,
  RenderOptions extends ActiveEffectConfig.RenderOptions = ActiveEffectConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  ActiveEffect.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _attachFrameListeners(): void;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for a single change object.
   * @param context - Data for rendering the change row.
   */
  protected _renderChange(context: ActiveEffectConfig.RenderChangeContext): Promise<string>;

  /**
   * Prepare display context for the effect's start data.
   */
  protected _prepareStartContext(): Promise<AnyObject | null>;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  /**
   * Process submission data for a single change object.
   * @param change - The submitted change object with the value deserialized.
   * @param index  - The object's index in the submitted array.
   */
  protected _processChangeSubmission(change: ActiveEffect.ChangeData, index: number): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace ActiveEffectConfig {
  interface Any extends AnyActiveEffectConfig {}
  interface AnyConstructor extends Identity<typeof AnyActiveEffectConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<ActiveEffect.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<ActiveEffect.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}

  /** Context passed to {@linkcode ActiveEffectConfig._renderChange}. */
  interface RenderChangeContext {
    /** A copy of the change from the Effect's source array. */
    change: ActiveEffect.ChangeData;

    /** The change object's index in the array. */
    index: number;

    /** The defined fields of the change data. */
    fields: foundry.data.fields.DataSchema;

    /** The change type's default priority. */
    defaultPriority: number;

    /** All change types and their localized labels. */
    changeTypes: Record<string, string>;
  }
}

declare abstract class AnyActiveEffectConfig extends ActiveEffectConfig<
  ActiveEffectConfig.RenderContext,
  ActiveEffectConfig.Configuration,
  ActiveEffectConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ActiveEffectConfig;
