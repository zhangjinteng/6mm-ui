import { Component } from 'vue';
type __VLS_Props = {
    modelValue: string;
    step?: string;
    min?: string;
    max?: string;
    unit?: string;
    disabled?: boolean;
    percentage?: boolean;
    inputComponent?: Component;
};
declare var __VLS_14: {};
type __VLS_Slots = {} & {
    append?: (props: typeof __VLS_14) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    input: (value: string) => any;
    "update:modelValue": (value: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onInput?: ((value: string) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
}>, {
    disabled: boolean;
    min: string;
    step: string;
    percentage: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
