import type { AnyObject, HandleEmptyObject, Identity, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { PlaceableObject, Token } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      TokenLayer: TokenLayer.Any;
    }
  }
}

/**
 * The Tokens Container
 */
declare class TokenLayer extends PlaceablesLayer<"Token"> {
  constructor();

  /**
   * The ruler paths.
   * @remarks Foundry marked `@internal`. This Container's `eventMode` is set to `"none"`.
   */
  _rulerPaths: PIXI.Container;

  /**
   * The current index position in the tab cycle
   * @defaultValue `null`
   * @remarks Foundry marked `@internal`
   */
  protected _tabIndex: number | null;

  /**
   * The Token that the drag workflow was initiated on, if there's a drag workflow in progress.
   * @defaultValue `null`
   * @remarks Foundry marked `@internal`. Set in {@link Token._onDragLeftStart | `Token#_onDragLeftStart`} and
   * {@link Token._onDragLeftCancel | `Token#_onDragLeftCancel`}.
   */
  _draggedToken: Token.Implementation | null;

  /**
   * The currently selected movement action override.
   * @defaultValue `null`
   * @remarks Foundry marked `@internal`
   */
  _dragMovementAction: string | null;

  /**
   * The movement planning context.
   * @defaultValue `null`
   * @remarks Foundry marked `@internal`
   */
  // FIXME: the context's object type references the token-movement subsystem (TokenMovementOptions,
  // TokenConstrainMovementPathOptions, TokenPosition, TokenMovementWaypoint, …) → Phase 7.
  _movementPlanningContext: AnyObject | null;

  /**
   * The placement context.
   * @defaultValue `null`
   * @remarks Foundry marked `@internal`
   */
  // FIXME: the context's object type references the token placement/movement subsystem → Phase 7.
  _placementContext: AnyObject | null;

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["tokens"];

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: TokenLayer.LayerOptions;

  /**
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "tokens",
   *  controllableObjects: true,
   *  rotatableObjects: true,
   *  keyboardMovableObjects: true,
   *  confirmDeleteKey: true,
   *  zIndex: 200
   * })
   * ```
   */
  static override get layerOptions(): TokenLayer.LayerOptions;

  static override documentName: "Token";

  /**
   * The set of tokens that trigger occlusion (a union of {@linkcode CONST.TOKEN_OCCLUSION_MODES}).
   */
  set occlusionMode(value: foundry.CONST.OCCLUSION_MODES);

  get occlusionMode();

  override get hookName(): "TokenLayer";

  /**
   * Token objects on this layer utilize the TokenHUD
   */
  get hud(): NonNullable<Canvas["hud"]>["token"];

  /**
   * An Array of tokens which belong to actors which are owned
   */
  get ownedTokens(): Token.Implementation[];

  /**
   * A Set of Token objects which currently display a combat turn marker.
   */
  turnMarkers: Set<Token.Implementation>;

  /** @remarks Forces top left corner snapping */
  override getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _prepareKeyboardMovementUpdates(
    objects: Token.Implementation[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): [updates: AnyObject[], options?: AnyObject];

  protected override _draw(options: HandleEmptyObject<TokenLayer.DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<TokenLayer.TearDownOptions>): Promise<void>;

  protected override _activate(): void;

  protected override _deactivate(): void;

  /**
   * Target all Token instances which fall within a coordinate rectangle.
   * @param rectangle - The selection rectangle.
   * @param options   - Additional options to configure targeting behaviour.
   * @returns The number of Token instances which were targeted.
   */
  targetObjects(
    rectangle: Canvas.Rectangle,
    options?: TokenLayer.TargetObjectsOptions, // not:null (destructured)
  ): number;

  /**
   * Assign multiple token targets
   * @param targetIds - The array or set of Token IDs.
   * @param options   - Additional options to configure targeting behaviour.
   */
  setTargets(
    targetIds: string[] | Set<string>,
    options?: TokenLayer.SetTargetsOptions, // not:null (destructured)
  ): void;

  /**
   * Cycle the controlled token by rotating through the list of Owned Tokens that are available within the Scene
   * Tokens are currently sorted in order of their TokenID
   * @param forwards - Which direction to cycle. A truthy value cycles forward, while a false value cycles backwards.
   * @param reset    - Restart the cycle order back at the beginning?
   * @returns The Token object which was cycled to, or null
   * @remarks Neither parameter has a default, so a call with no arguments cycles backward without resetting
   *
   * Also selects the returned token if any, and pans the camera to its center
   */
  cycleTokens(forwards?: boolean | null, reset?: boolean | null): Token.Implementation | null;

  /**
   * Get the tab cycle order for tokens by sorting observable tokens based on their distance from top-left.
   * @remarks Foundry marked `@private`
   */
  protected _getCycleOrder(): Token.Implementation[];

  /**
   * Immediately conclude the animation of any/all tokens
   */
  concludeAnimation(): void;

  /**
   * Animate targeting arrows on targeted tokens.
   */
  protected _animateTargets(): void;

  /**
   * Recalculate the planned movement paths of all Tokens for the current User.
   */
  recalculatePlannedMovementPaths(): void;

  /**
   * Handle broadcast planned movement update.
   * @param user             - The User the planned movement data belongs to
   * @param plannedMovements - The planned movement data
   * @remarks Foundry marked `@internal`
   */
  // FIXME: values are `TokenPlannedMovement | null` → Phase 7 (token-movement subsystem).
  protected _updatePlannedMovements(
    user: User.Implementation,
    plannedMovements: Record<string, object | null> | null,
  ): void;

  /**
   * Provide an array of Tokens which are eligible subjects for overhead tile occlusion.
   * By default, only tokens which are currently controlled or owned by a player are included as subjects.
   */
  protected _getOccludableTokens(): Token.Implementation[];

  /** @remarks Returns `[]` if the ruler is currently measuring */
  protected override _getMovableObjects(ids?: string[] | null, includeLocked?: boolean | null): Token.Implementation[];

  protected override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Token.Implementation[];

  /** @remarks "Clean actorData and delta updates from the history so changes to those fields are not undone" */
  override storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, "Token">,
    options?: AnyObject,
  ): void;

