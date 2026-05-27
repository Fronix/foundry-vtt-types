import { expectTypeOf } from "vitest";

import RollTableSheet = foundry.applications.sheets.RollTableSheet;

declare const doc: RollTable.Implementation;
const sheet = new RollTableSheet({ document: doc });

expectTypeOf(sheet.document).toEqualTypeOf<RollTable.Implementation>();
expectTypeOf(sheet.mode).toEqualTypeOf<RollTableSheet.Mode>();
expectTypeOf(sheet.isEditMode).toEqualTypeOf<boolean>();
expectTypeOf(RollTableSheet.MODE_PARTS).toEqualTypeOf<{ edit: string[]; view: string[] }>();
expectTypeOf<RollTableSheet.Mode>().toEqualTypeOf<"edit" | "view">();
expectTypeOf<RollTableSheet.ResultContext["range"]>().toEqualTypeOf<number | string | number[]>();
