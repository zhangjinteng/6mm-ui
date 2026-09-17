import { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from 'vue';
import { QueryBarField, QueryBarValue } from '../components/query-bar';
import { TableRow, TableSortState } from '../components/table';
export type MmProTableRequestReason = "auto" | "initial" | "manual" | "query" | "reset" | "retry" | "state-change";
export interface MmProTableRequestParams {
    filters: QueryBarValue;
    page: number;
    pageSize: number;
    reason: MmProTableRequestReason;
    signal: AbortSignal;
    sort: TableSortState;
}
export interface MmProTableRequestResult<Row extends TableRow = TableRow> {
    rows: Row[];
    total: number;
    updatedAt?: Date | string;
}
export interface UseMmProTableOptions<Row extends TableRow = TableRow> {
    immediate?: boolean;
    initialAutoRefreshSeconds?: number;
    initialFilters?: QueryBarValue;
    initialPage?: number;
    initialPageSize?: number;
    initialSort?: TableSortState;
    queryFields?: MaybeRefOrGetter<QueryBarField[]>;
    request: (params: MmProTableRequestParams) => Promise<MmProTableRequestResult<Row>>;
}
export interface MmProTableBindings<Row extends TableRow = TableRow> {
    autoRefreshSeconds: number;
    blockingLoading: boolean;
    currentPage: number;
    data: Row[];
    error?: string;
    filters: QueryBarValue;
    lastUpdatedAt?: Date | string;
    loading: boolean;
    onQuery: (value: QueryBarValue) => void;
    onRefresh: () => void;
    onReset: (value: QueryBarValue) => void;
    onRetry: () => void;
    "onUpdate:autoRefreshSeconds": (seconds: number) => void;
    "onUpdate:currentPage": (page: number) => void;
    "onUpdate:filters": (value: QueryBarValue) => void;
    "onUpdate:pageSize": (size: number) => void;
    "onUpdate:sort": (state: TableSortState) => void;
    pageSize: number;
    queryFields: QueryBarField[];
    refreshing: boolean;
    sort: TableSortState;
    total: number;
}
export interface UseMmProTableReturn<Row extends TableRow = TableRow> {
    autoRefreshSeconds: Ref<number>;
    blockingLoading: Ref<boolean>;
    currentPage: Ref<number>;
    error: Ref<string | undefined>;
    filters: Ref<QueryBarValue>;
    lastUpdatedAt: Ref<Date | string | undefined>;
    loading: Ref<boolean>;
    pageSize: Ref<number>;
    proTableBindings: ComputedRef<MmProTableBindings<Row>>;
    query: (value?: QueryBarValue) => void;
    refreshing: Ref<boolean>;
    reload: (reason?: MmProTableRequestReason) => Promise<void>;
    reset: (value?: QueryBarValue) => void;
    retry: () => Promise<void>;
    rows: ShallowRef<Row[]>;
    sort: Ref<TableSortState>;
    total: Ref<number>;
}
export declare function useMmProTable<Row extends TableRow = TableRow>(options: UseMmProTableOptions<Row>): UseMmProTableReturn<Row>;
