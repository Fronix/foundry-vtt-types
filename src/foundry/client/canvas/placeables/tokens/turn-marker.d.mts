import type { Identity } from "#utils";
import type { SpriteMesh } from "#client/canvas/containers/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type TurnMarkerData from "./turn-marker-data.d.mts";

/**
 * The Turn Marker of a {@link Token | `Token`}.
 */
declare class TokenTurnMarker extends PIXI.Container {
  /**
   * Construct a TokenTurnMarker by providing a Token object instance.
   * @param token - The Token that this Turn Marker belongs to
   */
  constructor(token: Token.Implementation);

  /** The Token who this Turn Marker belongs to. */
  get token(): Token.Implementation;

  /** The sprite of the Turn Marker. */
  mesh: SpriteMesh;

  /**
   * The animation configuration of the Turn Marker.
   * @defaultValue `{ spin: 0, pulse: { speed: 0, min: 1, max: 1 } }`
   */
  animation: TurnMarkerData.TurnMarkerAnimationConfigData;

  /**
   * Draw the Turn Marker.
   */
  draw(): Promise<void>;

  /**
   * Animate the Turn Marker.
   * @param deltaTime - The delta time
   */
  animate(deltaTime: number): void;
}

declare namespace TokenTurnMarker {
  interface Any extends AnyTokenTurnMarker {}
  interface AnyConstructor extends Identity<typeof AnyTokenTurnMarker> {}
}

export default TokenTurnMarker;

declare abstract class AnyTokenTurnMarker extends TokenTurnMarker {
  constructor(...args: never);
}
