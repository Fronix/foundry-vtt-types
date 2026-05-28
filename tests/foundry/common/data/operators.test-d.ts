import { expectTypeOf } from "vitest";

import operators = foundry.data.operators;
import DataFieldOperator = foundry.data.operators.DataFieldOperator;

expectTypeOf(operators.OPERATOR_IDENTIFIER).toEqualTypeOf<"__$OPERATOR$__">();
expectTypeOf(operators.OPERATOR_VALUE).toEqualTypeOf<typeof operators.OPERATOR_VALUE>();

const op = new DataFieldOperator("foo");
expectTypeOf(op).toEqualTypeOf<DataFieldOperator>();
expectTypeOf(op.toJSON()).toEqualTypeOf<DataFieldOperator.Serialized>();
expectTypeOf(op[operators.OPERATOR_VALUE]).toEqualTypeOf<unknown>();

expectTypeOf(DataFieldOperator.create("foo")).toEqualTypeOf<DataFieldOperator>();
expectTypeOf(DataFieldOperator.get("foo")).toEqualTypeOf<unknown>();
expectTypeOf(DataFieldOperator.set(op, "foo")).toEqualTypeOf<unknown>();
expectTypeOf(DataFieldOperator.equals("a", "b")).toBeBoolean();

const del = new operators.ForcedDeletion();
expectTypeOf(del).toEqualTypeOf<operators.ForcedDeletion>();
// ForcedDeletion extends DataFieldOperator
const _delAsBase: DataFieldOperator = del;
void _delAsBase;

const repl = operators.ForcedReplacement.create("foo");
expectTypeOf(repl).toEqualTypeOf<operators.ForcedReplacement>();

expectTypeOf(operators.reconstructOperator(op.toJSON())).toEqualTypeOf<DataFieldOperator>();
