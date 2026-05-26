import { expectTypeOf } from "vitest";

import CanvasEdges = foundry.canvas.geometry.edges.CanvasEdges;
import Edge = foundry.canvas.geometry.edges.Edge;

// FIXME(v14): `CanvasEdges` is constructed with a `Level` document, which is not yet authored
// (Phase 7 — Scene Levels). The `level` parameter is typed loosely as `object` until then.
declare const level: object;
const myCanvasEdges = new CanvasEdges(level);
declare const someEdge: Edge;
declare const rect: PIXI.Rectangle;

expectTypeOf(myCanvasEdges.level).toEqualTypeOf<object>();
expectTypeOf(myCanvasEdges.set("foo", someEdge)).toEqualTypeOf<CanvasEdges>();
expectTypeOf(myCanvasEdges.delete("foo")).toBeBoolean();
expectTypeOf(myCanvasEdges.clear()).toEqualTypeOf<CanvasEdges>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.inititalize()).toEqualTypeOf<void>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(myCanvasEdges.refresh()).toEqualTypeOf<void>();

const ctf = (edge: Edge) => edge.type === "wall";
expectTypeOf(myCanvasEdges.getEdges(rect)).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: ctf,
    collisionTestBounds: true,
    includeInnerBounds: true,
    includeOuterBounds: false,
  }),
).toEqualTypeOf<Set<Edge>>();
expectTypeOf(
  myCanvasEdges.getEdges(rect, {
    collisionTest: undefined,
    collisionTestBounds: undefined,
    includeInnerBounds: undefined,
    includeOuterBounds: undefined,
  }),
).toEqualTypeOf<Set<Edge>>();

for (const [key, edge] of myCanvasEdges) {
  expectTypeOf(key).toEqualTypeOf<string>();
  expectTypeOf(edge).toEqualTypeOf<Edge>();
}
