import { TypographyProps } from './types';
declare var __VLS_14: {}, __VLS_16: {}, __VLS_18: {};
type __VLS_Slots = {} & {
    title?: (props: typeof __VLS_14) => any;
} & {
    actions?: (props: typeof __VLS_16) => any;
} & {
    default?: (props: typeof __VLS_18) => any;
};
declare const __VLS_base: import('vue').DefineComponent<TypographyProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    copy: (value: string) => any;
    "update:expanded": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<TypographyProps> & Readonly<{
    onCopy?: ((value: string) => any) | undefined;
    "onUpdate:expanded"?: ((value: boolean) => any) | undefined;
}>, {
    title: string;
    expanded: boolean;
    level: import('./types').TypographyLevel;
    as: string;
    align: import('./types').TypographyAlign;
    collapsedLines: number;
    collapsible: boolean;
    copyText: string;
    copyable: boolean;
    defaultExpanded: boolean;
    density: import('./types').TypographyDensity;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
