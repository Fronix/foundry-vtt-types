import { expectTypeOf } from "vitest";

import SceneConfig = foundry.applications.sheets.SceneConfig;

declare const doc: Scene.Implementation;
const config = new SceneConfig({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<Scene.Implementation>();
expectTypeOf(SceneConfig._getGridTypes()).toEqualTypeOf<Record<number, string>>();
expectTypeOf(SceneConfig._getFogExplorationModes()).toEqualTypeOf<Record<string, string>>();
// `defaultLevel` is `object` until the Level document (Phase 7).
expectTypeOf(config.defaultLevel).toEqualTypeOf<object>();
