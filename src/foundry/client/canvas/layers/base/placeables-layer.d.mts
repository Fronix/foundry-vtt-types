import type {
  AnyObject,
  Brand,
  FixedInstanceType,
  HandleEmptyObject,
  Identity,
  InexactPartial,
  NullishProps,
  ToMethod,
} from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type Document from "#common/abstract/document.d.mts";
import type EmbeddedCollection from "#common/abstract/embedded-collection.d.mts";
import type { CanvasLayer, InteractionLayer } from "../_module.d.mts";
import type { CanvasQuadtree } from "#client/canvas/geometry/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

/**
 * A subclass of Canvas Layer which is specifically designed to contain multiple PlaceableObject instances,
 * each corresponding to an embedded Document.
 * @template DocumentName - The key of the configuration which defines the object and document class.
 * @template Options      - The type of the options in this layer.
 */
declare class PlaceablesLayer<out DocumentName extends PlaceablesLayer.DocumentNames> extends InteractionLayer {
  /**
   * Placeable Layer Objects
   * @defaultValue `null`
   * @remarks Set to `new PIXI.Container()` on draw, `null` on tearDown
   */
  objects: PIXI.Container | null;

  /**
   * Preview container for config previews
   * @defaultValue `null`
   * @remarks Set to `new PIXI.Container()` on draw
   */
  protected _configPreview: PIXI.Container | null;

  /**
   * Preview Object Placement
   * @defaultValue `null`
   * @remarks Only `null` prior to first draw, does not get reset on tearDown
   */
  preview: PIXI.Container | null;

  /**
   * Keep track of history so that CTRL+Z can undo changes
   * @defaultValue `[]`
   */
  history: PlaceablesLayer.HistoryEntry<DocumentName>[];

  /**
   * Keep track of objects copied with CTRL+C/X which can be pasted later.
   * @defaultValue `{ objects: [], cut: false }`
   */
  clipboard: PlaceablesLayer.Clipboard<DocumentName>;

  /**
   * A Quadtree which partitions and organizes Walls into quadrants for efficient target identification.
   * @remarks Is `new CanvasQuadtree()` if `quadtree` is truthy in `this.constructor.layerOptions`, else `null`
   */
  // TODO: If dynamic static stuff can be worked out, this can be conditional on `options.quadtree`
  quadtree: CanvasQuadtree<Document.ObjectFor<DocumentName>> | null;

  /**
   * @remarks Override not in foundry docs but implicit from layerOptions
   */
  override options: PlaceablesLayer.LayerOptions.Any;

  /**
   * Configuration options for the PlaceablesLayer.
   * @defaultValue
   * ```js
   * foundry.utils.mergeObject(super.layerOptions, {
   *   baseClass: PlaceablesLayer,
   *   controllableObjects: false,
   *   rotatableObjects: false,
   *   keyboardMovableObjects: false,
   *   confirmDeleteKey: false,
   *   confirmBeforeCreation: false,
   *   controlObjectAfterCreation: true,
   *   objectClass: CONFIG[this.documentName]?.objectClass,
   *   quadtree: true,
   * })
   * ```
   */
  static override get layerOptions(): PlaceablesLayer.LayerOptions.Any;

  /**
   * A reference to the named Document type which is contained within this Canvas Layer.
   * @defaultValue `undefined`
   * @abstract
   */
  static documentName: PlaceablesLayer.DocumentNames;

  /**
   * Obtain a reference to the Collection of embedded Document instances within the currently viewed Scene
   * @remarks Returns `null` if `canvas.scene` does not have an EmbeddedCollection for the layer's `static documentName`
   */
  get documentCollection(): EmbeddedCollection<Document.ImplementationFor<DocumentName>, Scene.Implementation> | null;

  /**
   * Obtain a reference to the PlaceableObject class definition which represents the Document type in this layer.
   * @privateRemarks Would be `Document.ConfiguredObjectInstanceForName<DocumentName>` if statics could see type params
   */
  static get placeableClass(): PlaceableObject.AnyConstructor;

