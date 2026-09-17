import { QueryBarValue } from '../query-bar';
import { MarginChangeLogRow, MarginChangeLogTableProps } from './types';
declare const __VLS_export: <Row extends MarginChangeLogRow = MarginChangeLogRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<MarginChangeLogTableProps<Row>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import('vue').ShallowUnwrapRef<{
        reload: (reason?: import('../..').MmProTableRequestReason) => Promise<void>;
    }>) => void;
    attrs: any;
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        'cell-user_id'?: (props: any) => any;
    } & {
        'cell-username'?: (props: any) => any;
    } & {
        'cell-user_type'?: (props: any) => any;
    } & {
        'cell-currency'?: (props: any) => any;
    } & {
        'cell-biz_type'?: (props: any) => any;
    } & {
        'cell-delta_amount'?: (props: any) => any;
    } & {
        'cell-transfer_amount'?: (props: any) => any;
    } & {
        'cell-balance_before'?: (props: any) => any;
    } & {
        'cell-balance_after'?: (props: any) => any;
    } & {
        'cell-created_at'?: (props: any) => any;
    } & {
        'cell-transfer_status'?: (props: any) => any;
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
