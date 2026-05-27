import { expectTypeOf } from "vitest";

import DocumentOwnershipConfig = foundry.applications.apps.DocumentOwnershipConfig;

declare const doc: Actor.Implementation;
const config = new DocumentOwnershipConfig({ document: doc });

expectTypeOf(config.title).toEqualTypeOf<string>();
expectTypeOf<DocumentOwnershipConfig.RenderContext<Actor.Implementation>["isFolder"]>().toEqualTypeOf<boolean>();
expectTypeOf<DocumentOwnershipConfig.RenderContext<Actor.Implementation>["playerLevels"]>().toEqualTypeOf<
  DocumentOwnershipConfig.PermissionLevel[]
>();
expectTypeOf<DocumentOwnershipConfig.UserOwnership["user"]>().toEqualTypeOf<User.Implementation>();
