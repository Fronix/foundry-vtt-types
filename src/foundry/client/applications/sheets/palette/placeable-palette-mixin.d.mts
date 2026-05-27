import type { AnyObject, FixedInstanceType, Mixin } from "#utils";
import type Document from "#common/abstract/document.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type { PlaceablesLayer } from "#client/canvas/layers/_module.d.mts";

/**
 * The mixin instance class. Augments a placeable config so that it can be used to bulk edit and set
 * default creation data for newly-created placeables.
 *
 * @remarks Only the members the mixin **adds** are modeled here; the overridden {@linkcode ApplicationV2}
 * lifecycle methods (`render`, `_prepareContext`, `_onRender`, `_processSubmitData`, …) keep the base
 * config's signatures and are therefore inherited rather than re-declared.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class PlaceablePalette {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The initial creation data for a new document, reading from the live palette instance if one is open,
   * otherwise falling back to the stored settings, with level and elevation synced to the currently viewed
   * level.
   */
  static get createData(): AnyObject;

  /**
   * Get the default level and elevation data for a given level, used when syncing to the currently viewed
   * level.
   */
  protected static _getDefaultLevelData(): AnyObject;

  /**
   * If defined, switch to this tool after committing settings so the user can immediately draw with them.
   */
  static COMMIT_TOOL: string | undefined;

  /**
   * The placeable document name backing this palette.
   * @remarks Set on each concrete palette subclass.
   */
  static documentName: string;

  /**
   * The setting key where default data is saved.
   * @remarks Set on each concrete palette subclass.
   */
  static SETTING_KEY: string;

  /**
   * The schema of the user's stored palette values.
   */
  static get schema(): foundry.data.fields.SchemaField.Any;

  /**
   * Determine whether the given preset creation data matches the currently stored palette settings.
   * @param createData - The preset creation data to compare against.
   */
  static isActivePreset(createData: AnyObject): boolean;

  /**
   * The all controlled documents for this palette's placeables layer.
   */
  get controlled(): Document.Any[];

  /**
   * The initial creation data for a new document.
   */
  get createData(): AnyObject;

  /**
   * The fields the user has modified from their default values.
   * @internal
   */
  _dirtyFields: Set<string>;

  /**
   * The fields that have differing values across the set of controlled documents.
   * @internal
   */
  _multiFields: Set<string>;

  /**
   * The class of the document that backs this form.
   */
  get documentClass(): Document.AnyConstructor;

  /**
   * The placeable document name.
   */
  get documentName(): string;

  /**
   * Whether the palette is editing multiple placeables.
   */
  get isSelect(): boolean;

  /**
   * The canvas layer for this palette's placeable.
   */
  get layer(): PlaceablesLayer.Any | null;

  /**
   * Configure an appropriate preset to apply.
   * @param formData - The palette data.
   * @param options  - Render options.
   */
  protected _applyPreset(formData: AnyObject, options?: AnyObject): AnyObject;

  /**
   * Determine which fields have values that are not the same across all selected documents.
   */
  protected _determineMultiFields(docs: Document.Any[]): Set<string>;

  /**
   * Set a multi-value placeholder on the given element.
   */
  protected _setPlaceholder(element: HTMLElement): void;

  #PlaceablePalette: true;
}

/**
 * Augment a placeable config so that it can be used to bulk edit and set default creation data.
 */
declare function PlaceablePaletteMixin<BaseClass extends PlaceablePaletteMixin.BaseClass>(
  BaseConfig: BaseClass,
): PlaceablePaletteMixin.Mix<BaseClass>;

declare namespace PlaceablePaletteMixin {
  interface AnyMixedConstructor extends ReturnType<typeof PlaceablePaletteMixin<BaseClass>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = ApplicationV2.Internal.Constructor;
  type Mix<BaseClass extends PlaceablePaletteMixin.BaseClass> = Mixin<typeof PlaceablePalette, BaseClass>;
}

export default PlaceablePaletteMixin;
