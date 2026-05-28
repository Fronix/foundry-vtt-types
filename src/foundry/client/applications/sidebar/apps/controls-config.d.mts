import type { DeepPartial, Identity } from "#utils";
import type CategoryBrowser from "../../api/category-browser.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ControlsConfig: ControlsConfig.Any;
    }
  }
}

/**
 * View and edit keybinding and (readonly) mouse actions.
 */
declare class ControlsConfig<
  Entry extends ControlsConfig.Entry = ControlsConfig.Entry,
  RenderContext extends ControlsConfig.RenderContext<Entry> = ControlsConfig.RenderContext<Entry>,
  Configuration extends ControlsConfig.Configuration = ControlsConfig.Configuration,
  RenderOptions extends ControlsConfig.RenderOptions = ControlsConfig.RenderOptions,
> extends CategoryBrowser<Entry, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: CategoryBrowser.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Faux "categories" of pointer controls to display as read-only.
   */
  static POINTER_CONTROLS: ReadonlyArray<object>;

  /**
   * Transform a binding into a human-readable string representation.
   * @param binding - The keybinding.
   */
  static humanizeBinding(binding: object): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareCategoryData(): Promise<Record<string, CategoryBrowser.CategoryData<Entry>>>;

  protected override _sortCategories(
    a: CategoryBrowser.CategoryData<Entry>,
    b: CategoryBrowser.CategoryData<Entry>,
  ): number;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;
}

declare namespace ControlsConfig {
  interface Any extends AnyControlsConfig {}
  interface AnyConstructor extends Identity<typeof AnyControlsConfig> {}

  // TODO: Interface is a stub
  interface Entry {
    id: string;
  }

  interface RenderContext<Entry> extends CategoryBrowser.RenderContext<Entry> {}

  interface Configuration extends CategoryBrowser.Configuration {}
  interface RenderOptions extends CategoryBrowser.RenderOptions {}
}

declare abstract class AnyControlsConfig extends ControlsConfig<
  ControlsConfig.Entry,
  ControlsConfig.RenderContext<ControlsConfig.Entry>,
  ControlsConfig.Configuration,
  ControlsConfig.RenderOptions
> {
  constructor(...args: never);
}

export default ControlsConfig;
