import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "./sidebar-tab.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentDirectory: DocumentDirectory.Any;
    }
  }
}

/**
 * An abstract class for rendering a foldered directory of Documents.
 */
declare class DocumentDirectory<
  DocumentClass extends Document.AnyConstructor = Document.AnyConstructor,
  RenderContext extends DocumentDirectory.RenderContext = DocumentDirectory.RenderContext,
  Configuration extends DocumentDirectory.Configuration = DocumentDirectory.Configuration,
  RenderOptions extends DocumentDirectory.RenderOptions = DocumentDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The path to the template used to render a single entry within the directory.
   */
  protected static _entryPartial: string;

  /**
   * The path to the template used to render a single folder within the directory.
   */
  protected static _folderPartial: string;

  /**
   * The Document collection that this directory represents.
   */
  get collection(): foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed;

  /**
   * The implementation of the Document type that this directory represents.
   */
  get documentClass(): DocumentClass;

  /**
   * The named Document type that this directory represents.
   */
  get documentName(): string;

  override get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  /**
   * Determine if the current user has permission to create directory entries.
   */
  protected _canCreateEntry(): boolean;

  /**
   * Determine if the current user has permission to create folders in this directory.
   */
  protected _canCreateFolder(): boolean;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Register context menu entries and fire hooks.
   */
  protected _createContextMenus(): void;

  /**
   * Get context menu entries for entries in this directory.
   */
  protected _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /**
   * Prepares the data for a duplicated Document.
   * @param document - The Document that is duplicated
   * @returns The partial data of the duplicate that overrides the original data
   */
  protected _prepareDuplicateData(document: Document.Any): object;

  /**
   * Get context menu entries for folders in this directory.
   */
  protected _getFolderContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the directory part.
   */
  protected _prepareDirectoryContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the footer part.
   */
  protected _prepareFooterContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the header part.
   */
  protected _prepareHeaderContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * Collapse all open folders in this directory.
   */
  collapseAll(): void;

  /**
   * Handle activating a directory entry.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: { _skipDeprecation?: boolean },
  ): Promise<void>;

  /**
   * Handle creating a new entry in this directory.
   */
  protected _onCreateEntry(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle creating a new folder in this directory.
   */
  protected _onCreateFolder(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle toggling a folder's expanded state.
   */
  protected _onToggleFolder(event: PointerEvent, target: HTMLElement, options?: { _skipDeprecation?: boolean }): void;

  /**
   * Handle matching a given directory entry with the search filter.
   */
  protected _onMatchSearchEntry(query: string, entryIds: Set<string>, element: HTMLElement, options?: object): void;

  /**
   * Handle directory searching and filtering.
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Identify entries in the collection which match a provided search query.
   */
  protected _matchSearchEntries(
    query: RegExp,
    entryIds: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: object,
  ): void;

  /**
   * Identify folders in the collection which match a provided search query.
   */
  protected _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: object,
  ): void;

  /**
   * Determine if drop operations are permitted.
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * Determine if drag operations are permitted.
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Create a new entry in this directory from one that was dropped on it.
   */
  protected _createDroppedEntry(entry: Document.Any, updates?: object): Promise<Document.Any>;

  /**
   * Import a dropped folder and its children into this collection if they do not already exist.
   */
  protected _createDroppedFolderContent(
    folder: Folder.Implementation,
    targetFolder?: Folder.Implementation,
  ): Promise<Folder.Implementation[]>;

  /**
   * Create a set of documents in a dropped folder.
   */
  protected _createDroppedFolderDocuments(folder: Folder.Implementation, documents: object[]): Promise<void>;

  /**
   * Test if the given entry is already present in this directory.
   */
  protected _entryAlreadyExists(entry: Document.Any): boolean;

  /**
   * Determine whether a given directory entry belongs to the given folder.
   */
  protected _entryBelongsToFolder(entry: Document.Any, folder: string): boolean;

  /**
   * Get the entry instance from its dropped data.
   */
  protected _getDroppedEntryFromData(data: object): Promise<Document.Any>;

  /**
   * Get drag data for an entry in this directory.
   */
  protected _getEntryDragData(entryId: string): object;

  /**
   * Get drag data for a folder in this directory.
   */
  protected _getFolderDragData(folderId: string): object;

  /**
   * Handle dropping a new entry into this directory.
   */
  protected _handleDroppedEntry(target: HTMLElement, data: object): Promise<void>;

  /**
   * Handle dropping a folder onto the directory.
   */
  protected _handleDroppedFolder(target: HTMLElement, data: object): Promise<void>;

  /**
   * Handle importing a new folder into the directory.
   */
  protected _handleDroppedForeignFolder(
    folder: Folder.Implementation,
    closestFolderId: string,
    sortData: object,
  ): Promise<{ folder: Folder.Implementation; sortNeeded: boolean } | null>;

  /**
   * Highlight folders as drop targets when a drag event enters or exits their area.
   */
  protected _onDragHighlight(event: DragEvent): void;

  /**
   * Handle drag events over the directory.
   */
  protected _onDragOver(event: DragEvent): void;

  protected _onDragStart(event: DragEvent): void;

  protected _onDrop(event: DragEvent): void;

  /**
   * Organize a dropped folder and its children into a list of folders and documents to create.
   */
  protected _organizeDroppedFoldersAndDocuments(
    folder: Folder.Implementation,
    targetFolder?: Folder.Implementation,
  ): { foldersToCreate: object[]; documentsToCreate: object[] };

  /**
   * Get context menu entries for folders in a directory.
   * @internal
   */
  static _getFolderContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /**
   * Helper method to handle dropping a folder onto the directory.
   * @internal
   */
  static _handleDroppedFolder(
    target: HTMLElement,
    data: object,
    config: {
      folders: Folder.Implementation[];
      label: string;
      maxFolderDepth: number;
      type: string;
    },
  ): Promise<{ closestFolderId?: string; folder: Folder.Implementation; sortData: object; foreign?: boolean } | void>;

  /**
   * @deprecated since v13 until v15 - use {@linkcode DocumentDirectory._onClickEntry} instead.
   */
  protected _onClickEntryName(event: PointerEvent): void;

  /**
   * @deprecated since v13 until v15 - use {@linkcode DocumentDirectory._onToggleFolder} instead.
   */
  protected _toggleFolder(event: PointerEvent): void;
}

declare namespace DocumentDirectory {
  interface Any extends AnyDocumentDirectory {}
  interface AnyConstructor extends Identity<typeof AnyDocumentDirectory> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    documentName: string;
    folderIcon: string;
    sidebarIcon: string;
    canCreateEntry: boolean;
    canCreateFolder: boolean;
  }

  interface Configuration<DocumentDirectory extends DocumentDirectory.Any = DocumentDirectory.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<DocumentDirectory> {
    /** The Document collection that this directory represents. */
    collection: foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed;

    /** Updating one of these properties of a displayed Document will trigger a re-render of the tab. */
    renderUpdateKeys: string[];
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DocumentDirectory extends DocumentDirectory.Any = DocumentDirectory.Any> = DeepPartial<
    Configuration<DocumentDirectory>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyDocumentDirectory extends DocumentDirectory<
  Document.AnyConstructor,
  DocumentDirectory.RenderContext,
  DocumentDirectory.Configuration,
  DocumentDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentDirectory;
