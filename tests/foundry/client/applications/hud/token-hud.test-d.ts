import { expectTypeOf } from "vitest";

import TokenHUD = foundry.applications.hud.TokenHUD;
import Token = foundry.canvas.placeables.Token;

declare const hud: TokenHUD;

expectTypeOf(hud.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(hud.object).toEqualTypeOf<Token.Implementation>();
expectTypeOf(hud.document).toEqualTypeOf<Token.Implementation["document"]>();
expectTypeOf(hud.activePalette).toEqualTypeOf<string | null>();
expectTypeOf<TokenHUD.RenderContext["canChangeLevel"]>().toEqualTypeOf<boolean>();
expectTypeOf<TokenHUD.StatusEffectChoice["isOverlay"]>().toEqualTypeOf<boolean>();
