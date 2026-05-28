import { expectTypeOf } from "vitest";

import CompendiumDirectory = foundry.applications.sidebar.tabs.CompendiumDirectory;

declare const dir: CompendiumDirectory;
expectTypeOf(dir.activeFilters).toEqualTypeOf<Set<string>>();
expectTypeOf(dir.collapseAll()).toEqualTypeOf<void>();
expectTypeOf(CompendiumDirectory.tabName).toEqualTypeOf<string>();
