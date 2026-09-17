import { QueryBarValue } from '../query-bar';
import { FilterDrawerExpose, FilterDrawerProps } from './types';
declare function open(): void;
declare var __VLS_1: {
    activeCount: number;
    disabled: boolean;
    open: typeof open;
    openState: boolean;
    triggerAttrs: {
        'aria-expanded': string;
        'aria-haspopup': "dialog";
        'aria-label': string;
        disabled: boolean;
        onClick: typeof open;
        title: string;
    };
}, __VLS_41: string, __VLS_42: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_41>]?: (props: typeof __VLS_42) => any;
} & {
    trigger?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<FilterDrawerProps, FilterDrawerExpose, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    reset: (value: QueryBarValue) => any;
    "update:modelValue": (value: QueryBarValue) => any;
    query: (value: QueryBarValue) => any;
    "update:open": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<FilterDrawerProps> & Readonly<{
    onReset?: ((value: QueryBarValue) => any) | undefined;
    "onUpdate:modelValue"?: ((value: QueryBarValue) => any) | undefined;
    onQuery?: ((value: QueryBarValue) => any) | undefined;
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    loading: boolean;
    size: number | string;
    disabled: boolean;
    modelValue: QueryBarValue;
    open: boolean;
    fields: import('..').QueryBarField[];
    activeCount: number;
    subtitle: string;
    triggerAriaLabel: string;
    triggerTitle: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
