import type { AnyObject, DeepPartial, Identity } from "#utils";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      RollTableSheet: RollTableSheet.Any;
    }
  }
}

/**
 * The Application responsible for editing, displaying, and using a single RollTable document.
 */
declare class RollTableSheet<
  RenderContext extends RollTableSheet.RenderContext = RollTableSheet.RenderContext,
  Configuration extends RollTableSheet.Configuration = RollTableSheet.Configuration,
  RenderOptions extends RollTableSheet.RenderOptions = RollTableSheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  RollTable.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Parts for each view
   */
  static MODE_PARTS: {
    edit: string[];
    view: string[];
  };

  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * The operational mode of this sheet
   */
  get mode(): RollTableSheet.Mode;

  /**
   * Change the operational mode of this sheet. Changing this value will also change the mode in which subsequent
   * RollTableSheet instances first render.
   */
  set mode(value: RollTableSheet.Mode);

  /**
   * Is the sheet in edit mode?
   */
  get isEditMode(): boolean;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _configureRenderParts(
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareTabs(group: string): Record<string, ApplicationV2.Tab>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare sheet data for a single TableResult.
   * @param result - The result from which to prepare
   * @returns The sheet data for this result
   */
  protected _prepareResult(result: TableResult.Implementation): Promise<RollTableSheet.ResultContext>;

  /**
   * Compare a pair of results for sorted display in this sheet.
   * @returns A comparator return value expected by `Array#sort`
   */
  protected _sortResults(resultA: TableResult.Implementation, resultB: TableResult.Implementation): number;

  /**
   * Create a Table Result from initial data and with reasonable defaults.
   */
  protected _createResult(initialData?: DeepPartial<TableResult.Source>): Promise<void>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
    updateData?: unknown,
  ): object;

  override submit(options?: AnyObject): Promise<void>;

  protected override _preRender(
    context: DeepPartial<ApplicationV2.RenderContextOf<this>>,
    options: DeepPartial<ApplicationV2.RenderOptionsOf<this>>,
  ): Promise<void>;

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onRevealSecret(event: Event): void;

  /**
   * Create a Compendium or Document result from a dropped document.
   * @param event - The triggering drop event
   */
  protected _onDrop(event: DragEvent): Promise<void>;

  /**
   * Display a roulette style animation when a Roll Table result is drawn from the sheet.
   * @param results - An Array of drawn table results to highlight
   * @returns A Promise that resolves once the animation is complete
   */
  protected _animateRoll(results: TableResult.Implementation[]): Promise<void>;

  /**
   * Animate a "roulette" through the table until arriving at the final loop and a drawn result
   * @param resultsTable - The list element being iterated
   * @param drawnIds     - The result IDs which have already been drawn
   * @param nLoops       - The number of times to loop through the animation
   * @param animTime     - The desired animation time in milliseconds
   * @param animOffset   - The desired pixel offset of the result within the list
   * @returns A Promise that resolves once the animation is complete
   */
  protected _animateRoulette(
    resultsTable: HTMLElement,
    drawnIds: Set<string>,
    nLoops: number,
    animTime: number,
    animOffset: number,
  ): Promise<void>;

  /**
   * Display a flashing animation on the selected result to emphasize the draw
   * @param item - The HTML li item of the winning result
   * @returns A Promise that resolves once the animation is complete
   */
  protected _flashResult(item: HTMLElement): Promise<void>;
}

declare namespace RollTableSheet {
  interface Any extends AnyRollTableSheet {}
  interface AnyConstructor extends Identity<typeof AnyRollTableSheet> {}

  type Mode = "edit" | "view";

  /** Prepared sheet data for a single TableResult. */
  interface ResultContext {
    id: string;
    img: string;
    name: string;
    description: string;
    documentLink: string | undefined;
    weight: number;
    range: number | string | number[];
    drawn: boolean;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<RollTable.Implementation> {
    results?: ResultContext[];
    descriptionHTML?: string;
    formula?: string;
    formulaPlaceholder?: string;
    buttons?: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<RollTable.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyRollTableSheet extends RollTableSheet<
  RollTableSheet.RenderContext,
  RollTableSheet.Configuration,
  RollTableSheet.RenderOptions
> {
  constructor(...args: never);
}

export default RollTableSheet;
