import { expectTypeOf } from "vitest";

import ParticleGenerator = foundry.canvas.animation.ParticleGenerator;
import SpriteMesh = foundry.canvas.containers.SpriteMesh;

expectTypeOf(ParticleGenerator.DEFAULT_OPTIONS).toEqualTypeOf<ParticleGenerator.Configuration>();

// Constructor: no args, empty config, and a rich config.
const empty = new ParticleGenerator();
new ParticleGenerator({});
const gen = new ParticleGenerator({
  mode: "effect",
  count: 100,
  spawnRate: 300,
  area: { x: 1200, y: 900, radius: 180 },
  lifetime: [450, 900],
  fade: { in: 0.05, out: 0.4 },
  velocity: { speed: [80, 200], angle: [0, 360] },
  rotation: { speed: 180 },
  alpha: { min: 0.4, max: 0.8 },
  scale: [0.3, 0.8],
  tint: 0xffaa00,
  debug: { stats: true, profile: true, tint: { mode: "byTexture" } },
  onSpawn: (p, ctx) => {
    expectTypeOf(ctx.generator).toEqualTypeOf<ParticleGenerator>();
    expectTypeOf(p.elapsedTime).toBeNumber();
  },
});

expectTypeOf(empty).toEqualTypeOf<ParticleGenerator>();

// Instance properties.
expectTypeOf(gen.mode).toEqualTypeOf<ParticleGenerator.Mode>();
expectTypeOf(gen.container).toEqualTypeOf<PIXI.Container>();
expectTypeOf(gen.textures).toEqualTypeOf<PIXI.Texture[]>();
expectTypeOf(gen.maxParticles).toBeNumber();
expectTypeOf(gen.manualSpawning).toBeBoolean();
expectTypeOf(gen.adjustedMaxParticles).toBeNumber();
expectTypeOf(gen.particles).toEqualTypeOf<ParticleGenerator.ParticleMesh[]>();
expectTypeOf(gen.particlePool).toEqualTypeOf<ParticleGenerator.ParticleMesh[]>();
expectTypeOf(gen.spawnArea).toEqualTypeOf<ParticleGenerator.Area | null>();

// Getters / setters.
expectTypeOf(gen.bounds).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(gen.particlesContainer).toEqualTypeOf<PIXI.Container | null>();
expectTypeOf(gen.viewRectLocal).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(gen.budgetRectLocal).toEqualTypeOf<PIXI.Rectangle>();
expectTypeOf(gen.spawnRate).toBeNumber();
gen.spawnRate = 250;
expectTypeOf(gen.mask).toEqualTypeOf<PIXI.DisplayObject | null>();
gen.mask = null;
expectTypeOf(gen.debugStats).toEqualTypeOf<ParticleGenerator.DebugStats | null>();

// Public methods.
expectTypeOf(gen.start()).toBeVoid();
expectTypeOf(gen.start({ spawn: 50 })).toBeVoid();
expectTypeOf(gen.stop()).toBeVoid();
expectTypeOf(gen.stop({ hard: true })).toBeVoid();
expectTypeOf(gen.spawnParticle()).toEqualTypeOf<ParticleGenerator.ParticleMesh | null>();
expectTypeOf(
  gen.spawnParticle({ texture: "ui/particles/snow.png", position: { x: 1, y: 2 } }),
).toEqualTypeOf<ParticleGenerator.ParticleMesh | null>();
expectTypeOf(gen.spawnParticles(10)).toBeNumber();
expectTypeOf(gen.spawnParticles(10, { area: { x: 0, y: 0, radius: 5 } })).toBeNumber();

// A ParticleMesh is a SpriteMesh with extra generator bookkeeping.
declare const particle: ParticleGenerator.ParticleMesh;
particle satisfies SpriteMesh;
expectTypeOf(particle.generator).toEqualTypeOf<ParticleGenerator>();
expectTypeOf(particle.lifetime).toBeNumber();
expectTypeOf(particle.movementSpeed).toEqualTypeOf<PIXI.Point>();

// Namespace option-bag types.
declare const configuration: ParticleGenerator.Configuration;
expectTypeOf(configuration.mode).toEqualTypeOf<ParticleGenerator.Mode | null | undefined>();

declare const value: ParticleGenerator.Value;
value satisfies number | number[] | ParticleGenerator.ValueOptions;

declare const colorValue: ParticleGenerator.ColorValue;
colorValue satisfies Color.Source | ParticleGenerator.ColorValueOptions;

declare const stats: ParticleGenerator.DebugStats;
expectTypeOf(stats.active).toBeNumber();
expectTypeOf(stats.tickMS).toBeNumber();

// Behavior callbacks.
declare const behavior: ParticleGenerator.Behavior;
expectTypeOf(behavior.initialize).toEqualTypeOf<((generator: ParticleGenerator) => void) | undefined>();

// Deprecated members.
/* eslint-disable @typescript-eslint/no-deprecated -- deprecated since v14, until v16 */
expectTypeOf(gen.maxParticlesPerFrame).toBeNumber();
expectTypeOf(gen.alphaRange).toEqualTypeOf<{ min: number; max: number }>();
expectTypeOf(gen.scaleRange).toEqualTypeOf<{ min: number; max: number }>();
/* eslint-enable @typescript-eslint/no-deprecated */
