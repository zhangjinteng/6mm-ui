<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import type { FuturesPnlReportProps, FuturesPnlReportQuery, FuturesPnlReportRow } from './types'

defineOptions({ name: 'MmFuturesPnlReport', inheritAttrs: false })
const props = withDefaults(defineProps<FuturesPnlReportProps>(), { showSources: false, showSourceCode: true, sourceSearch: 'id', fillHeight: true })
const { messages } = useLocale()
const copy = computed(() => messages.value.futuresPnlReport)
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, defaultValue: 'day', width: 110,
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  { key: 'symbol', type: 'keyword', label: copy.value.symbol, placeholder: copy.value.allSymbols, defaultValue: '', width: 160, clearable: true },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, defaultValue: 'platform', width: 180,
      options: [{ label: copy.value.platform, value: 'platform' }, { label: copy.value.tenant, value: 'tenant' }, { label: copy.value.merchant, value: 'merchant' }] },
    { key: 'source_id', type: 'keyword' as const, label: copy.value.sourceId,
      placeholder: props.sourceSearch === 'name-or-id' ? copy.value.sourceSearchPlaceholder : copy.value.sourceId,
      defaultValue: '', width: props.sourceSearch === 'name-or-id' ? 200 : 140, clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange, defaultValue: null, width: 250 },
])
const countKeys = ['trading_user_count', 'profitable_user_count', 'losing_user_count'] as const
const amountKeys = ['trade_amount', 'profit_amount', 'loss_amount', 'net_pnl'] as const
const columns = computed<ProTableColumn<FuturesPnlReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 140, sortable: true, hideable: false },
  ...(props.showSources ? [
    ...(props.showSourceCode ? [{ key: 'source_code', title: copy.value.sourceId, width: 130, sortable: true }] : []),
    { key: 'source_name', title: copy.value.sourceName, width: 160, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...countKeys.map(key => ({ key, title: copy.value[key], width: 145, sortable: true,
    formatter: (value: unknown) => formatTradeReportDecimal(value, 0) })),
  ...amountKeys.map(key => ({ key, title: copy.value[key], width: 160, sortable: true,
    formatter: (value: unknown) => {
      const formatted = formatTradeReportDecimal(value)
      return key === 'net_pnl' && Number(value) > 0 ? `+${formatted}` : formatted
    } })),
  { key: 'stat_status', title: copy.value.status, width: 120, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<FuturesPnlReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, queryFields: fields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: FuturesPnlReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day', symbol: String(filters.symbol ?? '').trim().toUpperCase(),
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
    }
    if (props.showSources) {
      params.source_type = String(filters.source_type ?? '')
      const source = String(filters.source_id ?? '').trim()
      if (props.sourceSearch === 'name-or-id') params.source_keyword = source
      else params.source_id = source
    }
    try { return await props.request(params, { signal }) }
    catch (error) {
      const candidate = error as { msg?: string, message?: string }
      throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
    }
  },
})
watch([() => filters.value.period, () => filters.value.source_type], () => query())
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-futures-pnl-report" :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight"
    row-key="id" columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'" size="sm" round>
        {{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}
      </MmTag>
    </template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="row.stat_status === 1 ? 'success' : 'warning'" size="sm" round>
        {{ row.stat_status === 1 ? copy.completed : copy.processing }}
      </MmTag>
    </template>
    <template #cell-profit_amount="{ row }"><span class="mm-futures-pnl-report__positive">{{ formatTradeReportDecimal(row.profit_amount) }}</span></template>
    <template #cell-loss_amount="{ row }"><span class="mm-futures-pnl-report__negative">{{ formatTradeReportDecimal(row.loss_amount) }}</span></template>
    <template #cell-net_pnl="{ row }">
      <span :class="Number(row.net_pnl) > 0 ? 'mm-futures-pnl-report__positive' : Number(row.net_pnl) < 0 ? 'mm-futures-pnl-report__negative' : ''">
        {{ Number(row.net_pnl) > 0 ? '+' : '' }}{{ formatTradeReportDecimal(row.net_pnl) }}
      </span>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-futures-pnl-report {
  width: 100%;
  min-width: 0;
  flex: 1 1 0%;
}
.mm-futures-pnl-report__positive { color: #008769; }
.mm-futures-pnl-report__negative { color: #e34444; }
</style>
