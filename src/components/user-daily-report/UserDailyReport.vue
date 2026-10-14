<script setup lang="ts">
import { computed, watch } from 'vue'
import { isCurrentReportPeriod } from '../../shared/report-date-status'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { MmIcon } from '../icon'
import { MmTooltip } from '../tooltip'
import { formatTradeReportDecimal } from '../futures-trade-report'
import type { UserDailyReportProps, UserDailyReportQuery, UserDailyReportRow } from './types'

defineOptions({ name: 'MmUserDailyReport', inheritAttrs: false })
const props = withDefaults(defineProps<UserDailyReportProps>(), {
  showSources: false, showSourceCode: true, sourceSearch: 'id', fillHeight: true,
})
const { messages } = useLocale()
const copy = computed(() => messages.value.userDailyReport)
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, defaultValue: 'day', width: 112,
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, defaultValue: 'platform', width: 180,
      options: [{ value: 'platform', label: copy.value.platform }, { value: 'tenant', label: copy.value.tenant }, { value: 'merchant', label: copy.value.merchant }] },
    { key: 'source_id', type: 'keyword' as const, label: copy.value.sourceId,
      placeholder: props.sourceSearch === 'name-or-id' ? copy.value.sourceSearchPlaceholder : copy.value.sourceId,
      defaultValue: '', width: props.sourceSearch === 'name-or-id' ? 200 : 140, clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange,
    defaultValue: null, width: 210 },
])
const metrics = [
  'initial_user_count', 'new_user_count', 'transfer_in_user_count', 'transfer_in_conversion_rate',
  'transfer_in_amount', 'transfer_out_user_count', 'transfer_out_amount', 'active_user_count',
  'active_rate', 'total_trading_user_count', 'trading_user_count', 'prediction_trading_user_count',
] as const
const money = new Set<string>(['transfer_in_amount', 'transfer_out_amount'])
const rate = new Set<string>(['transfer_in_conversion_rate', 'active_rate'])
const columns = computed<ProTableColumn<UserDailyReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 130, hideable: false, sortable: true },
  ...(props.showSources ? [
    ...(props.showSourceCode ? [{ key: 'source_code', title: copy.value.sourceId, width: 125, sortable: true }] : []),
    { key: 'source_name', title: copy.value.sourceName, width: 145, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  ...metrics.map(key => ({ key, title: copy.value[key], width: money.has(key) ? 145 : rate.has(key) ? 135 : 110,
    sortable: true, formatter: (value: unknown) => rate.has(key)
      ? `${formatTradeReportDecimal(value, 2)}%` : formatTradeReportDecimal(value, money.has(key) ? 2 : 0) })),
  { key: 'stat_status', title: copy.value.status, width: 110, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload } = useMmProTable<UserDailyReportRow>({
  initialAutoRefreshSeconds: 0, initialSort: { key: 'stat_date', order: 'desc' },
  initialPageSize: 20, queryFields: fields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: UserDailyReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day',
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize,
      order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
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
watch([() => filters.value.period, () => filters.value.source_type], () => query())
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-user-daily-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight"
    row-key="id" columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date="{ column }">
      {{ column.title }} <MmTooltip :content="copy.utcHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #header-source_type="{ column }">
      {{ column.title }} <MmTooltip :content="copy.scopeHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'"
        effect="outline" size="sm" round>{{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}</MmTag>
    </template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="isCurrentReportPeriod(row.stat_date) ? 'warning' : 'success'" effect="soft" size="sm" round>
        {{ isCurrentReportPeriod(row.stat_date) ? copy.processing : copy.completed }}
      </MmTag>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-user-daily-report { flex: 1 1 0%; width: 100%; min-width: 0; }
.mm-user-daily-report :deep(.mm-pro-table__auto-refresh) { display: none; }
</style>
