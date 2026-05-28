import type { DeepPartial, Identity } from "#utils";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CameraPopout: CameraPopout.Any;
    }
  }
}

/**
 * An application for a single popped-out camera.
 * @remarks TODO: Stub
 */
declare class CameraPopout<
  RenderContext extends CameraPopout.RenderContext = CameraPopout.RenderContext,
  Configuration extends CameraPopout.Configuration = CameraPopout.Configuration,
  RenderOptions extends CameraPopout.RenderOptions = CameraPopout.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: CameraPopout.DefaultOptions;

  /**
   * The user this camera view is for.
   */
  get user(): User.Stored;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _replaceHTML(result: unknown, content: HTMLElement, options: DeepPartial<RenderOptions>): void;

  protected override _prePosition(options: DeepPartial<RenderOptions>): void;

  override setPosition(position?: DeepPartial<ApplicationV2.Position>): ApplicationV2.Position | void;

  protected override _onClickAction(event: PointerEvent, target: ApplicationV2.ActionTarget): void;
}

declare namespace CameraPopout {
  interface Any extends AnyCameraPopout {}
  interface AnyConstructor extends Identity<typeof AnyCameraPopout> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    rootId: string;
  }

  interface Configuration<CameraPopout extends CameraPopout.Any = CameraPopout.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<CameraPopout> {
    user: User.Stored;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CameraPopout extends CameraPopout.Any = CameraPopout.Any> = DeepPartial<
    Configuration<CameraPopout>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyCameraPopout extends CameraPopout<
  CameraPopout.RenderContext,
  CameraPopout.Configuration,
  CameraPopout.RenderOptions
> {}

export default CameraPopout;
