<script
  setup
  lang="ts"
  generic="Row extends AccountChangeLogRow = AccountChangeLogRow"
>
import { computed, ref, useSlots } from "vue";

import { useLocale } from "../../composables/use-locale";
import { useMmProTable } from "../../composables/use-pro-table";
import { MmButton } from "../button";
import { MmIcon } from "../icon";
import { MmProTable, MmProTableCursorPagination } from "../pro-table";
import type { ProTableColumn } from "../pro-table";
import type { QueryBarField, QueryBarValue } from "../query-bar";
import { MmTag } from "../tag";
import type { TableSortState } from "../table";
import {
  formatAccountChangeAmount,
  formatAccountChangeBalance,
  resolveAccountChangeType,
} from "./formatters";
import type {
  AccountChangeLogListQuery,
  AccountChangeLogMode,
  AccountChangeLogRow,
  AccountChangeLogTableProps,
} from "./types";

defineOptions({ inheritAttrs: false, name: "MmAccountChangeLogTable" });

const props = withDefaults(defineProps<AccountChangeLogTableProps<Row>>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  includeRobotUserType: false,
  initialPageSize: 20,
  mode: "all",
  pageSizes: () => [20, 30, 40],
  showUserType: true,
});

const { messages } = useLocale();
const copy = computed(() => messages.value.accountChangeLogs);
const slots = useSlots();
const defaultSort: TableSortState = { key: "id", order: "desc" };
const sortableFields = new Set(["amount", "created_at"]);
const managedSlotNames = new Set([
  "cell-user_id",
  "cell-username",
  "cell-agent_user_id",
  "cell-user_type",
  "cell-change_type",
  "cell-symbol",
  "cell-product_category",
  "cell-income_direction",
  "cell-amount",
  "cell-balance_before",
  "cell-balance_after",
  "cell-operation",
  "query-actions",
  "toolbar-actions",
]);

const isPnl = computed(() => props.mode === "pnl");
const changeTypeLabels = computed<Record<string, string>>(() => {
  if (isPnl.value) {
    const labels: Record<string, string> = {
      funding_fee_expense: copy.value.fundingFeeExpense,
      funding_fee_income: copy.value.fundingFeeIncome,
      handling_fee: copy.value.tradingFee,
      liquidation_fee: copy.value.liquidationFee,
      realized_pnl: copy.value.realizedPnl,
    };
    return labels;
  }

  const labels: Record<string, string> = {
    admin_adjust: copy.value.adminAdjust,
    adjust_isolated_margin: copy.value.adjustIsolatedMargin,
    deposit: copy.value.deposit,
    funding_fee_settle: copy.value.fundingFeeSettle,
    funding_transfer_in: copy.value.fundingTransferIn,
    funding_transfer_out: copy.value.fundingTransferOut,
    handling_fee: copy.value.handlingFee,
    liquidation_fee: copy.value.liquidationFee,
    agent_transfer: copy.value.agentTransfer,
    agent_transfer_all_out: copy.value.agentTransferAllOut,
    realized_pnl: copy.value.realizedPnl,
    withdraw: copy.value.withdraw,
  };
  return labels;
});

const defaultQueryFields = computed<QueryBarField[]>(() => [
  {
    key: "keyword",
    label: copy.value.keyword,
    type: "keyword",
    defaultValue: "",
    maxlength: 20,
    placeholder: copy.value.keywordPlaceholder,
    clearable: true,
    width: 200,
  },
  ...(props.showUserType
    ? [
        {
          key: "user_type",
          label: copy.value.userType,
          type: "segmented" as const,
          defaultValue: "",
          options: [
            { label: copy.value.all, value: "" },
            { label: copy.value.live, value: 1 },
            { label: copy.value.internal, value: 2 },
            ...(props.includeRobotUserType
              ? [{ label: copy.value.robot, value: 3 }]
              : []),
          ],
          block: true,
          width: props.includeRobotUserType ? 208 : 154,
        },
      ]
    : []),
  {
    key: "change_type",
    label: copy.value.changeType,
    type: "select",
    defaultValue: "",
    placeholder: copy.value.allTypes,
    clearable: true,
    options: [
      { label: copy.value.allTypes, value: "" },
      ...Object.entries(changeTypeLabels.value).map(([value, label]) => ({
        label,
        value,
      })),
    ],
    width: 180,
  },
  {
    key: "symbol",
    label: copy.value.symbol,
    type: "keyword",
    defaultValue: "",
    placeholder: copy.value.symbolPlaceholder,
    clearable: true,
    width: 150,
  },
  {
    key: "time_range",
    label: copy.value.time,
    type: "date-range",
    defaultValue: null,
    placeholder: `${copy.value.startTime} / ${copy.value.endTime}`,
    width: 280,
  },
]);

