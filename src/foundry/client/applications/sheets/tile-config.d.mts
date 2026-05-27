import type { DeepPartial, Identity } from "#utils";
import type PlaceableConfig from "./placeable-config.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TileConfig: TileConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Tile document within a parent Scene.
 */
declare class TileConfig<
  RenderContext extends TileConfig.RenderContext = TileConfig.RenderContext,
  Configuration extends TileConfig.Configuration = TileConfig.Configuration,
  RenderOptions extends TileConfig.RenderOptions = TileConfig.RenderOptions,
> extends PlaceableConfig<TileDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  override get title(): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _previewChanges(changes: object): void;
}

declare namespace TileConfig {
  interface Any extends AnyTileConfig {}
  interface AnyConstructor extends Identity<typeof AnyTileConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<TileDocument.Implementation> {
    tabClasses: string;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends PlaceableConfig.Configuration<TileDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyTileConfig extends TileConfig<
  TileConfig.RenderContext,
  TileConfig.Configuration,
  TileConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TileConfig;
