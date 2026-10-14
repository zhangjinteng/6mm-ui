import { FuturesFundingFeeReportProps } from './types';
declare var __VLS_51: string, __VLS_52: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_51>]?: (props: typeof __VLS_52) => any;
};
declare const __VLS_base: import('vue').DefineComponent<FuturesFundingFeeReportProps, {
    reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<FuturesFundingFeeReportProps> & Readonly<{}>, {
    fillHeight: boolean;
    showSources: boolean;
    showSourceCode: boolean;
    showSymbolWhenFiltered: boolean;
    sourceSearch: "id" | "name-or-id";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
