<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmIcon } from '../icon'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { MmTooltip } from '../tooltip'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import type { FuturesUserNetPnlReportProps, FuturesUserNetPnlReportQuery, FuturesUserNetPnlReportRow } from './types'

defineOptions({ name: 'MmFuturesUserNetPnlReport', inheritAttrs: false })
const props = withDefaults(defineProps<FuturesUserNetPnlReportProps>(), { showSources: false, fillHeight: true })
const { messages } = useLocale()
const copy = computed(() => messages.value.futuresUserNetPnlReport)
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, defaultValue: 'day', width: 110,
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, defaultValue: 'platform', width: 180,
      options: [{ value: 'platform', label: copy.value.platform }, { value: 'tenant', label: copy.value.tenant }, { value: 'merchant', label: copy.value.merchant }] },
    { key: 'source_keyword', type: 'keyword' as const, label: copy.value.sourceName, placeholder: copy.value.sourceSearchPlaceholder,
      defaultValue: '', width: 200, clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange, defaultValue: null, width: 250 },
])
const counts = ['settled_user_count', 'profitable_user_count', 'losing_user_count', 'breakeven_user_count', 'close_order_count'] as const
const amounts = ['close_amount', 'realized_pnl', 'trading_fee', 'funding_fee', 'liquidation_fee', 'true_net_pnl'] as const
const signed = new Set<string>(['realized_pnl', 'funding_fee', 'true_net_pnl'])
const columns = computed<ProTableColumn<FuturesUserNetPnlReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 140, sortable: true, hideable: false },
  ...(props.showSources ? [
    { key: 'source_name', title: copy.value.sourceName, width: 160, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...counts.map(key => ({ key, title: copy.value[key], width: 135, sortable: true,
    formatter: (value: unknown) => formatTradeReportDecimal(value, 0) })),
  ...amounts.map(key => ({ key, title: copy.value[key], width: 160, sortable: true,
    formatter: (value: unknown) => {
      const formatted = formatTradeReportDecimal(value)
      return signed.has(key) && formatted !== '-' && !formatted.startsWith('-') && formatted !== '0.00' ? `+${formatted}` : formatted
    } })),
  { key: 'stat_status', title: copy.value.status, width: 120, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<FuturesUserNetPnlReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, queryFields: fields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: FuturesUserNetPnlReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day',
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
    }
    if (props.showSources) {
      params.source_type = String(filters.source_type ?? 'platform')
      params.source_keyword = String(filters.source_keyword ?? '').trim()
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
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-futures-user-net-pnl-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight" row-key="id"
    columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date="{ column }">
      {{ column.title }} <MmTooltip :content="copy.utcHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #header-settled_user_count="{ column }">
      {{ column.title }} <MmTooltip :content="copy.usersHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'" size="sm" round>
        {{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}
      </MmTag>
    </template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="row.stat_status === 1 || row.stat_status === 'completed' ? 'success' : 'warning'" size="sm" round>
        {{ row.stat_status === 1 || row.stat_status === 'completed' ? copy.completed
          : row.stat_status === 2 || row.stat_status === 'partial' ? copy.partial : copy.processing }}
      </MmTag>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-futures-user-net-pnl-report { width: 100%; min-width: 0; flex: 1 1 0%; }
</style>
