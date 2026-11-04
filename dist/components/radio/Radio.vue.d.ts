import { RadioProps, RadioValue } from './types';
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<RadioProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: RadioValue, event: Event) => any;
    "update:modelValue": (value: RadioValue) => any;
}, string, import('vue').PublicProps, Readonly<RadioProps> & Readonly<{
    onChange?: ((value: RadioValue, event: Event) => any) | undefined;
    "onUpdate:modelValue"?: ((value: RadioValue) => any) | undefined;
}>, {
    size: import('../..').FormControlSize;
    button: boolean;
    status: import('../..').FormControlStatus;
    disabled: boolean;
    modelValue: RadioValue;
    readonly: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
