import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import DrawingPalette = foundry.applications.sheets.palette.DrawingPalette;
import AmbientLightPalette = foundry.applications.sheets.palette.AmbientLightPalette;
import AmbientSoundPalette = foundry.applications.sheets.palette.AmbientSoundPalette;
import NotePalette = foundry.applications.sheets.palette.NotePalette;
import RegionPalette = foundry.applications.sheets.palette.RegionPalette;
import TilePalette = foundry.applications.sheets.palette.TilePalette;
import WallPalette = foundry.applications.sheets.palette.WallPalette;

// Statics added by the mixin / set on the leaves.
expectTypeOf(DrawingPalette.SETTING_KEY).toEqualTypeOf<"drawingPalette">();
expectTypeOf(DrawingPalette.documentName).toEqualTypeOf<"Drawing">();
expectTypeOf(DrawingPalette.createData).toEqualTypeOf<AnyObject>();
expectTypeOf(DrawingPalette.schema).toEqualTypeOf<foundry.data.fields.SchemaField.Any>();
expectTypeOf(DrawingPalette.isActivePreset({})).toBeBoolean();
expectTypeOf(DrawingPalette.COMMIT_TOOL).toEqualTypeOf<string | undefined>();

expectTypeOf(AmbientLightPalette.SETTING_KEY).toEqualTypeOf<"ambientLightPalette">();
expectTypeOf(AmbientSoundPalette.SETTING_KEY).toEqualTypeOf<"ambientSoundPalette">();
expectTypeOf(NotePalette.SETTING_KEY).toEqualTypeOf<"notePalette">();
expectTypeOf(RegionPalette.SETTING_KEY).toEqualTypeOf<"regionPalette">();
expectTypeOf(TilePalette.SETTING_KEY).toEqualTypeOf<"tilePalette">();
expectTypeOf(WallPalette.SETTING_KEY).toEqualTypeOf<"wallPalette">();
expectTypeOf(WallPalette.COMMIT_TOOL).toEqualTypeOf<"wall">();

declare const wallPalette: WallPalette;
declare const event: PointerEvent;
expectTypeOf(WallPalette.onClickPreset(event)).toBeVoid();

// Instance surface added by the mixin.
declare const palette: DrawingPalette;
expectTypeOf(palette.controlled).toEqualTypeOf<foundry.abstract.Document.Any[]>();
expectTypeOf(palette.createData).toEqualTypeOf<AnyObject>();
expectTypeOf(palette._dirtyFields).toEqualTypeOf<Set<string>>();
expectTypeOf(palette._multiFields).toEqualTypeOf<Set<string>>();
expectTypeOf(palette.documentClass).toEqualTypeOf<foundry.abstract.Document.AnyConstructor>();
expectTypeOf(palette.documentName).toBeString();
expectTypeOf(palette.isSelect).toBeBoolean();
expectTypeOf(palette.layer).toEqualTypeOf<foundry.canvas.layers.PlaceablesLayer.Any | null>();

// The leaf classes inherit the underlying config's surface (e.g. ApplicationV2#render).
expectTypeOf(wallPalette.id).toBeString();
