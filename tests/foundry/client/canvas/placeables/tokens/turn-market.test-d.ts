import { expectTypeOf } from "vitest";

import TokenTurnMarker = foundry.canvas.placeables.tokens.TokenTurnMarker;
import TurnMarkerData = foundry.canvas.placeables.tokens.TurnMarkerData;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;
import Token = foundry.canvas.placeables.Token;

declare const someToken: Token.Implementation;

const myTTM = new TokenTurnMarker(someToken);

expectTypeOf(myTTM).toExtend<PIXI.Container>();
expectTypeOf(myTTM.token).toEqualTypeOf<Token.Implementation>();
expectTypeOf(myTTM.mesh).toEqualTypeOf<SpriteMesh>();
expectTypeOf(myTTM.animation).toEqualTypeOf<TurnMarkerData.TurnMarkerAnimationConfigData>();

expectTypeOf(myTTM.draw()).toEqualTypeOf<Promise<void>>();
expectTypeOf(myTTM.animate(16.7)).toBeVoid();
