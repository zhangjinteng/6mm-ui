<template>
  <section class="mm-hedging-monitor">
    <div class="mm-hedging-monitor__toolbar" :class="{ 'has-agent-filter': showAgent, 'has-switch-filters': showSwitchFilters }">
      <MmSelect
        v-if="showAgent"
        v-model="filterDraft.agentId"
        :aria-label="copy.agent"
        :options="agentOptions"
        :placeholder="copy.allAgents"
        size="sm"
      />
      <MmInput
        v-model="filterDraft.keyword"
        :aria-label="copy.searchAria"
        clearable
        :placeholder="copy.searchPlaceholder"
        size="sm"
        @keydown.enter="handleSearch"
      >
        <template #prefix><MmIcon name="search" :size="13" /></template>
      </MmInput>
      <MmSelect
        v-model="filterDraft.status"
        :aria-label="copy.statusFilterAria"
        :options="statusFilterOptions"
        :placeholder="copy.allStatuses"
        size="sm"
      />
      <MmSelect
        v-if="showSwitchFilters"
        v-model="filterDraft.globalEnabled"
        :aria-label="copy.globalSwitch"
        :options="globalSwitchOptions"
        size="sm"
      />
      <MmSelect
        v-if="showSwitchFilters"
        v-model="filterDraft.symbolEnabled"
        :aria-label="copy.symbolSwitch"
        :options="symbolSwitchOptions"
        size="sm"
      />
      <div class="mm-hedging-monitor__actions">
        <MmButton :disabled="loading" :loading="loading" size="sm" variant="primary" @click="handleSearch">
          <template #icon><MmIcon name="search" :size="13" /></template>{{ copy.query }}
        </MmButton>
        <MmButton :disabled="loading" size="sm" @click="handleReset">
          <template #icon><MmIcon name="rotate-ccw" :size="13" /></template>{{ copy.reset }}
        </MmButton>
        <MmButton :loading="loading" :aria-label="copy.refreshAria" icon-only size="sm" :title="copy.refresh" @click="load">
          <template #icon><MmIcon name="refresh-cw" :size="14" /></template>
        </MmButton>
      </div>
    </div>

    <div class="mm-hedging-monitor__table-wrap mm-pro-table__body">
      <MmTable
        v-if="!loading || rows.length"
        :aria-label="copy.tableAria"
        class="mm-hedging-monitor__table"
        :class="{ 'is-empty': tableRows.length === 0 }"
        :columns="columns"
        :data="tableRows"
        :empty-text="copy.emptyText"
        :hoverable="false"
        :row-key="rowKey"
      >
        <template v-for="key in helpHeaders" :key="key" #[`header-${key}`]>
          <span class="mm-hedging-monitor__column-header">
            {{ copy.columns[key] }}
            <MmTooltip :content="copy.tooltips[key]" placement="top">
              <span class="mm-hedging-monitor__help" tabindex="0"><MmIcon name="circle-help" :size="14" /></span>
            </MmTooltip>
          </span>
        </template>
        <template #cell-source_id="{ row }">{{ row.agent_id || "-" }}</template>
        <template #cell-source_name="{ row }">{{ row.agent_name || "-" }}</template>
        <template #cell-source_type>
          <MmTag effect="soft" round size="sm" type="info">{{ copy.sourceType }}</MmTag>
        </template>
        <template #cell-symbol="scope"><slot name="cell-symbol" v-bind="scope">{{ scope.row.symbol || "-" }}</slot></template>
        <template #cell-account="scope">
          <slot name="cell-account" v-bind="scope">
            <div class="mm-hedging-monitor__account">
              <MmExchangeLogo :name="scope.row.exchange || ''" :size="20" />
              <div class="mm-hedging-monitor__account-copy"><strong>{{ scope.row.exchange || "-" }}</strong><span>{{ scope.row.account_name || "-" }}</span></div>
            </div>
          </slot>
        </template>
        <template #cell-long_quantity="{ row }"><strong :class="amountClass(row.long_quantity)">{{ formatPositionQuantity(row.long_quantity, row) }}</strong></template>
        <template #cell-short_quantity="{ row }"><strong :class="amountClass(-Number(row.short_quantity))">{{ formatPositionQuantity(row.short_quantity, row) }}</strong></template>
        <template #cell-net_exposure="{ row }"><AmountPair :coin="formatCoinQuantity(row)" :coin-class="amountClass(invert(row.net_quantity))" :usdt="`${formatSignedUsdt(calculateNetExposureUsdt(row))} U`" :usdt-class="amountClass(calculateNetExposureUsdt(row))" /></template>
        <template #cell-target_hedge="{ row }"><AmountPair :coin="formatQuantity(row.target_hedge_quantity, row)" :coin-class="amountClass(row.target_hedge_quantity)" :usdt="`${formatSignedUsdt(row.target_hedge_usdt)} U`" :usdt-class="amountClass(row.target_hedge_usdt)" /></template>
        <template #cell-actual_hedge="{ row }"><AmountPair :coin="formatQuantity(row.actual_hedge_quantity, row)" :coin-class="actualClass(row.actual_hedge_quantity, row)" :usdt="`${formatSignedUsdt(row.actual_hedge_usdt)} U`" :usdt-class="actualClass(row.actual_hedge_usdt, row)" /></template>
        <template #cell-hedge_progress="{ row }"><strong class="mm-hedging-monitor__progress">{{ formatHedgeProgress(row) }}</strong></template>
        <template #cell-status="{ row }"><MmTag effect="soft" round size="sm" :title="row.status_reason || statusLabel(row.status, row.status_label)" :type="statusType(row.status)">{{ statusLabel(row.status, row.status_label) }}</MmTag></template>
        <template #cell-calculated_at="{ row }"><span class="mm-hedging-monitor__time">{{ formatTime(row.calculated_at) }}</span></template>
      </MmTable>
      <div v-if="loading" class="mm-pro-table__state" :class="{ 'is-overlay': rows.length > 0 }" role="status" aria-live="polite">
        <span class="mm-pro-table__state-icon is-loading" aria-hidden="true"><MmIcon name="loader-circle" :size="24" spin /></span>
        <strong>{{ copy.loadingTitle }}</strong><p>{{ copy.loadingDescription }}</p>
      </div>
    </div>
    <footer class="mm-hedging-monitor__footer">
      <span>{{ copy.pagination(rangeStart, rangeEnd, total) }}</span>
      <MmPagination v-if="total > 0" v-model:current-page="page" v-model:page-size="pageSize" :disabled="loading" :page-sizes="pageSizes" :total="total" show-size-changer size="sm" @current-change="load" @size-change="handlePageSize" />
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, onMounted, reactive, ref } from "vue";
import { useLocale } from "../../composables/use-locale";
import { MmButton } from "../button";
import { MmExchangeLogo } from "../exchange-logo";
import { MmIcon } from "../icon";
import { MmInput } from "../input";
import { MmPagination } from "../pagination";
import { MmSelect, type SelectOption } from "../select";
import { MmTable, type TableColumn, type TableRow } from "../table";
import { MmTag, type TagType } from "../tag";
import { MmTooltip } from "../tooltip";
import type { HedgingMonitorRequest, HedgingMonitorResult, HedgingMonitorRow, HedgingMonitorStatus, HedgingMonitorStatusOption } from "./types";

