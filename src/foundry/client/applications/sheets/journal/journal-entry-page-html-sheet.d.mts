import type JournalEntryPageCodeMirrorSheet from "./journal-entry-page-code-mirror-sheet.d.mts";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type FormDataExtended from "../../ux/form-data-extended.d.mts";
import type { DeepPartial, Identity } from "#utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageHTMLSheet: JournalEntryPageHTMLSheet.Any;
    }
  }
}

/**
 * An Application responsible for displaying a single text-type JournalEntryPage Document, and editing it with an HTML
 * editor.
 */
declare class JournalEntryPageHTMLSheet<
  RenderContext extends JournalEntryPageHTMLSheet.RenderContext = JournalEntryPageHTMLSheet.RenderContext,
  Configuration extends JournalEntryPageHTMLSheet.Configuration = JournalEntryPageHTMLSheet.Configuration,
  RenderOptions extends JournalEntryPageHTMLSheet.RenderOptions = JournalEntryPageHTMLSheet.RenderOptions,
> extends JournalEntryPageCodeMirrorSheet<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override EDIT_PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContentContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;

  /**
   * Auto-format an HTML string.
   * @param html    - The HTML string.
   * @param options - Options to configure formatting.
   */
  static formatHTML(html: string, options?: JournalEntryPageHTMLSheet.FormatHTMLOptions): string;
}

declare namespace JournalEntryPageHTMLSheet {
  interface Any extends AnyJournalEntryPageHTMLSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageHTMLSheet> {}

  interface RenderContext extends JournalEntryPageCodeMirrorSheet.RenderContext {}
  interface Configuration extends JournalEntryPageCodeMirrorSheet.Configuration {}
  interface RenderOptions extends JournalEntryPageCodeMirrorSheet.RenderOptions {}

  /** Options for {@linkcode JournalEntryPageHTMLSheet.formatHTML}. */
  interface FormatHTMLOptions {
    /**
     * The number of spaces to indent by, or a string to use as indentation.
     * @defaultValue `4`
     */
    spaces?: string | number | undefined;
  }
}

declare abstract class AnyJournalEntryPageHTMLSheet extends JournalEntryPageHTMLSheet<
  JournalEntryPageHTMLSheet.RenderContext,
  JournalEntryPageHTMLSheet.Configuration,
  JournalEntryPageHTMLSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageHTMLSheet;
