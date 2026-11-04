import { MenuValue } from '../menu';
import { DropdownItem, DropdownProps } from './types';
declare function onTriggerKeydown(event: KeyboardEvent): void;
declare var __VLS_12: {
    open: boolean;
    triggerAttrs: {
        'aria-haspopup': "menu";
        onKeydown: typeof onTriggerKeydown;
        'aria-describedby': string | undefined;
        'aria-controls'?: undefined;
        'aria-expanded'?: undefined;
    } | {
        'aria-haspopup': "menu";
        onKeydown: typeof onTriggerKeydown;
        'aria-controls': string | undefined;
        'aria-expanded': "false" | "true";
        'aria-describedby'?: undefined;
    };
}, __VLS_15: {
    close: (restoreFocus?: boolean) => void;
}, __VLS_27: {
    close: (restoreFocus?: boolean) => void;
};
type __VLS_Slots = {} & {
    trigger?: (props: typeof __VLS_12) => any;
} & {
    header?: (props: typeof __VLS_15) => any;
} & {
    menu?: (props: typeof __VLS_27) => any;
};
declare const __VLS_base: import('vue').DefineComponent<DropdownProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (item: DropdownItem) => any;
    "update:modelValue": (value: MenuValue) => any;
    "visible-change": (value: boolean) => any;
    "update:visible": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<DropdownProps> & Readonly<{
    onSelect?: ((item: DropdownItem) => any) | undefined;
    "onUpdate:modelValue"?: ((value: MenuValue) => any) | undefined;
    "onVisible-change"?: ((value: boolean) => any) | undefined;
    "onUpdate:visible"?: ((value: boolean) => any) | undefined;
}>, {
    width: number | string;
    visible: boolean;
    disabled: boolean;
    modelValue: MenuValue;
    floatingClass: string;
    placement: import('../..').FloatingPlacement;
    teleport: boolean;
    trigger: import('..').PopoverTrigger;
    closeOnSelect: boolean;
    items: DropdownItem[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
