import { FormProps, FormValidateCallback } from './types';
declare function validate(callback?: FormValidateCallback): Promise<boolean>;
declare function validateField(propsToValidate: string | string[], callback?: FormValidateCallback): Promise<boolean>;
declare function resetFields(propsToReset?: string | string[]): void;
declare function clearValidate(propsToClear?: string | string[]): void;
declare function scrollToField(prop: string, options?: ScrollIntoViewOptions): void;
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<FormProps, {
    clearValidate: typeof clearValidate;
    resetFields: typeof resetFields;
    scrollToField: typeof scrollToField;
    validate: typeof validate;
    validateField: typeof validateField;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    submit: (event: SubmitEvent) => any;
}, string, import('vue').PublicProps, Readonly<FormProps> & Readonly<{
    onSubmit?: ((event: SubmitEvent) => any) | undefined;
}>, {
    size: import('../..').FormControlSize;
    disabled: boolean;
    inline: boolean;
    labelPosition: import('../..').FormLabelPosition;
    labelWidth: number | string;
    rules: import('../..').FormRules;
    scrollToError: boolean;
    showMessage: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
