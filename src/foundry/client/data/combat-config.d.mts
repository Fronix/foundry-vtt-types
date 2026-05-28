import type { fields } from "#client/data/_module.d.mts";

/**
 * A configuration class managing the Combat Turn Markers.
 */
declare class CombatConfiguration {
  constructor();

  /** The world setting key under which combat tracker configuration is stored. */
  static CONFIG_SETTING: "combatTrackerConfig";

  /** The data schema for the combat tracker configuration setting. */
  static get schema(): foundry.data.fields.SchemaField.Any;

  /** Initialize the singleton configuration instance. */
  static initialize(): void;

  /** Register the combat tracker configuration setting. */
  static registerSettings(): void;

  /** The turn marker configuration. */
  get turnMarker(): CombatConfiguration.TurnMarker;

  /** The resource identifier tracked in the combat tracker. */
  get resource(): string;

  /** Whether defeated combatants are skipped during combat. */
  get skipDefeated(): boolean;

  /** The currently-selected turn marker animation configuration. */
  get currentTurnMarkerAnimation(): object | undefined;

  /** All registered turn marker animations. */
  get turnMarkerAnimations(): Record<string, object>;

  /**
   * Register a new turn marker animation.
   * @param id     - The animation identifier.
   * @param config - The animation configuration.
   */
  addTurnMarkerAnimation(id: string, config: object): void;

  /**
   * Get a registered turn marker animation by its identifier.
   * @param id - The animation identifier.
   */
  getTurnMarkerAnimation(id: string): object | undefined;

  /**
   * Use the turn marker animation with the given identifier.
   * @param animationId - The animation identifier.
   */
  useTurnMarkerAnimation(animationId: string): boolean;

  static #private: true;
}

declare namespace CombatConfiguration {
  interface TurnMarkerSchema extends fields.DataSchema {
    enabled: fields.BooleanField<{ required: true; initial: true }>;
    animation: fields.StringField<{ initial: "spin" }>;
    src: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"]; blank: true; initial: "" }>;
    disposition: fields.BooleanField;
  }

  interface ConfigSettingSchema extends fields.DataSchema {
    resource: fields.StringField<{ required: true; blank: true; initial: "" }>;
    skipDefeated: fields.BooleanField<{ required: true; initial: false }>;
    turnMarker: fields.SchemaField<TurnMarkerSchema>;
  }

  interface SettingData extends fields.SchemaField.InitializedData<ConfigSettingSchema> {}

  /** Default combat tracker settings used in Foundry VTT. */
  interface Data {
    /**
     * A resource identifier for the tracker.
     */
    resource: string;

    /**
     * Whether to skip defeated tokens during combat.
     */
    skipDefeated: boolean;

    /**
     * Turn marker configuration.
     */
    turnMarker: TurnMarker;
  }

  interface TurnMarker {
    /**
     * Whether the turn marker is enabled.
     */
    enabled: boolean;

    /**
     * The file path for the turn marker icon.
     */
    path: string;

    /**
     * The identifier for the default turn marker animation.
     */
    animation: string;

    /**
     * Tint the turn marker according to token disposition.
     */
    disposition: string;
  }
}

export default CombatConfiguration;
