import { SelectOption } from '../select';
import { TableRow } from '../table';
import { HedgingSubjectConfigProps, HedgingSubjectConfigRow } from './types';
type Row = HedgingSubjectConfigRow & TableRow;
declare function load(): Promise<void>;
declare function search(): void;
declare var __VLS_1: {
    loading: boolean;
    search: typeof search;
}, __VLS_67: {
    row: Row;
}, __VLS_70: {
    row: Row;
}, __VLS_73: {
    row: Row;
};
type __VLS_Slots = {} & {
    'source-filter'?: (props: typeof __VLS_1) => any;
} & {
    'cell-source_id'?: (props: typeof __VLS_67) => any;
} & {
    'cell-source_name'?: (props: typeof __VLS_70) => any;
} & {
    'cell-source_type'?: (props: typeof __VLS_73) => any;
};
declare const __VLS_base: import('vue').DefineComponent<HedgingSubjectConfigProps, {
    refresh: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    reset: () => any;
    detail: (row: HedgingSubjectConfigRow) => any;
}, string, import('vue').PublicProps, Readonly<HedgingSubjectConfigProps> & Readonly<{
    onReset?: (() => any) | undefined;
    onDetail?: ((row: HedgingSubjectConfigRow) => any) | undefined;
}>, {
    agentOptions: SelectOption[];
    formatDateTime: (value: string) => string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
