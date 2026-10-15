import { SelectOption } from '../select';
import { TableRow } from '../table';
import { HedgingExecutionResult, HedgingExecutionRow, HedgingExecutionTableProps } from './types';
type Row = HedgingExecutionRow & TableRow;
declare function load(): Promise<void>;
declare var __VLS_14: {
    loading: boolean;
    search: () => void;
}, __VLS_24: {
    row: Row;
}, __VLS_27: {
    row: Row;
}, __VLS_30: {
    row: Row;
}, __VLS_39: {
    row: Row;
};
type __VLS_Slots = {} & {
    'source-filter'?: (props: typeof __VLS_14) => any;
} & {
    'cell-source_id'?: (props: typeof __VLS_24) => any;
} & {
    'cell-source_name'?: (props: typeof __VLS_27) => any;
} & {
    'cell-source_type'?: (props: typeof __VLS_30) => any;
} & {
    symbol?: (props: typeof __VLS_39) => any;
};
declare const __VLS_base: import('vue').DefineComponent<HedgingExecutionTableProps, {
    reload: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    reset: () => any;
    loaded: (result: HedgingExecutionResult) => any;
}, string, import('vue').PublicProps, Readonly<HedgingExecutionTableProps> & Readonly<{
    onReset?: (() => any) | undefined;
    onLoaded?: ((result: HedgingExecutionResult) => any) | undefined;
}>, {
    pageSizes: number[];
    initialPageSize: number;
    agentOptions: SelectOption[];
    formatDateTime: (value: string) => string;
    showAgent: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
