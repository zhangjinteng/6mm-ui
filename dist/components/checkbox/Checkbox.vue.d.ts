import { CheckboxProps, CheckboxValue } from './types';
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<CheckboxProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: CheckboxValue, event: Event) => any;
    "update:modelValue": (value: CheckboxValue) => any;
}, string, import('vue').PublicProps, Readonly<CheckboxProps> & Readonly<{
    onChange?: ((value: CheckboxValue, event: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((value: CheckboxValue) => any) | undefined;
}>, {
    value: CheckboxValue;
    size: import('../..').FormControlSize;
    status: import('../..').FormControlStatus;
    disabled: boolean;
    modelValue: CheckboxValue;
    readonly: boolean;
    indeterminate: boolean;
    falseValue: CheckboxValue;
    trueValue: CheckboxValue;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
