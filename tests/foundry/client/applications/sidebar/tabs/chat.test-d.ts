import { expectTypeOf } from "vitest";

import ChatLog = foundry.applications.sidebar.tabs.ChatLog;

declare const log: ChatLog;
expectTypeOf(log.collection).toEqualTypeOf<foundry.documents.collections.ChatMessages>();
expectTypeOf(log.isAtBottom).toEqualTypeOf<boolean>();
expectTypeOf(log.history).toEqualTypeOf<ChatLog.History>();
expectTypeOf(ChatLog.renderMessage(undefined as never)).toEqualTypeOf<Promise<HTMLElement>>();
expectTypeOf(ChatLog.MULTILINE_COMMANDS).toEqualTypeOf<Set<string>>();
