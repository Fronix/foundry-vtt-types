import { expectTypeOf } from "vitest";

import SupportDetails = foundry.applications.sidebar.apps.SupportDetails;
import ModuleManagement = foundry.applications.sidebar.apps.ModuleManagement;

expectTypeOf(SupportDetails.generateSupportReport()).toEqualTypeOf<object>();
expectTypeOf(SupportDetails.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

declare const mm: ModuleManagement;
expectTypeOf(mm.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(ModuleManagement.SETTING).toEqualTypeOf<"moduleConfiguration">();
