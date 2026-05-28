import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type FormDataExtended from "../ux/form-data-extended.d.mts";
import type { DeepPartial, Identity } from "#utils";
import type { Token } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TokenHUD: TokenHUD.Any;
    }
  }
}

/**
 * An implementation of the BasePlaceableHUD base class which renders a heads-up-display interface for Token objects.
 * This interface provides controls for visibility, attribute bars, elevation, status effects, and more.
 * The TokenHUD implementation can be configured and replaced via {@link CONFIG.Token.hudClass}.
 */
declare class TokenHUD<
  RenderContext extends TokenHUD.RenderContext = TokenHUD.RenderContext,
  Configuration extends TokenHUD.Configuration = TokenHUD.Configuration,
  RenderOptions extends TokenHUD.RenderOptions = TokenHUD.RenderOptions,
> extends HandlebarsApplicationMixin(BasePlaceableHUD)<
  Token.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  static override DEFAULT_OPTIONS: BasePlaceableHUD.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Convenience reference to the Actor modified by this TokenHUD.
   */
  get actor(): Actor.Implementation | null;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Get the valid status effect choices.
   */
  protected _getStatusEffectChoices(): Record<string, TokenHUD.StatusEffectChoice>;

  /**
   * Get the valid movement action choices.
   */
  protected _getMovementActionChoices(): Record<string, TokenHUD.MovementActionChoice>;

  /**
   * Get the level choices for this Token.
   */
  protected _getLevelChoices(): Record<string, TokenHUD.LevelChoice>;

  protected override _onPosition(options: DeepPartial<RenderOptions>): void;

  protected override _parseAttributeInput(
    name: string,
    attr: object | number,
    input: string,
  ): BasePlaceableHUD.ParsedAttributeInput;

  protected override _onSubmit(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended): Promise<void>;

  protected override _onSubmitElevation(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: FormDataExtended,
  ): Promise<void>;

  /**
   * @deprecated since v13 - use `TokenHUD#togglePalette("effects", active?)` instead.
   */
  toggleStatusTray(active?: boolean): void;
}

declare namespace TokenHUD {
  interface Any extends AnyTokenHUD {}
  interface AnyConstructor extends Identity<typeof AnyTokenHUD> {}

  /** A status-effect toggle choice in the HUD. */
  interface StatusEffectChoice {
    id: string;
    _id: string;
    title: string;
    src: string;
    order: number;
    isActive: boolean;
    isOverlay: boolean;
    cssClass: string;
  }

  /** A movement-action choice in the HUD. */
  interface MovementActionChoice {
    id: string;
    label: string;
    icon?: string;
    img?: string;
    isActive: boolean;
    cssClass: string;
  }

  /** A level choice in the HUD. */
  interface LevelChoice {
    id: string;
    name: string;
    cssClass: string;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, BasePlaceableHUD.RenderContext {
    canConfigure: boolean;
    canToggleCombat: boolean;
    displayBar1: boolean;
    bar1Data: object | null;
    displayBar2: boolean;
    bar2Data: object | null;
    combatClass: string;
    targetClass: string;
    statusEffects: Record<string, StatusEffectChoice>;
    movementActions: Record<string, MovementActionChoice>;
    movementActionsConfig: object;
    levels: Record<string, LevelChoice>;
    canChangeLevel: boolean;
  }

  interface Configuration extends HandlebarsApplicationMixin.Configuration, BasePlaceableHUD.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, BasePlaceableHUD.RenderOptions {}
}

declare abstract class AnyTokenHUD extends TokenHUD<
  TokenHUD.RenderContext,
  TokenHUD.Configuration,
  TokenHUD.RenderOptions
> {
  constructor(...args: never);
}

export default TokenHUD;
