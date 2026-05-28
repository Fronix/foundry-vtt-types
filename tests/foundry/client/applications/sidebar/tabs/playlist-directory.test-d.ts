import { expectTypeOf } from "vitest";

import PlaylistDirectory = foundry.applications.sidebar.tabs.PlaylistDirectory;

declare const dir: PlaylistDirectory;
expectTypeOf(dir).toExtend<foundry.applications.sidebar.DocumentDirectory<Playlist.ImplementationClass>>();
expectTypeOf(dir.documentClass).toEqualTypeOf<Playlist.ImplementationClass>();
expectTypeOf(dir.currentlyPlayingLocation).toEqualTypeOf<string>();
expectTypeOf(PlaylistDirectory.formatTimestamp(90)).toEqualTypeOf<string>();
expectTypeOf(PlaylistDirectory.tabName).toEqualTypeOf<string>();
