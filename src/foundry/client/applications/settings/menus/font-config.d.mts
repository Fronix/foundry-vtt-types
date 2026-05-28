import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      FontConfig: FontConfig.Any;
    }
  }
}

/**
 * A V2 application responsible for configuring custom fonts for the world.
 */
declare class FontConfig<
  RenderContext extends FontConfig.RenderContext = FontConfig.RenderContext,
  Configuration extends FontConfig.Configuration = FontConfig.Configuration,
  RenderOptions extends FontConfig.RenderOptions = FontConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: FontConfig.DefaultOptions;

  /** Font types */
  static FONT_TYPES: Readonly<{
    /** Font is a file */
    FILE: "file";

    /** Font is from the system */
    SYSTEM: "system";
  }>;

  /** The setting key that stores custom font definitions. */
  static SETTING: "fonts";

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Get the list of fonts that successfully loaded.
   */
  static getAvailableFonts(): string[];

  /**
   * Get the list of fonts formatted for display with selectOptions.
   */
  static getAvailableFontChoices(): Record<string, string>;

  /**
   * Load a font definition.
   * @param family     - The font family name (case-sensitive).
   * @param definition - The font family definition.
   * @returns Returns true if the font was successfully loaded.
   */
  static loadFont(
    family: string,
    definition: object,
    options?: { document?: foundry.abstract.Document.Any },
  ): Promise<boolean>;

  /**
   * Collect all the font definitions and load them.
   * @internal
   */
  static _loadFonts(options?: { document?: foundry.abstract.Document.Any; timeout?: number }): Promise<void>;

  /**
   * Collect all the font definitions to load.
   * @internal
   */
  static _collectDefinitions(): Record<string, object>[];

  /**
   * Create a FontFace object from a definition.
   * @internal
   */
  static _createFontFace(family: string, definition: object): FontFace;

  /**
   * Format a font definition for use in CSS.
   * @internal
   */
  static _formatFont(family: string, definition: object): string;

  /**
   * The new font definition currently being edited.
   */
  object: FontConfig.NewFontDefinition;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Prepare the data to display a single font definition.
   */
  protected _getDataForDefinition(family: string, definition: object): object;

  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  /**
   * Add a new custom font definition.
   */
  protected _onAddFont(): Promise<void>;

  /**
   * Delete a font.
   */
  protected _onDeleteFont(event: PointerEvent): Promise<void>;

  /**
   * Select a font to preview and edit.
   */
  protected _onSelectFont(event: Event): void;

  override close(options?: DeepPartial<ApplicationV2.ClosingOptions>): Promise<this>;
}

declare namespace FontConfig {
  interface Any extends AnyFontConfig {}
  interface AnyConstructor extends Identity<typeof AnyFontConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {}

  interface Configuration<FontConfig extends FontConfig.Any = FontConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<FontConfig> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<FontConfig extends FontConfig.Any = FontConfig.Any> = DeepPartial<Configuration<FontConfig>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  interface NewFontDefinition {
    family: string;

    /** @defaultValue `400` */
    weight?: number;

    /** @defaultValue `"normal"` */
    style?: string;

    /** @defaultValue `""` */
    src?: string;

    preview?: string;
  }

  interface RenderContext extends ApplicationV2.RenderContext {}
}

declare abstract class AnyFontConfig extends FontConfig<
  FontConfig.RenderContext,
  FontConfig.Configuration,
  FontConfig.RenderOptions
> {
  constructor(...args: never);
}

export default FontConfig;
