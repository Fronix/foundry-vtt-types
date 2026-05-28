/* eslint-disable import-x/extensions */

// The Foundry VTT version 14 EXPERIMENTAL VFX framework. Its classes, functions, and configuration are likely to
// change over coming releases. The entire VFX module should be treated as non-stable regardless of the stability
// designation of the release build that contains it.

/**
 * Activate the animejs engine for the Canvas ticker.
 * This is called during `Canvas#draw` before the `canvasReady` hook.
 */
export function activate(): void;

/**
 * Deactivate the animejs engine for the Canvas ticker.
 * This is called during `Canvas#teardown` before the `canvasTearDown` hook.
 */
export function deactivate(): void;

/**
 * One-time configuration to register components, animations, and paths to `CONFIG.Canvas.vfx`.
 */
export function configure(): void;

export * as fields from "./fields/_module.mjs";
export * as constants from "./vfx-constants.mjs";
export * as utils from "./vfx-utils.mjs";
export * as animations from "./animations/_module.mjs";
export * as components from "./components/_module.mjs";
export { default as VFXCanvasContainer } from "./vfx-canvas-container.mjs";
export { default as VFXComponent } from "./vfx-component.mjs";
export { default as VFXEffect } from "./vfx-effect.mjs";
export { default as VFXPath } from "./vfx-path.mjs";
