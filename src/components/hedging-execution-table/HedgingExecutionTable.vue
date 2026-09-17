<template>
  <section class="mm-hedging-execution-table">
    <div
      class="mm-hedging-execution-table__toolbar"
      :class="{ 'has-agent-filter': showAgent }"
    >
      <MmSelect
        v-if="showAgent"
        v-model="draft.agentId"
        :aria-label="copy.agent"
        :options="agentOptions"
        :placeholder="copy.allAgents"
        size="sm"
      />
      <MmInput
        v-model="draft.keyword"
        :aria-label="copy.searchAria"
        clearable
        :placeholder="copy.searchPlaceholder"
        size="sm"
        @keydown.enter="search"
      >
        <template #prefix><MmIcon name="search" :size="13" /></template>
      </MmInput>
      <MmSelect
        v-model="draft.symbol"
        :aria-label="copy.filterSymbolAria"
        :options="symbolOptions"
        :placeholder="copy.allSymbols"
        size="sm"
      />
      <MmSelect
        v-model="draft.side"
        :aria-label="copy.filterSideAria"
        :options="sideOptions"
        :placeholder="copy.allSides"
        size="sm"
      />
      <MmSelect
        v-model="draft.reason"
        :aria-label="copy.filterReasonAria"
        :options="reasonOptions"
        :placeholder="copy.allReasons"
        size="sm"
      />
      <MmSelect
        v-model="draft.status"
        :aria-label="copy.filterStatusAria"
        :options="statusOptions"
        :placeholder="copy.allStatuses"
        size="sm"
      />
      <MmSelect
        v-model="draft.accountId"
        :aria-label="copy.filterAccountAria"
        :options="accountOptions"
        :placeholder="copy.allAccounts"
        size="sm"
      />
      <div class="mm-hedging-execution-table__actions">
        <MmButton :loading="loading" size="sm" variant="primary" @click="search">
          <template #icon><MmIcon name="search" :size="13" /></template>
          {{ copy.query }}
        </MmButton>
        <MmButton :disabled="loading" size="sm" @click="reset">
          <template #icon><MmIcon name="rotate-ccw" :size="13" /></template>
          {{ copy.reset }}
        </MmButton>
        <MmButton
          :aria-label="copy.refreshAria"
          icon-only
          :loading="loading"
          size="sm"
          :title="copy.refresh"
          @click="load"
        >
          <template #icon><MmIcon name="refresh-cw" :size="14" /></template>
        </MmButton>
      </div>
    </div>

    <div class="mm-hedging-execution-table__body mm-pro-table__body">
      <MmTable
        v-if="!loading || rows.length"
        :aria-label="copy.tableAria"
        class="mm-hedging-execution-table__table"
        :class="{ 'is-empty': tableRows.length === 0 }"
        :columns="columns"
        :data="tableRows"
        :empty-text="copy.emptyText"
        :hoverable="false"
        :row-key="rowKey"
      >
        <template #cell-task_no="{ row }">
          <span class="mm-hedging-execution-table__task" :title="row.task_no">
            {{ row.task_no }}
          </span>
        </template>
        <template #cell-agent_id="{ row }">{{ row.agent_id || "-" }}</template>
        <template #cell-agent_name="{ row }">{{ row.agent_name || "-" }}</template>
        <template #cell-source_type>
          <MmTag effect="soft" round size="sm" type="primary">{{ copy.merchant }}</MmTag>
        </template>
        <template #cell-symbol="{ row }">
          <slot name="symbol" :row="row">{{ row.symbol }}</slot>
        </template>
        <template #cell-side="{ row }">
          <MmTag effect="soft" round size="sm" :type="row.side === 'BUY' ? 'success' : 'danger'">
            {{ sideLabel(row.side) }}
          </MmTag>
        </template>
        <template #cell-reason="{ row }">
          <MmTag effect="soft" round size="sm" :type="reasonType(row.reason)">
            {{ reasonLabel(row.reason) }}
          </MmTag>
        </template>
        <template #cell-notional_usdt="{ row }">
          <div
            class="mm-hedging-execution-table__amount-pair"
            :class="amountClass(row)"
          >
            <strong>{{ formatQuantity(row) }}</strong>
            <span>{{ formatNotional(row) }}</span>
          </div>
        </template>
        <template #cell-account="{ row }">
          <MmTag effect="soft" round size="sm" type="info">{{ accountLabel(row) }}</MmTag>
        </template>
        <template #cell-status="{ row }">
          <div class="mm-hedging-execution-table__status">
            <MmTag effect="soft" round size="sm" :type="statusType(row.status)">
              {{ statusLabel(row.status) }}
            </MmTag>
            <MmPopover
              v-if="row.status === 'failed'"
              :close-delay="120"
              floating-class="mm-hedging-execution-error-popover"
              :open-delay="120"
              placement="left"
              role="dialog"
              show-arrow
              trigger="hover-focus"
              :width="320"
            >
              <button
                class="mm-hedging-execution-table__help"
                type="button"
                :aria-label="copy.failureReasonAria"
              >
                <MmIcon name="circle-help" :size="14" />
              </button>
              <template #content>
                <div class="mm-hedging-execution-table__error">
                  <strong>{{ copy.failureReason }}</strong>
                  <p>{{ row.error_message || copy.failureReasonEmpty }}</p>
                </div>
              </template>
            </MmPopover>
          </div>
        </template>
        <template #cell-executed_at="{ row }">
          <span class="mm-hedging-execution-table__time">{{ formatTime(row.executed_at) }}</span>
        </template>
      </MmTable>

      <div
        v-if="loading"
        class="mm-pro-table__state"
        :class="{ 'is-overlay': rows.length > 0 }"
        data-pro-table-state="loading"
        role="status"
        aria-live="polite"
      >
        <span class="mm-pro-table__state-icon is-loading" aria-hidden="true">
          <MmIcon name="loader-circle" :size="24" spin />
        </span>
        <strong>{{ copy.loadingTitle }}</strong>
        <p>{{ copy.loadingDescription }}</p>
      </div>
    </div>

    <footer class="mm-hedging-execution-table__footer">
      <span>{{ copy.pagination(rangeStart, rangeEnd, total) }}</span>
      <MmPagination
        v-if="total"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :disabled="loading"
        :page-sizes="pageSizes"
        :total="total"
        show-size-changer
        size="sm"
        @current-change="load"
        @size-change="pageSizeChanged"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";

