import { DialogCloseReason } from '../dialog';
import { DrawerProps } from './types';
declare var __VLS_15: {
    close: (reason?: DialogCloseReason) => Promise<void>;
}, __VLS_18: {
    close: (reason?: DialogCloseReason) => Promise<void>;
}, __VLS_21: {
    close: (reason?: DialogCloseReason) => Promise<void>;
}, __VLS_24: {
    close: (reason?: DialogCloseReason) => Promise<void>;
};
type __VLS_Slots = {} & {
    header?: (props: typeof __VLS_15) => any;
} & {
    'header-actions'?: (props: typeof __VLS_18) => any;
} & {
    default?: (props: typeof __VLS_21) => any;
} & {
    footer?: (props: typeof __VLS_24) => any;
};
declare const __VLS_base: import('vue').DefineComponent<DrawerProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: (reason: DialogCloseReason) => any;
    "update:modelValue": (value: boolean) => any;
    open: () => any;
    closed: () => any;
    opened: () => any;
}, string, import('vue').PublicProps, Readonly<DrawerProps> & Readonly<{
    onClose?: ((reason: DialogCloseReason) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onOpen?: (() => any) | undefined;
    onClosed?: (() => any) | undefined;
    onOpened?: (() => any) | undefined;
}>, {
    size: number | string;
    title: string;
    mask: boolean;
    modelValue: boolean;
    closeOnEscape: boolean;
    placement: import('./types').DrawerPlacement;
    teleportTo: string | HTMLElement;
    beforeClose: import('..').DialogBeforeClose;
    closeOnClickModal: boolean;
    lockScroll: boolean;
    showClose: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