  /**
   * To know whether this layer has a preview object or not.
   */
  get hasPreview(): boolean;

  /**
   * If objects on this PlaceablesLayer have a HUD UI, provide a reference to its instance
   * @remarks Returns `null` unless overridden by subclass
   */
  get hud(): foundry.applications.hud.BasePlaceableHUD<Document.ObjectFor<DocumentName>> | null;

  /**
   * The default creation data sourced from this layer's palette, if it has one.
   * @remarks Returns `this.constructor.paletteClass?.createData ?? {}`
   */
  // FIXME: PaletteApplication // The `paletteClass` static and its palette types are added with the `applications/sheets/palette/` files in Batch 5.6.
  get paletteCreateData(): AnyObject;

  /**
   * A convenience method for accessing the placeable object instances contained in this layer
   */
  get placeables(): Document.ObjectFor<DocumentName>[];

  /**
   * An Array of placeable objects in this layer which have the _controlled attribute
   */
  get controlled(): Document.ObjectFor<DocumentName>[];

  /**
   * Iterates over placeable objects that are eligible for control/select.
   * @yields A placeable object
   */
  controllableObjects(): Generator<PlaceableObject.Any, void, undefined>;

  /**
   * Track the set of PlaceableObjects on this layer which are currently controlled.
   */
  get controlledObjects(): Map<string, Document.ObjectFor<DocumentName>>;

  /**
   * Track the PlaceableObject on this layer which is currently hovered upon.
   */
  get hover(): Document.ObjectFor<DocumentName> | null;

  set hover(object);

  /**
   * Track whether "highlight all objects" is currently active
   * @defaultValue `false`
   * @remarks Set by {@link Canvas.highlightObjects | `Canvas#highlightObjects`}
   */
  highlightObjects: boolean;

  /**
   * A throttled function that rotates many placeables.
   */
  protected _throttleRotateMany: (options: AnyObject) => Promise<Document.ObjectFor<DocumentName>[]>;

  /**
   * Get the maximum sort value of all placeables.
   * @returns The maximum sort value (-Infinity if there are no objects)
   * @remarks Despite the above comment, returns `-Infinity` if the schema of the layer's document lacks a `sort` field, object count is not relevant
   */
  getMaxSort(): number;

  /**
   * Send the controlled objects of this layer to the back or bring them to the front.
   * @param front - Bring to front instead of send to back?
   * @returns Returns `undefined` if the layer does not have a sortable object. Returns `false` if the controlled objects are already at the front/back.
   * @remarks Same check as {@link PlaceablesLayer.getMaxSort | `PlaceablesLayer#getMaxSort`}
   */
  protected _sendToBackOrBringToFront(front?: boolean | null): boolean | void;

  /**
   * Snaps the given point to grid. The layer defines the snapping behavior.
   * @param point - The point that is to be snapped
   * @returns The snapped point
   */
  getSnappedPoint(point: Canvas.Point): Canvas.Point;

  protected override _highlightObjects(active: boolean): void;

  /**
   * Iterate over all documents which are viewed in the current Level.
   * @remarks Yields the documents of {@link PlaceablesLayer.documentCollection | `documentCollection`} whose `viewed` is true.
   */
  // TODO(v14-levels): the "viewed in the current Level" semantics depend on the Scene Levels subsystem (Phase 7).
  viewedDocuments(): Generator<Document.ImplementationFor<DocumentName>, void, undefined>;

  protected override _draw(options: HandleEmptyObject<PlaceablesLayer.DrawOptions>): Promise<void>;

  /**
   * Draw a single placeable object
   * @param document - The Document instance used to create the placeable object
   */
  createObject(document: Document.ImplementationFor<DocumentName>): Document.ObjectFor<DocumentName>;

  protected override _tearDown(options: HandleEmptyObject<PlaceablesLayer.TearDownOptions>): Promise<void>;

  protected override _activate(): void;

  protected override _deactivate(): void;

