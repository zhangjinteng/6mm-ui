<script setup lang="ts" generic="Row extends TableRow = TableRow">
import { computed, useSlots, watch } from "vue";

import { useControlled } from "../../composables/use-controlled";
import { useLocale } from "../../composables/use-locale";
import { MmButton } from "../button";
import { MmFilterDrawer } from "../filter-drawer";
import { MmIcon } from "../icon";
import { materializeQueryBarValue, MmQueryBar } from "../query-bar";
import type { QueryBarReturnContext, QueryBarValue } from "../query-bar";
import { MmTable } from "../table";
import type { TableKey, TableRow, TableSortState } from "../table";
import ProTablePagination from "./ProTablePagination.vue";
import ProTableTools from "./ProTableTools.vue";
import type { ProTableColumn, ProTableProps } from "./types";

defineOptions({ name: "MmProTable" });

const props = withDefaults(defineProps<ProTableProps<Row>>(), {
  autoRefreshOptions: () => [0, 5, 10, 30, 60],
  autoRefreshSeconds: undefined,
  blockingLoading: undefined,
  bordered: false,
  columns: () => [],
  columnsConfigurable: true,
  currentPage: undefined,
  data: () => [],
  error: undefined,
  fillHeight: false,
  filterDrawer: true,
  filterDrawerSubtitle: undefined,
  filters: undefined,
  inlineQueryFieldKeys: undefined,
  lastUpdatedAt: undefined,
  loading: false,
  maxHeight: 520,
  pageSize: undefined,
  pageSizes: () => [10, 20, 50, 100],
  queryFields: () => [],
  querySize: "sm",
  refreshable: true,
  refreshing: false,
  returnContext: undefined,
  rowDisabled: undefined,
  rowKey: "id",
  selectable: false,
  selectedRowKeys: undefined,
  showCellTitle: true,
  showPagination: true,
  sort: undefined,
  striped: false,
  total: 0,
  visibleColumnKeys: undefined,
});
const emit = defineEmits<{
  query: [value: QueryBarValue];
  refresh: [];
  reset: [value: QueryBarValue];
  retry: [];
  "return-context": [context: QueryBarReturnContext];
  "row-click": [row: Row, index: number, event: MouseEvent];
  "selection-change": [keys: TableKey[], rows: Row[]];
  "sort-change": [state: TableSortState];
  "update:autoRefreshSeconds": [seconds: number];
  "update:currentPage": [page: number];
  "update:filters": [value: QueryBarValue];
  "update:pageSize": [size: number];
  "update:selectedRowKeys": [keys: TableKey[]];
  "update:sort": [state: TableSortState];
  "update:visibleColumnKeys": [keys: string[]];
}>();
const { messages } = useLocale();
const resolvedAriaLabel = computed(
  () => props.ariaLabel ?? messages.value.proTable.tableLabel,
);
const resolvedEmptyText = computed(
  () => props.emptyText ?? messages.value.proTable.emptyTitle,
);
const resolvedFilterDrawerTitle = computed(
  () => props.filterDrawerTitle ?? messages.value.filterDrawer.title,
);
const slots = useSlots();

function initialColumnKeys(columns: ProTableColumn<Row>[]): string[] {
  return columns
    .filter((column) => column.hideable === false || !column.defaultHidden)
    .map((column) => column.key);
}

function cloneFilters(value: QueryBarValue): QueryBarValue {
  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [
      key,
      Array.isArray(fieldValue) ? [...fieldValue] : fieldValue,
    ]),
  );
}

