import { ProTableColumn } from './types';
type __VLS_Props = {
    autoRefreshOptions?: number[];
    autoRefreshSeconds?: number;
    columns?: ProTableColumn<any>[];
    columnsConfigurable?: boolean;
    disabled?: boolean;
    lastUpdatedAt?: Date | string;
    refreshable?: boolean;
    refreshing?: boolean;
    visibleColumnKeys?: string[];
};
declare var __VLS_8: {}, __VLS_44: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_8) => any;
} & {
    'after-columns'?: (props: typeof __VLS_44) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    refresh: () => any;
    "update:autoRefreshSeconds": (seconds: number) => any;
    "update:visibleColumnKeys": (keys: string[]) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onRefresh?: (() => any) | undefined;
    "onUpdate:autoRefreshSeconds"?: ((seconds: number) => any) | undefined;
    "onUpdate:visibleColumnKeys"?: ((keys: string[]) => any) | undefined;
}>, {
    columns: ProTableColumn<any>[];
    disabled: boolean;
    autoRefreshOptions: number[];
    autoRefreshSeconds: number;
    columnsConfigurable: boolean;
    lastUpdatedAt: Date | string;
    refreshable: boolean;
    refreshing: boolean;
    visibleColumnKeys: string[];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
