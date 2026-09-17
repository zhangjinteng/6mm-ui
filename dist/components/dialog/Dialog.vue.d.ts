import { DialogCloseReason, DialogExpose, DialogProps } from './types';
declare function requestClose(reason?: DialogCloseReason): Promise<void>;
declare var __VLS_7: {
    close: typeof requestClose;
}, __VLS_9: {
    close: typeof requestClose;
}, __VLS_16: {
    close: typeof requestClose;
}, __VLS_18: {
    close: typeof requestClose;
};
type __VLS_Slots = {} & {
    header?: (props: typeof __VLS_7) => any;
} & {
    'header-actions'?: (props: typeof __VLS_9) => any;
} & {
    default?: (props: typeof __VLS_16) => any;
} & {
    footer?: (props: typeof __VLS_18) => any;
};
declare const __VLS_base: import('vue').DefineComponent<DialogProps, DialogExpose, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: (reason: DialogCloseReason) => any;
    "update:modelValue": (value: boolean) => any;
    open: () => any;
    closed: () => any;
    opened: () => any;
}, string, import('vue').PublicProps, Readonly<DialogProps> & Readonly<{
    onClose?: ((reason: DialogCloseReason) => any) | undefined;
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onOpen?: (() => any) | undefined;
    onClosed?: (() => any) | undefined;
    onOpened?: (() => any) | undefined;
}>, {
    width: number | string;
    title: string;
    mask: boolean;
    modelValue: boolean;
    closeOnEscape: boolean;
    teleportTo: string | HTMLElement;
    panelClass: string;
    ariaDescribedby: string;
    beforeClose: import('./types').DialogBeforeClose;
    closeOnClickModal: boolean;
    kind: "dialog" | "drawer";
    lockScroll: boolean;
    overlayClass: string;
    panelStyle: import('vue').CSSProperties;
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
