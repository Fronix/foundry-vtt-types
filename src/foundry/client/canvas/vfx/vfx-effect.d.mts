import type { AnyMutableObject, AnyObject, Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "./vfx-component.d.mts";

/**
 * A specialized DataModel subclass used to configure VFXEffects in a way that can be serialized for storage in
 * database or transmission over socket. VFXEffect instances involve animation components which are animated over a
 * configured timeline.
 *
 * Playback for a VFXEffect can only happen once. The intended paradigm to repeat an effect multiple times requires
 * cloning it before each successive playback.
 *
 * @remarks Part of Foundry's v14 EXPERIMENTAL VFX framework, which Foundry documents as non-stable and "likely to
 * change over coming releases".
 */
declare class VFXEffect extends foundry.abstract.DataModel<VFXEffect.Schema, null> {
  static override defineSchema(): fields.DataSchema;

  /**
   * Is this VFXEffect currently playing?
   */
  get playing(): boolean;

  /**
   * VFXComponents that are included in this animation
   */
  components: Record<string, VFXComponent.Any>;

  /**
   * Has playback of this effect started?
   */
  get started(): boolean;

  /**
   * Load necessary materials for all animation components.
   */
  load(): Promise<void>;

  /**
   * Perform initial drawing of every animation component.
   */
  draw(): Promise<void>;

  /**
   * Add managed display objects for each component to the primary canvas container.
   */
  attach(): void;

  override clone(data?: VFXEffect.CreateData, context?: foundry.abstract.DataModel.CloneContext): this;

  /**
   * Begin playback of a VFXEffect using provided reference data.
   * @param references - A record of references used to resolve model data
   * @returns A Promise which resolves to signal whether playback fully completed
   * @throws An error if playback from this VFXEffect has already started or if playback failed for some reason.
   */
  play(references?: Record<string, unknown>): Promise<boolean | void>;

  /**
   * Stop animation, but treat the animation as successfully completed.
   */
  stop(): Promise<void>;

  /**
   * Cancel animation and treat the animation as unsuccessful.
   */
  cancel(): Promise<void>;

  /**
   * Resolve all reference fields within this model against provided reference data.
   * This is idempotent: fields that have already been resolved to concrete values are skipped on subsequent calls.
   * @param references - A record of references used to resolve model data
   * @throws An error if references were unable to resolve
   */
  resolveReferences(references?: Record<string, unknown>): void;

  #VFXEffect: true;
}

declare namespace VFXEffect {
  interface Any extends VFXEffect {}
  interface AnyConstructor extends Identity<typeof VFXEffect> {}

  interface TimelineEntrySchema extends fields.DataSchema {
    /** The labeled component in sequence. */
    component: fields.StringField<{ required: true; nullable: false; blank: false }>;

    /** The animejs offset position. */
    position: fields.AnyField;
  }

  interface Schema extends fields.DataSchema {
    name: fields.StringField<{ required: true; nullable: false; blank: false }>;

    components: fields.ObjectField<
      { required: true; nullable: false },
      AnyMutableObject,
      Record<string, VFXComponent.Any>,
      AnyObject
    >;

    timeline: fields.ArrayField<fields.SchemaField<TimelineEntrySchema>>;
  }

  interface Source extends fields.SchemaField.SourceData<Schema> {}
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * A timeline sequence entry.
   */
  interface TimelineSequenceEntry {
    /** The labeled component in sequence. */
    component: string;

    /** The animejs offset position. */
    position?: number | string | undefined;
  }
}

export default VFXEffect;
