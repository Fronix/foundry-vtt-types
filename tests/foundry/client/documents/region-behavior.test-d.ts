import { expectTypeOf } from "vitest";

declare const behavior: RegionBehavior.Implementation;

expectTypeOf(behavior.region).toEqualTypeOf<RegionDocument.Implementation | null>();
expectTypeOf(behavior.scene).toEqualTypeOf<Scene.Implementation | null>();
expectTypeOf(behavior.active).toEqualTypeOf<boolean>();
expectTypeOf(behavior.viewed).toEqualTypeOf<boolean>();
expectTypeOf(behavior.hasEvent("tokenMoveIn")).toEqualTypeOf<boolean>();
expectTypeOf(behavior.prepareBaseData()).toEqualTypeOf<void>();

// `_handleRegionEvent` is `async` in v14 (returns a Promise); it is protected/internal so it is
// exercised through a subclass.
export class TestRegionBehavior extends RegionBehavior {
  test(event: RegionDocument.RegionEvent): void {
    expectTypeOf(this._handleRegionEvent(event)).toEqualTypeOf<Promise<void>>();
  }
}
