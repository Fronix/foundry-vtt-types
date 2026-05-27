import { expectTypeOf } from "vitest";

import type { AnyObject } from "fvtt-types/utils";

import TokenLayer = foundry.canvas.layers.TokenLayer;
import Token = foundry.canvas.placeables.Token;
import Canvas = foundry.canvas.Canvas;
import TokenHUD = foundry.applications.hud.TokenHUD;
import SceneControls = foundry.applications.ui.SceneControls;

expectTypeOf(TokenLayer.documentName).toEqualTypeOf<"Token">();
expectTypeOf(TokenLayer.instance).toEqualTypeOf<TokenLayer | undefined>();
expectTypeOf(TokenLayer.layerOptions).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(TokenLayer.layerOptions.name).toEqualTypeOf<"tokens">();
expectTypeOf(TokenLayer.layerOptions.objectClass).toEqualTypeOf<Token.ImplementationClass>();

const layer = new TokenLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<Token.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<TokenLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tokens">();

expectTypeOf(layer._rulerPaths).toEqualTypeOf<PIXI.Container>();
expectTypeOf(layer["_tabIndex"]).toEqualTypeOf<number | null>();
expectTypeOf(layer._draggedToken).toEqualTypeOf<Token.Implementation | null>();
expectTypeOf(layer._dragMovementAction).toEqualTypeOf<string | null>();
expectTypeOf(layer._movementPlanningContext).toEqualTypeOf<AnyObject | null>();
expectTypeOf(layer._placementContext).toEqualTypeOf<AnyObject | null>();
expectTypeOf(layer.occlusionMode).toExtend<foundry.CONST.OCCLUSION_MODES>();
layer.occlusionMode = CONST.OCCLUSION_MODES.RADIAL;
expectTypeOf(layer.hookName).toEqualTypeOf<"TokenLayer">();
expectTypeOf(layer.hud).toEqualTypeOf<TokenHUD>();
expectTypeOf(layer.ownedTokens).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer.turnMarkers).toEqualTypeOf<Set<Token.Implementation>>();
expectTypeOf(layer.getSnappedPoint({ x: 4, y: 5 })).toEqualTypeOf<Canvas.Point>();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_deactivate"]()).toBeVoid();

declare const someToken: Token.Implementation;

expectTypeOf(layer["_getMovableObjects"]()).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer["_getMovableObjects"](null, null)).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer["_getMovableObjects"](["id1", "id2"], false)).toEqualTypeOf<Token.Implementation[]>();

expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 })).toBeNumber();
expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: null })).toBeNumber();
expectTypeOf(layer.targetObjects({ x: 0, y: 0, width: 500, height: 500 }, { releaseOthers: true })).toBeNumber();

expectTypeOf(layer.cycleTokens()).toEqualTypeOf<Token.Implementation | null>();
expectTypeOf(layer.cycleTokens(true, false)).toEqualTypeOf<Token.Implementation | null>();
expectTypeOf(layer.cycleTokens(undefined, null)).toEqualTypeOf<Token.Implementation | null>();

expectTypeOf(layer["_getCycleOrder"]()).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer.concludeAnimation()).toBeVoid();
expectTypeOf(layer["_animateTargets"]()).toBeVoid();
expectTypeOf(layer["_getOccludableTokens"]()).toEqualTypeOf<Token.Implementation[]>();
expectTypeOf(layer["_getCopyableObjects"]({ cut: false })).toEqualTypeOf<Token.Implementation[]>();

const kbUpdates = layer["_prepareKeyboardMovementUpdates"]([someToken], 1, 0, -1);
expectTypeOf(kbUpdates[0]).toEqualTypeOf<AnyObject[]>();
expectTypeOf(kbUpdates[1]).toEqualTypeOf<AnyObject | undefined>();

expectTypeOf(layer.setTargets(["id1", "id2"])).toBeVoid();
expectTypeOf(layer.setTargets(new Set(["id1"]), { mode: "acquire" })).toBeVoid();
expectTypeOf(layer.setTargets(["id1"], { mode: null })).toBeVoid();

expectTypeOf(layer.recalculatePlannedMovementPaths()).toBeVoid();
declare const someUser: User.Implementation;
expectTypeOf(layer["_updatePlannedMovements"](someUser, null)).toBeVoid();
expectTypeOf(layer["_updatePlannedMovements"](someUser, { tokenId: null })).toBeVoid();

expectTypeOf(layer._cancelPlacement()).toBeVoid();
expectTypeOf(layer._cancelMovementPlanning()).toBeVoid();

expectTypeOf(TokenLayer.prepareSceneControls()).toEqualTypeOf<SceneControls.Control>();
expectTypeOf(layer["_highlightObjects"](true)).toBeVoid();

expectTypeOf(layer.placeTokens([])).toEqualTypeOf<Promise<TokenDocument.Implementation[]>>();

// `storeHistory` tests omitted due to current breakage of document `.toObject()` typing
// The override does not change the public signature, so they'd be redundant over the `PlaceablesLayer` tests in any case

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someWheelEvent: WheelEvent;
declare const someKeyEvent: KeyboardEvent;
declare const someDragEvent: DragEvent;
declare const someTokenDocs: TokenDocument.Implementation[];

expectTypeOf(layer["_onCycleViewKey"](someKeyEvent)).toBeBoolean();
expectTypeOf(layer["_confirmDeleteKey"](someTokenDocs)).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(layer["_onDismissKey"](someKeyEvent)).toBeBoolean();

expectTypeOf(
  layer["_onDropActiveEffect"](someDragEvent, { type: "ActiveEffect", uuid: "SomeUUID", x: 20, y: 30 }),
).toEqualTypeOf<Promise<void>>();
expectTypeOf(
  layer["_onDropActorData"](someDragEvent, {
    type: "Actor",
    uuid: "SomeUUID",
    x: 20,
    y: 30000,
  }),
).toEqualTypeOf<
  Promise<foundry.applications.ui.Notifications.Notification<"warning"> | false | TokenDocument.Implementation>
>();
expectTypeOf(layer["_onClickLeft"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickLeft2"](pointerEvent)).toEqualTypeOf<boolean | void>();
expectTypeOf(layer["_onClickRight"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onClickRight2"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](someWheelEvent)).toEqualTypeOf<Promise<Token.Implementation[] | void>>();
