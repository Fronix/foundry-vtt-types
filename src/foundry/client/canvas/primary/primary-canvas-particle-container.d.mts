import type { PIXI } from "#configuration";
import type { Identity } from "#utils";
import type { CanvasTransformMixin } from "./primary-canvas-object.d.mts";

/**
 * A lightweight primary-canvas container designed for particle effects.
 * This container intentionally avoids any internal sorting or depth participation. Children render in insertion order.
 */
declare class PrimaryCanvasParticleContainer extends CanvasTransformMixin(PIXI.Container) {
  /**
   * The elevation of this container.
   * @remarks The setter throws if passed a non-numeric value.
   */
  get elevation(): number;

  set elevation(value);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer.
   * @remarks The setter throws if passed a non-numeric value.
   */
  get sort(): number;

  set sort(value);

  /**
   * Particle containers do not render depth.
   * @remarks Always `false`.
   */
  get shouldRenderDepth(): boolean;

  /**
   * @remarks Particle containers do not render depth, so this is a no-op.
   */
  renderDepthData(renderer: PIXI.Renderer): void;

  #PrimaryCanvasParticleContainer: true;
}

declare namespace PrimaryCanvasParticleContainer {
  interface Any extends AnyPrimaryCanvasParticleContainer {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryCanvasParticleContainer> {}
}

export default PrimaryCanvasParticleContainer;

declare abstract class AnyPrimaryCanvasParticleContainer extends PrimaryCanvasParticleContainer {
  constructor(...args: never);
}
