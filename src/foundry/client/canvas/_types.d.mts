/* eslint-disable @typescript-eslint/no-unused-vars */

// These types mirror the typedefs Foundry defines in `client/canvas/_types.mjs`. We don't house them
// here because it has poor discoverability; they live on the class namespace they describe and this file
// keeps us synced with the latest version of Foundry.

export {};

type KTX2ParserInitOptions = foundry.canvas.KTX2Parser.InitOptions;

type KTX2ParserParseOptions = foundry.canvas.KTX2Parser.ParseOptions;

type KTX2Header = foundry.canvas.KTX2Parser.Header;

type KTX2TranscodeTarget = foundry.canvas.KTX2Parser.TranscodeTarget;
