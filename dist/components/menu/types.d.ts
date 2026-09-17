import { ComputedRef, InjectionKey } from 'vue';
export type MenuMode = 'horizontal' | 'vertical';
export type MenuValue = string | number;
export interface MenuProps {
    mode?: MenuMode;
    modelValue?: MenuValue;
    openKeys?: MenuValue[];
}
export interface MenuItemProps {
    disabled?: boolean;
    value: MenuValue;
}
export interface SubMenuProps {
    disabled?: boolean;
    label?: string;
    value: MenuValue;
}
export interface MenuContext {
    closeSubMenu: (value: MenuValue) => void;
    isOpen: (value: MenuValue) => boolean;
    isSelected: (value: MenuValue) => boolean;
    mode: ComputedRef<MenuMode>;
    select: (value: MenuValue) => void;
    toggleSubMenu: (value: MenuValue, force?: boolean) => void;
}
export interface SubMenuContext {
    closeAndFocus: () => void;
    level: number;
}
export declare const menuKey: InjectionKey<MenuContext>;
export declare const subMenuKey: InjectionKey<SubMenuContext>;
