import { Component } from 'vue';
import { FloatingPlacement } from '../../composables/use-floating';
import { MenuValue } from '../menu';
import { PopoverTrigger } from '../popover';
export interface DropdownItem {
    disabled?: boolean;
    icon?: Component;
    label: string;
    value: MenuValue;
}
export interface DropdownProps {
    closeOnSelect?: boolean;
    disabled?: boolean;
    floatingClass?: string;
    items?: DropdownItem[];
    label?: string;
    modelValue?: MenuValue;
    placement?: FloatingPlacement;
    teleport?: boolean;
    trigger?: PopoverTrigger;
    visible?: boolean;
    width?: number | string;
}
