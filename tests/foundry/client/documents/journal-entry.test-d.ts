import { expectTypeOf } from "vitest";

declare const entry: JournalEntry.Implementation;

expectTypeOf(entry.visible).toEqualTypeOf<boolean>();
expectTypeOf(entry.sceneNote).toEqualTypeOf<foundry.canvas.placeables.Note.Implementation | null>();
expectTypeOf(entry.show()).toEqualTypeOf<Promise<JournalEntry.Implementation>>();
expectTypeOf(entry.show(true)).toEqualTypeOf<Promise<JournalEntry.Implementation>>();
expectTypeOf(entry.panToNote()).toEqualTypeOf<Promise<void>>();
expectTypeOf(entry.getUserLevel()).toEqualTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS>();

declare const category: JournalEntryCategory.Implementation;
expectTypeOf(JournalEntry.sortCategories(category, category)).toEqualTypeOf<number>();
