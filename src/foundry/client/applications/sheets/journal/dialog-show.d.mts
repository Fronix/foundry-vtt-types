import type DialogV2 from "../../api/dialog.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ShowToPlayersDialog: ShowToPlayersDialog.Any;
    }
  }
}

/**
 * A dialog for configuring options when showing content to players.
 */
declare class ShowToPlayersDialog<
  RenderContext extends ShowToPlayersDialog.RenderContext = ShowToPlayersDialog.RenderContext,
  Configuration extends ShowToPlayersDialog.Configuration = ShowToPlayersDialog.Configuration,
  RenderOptions extends ShowToPlayersDialog.RenderOptions = ShowToPlayersDialog.RenderOptions,
> extends HandlebarsApplicationMixin(DialogV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DialogV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The Document that is being shown.
   */
  get document(): JournalEntry.Implementation | JournalEntryPage.Implementation;

  /**
   * Whether the Document that is being shown is an image-type JournalEntryPage.
   */
  get isImage(): boolean;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace ShowToPlayersDialog {
  interface Any extends AnyShowToPlayersDialog {}
  interface AnyConstructor extends Identity<typeof AnyShowToPlayersDialog> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, DialogV2.RenderContext {
    buttons: DialogV2.Button[];
    isImage: boolean;
    image: {
      only: foundry.data.fields.BooleanField;
      title: foundry.data.fields.BooleanField;
      caption: foundry.data.fields.BooleanField;
    };
    users: User.Implementation[];
    ownership: foundry.data.fields.NumberField;
    levels: { value: number; label: string }[];
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, DialogV2.Configuration {
    /** The Document that is being shown. */
    document: JournalEntry.Implementation | JournalEntryPage.Implementation;
  }

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DialogV2.RenderOptions {}
}

declare abstract class AnyShowToPlayersDialog extends ShowToPlayersDialog<
  ShowToPlayersDialog.RenderContext,
  ShowToPlayersDialog.Configuration,
  ShowToPlayersDialog.RenderOptions
> {
  constructor(...args: never);
}

export default ShowToPlayersDialog;
