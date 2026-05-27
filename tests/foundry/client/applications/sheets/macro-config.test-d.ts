import { expectTypeOf } from "vitest";

import MacroConfig = foundry.applications.sheets.MacroConfig;

declare const doc: Macro.Implementation;
const config = new MacroConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Macro.Implementation>();
expectTypeOf<MacroConfig.RenderContext["editorLang"]>().toEqualTypeOf<"javascript" | "html">();
expectTypeOf<MacroConfig.RenderContext["typeChoices"]>().toEqualTypeOf<Record<string, string>>();
