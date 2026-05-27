import { expectTypeOf } from "vitest";

import JournalEntrySheet = foundry.applications.sheets.journal.JournalEntrySheet;

declare const entry: JournalEntry.Implementation;
const sheet = new JournalEntrySheet({ document: entry });

expectTypeOf(sheet.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(sheet.entry).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(sheet.isMultiple).toEqualTypeOf<boolean>();
expectTypeOf(sheet.locked).toEqualTypeOf<boolean>();
expectTypeOf(sheet.mode).toEqualTypeOf<1 | 2>();
expectTypeOf(sheet.observer).toEqualTypeOf<IntersectionObserver>();
expectTypeOf(sheet.pageId).toEqualTypeOf<string>();
expectTypeOf(sheet.pageIndex).toEqualTypeOf<number>();
expectTypeOf(sheet.pagesInView).toEqualTypeOf<HTMLElement[]>();
expectTypeOf(sheet.searchMode).toEqualTypeOf<string>();
expectTypeOf(sheet.sidebarExpanded).toEqualTypeOf<boolean>();
expectTypeOf(sheet.title).toEqualTypeOf<string>();

expectTypeOf(JournalEntrySheet.VIEW_MODES).toEqualTypeOf<{ SINGLE: 1; MULTIPLE: 2 }>();
expectTypeOf(JournalEntrySheet.OWNERSHIP_ICONS).toEqualTypeOf<Record<number, string>>();
expectTypeOf(
  JournalEntrySheet.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(JournalEntrySheet.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

// Public API
expectTypeOf(sheet.getPageSheet("abc")).toEqualTypeOf<foundry.applications.sheets.journal.JournalEntryPageSheet.Any>();
expectTypeOf(sheet.isPageVisible).parameter(0).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(sheet.nextPage()).toEqualTypeOf<void>();
expectTypeOf(sheet.previousPage()).toEqualTypeOf<void>();
expectTypeOf(sheet.goToPage("abc", { anchor: "x" })).toEqualTypeOf<void>();
expectTypeOf(sheet.createPageDialog()).toEqualTypeOf<Promise<JournalEntryPage.Stored | null>>();
expectTypeOf(sheet.viewedPageDocuments()).toEqualTypeOf<Generator<JournalEntryPage.Implementation, void, undefined>>();