import { useLocale } from "../../composables/use-locale";
import MmButton from "../button/Button.vue";
import MmIcon from "../icon/Icon.vue";
import MmInput from "../input/Input.vue";
import MmPagination from "../pagination/Pagination.vue";
import MmPopover from "../popover/Popover.vue";
import MmSelect from "../select/Select.vue";
import type { SelectOption } from "../select";
import MmTable from "../table/Table.vue";
import type { TableColumn, TableRow } from "../table";
import MmTag from "../tag/Tag.vue";
import type { TagType } from "../tag";
import type {
  HedgingExecutionOption,
  HedgingExecutionReason,
  HedgingExecutionResult,
  HedgingExecutionRow,
  HedgingExecutionSide,
  HedgingExecutionStatus,
  HedgingExecutionTableProps,
} from "./types";

defineOptions({ name: "MmHedgingExecutionTable" });

const props = withDefaults(defineProps<HedgingExecutionTableProps>(), {
  agentOptions: () => [],
  formatDateTime: (value: string) => value || "-",
  initialPageSize: 20,
  pageSizes: () => [10, 20, 30, 50],
  showAgent: false,
});
const emit = defineEmits<{ loaded: [result: HedgingExecutionResult] }>();
const { locale } = useLocale();

const zh = {
  agent: "代理商",
  allAgents: "代理商：全部",
  searchAria: "搜索执行任务编号",
  searchPlaceholder: "搜索任务编号",
  filterSymbolAria: "筛选交易对",
  allSymbols: "交易对：全部",
  filterSideAria: "筛选执行方向",
  allSides: "方向：全部",
  filterReasonAria: "筛选执行类型",
  allReasons: "类型：全部",
  filterStatusAria: "筛选执行状态",
  allStatuses: "状态：全部",
  filterAccountAria: "筛选执行账号",
  allAccounts: "执行账号：全部",
  query: "查询",
  reset: "重置",
  refresh: "刷新",
  refreshAria: "刷新执行记录",
  tableAria: "对冲执行记录列表",
  emptyText: "暂无执行记录。",
  loadingTitle: "正在加载数据",
  loadingDescription: "正在准备当前查询的数据，请稍候。",
  failureReason: "失败原因",
  failureReasonAria: "查看执行失败原因",
  failureReasonEmpty: "暂无报错信息",
  merchant: "商户",
  pagination: (start: number, end: number, total: number) => `显示 ${start}-${end} 条，共 ${total} 条`,
  columns: { taskNo: "任务编号", sourceId: "来源 ID", sourceName: "来源昵称", sourceType: "来源类型", symbol: "交易对", side: "方向", reason: "类型", notional: "对冲数量 (币/U)", account: "执行账号", status: "状态", time: "时间" },
  directions: { BUY: "买入", SELL: "卖出" },
  reasons: { first_trigger: "首次触发", rebalance: "再平衡", exit_hedge: "退出对冲", manual_close: "手动平仓", position_flip_close: "反向开仓", hedge_ratio_adjustment: "对冲比例调整" },
  statuses: { planned: "已计划", skipped: "已跳过", submitted: "已提交", filled: "已完成", failed: "执行失败", dry_run: "模拟执行" },
};
const en = {
  agent: "Agent",
  allAgents: "Agent: All",
  searchAria: "Search execution task number",
  searchPlaceholder: "Search task number",
  filterSymbolAria: "Filter by trading pair",
  allSymbols: "Trading Pair: All",
  filterSideAria: "Filter by execution side",
  allSides: "Side: All",
  filterReasonAria: "Filter by execution type",
  allReasons: "Type: All",
  filterStatusAria: "Filter by execution status",
  allStatuses: "Status: All",
  filterAccountAria: "Filter by execution account",
  allAccounts: "Execution Account: All",
  query: "Query",
  reset: "Reset",
  refresh: "Refresh",
  refreshAria: "Refresh execution history",
  tableAria: "Hedging execution history list",
  emptyText: "No execution records.",
  loadingTitle: "Loading data",
  loadingDescription: "Preparing data for the current query. Please wait.",
  failureReason: "Failure reason",
  failureReasonAria: "View execution failure reason",
  failureReasonEmpty: "No error details available",
  merchant: "Merchant",
  pagination: (start: number, end: number, total: number) => `Showing ${start}-${end} of ${total}`,
  columns: { taskNo: "Task Number", sourceId: "Source ID", sourceName: "Source Name", sourceType: "Source Type", symbol: "Trading Pair", side: "Side", reason: "Type", notional: "Hedge Amount (Coin/U)", account: "Execution Account", status: "Status", time: "Time" },
  directions: { BUY: "Buy", SELL: "Sell" },
  reasons: { first_trigger: "Initial Trigger", rebalance: "Rebalance", exit_hedge: "Exit Hedge", manual_close: "Manual Close", position_flip_close: "Position Flip", hedge_ratio_adjustment: "Hedge Ratio Adjustment" },
  statuses: { planned: "Planned", skipped: "Skipped", submitted: "Submitted", filled: "Completed", failed: "Failed", dry_run: "Simulation" },
};
const copy = computed(() => locale.value === "en-US" ? en : zh);
const rows = ref<HedgingExecutionRow[]>([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(props.initialPageSize);
const total = ref(0);
const symbols = ref<HedgingExecutionOption[]>([]);
const directions = ref<HedgingExecutionOption<HedgingExecutionSide>[]>([]);
const reasons = ref<HedgingExecutionOption<HedgingExecutionReason>[]>([]);
const statuses = ref<HedgingExecutionOption<HedgingExecutionStatus>[]>([]);
const accounts = ref<HedgingExecutionOption<number>[]>([]);
const draft = reactive({ agentId: "", accountId: "", keyword: "", reason: "", side: "", status: "", symbol: "" });
const filters = reactive({ ...draft });
type Row = HedgingExecutionRow & TableRow;
const tableRows = computed(() => rows.value as Row[]);
const rowKey = (row: Row) => `${row.agent_id || 0}:${row.id}`;
const columns = computed<TableColumn<Row>[]>(() => [
  { key: "task_no", dataIndex: "task_no", title: copy.value.columns.taskNo, width: 210 },
  ...(props.showAgent ? [
    { key: "agent_id", dataIndex: "agent_id", title: copy.value.columns.sourceId, width: 90 } as TableColumn<Row>,
    { key: "agent_name", dataIndex: "agent_name", title: copy.value.columns.sourceName, width: 140 } as TableColumn<Row>,
    { key: "source_type", title: copy.value.columns.sourceType, width: 95 } as TableColumn<Row>,
  ] : []),
  { key: "symbol", dataIndex: "symbol", title: copy.value.columns.symbol, width: 150 },
  { key: "side", dataIndex: "side", title: copy.value.columns.side, width: 90, align: "center" },
  { key: "reason", dataIndex: "reason", title: copy.value.columns.reason, width: 145, align: "center" },
  { key: "notional_usdt", dataIndex: "notional_usdt", title: copy.value.columns.notional, width: 150, align: "center" },
  { key: "account", title: copy.value.columns.account, width: 180, align: "center" },
  { key: "status", dataIndex: "status", title: copy.value.columns.status, width: 125, align: "center" },
  { key: "executed_at", dataIndex: "executed_at", title: copy.value.columns.time, width: 175, align: "center" },
]);
const symbolOptions = computed<SelectOption[]>(() => [{ label: copy.value.allSymbols, value: "" }, ...symbols.value]);
const sideOptions = computed<SelectOption[]>(() => [{ label: copy.value.allSides, value: "" }, ...directions.value.map((option) => ({ label: sideLabel(option.value), value: option.value }))]);
const reasonOptions = computed<SelectOption[]>(() => [{ label: copy.value.allReasons, value: "" }, ...reasons.value.map((option) => ({ label: reasonLabel(option.value), value: option.value }))]);
const statusOptions = computed<SelectOption[]>(() => [{ label: copy.value.allStatuses, value: "" }, ...statuses.value.map((option) => ({ label: statusLabel(option.value), value: option.value }))]);
const accountOptions = computed<SelectOption[]>(() => [{ label: copy.value.allAccounts, value: "" }, ...accounts.value.filter((option) => !draft.agentId || !option.agent_id || String(option.agent_id) === draft.agentId).map((option) => ({ label: option.label, value: String(option.value) }))]);
const rangeStart = computed(() => total.value ? (page.value - 1) * pageSize.value + 1 : 0);
const rangeEnd = computed(() => Math.min(total.value, page.value * pageSize.value));

async function load() {
  loading.value = true;
  try {
    const result = await props.request({
      ...(props.showAgent && filters.agentId ? { agent_id: filters.agentId } : {}),
      ...(filters.accountId ? { account_id: filters.accountId } : {}),
      ...(filters.keyword ? { keyword: filters.keyword } : {}),
      ...(filters.reason ? { reason: filters.reason as HedgingExecutionReason } : {}),
      ...(filters.side ? { side: filters.side as HedgingExecutionSide } : {}),
      ...(filters.status ? { status: filters.status as HedgingExecutionStatus } : {}),
      ...(filters.symbol ? { symbol: filters.symbol } : {}),
      page: page.value,
      page_size: pageSize.value,
    });
    rows.value = Array.isArray(result?.lists) ? result.lists : [];
    total.value = Math.max(0, Number(result?.count) || 0);
    symbols.value = Array.isArray(result?.options?.symbols) ? result.options.symbols : [];
    directions.value = Array.isArray(result?.options?.directions) ? result.options.directions : [];
    reasons.value = Array.isArray(result?.options?.reasons) ? result.options.reasons : [];
    statuses.value = Array.isArray(result?.options?.statuses) ? result.options.statuses : [];
    accounts.value = Array.isArray(result?.options?.accounts) ? result.options.accounts : [];
    emit("loaded", result);
    const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value));
    if (page.value > maxPage) {
      page.value = maxPage;
      await load();
    }
  } finally {
    loading.value = false;
  }
}
function search() { Object.assign(filters, draft, { keyword: draft.keyword.trim() }); page.value = 1; void load(); }
function reset() { Object.assign(draft, { agentId: "", accountId: "", keyword: "", reason: "", side: "", status: "", symbol: "" }); Object.assign(filters, draft); page.value = 1; void load(); }
function pageSizeChanged() { page.value = 1; void load(); }
function signedAmount(value: string | number, side: HedgingExecutionSide) { const number = Number(value); if (!Number.isFinite(number)) return Number.NaN; const absolute = Math.abs(number); return side === "SELL" && absolute !== 0 ? -absolute : absolute; }
function baseAsset(row: HedgingExecutionRow) { const target = String(row.target_symbol || "").split("/")[0]?.trim().toUpperCase(); if (target) return target; const symbol = String(row.symbol || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, ""); const quote = ["USDT", "USDC", "BUSD", "FDUSD", "USD"].find((item) => symbol.endsWith(item)); return quote ? symbol.slice(0, -quote.length) : symbol; }
function formatQuantity(row: HedgingExecutionRow) { const quantity = signedAmount(row.quantity, row.side); if (!Number.isFinite(quantity)) return "-"; const asset = baseAsset(row); const value = new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(Object.is(quantity, -0) ? 0 : quantity); return asset ? `${value} ${asset}` : value; }
function formatNotional(row: HedgingExecutionRow) { const notional = signedAmount(row.notional_usdt, row.side); if (!Number.isFinite(notional)) return "-"; return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Object.is(notional, -0) ? 0 : notional)} U`; }
function amountClass(row: HedgingExecutionRow) { const quantity = Math.abs(Number(row.quantity)); const notional = Math.abs(Number(row.notional_usdt)); const hasAmount = (Number.isFinite(quantity) && quantity > 0) || (Number.isFinite(notional) && notional > 0); return { "is-negative": hasAmount && row.side === "SELL", "is-positive": hasAmount && row.side === "BUY" }; }
function formatTime(value: string | null) { return value ? props.formatDateTime(value) : "-"; }
function accountLabel(row: HedgingExecutionRow) { return [row.exchange, row.account_name].filter(Boolean).join(" · ") || "-"; }
function sideLabel(side: HedgingExecutionSide) { return copy.value.directions[side] || side; }
function reasonLabel(reason: HedgingExecutionReason) { return copy.value.reasons[reason] || reason; }
function statusLabel(status: HedgingExecutionStatus) { return copy.value.statuses[status] || status; }
function reasonType(reason: HedgingExecutionReason): TagType { if (["exit_hedge", "manual_close", "position_flip_close"].includes(reason)) return "warning"; return reason === "hedge_ratio_adjustment" ? "info" : "success"; }
function statusType(status: HedgingExecutionStatus): TagType { if (status === "filled") return "success"; if (status === "failed") return "danger"; if (status === "dry_run") return "info"; return "warning"; }
watch(() => draft.agentId, () => { draft.accountId = ""; });
onMounted(load);
defineExpose({ reload: load });
</script>

<style scoped>
.mm-hedging-execution-table{display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;height:100%;min-height:460px;border:1px solid var(--mm-color-line);border-radius:10px;background:var(--mm-color-panel)}
.mm-hedging-execution-table__toolbar{display:grid;grid-template-columns:minmax(170px,220px) repeat(5,minmax(120px,150px)) 1fr;gap:8px;align-items:center;padding:8px 10px;border-bottom:1px solid var(--mm-color-line)}
.mm-hedging-execution-table__toolbar.has-agent-filter{grid-template-columns:150px minmax(160px,210px) repeat(5,minmax(115px,140px)) 1fr}
.mm-hedging-execution-table__actions{display:flex;justify-content:flex-end;gap:7px}.mm-hedging-execution-table__body{position:relative;display:flex;overflow:hidden;min-height:0}.mm-hedging-execution-table__body>.mm-pro-table__state{position:absolute;inset:0;min-height:100%}
.mm-hedging-execution-table__table{display:flex;flex:1 1 auto;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0;border:0;border-radius:0}.mm-hedging-execution-table__table :deep(.mm-table__viewport),.mm-hedging-execution-table__table :deep(.mm-table__scroll){flex:1 1 auto;min-height:0}.mm-hedging-execution-table__table.is-empty :deep(.mm-table__body-table),.mm-hedging-execution-table__table.is-empty :deep(.mm-table__body-table>tbody),.mm-hedging-execution-table__table.is-empty :deep(.mm-table__body-table>tbody>tr),.mm-hedging-execution-table__table.is-empty :deep(.mm-table__empty-cell){height:100%}.mm-hedging-execution-table__table.is-empty :deep(.mm-table__empty-cell){vertical-align:middle}.mm-hedging-execution-table__table :deep(th),.mm-hedging-execution-table__table :deep(td){min-width:0;padding:8px 6px;font-size:11px}
.mm-hedging-execution-table__task,.mm-hedging-execution-table__time{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mm-hedging-execution-table__task{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.mm-hedging-execution-table__amount-pair{display:grid;gap:2px;color:var(--mm-color-text-muted);line-height:1.2;white-space:nowrap;font-variant-numeric:tabular-nums}.mm-hedging-execution-table__amount-pair>strong{font-size:12px;font-weight:650}.mm-hedging-execution-table__amount-pair>span{font-size:11px;font-weight:550}.mm-hedging-execution-table__amount-pair.is-positive{color:var(--mm-color-success)}.mm-hedging-execution-table__amount-pair.is-negative{color:var(--mm-color-danger)}.mm-hedging-execution-table__time{color:var(--mm-color-text-muted);font-size:var(--mm-font-size-sm)}.mm-hedging-execution-table__status{display:inline-flex;align-items:center;gap:5px}.mm-hedging-execution-table__help{display:inline-flex;align-items:center;justify-content:center;padding:0;border:0;background:transparent;color:var(--mm-color-text-muted);cursor:help}.mm-hedging-execution-table__help:hover,.mm-hedging-execution-table__help:focus-visible{color:var(--mm-color-primary);outline:none}.mm-hedging-execution-table__error{display:grid;gap:8px}.mm-hedging-execution-table__error p{margin:0;overflow-wrap:anywhere;color:var(--mm-color-text-muted);line-height:1.55}.mm-hedging-execution-table__footer{display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:6px 12px;border-top:1px solid var(--mm-color-line);color:var(--mm-color-text-muted);font-size:12px}
@media(max-width:1100px){.mm-hedging-execution-table__toolbar,.mm-hedging-execution-table__toolbar.has-agent-filter{grid-template-columns:repeat(3,minmax(150px,1fr))}.mm-hedging-execution-table__actions{grid-column:1/-1}}
</style>