  /**
   * Clear the contents of the preview container, restoring visibility of original (non-preview) objects.
   */
  clearPreviewContainer(): void;

  /**
   * Get a PlaceableObject contained in this layer by its ID.
   * Returns undefined if the object doesn't exist or if the canvas is not rendering a Scene.
   * @param objectId - The ID of the contained object to retrieve
   * @returns The object instance, or undefined
   */
  get(objectId: string): Document.ObjectFor<DocumentName> | undefined;

  /**
   * Acquire control over all PlaceableObject instances which are visible and controllable within the layer.
   *
   * @param options - Options passed to the control method of each object
   *                  (default: `{}`)
   * @returns An array of objects that were controlled
   */
  controlAll(
    options?: PlaceableObject.ControlOptions, // not:null (property set on it without checks)
  ): Document.ObjectFor<DocumentName>[];

  /**
   * Release all controlled PlaceableObject instance from this layer.
   *
   * @param options - Options passed to the release method of each object
   *                  (default: `{}`)
   * @returns The number of PlaceableObject instances which were released
   */
  releaseAll(
    options?: PlaceableObject.ReleaseOptions, // not:null (`Placeable#release` behaviour depends on subclasses, cannot assume null allowed)
  ): number;

  /**
   * Simultaneously rotate multiple PlaceableObjects using a provided angle or incremental.
   * This executes a single database operation using Scene#updateEmbeddedDocuments.
   * If rotating only a single object, it is better to use the PlaceableObject.rotate instance method.
   *
   * @param options - Options which configure how multiple objects are rotated
   *                  (default: `{}`)
   * @returns An array of objects which were rotated
   * @throws If both `options.angle` and `options.delta` are nullish
   * @remarks Overload is necessary to ensure that one of `angle` or `delta` are numeric in `options`, as neither has a parameter default
   */
  rotateMany(options: PlaceablesLayer.RotateManyOptionsWithAngle): Promise<Document.ObjectFor<DocumentName>[]>;
  rotateMany(options: PlaceablesLayer.RotateManyOptionsWithDelta): Promise<Document.ObjectFor<DocumentName>[]>;

  /**
   * Simultaneously move multiple PlaceableObjects via keyboard movement offsets.
   * This executes a single database operation using Scene#updateEmbeddedDocuments.
   *
   * @param options - Options which configure how multiple objects are moved
   *                  (default: `{}`)
   * @returns An array of objects which were moved during the operation
   * @throws If an array is passed for `ids` and any of its contents are not a valid ID for a placeable on this layer
   */
  moveMany(
    options?: PlaceablesLayer.MoveManyOptions, // not:null (destructured)
  ): Promise<Document.ObjectFor<DocumentName>[]> | undefined;