defineOptions({ name: "MmHedgingMonitor" });

const props = withDefaults(defineProps<{ agentOptions?: SelectOption[]; formatDateTime?: (value: string) => string; initialPageSize?: number; pageSizes?: number[]; request: HedgingMonitorRequest; resolveMarkPrice?: (row: HedgingMonitorRow) => number; showAgent?: boolean; showSwitchFilters?: boolean }>(), { agentOptions: () => [], formatDateTime: (value: string) => value || "-", initialPageSize: 20, pageSizes: () => [10, 20, 30, 50], resolveMarkPrice: () => 0, showAgent: false, showSwitchFilters: false });
const emit = defineEmits<{ loaded: [result: HedgingMonitorResult] }>();
const { locale } = useLocale();

const zh = {
  agent: "代理商", allAgents: "全部代理", allStatuses: "状态：全部", globalSwitch: "自动对冲服务", globalSwitchAll: "自动对冲服务：全部", globalSwitchEnabled: "自动对冲服务：开启", globalSwitchDisabled: "自动对冲服务：关闭", symbolSwitch: "币种对冲", symbolSwitchAll: "币种对冲：全部", symbolSwitchEnabled: "币种对冲：开启", symbolSwitchDisabled: "币种对冲：关闭", searchAria: "搜索合约、交易所或账户", searchPlaceholder: "搜索合约、交易所或账户", statusFilterAria: "对冲状态", query: "查询", reset: "重置", refresh: "刷新", refreshAria: "刷新敞口监控", tableAria: "敞口监控数据", emptyText: "暂无敞口数据", loadingTitle: "正在加载敞口监控", loadingDescription: "正在读取最新敞口与对冲状态。", pagination: (start: number, end: number, total: number) => `显示 ${start}-${end} 条，共 ${total} 条`,
  columns: { source_id: "来源 ID", source_name: "来源昵称", source_type: "来源类型", symbol: "合约", account: "交易所 / 对冲账户", long_quantity: "多头合计", short_quantity: "空头合计", net_exposure: "净敞口 (币/U)", target_hedge: "目标对冲量 (币/U)", actual_hedge: "已对冲量 (币/U)", hedge_progress: "对冲进度", status: "状态", calculated_at: "更新时间" },
  sourceType: "商户",
  tooltips: { long_quantity: "买入(做多)仓位的合约数量合计", short_quantity: "卖出(做空)仓位的合约数量合计", net_exposure: "买入(做多)与卖出(做空)仓位的币数量与对应(U)价值的净差值。", target_hedge: "下一次对冲的目标值=净敞口 (币/U)×目标对冲比例", actual_hedge: "当前合约已经实现对冲的币数量与对应(U)价值", hedge_progress: "已对冲量 ÷ 目标对冲量 × 100%" },
  statuses: { unconfigured: "未配置币种对冲", global_off: "总开关已关闭", symbol_off: "币种已关闭", account_unavailable: "账户不可用", observing: "观察中", data_stale: "数据已过期", open_required: "待首次对冲", rebalance_required: "待再平衡", exit_required: "待退出", balanced: "对冲正常", execution_failed: "执行失败" },
};
const en = {
  agent: "Agent", allAgents: "All agents", allStatuses: "Status: All", globalSwitch: "Automatic hedging service", globalSwitchAll: "Auto hedging: All", globalSwitchEnabled: "Auto hedging: Enabled", globalSwitchDisabled: "Auto hedging: Disabled", symbolSwitch: "Symbol hedging", symbolSwitchAll: "Symbol hedging: All", symbolSwitchEnabled: "Symbol hedging: Enabled", symbolSwitchDisabled: "Symbol hedging: Disabled", searchAria: "Search contract, exchange, or account", searchPlaceholder: "Search contract, exchange, or account", statusFilterAria: "Hedging status", query: "Search", reset: "Reset", refresh: "Refresh", refreshAria: "Refresh exposure monitor", tableAria: "Exposure monitor data", emptyText: "No exposure data", loadingTitle: "Loading exposure monitor", loadingDescription: "Reading the latest exposure and hedging status.", pagination: (start: number, end: number, total: number) => `Showing ${start}-${end} of ${total}`,
  columns: { source_id: "Source ID", source_name: "Source name", source_type: "Source type", symbol: "Contract", account: "Exchange / hedge account", long_quantity: "Long total", short_quantity: "Short total", net_exposure: "Net exposure (Coin/U)", target_hedge: "Target hedge (Coin/U)", actual_hedge: "Actual hedge (Coin/U)", hedge_progress: "Hedge progress", status: "Status", calculated_at: "Updated at" },
  sourceType: "Merchant",
  tooltips: { long_quantity: "Total contract quantity of long positions", short_quantity: "Total contract quantity of short positions", net_exposure: "Net coin quantity and U value difference between long and short positions.", target_hedge: "Next hedge target = net exposure × target hedge ratio", actual_hedge: "Coin quantity and U value currently hedged by the contract", hedge_progress: "Actual hedge divided by target hedge, multiplied by 100%" },
  statuses: { unconfigured: "Not configured", global_off: "Service disabled", symbol_off: "Symbol disabled", account_unavailable: "Account unavailable", observing: "Observing", data_stale: "Data stale", open_required: "Initial hedge required", rebalance_required: "Rebalance required", exit_required: "Exit required", balanced: "Balanced", execution_failed: "Execution failed" },
};
const copy = computed(() => locale.value === "en-US" ? en : zh);
const allStatuses = Object.keys(zh.statuses) as HedgingMonitorStatus[];
const fallbackStatuses: HedgingMonitorStatusOption[] = allStatuses.map((value) => ({ label: value, value }));
const rows = ref<HedgingMonitorRow[]>([]); const statuses = ref(fallbackStatuses); const loading = ref(false); const page = ref(1); const pageSize = ref(props.initialPageSize); const total = ref(0);
const defaultSwitchFilter = () => props.showSwitchFilters ? "1" : "";
const filterDraft = reactive({ agentId: "", globalEnabled: defaultSwitchFilter(), keyword: "", status: "", symbolEnabled: defaultSwitchFilter() }); const filters = reactive({ ...filterDraft });
type Row = HedgingMonitorRow & TableRow;
const tableRows = computed(() => rows.value as Row[]);
const helpHeaders = ["long_quantity", "short_quantity", "net_exposure", "target_hedge", "actual_hedge", "hedge_progress"] as const;
const columns = computed<TableColumn<Row>[]>(() => [
  ...(props.showAgent ? [
    { key: "source_id", dataIndex: "agent_id", title: copy.value.columns.source_id, width: "7%" },
    { key: "source_name", dataIndex: "agent_name", title: copy.value.columns.source_name, width: "9%" },
    { key: "source_type", title: copy.value.columns.source_type, width: "7%", align: "center" },
  ] as TableColumn<Row>[] : []),
  { key: "symbol", dataIndex: "symbol", title: copy.value.columns.symbol, width: "8%" }, { key: "account", title: copy.value.columns.account, width: "12%" },
  { key: "long_quantity", dataIndex: "long_quantity", title: copy.value.columns.long_quantity, width: "8%", align: "center" }, { key: "short_quantity", dataIndex: "short_quantity", title: copy.value.columns.short_quantity, width: "8%", align: "center" },
  { key: "net_exposure", title: copy.value.columns.net_exposure, width: "13%", align: "center" }, { key: "target_hedge", title: copy.value.columns.target_hedge, width: "13%", align: "center" }, { key: "actual_hedge", title: copy.value.columns.actual_hedge, width: "13%", align: "center" }, { key: "hedge_progress", title: copy.value.columns.hedge_progress, width: "9%", align: "center" },
  { key: "status", dataIndex: "status", title: copy.value.columns.status, width: "8%", align: "center" }, { key: "calculated_at", dataIndex: "calculated_at", title: copy.value.columns.calculated_at, width: "11%", align: "center" },
]);
const statusFilterOptions = computed<SelectOption[]>(() => [{ label: copy.value.allStatuses, value: "" }, ...statuses.value.map((item) => ({ label: statusLabel(item.value, item.label), value: item.value }))]);
const globalSwitchOptions = computed<SelectOption[]>(() => [{ label: copy.value.globalSwitchAll, value: "" }, { label: copy.value.globalSwitchEnabled, value: "1" }, { label: copy.value.globalSwitchDisabled, value: "0" }]);
const symbolSwitchOptions = computed<SelectOption[]>(() => [{ label: copy.value.symbolSwitchAll, value: "" }, { label: copy.value.symbolSwitchEnabled, value: "1" }, { label: copy.value.symbolSwitchDisabled, value: "0" }]);
const rangeStart = computed(() => total.value ? (page.value - 1) * pageSize.value + 1 : 0); const rangeEnd = computed(() => Math.min(total.value, page.value * pageSize.value));
const rowKey = (row: Row) => `${row.agent_id || 0}:${row.id}`;
async function load() { loading.value = true; try { const result = await props.request({ ...(props.showAgent && filters.agentId ? { agent_id: filters.agentId } : {}), ...(props.showSwitchFilters && filters.globalEnabled ? { global_enabled: filters.globalEnabled as "0" | "1" } : {}), ...(filters.keyword ? { keyword: filters.keyword } : {}), ...(filters.status ? { status: filters.status as HedgingMonitorStatus } : {}), ...(props.showSwitchFilters && filters.symbolEnabled ? { symbol_enabled: filters.symbolEnabled as "0" | "1" } : {}), page: page.value, page_size: pageSize.value }); rows.value = Array.isArray(result?.lists) ? result.lists : []; total.value = Math.max(0, Number(result?.count) || 0); statuses.value = Array.isArray(result?.options?.statuses) ? result.options.statuses : fallbackStatuses; emit("loaded", result); const maxPage = Math.max(1, Math.ceil(total.value / pageSize.value)); if (page.value > maxPage) { page.value = maxPage; await load(); } } finally { loading.value = false; } }
function handleSearch() { filters.agentId = filterDraft.agentId; filters.globalEnabled = filterDraft.globalEnabled; filters.keyword = filterDraft.keyword.trim(); filters.status = filterDraft.status; filters.symbolEnabled = filterDraft.symbolEnabled; page.value = 1; void load(); }
function handleReset() { Object.assign(filterDraft, { agentId: "", globalEnabled: defaultSwitchFilter(), keyword: "", status: "", symbolEnabled: defaultSwitchFilter() }); Object.assign(filters, filterDraft); page.value = 1; void load(); }
function handlePageSize() { page.value = 1; void load(); }
function statusLabel(status: HedgingMonitorStatus, fallback = "") { return copy.value.statuses[status] || fallback || status; }
function statusType(status: HedgingMonitorStatus): TagType { if (status === "balanced") return "success"; if (status === "execution_failed") return "danger"; if (status === "account_unavailable" || status === "data_stale") return "info"; return "warning"; }
function number(value: string | number) { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : Number.NaN; }
function invert(value: string | number) { const parsed = number(value); return parsed === 0 ? 0 : -parsed; }
function formatAmount(value: string | number) { const parsed = number(value); return Number.isFinite(parsed) ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(parsed) : "-"; }
function formatUsdt(value: string | number) { const parsed = number(value); if (!Number.isFinite(parsed)) return "-"; const truncated = Math.trunc(parsed * 100) / 100; return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Object.is(truncated, -0) ? 0 : truncated); }
function formatSigned(value: string | number) { const parsed = number(value); return !Number.isFinite(parsed) ? "-" : parsed === 0 ? "0" : `${parsed > 0 ? "+" : "-"}${formatAmount(Math.abs(parsed))}`; }
function formatSignedUsdt(value: string | number) { const parsed = number(value); return !Number.isFinite(parsed) ? "-" : Math.abs(parsed) < .01 ? "0.00" : `${parsed > 0 ? "+" : "-"}${formatUsdt(Math.abs(parsed))}`; }
function baseAsset(row: HedgingMonitorRow) { const target = String(row.target_symbol || "").split("/")[0]?.trim().toUpperCase(); if (target) return target; const symbol = String(row.symbol || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, ""); const quote = ["USDT", "USDC", "BUSD", "FDUSD", "USD"].find((item) => symbol.endsWith(item)); return quote ? symbol.slice(0, -quote.length) : symbol; }
function formatQuantity(value: string | number, row: HedgingMonitorRow) { const quantity = formatSigned(value); const asset = baseAsset(row); return quantity === "-" ? quantity : asset ? `${quantity} ${asset}` : quantity; }
function formatCoinQuantity(row: HedgingMonitorRow) { return formatQuantity(invert(row.net_quantity), row); }
function formatPositionQuantity(value: string | number, row: HedgingMonitorRow) { const parsed = number(value); if (!Number.isFinite(parsed)) return "-"; const asset = baseAsset(row); const valueText = formatAmount(Math.abs(parsed)); return asset ? `${valueText} ${asset}` : valueText; }
function markPrice(row: HedgingMonitorRow) { const live = Number(props.resolveMarkPrice(row)); if (Number.isFinite(live) && live > 0) return live; const quantity = Math.abs(number(row.net_quantity)); const notional = Math.abs(number(row.net_notional_usdt)); return Number.isFinite(quantity) && quantity > 0 && Number.isFinite(notional) ? notional / quantity : 0; }
function calculateNetExposureUsdt(row: HedgingMonitorRow) { return invert(row.net_quantity) * markPrice(row); }
function amountClass(value: string | number) { const parsed = number(value); return { "mm-hedging-monitor__amount": true, "is-negative": parsed < 0, "is-positive": parsed > 0 }; }
function actualClass(value: string | number, row: HedgingMonitorRow) { const target = number(row.target_hedge_quantity); const actual = number(row.actual_hedge_quantity); return { ...amountClass(value), "is-warning": Number.isFinite(target) && Number.isFinite(actual) && target !== actual }; }
function formatHedgeProgress(row: HedgingMonitorRow) { const actual = number(row.actual_hedge_quantity); const target = number(row.target_hedge_quantity); if (!Number.isFinite(actual) || !Number.isFinite(target) || target === 0) return "-"; const progress = (actual / target) * 100; return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Object.is(progress, -0) ? 0 : progress)}%`; }
function formatTime(value: string) { return props.formatDateTime(value); }
const AmountPair = defineComponent({ props: { coin: { type: String, required: true }, coinClass: { type: Object, required: true }, usdt: { type: String, required: true }, usdtClass: { type: Object, required: true } }, setup(p) { return () => h("div", { class: "mm-hedging-monitor__amount-pair" }, [h("strong", { class: p.coinClass }, p.coin), h("span", { class: p.usdtClass }, p.usdt)]); } });
onMounted(load);
defineExpose({ reload: load });
</script>

<style scoped>
.mm-hedging-monitor{display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;min-height:0;height:100%;border:1px solid var(--mm-color-line);border-radius:10px;background:var(--mm-color-panel)}
.mm-hedging-monitor__toolbar{display:grid;grid-template-columns:minmax(200px,260px) 170px 1fr;gap:8px;align-items:center;padding:8px 10px;border-bottom:1px solid var(--mm-color-line)}.mm-hedging-monitor__toolbar.has-agent-filter{grid-template-columns:200px minmax(180px,260px) 170px 1fr}.mm-hedging-monitor__toolbar.has-switch-filters{grid-template-columns:minmax(180px,240px) repeat(3,160px) 1fr}.mm-hedging-monitor__toolbar.has-agent-filter.has-switch-filters{grid-template-columns:180px minmax(170px,230px) repeat(3,160px) 1fr}
.mm-hedging-monitor__progress{color:var(--mm-color-text);font-variant-numeric:tabular-nums;font-weight:650;white-space:nowrap}
.mm-hedging-monitor__actions{display:flex;justify-content:flex-end;gap:7px}.mm-hedging-monitor__table-wrap{position:relative;display:flex;overflow:hidden;min-height:0}.mm-hedging-monitor__table-wrap>.mm-pro-table__state{position:absolute;inset:0;min-height:100%}.mm-hedging-monitor__table{display:flex;flex:1 1 auto;flex-direction:column;width:100%;height:100%;min-width:0;min-height:0;border:0;border-radius:0}.mm-hedging-monitor__table :deep(.mm-table__viewport),.mm-hedging-monitor__table :deep(.mm-table__scroll){flex:1 1 auto;min-height:0}.mm-hedging-monitor__table.is-empty :deep(.mm-table__body-table),.mm-hedging-monitor__table.is-empty :deep(.mm-table__body-table>tbody),.mm-hedging-monitor__table.is-empty :deep(.mm-table__body-table>tbody>tr),.mm-hedging-monitor__table.is-empty :deep(.mm-table__empty-cell){height:100%}.mm-hedging-monitor__table.is-empty :deep(.mm-table__empty-cell){vertical-align:middle}.mm-hedging-monitor__table :deep(th),.mm-hedging-monitor__table :deep(td){min-width:0;padding:8px 6px;font-size:11px}.mm-hedging-monitor__column-header{display:inline-flex;align-items:center;justify-content:center;gap:4px}.mm-hedging-monitor__help{display:inline-flex;align-items:center;justify-content:center;cursor:help;color:var(--mm-color-text-muted)}.mm-hedging-monitor__account{display:flex;align-items:center;gap:7px;min-width:0;line-height:1.2}.mm-hedging-monitor__account-copy,.mm-hedging-monitor__agent{display:grid;min-width:0;gap:2px;line-height:1.2}.mm-hedging-monitor__account strong,.mm-hedging-monitor__agent strong{overflow:hidden;color:var(--mm-color-text);font-size:11px;text-overflow:ellipsis;white-space:nowrap}.mm-hedging-monitor__account-copy span,.mm-hedging-monitor__agent span,.mm-hedging-monitor__time{display:block;overflow:hidden;color:var(--mm-color-text-muted);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.mm-hedging-monitor__time{font-size:var(--mm-font-size-sm)}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount){color:var(--mm-color-text-muted);font-variant-numeric:tabular-nums;font-weight:650}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount-pair){display:grid;justify-items:center;gap:2px;line-height:1.2;white-space:nowrap}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount-pair>strong){font-size:12px}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount-pair>span){font-size:11px;font-weight:550}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount.is-positive){color:var(--mm-color-success)}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount.is-negative){color:var(--mm-color-danger)}.mm-hedging-monitor :deep(.mm-hedging-monitor__amount.is-warning){color:var(--mm-color-warning)}.mm-hedging-monitor__footer{display:flex;align-items:center;justify-content:space-between;min-height:48px;padding:6px 12px;color:var(--mm-color-text-muted);font-size:12px}@media(max-width:960px){.mm-hedging-monitor__toolbar,.mm-hedging-monitor__toolbar.has-agent-filter,.mm-hedging-monitor__toolbar.has-switch-filters,.mm-hedging-monitor__toolbar.has-agent-filter.has-switch-filters{grid-template-columns:repeat(2,minmax(160px,1fr))}.mm-hedging-monitor__toolbar.has-switch-filters .mm-hedging-monitor__actions{grid-column:1/-1}}
</style>
