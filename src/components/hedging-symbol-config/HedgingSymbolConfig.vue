<template>
  <section class="mm-hedging-symbol-config">
    <div v-if="$slots['table-header']" class="mm-hedging-symbol-config__table-header">
      <slot name="table-header" />
    </div>
    <div class="mm-hedging-symbol-config__toolbar">
      <MmInput v-model="draft.keyword" clearable :placeholder="text.search" size="sm" @keydown.enter="search"><template #prefix><MmIcon name="search" :size="13" /></template></MmInput>
      <MmSelect v-if="showAgent" v-model="draft.agentId" :options="agentOptions" :placeholder="text.allAgents" size="sm" />
      <MmSelect v-model="draft.exchange" :options="exchangeOptions" :placeholder="text.allExchanges" size="sm" />
      <MmSelect v-model="draft.accountId" :options="accountOptions" :placeholder="text.allAccounts" size="sm" />
      <MmSelect v-model="draft.hedgeUnit" :options="unitOptions" :placeholder="text.allUnits" size="sm" />
      <MmSelect v-model="draft.enabled" :options="statusOptions" :placeholder="text.allStatuses" size="sm" />
      <div class="mm-hedging-symbol-config__actions">
        <MmButton :loading="loading" size="sm" variant="primary" @click="search"><template #icon><MmIcon name="search" :size="13" /></template>{{ text.query }}</MmButton>
        <MmButton :disabled="loading" size="sm" @click="reset"><template #icon><MmIcon name="rotate-ccw" :size="13" /></template>{{ text.reset }}</MmButton>
        <MmButton :aria-label="text.loading" :loading="loading" icon-only size="sm" @click="load"><template #icon><MmIcon name="refresh-cw" :size="14" /></template></MmButton>
      </div>
    </div>
    <div class="mm-hedging-symbol-config__body mm-pro-table__body">
      <MmTable :columns="columns" :data="tableRows" :empty-text="text.noData" row-key="config_id">
        <template #header-hedge_unit><HelpHeader :label="text.hedgeUnit" tip="对冲触发数值的参考单位" /></template>
        <template #header-target_hedge_ratio><HelpHeader :label="text.targetRatio" tip="净敞口 (币/U) × 目标对冲比例 = 目标对冲量 (币/U)" /></template>
        <template #header-first_trigger><HelpHeader :label="text.firstTrigger" tip="净敞口 (币/U) 达到该数值后，触发首次对冲" /></template>
        <template #header-rebalance><HelpHeader :label="text.rebalance" tip="目标对冲量与已对冲量差值达到该数值后，触发再平衡对冲" /></template>
        <template #header-exit><HelpHeader :label="text.exit" tip="净敞口 (币/U) 小于该数值后，退出对冲" /></template>
        <template #header-max_slippage_percent><HelpHeader :label="text.slippage" tip="允许实际成交价格与当前参考价格之间的最大价差比例" /></template>
        <template #cell-symbol="{ row }"><slot name="symbol" :row="row"><strong>{{ row.symbol }}</strong></slot></template>
        <template #cell-agent_name="{ row }"><span>{{ row.agent_name || row.agent_id || "-" }}</span></template>
        <template #cell-exchange="{ row }"><span class="mm-hedging-symbol-config__exchange"><MmExchangeLogo v-if="row.exchange" :name="row.exchange" :size="20" /><strong>{{ row.exchange || "-" }}</strong></span></template>
        <template #cell-account_name="{ row }"><span>{{ row.account_name || "-" }}</span></template>
        <template #cell-hedge_unit="{ row }"><MmTag effect="soft" round size="sm" :type="row.hedge_unit === 'base' ? 'success' : 'info'">{{ row.hedge_unit === "base" ? text.unitBase : text.unitUsdt }}</MmTag></template>
        <template #cell-target_hedge_ratio="{ row }"><strong>{{ format(row.target_hedge_ratio) }}%</strong></template>
        <template #cell-first_trigger="{ row }"><strong>{{ threshold(row, "first") }}</strong></template>
        <template #cell-rebalance="{ row }"><strong>{{ threshold(row, "rebalance") }}</strong></template>
        <template #cell-exit="{ row }"><strong>{{ threshold(row, "exit") }}</strong></template>
        <template #cell-max_slippage_percent="{ row }"><strong>{{ format(row.max_slippage_percent) }}%</strong></template>
        <template #cell-enabled="{ row }"><MmTag effect="soft" round size="sm" :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? text.enabled : text.disabled }}</MmTag></template>
      </MmTable>
      <div v-if="loading" class="mm-pro-table__state" :class="{ 'is-overlay': rows.length > 0 }" role="status"><span class="mm-pro-table__state-icon is-loading"><MmIcon name="loader-circle" :size="24" spin /></span><strong>{{ text.loading }}</strong></div>
    </div>
    <footer class="mm-hedging-symbol-config__footer"><span>{{ rangeStart }}-{{ rangeEnd }} / {{ total }}</span><MmPagination v-if="total" v-model:current-page="page" v-model:page-size="pageSize" :disabled="loading" :page-sizes="[10, 20, 30, 50]" :total="total" show-size-changer size="sm" @current-change="load" @size-change="pageSizeChanged" /></footer>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref, watch } from "vue";
