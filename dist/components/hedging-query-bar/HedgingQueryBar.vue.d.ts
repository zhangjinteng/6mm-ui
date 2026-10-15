import { ProTableColumn } from '../pro-table';
import { QueryBarField, QueryBarValue } from '../query-bar';
type __VLS_Props = {
    columns: Pick<ProTableColumn, 'key' | 'title' | 'hideable' | 'defaultHidden'>[];
    fields: QueryBarField[];
    loading?: boolean;
    modelValue: QueryBarValue;
    title: string;
    visibleColumnKeys?: string[];
};
declare var __VLS_14: {
    loading: boolean;
    search: () => void;
}, __VLS_67: {
    loading: boolean;
    search: () => void;
};
type __VLS_Slots = {} & {
    'source-filter'?: (props: typeof __VLS_14) => any;
} & {
    'source-filter'?: (props: typeof __VLS_67) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: QueryBarValue) => any;
    reset: (value: QueryBarValue) => any;
    query: (value: QueryBarValue) => any;
    refresh: () => any;
    "update:visibleColumnKeys": (keys: string[]) => any;
    "source-query": (value: QueryBarValue) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: QueryBarValue) => any) | undefined;
    onReset?: ((value: QueryBarValue) => any) | undefined;
    onQuery?: ((value: QueryBarValue) => any) | undefined;
    onRefresh?: (() => any) | undefined;
    "onUpdate:visibleColumnKeys"?: ((keys: string[]) => any) | undefined;
    "onSource-query"?: ((value: QueryBarValue) => any) | undefined;
}>, {
    loading: boolean;
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
