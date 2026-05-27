import { expectTypeOf } from "vitest";

import JournalEntryPageSheet = foundry.applications.sheets.journal.JournalEntryPageSheet;

declare const page: JournalEntryPage.Implementation;
const sheet = new JournalEntryPageSheet({ document: page });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.page).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.isView).toEqualTypeOf<boolean>();
expectTypeOf(sheet.isV2).toEqualTypeOf<boolean>();
expectTypeOf(JournalEntryPageSheet.isV2).toEqualTypeOf<boolean>();
expectTypeOf(sheet.toc).toEqualTypeOf<Record<string, JournalEntryPage.JournalEntryPageHeading>>();

expectTypeOf(
  JournalEntryPageSheet.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();

// The page sheet adds three Configuration options.
expectTypeOf<JournalEntryPageSheet.Configuration["includeTOC"]>().toEqualTypeOf<boolean>();
expectTypeOf<JournalEntryPageSheet.Configuration["mode"]>().toEqualTypeOf<"edit" | "view">();
expectTypeOf<JournalEntryPageSheet.Configuration["viewClasses"]>().toEqualTypeOf<string[]>();