import MmButton from "../button/Button.vue";
import MmExchangeLogo from "../exchange-logo/ExchangeLogo.vue";
import MmIcon from "../icon/Icon.vue";
import MmInput from "../input/Input.vue";
import MmPagination from "../pagination/Pagination.vue";
import MmSelect from "../select/Select.vue";
import MmTable from "../table/Table.vue";
import MmTag from "../tag/Tag.vue";
import MmTooltip from "../tooltip/Tooltip.vue";
import type { SelectOption } from "../select";
import type { TableColumn, TableRow } from "../table";
import type { HedgingSymbolConfigLabels, HedgingSymbolConfigProps, HedgingSymbolConfigRow } from "./types";

const defaults: HedgingSymbolConfigLabels = { account: "对冲账户", agent: "代理商", allAccounts: "全部账户", allAgents: "全部代理商", allExchanges: "全部交易所", allStatuses: "全部状态", allUnits: "全部对冲单位", enabled: "已启用", disabled: "已停用", exchange: "交易所", exit: "退出对冲阈值", firstTrigger: "首次触发阈值", hedgeUnit: "对冲单位", loading: "正在加载", noData: "暂无已配置数据", query: "查询", rebalance: "再平衡阈值", reset: "重置", search: "搜索合约或账户", slippage: "允许滑点 (%)", status: "对冲状态", symbol: "合约", targetRatio: "目标对冲比例 (%)", unitBase: "按币", unitUsdt: "按 U" };
const props = withDefaults(defineProps<HedgingSymbolConfigProps>(), { agentOptions: () => [], initialAgentId: "", labels: () => ({}), showAgent: false });
const text = computed(() => ({ ...defaults, ...props.labels }));
const rows = ref<HedgingSymbolConfigRow[]>([]);
const accounts = ref<{ id: number; name: string; exchange: string }[]>([]);
const exchanges = ref<string[]>([]);
const loading = ref(false), page = ref(1), pageSize = ref(20), total = ref(0);
const draft = reactive({ accountId: "", agentId: String(props.initialAgentId || ""), enabled: "", exchange: "", hedgeUnit: "", keyword: "" });
const filters = reactive({ ...draft });
type Row = HedgingSymbolConfigRow & TableRow;
const tableRows = computed(() => rows.value as Row[]);
const columns = computed<TableColumn<Row>[]>(() => [{ key: "symbol", dataIndex: "symbol", title: text.value.symbol, width: 150 }, ...(props.showAgent ? [{ key: "agent_name", dataIndex: "agent_name", title: text.value.agent, width: 160 } as TableColumn<Row>] : []), { key: "exchange", dataIndex: "exchange", title: text.value.exchange, width: 130 }, { key: "account_name", dataIndex: "account_name", title: text.value.account, width: 170 }, { key: "hedge_unit", dataIndex: "hedge_unit", title: text.value.hedgeUnit, width: 110, align: "center" }, { key: "target_hedge_ratio", dataIndex: "target_hedge_ratio", title: text.value.targetRatio, width: 155, align: "center" }, { key: "first_trigger", title: text.value.firstTrigger, width: 150, align: "center" }, { key: "rebalance", title: text.value.rebalance, width: 150, align: "center" }, { key: "exit", title: text.value.exit, width: 150, align: "center" }, { key: "max_slippage_percent", dataIndex: "max_slippage_percent", title: text.value.slippage, width: 135, align: "center" }, { key: "enabled", dataIndex: "enabled", title: text.value.status, width: 110, align: "center" }]);
const accountOptions = computed<SelectOption[]>(() => [{ label: text.value.allAccounts, value: "" }, ...accounts.value.filter((item) => !draft.exchange || item.exchange === draft.exchange).map((item) => ({ label: `${item.exchange} / ${item.name}`, value: String(item.id) }))]);
const exchangeOptions = computed<SelectOption[]>(() => [{ label: text.value.allExchanges, value: "" }, ...exchanges.value.map((value) => ({ label: value, value }))]);
const unitOptions = computed<SelectOption[]>(() => [{ label: text.value.allUnits, value: "" }, { label: text.value.unitBase, value: "base" }, { label: text.value.unitUsdt, value: "usdt" }]);
const statusOptions = computed<SelectOption[]>(() => [{ label: text.value.allStatuses, value: "" }, { label: text.value.enabled, value: "1" }, { label: text.value.disabled, value: "0" }]);
const rangeStart = computed(() => total.value ? (page.value - 1) * pageSize.value + 1 : 0), rangeEnd = computed(() => Math.min(page.value * pageSize.value, total.value));
const HelpHeader = defineComponent({ props: { label: { type: String, required: true }, tip: { type: String, required: true } }, setup(p) { return () => h("span", { class: "mm-hedging-symbol-config__header" }, [p.label, h(MmTooltip, { content: p.tip, placement: "top" }, { default: () => h("span", { class: "mm-hedging-symbol-config__help", tabindex: 0 }, [h(MmIcon, { name: "circle-help", size: 14 })]) })]); } });
function format(value: number) { return Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 8 }); }
function threshold(row: HedgingSymbolConfigRow, kind: "first" | "rebalance" | "exit") { const suffix = row.hedge_unit === "base" ? row.symbol.replace(/USDT$/i, "") : "U"; const prefix = kind === "first" ? "first_trigger" : kind; const key = `${prefix}_${row.hedge_unit === "base" ? "quantity" : "usdt"}` as keyof HedgingSymbolConfigRow; return `${format(Number(row[key] || 0))} ${suffix}`; }
async function load() { loading.value = true; try { const result = await props.request({ page: page.value, page_size: pageSize.value, keyword: filters.keyword || undefined, agent_id: filters.agentId || undefined, exchange: filters.exchange || undefined, account_id: filters.accountId || undefined, hedge_unit: (filters.hedgeUnit || undefined) as "base" | "usdt" | undefined, enabled: (filters.enabled || undefined) as "0" | "1" | undefined }); rows.value = result.lists || []; total.value = Number(result.count || 0); accounts.value = result.options?.accounts || []; exchanges.value = result.options?.exchanges || []; } finally { loading.value = false; } }
function search() { Object.assign(filters, draft); page.value = 1; load(); }
function reset() { Object.assign(draft, { accountId: "", agentId: "", enabled: "", exchange: "", hedgeUnit: "", keyword: "" }); search(); }
function pageSizeChanged() { page.value = 1; load(); }
watch(() => draft.exchange, () => { if (draft.accountId && !accountOptions.value.some((item) => String(item.value) === draft.accountId)) draft.accountId = ""; });
watch(() => draft.agentId, () => { draft.accountId = ""; });
onMounted(load);
defineExpose({ refresh: load });
</script>

