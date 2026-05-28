import type { Identity } from "#utils";
import type { fields } from "#common/data/_module.d.mts";

/**
 * A specialized subclass of SchemaField that specifically deals with points.
 * This data structure accepts plain objects with `{x, y}` structure or PIXI.Point objects.
 */
declare class VFXPointField<
  const Options extends fields.SchemaField.Options<VFXPointField.Schema> = fields.SchemaField.DefaultOptions,
> extends fields.SchemaField<VFXPointField.Schema, Options> {
  constructor(options?: Options, context?: fields.DataField.ConstructionContext);
}

declare namespace VFXPointField {
  interface Any extends VFXPointField<any> {}
  interface AnyConstructor extends Identity<typeof VFXPointField> {}

  interface Schema extends fields.DataSchema {
    x: fields.NumberField<{ required: true; nullable: false }>;
    y: fields.NumberField<{ required: true; nullable: false }>;
  }
}

export default VFXPointField;