const { value: activeFilters } = useControlled<QueryBarValue>(
  () => props.filters,
  {},
  (value) => emit("update:filters", cloneFilters(value)),
);
const { value: activePage } = useControlled<number>(
  () => props.currentPage,
  1,
  (value) => emit("update:currentPage", value),
);
const { value: activePageSize } = useControlled<number>(
  () => props.pageSize,
  20,
  (value) => emit("update:pageSize", value),
);
const { value: activeSort } = useControlled<TableSortState>(
  () => props.sort,
  { key: "", order: null },
  (value) => emit("update:sort", value),
);
const { value: activeAutoRefresh } = useControlled<number>(
  () => props.autoRefreshSeconds,
  0,
  (value) => emit("update:autoRefreshSeconds", value),
);
const { value: activeSelectedKeys } = useControlled<TableKey[]>(
  () => props.selectedRowKeys,
  [],
  (value) => emit("update:selectedRowKeys", [...value]),
);
const { value: visibleKeys } = useControlled<string[]>(
  () => props.visibleColumnKeys,
  initialColumnKeys(props.columns),
  (value) => emit("update:visibleColumnKeys", [...value]),
);

const validColumnKeys = computed(
  () => new Set(props.columns.map((column) => column.key)),
);
const requiredColumnKeys = computed(() =>
  props.columns
    .filter((column) => column.hideable === false)
    .map((column) => column.key),
);
const visibleColumns = computed(() =>
  props.columns.filter(
    (column) =>
      column.hideable === false || visibleKeys.value.includes(column.key),
  ),
);
const inlineQueryFields = computed(() => {
  if (props.inlineQueryFieldKeys === undefined) return props.queryFields;
  const inlineKeys = new Set(props.inlineQueryFieldKeys);
  return props.queryFields.filter((field) => inlineKeys.has(field.key));
});
const hasRows = computed(() => props.data.length > 0);
const busy = computed(() => props.loading || props.refreshing);
const blockingBusy = computed(
  () => busy.value && (props.blockingLoading ?? props.loading),
);
const activeFilterCount = computed(
  () =>
    Object.values(activeFilters.value).filter((value) =>
      Array.isArray(value)
        ? value.some(Boolean)
        : value !== "" &&
          value !== null &&
          value !== undefined &&
          value !== "all",
    ).length,
);
const stateType = computed<"empty" | "error" | "loading" | undefined>(() => {
  if (blockingBusy.value) return "loading";
  if (props.error && !hasRows.value) return "error";
  if (!hasRows.value) return "empty";
  return undefined;
});
const tableSlotNames = computed(() =>
  Object.keys(slots).filter(
    (name) =>
      name === "expanded-row" ||
      name.startsWith("cell-") ||
      name.startsWith("header-"),
  ),
);
const queryFieldSlotNames = computed(() =>
  Object.keys(slots).filter((name) => name.startsWith("field-")),
);
let knownColumnKeys = new Set(props.columns.map((column) => column.key));
watch(
  () =>
    props.columns
      .map(
        (column) => `${column.key}:${column.hideable}:${column.defaultHidden}`,
      )
      .join("|"),
  () => {
    const currentColumnKeys = new Set(
      props.columns.map((column) => column.key),
    );
    const next = visibleKeys.value.filter((key) =>
      validColumnKeys.value.has(key),
    );
    for (const column of props.columns) {
      if (
        !knownColumnKeys.has(column.key) &&
        column.defaultHidden !== true &&
        !next.includes(column.key)
      ) {
        next.push(column.key);
      }
    }
    for (const key of requiredColumnKeys.value)
      if (!next.includes(key)) next.push(key);
    if (!next.length) next.push(...initialColumnKeys(props.columns));
    knownColumnKeys = currentColumnKeys;
    if (next.join("|") !== visibleKeys.value.join("|"))
      visibleKeys.value = next;
  },
);

function handleQuery(value: QueryBarValue): void {
  const snapshot = materializeQueryBarValue(value, props.queryFields);
  activeFilters.value = snapshot;
  if (activePage.value !== 1) activePage.value = 1;
  emit("query", snapshot);
}

function handleReset(value: QueryBarValue): void {
  const snapshot = materializeQueryBarValue(value, props.queryFields);
  activeFilters.value = snapshot;
  if (activePage.value !== 1) activePage.value = 1;
  emit("reset", snapshot);
}

function handleSort(state: TableSortState): void {
  activeSort.value = { ...state };
  if (activePage.value !== 1) activePage.value = 1;
  emit("sort-change", { ...state });
}