<style>
.mm-hedging-symbol-config{display:flex;flex-direction:column;height:100%;min-height:460px;background:var(--mm-color-panel,#fff);border:1px solid var(--mm-color-border,#e5e7eb);border-radius:10px;overflow:hidden}.mm-hedging-symbol-config__table-header{flex:0 0 auto;border-bottom:1px solid var(--mm-color-border,#e5e7eb)}.mm-hedging-symbol-config__toolbar{display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid var(--mm-color-border,#e5e7eb)}.mm-hedging-symbol-config__toolbar>.mm-input{width:220px}.mm-hedging-symbol-config__toolbar>.mm-select{width:160px}.mm-hedging-symbol-config__actions{display:flex;gap:6px;margin-left:auto}.mm-hedging-symbol-config__body{position:relative;flex:1;min-height:0;overflow:auto}.mm-hedging-symbol-config__footer{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-top:1px solid var(--mm-color-border,#e5e7eb);color:var(--mm-color-text-secondary,#64748b);font-size:12px}.mm-hedging-symbol-config__header,.mm-hedging-symbol-config__exchange{display:inline-flex;align-items:center;gap:5px}.mm-hedging-symbol-config__help{display:inline-flex;color:var(--mm-color-text-secondary,#64748b);cursor:help}
</style>
