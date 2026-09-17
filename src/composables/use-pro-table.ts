import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toValue,
  watch,
} from "vue";
import type { ComputedRef, MaybeRefOrGetter, Ref, ShallowRef } from "vue";

import type { QueryBarField, QueryBarValue } from "../components/query-bar";
import {
  cloneQueryBarValue,
  materializeQueryBarValue,
} from "../components/query-bar/value";
import type { TableRow, TableSortState } from "../components/table";
import { useLocale } from "./use-locale";

export type MmProTableRequestReason =
  "auto" | "initial" | "manual" | "query" | "reset" | "retry" | "state-change";

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
  request: (
    params: MmProTableRequestParams,
  ) => Promise<MmProTableRequestResult<Row>>;
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

function safePage(value: number | undefined): number {
  return Math.max(1, Math.round(Number(value) || 1));
}

function safePageSize(value: number | undefined): number {
  return Math.max(1, Math.round(Number(value) || 20));
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return String(error || fallback);
}

export function useMmProTable<Row extends TableRow = TableRow>(
  options: UseMmProTableOptions<Row>,
): UseMmProTableReturn<Row> {
  const { messages } = useLocale();
  const queryFields = computed(() => [...(toValue(options.queryFields) ?? [])]);
  const resetFilters = materializeQueryBarValue(
    options.initialFilters ?? {},
    queryFields.value,
  );
  const rows = shallowRef<Row[]>([]);
  const total = ref(0);
  const filters = ref<QueryBarValue>(cloneQueryBarValue(resetFilters));
  const currentPage = ref(safePage(options.initialPage));
  const pageSize = ref(safePageSize(options.initialPageSize));
  const sort = ref<TableSortState>({
    ...(options.initialSort ?? { key: "", order: null }),
  });
  const autoRefreshSeconds = ref(
    Math.max(0, Number(options.initialAutoRefreshSeconds) || 0),
  );
  const blockingLoading = ref(false);
  const loading = ref(false);
  const refreshing = ref(false);
  const error = ref<string>();
  const lastUpdatedAt = ref<Date | string>();
  let appliedFilters = cloneQueryBarValue(resetFilters);
  let requestController: AbortController | undefined;
  let requestSequence = 0;
  let refreshTimer: number | undefined;
  let mounted = false;
  let skipNextStateRequest = false;

  async function execute(reason: MmProTableRequestReason): Promise<void> {
    if (reason === "auto" && (loading.value || refreshing.value)) return;

    requestController?.abort();
    requestController = new AbortController();
    const signal = requestController.signal;
    const sequence = ++requestSequence;
    const hasRows = rows.value.length > 0;
    blockingLoading.value = reason !== "auto";
    loading.value = !hasRows;
    refreshing.value = hasRows;
    error.value = undefined;

    try {
      const result = await options.request({
        filters: cloneQueryBarValue(appliedFilters),
        page: safePage(currentPage.value),
        pageSize: safePageSize(pageSize.value),
        reason,
        signal,
        sort: { ...sort.value },
      });
      if (signal.aborted || sequence !== requestSequence) return;
      rows.value = Array.isArray(result.rows) ? [...result.rows] : [];
      total.value = Math.max(0, Number(result.total) || 0);
      lastUpdatedAt.value = result.updatedAt ?? new Date();
    } catch (requestError) {
      if (signal.aborted || sequence !== requestSequence) return;
      error.value = errorMessage(
        requestError,
        messages.value.proTable.errorTitle,
      );
    } finally {
      if (sequence === requestSequence) {
        blockingLoading.value = false;
        loading.value = false;
        refreshing.value = false;
      }
    }
  }

  function executeAfterPageReset(reason: "query" | "reset"): void {
    if (currentPage.value === 1) {
      void execute(reason);
      return;
    }
    skipNextStateRequest = true;
    currentPage.value = 1;
    void nextTick(() => execute(reason));
  }

  function query(value: QueryBarValue = filters.value): void {
    filters.value = cloneQueryBarValue(value);
    appliedFilters = cloneQueryBarValue(value);
    executeAfterPageReset("query");
  }

  function reset(value: QueryBarValue = resetFilters): void {
    filters.value = cloneQueryBarValue(value);
    appliedFilters = cloneQueryBarValue(value);
    executeAfterPageReset("reset");
  }

  function reload(reason: MmProTableRequestReason = "manual"): Promise<void> {
    return execute(reason);
  }

  function retry(): Promise<void> {
    return execute("retry");
  }

  function updateAutoRefreshSeconds(seconds: number): void {
    autoRefreshSeconds.value = Math.max(0, Number(seconds) || 0);
  }

  function updateCurrentPage(page: number): void {
    currentPage.value = safePage(page);
  }

  function updateFilters(value: QueryBarValue): void {
    filters.value = cloneQueryBarValue(value);
  }

  function updatePageSize(size: number): void {
    pageSize.value = safePageSize(size);
  }

  function updateSort(state: TableSortState): void {
    sort.value = { ...state };
  }

  function refreshFromComponent(): void {
    void reload();
  }

  function retryFromComponent(): void {
    void retry();
  }

  const proTableBindings = computed<MmProTableBindings<Row>>(() => ({
    autoRefreshSeconds: autoRefreshSeconds.value,
    blockingLoading: blockingLoading.value,
    currentPage: currentPage.value,
    data: rows.value,
    error: error.value,
    filters: filters.value,
    lastUpdatedAt: lastUpdatedAt.value,
    loading: loading.value,
    onQuery: query,
    onRefresh: refreshFromComponent,
    onReset: reset,
    onRetry: retryFromComponent,
    "onUpdate:autoRefreshSeconds": updateAutoRefreshSeconds,
    "onUpdate:currentPage": updateCurrentPage,
    "onUpdate:filters": updateFilters,
    "onUpdate:pageSize": updatePageSize,
    "onUpdate:sort": updateSort,
    pageSize: pageSize.value,
    queryFields: queryFields.value,
    refreshing: refreshing.value,
    sort: sort.value,
    total: total.value,
  }));

  function clearRefreshTimer(): void {
    if (refreshTimer && typeof window !== "undefined")
      window.clearInterval(refreshTimer);
    refreshTimer = undefined;
  }

  function scheduleAutoRefresh(): void {
    clearRefreshTimer();
    const seconds = Math.max(0, Number(autoRefreshSeconds.value) || 0);
    if (!mounted || seconds <= 0 || typeof window === "undefined") return;
    refreshTimer = window.setInterval(() => {
      if (
        typeof document !== "undefined" &&
        document.visibilityState === "hidden"
      )
        return;
      void execute("auto");
    }, seconds * 1000);
  }

  watch(
    [currentPage, pageSize, () => sort.value.key, () => sort.value.order],
    () => {
      if (!mounted) return;
      if (skipNextStateRequest) {
        skipNextStateRequest = false;
        return;
      }
      void execute("state-change");
    },
  );
  watch(autoRefreshSeconds, scheduleAutoRefresh);

  onMounted(() => {
    mounted = true;
    scheduleAutoRefresh();
    if (options.immediate !== false) void execute("initial");
  });

  onBeforeUnmount(() => {
    mounted = false;
    requestController?.abort();
    clearRefreshTimer();
  });

  return {
    autoRefreshSeconds,
    blockingLoading,
    currentPage,
    error,
    filters,
    lastUpdatedAt,
    loading,
    pageSize,
    proTableBindings,
    query,
    refreshing,
    reload,
    reset,
    retry,
    rows,
    sort,
    total,
  };
}
