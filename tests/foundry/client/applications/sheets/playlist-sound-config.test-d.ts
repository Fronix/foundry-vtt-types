import { expectTypeOf } from "vitest";

import PlaylistSoundConfig = foundry.applications.sheets.PlaylistSoundConfig;

declare const doc: PlaylistSound.Implementation;
const config = new PlaylistSoundConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<PlaylistSound.Implementation>();
expectTypeOf(
  PlaylistSoundConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf<PlaylistSoundConfig.RenderContext["lvolume"]>().toEqualTypeOf<number>();
expectTypeOf<PlaylistSoundConfig.RenderContext["channels"]>().toEqualTypeOf<Record<string, string>>();
