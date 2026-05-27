import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type { DeepPartial, Identity } from "#utils";

import Document = foundry.abstract.Document;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentOwnershipConfig: DocumentOwnershipConfig.Any;
    }
  }
}

/**
 * A generic application for configuring permissions for various Document types.
 */
declare class DocumentOwnershipConfig<
  Document extends Document.Any = Document.Any,
  RenderContext extends object = DocumentOwnershipConfig.RenderContext<Document>,
  Configuration extends DocumentOwnershipConfig.Configuration<Document> =
    DocumentOwnershipConfig.Configuration<Document>,
  RenderOptions extends DocumentOwnershipConfig.RenderOptions = DocumentOwnershipConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<Document, RenderContext, Configuration, RenderOptions> {
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
}

declare namespace DocumentOwnershipConfig {
  interface Any extends AnyDocumentOwnershipConfig {}
  interface AnyConstructor extends Identity<typeof AnyDocumentOwnershipConfig> {}

  /** A selectable permission level with its localized label. */
  interface PermissionLevel {
    level: number;
    label: string;
  }

  /** A per-user ownership row. */
  interface UserOwnership {
    user: User.Implementation;
    level: number;
    isAuthor: boolean;
  }

  interface RenderContext<Document extends Document.Any = Document.Any>
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Document> {
    currentDefault: number;
    instructions: string;
    defaultLevels: PermissionLevel[];
    playerLevels: PermissionLevel[];
    isFolder: boolean;
    showGM: boolean;
    users: UserOwnership[];
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration<Document extends Document.Any = Document.Any>
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Document> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyDocumentOwnershipConfig extends DocumentOwnershipConfig<
  Document.Any,
  object,
  DocumentOwnershipConfig.Configuration<Document.Any>,
  DocumentOwnershipConfig.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentOwnershipConfig;
