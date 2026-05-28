/**
 * A symbol used to reference the operator value which ensures it does not collide with a proxied key of that value.
 */
export const OPERATOR_VALUE: unique symbol;

/**
 * A unique string used in serialization to identify that an object should be deserialized to a DataFieldOperator.
 */
export const OPERATOR_IDENTIFIER: "__$OPERATOR$__";

/**
 * A base class used for all special database operations.
 */
export class DataFieldOperator {
  constructor(value?: unknown);

  /**
   * The value that a field should be assigned to.
   */
  [OPERATOR_VALUE]: unknown;

  toJSON(): DataFieldOperator.Serialized;

  /**
   * Create a DataFieldOperator using a provided value.
   */
  static create(value?: unknown): DataFieldOperator;

  /**
   * Retrieve the inner value of the DataFieldOperator, or return the value passed if not a DataFieldOperator.
   */
  static get(value: unknown): unknown;

  /**
   * Assign the inner value of the DataFieldOperator.
   */
  static set(operator: DataFieldOperator, value: unknown): unknown;

  /**
   * A comparison helper function that asserts whether two values are equal when one or both values may be
   * DataFieldOperator instances.
   */
  static equals(a: unknown, b: unknown): boolean;
}

export namespace DataFieldOperator {
  /** The serialized form of a {@linkcode DataFieldOperator}, produced by {@linkcode DataFieldOperator.toJSON}. */
  interface Serialized {
    [OPERATOR_IDENTIFIER]: string;
    value: unknown;
  }
}

/**
 * Force the deletion of a certain DataModel field, resetting its value back to undefined.
 */
export class ForcedDeletion extends DataFieldOperator {
  constructor(_value?: unknown);
}

/**
 * Force the replacement of a certain DataModel field, assigning it to some explicit value without inner recursion.
 */
export class ForcedReplacement extends DataFieldOperator {
  constructor(value?: unknown);

  /**
   * Create a ForcedReplacement instance that is wrapped in a Proxy so that it can be inspected.
   */
  static override create(value?: unknown): ForcedReplacement;
}

/**
 * Reconstruct a DataFieldOperator instance from a serialized object.
 */
export function reconstructOperator(obj: DataFieldOperator.Serialized): DataFieldOperator;
