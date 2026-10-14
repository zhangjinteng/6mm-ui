<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmIcon } from '../icon'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { MmTooltip } from '../tooltip'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import type { PredictionUserPnlReportProps, PredictionUserPnlReportQuery, PredictionUserPnlReportRow } from './types'

defineOptions({ name: 'MmPredictionUserPnlReport', inheritAttrs: false })
const props = withDefaults(defineProps<PredictionUserPnlReportProps>(), {
  showSources: false, showSourceCode: false, sourceSearch: 'id', fillHeight: true,
})
const { messages } = useLocale()
const copy = computed(() => messages.value.predictionUserPnlReport)
const symbols = ref<string[]>([])
const fields = computed<QueryBarField[]>(() => [
  { key: 'play_type', type: 'select', label: copy.value.playType, defaultValue: 'all', width: 160,
    options: [
      { label: copy.value.allPlays, value: 'all' }, { label: copy.value.grid, value: 'grid' },
      { label: copy.value.highLow, value: 'high_low' }, { label: copy.value.upDown, value: 'up_down' },
    ] },
  { key: 'symbol', type: 'select', label: copy.value.symbol, defaultValue: '', width: 160,
    options: [{ label: copy.value.allSymbols, value: '' }, ...symbols.value.map(symbol => ({ label: symbol, value: symbol }))] },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, defaultValue: 'platform', width: 180,
      options: [{ label: copy.value.platform, value: 'platform' }, { label: copy.value.tenant, value: 'tenant' }, { label: copy.value.merchant, value: 'merchant' }] },
    { key: 'source_id', type: 'keyword' as const, label: copy.value.sourceId, defaultValue: '', width: 200, clearable: true,
      placeholder: props.sourceSearch === 'name-or-id' ? copy.value.sourceSearchPlaceholder : copy.value.sourceId },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange,
    defaultValue: null, width: 250 },
])
const countKeys = ['trading_user_count', 'profitable_user_count', 'losing_user_count', 'breakeven_user_count',
  'order_count', 'win_order_count', 'lose_order_count', 'refund_order_count'] as const
const amountKeys = ['stake_amount', 'return_amount', 'user_net_pnl', 'platform_pnl', 'payout_rate'] as const
const columns = computed<ProTableColumn<PredictionUserPnlReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 135, sortable: true, hideable: false },
  ...(props.showSources ? [
    ...(props.showSourceCode ? [{ key: 'source_code', title: copy.value.sourceId, width: 130, sortable: true }] : []),
    { key: 'source_name', title: copy.value.sourceName, width: 150, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...countKeys.map(key => ({ key, title: copy.value[key], width: 130, sortable: true,
    formatter: (value: unknown) => formatTradeReportDecimal(value, 0) })),
  ...amountKeys.map(key => ({ key, title: copy.value[key], width: 155, sortable: true,
    formatter: (value: unknown) => key === 'payout_rate' ? `${formatTradeReportDecimal(value)}%` : formatTradeReportDecimal(value) })),
  { key: 'stat_status', title: copy.value.status, width: 115, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<PredictionUserPnlReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, queryFields: fields, initialAutoRefreshSeconds: 0,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: PredictionUserPnlReportQuery = {
      play_type: String(filters.play_type || 'all'), symbol: String(filters.symbol ?? '').trim().toUpperCase(),
      start_date: String(range[0] ?? '').slice(0, 10), end_date: String(range[1] ?? '').slice(0, 10),
      page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date',
      order_dir: sort.order === 'asc' ? 'asc' : 'desc',
    }
    if (props.showSources) {
      params.source_type = String(filters.source_type ?? 'platform')
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
watch(() => filters.value.source_type, () => { if (props.showSources) query() })
onMounted(async () => {
  if (!props.loadSymbols) return
  try { symbols.value = (await props.loadSymbols()).map(String) }
  catch { symbols.value = [] }
})
const signed = (value: unknown): string => {
  const text = formatTradeReportDecimal(value)
  return Number(value) > 0 ? `+${text}` : text
}
const pnlClass = (value: unknown) => ({ 'is-positive': Number(value) > 0, 'is-negative': Number(value) < 0 })
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-prediction-user-pnl-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight" row-key="id"
    columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date="{ column }">
      {{ column.title }} <MmTooltip :content="copy.utcHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'" size="sm" round>
        {{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}
      </MmTag>
    </template>
    <template #cell-user_net_pnl="{ row }"><span :class="pnlClass(row.user_net_pnl)">{{ signed(row.user_net_pnl) }}</span></template>
    <template #cell-platform_pnl="{ row }"><span :class="pnlClass(row.platform_pnl)">{{ signed(row.platform_pnl) }}</span></template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="row.stat_status === 1 ? 'success' : 'warning'" size="sm" round>
        {{ row.stat_status === 1 ? copy.completed : row.stat_status === 2 ? copy.partial : copy.processing }}
      </MmTag>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-prediction-user-pnl-report { width: 100%; min-width: 0; flex: 1 1 0%; }
.is-positive { color: var(--mm-color-success, #00875a); font-variant-numeric: tabular-nums; }
.is-negative { color: var(--mm-color-danger, #e03535); font-variant-numeric: tabular-nums; }
</style>
