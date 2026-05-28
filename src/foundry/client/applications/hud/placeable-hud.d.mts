import type { AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      BasePlaceableHUD: BasePlaceableHUD.Any;
    }
  }
}

/**
 * An abstract base class for displaying a heads-up-display interface bound to a Placeable Object on the Canvas.
 */
declare class BasePlaceableHUD<
  ActiveHUDObject extends PlaceableObject.Any = PlaceableObject,
  RenderContext extends object = BasePlaceableHUD.RenderContext,
  Configuration extends BasePlaceableHUD.Configuration = BasePlaceableHUD.Configuration,
  RenderOptions extends BasePlaceableHUD.RenderOptions = BasePlaceableHUD.RenderOptions,
> extends ApplicationV2<RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: BasePlaceableHUD.DefaultOptions;

  /**
   * Reference a PlaceableObject this HUD is currently bound to.
   */
  get object(): ActiveHUDObject;

  /**
   * Convenience access to the Document which this HUD modifies.
   */
  get document(): ActiveHUDObject["document"];

  /**
   * Convenience access for the canvas layer which this HUD modifies
   */
  get layer(): ActiveHUDObject["layer"];

  /**
   * The palette that is currently expanded, if any.
   */
  get activePalette(): string | null;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _updatePosition(position: ApplicationV2.Position): ApplicationV2.Position;

  protected override _postRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onClose(options: DeepPartial<RenderOptions>): void;

  protected override _insertElement(element: HTMLElement): void;

  /**
   * Bind the HUD to a new PlaceableObject and display it.
   * @param object - A PlaceableObject instance to which the HUD should be bound
   */
  bind(object: ActiveHUDObject): Promise<void>;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Toggle the expanded state of the given palette.
   * @param palette - The palette to toggle or null to collapse the currently expanded palette
   * @param active  - Force the palette to be active or inactive
   */
  togglePalette(palette: string | null, active?: boolean): void;

  /**
   * Handle submission of the BasePlaceableHUD form.
   */
  protected _onSubmit(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): Promise<void>;

  /**
   * Special submission process for elevation changes.
   */
  protected _onSubmitElevation(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): Promise<void>;

  /**
   * Parse an attribute bar input string into a new value for the attribute field.
   * @param name  - The name of the attribute
   * @param attr  - The current value of the attribute
   * @param input - The raw string input value
   * @returns The parsed input value
   */
  protected _parseAttributeInput(
    name: string,
    attr: object | number,
    input: string,
  ): BasePlaceableHUD.ParsedAttributeInput;

  /**
   * @deprecated since v13 - use {@linkcode BasePlaceableHUD.close | BasePlaceableHUD#close} instead.
   */
  clear(): void;
}

declare namespace BasePlaceableHUD {
  interface Any extends AnyBasePlaceableHUD {}
  interface AnyConstructor extends Identity<typeof AnyBasePlaceableHUD> {}

  /** The parsed result of {@linkcode BasePlaceableHUD._parseAttributeInput}. */
  interface ParsedAttributeInput {
    attribute: string;
    value: number;
    delta: number | undefined;
    isDelta: boolean;
    isBar: boolean;
  }

  // TODO: Make generic so it can extend the document source data (calls document#toObject with Object.assign)
  interface RenderContext {
    id: string;
    classes: string;
    appId: string;
    isGM: boolean;
    isGamePaused: boolean;
    icons: AnyObject;
    visibilityClass: string;
    lockedClass: string;
    // TODO: Remaining properties are merged in from the bound document's source data.
  }

  interface Configuration<
    BasePlaceableHUD extends BasePlaceableHUD.Any = BasePlaceableHUD.Any,
  > extends ApplicationV2.Configuration<BasePlaceableHUD> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<BasePlaceableHUD extends BasePlaceableHUD.Any = BasePlaceableHUD.Any> = DeepPartial<
    Configuration<BasePlaceableHUD>
  > &
    object;

  interface RenderOptions extends ApplicationV2.RenderOptions {
    /** A PlaceableObject instance to bind the HUD to for this render. */
    object?: PlaceableObject.Any | undefined;
  }
}

declare abstract class AnyBasePlaceableHUD extends BasePlaceableHUD<
  PlaceableObject.Any,
  object,
  BasePlaceableHUD.Configuration,
  BasePlaceableHUD.RenderOptions
> {
  constructor(...args: never);
}

export default BasePlaceableHUD;
