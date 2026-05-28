import { expectTypeOf } from "vitest";

import ActorDirectory = foundry.applications.sidebar.tabs.ActorDirectory;
import ItemDirectory = foundry.applications.sidebar.tabs.ItemDirectory;
import SceneDirectory = foundry.applications.sidebar.tabs.SceneDirectory;
import MacroDirectory = foundry.applications.sidebar.tabs.MacroDirectory;

declare const actors: ActorDirectory;
expectTypeOf(actors).toExtend<foundry.applications.sidebar.DocumentDirectory<Actor.ImplementationClass>>();
expectTypeOf(ActorDirectory.tabName).toEqualTypeOf<string>();
expectTypeOf(new ItemDirectory().documentClass).toEqualTypeOf<Item.ImplementationClass>();
expectTypeOf(new SceneDirectory().documentClass).toEqualTypeOf<Scene.ImplementationClass>();
expectTypeOf(new MacroDirectory().documentClass).toEqualTypeOf<Macro.ImplementationClass>();
