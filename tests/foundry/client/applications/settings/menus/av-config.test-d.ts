import { expectTypeOf } from "vitest";

import AVConfig = foundry.applications.settings.menus.AVConfig;

declare const config: AVConfig;
expectTypeOf(config.webrtc).toEqualTypeOf<foundry.av.AVMaster>();
expectTypeOf<AVConfig.RenderContext["isSSL"]>().toEqualTypeOf<boolean>();
expectTypeOf<AVConfig.Configuration["webrtc"]>().toEqualTypeOf<foundry.av.AVMaster | undefined>();
