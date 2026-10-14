import { PopoverProps } from './types';
declare function updatePosition(): void;
declare function open(): void;
declare function close(restoreFocus?: boolean): void;
declare function toggle(): void;
declare var __VLS_1: {
    open: boolean;
    toggle: typeof toggle;
    triggerAttrs: {
        'aria-describedby': string | undefined;
        'aria-controls'?: undefined;
        'aria-expanded'?: undefined;
    } | {
        'aria-controls': string | undefined;
        'aria-expanded': "true" | "false";
        'aria-describedby'?: undefined;
    };
}, __VLS_9: {
    close: typeof close;
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
} & {
    content?: (props: typeof __VLS_9) => any;
};
declare const __VLS_base: import('vue').DefineComponent<PopoverProps, {
    close: typeof close;
    open: typeof open;
    toggle: typeof toggle;
    updatePosition: typeof updatePosition;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    close: () => any;
    open: () => any;
    "visible-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<PopoverProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onClose?: (() => any) | undefined;
    onOpen?: (() => any) | undefined;
    "onVisible-change"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    modelValue: boolean;
    closeDelay: number;
    closeOnClickOutside: boolean;
    closeOnEscape: boolean;
    floatingClass: string;
    offset: number;
    openDelay: number;
    persistent: boolean;
    placement: import('../..').FloatingPlacement;
    role: string;
    showArrow: boolean;
    teleport: boolean;
    teleportTo: string | HTMLElement;
    trigger: import('./types').PopoverTrigger;
    width: number | string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
