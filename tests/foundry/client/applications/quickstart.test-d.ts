import { expectTypeOf } from "vitest";

// AppV2QuickStartTemplate is an internal FVTT template class and is intentionally
// not surfaced through the applications barrel, so it is imported directly.
import type AppV2QuickStartTemplate from "#client/applications/quickstart.d.mts";

expectTypeOf<
  typeof AppV2QuickStartTemplate.DEFAULT_OPTIONS
>().toEqualTypeOf<foundry.applications.api.ApplicationV2.DefaultOptions>();
expectTypeOf<typeof AppV2QuickStartTemplate.PARTS>().toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
