import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";

import AVMaster = foundry.av.AVMaster;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AVConfig: AVConfig.Any;
    }
  }
}

/**
 * Audio/Video Conferencing Configuration Sheet
 */
declare class AVConfig<
  RenderContext extends AVConfig.RenderContext = AVConfig.RenderContext,
  Configuration extends AVConfig.Configuration = AVConfig.Configuration,
  RenderOptions extends AVConfig.RenderOptions = AVConfig.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: AVConfig.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The AVMaster instance being configured
   */
  webrtc: AVMaster;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;
}

declare namespace AVConfig {
  interface Any extends AnyAVConfig {}
  interface AnyConstructor extends Identity<typeof AnyAVConfig> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    tabClasses: string;
    rootId: string;
    settings: foundry.av.AVSettings;
    fields: { world: foundry.data.fields.DataSchema; client: foundry.data.fields.DataSchema };
    isSSL: boolean;
  }

  interface Configuration<AVConfig extends AVConfig.Any = AVConfig.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<AVConfig> {
    /**
     * The AVMaster instance being configured
     * @defaultValue `game.webrtc`
     */
    webrtc?: AVMaster;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<AVConfig extends AVConfig.Any = AVConfig.Any> = DeepPartial<Configuration<AVConfig>> & object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyAVConfig extends AVConfig<
  AVConfig.RenderContext,
  AVConfig.Configuration,
  AVConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AVConfig;
