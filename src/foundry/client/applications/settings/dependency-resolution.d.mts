import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DependencyResolution: DependencyResolution.Any;
    }
  }
}

/**
 * A class responsible for prompting the user about dependency resolution for their modules.
 */
declare class DependencyResolution<
  RenderContext extends DependencyResolution.RenderContext = DependencyResolution.RenderContext,
  Configuration extends DependencyResolution.Configuration = DependencyResolution.Configuration,
  RenderOptions extends DependencyResolution.RenderOptions = DependencyResolution.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: DependencyResolution.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Whether there are any dependencies that require resolving.
   */
  get needsResolving(): boolean;

  /**
   * The module that is the root of the dependency resolution.
   */
  get root(): foundry.packages.Module;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onChangeForm(
    formConfig: foundry.applications.api.ApplicationV2.FormConfiguration,
    event: Event,
  ): void;

  /**
   * Return any modules that the root module is required by.
   * @internal
   */
  _getRootRequiredBy(): Set<foundry.packages.Module>;
}

declare namespace DependencyResolution {
  interface Any extends AnyRollResolver {}
  interface AnyConstructor extends Identity<typeof AnyRollResolver> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, ApplicationV2.RenderContext {
    required: object[];
    optional: object[];
    subtypes: object[] | undefined;
    checkbox: foundry.data.fields.BooleanField;
    enabling: boolean;
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<DependencyResolution> {
    /** The module that is the root of the dependency resolution. */
    root: foundry.packages.Module;

    /** The module management application. */
    manager?: foundry.applications.sidebar.apps.ModuleManagement | undefined;

    /** Whether modules are being enabled (true) or disabled (false). */
    enabling?: boolean | undefined;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DependencyResolution extends DependencyResolution.Any = DependencyResolution.Any> = DeepPartial<
    Configuration<DependencyResolution>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}
}

declare abstract class AnyRollResolver extends DependencyResolution<
  DependencyResolution.RenderContext,
  DependencyResolution.Configuration,
  DependencyResolution.RenderOptions
> {
  constructor(...args: never);
}

export default DependencyResolution;
