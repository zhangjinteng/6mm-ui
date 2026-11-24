import { PortraitTab, PortraitTables, UserPortrait } from './types';
type __VLS_Props = {
    modelValue: boolean;
    subject: number | string | null;
    requestKey?: number;
    initialTab?: PortraitTab;
    request: (subject: number | string, signal: AbortSignal) => Promise<UserPortrait>;
    tables: Partial<PortraitTables>;
    marketPrices: Record<string, number>;
    directUserLabel?: '平台用户' | '白标直属用户';
};
declare var __VLS_27: {
    portrait: UserPortrait;
}, __VLS_53: {}, __VLS_67: {
    symbol: any;
}, __VLS_76: {
    symbol: any;
}, __VLS_85: {
    symbol: any;
}, __VLS_94: {
    symbol: any;
}, __VLS_110: {
    symbol: any;
};
type __VLS_Slots = {} & {
    actions?: (props: typeof __VLS_27) => any;
} & {
    password?: (props: typeof __VLS_53) => any;
} & {
    symbol?: (props: typeof __VLS_67) => any;
} & {
    symbol?: (props: typeof __VLS_76) => any;
} & {
    symbol?: (props: typeof __VLS_85) => any;
} & {
    symbol?: (props: typeof __VLS_94) => any;
} & {
    symbol?: (props: typeof __VLS_110) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    loaded: (snapshot: UserPortrait) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onLoaded?: ((snapshot: UserPortrait) => any) | undefined;
}>, {
    initialTab: PortraitTab;
    directUserLabel: "\u5E73\u53F0\u7528\u6237" | "\u767D\u6807\u76F4\u5C5E\u7528\u6237";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
