import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { AbstractBaseShader } from "../shaders/_module.mjs";
import type { BaseShaderMixin } from "../mixins/_module.mjs";

/**
 * An abstract filter which provides a framework for reusable definition
 */
declare class AbstractBaseFilter extends BaseShaderMixin(PIXI.Filter) {
  /**
   * A factory method for creating the filter using its defined default values.
   * @param uniforms - An object of uniform values which override the class {@linkcode AbstractBaseFilter.defaultUniforms | defaultUniforms}. (default: `{}`)
   * @param options  - Optional configuration parameters which may influence filter creation or initialization.
   * @returns The constructed AbstractFilter[sic] instance.
   */
  static create<ThisType extends AbstractBaseFilter.AnyConstructor>(
    this: ThisType,
    uniforms?: AbstractBaseShader.Uniforms,
    options?: AnyObject,
  ): FixedInstanceType<ThisType>;
}

declare namespace AbstractBaseFilter {
  interface Any extends AnyAbstractBaseFilter {}
  interface AnyConstructor extends Identity<typeof AnyAbstractBaseFilter> {}
}

export default AbstractBaseFilter;

declare abstract class AnyAbstractBaseFilter extends AbstractBaseFilter {
  constructor(...args: never);
}
