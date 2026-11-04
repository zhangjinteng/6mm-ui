import { InputNumberProps } from './types';
declare var __VLS_13: {};
type __VLS_Slots = {} & {
    suffix?: (props: typeof __VLS_13) => any;
};
declare const __VLS_base: import('vue').DefineComponent<InputNumberProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    blur: (event: FocusEvent) => any;
    change: (value: number | null) => any;
    "update:modelValue": (value: number | null) => any;
    focus: (event: FocusEvent) => any;
}, string, import('vue').PublicProps, Readonly<InputNumberProps> & Readonly<{
    onBlur?: ((event: FocusEvent) => any) | undefined;
    onChange?: ((value: number | null) => any) | undefined;
    "onUpdate:modelValue"?: ((value: number | null) => any) | undefined;
    onFocus?: ((event: FocusEvent) => any) | undefined;
}>, {
    disabled: boolean;
    size: import('../..').FormControlSize;
    max: number;
    min: number;
    modelValue: number | null;
    readonly: boolean;
    status: import('../..').FormControlStatus;
    controls: boolean;
    precision: number;
    step: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
