import { expectTypeOf } from "vitest";

import FrameViewer = foundry.applications.sidebar.apps.FrameViewer;
import ChatPopout = foundry.applications.sidebar.apps.ChatPopout;
import InvitationLinks = foundry.applications.sidebar.apps.InvitationLinks;
import WorldConfig = foundry.applications.sidebar.apps.WorldConfig;

declare const popout: ChatPopout;
expectTypeOf(popout.message).toEqualTypeOf<ChatMessage.Implementation>();
expectTypeOf(popout.title).toEqualTypeOf<string>();
expectTypeOf<ChatPopout.Configuration["message"]>().toEqualTypeOf<ChatMessage.Implementation>();
expectTypeOf<FrameViewer.Configuration["url"]>().toEqualTypeOf<string>();

declare const world: WorldConfig;
expectTypeOf(world.title).toEqualTypeOf<string>();

expectTypeOf(InvitationLinks.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
