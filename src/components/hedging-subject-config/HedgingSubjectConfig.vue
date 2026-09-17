<template>
  <section class="mm-hedging-subject-config">
    <div class="mm-hedging-subject-config__toolbar">
      <MmSelect v-model="draft.agentId" :options="agentOptions" placeholder="全部代理商" size="sm" />
      <MmSelect v-model="draft.enabled" :options="switchOptions" placeholder="对冲总开关：全部" size="sm" />
      <MmSelect v-model="draft.status" :options="statusOptions" placeholder="运行状态：全部" size="sm" />
      <div class="mm-hedging-subject-config__actions">
        <MmButton :loading="loading" size="sm" variant="primary" @click="search"><template #icon><MmIcon name="search" :size="13" /></template>查询</MmButton>
        <MmButton :disabled="loading" size="sm" @click="reset"><template #icon><MmIcon name="rotate-ccw" :size="13" /></template>重置</MmButton>
        <MmButton aria-label="刷新" :loading="loading" icon-only size="sm" @click="load"><template #icon><MmIcon name="refresh-cw" :size="14" /></template></MmButton>
      </div>
    </div>

    <div class="mm-hedging-subject-config__body mm-pro-table__body">
      <MmTable :columns="columns" :data="tableRows" empty-text="暂无主体配置" row-key="agent_id">
        <template #cell-source_type><MmTag effect="soft" round size="sm" type="primary">商户</MmTag></template>
        <template #cell-global_enabled="{ row }"><MmTag effect="soft" round size="sm" :type="row.global_enabled ? 'success' : 'info'">{{ row.global_enabled ? "已开启" : "已关闭" }}</MmTag></template>
        <template #cell-exchanges="{ row }"><AggregateValue kind="exchange" :row="row" /></template>
        <template #cell-accounts="{ row }"><AggregateValue kind="account" :row="row" /></template>
        <template #cell-connected_account_count="{ row }"><strong>{{ row.connected_account_count }}</strong></template>
        <template #cell-enabled_symbol_count="{ row }"><strong>{{ row.enabled_symbol_count }}</strong></template>
        <template #cell-status="{ row }"><MmTag effect="soft" round size="sm" :type="statusType(row.status)">{{ row.status_label }}</MmTag></template>
        <template #cell-updated_at="{ row }"><span class="mm-hedging-subject-config__time">{{ row.updated_at ? formatDateTime(row.updated_at) : "-" }}</span></template>
        <template #cell-operation="{ row }">
          <div class="row-actions drawer-entry">
            <MmButton
              class="action-drawer-trigger contract-row-action"
              icon-only
              size="sm"
              :aria-label="`查看${row.agent_name || row.agent_id}对冲详情`"
              title="查看对冲详情"
              @click.stop="emit('detail', row)"
            >
              <template #icon><MmIcon name="arrow-up-right" :size="15" /></template>
            </MmButton>
          </div>
        </template>
      </MmTable>
      <div v-if="loading" class="mm-pro-table__state" :class="{ 'is-overlay': rows.length > 0 }" role="status"><span class="mm-pro-table__state-icon is-loading"><MmIcon name="loader-circle" :size="24" spin /></span><strong>正在加载</strong></div>
    </div>

    <footer class="mm-hedging-subject-config__footer"><span>{{ rangeStart }}-{{ rangeEnd }} / {{ total }}</span><MmPagination v-if="total" v-model:current-page="page" v-model:page-size="pageSize" :disabled="loading" :page-sizes="[10, 20, 30, 50]" :total="total" show-size-changer size="sm" @current-change="load" @size-change="pageSizeChanged" /></footer>
  </section>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from "vue";
import MmButton from "../button/Button.vue";
import MmExchangeLogo from "../exchange-logo/ExchangeLogo.vue";
import MmIcon from "../icon/Icon.vue";
import MmPagination from "../pagination/Pagination.vue";
import MmSelect from "../select/Select.vue";
import MmTable from "../table/Table.vue";
import MmTag from "../tag/Tag.vue";
import MmTooltip from "../tooltip/Tooltip.vue";
import type { SelectOption } from "../select";
import type { TableColumn, TableRow } from "../table";
import type { HedgingSubjectConfigProps, HedgingSubjectConfigRow, HedgingSubjectStatus } from "./types";

