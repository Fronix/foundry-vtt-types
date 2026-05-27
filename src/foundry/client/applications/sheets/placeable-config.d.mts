import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaceableConfig: PlaceableConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a Placeable document within a parent Scene.
 */
declare class PlaceableConfig<
  ConcreteDocument extends Document.Any = Document.Any,
  RenderContext extends PlaceableConfig.RenderContext<ConcreteDocument> =
    PlaceableConfig.RenderContext<ConcreteDocument>,
  Configuration extends PlaceableConfig.Configuration<ConcreteDocument> =
    PlaceableConfig.Configuration<ConcreteDocument>,
  RenderOptions extends PlaceableConfig.RenderOptions = PlaceableConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<ConcreteDocument, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * The preview of this config.
   */
  protected _preview: ConcreteDocument | null;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void;

  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Initialize the preview.
   */
  protected _initializePreview(): Promise<void>;

  /**
   * Create the preview.
   * @param data - Additional data which overrides current document data at the time of creation
   */
  protected _createPreview(data?: object): Promise<ConcreteDocument>;

  /**
   * Destroy the preview.
   */
  protected _destroyPreview(): void;

  /**
   * Preview changes.
   * @param changes - The changes to preview.
   */
  protected _previewChanges(changes: object): void;

  /**
   * Reset the preview.
   */
  protected _resetPreview(): void;
}

declare namespace PlaceableConfig {
  interface Any extends AnyPlaceableConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaceableConfig> {}

  interface RenderContext<ConcreteDocument extends Document.Any>
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<ConcreteDocument> {
    document: ConcreteDocument;
    model: ConcreteDocument;
    source: object;
    gridUnits: string;
    selectableLevels: { value: string; label: string }[];
    inputs: {
      createMultiSelectInput: (field: foundry.data.fields.DataField.Any, config: object) => HTMLElement;
    };
  }

  interface Configuration<ConcreteDocument extends Document.Any>
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<ConcreteDocument> {
    /**
     * Whether to preview changes to the placeable on the canvas while the config is open.
     * @defaultValue `true`
     */
    preview: boolean;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyPlaceableConfig extends PlaceableConfig<
  Document.Any,
  PlaceableConfig.RenderContext<Document.Any>,
  PlaceableConfig.Configuration<Document.Any>,
  PlaceableConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaceableConfig;
