import { MenuProps, MenuValue } from './types';
declare function focusFirst(): void;
declare var __VLS_1: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<MenuProps, {
    focusFirst: typeof focusFirst;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (value: MenuValue) => any;
    change: (value: MenuValue) => any;
    "update:modelValue": (value: MenuValue) => any;
    "open-change": (value: MenuValue[]) => any;
    "update:openKeys": (value: MenuValue[]) => any;
}, string, import('vue').PublicProps, Readonly<MenuProps> & Readonly<{
    onSelect?: ((value: MenuValue) => any) | undefined;
    onChange?: ((value: MenuValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: MenuValue) => any) | undefined;
    "onOpen-change"?: ((value: MenuValue[]) => any) | undefined;
    "onUpdate:openKeys"?: ((value: MenuValue[]) => any) | undefined;
}>, {
    modelValue: MenuValue;
    mode: import('./types').MenuMode;
    openKeys: MenuValue[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
