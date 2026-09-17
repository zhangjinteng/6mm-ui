import { TabsProps, TabsValue } from './types';
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<TabsProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: TabsValue) => any;
    "update:modelValue": (value: TabsValue) => any;
}, string, import('vue').PublicProps, Readonly<TabsProps> & Readonly<{
    onChange?: ((value: TabsValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: TabsValue) => any) | undefined;
}>, {
    type: import('./types').TabsType;
    modelValue: TabsValue;
    direction: import('./types').TabsDirection;
    lazy: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
