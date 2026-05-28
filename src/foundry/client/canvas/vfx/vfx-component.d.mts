import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";

/**
 * The base class for VFX components. A VFXComponent is a DataModel which orchestrates a portion of a visual effect,
 * managing its own animation timeline and display objects.
 *
 * @remarks Part of Foundry's v14 EXPERIMENTAL VFX framework, which Foundry documents as non-stable and "likely to
 * change over coming releases".
 *
 * @template Schema - the schema of this component
 */
declare class VFXComponent<Schema extends fields.DataSchema = VFXComponent.Schema> extends foundry.abstract.DataModel<
  Schema,
  null
> {
  /**
   * The type of this component. Must be overridden in the subclass.
   */
  static TYPE: string;

  static override defineSchema(): fields.DataSchema;

  /**
   * A component-specific sub-timeline.
   * @remarks An `animejs.Timeline`; loosely typed because `animejs` is not a typed dependency.
   */
  get timeline(): VFXComponent.Timeline;

  /**
   * Have the materials for this component been loaded?
   */
  get loaded(): boolean;

  /**
   * Is the animation for this component playing?
   */
  get playing(): boolean;

  /**
   * Asset paths required to be loaded for this component.
   */
  get assetPaths(): Set<string>;

  /**
   * A registry of display objects which are managed by this component.
   */
  get managedDisplayObjects(): Record<string, PIXI.DisplayObject[]>;

  /**
   * Adds a DisplayObject to the set of managed primary display objects.
   * Entries in this list will be added to the primary canvas container when the component is attached and
   * removed when the component is destroyed.
   * @param object - The object to manage
   * @param group  - A canvas group that should contain the object (default: `"primary"`)
   */
  addManagedDisplayObject<DisplayObject extends PIXI.DisplayObject>(
    object: DisplayObject,
    group?: string,
  ): DisplayObject;

  /**
   * Load this component.
   */
  load(): Promise<void>;

  /**
   * Perform subclass-specific loading steps to prepare assets for rendering.
   */
  protected _load(): Promise<void>;

  /**
   * Prepare the timeline and create display objects used by this component.
   * Components should override the `_draw` method to implement subclass-specific steps.
   */
  draw(): Promise<void>;

  /**
   * Perform subclass-specific drawing steps to configure the component timeline and create display objects.
   */
  protected _draw(): Promise<void>;

  /**
   * Attach display objects used by this component to the canvas containers that should render them.
   */
  attach(): void;

  /**
   * Perform subclass-specific attachment steps to customize how display objects are added to the canvas.
   */
  protected _attach(): void;

  /**
   * Stop playback of this component and destroy its contents.
   */
  stop(): Promise<void>;

  /**
   * Cancel playback of this component and destroy its contents.
   */
  cancel(): Promise<void>;

  /**
   * Perform subclass-specific steps to discontinue component playback.
   */
  protected _stop(): Promise<void>;

  /**
   * Perform subclass-specific teardown steps to destroy and dispose of component materials.
   */
  protected _destroy(): void;

  #VFXComponent: true;
}

declare namespace VFXComponent {
  interface Any extends VFXComponent<any> {}
  interface AnyConstructor extends Identity<typeof VFXComponent> {}

  /**
   * An `animejs.Timeline`. Loosely typed because `animejs` is not a typed dependency in this repo.
   */
  type Timeline = unknown;

  /**
   * A texture configuration. Will be extended later to support spritesheet frames and animations.
   */
  type VFXTextureConfig = string;

  interface Schema extends fields.DataSchema {
    type: fields.StringField<{ required: true; blank: false }>;
  }
}

export default VFXComponent;
