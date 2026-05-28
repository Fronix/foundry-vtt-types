import { expectTypeOf } from "vitest";
import type { VFXPathGenerator, VFXPathPoint } from "#client/canvas/vfx/_types.d.mts";

import VFXEffect = foundry.canvas.vfx.VFXEffect;
import VFXPath = foundry.canvas.vfx.VFXPath;
import VFXComponent = foundry.canvas.vfx.VFXComponent;

// The vfx namespace is wired into foundry.canvas
expectTypeOf(foundry.canvas.vfx.activate()).toEqualTypeOf<void>();
expectTypeOf(foundry.canvas.vfx.deactivate()).toEqualTypeOf<void>();
expectTypeOf(foundry.canvas.vfx.configure()).toEqualTypeOf<void>();

// VFXEffect is a DataModel
declare const effect: VFXEffect;
expectTypeOf(effect.playing).toEqualTypeOf<boolean>();
expectTypeOf(effect.started).toEqualTypeOf<boolean>();
expectTypeOf(effect.components).toEqualTypeOf<Record<string, VFXComponent.Any>>();
expectTypeOf(effect.load()).toEqualTypeOf<Promise<void>>();
expectTypeOf(effect.draw()).toEqualTypeOf<Promise<void>>();
expectTypeOf(effect.attach()).toEqualTypeOf<void>();
expectTypeOf(effect.play()).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(effect.play({ target: {} })).toEqualTypeOf<Promise<boolean | void>>();
expectTypeOf(effect.stop()).toEqualTypeOf<Promise<void>>();
expectTypeOf(effect.cancel()).toEqualTypeOf<Promise<void>>();
expectTypeOf(effect.resolveReferences()).toEqualTypeOf<void>();
expectTypeOf(effect.clone()).toEqualTypeOf<VFXEffect>();

// VFXPath
declare const path: VFXPath;
expectTypeOf(path.pathPoints).toEqualTypeOf<VFXPathPoint[]>();
expectTypeOf(path.pathLength).toEqualTypeOf<number>();
expectTypeOf(path.interpolatedPoint(0.5)).toEqualTypeOf<VFXPathPoint>();
expectTypeOf(VFXPath.getPathGenerator("linear")).toEqualTypeOf<VFXPathGenerator>();

// A component subclass exposes its static TYPE
expectTypeOf(foundry.canvas.vfx.components.VFXShakeComponent.TYPE).toEqualTypeOf<"shake">();

// CONFIG.Canvas.vfx registration surface
expectTypeOf(CONFIG.Canvas.vfx.enabled).toEqualTypeOf<boolean>();
expectTypeOf(CONFIG.Canvas.vfx.components).toEqualTypeOf<Record<string, VFXComponent.AnyConstructor>>();