function handlePage(page: number): void {
  activePage.value = Math.max(1, page);
}

function handlePageSize(size: number): void {
  activePageSize.value = Math.max(1, size);
  if (activePage.value !== 1) activePage.value = 1;
}

function handleRowClick(row: TableRow, index: number, event: MouseEvent): void {
  emit("row-click", row as Row, index, event);
}

function stateCopy(): {
  description: string;
  icon: "inbox" | "loader-circle" | "search-x" | "triangle-alert";
  title: string;
} {
  if (stateType.value === "loading") {
    return {
      description: messages.value.proTable.loadingDescription,
      icon: "loader-circle",
      title: messages.value.proTable.loadingTitle,
    };
  }
  if (stateType.value === "error") {
    return {
      description: props.error || messages.value.proTable.errorDescription,
      icon: "triangle-alert",
      title: messages.value.proTable.errorTitle,
    };
  }
  if (activeFilterCount.value > 0) {
    return {
      description: messages.value.proTable.filterEmptyDescription,
      icon: "search-x",
      title: messages.value.proTable.filterEmptyTitle,
    };
  }
  return {
    description: resolvedEmptyText.value,
    icon: "inbox",
    title: messages.value.proTable.emptyTitle,
  };
}
</script>

<template>
  <section
    class="mm-pro-table"
    :class="{
      'is-blocking-loading': blockingBusy,
      'is-fill-height': fillHeight,
      'is-loading': busy,
      'is-refreshing': refreshing,
    }"
    data-mm-component="pro-table"
    :aria-label="resolvedAriaLabel"
    :aria-busy="busy ? 'true' : undefined"
  >
    <header
      v-if="$slots.header"
      class="mm-pro-table__header"
      data-pro-table-header
    >
      <slot name="header" />
    </header>

    <div v-if="queryFields.length" class="mm-pro-table__query">
      <MmQueryBar
        :model-value="activeFilters"
        :fields="inlineQueryFields"
        :loading="blockingBusy"
        :return-context="returnContext"
        single-line
        :size="querySize"
        @update:model-value="activeFilters = $event"
        @query="handleQuery"
        @reset="handleReset"
        @return-context="emit('return-context', $event)"
      >
        <template
          v-for="slotName in queryFieldSlotNames"
          #[slotName]="slotProps"
        >
          <slot :name="slotName" v-bind="slotProps" />
        </template>
        <template #buttons="slotProps">
          <span
            class="mm-pro-table__query-custom-actions"
            data-query-overflow-group
          >
            <slot name="query-actions" v-bind="slotProps" />
            <slot name="toolbar-actions" />
          </span>
          <ProTableTools
            :auto-refresh-options="autoRefreshOptions"
            :auto-refresh-seconds="activeAutoRefresh"
            :columns="columns"
            :columns-configurable="columnsConfigurable"
            :disabled="slotProps.disabled || blockingBusy"
            :last-updated-at="lastUpdatedAt"
            :refreshable="refreshable"
            :refreshing="refreshing"
            :visible-column-keys="visibleKeys"
            @refresh="emit('refresh')"
            @update:auto-refresh-seconds="activeAutoRefresh = $event"
            @update:visible-column-keys="visibleKeys = $event"
          >
            <MmButton
              data-query-action="query"
              :disabled="slotProps.disabled"
              :loading="slotProps.loading"
              :size="slotProps.size"
              variant="primary"
              @click="slotProps.query"
            >
              <template #icon><MmIcon name="search" :size="13" /></template>
              {{ slotProps.queryText }}
            </MmButton>
            <MmButton
              v-if="slotProps.showReset"
              data-query-action="reset"
              :disabled="slotProps.disabled"
              :size="slotProps.size"
              @click="slotProps.reset"
            >
              <template #icon><MmIcon name="rotate-ccw" :size="13" /></template>
              {{ slotProps.resetText }}
            </MmButton>
            <template #after-columns>
              <MmFilterDrawer
                v-if="filterDrawer"
                data-pro-table-tool="filter-drawer"
                :active-count="activeFilterCount"
                :disabled="slotProps.disabled"
                :fields="queryFields"
                :loading="slotProps.loading"
                :model-value="activeFilters"
                :subtitle="filterDrawerSubtitle"
                :title="resolvedFilterDrawerTitle"
                @query="handleQuery"
                @reset="handleReset"
              >
                <template
                  v-for="slotName in queryFieldSlotNames"
                  #[slotName]="drawerSlotProps"
                >
                  <slot :name="slotName" v-bind="drawerSlotProps" />
                </template>
              </MmFilterDrawer>
            </template>
          </ProTableTools>
        </template>
      </MmQueryBar>
    </div>

    <div v-if="!queryFields.length" class="mm-pro-table__standalone-tools">
      <slot name="toolbar-actions" />
      <ProTableTools
        :auto-refresh-options="autoRefreshOptions"
        :auto-refresh-seconds="activeAutoRefresh"
        :columns="columns"
        :columns-configurable="columnsConfigurable"
        :disabled="blockingBusy"
        :last-updated-at="lastUpdatedAt"
        :refreshable="refreshable"
        :refreshing="refreshing"
        :visible-column-keys="visibleKeys"
        @refresh="emit('refresh')"
        @update:auto-refresh-seconds="activeAutoRefresh = $event"
        @update:visible-column-keys="visibleKeys = $event"
      />
    </div>

    <div
      v-if="error && hasRows"
      class="mm-pro-table__stale-warning"
      role="alert"
    >
      <MmIcon name="triangle-alert" :size="14" />
      <span>{{ messages.proTable.loadFailedWithCachedData(error) }}</span>
      <button type="button" @click="emit('retry')">
        {{ messages.common.retry }}
      </button>
    </div>

    <div class="mm-pro-table__body">
      <MmTable
        v-if="hasRows"
        :bordered="bordered"
        :columns="visibleColumns"
        :data="data"
        :max-height="fillHeight ? undefined : maxHeight"
        :row-disabled="rowDisabled"
        :row-key="rowKey"
        :selectable="selectable"
        :selected-row-keys="activeSelectedKeys"
        :show-cell-title="showCellTitle"
        :sort="activeSort"
        :inert="blockingBusy ? true : undefined"
        sort-mode="manual"
        :striped="striped"
        @row-click="handleRowClick"
        @selection-change="
          (keys, rows) => emit('selection-change', keys, rows as Row[])
        "
        @update:selected-row-keys="activeSelectedKeys = $event"
        @sort-change="handleSort"
      >
        <template v-for="slotName in tableSlotNames" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
      </MmTable>

      <div
        v-if="stateType"
        class="mm-pro-table__state"
        :class="{ 'is-overlay': hasRows && stateType === 'loading' }"
        :data-pro-table-state="stateType"
        role="status"
        aria-live="polite"
      >
        <span
          class="mm-pro-table__state-icon"
          :class="`is-${stateType}`"
          aria-hidden="true"
          ><MmIcon
            :name="stateCopy().icon"
            :size="24"
            :spin="stateType === 'loading'"
        /></span>
        <strong>{{ stateCopy().title }}</strong>
        <p>{{ stateCopy().description }}</p>
        <div v-if="stateType !== 'loading'" class="mm-pro-table__state-actions">
          <MmButton
            v-if="stateType === 'error'"
            data-pro-table-action="retry"
            size="sm"
            variant="primary"
            @click="emit('retry')"
            >{{ messages.proTable.reload }}</MmButton
          >
          <MmButton
            v-else
            data-pro-table-action="refresh"
            size="sm"
            variant="primary"
            @click="emit('refresh')"
            >{{ messages.proTable.refreshData }}</MmButton
          >
        </div>
      </div>
    </div>

    <ProTablePagination
      v-if="showPagination"
      :current-page="activePage"
      :disabled="blockingBusy"
      :page-size="activePageSize"
      :page-sizes="pageSizes"
      :total="total"
      @current-change="handlePage"
      @size-change="handlePageSize"
    />
  </section>
</template>

<style src="./pro-table.css"></style>
