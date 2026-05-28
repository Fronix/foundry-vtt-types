import type { DeepPartial, Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistDirectory: PlaylistDirectory.Any;
    }
  }
}

/**
 * The World Playlist directory listing.
 */
declare class PlaylistDirectory<
  RenderContext extends PlaylistDirectory.RenderContext = PlaylistDirectory.RenderContext,
  Configuration extends PlaylistDirectory.Configuration = PlaylistDirectory.Configuration,
  RenderOptions extends PlaylistDirectory.RenderOptions = PlaylistDirectory.RenderOptions,
> extends DocumentDirectory<Playlist.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  static override tabName: string;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Cycle-mode options for playlists.
   */
  static PLAYLIST_MODES: Record<string, number>;

  protected static override _entryPartial: string;

  /**
   * Currently playing sounds, tracked for the playing-now widget.
   */
  protected _playing: object;

  /**
   * Whether the global volume controls are expanded.
   */
  protected _volumeExpanded: boolean;

  /**
   * The location where currently-playing sounds are displayed.
   */
  get currentlyPlayingLocation(): string;

  /**
   * The sounds which are currently playing.
   */
  get playing(): object;

  protected override _createContextMenus(): void;

  protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /**
   * Get context menu entries for individual PlaylistSounds.
   */
  protected _getSoundContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareDirectoryContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for a single tree node.
   */
  protected _prepareTreeContext(root: object, node: object): object;

  /**
   * Prepare render context for a single Playlist.
   */
  protected _preparePlaylistContext(root: object, playlist: Playlist.Implementation): object;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the global controls part.
   */
  protected _prepareControlsContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the currently-playing part.
   */
  protected _preparePlayingContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  protected override _prepareDuplicateData(document: foundry.abstract.Document.Any): object;

  override collapseAll(): void;

  protected override _attachFrameListeners(): void;

  protected override _onClickEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle changes to the global volume sliders.
   */
  protected _onGlobalVolume(slider: HTMLElement): void;

  /**
   * Handle changes to a PlaylistSound's volume slider.
   */
  protected _onSoundVolume(slider: HTMLElement): void;

  /**
   * Update the displayed timestamps for all currently-playing sounds.
   */
  updateTimestamps(): void;

  protected override _onMatchSearchEntry(
    query: string,
    entryIds: Set<string>,
    element: HTMLElement,
    options?: object,
  ): void;

  protected override _matchSearchEntries(
    query: RegExp,
    entryIds: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: object,
  ): void;

  protected override _matchSearchFolders(query: RegExp, folderIds: Set<string>, autoExpandIds: Set<string>): void;

  protected override _onDragStart(event: DragEvent): void;

  protected override _onDrop(event: DragEvent): void;

  /**
   * Format a duration in seconds into a timestamp string.
   */
  static formatTimestamp(seconds: number): string;

  /**
   * Register playlist-directory settings.
   * @internal
   */
  static _registerSettings(): void;
}

declare namespace PlaylistDirectory {
  interface Any extends AnyPlaylistDirectory {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyPlaylistDirectory extends PlaylistDirectory<
  PlaylistDirectory.RenderContext,
  PlaylistDirectory.Configuration,
  PlaylistDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistDirectory;
