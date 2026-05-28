import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ChangeLevelRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** The movement actions which may be used to change the level. */
    movementActions: fields.SetField<fields.StringField<{ required: true; blank: false; nullable: false }>>;
  }
}

/** The data model for a behavior that prompts to change the level of Tokens that enter the Region. */
declare class ChangeLevelRegionBehaviorType extends RegionBehaviorType<ChangeLevelRegionBehaviorType.Schema> {
  #changeLevelRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.changeLevel", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ChangeLevelRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;
}

export default ChangeLevelRegionBehaviorType;
