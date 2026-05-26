/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

export {};

type BaseEffectSourceOptions = foundry.canvas.sources.BaseEffectSource.ConstructorOptions;

type BaseEffectSourceData = foundry.canvas.sources.BaseEffectSource.SourceData;

type RenderedEffectSourceData = foundry.canvas.sources.RenderedEffectSource.SourceData;

type RenderedEffectSourceAnimationConfig = foundry.canvas.sources.RenderedEffectSource.AnimationConfig;

type RenderedEffectLayerConfig = foundry.canvas.sources.RenderedEffectSource.LayerConfig;

type RenderedEffectSourceLayer = foundry.canvas.sources.RenderedEffectSource.SourceLayer;

type VisionSourceData = foundry.canvas.sources.PointVisionSource.SourceData;
