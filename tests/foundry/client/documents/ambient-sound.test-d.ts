import { expectTypeOf } from "vitest";

const sound = new AmbientSoundDocument.implementation();
expectTypeOf(sound).toEqualTypeOf<AmbientSoundDocument.Implementation>();

expectTypeOf(sound.prepareDerivedData()).toEqualTypeOf<void>();
