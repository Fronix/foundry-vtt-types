import type { Identity } from "#utils";
import type { DataModel } from "#common/abstract/_module.d.mts";
import type { DataSchema } from "#common/data/fields.d.mts";
import type { fields as clientFields } from "#client/data/_module.d.mts";
import type { AbstractBaseShader } from "#client/canvas/rendering/shaders/_module.d.mts";

import fields = foundry.data.fields;

/**
 * Turn marker configuration data model.
 * @remarks Mixes in {@linkcode TurnMarkerData.TurnMarkerAnimationData}.
 */
declare class TurnMarkerData extends DataModel<TurnMarkerData.Schema> {
  static override defineSchema(): TurnMarkerData.Schema;
}

declare namespace TurnMarkerData {
  interface Any extends AnyTurnMarkerData {}
  interface AnyConstructor extends Identity<typeof AnyTurnMarkerData> {}

  interface Schema extends DataSchema {
    /** The ID of the animation. */
    id: fields.StringField<{ blank: false; nullable: false }>;

    /** The label for the animation. */
    label: fields.StringField<{ blank: false; nullable: false }>;

    /** The configuration of the animation. */
    config: fields.SchemaField<{
      /** A shader class to apply or null. */
      shader: clientFields.ShaderField;

      /** The spin speed for the animation. */
      spin: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

      /** The pulse settings. */
      pulse: fields.SchemaField<{
        /** The speed of the pulse. */
        speed: fields.NumberField<{ required: true; nullable: false; initial: 0 }>;

        /** The minimum pulse value. */
        min: fields.NumberField<{ required: true; nullable: false; initial: 0.8 }>;

        /** The maximum pulse value. */
        max: fields.NumberField<{ required: true; nullable: false; initial: 1 }>;
      }>;
    }>;
  }

  /** The turn marker animation data. */
  interface TurnMarkerAnimationData {
    /** The ID of the animation. */
    id: string;

    /** The label for the animation. */
    label: string;

    /** The configuration of the animation. */
    config?: TurnMarkerAnimationConfigData | undefined;
  }

  /** The turn marker config data. */
  interface TurnMarkerAnimationConfigData {
    /** The spin speed for the animation. */
    spin?: number | undefined;

    /** The pulse settings. */
    pulse: {
      /** The speed of the pulse. */
      speed?: number | undefined;

      /** The minimum pulse value. */
      min?: number | undefined;

      /** The maximum pulse value. */
      max?: number | undefined;
    };

    /** A shader class to apply or null. */
    shader?: typeof AbstractBaseShader | null | undefined;
  }
}

export default TurnMarkerData;

declare abstract class AnyTurnMarkerData extends TurnMarkerData {
  constructor(...args: never);
}
