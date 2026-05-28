import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";
import type PointSourcePolygon from "#client/canvas/geometry/shapes/source-polygon.d.mts";
import type VFXReferenceField from "./vfx-reference-field.d.mts";

/**
 * A specialized VFX reference field that accepts either a pre-computed {@linkcode PointSourcePolygon} instance
 * or a serializable configuration object `{x, y, type, radius}` sufficient to create one.
 *
 * In both cases, the initialized value accessed by the component is always a PointSourcePolygon instance
 * (or `null`/`undefined` if not configured).
 */
declare class VFXPointSourcePolygonField extends VFXReferenceField<PointSourcePolygon> {
  constructor(options?: fields.DataField.Options.Any, context?: fields.DataField.ConstructionContext);

  override resolve(value: unknown, references: Record<string, unknown>): PointSourcePolygon | null | undefined;
}

declare namespace VFXPointSourcePolygonField {
  interface Any extends VFXPointSourcePolygonField {}
  interface AnyConstructor extends Identity<typeof VFXPointSourcePolygonField> {}
}

export default VFXPointSourcePolygonField;
