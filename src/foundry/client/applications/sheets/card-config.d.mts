import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CardConfig: CardConfig.Any;
    }
  }
}

/**
 * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
 */
declare class CardConfig<
  RenderContext extends CardConfig.RenderContext = CardConfig.RenderContext,
  Configuration extends CardConfig.Configuration = CardConfig.Configuration,
  RenderOptions extends CardConfig.RenderOptions = CardConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Card.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * Card types with pre-localized labels
   */
  static get TYPES(): Record<string, string>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;
}

declare namespace CardConfig {
  interface Any extends AnyCardConfig {}
  interface AnyConstructor extends Identity<typeof AnyCardConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Card.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Card.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyCardConfig extends CardConfig<
  CardConfig.RenderContext,
  CardConfig.Configuration,
  CardConfig.RenderOptions
> {
  constructor(...args: never);
}

export default CardConfig;
