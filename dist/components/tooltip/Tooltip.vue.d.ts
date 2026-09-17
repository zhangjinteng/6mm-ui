import { TooltipProps } from './types';
declare var __VLS_11: {
    open: boolean;
    toggle: () => void;
    triggerAttrs: {
        'aria-describedby': string | undefined;
        'aria-controls'?: undefined;
        'aria-expanded'?: undefined;
    } | {
        'aria-controls': string | undefined;
        'aria-expanded': "false" | "true";
        'aria-describedby'?: undefined;
    };
}, __VLS_14: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_11) => any;
} & {
    content?: (props: typeof __VLS_14) => any;
};
declare const __VLS_base: import('vue').DefineComponent<TooltipProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "visible-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<TooltipProps> & Readonly<{
    "onVisible-change"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    closeDelay: number;
    offset: number;
    openDelay: number;
    placement: import('../..').FloatingPlacement;
    showArrow: boolean;
    teleport: boolean;
    content: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
