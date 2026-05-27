import { expectTypeOf } from "vitest";

import PlaylistConfig = foundry.applications.sheets.PlaylistConfig;

declare const doc: Playlist.Implementation;
const config = new PlaylistConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Playlist.Implementation>();
expectTypeOf(PlaylistConfig.DEFAULT_OPTIONS).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(PlaylistConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf<PlaylistConfig.RenderContext["buttons"]>().toEqualTypeOf<
  foundry.applications.api.ApplicationV2.FormFooterButton[]
>();
