import type { AnyObject } from "#utils";
import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ModifyMovementCostRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /**
     * The difficulty of each movement action, keyed by movement action name. The set of keys is
     * derived at runtime from {@linkcode CONFIG.Token.movement | CONFIG.Token.movement.actions}.
     */
    difficulties: fields.SchemaField<{
      [movementAction: string]: fields.NumberField<{
        required: true;
        nullable: true;
        initial: 1;
        step: 0.25;
        min: 0;
        max: 5;
      }>;
    }>;
  }
}

/** The data model for a behavior that allows modifying the movement cost within the Region. */
declare class ModifyMovementCostRegionBehaviorType extends RegionBehaviorType<ModifyMovementCostRegionBehaviorType.Schema> {
  #modifyMovementCostRegionBehaviorType: true;

  /** @defaultValue `["BEHAVIOR.TYPES.modifyMovementCost", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ModifyMovementCostRegionBehaviorType.Schema;

  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * Get the terrain effects to apply to a movement segment within this Region.
   * @remarks FIXME(v14): `segment` and `options` belong to the token-movement subsystem (deferred to
   * Phase 7); typed loosely as `AnyObject` until those `_types` are authored.
   */
  protected _getTerrainEffects(
    token: TokenDocument.Implementation,
    segment: AnyObject,
    options?: AnyObject,
  ): Array<{ name: string; difficulty: number | null }>;
}

export default ModifyMovementCostRegionBehaviorType;
