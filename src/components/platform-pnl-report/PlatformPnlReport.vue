<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { MmTooltip } from '../tooltip'
import { MmIcon } from '../icon'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import type { PlatformPnlReportProps, PlatformPnlReportQuery, PlatformPnlReportRow } from './types'

defineOptions({ name: 'MmPlatformPnlReport', inheritAttrs: false })
const props = withDefaults(defineProps<PlatformPnlReportProps>(), { showSources: false, fillHeight: true })
const { messages } = useLocale()
const copy = computed(() => messages.value.platformPnlReport)
const amounts = [
  'contract_trade_pnl', 'contract_trading_fee_income', 'contract_liquidation_fee_income',
  'platform_funding_fee_net', 'contract_total_pnl', 'prediction_business_pnl', 'total_pnl',
] as const
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, defaultValue: 'day', width: 110,
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, defaultValue: 'platform', width: 180,
      options: [{ value: 'platform', label: copy.value.platform }, { value: 'tenant', label: copy.value.tenant }, { value: 'merchant', label: copy.value.merchant }] },
    { key: 'source_keyword', type: 'keyword' as const, label: copy.value.sourceName,
      placeholder: copy.value.sourceSearchPlaceholder, defaultValue: '', width: 200, clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange,
    placeholder: copy.value.dateRange, defaultValue: null, width: 220 },
])
const columns = computed<ProTableColumn<PlatformPnlReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 135, sortable: true, hideable: false },
  ...(props.showSources ? [
    { key: 'source_name', title: copy.value.sourceName, width: 155, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...amounts.map(key => ({ key, title: copy.value[key], width: 165, sortable: true,
    formatter: (value: unknown) => {
      const formatted = formatTradeReportDecimal(value)
      return formatted !== '-' && formatted !== '0.00' && !formatted.startsWith('-') ? `+${formatted}` : formatted
    } })),
  { key: 'stat_status', title: copy.value.status, width: 112, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<PlatformPnlReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, queryFields: fields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: PlatformPnlReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day',
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize,
      order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
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
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-platform-pnl-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight" row-key="id"
    columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date="{ column }">
      {{ column.title }} <MmTooltip :content="copy.utcHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template v-for="key in amounts" #[`cell-${key}`]="{ row }">
      <span :class="{ 'mm-platform-pnl-report__positive': Number(row[key]) > 0,
        'mm-platform-pnl-report__negative': Number(row[key]) < 0 }">
        {{ Number(row[key]) > 0 ? '+' : '' }}{{ formatTradeReportDecimal(row[key]) }}
      </span>
    </template>
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'"
        size="sm" round>{{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}</MmTag>
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
.mm-platform-pnl-report { width: 100%; min-width: 0; flex: 1 1 0%; }
.mm-platform-pnl-report__positive { color: var(--mm-color-success, #008557); }
.mm-platform-pnl-report__negative { color: var(--mm-color-danger, #d93025); }
</style>
