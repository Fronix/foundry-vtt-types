import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      Compendium: Compendium.Any;
    }
  }
}

/**
 * An Application that displays the indexed contents of a Compendium pack.
 */
declare class Compendium<
  DocumentClass extends Document.AnyConstructor = Document.AnyConstructor,
  RenderContext extends Compendium.RenderContext = Compendium.RenderContext,
  Configuration extends Compendium.Configuration = Compendium.Configuration,
  RenderOptions extends Compendium.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<DocumentClass, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected static override _entryPartial: string;

  override get isPopout(): boolean;

  override get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _canCreateEntry(): boolean;

  protected override _canCreateFolder(): boolean;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _getFolderContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  /**
   * Get the buttons displayed in the Application frame.
   */
  protected _getFrameButtons(options: DeepPartial<RenderOptions>): ApplicationV2.HeaderControlsEntry[];

  protected override _prepareHeaderContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: { _skipDeprecation?: boolean },
  ): Promise<void>;

  protected override _onCreateEntry(event: PointerEvent, target: HTMLElement): void;

  protected override _canDragDrop(selector: string): boolean;

  protected override _entryAlreadyExists(entry: Document.Any): boolean;

  protected override _getEntryDragData(entryId: string): object;
}

declare namespace Compendium {
  interface Any extends AnyCompendium {}
  interface AnyConstructor extends Identity<typeof AnyCompendium> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyCompendium extends Compendium<
  Document.AnyConstructor,
  Compendium.RenderContext,
  Compendium.Configuration,
  Compendium.RenderOptions
> {
  constructor(...args: never);
}

export default Compendium;
