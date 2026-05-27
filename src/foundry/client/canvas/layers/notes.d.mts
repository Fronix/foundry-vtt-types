import type { HandleEmptyObject, Identity, InexactPartial, NullishProps } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { PlaceablesLayer } from "./_module.d.mts";
import type { Note } from "#client/canvas/placeables/_module.d.mts";
import type SceneControls from "#client/applications/ui/scene-controls.d.mts";
import type NotePalette from "#client/applications/sheets/palette/note-palette.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface PlaceablesLayerConfig {
      NotesLayer: NotesLayer.Any;
    }
  }
}

/**
 * The Notes Layer which contains Note canvas objects
 */
declare class NotesLayer extends PlaceablesLayer<"Note"> {
  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  static get instance(): Canvas["notes"];

  /**
   * @defaultValue
   * ```
   * foundry.utils.mergeObject(super.layerOptions, {
   *  name: "notes",
   *  controllableObjects: true,
   *  zIndex: 800,
   *  confirmBeforeCreation: true
   * })
   * ```
   */
  static override get layerOptions(): NotesLayer.LayerOptions;

  /**
   * @privateRemarks This is not overridden in foundry but reflects the real behavior.
   */
  override options: NotesLayer.LayerOptions;

  static override documentName: "Note";

  static paletteClass: typeof NotePalette;

  /**
   * The named core setting which tracks the toggled visibility state of map notes
   */
  static TOGGLE_SETTING: "notesDisplayToggle";

  override get hookName(): "NotesLayer";

  /** @defaultValue `game.settings.get("core", "notesDisplayToggle")` */
  override interactiveChildren: boolean;

  protected override _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Note.Implementation[];

  protected override _deactivate(): void;

  protected override _draw(options: HandleEmptyObject<NotesLayer.DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<NotesLayer.TearDownOptions>): Promise<void>;

  /**
   * Register game settings used by the NotesLayer
   */
  static registerSettings(): void;

  /**
   * Pan to a given note on the layer.
   * @param note    - The note to pan to.
   * @param options - Options which modify the pan operation.
   * @returns A Promise which resolves once the pan animation has concluded.
   */
  panToNote(
    note: Note.Implementation,
    options?: NotesLayer.PanToNoteOptions, // not:null (destructured)
  ): Promise<void>;

  /**
   * Prepare data used by SceneControls to register tools used by this layer.
   */
  static override prepareSceneControls(): SceneControls.Control;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onClickLeft(event: Canvas.Event.Pointer): Promise<void>;

  /**
   * Handle JournalEntry document drop data
   */
  protected _onDropData(event: DragEvent, data: NotesLayer.DropData): Promise<false | Note.Implementation>;
}

declare namespace NotesLayer {
  interface Any extends AnyNotesLayer {}
  interface AnyConstructor extends Identity<typeof AnyNotesLayer> {}

  interface DrawOptions extends PlaceablesLayer.DrawOptions {}

  interface TearDownOptions extends PlaceablesLayer.TearDownOptions {}

  interface LayerOptions extends PlaceablesLayer.LayerOptions<Note.ImplementationClass> {
    name: "notes";
    controllableObjects: true;
    zIndex: 800;
    confirmBeforeCreation: true;
  }

  /** @internal */
  interface _DropDataCommon {
    uuid: string;
  }

  interface DropDataJournalEntry extends _DropDataCommon, Canvas.DropPosition {
    type: "JournalEntry";
  }

  interface DropDataJournalEntryPage extends _DropDataCommon, Canvas.DropPosition {
    type: "JournalEntryPage";
    anchor: { name: string };
  }

  type DropData = DropDataJournalEntry | DropDataJournalEntryPage;

  /** @internal */
  type _PanToNoteOptions = NullishProps<{
    /**
     * The resulting zoom level.
     * @defaultValue `1.5`
     * @remarks The above is a parameter default only; `null` will be eventually be handled by
     * {@link Canvas#_constrainView}, where it will be replaced with `canvas.stage.scale.x`
     */
    scale: number;
  }> &
    InexactPartial<{
      /**
       * The speed of the pan animation in milliseconds.
       * @defaultValue `250`
       * @remarks Can't be `null` as it only has a parameter default
       */
      duration: number;
    }>;

  interface PanToNoteOptions extends _PanToNoteOptions {}
}

export default NotesLayer;

declare abstract class AnyNotesLayer extends NotesLayer {
  constructor(...args: never);
}
