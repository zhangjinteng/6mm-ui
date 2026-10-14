import { MenuValue } from '../menu';
import { SidebarNavChildItem, SidebarNavExpose, SidebarNavProps } from './types';
declare var __VLS_12: {
    collapsed: boolean;
    mobile: boolean;
}, __VLS_15: {
    collapsed: boolean;
    mobile: boolean;
}, __VLS_27: {
    collapsed: boolean;
    mobile: boolean;
}, __VLS_39: {
    collapsed: boolean;
    mobile: boolean;
};
type __VLS_Slots = {} & {
    brand?: (props: typeof __VLS_12) => any;
} & {
    footer?: (props: typeof __VLS_15) => any;
} & {
    brand?: (props: typeof __VLS_27) => any;
} & {
    footer?: (props: typeof __VLS_39) => any;
};
declare const __VLS_base: import('vue').DefineComponent<SidebarNavProps, SidebarNavExpose, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (value: MenuValue, item: SidebarNavChildItem) => any;
    "update:modelValue": (value: MenuValue) => any;
    select: (item: SidebarNavChildItem) => any;
    "open-change": (keys: MenuValue[]) => any;
    "update:openKeys": (value: MenuValue[]) => any;
    "update:mobileOpen": (value: boolean) => any;
    "update:collapsed": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<SidebarNavProps> & Readonly<{
    onChange?: ((value: MenuValue, item: SidebarNavChildItem) => any) | undefined;
    "onUpdate:modelValue"?: ((value: MenuValue) => any) | undefined;
    onSelect?: ((item: SidebarNavChildItem) => any) | undefined;
    "onOpen-change"?: ((keys: MenuValue[]) => any) | undefined;
    "onUpdate:openKeys"?: ((value: MenuValue[]) => any) | undefined;
    "onUpdate:mobileOpen"?: ((value: boolean) => any) | undefined;
    "onUpdate:collapsed"?: ((value: boolean) => any) | undefined;
}>, {
    modelValue: MenuValue;
    placement: import('./types').SidebarNavPlacement;
    width: number | string;
    display: import('./types').SidebarNavDisplay;
    openKeys: MenuValue[];
    items: import('./types').SidebarNavItem[];
    mobileBreakpoint: number;
    mobileOpen: boolean;
    accordion: boolean;
    collapsed: boolean;
    collapsedWidth: number | string;
    drawerSize: number | string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
