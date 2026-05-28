import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type { VFXReferenceField, VFXReferenceObjectField, VFXReferencePointField } from "../fields/_module.d.mts";

/**
 * A base class VFX component used for single actor → target direct attacks. It orchestrates a charge, projectile,
 * and impact step along a configured path.
 */
declare class VFXSingleAttackComponent extends VFXComponent<VFXSingleAttackComponent.Schema> {
  static override TYPE: "singleAttack";

  static override defineSchema(): fields.DataSchema;

  #VFXSingleAttackComponent: true;
}

declare namespace VFXSingleAttackComponent {
  interface Any extends VFXSingleAttackComponent {}
  interface AnyConstructor extends Identity<typeof VFXSingleAttackComponent> {}

  interface SoundSchema extends fields.DataSchema {
    src: fields.StringField<{ required: true; blank: false }>;
    align: fields.NumberField<{ required: true; nullable: false }>;
    volume: fields.AlphaField;
    radius: fields.NumberField<{ required: true; nullable: false; initial: 60; positive: true }>;
    easing: fields.BooleanField<{ initial: true }>;
    walls: fields.BooleanField<{ initial: true }>;
  }

  interface AnimationSchema extends fields.DataSchema {
    function: fields.StringField<{ required: true }>;
    params: VFXReferenceField;
  }

  /** The shared schema of a charge/projectile/impact attack step. */
  interface AttackStepSchema extends fields.DataSchema {
    texture: fields.StringField<{ required: true }>;
    duration: fields.NumberField<{ required: true; nullable: false; initial: 1000 }>;
    scale: VFXReferencePointField;
    size: VFXReferenceField;
    animations: fields.ArrayField<fields.SchemaField<AnimationSchema>>;
    sound: fields.SchemaField<SoundSchema, { nullable: true; initial: null }>;
  }

  interface ProjectileStepSchema extends AttackStepSchema {
    speed: fields.NumberField<{ required: false }>;
  }

  interface PathTypeSchema extends fields.DataSchema {
    type: fields.StringField<{ required: true; initial: "linear" }>;
    params: fields.ObjectField<{ required: false }>;
  }

  interface Schema extends VFXComponent.Schema {
    path: fields.ArrayField<VFXReferenceObjectField, { required: true; min: 2 }>;
    pathType: fields.SchemaField<PathTypeSchema>;
    charge: fields.SchemaField<AttackStepSchema>;
    projectile: fields.SchemaField<ProjectileStepSchema>;
    impact: fields.SchemaField<AttackStepSchema>;
  }
}

export default VFXSingleAttackComponent;
