import type { DeepPartial, Identity } from "#utils";
import type PlaceableConfig from "./placeable-config.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      WallConfig: WallConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Wall document within a parent Scene.
 */
declare class WallConfig<
  RenderContext extends WallConfig.RenderContext = WallConfig.RenderContext,
  Configuration extends WallConfig.Configuration = WallConfig.Configuration,
  RenderOptions extends WallConfig.RenderOptions = WallConfig.RenderOptions,
> extends PlaceableConfig<WallDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    updateData?: unknown,
  ): object;
}

declare namespace WallConfig {
  interface Any extends AnyWallConfig {}
  interface AnyConstructor extends Identity<typeof AnyWallConfig> {}

  /** A per-sense proximity threshold field descriptor. */
  interface ThresholdField {
    name: string;
    label: string;
    choices: unknown;
    disabled: boolean;
  }

  interface RenderContext extends PlaceableConfig.RenderContext<WallDocument.Implementation> {
    coordinates: string;
    thresholdFields: ThresholdField[];
    animation: object;
    animationDirections: { value: number; label: string }[];
    animationTypes: Record<string, unknown>;
    animationFieldsetClass: string;
    gridUnits: string;
    doorSounds: Record<string, unknown>;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends PlaceableConfig.Configuration<WallDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyWallConfig extends WallConfig<
  WallConfig.RenderContext,
  WallConfig.Configuration,
  WallConfig.RenderOptions
> {
  constructor(...args: never);
}

export default WallConfig;
