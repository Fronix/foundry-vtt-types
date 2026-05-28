import type { DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      SceneConfig: SceneConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Scene document.
 */
declare class SceneConfig<
  RenderContext extends SceneConfig.RenderContext = SceneConfig.RenderContext,
  Configuration extends SceneConfig.Configuration = SceneConfig.Configuration,
  RenderOptions extends SceneConfig.RenderOptions = SceneConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Scene.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The default Level of the Scene being configured.
   * @remarks Returns the Scene's `initialLevel`.
   * @privateRemarks FIXME: typed as `object` until the `Level` document is authored in Phase 7 (Scene Levels).
   */
  get defaultLevel(): object;

  /**
   * The available grid types which can be applied to this Scene.
   */
  static _getGridTypes(): Record<number, string>;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Get the fog exploration mode choices.
   */
  static _getFogExplorationModes(): Record<string, string>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  /**
   * Preview changes to the Scene environment by applying them to the live canvas.
   * @param changed - The changed scene data.
   */
  protected _previewScene(changed: object, options?: { force?: boolean }): void;

  protected override _processFormData(
    event: SubmitEvent | null,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): object;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
    options?: unknown,
  ): Promise<void>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Get the set of ContextMenu options which should be used for Scene Levels.
   * @privateRemarks FIXME: the entries operate on `Level` documents (Phase 7).
   */
  protected _getLevelContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected _onDragStart(event: DragEvent): void;

  protected _onDrop(event: DragEvent): Promise<void>;

  /**
   * Handle sorting a Level relative to its siblings.
   * @privateRemarks FIXME: `level` is a `Level` document, typed as `object` until Phase 7 (Scene Levels).
   */
  protected _onSortLevel(event: Event, level: object): void;
}

declare namespace SceneConfig {
  interface Any extends AnySceneConfig {}
  interface AnyConstructor extends Identity<typeof AnySceneConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Scene.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Scene.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnySceneConfig extends SceneConfig<
  SceneConfig.RenderContext,
  SceneConfig.Configuration,
  SceneConfig.RenderOptions
> {
  constructor(...args: never);
}

export default SceneConfig;
