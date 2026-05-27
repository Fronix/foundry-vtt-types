import { expectTypeOf } from "vitest";

import NoteConfig = foundry.applications.sheets.NoteConfig;

declare const doc: NoteDocument.Implementation;
const config = new NoteConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<NoteDocument.Implementation>();
expectTypeOf(config.title).toEqualTypeOf<string>();
expectTypeOf<NoteConfig.RenderContext["entry"]>().toEqualTypeOf<JournalEntry.Implementation | null>();
expectTypeOf<NoteConfig.IconContext["field"]>().toEqualTypeOf<foundry.data.fields.StringField>();
