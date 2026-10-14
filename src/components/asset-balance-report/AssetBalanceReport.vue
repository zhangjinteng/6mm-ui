<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { isCurrentReportPeriod } from '../../shared/report-date-status'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import { MmTag } from '../tag'
import { MmIcon } from '../icon'
import { MmTooltip } from '../tooltip'
import type { AssetBalanceReportProps, AssetBalanceReportQuery, AssetBalanceReportRow } from './types'

defineOptions({ name: 'MmAssetBalanceReport', inheritAttrs: false })
const props = withDefaults(defineProps<AssetBalanceReportProps>(), { showSources: false, fillHeight: true })
const { messages } = useLocale()
const copy = computed(() => messages.value.assetBalanceReport)
const currencies = ref<string[]>([])
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, width: 110, defaultValue: 'day',
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  { key: 'currency', type: 'select', label: copy.value.currency, width: 150, defaultValue: '',
    options: [{ value: '', label: copy.value.allCurrencies }, ...currencies.value.map(value => ({ value, label: value }))] },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, width: 180, defaultValue: 'platform',
      options: [{ value: 'platform', label: copy.value.platform }, { value: 'tenant', label: copy.value.tenant }, { value: 'merchant', label: copy.value.merchant }] },
    { key: 'source_keyword', type: 'keyword' as const, label: copy.value.sourceName, width: 200,
      placeholder: copy.value.sourceSearchPlaceholder, defaultValue: '', clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange, width: 250, defaultValue: null },
])
const amounts = ['opening_total', 'closing_total', 'period_net_change', 'closing_available', 'closing_occupied'] as const
const money = (value: unknown) => value === null || value === undefined || value === '' ? '-' : formatTradeReportDecimal(value)
const columns = computed<ProTableColumn<AssetBalanceReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 125, sortable: true, hideable: false },
  ...(props.showSources ? [
    { key: 'source_name', title: copy.value.sourceName, width: 155, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 95, sortable: true },
  ] : []),
  { key: 'account_type', title: copy.value.accountType, width: 105, sortable: true },
  { key: 'currency', title: copy.value.currency, width: 95, sortable: true },
  { key: 'funded_user_count', title: copy.value.fundedUsers, width: 105, sortable: true,
    formatter: (value: unknown) => formatTradeReportDecimal(value, 0) },
  ...amounts.map(key => ({ key, title: copy.value[key], width: 140, sortable: true, formatter: money })),
  { key: 'stat_status', title: copy.value.status, width: 100, fixed: 'right' as const },
])
const { filters, proTableBindings, query, reload } = useMmProTable<AssetBalanceReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, initialAutoRefreshSeconds: 0, queryFields: fields,
  request: async ({ filters, page, pageSize, sort, signal }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: AssetBalanceReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day', currency: String(filters.currency ?? '').trim().toUpperCase(),
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''), page_no: page, page_size: pageSize,
      order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
    }
    if (props.showSources) { params.source_type = String(filters.source_type ?? 'platform'); params.source_keyword = String(filters.source_keyword ?? '').trim() }
    try {
      const result = await props.request(params, { signal })
      if (!signal.aborted && Array.isArray(result.currencies)) currencies.value = [...new Set(result.currencies.filter(Boolean))]
      return result
    } catch (error) {
      const value = error as { msg?: string; message?: string }
      throw new Error(value?.msg || value?.message || copy.value.loadFailed)
    }
  },
})
watch([() => filters.value.period, () => filters.value.source_type], () => query())
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-asset-balance-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight" :auto-refreshable="false"
    row-key="id" columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date>
      <MmTooltip :content="copy.utcHelp" placement="top">
        <span class="mm-asset-balance-report__date-header">{{ copy.statDate }} <MmIcon name="circle-help" :size="13" /></span>
      </MmTooltip>
    </template>
    <template #cell-source_type="{ row }">
      <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'" effect="outline" size="sm" round>
        {{ row.source_type === 'tenant' ? copy.tenant : row.source_type === 'merchant' ? copy.merchant : copy.platform }}
      </MmTag>
    </template>
    <template #cell-account_type="{ row }">
      <MmTag :type="row.account_type === 'funding' ? 'success' : 'info'" size="sm">
        {{ row.account_type === 'funding' ? copy.fundingAccount : copy.contractAccount }}
      </MmTag>
    </template>
    <template #cell-stat_status="{ row }">
      <MmTag :type="Number(row.stat_status) === 2 ? 'danger' : isCurrentReportPeriod(row.stat_date) ? 'warning' : 'success'" size="sm" round>
        {{ Number(row.stat_status) === 2 ? copy.partial : isCurrentReportPeriod(row.stat_date) ? copy.processing : copy.completed }}
      </MmTag>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-asset-balance-report { width: 100%; min-width: 0; flex: 1 1 0%; }
.mm-asset-balance-report__date-header { display: inline-flex; align-items: center; gap: 4px; }
</style>
