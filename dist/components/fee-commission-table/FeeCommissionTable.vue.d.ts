import { QueryBarValue } from '../query-bar';
import { FeeCommissionRow, FeeCommissionTableProps } from './types';
declare const __VLS_export: <Row extends FeeCommissionRow = FeeCommissionRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<FeeCommissionTableProps<Row>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import('vue').ShallowUnwrapRef<{
        reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
    }>) => void;
    attrs: any;
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        'cell-order_id'?: (props: any) => any;
    } & {
        'cell-public_user_id'?: (props: any) => any;
    } & {
        'cell-agent_user_id'?: (props: any) => any;
    } & {
        'cell-position_id'?: (props: any) => any;
    } & {
        'cell-symbol'?: (props: any) => any;
    } & {
        'cell-margin_mode'?: (props: any) => any;
    } & {
        'cell-side'?: (props: any) => any;
    } & {
        'cell-quantity'?: (props: any) => any;
    } & {
        'cell-price'?: (props: any) => any;
    } & {
        'cell-trade_value'?: (props: any) => any;
    } & {
        'cell-handling_fee'?: (props: any) => any;
    } & {
        'cell-role_type'?: (props: any) => any;
    } & {
        'cell-commission_amount'?: (props: any) => any;
    } & {
        'cell-trade_time'?: (props: any) => any;
    } & {
        'query-actions'?: (props: {
            disabled: boolean;
            loading: boolean;
            query: () => void;
            queryText: string;
            reset: () => void;
            resetText: string;
            showReset: boolean;
            size: import('../..').FormControlSize;
            value: QueryBarValue;
        }) => any;
    } & {
        'toolbar-actions'?: (props: {}) => any;
    };
    emit: {};
}>) => import('vue').VNode & {
    __ctx?: NonNullable<Awaited<typeof __VLS_setup>>;
};
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
