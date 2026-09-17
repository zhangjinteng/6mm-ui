import { default as HistoryPositionTable } from './HistoryPositionTable.vue';
export declare const MmHistoryPositionTable: <Row extends import('./types').HistoryPositionRow = import('./types').HistoryPositionRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: {
    attrs: any;
    emit: {};
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        'cell-user_id'?: (props: any) => any;
    } & {
        'cell-agent_user_id'?: (props: any) => any;
    } & {
        'cell-user_type'?: (props: any) => any;
    } & {
        'cell-position_id'?: (props: any) => any;
    } & {
        'cell-symbol'?: (props: any) => any;
    } & {
        'cell-product_category'?: (props: any) => any;
    } & {
        'cell-position_side'?: (props: any) => any;
    } & {
        'cell-margin_mode'?: (props: any) => any;
    } & {
        'cell-pnl'?: (props: any) => any;
    } & {
        'cell-trigger_mode'?: (props: any) => any;
    } & {
        'cell-operation'?: (props: any) => any;
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
            value: import('..').QueryBarValue;
        }) => any;
    } & {
        'toolbar-actions'?: (props: {}) => any;
    };
}, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & {
        actions?: import('./types').HistoryPositionTableActions<Row> | undefined;
        ariaLabel?: string | undefined;
        columns?: import('./types').HistoryPositionTableColumns<Row> | undefined;
        columnsConfigurable?: boolean | undefined;
        fillHeight?: boolean | undefined;
        filterDrawerSubtitle?: string | undefined;
        filterDrawerTitle?: string | undefined;
        includeRobotUserType?: boolean | undefined;
        initialKeyword?: string | undefined;
        initialPageSize?: number | undefined;
        pageSizes?: number[] | undefined;
        request: import('./types').HistoryPositionListRequest<Row>;
        showUserType?: boolean | undefined;
    } & (typeof globalThis extends {
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
        'cell-agent_user_id'?: (props: any) => any;
    } & {
        'cell-user_type'?: (props: any) => any;
    } & {
        'cell-position_id'?: (props: any) => any;
    } & {
        'cell-symbol'?: (props: any) => any;
    } & {
        'cell-product_category'?: (props: any) => any;
    } & {
        'cell-position_side'?: (props: any) => any;
    } & {
        'cell-margin_mode'?: (props: any) => any;
    } & {
        'cell-pnl'?: (props: any) => any;
    } & {
        'cell-trigger_mode'?: (props: any) => any;
    } & {
        'cell-operation'?: (props: any) => any;
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
            value: import('..').QueryBarValue;
        }) => any;
    } & {
        'toolbar-actions'?: (props: {}) => any;
    };
    emit: {};
}>) => import('vue').VNode & {
    __ctx?: NonNullable<Awaited<typeof __VLS_setup>>;
};
export * from './formatters';
export * from './types';
export default HistoryPositionTable;
