import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CompendiumDirectory: CompendiumDirectory.Any;
    }
  }
}

/**
 * The listing of compendiums available in the World.
 */
declare class CompendiumDirectory<
  RenderContext extends CompendiumDirectory.RenderContext = CompendiumDirectory.RenderContext,
  Configuration extends CompendiumDirectory.Configuration = CompendiumDirectory.Configuration,
  RenderOptions extends CompendiumDirectory.RenderOptions = CompendiumDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: AbstractSidebarTab.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override tabName: string;

  /**
   * The currently active filters.
   */
  get activeFilters(): Set<string>;

  /** Get context menu entries for Compendium packs in the directory. */
  protected _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /** Get context menu entries for filters in the directory. */
  protected _getFilterContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /** Get context menu entries for folders in the directory. */
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

  /** Prepare render context for the directory part. */
  protected _prepareDirectoryContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /** Prepare render context for the header part. */
  protected _prepareHeaderContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /** Prepare render context for a single Compendium pack. */
  protected _preparePackContext(pack: CompendiumCollection.Any): object;

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

  /** Collapse all open folders in this directory. */
  collapseAll(): void;

  /** Handle activating a directory entry. */
  protected _onClickEntry(event: PointerEvent, target: HTMLElement): void;

  /** Handle creating a new Compendium pack. */
  protected _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  /** Handle creating a new folder in this directory. */
  protected _onCreateFolder(event: PointerEvent, target: HTMLElement): void;

  /** Handle deleting a Compendium pack. */
  protected _onDeleteCompendium(li: HTMLElement): Promise<void>;

  /** Handle duplicating a Compendium pack. */
  protected _onDuplicateCompendium(li: HTMLElement): Promise<void>;

  /** Toggle a Compendium type filter. */
  protected _onToggleCompendiumFilterType(event: PointerEvent, type: string): void;

  /** Handle toggling a folder's expanded state. */
  protected _onToggleFolder(event: PointerEvent, target: HTMLElement): void;

  /** Handle toggling the locked state of a Compendium pack. */
  protected _onToggleLock(li: HTMLElement): Promise<void>;

  /** Handle matching a Compendium pack with the search filter. */
  protected _onMatchSearchEntry(query: string, packs: Set<string>, element: HTMLElement, options?: object): void;

  /** Handle directory searching and filtering. */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /** Identify Compendium packs which match a search query. */
  protected _matchSearchCompendiums(
    query: RegExp,
    packs: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: object,
  ): void;

  /** Identify folders which match a search query. */
  protected _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: object,
  ): void;

  /** Identify documents within packs which match a search query. */
  protected _matchSearchDocuments(query: RegExp, documents: Set<string>): void;

  /** Handle matching documents with the search filter. */
  protected _onMatchSearchDocuments(indexEntries: object[], listEl: HTMLElement): void;

  /** Determine if drop operations are permitted. */
  protected _canDragDrop(selector: string): boolean;

  /** Determine if drag operations are permitted. */
  protected _canDragStart(selector: string): boolean;

  /** Test if the given pack is already present in this directory. */
  protected _entryAlreadyExists(pack: CompendiumCollection.Any): boolean;

  /** Determine whether a given pack belongs to the given folder. */
  protected _entryBelongsToFolder(pack: CompendiumCollection.Any, folder: string): boolean;

  /** Get the pack instance from its dropped data. */
  protected _getDroppedEntryFromData(data: object): Promise<CompendiumCollection.Any>;

  /** Get drag data for a pack in this directory. */
  protected _getEntryDragData(collection: string): object;

  /** Get drag data for a folder in this directory. */
  protected _getFolderDragData(folderId: string): object;

  /** Handle dropping a pack into this directory. */
  protected _handleDroppedEntry(target: HTMLElement, data: object): Promise<void>;

  /** Handle dropping a folder onto the directory. */
  protected _handleDroppedFolder(target: HTMLElement, data: object): Promise<void>;

  /** Highlight folders as drop targets during a drag. */
  protected _onDragHighlight(event: DragEvent): void;

  /** Handle drag events over the directory. */
  protected _onDragOver(event: DragEvent): void;

  /** Handle the start of a drag of a directory entry. */
  protected _onDragStart(event: DragEvent): void;

  /** Handle the start of a drag of an index document within a pack. */
  protected _onDragDocumentStart(event: DragEvent): void;

  /** Handle drop operations on the directory. */
  protected _onDrop(event: DragEvent): void;

  /** Sort a pack relative to its siblings. */
  protected _sortRelative(pack: CompendiumCollection.Any, sortData: object): Promise<void>;
}

declare namespace CompendiumDirectory {
  interface Any extends AnyCompendiumDirectory {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumDirectory> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {}
  interface Configuration extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnyCompendiumDirectory extends CompendiumDirectory<
  CompendiumDirectory.RenderContext,
  CompendiumDirectory.Configuration,
  CompendiumDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default CompendiumDirectory;