  protected override _onCycleViewKey(event: KeyboardEvent): boolean;

  protected override _confirmDeleteKey(documents: TokenDocument.Implementation[]): Promise<boolean>;

  /**
   * Prepare data used by SceneControls to register tools used by this layer.
   */
  static override prepareSceneControls(): SceneControls.Control;

  protected override _highlightObjects(active: boolean): void;

  /**
   * Place Tokens at the cursor.
   * Each Token is placed one after the other in the given order.
   * The placed Tokens can be rotated with the mouse wheel unless the `allowRotation` is false.
   * @param data    - The data of the Tokens to place
   * @param options - Additional options
   * @returns The Token documents that were placed and not rejected by preCreate.
   */
  // FIXME: `options`' placement callbacks (onMove/onRotate/…) reference the token placement/movement
  // subsystem (TokenPosition, TokenMovementWaypoint, …) → Phase 7.
  placeTokens(
    data: Iterable<TokenDocument.CreateData>,
    options?: AnyObject, // not:null (destructured)
  ): Promise<TokenDocument.Implementation[]>;

  /**
   * Handle dropping of ActiveEffect data onto a Token, creating a new ActiveEffect on the corresponding Actor.
   * @remarks Foundry marked `@internal`
   */
  protected _onDropActiveEffect(event: DragEvent, data: TokenLayer.DropActiveEffectData): Promise<void>;

  /**
   * Handle dropping of Actor data onto the Scene canvas
   * @remarks Foundry marked `@internal`
   */
  protected _onDropActorData(
    event: DragEvent,
    data: TokenLayer.DropData,
  ): Promise<ReturnType<foundry.applications.ui.Notifications["warn"]> | false | TokenDocument.Implementation>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _onClickLeft2(event: Canvas.Event.Pointer): boolean | void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  protected override _onClickRight2(event: Canvas.Event.Pointer): void;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<Token.Implementation[] | void>;

  protected override _onDismissKey(event: KeyboardEvent): boolean;

  /**
   * Cancel the placement.
   * @remarks Foundry marked `@internal`
   */
  _cancelPlacement(): void;

  /**
   * Cancel movement planning.
   * @remarks Foundry marked `@internal`
   */
  _cancelMovementPlanning(): void;
}

declare namespace TokenLayer {
  interface Any extends AnyTokenLayer {}
  interface AnyConstructor extends Identity<typeof AnyTokenLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Token.ImplementationClass> {
    name: "tokens";
    controllableObjects: true;
    rotatableObjects: true;
    keyboardMovableObjects: true;
    confirmDeleteKey: true;
    zIndex: 200;
  }

  interface DropData extends Canvas.DropPosition {
    type: "Actor";
    uuid: string;

    /** @remarks The elevation at the drop position, if any */
    elevation?: number | undefined;
  }

  interface DropActiveEffectData extends Canvas.DropPosition {
    type: "ActiveEffect";
    uuid: string;
  }

  /** @internal */
  // TODO: the NP should probably be on the PO side, update once PO has been done
  type _TargetObjectsOptions = NullishProps<PlaceableObject.ControlOptions>;

  interface TargetObjectsOptions extends _TargetObjectsOptions {}

  /** @internal */
  type _SetTargetsOptions = NullishProps<{
    /**
     * The mode that determines the targeting behavior.
     * - `"replace"` (default): Replace the current set of targeted Tokens with provided set of Tokens.
     * - `"acquire"`: Acquire the given Tokens as targets without releasing already targeted Tokens.
     * - `"release"`: Release the given Tokens as targets.
     * @defaultValue `"replace"`
     */
    mode: "replace" | "acquire" | "release";
  }>;

  interface SetTargetsOptions extends _SetTargetsOptions {}
}

export default TokenLayer;

declare abstract class AnyTokenLayer extends TokenLayer {
  constructor(...args: never);
}
