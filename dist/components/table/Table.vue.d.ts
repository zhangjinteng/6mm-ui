import { TableColumn, TableKey, TableProps, TableRow, TableSortState } from './types';
declare const __VLS_export: <Row extends TableRow = TableRow>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import('vue').PublicProps & __VLS_PrettifyLocal<TableProps<Row> & {
        onExpand?: ((expanded: boolean, row: Row) => any) | undefined;
        "onRow-click"?: ((row: Row, index: number, event: MouseEvent) => any) | undefined;
        "onSelection-change"?: ((keys: TableKey[], rows: Row[]) => any) | undefined;
        "onSort-change"?: ((state: TableSortState) => any) | undefined;
        "onUpdate:expandedRowKeys"?: ((keys: TableKey[]) => any) | undefined;
        "onUpdate:selectedRowKeys"?: ((keys: TableKey[]) => any) | undefined;
        "onUpdate:sort"?: ((state: TableSortState) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {
        [x: `header-${string}`]: ((props: {
            column: TableColumn<Row>;
        }) => any) | undefined;
    } & {
        [x: `header-${string}`]: ((props: {
            column: TableColumn<Row>;
        }) => any) | undefined;
    } & {
        [x: `cell-${string}`]: ((props: {
            value: unknown;
            row: Row;
            column: TableColumn<Row>;
            index: number;
        }) => any) | undefined;
    } & {
        'expanded-row'?: (props: {
            row: Row;
            index: number;
        }) => any;
    };
    emit: ((evt: "expand", expanded: boolean, row: Row) => void) & ((evt: "row-click", row: Row, index: number, event: MouseEvent) => void) & ((evt: "selection-change", keys: TableKey[], rows: Row[]) => void) & ((evt: "sort-change", state: TableSortState) => void) & ((evt: "update:expandedRowKeys", keys: TableKey[]) => void) & ((evt: "update:selectedRowKeys", keys: TableKey[]) => void) & ((evt: "update:sort", state: TableSortState) => void);
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