const queryFields = computed<QueryBarField[]>(() => {
  const defaults = defaultQueryFields.value.map((field) => ({ ...field }));
  const resolved = !props.queryFields
    ? defaults
    : typeof props.queryFields === "function"
      ? props.queryFields(defaults)
      : props.queryFields;
  return Array.isArray(resolved)
    ? resolved.map((field) => ({ ...field }))
    : defaults;
});

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    {
      key: "user_id",
      dataIndex: "user_id",
      title: copy.value.userUid,
      width: 126,
      hideable: false,
    },
  ];
  if (isPnl.value) {
    result.push(
      { key: "username", title: copy.value.username, width: 150 },
      {
        key: "agent_user_id",
        dataIndex: "agent_user_id",
        title: copy.value.externalUserId,
        width: 150,
      },
    );
  }
  if (props.showUserType) {
    result.push({
      key: "user_type",
      dataIndex: "user_type",
      title: copy.value.userType,
      width: 90,
    });
  }
  result.push(
    { key: "id", dataIndex: "id", title: copy.value.flowId, width: 110 },
    {
      key: "change_type",
      dataIndex: "change_type",
      title: copy.value.changeType,
      width: 150,
    },
    {
      key: "symbol",
      dataIndex: "symbol",
      title: copy.value.symbol,
      width: 120,
    },
    {
      key: "product_category",
      dataIndex: "product_category",
      title: copy.value.productCategory,
      width: 130,
    },
  );
  if (isPnl.value) {
    result.push({
      key: "income_direction",
      title: copy.value.incomeDirection,
      width: 100,
    });
  }
  result.push(
    {
      key: "amount",
      dataIndex: "amount",
      title: copy.value.amount,
      width: 150,
      sortable: true,
    },
    {
      key: "balance_before",
      dataIndex: "wallet_balance_before",
      title: copy.value.balanceBefore,
      width: 160,
    },
    {
      key: "balance_after",
      dataIndex: "wallet_balance_after",
      title: copy.value.balanceAfter,
      width: 160,
    },
    {
      key: "reference_id",
      dataIndex: "reference_id",
      title: copy.value.referenceId,
      width: 180,
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title: copy.value.time,
      width: 180,
      sortable: true,
    },
  );
  if (props.actions.detail || slots["cell-operation"]) {
    result.push({
      key: "operation",
      title: copy.value.operation,
      width: 56,
      fixed: "right",
      hideable: false,
    });
  }
  return result;
});

const columns = computed<ProTableColumn<Row>[]>(() => {
  const defaults = defaultColumns.value.map((column) => ({ ...column }));
  const resolved = !props.columns
    ? defaults
    : typeof props.columns === "function"
      ? props.columns(defaults)
      : props.columns;
  return Array.isArray(resolved)
    ? resolved.map((column) => ({ ...column }))
    : defaults;
});

const forwardedSlotNames = computed(() =>
  Object.keys(slots).filter((slotName) => !managedSlotNames.has(slotName)),
);
const activeCursor = ref<string | null>(null);
const nextCursor = ref<string | null>(null);
const previousCursor = ref<string | null>(null);
const hasMore = ref(false);
const hasPrevious = ref(false);

function resetCursorPagination(): void {
  activeCursor.value = null;
  nextCursor.value = null;
  previousCursor.value = null;
  hasMore.value = false;
  hasPrevious.value = false;
}

function scalarFilter(
  filters: QueryBarValue,
  key: string,
): string | number | boolean {
  const value = filters[key];
  return value === null || Array.isArray(value) ? "" : value;
}

function apiDateTime(
  value: string | undefined,
  boundary: "start" | "end",
): string {
  if (!value) return "";
  if (value.includes(" ")) return value;
  return `${value} ${boundary === "start" ? "00:00:00" : "23:59:59"}`;
}

function nestedValue(
  row: Row,
  key: keyof NonNullable<AccountChangeLogRow["user"]>,
): unknown {
  return row.user?.[key];
}

function displayName(row: Row): string {
  return String(
    row.nice_name ||
      nestedValue(row, "nice_name") ||
      row.username ||
      nestedValue(row, "username") ||
      "-",
  );
}

function externalUserId(row: Row): string {
  return String(row.agent_user_id || nestedValue(row, "agent_user_id") || "-");
}

function userTypeValue(row: Row): unknown {
  return row.user_type ?? nestedValue(row, "user_type");
}

function userTypeConfig(
  row: Row,
): { label: string; type: "info" | "success" | "warning" } | null {
  const value = Number(userTypeValue(row));
  if (value === 1) return { label: copy.value.live, type: "success" };
  if (value === 2) return { label: copy.value.internal, type: "info" };
  if (value === 3) return { label: copy.value.robot, type: "warning" };
  return null;
}

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === ""
    ? "-"
    : String(value);
}

