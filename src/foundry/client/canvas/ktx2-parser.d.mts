import type { AnyObject, Identity, InexactPartial } from "#utils";

/**
 * A KTX2 PIXI loader parser using the official Khronos KTX module.
 */
declare class KTX2Parser {
  /**
   * The default path to the Khronos libktx WebAssembly module.
   * @defaultValue `"scripts/ktx2/libktx.wasm"`
   */
  static WASM_PATH: string;

  /**
   * A PIXI asset detection parser for KTX2 textures.
   */
  static detectKTX2: AnyObject;

  /**
   * A PIXI asset resolver for KTX2 texture URLs.
   */
  static resolveKTX2TextureUrl: AnyObject;

  /**
   * A PIXI asset loader parser for KTX2 textures.
   */
  static loadKTX2: AnyObject;

  /**
   * The initialized Khronos KTX module.
   */
  static get module(): AnyObject | null;

  /**
   * Has the Khronos KTX module been initialized?
   */
  static get initialized(): boolean;

  /**
   * Initialize the Khronos KTX module.
   * @param options - Initialization options.
   * @returns The initialized Khronos KTX module.
   */
  static initialize(options?: KTX2Parser.InitOptions): Promise<AnyObject>;

  /**
   * Load a KTX2 URL as a PIXI compressed texture resource.
   * @param url     - The texture URL.
   * @param options - Parser options.
   * @returns The compressed texture resource.
   */
  static loadResource(url: string, options?: KTX2Parser.ParseOptions): Promise<PIXI.CompressedTextureResource>;

  /**
   * Parse KTX2 data as a PIXI compressed texture resource.
   * @param data    - The KTX2 file data.
   * @param options - Parser options.
   * @returns The compressed texture resource.
   */
  static parse(
    data: ArrayBuffer | Uint8Array,
    options?: KTX2Parser.ParseOptions,
  ): Promise<PIXI.CompressedTextureResource>;
}

declare namespace KTX2Parser {
  interface Any extends AnyKTX2Parser {}
  interface AnyConstructor extends Identity<typeof AnyKTX2Parser> {}

  /** @remarks Corresponds to Foundry's `KTX2ParserInitOptions` typedef. */
  type InitOptions = InexactPartial<{
    /** The URL of the libktx WebAssembly module. */
    wasmPath: string;
  }>;

  /** @remarks Corresponds to Foundry's `KTX2ParserParseOptions` typedef. */
  type ParseOptions = InexactPartial<{
    /** A Khronos transcode target name. */
    transcodeTarget: string;
  }>;

  /** @remarks Corresponds to Foundry's `KTX2Header` typedef. */
  interface Header {
    /** The KTX2 GPU format identifier. */
    gpuFormat: number;

    /** The base level width. */
    pixelWidth: number;

    /** The base level height. */
    pixelHeight: number;

    /** The base level depth. */
    pixelDepth: number;

    /** The array layer count. */
    layerCount: number;

    /** The face count. */
    faceCount: number;

    /** The embedded mip level count. */
    levelCount: number;

    /** The KTX2 supercompression scheme. */
    supercompressionScheme: number;
  }

  /** @remarks Corresponds to Foundry's `KTX2TranscodeTarget` typedef. */
  interface TranscodeTarget {
    /** The Khronos transcode target name. */
    name: string;

    /** The Khronos transcode target enum value. */
    target: number;
  }
}

export default KTX2Parser;

declare abstract class AnyKTX2Parser extends KTX2Parser {
  constructor(...args: never);
}
