import type { Identity } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { fields } from "#common/data/_module.d.mts";
import type VFXReferenceObjectField from "./vfx-reference-object-field.d.mts";

/**
 * A specialized subclass of VFXReferenceObjectField that specifically deals with points.
 *
 * @example Resolve a relative point into an absolute coordinate.
 * ```js
 * const point = new VFXReferencePointField();
 * const unresolvedValue = {reference: "target", deltas: {x: -50, y: 50}};
 * const references = {target: tokenDocument}; // Suppose tokenDocument.x is 1000 and tokenDocument.y is 2000
 * const resolvedObject = point.resolve(unresolvedValue, references); // {x: 950, y: 2050}
 * ```
 */
declare class VFXReferencePointField extends VFXReferenceObjectField<Canvas.Point> {
  constructor(options?: fields.DataField.Options.Any, context?: fields.DataField.ConstructionContext);
}

declare namespace VFXReferencePointField {
  interface Any extends VFXReferencePointField {}
  interface AnyConstructor extends Identity<typeof VFXReferencePointField> {}
}

export default VFXReferencePointField;