function resolvedChangeType(row: Row): string {
  return resolveAccountChangeType(
    row.change_type,
    row.amount,
    props.mode as AccountChangeLogMode,
  );
}

function changeTypeLabel(row: Row): string {
  return (
    changeTypeLabels.value[resolvedChangeType(row)] ||
    displayValue(row.change_type)
  );
}

function productCategoryLabel(value: unknown, name?: unknown): string {
  const configuredName = String(name ?? "").trim();
  if (configuredName) return configuredName;
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (["crypto", "cryptocurrency", "加密货币"].includes(normalized))
    return copy.value.productCategoryCrypto;
  return displayValue(value);
}

async function fetchAccountChanges({
  filters,
  pageSize,
  signal,
  sort,
}: {
  filters: QueryBarValue;
  pageSize: number;
  signal: AbortSignal;
  sort: TableSortState;
}) {
  const timeRange = Array.isArray(filters.time_range)
    ? filters.time_range
    : null;
  const activeSort =
    sort.order && sortableFields.has(sort.key) ? sort : defaultSort;
  const query: AccountChangeLogListQuery = {
    change_type: String(scalarFilter(filters, "change_type")),
    cursor: activeCursor.value || undefined,
    end_time: apiDateTime(timeRange?.[1], "end"),
    keyword: String(scalarFilter(filters, "keyword")),
    order_by: activeSort.key as AccountChangeLogListQuery["order_by"],
    order_dir: activeSort.order === "asc" ? "asc" : "desc",
    page_size: pageSize,
    start_time: apiDateTime(timeRange?.[0], "start"),
    symbol: String(scalarFilter(filters, "symbol")),
    ...(props.showUserType
      ? { user_type: scalarFilter(filters, "user_type") }
      : {}),
  };

  try {
    const result = await props.request(query, {
      filters: { ...filters },
      signal,
    });
    if (!signal.aborted) {
      nextCursor.value = result.nextCursor || null;
      previousCursor.value = result.previousCursor || null;
      hasMore.value = Boolean(result.hasMore && nextCursor.value);
      hasPrevious.value = Boolean(result.hasPrevious && previousCursor.value);
    }
    return {
      rows: Array.isArray(result.rows) ? result.rows : [],
      total: 0,
      updatedAt: result.updatedAt,
    };
  } catch (error: unknown) {
    const candidate = error as { message?: string; msg?: string } | null;
    throw new Error(
      candidate?.msg || candidate?.message || copy.value.loadFailed,
    );
  }
}

const proTable = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchAccountChanges,
});
const { currentPage, loading, pageSize, refreshing, rows, sort } = proTable;

const cursorProTableBindings = computed(() => ({
  ...proTable.proTableBindings.value,
  onQuery: (value: QueryBarValue) => {
    resetCursorPagination();
    proTable.query(value);
  },
  onReset: (value: QueryBarValue) => {
    resetCursorPagination();
    proTable.reset(value);
  },
  "onUpdate:pageSize": (size: number) => {
    resetCursorPagination();
    currentPage.value = 1;
    pageSize.value = Math.max(
      1,
      Math.round(Number(size) || props.initialPageSize),
    );
  },
  "onUpdate:sort": (state: TableSortState) => {
    resetCursorPagination();
    currentPage.value = 1;
    sort.value = { ...state };
  },
}));

function goToNextPage(): void {
  if (loading.value || refreshing.value || !hasMore.value || !nextCursor.value)
    return;
  activeCursor.value = nextCursor.value;
  currentPage.value += 1;
}

function goToPreviousPage(): void {
  if (
    loading.value ||
    refreshing.value ||
    !hasPrevious.value ||
    !previousCursor.value
  )
    return;
  activeCursor.value = previousCursor.value;
  currentPage.value = Math.max(1, currentPage.value - 1);
}

defineExpose({ reload: proTable.reload });
</script>

