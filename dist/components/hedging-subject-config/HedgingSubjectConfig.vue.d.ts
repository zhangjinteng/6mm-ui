import { SelectOption } from '../select';
import { TableRow } from '../table';
import { HedgingSubjectConfigProps, HedgingSubjectConfigRow } from './types';
type Row = HedgingSubjectConfigRow & TableRow;
declare function load(): Promise<void>;
declare var __VLS_14: {
    loading: boolean;
    search: () => void;
}, __VLS_23: {
    row: Row;
}, __VLS_26: {
    row: Row;
}, __VLS_29: {
    row: Row;
};
type __VLS_Slots = {} & {
    'source-filter'?: (props: typeof __VLS_14) => any;
} & {
    'cell-source_id'?: (props: typeof __VLS_23) => any;
} & {
    'cell-source_name'?: (props: typeof __VLS_26) => any;
} & {
    'cell-source_type'?: (props: typeof __VLS_29) => any;
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
