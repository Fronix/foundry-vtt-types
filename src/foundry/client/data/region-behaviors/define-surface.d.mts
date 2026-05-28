import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace DefineSurfaceRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /**
     * Is the surface at the bottom or top of the elevation range, or are there surfaces at both?
     * @defaultValue `"bottom"`
     */
    placement: fields.StringField<{
      required: true;
      blank: false;
      initial: "bottom";
      choices: Record<"bottom" | "top" | "both", string>;
    }>;

    /**
     * Does the surface restrict light?
     * @defaultValue `true`
     */
    light: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface restrict movement?
     * @defaultValue `true`
     */
    move: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface restrict sight?
     * @defaultValue `true`
     */
    sight: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface restrict sound?
     * @defaultValue `true`
     */
    sound: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface cause occlusion?
     * @defaultValue `true`
     */
    occlusion: fields.BooleanField<{ initial: true }>;

    /**
     * Does the surface cause exposure?
     * @defaultValue `false`
     */
    exposure: fields.BooleanField;

    /**
     * Does the surface cause culling?
     * @defaultValue `false`
     */
    culling: fields.BooleanField;
  }
}

/** The data model for a behavior that defines surface(s) that can restrict light, movement, sight, and sound. */
declare class DefineSurfaceRegionBehaviorType extends RegionBehaviorType<DefineSurfaceRegionBehaviorType.Schema> {
  #defineSurfaceRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.defineSurface", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): DefineSurfaceRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * Restricts darkness? Darkness is restricted if and only if light is restricted.
   */
  get darkness(): boolean;
}

export default DefineSurfaceRegionBehaviorType;
