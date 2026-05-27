import { expectTypeOf } from "vitest";

import AdventureExporter = foundry.applications.sheets.AdventureExporter;

declare const doc: Adventure.Implementation;
const exporter = new AdventureExporter({ document: doc });

expectTypeOf(exporter.document).toEqualTypeOf<Adventure.Implementation>();
expectTypeOf(exporter.contentTree).toEqualTypeOf<Record<string, AdventureExporter.ContentTreeRoot>>();
expectTypeOf<AdventureExporter.ContentTreeRoot["id"]>().toEqualTypeOf<null>();
expectTypeOf<AdventureExporter.ContentTreeNode["folder"]>().toEqualTypeOf<Folder.Implementation | null>();
expectTypeOf(exporter.addContent).parameter(0).toEqualTypeOf<foundry.abstract.Document.Any>();
