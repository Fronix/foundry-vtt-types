import { expectTypeOf } from "vitest";

const doc = new NoteDocument.implementation();

expectTypeOf(doc.page).toEqualTypeOf<JournalEntryPage.Implementation | undefined>();
expectTypeOf(doc.label).toEqualTypeOf<string>();
expectTypeOf(doc.entry).toEqualTypeOf<JournalEntry.Implementation | undefined>();
expectTypeOf(doc.isAuthor).toEqualTypeOf<boolean>();
expectTypeOf(doc.prepareDerivedData()).toEqualTypeOf<void>();
