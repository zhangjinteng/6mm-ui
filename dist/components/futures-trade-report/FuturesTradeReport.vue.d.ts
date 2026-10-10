import { FuturesTradeReportProps } from './types';
declare var __VLS_48: string, __VLS_49: any;
type __VLS_Slots = {} & {
    [K in NonNullable<typeof __VLS_48>]?: (props: typeof __VLS_49) => any;
};
declare const __VLS_base: import('vue').DefineComponent<FuturesTradeReportProps, {
    reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<FuturesTradeReportProps> & Readonly<{}>, {
    fillHeight: boolean;
    showSources: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
