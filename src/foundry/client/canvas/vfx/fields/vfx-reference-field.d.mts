import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";

/**
 * This specialized data field allows storing a data structure that will be later dynamically resolved.
 * This field can be used for a value type that is a single property. If that property is numeric, the
 * reference field can store a relative delta.
 *
 * @template ValueType - the resolved value type
 */
declare class VFXReferenceField<ValueType = unknown> extends fields.DataField {
  /**
   * Construct a VFXReferenceField by providing the inner field schema that it wraps.
   */
  constructor(
    valueField: fields.DataField.Any,
    options?: fields.DataField.Options.Any,
    context?: fields.DataField.ConstructionContext,
  );

  /**
   * The schema of a reference object.
   */
  static referenceField: fields.SchemaField.Any;

  valueField: fields.DataField.Any;

  override _cast(value: unknown): unknown;

  /**
   * Resolve the value of a VFXReferenceObjectField
   * @param value      - The initial value of the field which may contain a reference
   * @param references - Provided references
   * @returns The resulting resolved value with references applied, if possible
   */
  resolve(value: unknown, references: Record<string, unknown>): ValueType | null | undefined;

  /**
   * Test whether a value is a reference.
   */
  static isReference(value: unknown): boolean;
}

declare namespace VFXReferenceField {
  interface Any extends VFXReferenceField<any> {}
  interface AnyConstructor extends Identity<typeof VFXReferenceField> {}

  /** The shape of a stored reference value. */
  interface Reference {
    reference: string;
    property?: string | undefined;
  }

  type ReferenceFieldData<ValueType = unknown> = Reference | ValueType;
}

export default VFXReferenceField;
