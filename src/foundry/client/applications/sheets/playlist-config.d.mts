import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      PlaylistConfig: PlaylistConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Playlist document
 */
declare class PlaylistConfig<
  RenderContext extends PlaylistConfig.RenderContext = PlaylistConfig.RenderContext,
  Configuration extends PlaylistConfig.Configuration = PlaylistConfig.Configuration,
  RenderOptions extends PlaylistConfig.RenderOptions = PlaylistConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Playlist.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;
}

declare namespace PlaylistConfig {
  interface Any extends AnyPlaylistConfig {}
  interface AnyConstructor extends Identity<typeof AnyPlaylistConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Playlist.Implementation> {
    modes: Record<number, string>;
    sortModes: Record<number, string>;
    channels: Record<string, string>;
    milliseconds: string;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Playlist.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyPlaylistConfig extends PlaylistConfig<
  PlaylistConfig.RenderContext,
  PlaylistConfig.Configuration,
  PlaylistConfig.RenderOptions
> {
  constructor(...args: never);
}

export default PlaylistConfig;
