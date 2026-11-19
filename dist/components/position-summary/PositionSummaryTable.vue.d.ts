import { TableRow } from '../table';
type __VLS_Props = {
    request: (params: Record<string, unknown>) => Promise<{
        lists?: CurrentContractRow[];
        count?: number;
    }>;
    markPrice: (symbol: string) => unknown;
    loadSymbols?: () => Promise<{
        symbol: string;
    }[]>;
    showSources?: boolean;
};
interface CurrentContractRow extends TableRow {
    account_count?: number | string | null;
    long_count?: number | string | null;
    long_entry_value?: number | string | null;
    long_quantity?: number | string | null;
    short_count?: number | string | null;
    short_entry_value?: number | string | null;
    short_quantity?: number | string | null;
    symbol: string;
    total_count?: number | string | null;
    total_quantity?: number | string | null;
}
declare var __VLS_16: {
    symbol: any;
};
type __VLS_Slots = {} & {
    symbol?: (props: typeof __VLS_16) => any;
};
declare const __VLS_base: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
