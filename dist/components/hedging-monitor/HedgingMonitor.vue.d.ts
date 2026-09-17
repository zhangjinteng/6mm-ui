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
declare var __VLS_105: {
    value: unknown;
    row: Row;
    column: TableColumn<Row>;
    index: number;
}, __VLS_108: {
    value: unknown;
    row: Row;
    column: TableColumn<Row>;
    index: number;
};
type __VLS_Slots = {} & {
    'cell-symbol'?: (props: typeof __VLS_105) => any;
} & {
    'cell-account'?: (props: typeof __VLS_108) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {
    reload: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    loaded: (result: HedgingMonitorResult) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
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
