import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type VFXReferenceField from "./vfx-reference-field.d.mts";

/**
 * A subclass of VFXReferenceField which is used to target an entire object.
 * This allows applying deltas to multiple properties of that object.
 *
 * @template ValueType - the resolved object type
 */
declare class VFXReferenceObjectField<ValueType extends object = object> extends VFXReferenceField<ValueType> {
  constructor(
    schema: fields.DataField.Any,
    options?: fields.DataField.Options.Any,
    context?: fields.DataField.ConstructionContext,
  );

  static override referenceField: fields.SchemaField.Any;

  override resolve(value: unknown, references: Record<string, unknown>): ValueType;
}

declare namespace VFXReferenceObjectField {
  interface Any extends VFXReferenceObjectField<any> {}
  interface AnyConstructor extends Identity<typeof VFXReferenceObjectField> {}
}

export default VFXReferenceObjectField;
