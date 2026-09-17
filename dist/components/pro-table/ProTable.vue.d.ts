import { QueryBarReturnContext, QueryBarValue } from '../query-bar';
import { TableKey, TableRow, TableSortState } from '../table';
import { ProTableProps } from './types';
declare const __VLS_export: <Row extends TableRow = TableRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<ProTableProps<Row> & {
        onRefresh?: (() => any) | undefined;
        onReset?: ((value: QueryBarValue) => any) | undefined;
        onQuery?: ((value: QueryBarValue) => any) | undefined;
        "onReturn-context"?: ((context: QueryBarReturnContext) => any) | undefined;
        "onRow-click"?: ((row: Row, index: number, event: MouseEvent) => any) | undefined;
        "onSelection-change"?: ((keys: TableKey[], rows: Row[]) => any) | undefined;
        "onSort-change"?: ((state: TableSortState) => any) | undefined;
        "onUpdate:selectedRowKeys"?: ((keys: TableKey[]) => any) | undefined;
        "onUpdate:sort"?: ((state: TableSortState) => any) | undefined;
        onRetry?: (() => any) | undefined;
        "onUpdate:currentPage"?: ((page: number) => any) | undefined;
        "onUpdate:pageSize"?: ((size: number) => any) | undefined;
        "onUpdate:autoRefreshSeconds"?: ((seconds: number) => any) | undefined;
        "onUpdate:visibleColumnKeys"?: ((keys: string[]) => any) | undefined;
        "onUpdate:filters"?: ((value: QueryBarValue) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        [x: string]: ((props: any) => any) | undefined;
    } & {
        header?: (props: {}) => any;
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
    } & {
        'toolbar-actions'?: (props: {}) => any;
    };
    emit: ((evt: "refresh") => void) & ((evt: "reset", value: QueryBarValue) => void) & ((evt: "query", value: QueryBarValue) => void) & ((evt: "return-context", context: QueryBarReturnContext) => void) & ((evt: "row-click", row: Row, index: number, event: MouseEvent) => void) & ((evt: "selection-change", keys: TableKey[], rows: Row[]) => void) & ((evt: "sort-change", state: TableSortState) => void) & ((evt: "update:selectedRowKeys", keys: TableKey[]) => void) & ((evt: "update:sort", state: TableSortState) => void) & ((evt: "retry") => void) & ((evt: "update:currentPage", page: number) => void) & ((evt: "update:pageSize", size: number) => void) & ((evt: "update:autoRefreshSeconds", seconds: number) => void) & ((evt: "update:visibleColumnKeys", keys: string[]) => void) & ((evt: "update:filters", value: QueryBarValue) => void);
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
