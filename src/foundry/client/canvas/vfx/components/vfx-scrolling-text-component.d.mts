import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXComponent from "../vfx-component.d.mts";
import type { VFXReferenceField, VFXReferencePointField } from "../fields/_module.d.mts";

/**
 * A component for displaying scrolling text effects at a canvas location using the
 * `CanvasInterfaceGroup#createScrollingText` API.
 * This can be used for damage numbers, status effects, or other floating text animations.
 */
declare class VFXScrollingTextComponent extends VFXComponent<VFXScrollingTextComponent.Schema> {
  static override TYPE: "scrollingText";

  static override defineSchema(): fields.DataSchema;

  #VFXScrollingTextComponent: true;
}

declare namespace VFXScrollingTextComponent {
  interface Any extends VFXScrollingTextComponent {}
  interface AnyConstructor extends Identity<typeof VFXScrollingTextComponent> {}

  interface Schema extends VFXComponent.Schema {
    content: VFXReferenceField;
    distance: VFXReferenceField;
    duration: VFXReferenceField;
    jitter: VFXReferenceField;
    origin: VFXReferencePointField;
    scrollDirection: VFXReferenceField;
    textAnchor: VFXReferenceField;
    textStyle: VFXReferenceField;
  }
}

export default VFXScrollingTextComponent;
