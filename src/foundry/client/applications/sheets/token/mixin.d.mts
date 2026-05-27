import type { PrototypeToken } from "#common/data/data.mjs";
import type { AnyObject, FixedInstanceType, Mixin } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

/**
 * @remarks This does NOT exist at runtime. This is only here to be used as a type when relevant as well as to avoid
 * issues with anonymous mixin classes.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class TokenApplication {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  static DEFAULT_OPTIONS: ApplicationV2.DefaultOptions;

  static PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * Localized Token Display Modes
   */
  static get DISPLAY_MODES(): Record<string, string>;

  /**
   * Localized Token Dispositions
   */
  static get TOKEN_DISPOSITIONS(): Record<string, string>;

  /**
   * Localized Token Turn Marker modes
   */
  static get TURN_MARKER_MODES(): Record<string, string>;

  /**
   * Localized Token Shapes
   */
  static get TOKEN_SHAPES(): Record<string, string>;

  /**
   * Maintain a copy of the original to show a real-time preview of changes.
   */
  protected _preview: TokenApplicationMixin.Token | null;

  /**
   * Is the token a PrototypeToken?
   */
  isPrototype: boolean;

  /**
   * A reference to the Actor the token depicts
   */
  get actor(): Actor.Implementation | null;

  /**
   * The TokenDocument or PrototypeToken
   */
  get token(): TokenApplicationMixin.Token;

  /**
   * The schema fields for this token DataModel
   */
  protected get _fields(): foundry.data.fields.DataSchema;

  /**
   * Prepare data to be displayed in the Identity tab.
   */
  protected _prepareIdentityTab(): AnyObject;

  /**
   * Prepare data to be displayed in the Appearance tab.
   */
  protected _prepareAppearanceTab(): Promise<AnyObject>;

  /**
   * Prepare data to be displayed in the Vision tab.
   */
  protected _prepareVisionTab(): Promise<AnyObject>;

  /**
   * Prepare data to be displayed in the Light tab.
   */
  protected _prepareLightTab(): Promise<AnyObject>;

  /**
   * Prepare data to be displayed in the Resources tab.
   */
  protected _prepareResourcesTab(): Promise<AnyObject>;

  /**
   * Prepare form submission buttons.
   */
  protected _prepareButtons(): ApplicationV2.FormFooterButton[];

  /**
   * Process several fields from form submission data into proper model changes.
   * @param submitData - Form submission data passed through {@linkcode foundry.applications.ux.FormDataExtended}
   */
  protected _processChanges(submitData: object): void;
}

/**
 * A mixin for UI shared between TokenDocument and PrototypeToken sheets
 */
declare function TokenApplicationMixin<BaseClass extends TokenApplicationMixin.BaseClass>(
  BaseApplication: BaseClass,
): Mixin<typeof TokenApplication, BaseClass>;

declare namespace TokenApplicationMixin {
  type AnyMixedConstructor = ReturnType<typeof TokenApplicationMixin<BaseClass>>;
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;

  type Token = TokenDocument.Implementation | PrototypeToken;

  interface RenderContext<ConcreteToken extends TokenApplicationMixin.Token> {
    rootId: string;
    source: ConcreteToken["_source"];
    fields: ConcreteToken["schema"]["fields"];
    gridUnits: string;
    isPrototype: boolean;
    displayModes: Record<CONST.TOKEN_DISPLAY_MODES, string>;
    buttons: ApplicationV2.FormFooterButton[];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Configuration {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RenderOptions {}
}

export default TokenApplicationMixin;
