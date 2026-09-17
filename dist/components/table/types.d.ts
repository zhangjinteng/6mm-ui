export type TableKey = number | string;
export type TableRow = Record<string, unknown>;
export type TableSortOrder = 'asc' | 'desc' | null;
export type TableSortMode = 'client' | 'manual';
export interface TableSortState {
    key: string;
    order: TableSortOrder;
}
export interface TableColumn<Row extends TableRow = TableRow> {
    align?: 'center' | 'left' | 'right';
    dataIndex?: keyof Row | string;
    fixed?: 'left' | 'right';
    formatter?: (value: unknown, row: Row, index: number) => number | string;
    key: string;
    sortable?: boolean;
    title: string;
    width?: number | string;
}
export interface TableProps<Row extends TableRow = TableRow> {
    bordered?: boolean;
    columns?: TableColumn<Row>[];
    data?: Row[];
    emptyText?: string;
    expandedRowKeys?: TableKey[];
    hoverable?: boolean;
    loading?: boolean;
    maxHeight?: number | string;
    rowDisabled?: (row: Row) => boolean;
    rowKey?: string | ((row: Row) => TableKey);
    selectable?: boolean;
    selectedRowKeys?: TableKey[];
    showCellTitle?: boolean;
    sort?: TableSortState;
    sortMode?: TableSortMode;
    striped?: boolean;
}
