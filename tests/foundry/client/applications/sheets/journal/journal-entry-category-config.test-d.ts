import { expectTypeOf } from "vitest";

import JournalEntryCategoryConfig = foundry.applications.sheets.journal.JournalEntryCategoryConfig;

declare const entry: JournalEntry.Implementation;
const config = new JournalEntryCategoryConfig({ document: entry });

expectTypeOf(config.document).toEqualTypeOf<JournalEntry.Implementation>();
expectTypeOf(config.title).toEqualTypeOf<string>();

expectTypeOf(
  JournalEntryCategoryConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(JournalEntryCategoryConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf<JournalEntryCategoryConfig.RenderContext["categories"]>().toEqualTypeOf<
  JournalEntryCategoryConfig.Category[]
>();
expectTypeOf<JournalEntryCategoryConfig.Category["field"]>().toEqualTypeOf<foundry.data.fields.StringField>();
