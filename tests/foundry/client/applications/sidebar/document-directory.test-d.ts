import { expectTypeOf } from "vitest";

import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const dir: DocumentDirectory<Item.ImplementationClass>;

expectTypeOf(dir.documentClass).toEqualTypeOf<Item.ImplementationClass>();
expectTypeOf(dir.documentName).toEqualTypeOf<string>();
expectTypeOf(dir.collection).toEqualTypeOf<foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed>();
expectTypeOf(dir.collapseAll()).toEqualTypeOf<void>();
expectTypeOf<DocumentDirectory.Configuration["renderUpdateKeys"]>().toEqualTypeOf<string[]>();
