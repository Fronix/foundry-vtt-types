import { expectTypeOf } from "vitest";

import CodeMirrorSheet = foundry.applications.sheets.journal.JournalEntryPageCodeMirrorSheet;
import HTMLSheet = foundry.applications.sheets.journal.JournalEntryPageHTMLSheet;

declare const page: JournalEntryPage.Implementation;

const code = new CodeMirrorSheet({ document: page });
expectTypeOf(code.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(CodeMirrorSheet.DEFAULT_OPTIONS).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(CodeMirrorSheet.VIEW_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

const html = new HTMLSheet({ document: page });
expectTypeOf(html.document).toEqualTypeOf<JournalEntryPage.Implementation>();
expectTypeOf(HTMLSheet.EDIT_PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(HTMLSheet.formatHTML("<p>x</p>")).toEqualTypeOf<string>();
expectTypeOf(HTMLSheet.formatHTML("<p>x</p>", { spaces: 2 })).toEqualTypeOf<string>();

// HTMLSheet is in the CodeMirror -> Text -> Handlebars -> PageSheet chain.
expectTypeOf(html).toExtend<CodeMirrorSheet>();
