import { expectTypeOf } from "vitest";
import type { DeepReadonly } from "fvtt-types/utils";

import BaseTokenRuler = foundry.canvas.placeables.tokens.BaseTokenRuler;
import TokenRuler = foundry.canvas.placeables.tokens.TokenRuler;
import Token = foundry.canvas.placeables.Token;

// BaseTokenRuler is abstract; exercise the surface through a minimal concrete subclass.
class MyTokenRuler extends BaseTokenRuler {
  protected override _onVisibleChange(): void {}
  override async draw(): Promise<void> {}
  override clear(): void {}
  override destroy(): void {}
  override refresh(_rulerData: DeepReadonly<TokenRuler.Data>): void {}
}

declare const someToken: Token.Implementation;
const myBTR = new MyTokenRuler(someToken);

expectTypeOf(myBTR.token).toEqualTypeOf<Token.Implementation>();
expectTypeOf(myBTR.visible).toBeBoolean();
myBTR.visible = true;
expectTypeOf(myBTR.isVisible).toBeBoolean();
expectTypeOf(myBTR.draw()).toEqualTypeOf<Promise<void>>();
expectTypeOf(myBTR.clear()).toBeVoid();
expectTypeOf(myBTR.destroy()).toBeVoid();
