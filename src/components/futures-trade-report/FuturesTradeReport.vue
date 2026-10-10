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
import { formatTradeReportDecimal } from './formatters'
import type { FuturesTradeReportProps, FuturesTradeReportQuery, FuturesTradeReportRow } from './types'

defineOptions({ name: 'MmFuturesTradeReport', inheritAttrs: false })
const props = withDefaults(defineProps<FuturesTradeReportProps>(), { showSources: false, fillHeight: true })
const { messages } = useLocale()
const copy = computed(() => messages.value.futuresTradeReport)
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, defaultValue: 'day', width: 110,
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  { key: 'symbol', type: 'keyword', label: copy.value.symbol, placeholder: copy.value.allSymbols, defaultValue: '', width: 160, clearable: true },
  ...(props.showSources ? [
    { key: 'source_type', type: 'select' as const, label: copy.value.sourceType, defaultValue: '', width: 150,
      options: [{ label: copy.value.allSources, value: '' }, { label: copy.value.merchant, value: 'merchant' }, { label: copy.value.tenant, value: 'tenant' }, { label: copy.value.platform, value: 'platform' }] },
    { key: 'source_id', type: 'keyword' as const, label: copy.value.sourceId, placeholder: copy.value.sourceId, defaultValue: '', width: 140, clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange, defaultValue: null, width: 250 },
])
const metricKeys = ['trading_user_count', 'order_count', 'order_amount', 'filled_order_count', 'fill_count', 'trade_amount', 'cancel_order_count', 'cancel_amount', 'amount_fill_rate'] as const
const columns = computed<ProTableColumn<FuturesTradeReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 140, sortable: true, hideable: false },
  ...(props.showSources ? [
    { key: 'source_code', title: copy.value.sourceId, width: 130, sortable: true },
    { key: 'source_name', title: copy.value.sourceName, width: 160, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...metricKeys.map(key => ({ key, title: copy.value[key], width: key.endsWith('amount') ? 165 : 145, sortable: true,
    formatter: (value: unknown) => key === 'amount_fill_rate' ? `${formatTradeReportDecimal(value)}%` : formatTradeReportDecimal(value, key.endsWith('amount') ? 2 : 0) })),
  { key: 'stat_status', title: copy.value.status, width: 120, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<FuturesTradeReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, queryFields: fields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: FuturesTradeReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day', symbol: String(filters.symbol ?? '').trim().toUpperCase(),
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
    }
    if (props.showSources) { params.source_type = String(filters.source_type ?? ''); params.source_id = String(filters.source_id ?? '').trim() }
    try { return await props.request(params, { signal }) }
    catch (error) {
      const candidate = error as { msg?: string, message?: string }
      throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
    }
  },
})
watch(() => filters.value.period, () => query())
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight"
    row-key="id" columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date="{ column }">
      {{ column.title }} <MmTooltip :content="copy.utcHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #header-trading_user_count="{ column }">
      {{ column.title }} <MmTooltip :content="copy.usersHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'" size="sm" round>
        {{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}
      </MmTag>
    </template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="row.stat_status === 1 ? 'success' : 'warning'" size="sm" round>
        {{ row.stat_status === 1 ? copy.completed : row.stat_status === 2 ? copy.partial : copy.processing }}
      </MmTag>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>
