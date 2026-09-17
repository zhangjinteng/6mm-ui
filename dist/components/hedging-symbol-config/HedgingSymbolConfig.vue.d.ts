import { SelectOption } from '../select';
import { TableRow } from '../table';
import { HedgingSymbolConfigLabels, HedgingSymbolConfigProps, HedgingSymbolConfigRow } from './types';
type Row = HedgingSymbolConfigRow & TableRow;
declare function load(): Promise<void>;
declare var __VLS_1: {}, __VLS_127: {
    row: Row;
};
type __VLS_Slots = {} & {
    'table-header'?: (props: typeof __VLS_1) => any;
} & {
    symbol?: (props: typeof __VLS_127) => any;
};
declare const __VLS_base: import('vue').DefineComponent<HedgingSymbolConfigProps, {
    refresh: typeof load;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<HedgingSymbolConfigProps> & Readonly<{}>, {
    initialAgentId: number | string;
    agentOptions: SelectOption[];
    showAgent: boolean;
    labels: Partial<HedgingSymbolConfigLabels>;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
