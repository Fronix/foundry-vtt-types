import { Schema } from "prosemirror-model";
import type ProseMirrorPlugin from "./plugin.d.mts";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import type { AnyObject } from "#utils";

/**
 * A class responsible for handling the display of automated link recommendations when a user highlights text in a
 * ProseMirror editor.
 * @remarks This class is never exported or available directly, {@linkcode ProseMirrorHighlightMatchesPlugin.build} creates a
 * plugin to return by passing a `view` options property that will instantiate one of these.
 */
declare class _PossibleMatchesTooltip {
  /**
   * @param view - The editor view
   */
  constructor(view: EditorView);

  /**
   * A reference to any existing tooltip that has been generated as part of a highlight match.
   */
  tooltip: HTMLElement | undefined;

  update(view: EditorView, lastState: EditorState): Promise<void>;

  #PossibleMatchesTooltip;
}

/**
 * A ProseMirrorPlugin wrapper around the {@linkcode PossibleMatchesTooltip} class.
 */
declare class ProseMirrorHighlightMatchesPlugin extends ProseMirrorPlugin {
  /**
   * @param schema  - The ProseMirror schema.
   * @param options - Additional options to configure the plugin's behaviour.
   * @remarks Foundry types the options as {@linkcode ProseMirrorMenu.ConstructionOptions},
   * but they're unused other than being stored in `this.options`. Suspected copy & paste error.
   */
  constructor(schema: Schema, options?: AnyObject);

  /** @remarks `options` is unused */
  static override build(
    schema: Schema,
    options?: AnyObject,
  ): Plugin<ProseMirrorHighlightMatchesPlugin.HighlightMatchesPluginSpec>;
}

declare namespace ProseMirrorHighlightMatchesPlugin {
  interface PossibleMatchesTooltip extends _PossibleMatchesTooltip {}

  interface HighlightMatchesPluginSpec {
    view(editorView: EditorView): PossibleMatchesTooltip;
    isHighlightMatchesPlugin: true;
  }
}

export default ProseMirrorHighlightMatchesPlugin;
