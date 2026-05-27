import type { DeepPartial, ValueOf, Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type JournalEntryPageSheet from "./journal-entry-page-sheet.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntrySheet: JournalEntrySheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single JournalEntry Document.
 */
declare class JournalEntrySheet<
  RenderContext extends JournalEntrySheet.RenderContext = JournalEntrySheet.RenderContext,
  Configuration extends JournalEntrySheet.Configuration = JournalEntrySheet.Configuration,
  RenderOptions extends JournalEntrySheet.RenderOptions = JournalEntrySheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Icons for page ownership.
   */
  static OWNERSHIP_ICONS: Record<number, string>;

  /**
   * The available view modes for journal entries.
   */
  static VIEW_MODES: {
    SINGLE: 1;
    MULTIPLE: 2;
  };

  /**
   * The JournalEntry for this sheet.
   */
  get entry(): JournalEntry.Implementation;

  /**
   * Whether the sheet is in multi-page mode.
   */
  get isMultiple(): boolean;

  /**
   * Whether the journal is locked and disallows modifications to the table of contents.
   */
  get locked(): boolean;

  /**
   * Get the JournalEntry's current view mode.
   */
  get mode(): JournalEntrySheet.VIEW_MODES;

  /**
   * The currently active IntersectionObserver.
   */
  get observer(): IntersectionObserver;

  /**
   * The ID of the currently-viewed page.
   */
  get pageId(): string;

  /**
   * The index of the currently-viewed page in the list of available pages.
   */
  get pageIndex(): number;

  /**
   * The cached list of processed page entries.
   */
  protected _pages: Record<string, JournalEntrySheet.PageContext>;

  /**
   * The pages that are currently scrolled into view and marked as 'active' in the sidebar.
   */
  get pagesInView(): HTMLElement[];

  /**
   * Get the JournalEntry's current search mode.
   */
  get searchMode(): string;

  /**
   * The expanded state of the sidebar.
   */
  get sidebarExpanded(): boolean;

  override get title(): string;

  /**
   * Highlights the currently-viewed page in the sidebar.
   */
  protected _activatePagesInView(): void;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Get the set of ContextMenu options which should be used for journal entry pages in the sidebar.
   */
  protected _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _getHeaderControls(): ApplicationV2.HeaderControlsEntry[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare pages for display.
   */
  protected _preparePageData(): Record<string, JournalEntrySheet.PageContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the pages part.
   */
  protected _preparePagesContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the sidebar part.
   */
  protected _prepareSidebarContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare the sidebar table of contents.
   */
  protected _prepareTableOfContents(): Promise<JournalEntrySheet.TableOfContentsEntry[]>;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _replaceHTML(
    result: Record<string, HTMLElement>,
    content: HTMLElement,
    options: DeepPartial<RenderOptions>,
  ): void;

  /**
   * Add headings to the table of contents for the given node.
   * @param pageNode - The HTML node of the page's rendered contents.
   * @param toc      - The page's table of contents.
   */
  protected _renderHeadings(
    pageNode: HTMLElement,
    toc: Record<string, JournalEntryPage.JournalEntryPageHeading>,
  ): Promise<void>;

  /**
   * Update child views inside the main sheet.
   */
  protected _renderPageViews(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Render the page view for a page sheet.
   * @param element - The existing page element in the journal entry view.
   * @param sheet   - The page sheet.
   */
  protected _renderPageView(element: HTMLElement, sheet: JournalEntryPageSheet.Any): Promise<void>;

  /**
   * Update which page of the journal sheet should be currently rendered.
   * This can be controlled by options passed into the render method, or by subclass override.
   */
  protected _setCurrentPage(options?: DeepPartial<RenderOptions>): void;

  /**
   * If the set of active pages has changed, various elements in the sidebar will expand and collapse. For particularly
   * long ToCs, this can leave the scroll position of the sidebar in a seemingly random state. We try to do our best to
   * sync the sidebar scroll position with the current journal viewport.
   */
  protected _synchronizeSidebar(): void;

  /**
   * Update the disabled state of the previous and next page buttons.
   */
  protected _updateButtonState(): void;

  protected override _updateFrame(options: DeepPartial<RenderOptions>): void;

  protected override _tearDown(options: DeepPartial<ApplicationV2.ClosingOptions>): void;

  protected override _attachFrameListeners(): void;

  /**
   * Create an intersection observer to maintain a list of headings that are in view. This is much more performant than
   * calling getBoundingClientRect on all headings whenever we want to determine this list.
   */
  protected _observeHeadings(): void;

  /**
   * Create an intersection observer to maintain a list of pages that are in view.
   */
  protected _observePages(): void;

  /**
   * Handle clicking an image to pop it out for fullscreen view.
   * @param event - The triggering click event.
   */
  protected _onClickImage(event: PointerEvent): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Handle closing the context menu.
   * @param target - The element the context menu has been triggered for.
   */
  protected _onContextMenuClose(target: HTMLElement): void;

  /**
   * Handle opening the context menu.
   * @param target - The element the context menu has been triggered for.
   */
  protected _onContextMenuOpen(target: HTMLElement): void;

  /**
   * Handle editing one of the journal entry's pages.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onEditPage(event: PointerEvent | null, target: HTMLElement): void;

  /**
   * Handle new pages scrolling into view.
   * @param entries  - An array of element that have scrolled into or out of view.
   * @param observer - The IntersectionObserver that invoked this callback.
   */
  protected _onPageScroll(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;

  protected override _onRevealSecret(event: Event): void;

  /**
   * Handle journal entry search and filtering.
   * @param event - The keyboard input event.
   * @param query - The input search string.
   * @param rgx   - The regular expression query that should be matched against.
   * @param html  - The container to filter items from.
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Handle a request to show the JournalEntry to other Users.
   */
  protected _onShowPlayers(): void;

  /**
   * Prompt the user with a Dialog for creation of a new JournalEntryPage.
   */
  createPageDialog(): Promise<JournalEntryPage.Stored | null>;

  /**
   * Retrieve the sheet instance for rendering this page inline.
   * @param page - The page instance or its ID.
   */
  getPageSheet(page: JournalEntryPage.Implementation | string): JournalEntryPageSheet.Any;

  /**
   * Turn to a specific page.
   * @param pageId  - The ID of the page to turn to.
   * @param options - Additional options.
   */
  goToPage(pageId: string, options?: JournalEntrySheet.GoToPageOptions): void;

  /**
   * Determine whether a given page is visible to the current user.
   * @param page - The page.
   */
  isPageVisible(page: JournalEntryPage.Implementation): boolean;

  /**
   * Turn to the next page.
   */
  nextPage(): void;

  /**
   * Turn to the previous page.
   */
  previousPage(): void;

  /**
   * Toggle the search mode for this journal entry between name and full text search.
   */
  toggleSearchMode(): void;

  /**
   * Toggle the collapsed or expanded state of the sidebar.
   */
  toggleSidebar(): void;

  /**
   * Iterate over the JournalEntryPage documents which are currently visible in the sheet.
   */
  viewedPageDocuments(): Generator<JournalEntryPage.Implementation, void, undefined>;

  /**
   * Determine if drop operations are permitted.
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * Determine if drag operations are permitted.
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Handle drag operations.
   */
  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle drop operations.
   */
  protected _onDrop(event: DragEvent): Promise<void>;

  /**
   * @deprecated since v13 until v16.
   */
  _renderAppV1PageView(element: HTMLElement, sheet: unknown): Promise<void>;
}

declare namespace JournalEntrySheet {
  interface Any extends AnyJournalEntrySheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntrySheet> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<JournalEntry.Implementation> {
    mode: JournalEntrySheet.VIEW_MODES;
    viewMode: { label: string; icon: string; cls: string };
    pages?: PageContext[];
    toc?: TableOfContentsEntry[];
    expandMode?: { label: string; icon: string };
    searchMode?: { icon: string; label: string; placeholder?: string };
    lockMode?: { icon: string; label: string };
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<JournalEntry.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {
    /** Render the journal sheet at this page index. */
    pageIndex?: number | undefined;

    /** Render the journal sheet at the page with this ID. */
    pageId?: string | undefined;

    /** Render the journal sheet with the given page mode. */
    mode?: JournalEntrySheet.VIEW_MODES | undefined;

    /** Scroll to the specified heading in the given page. */
    anchor?: string | undefined;
  }

  /** Options for {@linkcode JournalEntrySheet.goToPage}. */
  interface GoToPageOptions {
    /** Optionally an anchor slug to focus within that page. */
    anchor?: string | undefined;
  }

  /** A single page entry prepared for rendering. */
  interface PageContext {
    /** The page ID. */
    id: string;

    /** Whether the current user is allowed to edit the page. */
    editable: boolean;

    /** Whether the page is currently hidden due to a search filter. */
    hidden: boolean;

    /** The class name for the page entry in the table of contents. */
    tocClass: string;

    /** The class name for the page entry in the pages view. */
    viewClass: string;

    /** The page title. */
    name: string;

    /** The page number in the table of contents. */
    number: number;

    /** The ownership icon for the page entry in the table of contents. */
    icon: string;

    /** The class name for the page's ownership level in the table of contents. */
    ownershipClass: string;

    /** The ID of the category this page belongs to, if any. */
    category?: string | undefined;

    /** The numeric sort value which orders this page relative to other pages in its category. */
    sort: number;

    /** Whether the page has not been assigned a category. */
    uncategorized?: boolean | undefined;
  }

  interface CategoryContext {
    /** The category ID. */
    id: string;

    /** The category name. */
    name: string;
  }

  /** A single entry in the sidebar table of contents: either a page or a category header. */
  type TableOfContentsEntry = PageContext | (CategoryContext & { isCategory: true });

  type VIEW_MODES = ValueOf<typeof JournalEntrySheet.VIEW_MODES>;
}

declare abstract class AnyJournalEntrySheet extends JournalEntrySheet<
  JournalEntrySheet.RenderContext,
  JournalEntrySheet.Configuration,
  JournalEntrySheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntrySheet;
