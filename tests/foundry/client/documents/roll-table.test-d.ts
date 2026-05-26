import { expectTypeOf } from "vitest";

const table = new RollTable.implementation({ name: "Loot Table" });

expectTypeOf(table.thumbnail).toEqualTypeOf<typeof table.img>();
expectTypeOf(table.draw()).toEqualTypeOf<Promise<RollTable.Draw>>();
// v14: `messageMode` (a string key of CONFIG.ChatMessage.modes) replaces the deprecated `rollMode`.
expectTypeOf(table.draw({ messageMode: "publicroll" })).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.drawMany(3)).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.normalize()).toEqualTypeOf<Promise<RollTable.Implementation | undefined>>();
expectTypeOf(table.resetResults()).toEqualTypeOf<Promise<TableResult.Stored[]>>();
expectTypeOf(table.roll()).toEqualTypeOf<Promise<RollTable.Draw>>();
expectTypeOf(table.getResultsForRoll(5)).toEqualTypeOf<TableResult.Stored[]>();

declare const folder: Folder.Implementation;
expectTypeOf(RollTable.fromFolder(folder)).toEqualTypeOf<Promise<RollTable.Stored | undefined>>();

// `rollMode` is deprecated since v14 (until v16) in favor of `messageMode`.
table.draw({ rollMode: "gmroll" });
