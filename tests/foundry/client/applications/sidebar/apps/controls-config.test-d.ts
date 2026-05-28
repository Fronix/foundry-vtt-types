import { expectTypeOf } from "vitest";

import ControlsConfig = foundry.applications.sidebar.apps.ControlsConfig;

declare const config: ControlsConfig;
expectTypeOf(config).toExtend<foundry.applications.api.CategoryBrowser<ControlsConfig.Entry>>();
expectTypeOf(ControlsConfig.humanizeBinding({})).toEqualTypeOf<string>();
expectTypeOf<ControlsConfig.Entry["id"]>().toEqualTypeOf<string>();
