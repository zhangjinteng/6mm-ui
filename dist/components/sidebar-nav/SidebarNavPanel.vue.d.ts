import { CSSProperties } from 'vue';
import { MenuValue } from '../menu';
import { SidebarNavChildItem, SidebarNavItem } from './types';
type __VLS_Props = {
    activeKey?: MenuValue;
    ariaLabel?: string;
    as?: string;
    collapsed?: boolean;
    items?: SidebarNavItem[];
    mobile?: boolean;
    openKeys?: MenuValue[];
    placement?: 'left' | 'right';
    showBrand?: boolean;
    style?: CSSProperties;
};
declare var __VLS_8: {
    collapsed: boolean;
    mobile: boolean;
}, __VLS_112: {
    collapsed: boolean;
    mobile: boolean;
};
type __VLS_Slots = {} & {
    brand?: (props: typeof __VLS_8) => any;
} & {
    footer?: (props: typeof __VLS_112) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (item: SidebarNavChildItem) => any;
    "open-change": (keys: MenuValue[]) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSelect?: ((item: SidebarNavChildItem) => any) | undefined;
    "onOpen-change"?: ((keys: MenuValue[]) => any) | undefined;
}>, {
    style: CSSProperties;
    mobile: boolean;
    placement: "left" | "right";
    openKeys: MenuValue[];
    items: SidebarNavItem[];
    as: string;
    activeKey: MenuValue;
    collapsed: boolean;
    showBrand: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
