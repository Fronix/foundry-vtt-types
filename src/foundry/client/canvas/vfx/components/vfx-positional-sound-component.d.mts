import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "../vfx-component.d.mts";

/**
 * A component which plays a positional sound aligned with an animation, optionally constrained by walls and
 * configured with audio effects.
 */
declare class VFXPositionalSoundComponent extends VFXComponent<VFXPositionalSoundComponent.Schema> {
  static override TYPE: "positionalSound";

  static override defineSchema(): fields.DataSchema;

  #VFXPositionalSoundComponent: true;
}

declare namespace VFXPositionalSoundComponent {
  interface Any extends VFXPositionalSoundComponent {}
  interface AnyConstructor extends Identity<typeof VFXPositionalSoundComponent> {}

  interface EffectSchema extends fields.DataSchema {
    intensity: fields.NumberField<{ required: true; nullable: false; min: 1; max: 10 }>;
    type: fields.StringField<{ required: true; blank: false }>;
  }

  interface Schema extends VFXComponent.Schema {
    channel: fields.StringField<{ required: true; blank: false; initial: "environment" }>;
    duration: fields.NumberField<{ nullable: false }>;
    easing: fields.BooleanField<{ initial: true }>;
    elevation: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    fade: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;
    gmAlways: fields.BooleanField<{ required: false; initial: true }>;
    angle: fields.AngleField<{ required: false }>;
    baseEffect: fields.SchemaField<EffectSchema, { required: false; nullable: true; initial: null }>;
    muffledEffect: fields.SchemaField<EffectSchema, { required: false; nullable: true; initial: null }>;
    radius: fields.NumberField<{ required: true; nullable: false; initial: 60; positive: true }>;
    rotation: fields.AngleField<{ required: false }>;
    src: fields.StringField<{ required: true; blank: false }>;
    volume: fields.AlphaField;
    walls: fields.BooleanField<{ initial: true }>;
    x: fields.NumberField<{ required: true; nullable: false }>;
    y: fields.NumberField<{ required: true; nullable: false }>;
  }
}

export default VFXPositionalSoundComponent;
