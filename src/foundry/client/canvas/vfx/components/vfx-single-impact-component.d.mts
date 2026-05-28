import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type { VFXReferenceField, VFXReferenceObjectField, VFXReferencePointField } from "../fields/_module.d.mts";

/**
 * A VFX component which displays a single impact effect (a texture, optional sound, and animations) at a target
 * position.
 */
declare class VFXSingleImpactComponent extends VFXComponent<VFXSingleImpactComponent.Schema> {
  static override TYPE: "singleImpact";

  static override defineSchema(): fields.DataSchema;

  #VFXSingleImpactComponent: true;
}

declare namespace VFXSingleImpactComponent {
  interface Any extends VFXSingleImpactComponent {}
  interface AnyConstructor extends Identity<typeof VFXSingleImpactComponent> {}

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

  interface Schema extends VFXComponent.Schema {
    position: VFXReferenceObjectField;
    texture: fields.StringField<{ required: true }>;
    duration: fields.NumberField<{ required: true; nullable: false; initial: 1000 }>;
    scale: VFXReferencePointField;
    size: VFXReferenceField;
    sound: fields.SchemaField<SoundSchema, { nullable: true; initial: null }>;
    animations: fields.ArrayField<fields.SchemaField<AnimationSchema>>;
  }
}

export default VFXSingleImpactComponent;
