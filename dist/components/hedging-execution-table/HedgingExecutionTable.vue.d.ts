import { SelectOption } from '../select';
import { TableRow } from '../table';
import { HedgingExecutionResult, HedgingExecutionRow, HedgingExecutionTableProps } from './types';
type Row = HedgingExecutionRow & TableRow;
declare function load(): Promise<void>;
declare var __VLS_104: {
    row: Row;
};
type __VLS_Slots = {} & {
    symbol?: (props: typeof __VLS_104) => any;
};
declare const __VLS_base: import('vue').DefineComponent<HedgingExecutionTableProps, {
    reload: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    loaded: (result: HedgingExecutionResult) => any;
}, string, import('vue').PublicProps, Readonly<HedgingExecutionTableProps> & Readonly<{
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
