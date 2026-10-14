<script setup lang="ts">
import { computed, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import { isCurrentReportPeriod } from '../../shared/report-date-status'
import type { PlatformTradeSummaryProps, PlatformTradeSummaryQuery, PlatformTradeSummaryRow } from './types'

defineOptions({ name: 'MmPlatformTradeSummaryReport', inheritAttrs: false })
const props = withDefaults(defineProps<PlatformTradeSummaryProps>(), { showSources: false, fillHeight: true })
const { messages } = useLocale()
const copy = computed(() => messages.value.platformTradeSummaryReport)
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, width: 110, defaultValue: 'day',
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, width: 180, defaultValue: 'platform',
      options: [{ value: 'platform', label: copy.value.platform }, { value: 'tenant', label: copy.value.tenant }, { value: 'merchant', label: copy.value.merchant }] },
    { key: 'source_keyword', type: 'keyword' as const, label: copy.value.sourceName, width: 200,
      placeholder: copy.value.sourceSearchPlaceholder, defaultValue: '', clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange, width: 250, defaultValue: null },
])
const metrics = ['total_trading_user_count', 'trading_user_count', 'contract_trade_count', 'contract_trade_amount',
  'prediction_trading_user_count', 'prediction_valid_order_count', 'prediction_valid_stake_amount'] as const
const columns = computed<ProTableColumn<PlatformTradeSummaryRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 125, sortable: true, hideable: false },
  ...(props.showSources ? [
    { key: 'source_name', title: copy.value.sourceName, width: 155, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...metrics.map(key => ({ key, title: copy.value[key], width: key.endsWith('amount') ? 155 : 130, sortable: true,
    formatter: (value: unknown) => formatTradeReportDecimal(value, key.endsWith('amount') ? 2 : 0) })),
  { key: 'stat_status', title: copy.value.status, width: 100, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<PlatformTradeSummaryRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, initialAutoRefreshSeconds: 0, queryFields: fields,
  request: async ({ filters, page, pageSize, sort, signal }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: PlatformTradeSummaryQuery = {
      period: filters.period === 'month' ? 'month' : 'day', start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
    }
    if (props.showSources) { params.source_type = String(filters.source_type ?? 'platform'); params.source_keyword = String(filters.source_keyword ?? '').trim() }
    try { return await props.request(params, { signal }) }
    catch (error) { const value = error as { msg?: string, message?: string }; throw new Error(value?.msg || value?.message || copy.value.loadFailed) }
  },
})
watch([() => filters.value.period, () => filters.value.source_type], () => query())
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-platform-trade-summary-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight" :auto-refreshable="false"
    row-key="id" columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'" effect="outline" size="sm" round>
        {{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}
      </MmTag>
    </template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="isCurrentReportPeriod(row.stat_date) ? 'warning' : 'success'" size="sm" round>
        {{ isCurrentReportPeriod(row.stat_date) ? copy.processing : copy.completed }}
      </MmTag>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-platform-trade-summary-report { width: 100%; min-width: 0; flex: 1 1 0%; }
</style>
