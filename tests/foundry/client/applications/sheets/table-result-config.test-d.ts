import { expectTypeOf } from "vitest";

import TableResultConfig = foundry.applications.sheets.TableResultConfig;

declare const doc: TableResult.Implementation;
const config = new TableResultConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<TableResult.Implementation>();
expectTypeOf(TableResultConfig.RESULT_TYPES).toEqualTypeOf<TableResultConfig.ResultTypeChoice[]>();
expectTypeOf<TableResultConfig.RenderContext["resultDocument"]>().toEqualTypeOf<foundry.abstract.Document.Any | null>();
