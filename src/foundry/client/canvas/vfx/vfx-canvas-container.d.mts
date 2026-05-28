import type { Identity } from "#utils";
import type PrimaryCanvasContainer from "#client/canvas/primary/primary-canvas-container.d.mts";

/**
 * A special subclass of PrimaryCanvasContainer used for the animation of related display objects in VFXEffects.
 * @remarks Foundry TODO: "we might not need this in the end and we can just use PrimaryCanvasContainer directly. TBD."
 */
declare class VFXCanvasContainer extends PrimaryCanvasContainer {
  constructor();

  /**
   * A registry of named display objects which belong to this container
   */
  sprites: Record<string, PIXI.DisplayObject>;
}

declare namespace VFXCanvasContainer {
  interface Any extends VFXCanvasContainer {}
  interface AnyConstructor extends Identity<typeof VFXCanvasContainer> {}
}

export default VFXCanvasContainer;
