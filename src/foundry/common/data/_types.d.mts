/* eslint-disable @typescript-eslint/no-unused-vars */
import type { fields } from "./_module.d.mts";
import type { elements, fields as applicationFields } from "#client/applications/_module.d.mts";

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

// TODO: Stubs
export {};

type DataFieldValidator = fields.DataField.Validator<fields.DataField.Any, unknown>;

type DataFieldOptions = fields.DataField.Options.Any;

type DataFieldContext = fields.DataField.ConstructionContext;

type DataFieldValidationOptions = unknown;

// The v14 DataModel cleaning/update/sanitization pipeline typedefs map to DataModel internals that the repo
// deliberately leaves unmodeled (consistent with the protected `updateSource`/`cleanData` omission policy in
// common/abstract/data.d.mts), so there is no repo type to alias here:
//   DataModelCleaningOptions, DataModelUpdateState, DataModelSanitizationOptions, EmbeddedCollectionUpdateContext

type FormGroupConfig = applicationFields.FormGroupConfig;

type FormInputConfig = applicationFields.FormInputConfig<unknown>;

type StringFieldInputConfig = fields.StringField._StringFieldInputConfig;

type CodeMirrorLanguage = elements.HTMLCodeMirrorElement.Language;

type CodeMirrorInputConfig = elements.HTMLCodeMirrorElement.Config;

type LightAnimationData = foundry.data.LightData.AnimationData;

type NumberFieldOptions = fields.NumberField.Options;

type StringFieldOptions = fields.StringField.Options;

type ChoiceInputConfig = fields.StringField.PrepareChoiceConfig;

type ArrayFieldOptions = fields.ArrayField.Options<unknown>;

type TypedObjectFieldOptions = fields.TypedObjectField.Options<unknown>;

type DocumentUUIDFieldOptions = fields.DocumentUUIDField.Options;

type FilePathFieldOptions = fields.FilePathField.Options;

type DocumentFlags = Record<string, Record<string, unknown>>;

type DocumentStats = fields.DocumentStatsField.Data;

type JavaScriptFieldOptions = fields.JavaScriptField.Options;

type GridOffsetFieldOptions = fields.GridOffsetField.Options;

type GridOffsetsFieldOptions = fields.GridOffsetsField.Options;

type ElementValidationFailure = foundry.data.validation.DataModelValidationFailure.ElementValidationFailure;
