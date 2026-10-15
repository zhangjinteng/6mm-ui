import { SelectOption } from '../select';
import { TableColumn, TableRow } from '../table';
import { HedgingMonitorRequest, HedgingMonitorResult, HedgingMonitorRow } from './types';
type __VLS_Props = {
    agentOptions?: SelectOption[];
    formatDateTime?: (value: string) => string;
    initialPageSize?: number;
    pageSizes?: number[];
    request: HedgingMonitorRequest;
    resolveMarkPrice?: (row: HedgingMonitorRow) => number;
    showAgent?: boolean;
    showSwitchFilters?: boolean;
};
type Row = HedgingMonitorRow & TableRow;
declare function load(): Promise<void>;
declare function handleSearch(): void;
declare var __VLS_1: {
    loading: boolean;
    search: typeof handleSearch;
}, __VLS_98: {
    row: Row;
}, __VLS_101: {
    row: Row;
}, __VLS_104: {
    row: Row;
}, __VLS_113: {
    value: unknown;
    row: Row;
    column: TableColumn<Row>;
    index: number;
}, __VLS_116: {
    value: unknown;
    row: Row;
    column: TableColumn<Row>;
    index: number;
};
type __VLS_Slots = {} & {
    'source-filter'?: (props: typeof __VLS_1) => any;
} & {
    'cell-source_id'?: (props: typeof __VLS_98) => any;
} & {
    'cell-source_name'?: (props: typeof __VLS_101) => any;
} & {
    'cell-source_type'?: (props: typeof __VLS_104) => any;
} & {
    'cell-symbol'?: (props: typeof __VLS_113) => any;
} & {
    'cell-account'?: (props: typeof __VLS_116) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {
    reload: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    reset: () => any;
    loaded: (result: HedgingMonitorResult) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onReset?: (() => any) | undefined;
    onLoaded?: ((result: HedgingMonitorResult) => any) | undefined;
}>, {
    pageSizes: number[];
    initialPageSize: number;
    agentOptions: SelectOption[];
    formatDateTime: (value: string) => string;
    showAgent: boolean;
    resolveMarkPrice: (row: HedgingMonitorRow) => number;
    showSwitchFilters: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
