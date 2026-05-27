import { expectTypeOf } from "vitest";

import ShowToPlayersDialog = foundry.applications.sheets.journal.ShowToPlayersDialog;

// Constructing a DialogV2 subclass directly produces an unsightly type display
// (see the DialogV2 test notes), so the instance is declared rather than built.
declare const dialog: ShowToPlayersDialog;

expectTypeOf(dialog.document).toEqualTypeOf<JournalEntry.Implementation | JournalEntryPage.Implementation>();
expectTypeOf(dialog.isImage).toEqualTypeOf<boolean>();
expectTypeOf(dialog.title).toEqualTypeOf<string>();

expectTypeOf(ShowToPlayersDialog.DEFAULT_OPTIONS).toEqualTypeOf<foundry.applications.api.DialogV2.DefaultOptions>();
expectTypeOf(ShowToPlayersDialog.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf<ShowToPlayersDialog.RenderContext["isImage"]>().toEqualTypeOf<boolean>();
expectTypeOf<ShowToPlayersDialog.RenderContext["users"]>().toEqualTypeOf<User.Implementation[]>();
expectTypeOf<ShowToPlayersDialog.RenderContext["ownership"]>().toEqualTypeOf<foundry.data.fields.NumberField>();
expectTypeOf<ShowToPlayersDialog.Configuration["document"]>().toEqualTypeOf<
  JournalEntry.Implementation | JournalEntryPage.Implementation
>();
