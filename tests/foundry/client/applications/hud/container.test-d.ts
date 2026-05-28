import { expectTypeOf } from "vitest";

import HeadsUpDisplayContainer = foundry.applications.hud.HeadsUpDisplayContainer;

declare const hud: HeadsUpDisplayContainer;

expectTypeOf(hud.token).toEqualTypeOf<foundry.applications.hud.TokenHUD>();
expectTypeOf(hud.tile).toEqualTypeOf<foundry.applications.hud.TileHUD>();
expectTypeOf(hud.drawing).toEqualTypeOf<foundry.applications.hud.DrawingHUD>();
expectTypeOf(hud.bubbles).toEqualTypeOf<foundry.canvas.animation.ChatBubbles>();
expectTypeOf(hud.align()).toEqualTypeOf<void>();
