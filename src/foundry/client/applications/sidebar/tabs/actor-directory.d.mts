import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ActorDirectory: ActorDirectory.Any;
    }
  }
}

/**
 * The World Actor directory listing.
 */
declare class ActorDirectory<
  RenderContext extends ActorDirectory.RenderContext = ActorDirectory.RenderContext,
  Configuration extends ActorDirectory.Configuration = ActorDirectory.Configuration,
  RenderOptions extends ActorDirectory.RenderOptions = ActorDirectory.RenderOptions,
> extends DocumentDirectory<Actor.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  static override tabName: string;

  protected override _getEntryContextOptions(): foundry.applications.ux.ContextMenu.Entry<HTMLElement>[];

  protected override _canDragStart(selector: string): boolean;

  protected override _onDragStart(event: DragEvent): void;
}

declare namespace ActorDirectory {
  interface Any extends AnyActorDirectory {}
  interface AnyConstructor extends Identity<typeof AnyActorDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyActorDirectory extends ActorDirectory<
  ActorDirectory.RenderContext,
  ActorDirectory.Configuration,
  ActorDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default ActorDirectory;