  /**
   * Prepare the updates and update options for moving the given placeable objects via keyboard.
   * @see {@linkcode PlaceablesLayer.moveMany}
   */
  protected _prepareKeyboardMovementUpdates(
    objects: Document.ObjectFor<DocumentName>[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): [updates: AnyObject[], options?: AnyObject];

  /**
   * Prepare the updates and update options for rotating the given placeable objects via keyboard.
   * @see {@linkcode PlaceablesLayer.moveMany}
   */
  protected _prepareKeyboardRotationUpdates(
    objects: Document.ObjectFor<DocumentName>[],
    dx: -1 | 0 | 1,
    dy: -1 | 0 | 1,
    dz: -1 | 0 | 1,
  ): [updates: AnyObject[], options?: AnyObject];

  /**
   * Assign a set of render flags to all placeables in this layer.
   * @param flags - The flags to set
   */
  setAllRenderFlags(flags: Record<string, boolean>): void;

  /**
   * An internal helper method to identify the array of PlaceableObjects which can be moved or rotated.
   * @param ids           - An explicit array of IDs requested.
   * @param includeLocked - Include locked objects which would otherwise be ignored?
   * @returns An array of objects which can be moved or rotated
   * @throws If an array is passed for `ids` and any of its contents are not a valid ID for a placeable on this layer
   * @remarks Any non-array input for `ids` will default to using currently controlled objects
   */
  protected _getMovableObjects(
    ids?: string[] | null,
    includeLocked?: boolean | null,
  ): Document.ObjectFor<DocumentName>[];

  /**
   * An internal helper method to identify the array of PlaceableObjects which can be copied/cut.
   * @param options - Additional options
   * @returns An array of objects which can be copied/cut
   */
  protected _getCopyableObjects(options: PlaceablesLayer.GetCopyableObjectsOptions): Document.ObjectFor<DocumentName>[];

  /**
   * Undo a change to the objects in this layer
   * This method is typically activated using CTRL+Z while the layer is active
   */
  undoHistory(): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Undo creation with deletion workflow
   * @param event - The history event being undone
   * @returns An array of documents which were modified by the undo operation
   */
  protected _onUndoCreate(
    event: PlaceablesLayer.HistoryEntry<DocumentName>,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Undo updates with update workflow.
   * @param event - The history event being undone
   * @returns An array of documents which were modified by the undo operation
   */
  protected _onUndoUpdate(
    event: PlaceablesLayer.HistoryEntry<DocumentName>,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Undo deletion with creation workflow.
   * @param event - The history event being undone
   * @returns An array of documents which were modified by the undo operation
   */
  protected _onUndoDelete(
    event: PlaceablesLayer.HistoryEntry<DocumentName>,
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * A helper method to prompt for deletion of all PlaceableObject instances within the Scene
   * Renders a confirmation dialogue to confirm with the requester that all objects will be deleted
   * @returns An array of Document objects which were deleted by the operation
   * @throws If `!game.user.isGM`
   * @remarks Returns `null` if the dialog spawned is closed by header button, `false` if cancelled by button, `undefined` if confirmed
   */
  deleteAll(): Promise<undefined | false | null>;

  /**
   * Record a new CRUD event in the history log so that it can be undone later.
   * The base implementation calls {@link PlaceablesLayer._storeHistory | `PlaceablesLayer#_storeHistory`} without
   * passing the given options. Subclasses may override this function and can call
   * {@link PlaceablesLayer._storeHistory | `PlaceablesLayer#_storeHistory`} themselves to pass options as needed.
   * @param type    - The event type (create, update, delete)
   * @param data    - The create/update/delete data
   * @param options - The create/update/delete options
   * @throws An error if any of the objects in the `data` array lack an `_id` key
   */
  storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, DocumentName>,
    options?: AnyObject,
  ): void;

  /**
   * Record a new CRUD event in the history log so that it can be undone later.
   * Updates without changes are filtered out unless the `diff` option is set to false.
   * This function may not be overridden.
   * @param type    - The event type (create, update, delete)
   * @param data    - The create/update/delete data
   * @param options - The options of the undo operation
   */
  protected _storeHistory<Operation extends Document.Database.OperationAction>(
    type: Operation,
    data: PlaceablesLayer.HistoryDataFor<Operation, DocumentName>,
    options?: AnyObject,
  ): void;

  /**
   * Copy (or cut) currently controlled PlaceableObjects, ready to paste back into the Scene later.
   * @param options - Additional options
   * @returns The Array of copied PlaceableObject instances
   * @remarks If the current layer doesn't allow objects to be controlled, copies the hovered object.
   */
  copyObjects(
    options?: PlaceablesLayer.CopyObjectsOptions, // not:null (destructured)
  ): ReadonlyArray<Document.ObjectFor<DocumentName>>;

  /**
   * Paste currently copied PlaceableObjects back to the layer by creating new copies
   * @param position - The destination position for the copied data.
   * @param options  - Options which modify the paste operation
   * @returns An Array of created PlaceableObject instances
   */
  pasteObjects(
    position: Canvas.Point,
    options?: PlaceablesLayer.PasteOptions, // not:null (destructured)
  ): Promise<Document.ImplementationFor<DocumentName>[]>;

  /**
   * Select all PlaceableObject instances which fall within a coordinate rectangle.
   * @param options           - (default: `{}`)
   * @param additionalOptions - (default: `{}`)
   * @returns A boolean for whether the controlled set was changed in the operation
   * @remarks Despite being a `={}` parameter, an `options` object with positive `width` and `height` properties
   * is required for reasonable operation
   */
  selectObjects(
    options: PlaceablesLayer.SelectObjectsOptions,
    additionalOptions?: PlaceablesLayer.SelectObjectsAdditionalOptions, // not:null (destructured)
  ): boolean;

  /**
   * Update all objects in this layer with a provided transformation.
   * Conditionally filter to only apply to objects which match a certain condition.
   * @param transformation - An object of data or function to apply to all matched objects
   * @param condition      - A function which tests whether to target each object (default: `null`)
   * @param options        - Additional options passed to Document.update (default: `{}`)
   * @returns An array of updated data once the operation is complete
   * @throws An error if the `transformation` parameter is neither a function nor a plain object
   */
  updateAll(
    transformation: PlaceablesLayer.UpdateAllTransformation<DocumentName>,
    condition?: PlaceablesLayer.UpdateAllCondition<DocumentName> | null,
    options?: Document.Database.UpdateManyDocumentsOperationForName<DocumentName>,
  ): Promise<Array<Document.ImplementationFor<DocumentName>>>;

  /**
   * Get the world-transformed drop position.
   * @returns Returns the transformed x, y co-ordinates, or false if the drag event was outside the canvas.
   */
  protected _canvasCoordinatesFromDrop(
    event: DragEvent,
    options?: PlaceablesLayer.CanvasCoordinatesFromDropOptions, // not:null (destructured)
  ): Canvas.PointTuple | false;

  /**
   * Create a preview of this layer's object type from a world document and show its sheet to be finalized.
   * @param createData - The data to create the object with.
   * @param options    - Options which configure preview creation
   * @returns The created preview object
   * @remarks Returns a temporary (`new PlaceableDocument()`) document
   */
  protected _createPreview(
    createData: Document.CreateDataForName<DocumentName>,
    options?: PlaceablesLayer.CreatePreviewOptions, // not:null (destructured)
  ): Promise<Document.ObjectFor<DocumentName>>;

  protected override _onClickLeft(event: Canvas.Event.Pointer): void;

  protected override _canDragLeftStart(user: User.Implementation, event: Canvas.Event.Pointer): boolean;

  /**
   * Is a creation tool active?
   */
  protected _isCreationToolActive(): boolean;

  protected override _onDragLeftStart(event: Canvas.Event.Pointer): void;

  /**
   * Create the preview document data from the drag start event.
   * @param event - The pointer event
   * @returns The initial document data
   */
  protected _createDragPreviewData(event: Canvas.Event.Pointer): AnyObject;

  protected override _onDragLeftDrop(event: Canvas.Event.Pointer): void;

  /**
   * Commit the drag-left drop.
   * @param event - The pointer event.
   */
  protected _commitDragLeftDrop(event: Canvas.Event.Pointer): Promise<void>;

  protected override _onDragLeftCancel(event: Canvas.Event.Pointer): void;

  protected override _onClickRight(event: Canvas.Event.Pointer): void;

  /** @privateRemarks `void` added to return union for TokenLayer reasons */
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  protected override _onMouseWheel(event: Canvas.Event.Wheel): Promise<Document.ObjectFor<DocumentName>[] | void>;

  protected override _onDeleteKey(event: Canvas.Event.DeleteKey): boolean;

  /**
   * Confirm deletion via the delete key.
   * Called only if {@link PlaceablesLayer.LayerOptions.confirmDeleteKey | `confirmDeleteKey`} is true.
   * @param documents - The documents that will be deleted on confirmation.
   * @returns True if the deletion is confirmed to proceed.
   */
  protected _confirmDeleteKey(documents: Document.ImplementationFor<DocumentName>[]): Promise<boolean>;

  protected override _onSelectAllKey(event: KeyboardEvent): boolean;

  protected override _onDismissKey(event: KeyboardEvent): boolean;

  protected override _onUndoKey(event: KeyboardEvent): boolean;

  protected override _onCutKey(event: KeyboardEvent): boolean;

  protected override _onCopyKey(event: KeyboardEvent): boolean;

  protected override _onPasteKey(event: KeyboardEvent): boolean;

  /**
   * @deprecated since v14
   * @remarks `"PlaceablesLayer.CREATION_STATES has been deprecated without replacement."`
   */
  static get CREATION_STATES(): PlaceablesLayer.CreationStates;

  /**
   * @deprecated since v14
   * @remarks `"{name}#getDocuments is deprecated in favor of the {name}#viewedDocuments generator which is aware of Scene Levels."`
   */
  getDocuments(): Document.ImplementationFor<DocumentName>[];
}

declare namespace PlaceablesLayer {
  interface Any extends AnyPlaceablesLayer {}
  interface AnyConstructor extends Identity<typeof AnyPlaceablesLayer> {}

  type DocumentNames = Document.PlaceableType;

  type ImplementationClassFor<Name extends DocumentNames> = CONFIG[Name]["layerClass"];
  type ImplementationFor<Name extends DocumentNames> = FixedInstanceType<CONFIG[Name]["layerClass"]>;

  type DocumentNameOf<ConcretePlaceablesLayer extends PlaceablesLayer.Any> =
    ConcretePlaceablesLayer extends PlaceablesLayer<infer DocumentName> ? DocumentName : never;

  type ObjectOf<ConcretePlaceablesLayer extends PlaceablesLayer.Any> = Document.ObjectFor<
    DocumentNameOf<ConcretePlaceablesLayer>
  >;

  interface DrawOptions extends InteractionLayer.DrawOptions {}

  interface TearDownOptions extends CanvasLayer.TearDownOptions {}

  /**
   * Objects copied with CTRL+C/X which can be pasted later.
   */
  interface Clipboard<DocumentName extends DocumentNames> {
    objects: Document.ObjectFor<DocumentName>[];
    cut: boolean;
  }

  type CREATION_STATES = Brand<number, "PlaceablesLayer.CREATION_STATES">;

  /**
   * Creation states affected to placeables during their construction.
   * @privateRemarks The `CREATION_STATES` references below are to the Brand type above, which is not
   * deprecated; the same-named `PlaceablesLayer.CREATION_STATES` static getter is, hence the disable.
   */
  /* eslint-disable @typescript-eslint/no-deprecated */
  interface CreationStates {
    NONE: 0 & CREATION_STATES;
    POTENTIAL: 1 & CREATION_STATES;
    CONFIRMED: 2 & CREATION_STATES;
    COMPLETED: 3 & CREATION_STATES;
  }
  /* eslint-enable @typescript-eslint/no-deprecated */

  interface LayerOptions<ConcretePlaceable extends PlaceableObject.AnyConstructor>
    extends InteractionLayer.LayerOptions {
    baseClass: typeof PlaceablesLayer;

    /**
     * Can placeable objects in this layer be controlled?
     * @defaultValue `false`
     */
    controllableObjects: boolean;

    /**
     * Can placeable objects in this layer be rotated?
     * @defaultValue `false`
     */
    rotatableObjects: boolean;

    /**
     * Can placeable objects in this layer be moved via keyboard?
     * @defaultValue `false`
     */
    keyboardMovableObjects: boolean;

    /**
     * Confirm placeable object deletion with a dialog?
     * @defaultValue `false`
     */
    confirmDeleteKey: boolean;

    /**
     * Confirm before creating the drawn object (for the given tools)?
     * @defaultValue `false`
     */
    confirmBeforeCreation: boolean | string[] | (() => boolean);

    /**
     * Control the drawn object that has been created (for the given tools)?
     * @defaultValue `true`
     */
    controlObjectAfterCreation: boolean | string[] | (() => boolean);

    /**
     * The class used to represent an object on this layer.
     * @defaultValue `CONFIG[this.documentName]?.objectClass`
     */
    objectClass: ConcretePlaceable;

    /**
     * Does this layer use a quadtree to track object positions?
     * @defaultValue `true`
     */
    quadtree: boolean;
  }

  namespace LayerOptions {
    interface Any extends LayerOptions<any> {}
  }

  /** @internal */
  type _RotateManyOptions = NullishProps<{
    /**
     * Snap the resulting angle to a multiple of some increment (in degrees)
     * @remarks Passed to {@link PlaceableObject._updateRotation | `PlaceableObject#_updateRotation`} where it is checked for `> 0` before being passed to the non-null-safe `Number#toNearest`
     */
    snap: number;

    /**
     * An Array of object IDs to target for rotation
     * @remarks Passed to {@link PlaceablesLayer._getMovableObjects | `PlaceablesLayer#_getMovableObjects`}
     */
    ids: string[];

    /**
     * Rotate objects whose documents are locked?
     * @defaultValue `false`
     */
    includeLocked: boolean;
  }>;

  /** @internal */
  interface _RotateManyOptionsAngle {
    /**
     * A target angle of rotation (in degrees) where zero faces "south"
     */
    angle: number;
  }

  /** @internal */
  interface _RotateManyOptionsDelta {
    /**
     * An incremental angle of rotation (in degrees)
     */
    delta: number;
  }

  interface RotateManyOptionsWithAngle
    extends _RotateManyOptions, NullishProps<_RotateManyOptionsDelta>, _RotateManyOptionsAngle {}

  interface RotateManyOptionsWithDelta
    extends _RotateManyOptions, NullishProps<_RotateManyOptionsAngle>, _RotateManyOptionsDelta {}

  /** @internal */
  type _MoveManyOptions = InexactPartial<{
    /**
     * Horizontal movement direction
     * @defaultValue `0`
     * @remarks Can't be `null` because it only has a parameter default
     */
    dx: -1 | 0 | 1;

    /**
     * Vertical movement direction
     * @defaultValue `0`
     * @remarks Can't be `null` because it only has a parameter default
     */
    dy: -1 | 0 | 1;

    /**
     * Movement direction along the z-axis (elevation)
     * @defaultValue `0`
     * @remarks Can't be `null` because it only has a parameter default
     */
    dz: -1 | 0 | 1;
  }> &
    NullishProps<{
      /**
       * Rotate the placeable to the keyboard direction instead of moving
       * @defaultValue `false`
       */
      rotate: boolean;

      /**
       * An Array of object IDs to target for movement. The default is the IDs of controlled objects.
       * @defaultValue `this.controlled.filter(o => !o.data.locked).map(o => o.id)`
       */
      ids: string[];

      /**
       * Move objects whose documents are locked?
       * @defaultValue `false`
       */
      includeLocked: boolean;
    }>;

  interface MoveManyOptions extends _MoveManyOptions {}

  /** @privateRemarks Handled like this rather than an interface mapping to avoid extraneous type calculation */
  type HistoryDataFor<Action extends Document.Database.OperationAction, DocumentName extends DocumentNames> =
    | (Action extends "create" ? { _id: string } : never)
    | (Action extends "update" ? Document.UpdateDataForName<DocumentName> & { _id: string } : never)
    | (Action extends "delete" ? Document.CreateDataForName<DocumentName> & { _id: string } : never);

  type HistoryEntry<DocumentName extends DocumentNames> =
    | { type: "create"; data: HistoryDataFor<"create", DocumentName>[]; options: AnyObject }
    | {
        type: "update";
        data: HistoryDataFor<"update", DocumentName>[];
        options: AnyObject;
      }
    | {
        type: "delete";
        data: HistoryDataFor<"delete", DocumentName>[];
        options: AnyObject;
      };

  /** @internal */
  type _CopyObjectsOptions = InexactPartial<{
    /**
     * Cut instead of copy?
     * @defaultValue `false`
     * @remarks Can't be `null` because it only has a parameter default
     */
    cut: boolean;
  }>;

  interface CopyObjectsOptions extends _CopyObjectsOptions {}

  /** Options for {@link PlaceablesLayer._getCopyableObjects | `PlaceablesLayer#_getCopyableObjects`}. */
  interface GetCopyableObjectsOptions {
    /** Cut instead of copy? */
    cut: boolean;
  }

  /** @internal */
  type _PasteOptions = NullishProps<{
    /**
     * Paste data in a hidden state, if applicable. Default is false.
     * @defaultValue `false`
     */
    hidden: boolean;

    /**
     * Snap the resulting objects to the grid. Default is true.
     * @defaultValue `true`
     */
    snap: boolean;
  }>;

  interface PasteOptions extends _PasteOptions {}

  /**
   * @internal
   */
  type _SelectObjectsOptions = {
    /**
     * The top-left x-coordinate of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    x: number;

    /**
     * The top-left y-coordinate of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    y: number;

    /**
     * The width of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    width: number;

    /**
     * The height of the selection rectangle.
     * @remarks Foundry marked optional. Ignored as the default of 0 is questionable.
     */
    height: number;
  } & InexactPartial<{
    /**
     * Optional arguments provided to any called release() method
     * @defaultValue `{}`
     * @remarks Can't be null as it only has a parameter default
     */
    releaseOptions: PlaceableObject.ReleaseOptions;

    /**
     * Optional arguments provided to any called control() method
     * @defaultValue `{}`
     * @remarks Can't be null as it only has a parameter default
     */
    controlOptions: PlaceableObject.ControlOptions;
  }>;

  interface SelectObjectsOptions extends _SelectObjectsOptions {}

  /**
   * @internal
   * @privateRemarks This is functionally identical to `PlaceableObject.ControlOptions`, but only the one key gets checked,
   * and it's not passed on anywhere, so it gets its own type to not cause confusion with `SelectObjectsOptions["controlOptions"]`
   */
  type _SelectObjectAdditionalOptions = NullishProps<{
    /**
     * Whether to release other selected objects.
     * @defaultValue `true`
     */
    releaseOthers: boolean;
  }>;

  interface SelectObjectsAdditionalOptions extends _SelectObjectAdditionalOptions {}

  // Note(LukeAbby): This uses `ToMethod` for variance reasons. Specifically this should be
  // covariant over `DocumentName`.
  type UpdateAllTransformation<DocumentName extends DocumentNames> =
    | ToMethod<(placeable: Document.ObjectFor<DocumentName>) => Document.UpdateDataForName<DocumentName>>
    | Document.UpdateDataForName<DocumentName>;

  type UpdateAllCondition<DocumentName extends DocumentNames> = (
    placeable: Document.ObjectFor<DocumentName>,
  ) => boolean;

  /** @deprecated Use {@linkcode Document.Database.UpdateManyDocumentsOperationForName} directly. This type will be removed in v14. */
  type UpdateAllOptions<DocumentName extends DocumentNames> =
    Document.Database.UpdateManyDocumentsOperationForName<DocumentName>;

  /** @internal */
  type _CanvasCoordinatesFromDropOptions = NullishProps<{
    /**
     * Return the co-ordinates of the center of the nearest grid element.
     * @defaultValue `true`
     */
    center: boolean;
  }>;

  interface CanvasCoordinatesFromDropOptions extends _CanvasCoordinatesFromDropOptions {}

  /** @internal */
  type _CreatePreviewOptions = NullishProps<{
    /**
     * Render the preview object config sheet?
     * @defaultValue `true`
     */
    renderSheet: boolean;

    /**
     * The offset-top position where the sheet should be rendered
     * @defaultValue `0`
     */
    top: number;

    /**
     * The offset-left position where the sheet should be rendered
     * @defaultValue `0`
     */
    left: number;
  }>;

  interface CreatePreviewOptions extends _CreatePreviewOptions {}
}

export default PlaceablesLayer;

declare abstract class AnyPlaceablesLayer extends PlaceablesLayer<PlaceablesLayer.DocumentNames> {
  constructor(...args: never);
}
