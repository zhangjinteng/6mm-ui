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
import { formatTradeReportDecimal } from '../futures-trade-report'
import type { FuturesFundingFeeReportProps, FuturesFundingFeeReportQuery, FuturesFundingFeeReportRow } from './types'

defineOptions({ name: 'MmFuturesFundingFeeReport', inheritAttrs: false })
const props = withDefaults(defineProps<FuturesFundingFeeReportProps>(), {
  showSources: false, showSourceCode: true, showSymbolWhenFiltered: false, sourceSearch: 'id', fillHeight: true,
})
const { messages } = useLocale()
const copy = computed(() => messages.value.futuresFundingFeeReport)
const fields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: copy.value.period, defaultValue: 'day', width: 110,
    options: [{ value: 'day', label: copy.value.day }, { value: 'month', label: copy.value.month }] },
  { key: 'symbol', type: 'keyword', label: copy.value.symbol, placeholder: copy.value.allSymbols, defaultValue: '', width: 160, clearable: true },
  ...(props.showSources ? [
    { key: 'source_type', type: 'segmented' as const, label: copy.value.sourceType, defaultValue: 'platform', width: 180,
      options: [{ value: 'platform', label: copy.value.platform }, { value: 'tenant', label: copy.value.tenant }, { value: 'merchant', label: copy.value.merchant }] },
    { key: 'source_id', type: 'keyword' as const, label: copy.value.sourceId,
      placeholder: props.sourceSearch === 'name-or-id' ? copy.value.sourceSearchPlaceholder : copy.value.sourceId,
      defaultValue: '', width: props.sourceSearch === 'name-or-id' ? 200 : 140, clearable: true },
  ] : []),
  { key: 'date_range', type: 'date-range', label: copy.value.dateRange, placeholder: copy.value.dateRange, defaultValue: null, width: 250 },
])
const moneyKeys = ['funding_settlement_position_amount', 'funding_fee_income', 'funding_fee_expense', 'funding_fee_net_income'] as const
const columns = computed<ProTableColumn<FuturesFundingFeeReportRow>[]>(() => [
  { key: 'stat_date', title: copy.value.statDate, width: 140, sortable: true, hideable: false },
  ...(props.showSymbolWhenFiltered && rows.value.some(row => String(row.symbol ?? '').trim()) ? [
    { key: 'symbol', title: messages.value.futuresTradeReport.symbol, width: 150, align: 'left' as const, hideable: false },
  ] : []),
  ...(props.showSources ? [
    ...(props.showSourceCode ? [{ key: 'source_code', title: copy.value.sourceId, width: 130, sortable: true }] : []),
    { key: 'source_name', title: copy.value.sourceName, width: 160, sortable: true },
    { key: 'source_type', title: copy.value.sourceType, width: 100, sortable: true },
  ] : []),
  { key: 'funding_settlement_user_count', title: copy.value.funding_settlement_user_count, width: 145, sortable: true,
    formatter: value => formatTradeReportDecimal(value, 0) },
  { key: 'funding_settlement_position_amount', title: copy.value.funding_settlement_position_amount, width: 175, sortable: true,
    formatter: value => formatTradeReportDecimal(value) },
  { key: 'funding_settlement_count', title: copy.value.funding_settlement_count, width: 135, sortable: true,
    formatter: value => formatTradeReportDecimal(value, 0) },
  ...moneyKeys.filter(key => key !== 'funding_settlement_position_amount').map(key => ({ key, title: copy.value[key], width: 155, sortable: true,
    formatter: (value: unknown) => formatTradeReportDecimal(value) })),
  { key: 'funding_fee_net_income_rate', title: copy.value.funding_fee_net_income_rate, width: 170, sortable: true,
    formatter: value => `${formatTradeReportDecimal(value, 4)}%` },
  { key: 'stat_status', title: copy.value.status, width: 120, fixed: 'right' as const, sortable: true },
])
const { filters, proTableBindings, query, reload, rows } = useMmProTable<FuturesFundingFeeReportRow>({
  initialSort: { key: 'stat_date', order: 'desc' }, queryFields: fields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.date_range) ? filters.date_range : []
    const params: FuturesFundingFeeReportQuery = {
      period: filters.period === 'month' ? 'month' : 'day', symbol: String(filters.symbol ?? '').trim().toUpperCase(),
      start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
      page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
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
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-futures-funding-fee-report"
    :aria-label="copy.tableAria" :columns="columns" :fill-height="fillHeight" row-key="id"
    columns-configurable :page-sizes="[20, 30, 40]" :filter-drawer-title="copy.tableAria">
    <template #header-stat_date="{ column }">
      {{ column.title }} <MmTooltip :content="copy.utcHelp"><MmIcon name="circle-help" :size="12" /></MmTooltip>
    </template>
    <template #header-funding_settlement_user_count="{ column }">
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
    <template #cell-funding_fee_income="{ row }"><span class="is-income">{{ formatTradeReportDecimal(row.funding_fee_income) }}</span></template>
    <template #cell-funding_fee_expense="{ row }"><span class="is-expense">{{ formatTradeReportDecimal(row.funding_fee_expense) }}</span></template>
    <template #cell-funding_fee_net_income="{ row }">
      <span :class="Number(row.funding_fee_net_income) > 0 ? 'is-income' : Number(row.funding_fee_net_income) < 0 ? 'is-expense' : ''">
        {{ formatTradeReportDecimal(row.funding_fee_net_income) }}
      </span>
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotProps"><slot :name="name" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style scoped>
.mm-futures-funding-fee-report { width: 100%; min-width: 0; flex: 1 1 0%; }
.is-income { color: var(--mm-color-success, #087f5b); }
.is-expense { color: var(--mm-color-danger, #d92d20); }
</style>
