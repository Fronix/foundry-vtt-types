import { expectTypeOf } from "vitest";

import TerrainData = foundry.data.TerrainData;
import BaseTerrainData = foundry.data.BaseTerrainData;

declare const td: TerrainData;
expectTypeOf(td.equals(null)).toEqualTypeOf<boolean>();
expectTypeOf(TerrainData.resolveTerrainEffects([])).toEqualTypeOf<BaseTerrainData.Any | null>();