<template>
  <div
    v-bind="$attrs"
    class="mm-account-change-log-table"
    :class="{ 'is-fill-height': fillHeight }"
    data-mm-component="account-change-log-table"
  >
    <MmProTable
      v-bind="cursorProTableBindings"
      :aria-label="
        ariaLabel ??
        (isPnl
          ? messages.accountChangeLogs.pnlTableAria
          : messages.accountChangeLogs.tableAria)
      "
      :columns="columns"
      :columns-configurable="columnsConfigurable"
      :fill-height="fillHeight"
      :filter-drawer-title="
        filterDrawerTitle ?? messages.accountChangeLogs.filterTitle
      "
      :filter-drawer-subtitle="
        filterDrawerSubtitle ??
        (isPnl
          ? messages.accountChangeLogs.pnlFilterSubtitle
          : messages.accountChangeLogs.filterSubtitle)
      "
      :page-sizes="pageSizes"
      row-key="id"
      :show-pagination="false"
    >
      <template #cell-user_id="slotProps">
        <slot name="cell-user_id" v-bind="slotProps">{{
          displayValue(slotProps.row.user_id)
        }}</slot>
      </template>

      <template #cell-username="slotProps">
        <slot name="cell-username" v-bind="slotProps">{{
          displayName(slotProps.row)
        }}</slot>
      </template>

      <template #cell-agent_user_id="slotProps">
        <slot name="cell-agent_user_id" v-bind="slotProps">{{
          externalUserId(slotProps.row)
        }}</slot>
      </template>

      <template #cell-user_type="slotProps">
        <slot name="cell-user_type" v-bind="slotProps">
          <MmTag
            v-if="userTypeConfig(slotProps.row)"
            effect="outline"
            round
            size="sm"
            :type="userTypeConfig(slotProps.row)?.type"
          >
            {{ userTypeConfig(slotProps.row)?.label }}
          </MmTag>
          <span v-else>-</span>
        </slot>
      </template>

      <template #cell-change_type="slotProps">
        <slot
          name="cell-change_type"
          v-bind="slotProps"
          :label="changeTypeLabel(slotProps.row)"
        >
          <MmTag
            effect="soft"
            round
            size="sm"
            :type="
              resolvedChangeType(slotProps.row).includes('liquidation')
                ? 'danger'
                : 'default'
            "
          >
            {{ changeTypeLabel(slotProps.row) }}
          </MmTag>
        </slot>
      </template>

      <template #cell-symbol="slotProps">
        <slot name="cell-symbol" v-bind="slotProps">{{
          displayValue(slotProps.row.symbol)
        }}</slot>
      </template>

      <template #cell-product_category="slotProps">
        <slot name="cell-product_category" v-bind="slotProps">
          <MmTag effect="soft" round size="sm" type="primary">
            {{
              productCategoryLabel(
                slotProps.row.product_category,
                slotProps.row.product_category_name,
              )
            }}
          </MmTag>
        </slot>
      </template>

      <template #cell-income_direction="slotProps">
        <slot name="cell-income_direction" v-bind="slotProps">
          <MmTag
            v-if="Number(slotProps.row.amount) !== 0"
            effect="soft"
            round
            size="sm"
            :type="Number(slotProps.row.amount) > 0 ? 'success' : 'danger'"
          >
            {{
              Number(slotProps.row.amount) > 0
                ? messages.accountChangeLogs.income
                : messages.accountChangeLogs.expense
            }}
          </MmTag>
          <span v-else>-</span>
        </slot>
      </template>

      <template #cell-amount="slotProps">
        <slot name="cell-amount" v-bind="slotProps">
          <span
            class="mm-account-change-log-table__amount"
            :class="{
              'is-positive': Number(slotProps.row.amount) > 0,
              'is-negative': Number(slotProps.row.amount) < 0,
            }"
          >
            {{ formatAccountChangeAmount(slotProps.row.amount) }}
          </span>
        </slot>
      </template>

      <template #cell-balance_before="slotProps">
        <slot name="cell-balance_before" v-bind="slotProps">
          <span class="mm-account-change-log-table__balance">{{
            formatAccountChangeBalance(slotProps.row.wallet_balance_before)
          }}</span>
        </slot>
      </template>

      <template #cell-balance_after="slotProps">
        <slot name="cell-balance_after" v-bind="slotProps">
          <span class="mm-account-change-log-table__balance">{{
            formatAccountChangeBalance(slotProps.row.wallet_balance_after)
          }}</span>
        </slot>
      </template>

      <template #cell-operation="slotProps">
        <slot
          name="cell-operation"
          v-bind="slotProps"
          :open-detail="() => actions.detail?.(slotProps.row)"
        >
          <MmButton
            v-if="actions.detail"
            :aria-label="messages.accountChangeLogs.viewDetail"
            icon-only
            size="sm"
            :title="messages.accountChangeLogs.viewDetail"
            @click.stop="actions.detail(slotProps.row)"
          >
            <MmIcon name="panel-left-close" :size="15" />
          </MmButton>
        </slot>
      </template>

      <template #query-actions="slotProps">
        <slot name="query-actions" v-bind="slotProps" />
      </template>

      <template #toolbar-actions>
        <slot name="toolbar-actions" />
      </template>

      <template
        v-for="slotName in forwardedSlotNames"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MmProTable>

    <MmProTableCursorPagination
      :current-page="currentPage"
      :has-more="hasMore"
      :has-previous="hasPrevious"
      :loading="loading || refreshing"
      :page-size="pageSize"
      :row-count="rows.length"
      size="md"
      @next="goToNextPage"
      @prev="goToPreviousPage"
    />
  </div>
</template>

<style src="./account-change-log-table.css"></style>
