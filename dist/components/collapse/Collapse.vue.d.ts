import { CollapseProps, CollapseValue } from './types';
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<CollapseProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: CollapseValue) => any;
    "update:modelValue": (value: CollapseValue) => any;
}, string, import('vue').PublicProps, Readonly<CollapseProps> & Readonly<{
    onChange?: ((value: CollapseValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: CollapseValue) => any) | undefined;
}>, {
    modelValue: CollapseValue;
    accordion: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
