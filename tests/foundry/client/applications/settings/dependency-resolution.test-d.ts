import { expectTypeOf } from "vitest";

import DependencyResolution = foundry.applications.settings.DependencyResolution;

declare const app: DependencyResolution;
expectTypeOf(app.needsResolving).toEqualTypeOf<boolean>();
expectTypeOf(app.root).toEqualTypeOf<foundry.packages.Module>();
expectTypeOf(app._getRootRequiredBy()).toEqualTypeOf<Set<foundry.packages.Module>>();
expectTypeOf<DependencyResolution.Configuration["root"]>().toEqualTypeOf<foundry.packages.Module>();
