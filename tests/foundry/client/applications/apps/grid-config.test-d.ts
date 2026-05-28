import { expectTypeOf } from "vitest";

import GridConfig = foundry.applications.apps.GridConfig;

declare const doc: Scene.Implementation;
const config = new GridConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(config.title).toEqualTypeOf<string>();
expectTypeOf(config.sheet).toEqualTypeOf<foundry.applications.sheets.SceneConfig>();
expectTypeOf<GridConfig.RenderContext["scene"]>().toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf<GridConfig.RenderContext["scale"]>().toEqualTypeOf<number>();