const props = withDefaults(defineProps<HedgingSubjectConfigProps>(), { agentOptions: () => [], formatDateTime: (value: string) => value });
const emit = defineEmits<{ detail: [row: HedgingSubjectConfigRow] }>();
const rows = ref<HedgingSubjectConfigRow[]>([]), loading = ref(false), page = ref(1), pageSize = ref(20), total = ref(0);
const draft = reactive({ agentId: "", enabled: "", status: "" });
const filters = reactive({ ...draft });
type Row = HedgingSubjectConfigRow & TableRow;
const tableRows = computed(() => rows.value as Row[]);
const columns: TableColumn<Row>[] = [
  { key: "agent_id", dataIndex: "agent_id", title: "来源 ID", width: 100 },
  { key: "agent_name", dataIndex: "agent_name", title: "来源名称", width: 150 },
  { key: "source_type", title: "来源类型", width: 100 },
  { key: "global_enabled", dataIndex: "global_enabled", title: "对冲总开关", width: 120 },
  { key: "exchanges", dataIndex: "exchanges", title: "当前执行交易所", width: 160 },
  { key: "accounts", dataIndex: "accounts", title: "当前执行账户", width: 210 },
  { key: "connected_account_count", dataIndex: "connected_account_count", title: "已连接账户数", width: 125, align: "center" },
  { key: "enabled_symbol_count", dataIndex: "enabled_symbol_count", title: "已启用合约数", width: 125, align: "center" },
  { key: "status", dataIndex: "status", title: "运行状态", width: 110 },
  { key: "updated_at", dataIndex: "updated_at", title: "更新时间", width: 170 },
  { key: "operation", title: "操作", width: 76, align: "center", fixed: "right" },
];
const switchOptions: SelectOption[] = [{ label: "对冲总开关：全部", value: "" }, { label: "已开启", value: "1" }, { label: "已关闭", value: "0" }];
const statusOptions: SelectOption[] = [{ label: "运行状态：全部", value: "" }, { label: "运行中", value: "running" }, { label: "已停用", value: "disabled" }, { label: "待配置", value: "pending_config" }, { label: "账户异常", value: "account_abnormal" }];
const rangeStart = computed(() => total.value ? (page.value - 1) * pageSize.value + 1 : 0), rangeEnd = computed(() => Math.min(page.value * pageSize.value, total.value));

const AggregateValue = defineComponent({
  props: { kind: { type: String as () => "exchange" | "account", required: true }, row: { type: Object as () => HedgingSubjectConfigRow, required: true } },
  setup(componentProps) {
    return () => {
      const values = componentProps.kind === "exchange" ? componentProps.row.exchanges : componentProps.row.accounts;
      if (!values.length) return h("span", "-");
      const item = values[0] as string | { exchange: string; name: string };
      const renderItem = (value: typeof item) => h("span", { class: "mm-hedging-subject-config__aggregate-item" }, [
        h(MmExchangeLogo, { name: typeof value === "string" ? value : value.exchange, size: 20 }),
        h("strong", typeof value === "string" ? value : value.exchange),
        ...(typeof value === "string" ? [] : [h("span", "/"), h("span", value.name)]),
      ]);
      if (values.length === 1) return renderItem(item);
      return h(MmTooltip, { placement: "top" }, {
        default: () => h("button", { class: "mm-hedging-subject-config__count", type: "button" }, `${values.length}个`),
        content: () => h("span", { class: "mm-hedging-subject-config__tooltip-list" }, values.map((value) => renderItem(value as typeof item))),
      });
    };
  },
});

function statusType(status: HedgingSubjectStatus) { return status === "running" ? "success" : status === "disabled" ? "info" : "warning"; }
async function load() { loading.value = true; try { const result = await props.request({ page: page.value, page_size: pageSize.value, agent_id: filters.agentId || undefined, enabled: (filters.enabled || undefined) as "0" | "1" | undefined, status: (filters.status || undefined) as HedgingSubjectStatus | undefined }); rows.value = result.lists || []; total.value = Number(result.count || 0); } finally { loading.value = false; } }
function search() { Object.assign(filters, draft); page.value = 1; load(); }
function reset() { Object.assign(draft, { agentId: "", enabled: "", status: "" }); search(); }
function pageSizeChanged() { page.value = 1; load(); }
onMounted(load);
defineExpose({ refresh: load });
</script>

<style>
.mm-hedging-subject-config{display:flex;flex-direction:column;height:100%;min-height:460px;background:var(--mm-color-panel,#fff);border:1px solid var(--mm-color-border,#e5e7eb);border-radius:10px;overflow:hidden}.mm-hedging-subject-config__toolbar{display:flex;gap:8px;align-items:center;padding:10px;border-bottom:1px solid var(--mm-color-border,#e5e7eb)}.mm-hedging-subject-config__toolbar>.mm-select{width:190px}.mm-hedging-subject-config__actions{display:flex;gap:6px;margin-left:auto}.mm-hedging-subject-config__body{position:relative;flex:1;min-height:0;overflow:auto}.mm-hedging-subject-config__footer{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-top:1px solid var(--mm-color-border,#e5e7eb);color:var(--mm-color-text-secondary,#64748b);font-size:12px}.mm-hedging-subject-config__aggregate-item{display:inline-flex;align-items:center;gap:5px;white-space:nowrap}.mm-hedging-subject-config__count{border:0;background:var(--mm-color-primary-soft,#eaf3ff);color:var(--mm-color-primary,#1677ff);border-radius:999px;padding:3px 9px;font:inherit;font-weight:600;cursor:help}.mm-hedging-subject-config__tooltip-list{display:grid;gap:7px;min-width:130px}.mm-hedging-subject-config__time{font-size:var(--mm-font-size-sm)}.mm-hedging-subject-config .row-actions{display:flex;align-items:center;justify-content:center}.mm-hedging-subject-config .contract-row-action{box-shadow:none}
</style>
