import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntryPageSheet: JournalEntryPageSheet.Any;
    }
  }
}

/**
 * An abstract Application responsible for displaying and editing a single JournalEntryPage Document.
 */
declare class JournalEntryPageSheet<
  RenderContext extends JournalEntryPageSheet.RenderContext = JournalEntryPageSheet.RenderContext,
  Configuration extends JournalEntryPageSheet.Configuration = JournalEntryPageSheet.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends DocumentSheetV2<JournalEntryPage.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override readonly emittedEvents: string[];

  /**
   * The table of contents for this text page.
   */
  toc: Record<string, JournalEntryPage.JournalEntryPageHeading>;

  /**
   * Indicates that the sheet renders with App V2 rather than V1.
   */
  static isV2: boolean;

  /**
   * Indicates that the sheet renders with App V2 rather than V1.
   */
  isV2: boolean;

  /**
   * Whether the sheet is in view mode.
   */
  get isView(): boolean;

  /**
   * The JournalEntryPage for this sheet.
   */
  get page(): JournalEntryPage.Implementation;

  protected override _insertElement(element: HTMLElement): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare heading level choices.
   */
  protected _prepareHeadingLevels(): Record<string, string>;

  /**
   * Actions performed when this sheet is closed in some parent view.
   */
  protected _onCloseView(): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;
}

declare namespace JournalEntryPageSheet {
  interface Any extends AnyJournalEntryPageSheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntryPageSheet> {}

  interface RenderContext extends DocumentSheetV2.RenderContext<JournalEntryPage.Implementation> {
    name: JournalEntryPage.Implementation["name"];
    title: JournalEntryPage.Implementation["title"];
    uuid: JournalEntryPage.Implementation["uuid"];
  }

  interface Configuration extends DocumentSheetV2.Configuration<JournalEntryPage.Implementation> {
    /** Whether the sheet includes additional table of contents elements besides its title. */
    includeTOC: boolean;

    /** Whether the sheet is in edit or view mode. */
    mode: "edit" | "view";

    /** Classes appended to the page's root element when embedded in another sheet in view mode. */
    viewClasses: string[];
  }

  interface RenderOptions extends DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyJournalEntryPageSheet extends JournalEntryPageSheet<
  JournalEntryPageSheet.RenderContext,
  JournalEntryPageSheet.Configuration,
  JournalEntryPageSheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntryPageSheet;
