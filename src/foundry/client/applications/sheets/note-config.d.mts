import type { DeepPartial, Identity } from "#utils";
import type PlaceableConfig from "./placeable-config.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      NoteConfig: NoteConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Note document within a parent Scene.
 */
declare class NoteConfig<
  RenderContext extends NoteConfig.RenderContext = NoteConfig.RenderContext,
  Configuration extends NoteConfig.Configuration = NoteConfig.Configuration,
  RenderOptions extends NoteConfig.RenderOptions = NoteConfig.RenderOptions,
> extends PlaceableConfig<NoteDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _previewChanges(changes: object): void;
}

declare namespace NoteConfig {
  interface Any extends AnyNoteConfig {}
  interface AnyConstructor extends Identity<typeof AnyNoteConfig> {}

  /** Icon-selection context for the Note. */
  interface IconContext {
    selected: string;
    custom: string;
    field: foundry.data.fields.StringField;
  }

  interface RenderContext extends PlaceableConfig.RenderContext<NoteDocument.Implementation> {
    author: string;
    entries: { value: string; label: string }[];
    entry: JournalEntry.Implementation | null;
    pages: Record<string, string>;
    global: boolean;
    icon: IconContext;
    fontFamilies: Record<string, string>;
    textAnchors: Record<number, string>;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends PlaceableConfig.Configuration<NoteDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyNoteConfig extends NoteConfig<
  NoteConfig.RenderContext,
  NoteConfig.Configuration,
  NoteConfig.RenderOptions
> {
  constructor(...args: never);
}

export default NoteConfig;
