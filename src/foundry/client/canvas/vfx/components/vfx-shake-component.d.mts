import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type { VFXReferenceField } from "../fields/_module.d.mts";

/**
 * A component that applies a canvas shake effect to a target PIXI display object using the `CanvasShakeEffect` API.
 * Primarily intended for camera shakes (`canvas.stage`) but can also target individual canvas layers or groups.
 */
declare class VFXShakeComponent extends VFXComponent<VFXShakeComponent.Schema> {
  static override TYPE: "shake";

  static override defineSchema(): fields.DataSchema;

  #VFXShakeComponent: true;
}

declare namespace VFXShakeComponent {
  interface Any extends VFXShakeComponent {}
  interface AnyConstructor extends Identity<typeof VFXShakeComponent> {}

  interface Schema extends VFXComponent.Schema {
    duration: fields.NumberField<{ required: true; nullable: false; initial: 5000; positive: true }>;
    maxDisplacement: fields.NumberField<{ required: true; nullable: false; initial: 35; positive: true }>;
    returnSpeed: fields.NumberField<{ required: true; nullable: false; initial: 0.1; min: 0; max: 1 }>;
    seed: fields.NumberField<{ initial: null }>;
    smoothness: fields.NumberField<{ required: true; nullable: false; initial: 0.5; min: 0; max: 1 }>;
    target: VFXReferenceField;
  }
}

export default VFXShakeComponent;
