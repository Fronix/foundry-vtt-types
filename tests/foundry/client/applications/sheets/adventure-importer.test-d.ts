import { expectTypeOf } from "vitest";

import AdventureImporterV2 = foundry.applications.sheets.AdventureImporterV2;

declare const doc: Adventure.Implementation;
const importer = new AdventureImporterV2({ document: doc });

expectTypeOf(importer.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(importer.adventure).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(importer.isEditable).toEqualTypeOf<boolean>();
expectTypeOf<AdventureImporterV2.RenderContext["contents"]>().toEqualTypeOf<AdventureImporterV2.ContentListEntry[]>();
expectTypeOf<AdventureImporterV2.RenderContext["loading"]>().toEqualTypeOf<boolean>();
