import { expectTypeOf } from "vitest";

type DataModelValidationFailure = foundry.data.validation.DataModelValidationFailure;

new foundry.data.validation.DataModelValidationFailure();

// v14: the first parameter is the message string; the second is the options bag.
const myModelValidationFailure = new foundry.data.validation.DataModelValidationFailure("something", {
  invalidValue: 1,
  fallbackValue: 2,
  fieldPath: "foo.bar",
  dropped: true,
  unresolved: false,
  cause: new Error("nested"),
});

expectTypeOf(myModelValidationFailure.invalidValue).toEqualTypeOf<unknown>();
expectTypeOf(myModelValidationFailure.fallbackValue).toEqualTypeOf<unknown>();
expectTypeOf(myModelValidationFailure.fieldPath).toEqualTypeOf<string>();
expectTypeOf(myModelValidationFailure.dropped).toEqualTypeOf<boolean>();
expectTypeOf(myModelValidationFailure.fields).toEqualTypeOf<Record<string, DataModelValidationFailure>>();
expectTypeOf(myModelValidationFailure.joint).toEqualTypeOf<string>();
expectTypeOf(myModelValidationFailure.message).toEqualTypeOf<string>();
expectTypeOf(myModelValidationFailure.options).toEqualTypeOf<ErrorOptions>();
expectTypeOf(myModelValidationFailure.unresolved).toEqualTypeOf<boolean>();

expectTypeOf(myModelValidationFailure.empty).toEqualTypeOf<boolean>();
expectTypeOf(myModelValidationFailure.asError()).toEqualTypeOf<foundry.data.validation.DataModelValidationError>();
expectTypeOf(myModelValidationFailure.copyTo(myModelValidationFailure)).toEqualTypeOf<void>();
expectTypeOf(myModelValidationFailure.getFailure()).toEqualTypeOf<DataModelValidationFailure | null>();
expectTypeOf(myModelValidationFailure.getFailure("foo.bar")).toEqualTypeOf<DataModelValidationFailure | null>();
expectTypeOf(myModelValidationFailure.getAllFailures()).toEqualTypeOf<Record<string, DataModelValidationFailure>>();
expectTypeOf(myModelValidationFailure.toString()).toEqualTypeOf<string>();
expectTypeOf(myModelValidationFailure.logAsTable()).toEqualTypeOf<void>();
expectTypeOf(myModelValidationFailure.asHTML()).toEqualTypeOf<string>();

const myError = new foundry.data.validation.DataModelValidationError("Failure", { cause: "nested" });
new foundry.data.validation.DataModelValidationError(myModelValidationFailure);

expectTypeOf(myError.getFailure("foo")).toEqualTypeOf<DataModelValidationFailure | null>();
expectTypeOf(myError.getAllFailures()).toEqualTypeOf<Record<string, DataModelValidationFailure>>();
expectTypeOf(myError.logAsTable()).toEqualTypeOf<void>();
expectTypeOf(myError.asHTML()).toEqualTypeOf<string>();
