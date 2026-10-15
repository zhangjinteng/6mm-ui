<script setup lang="ts" generic="Row extends FundingOverviewRow = FundingOverviewRow">
import { computed, useSlots } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable, type ProTableColumn } from '../pro-table'
import type { QueryBarField } from '../query-bar'
import type { TableSortState } from '../table'
import { formatFundingMoney } from '../funding-account-table/formatters'
import type { FundingOverviewListQuery, FundingOverviewRow, FundingOverviewTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmFundingOverviewTable' })
const props = withDefaults(defineProps<FundingOverviewTableProps<Row>>(), {
  fillHeight: true, columnsConfigurable: true, initialPageSize: 20, pageSizes: () => [20, 50, 100],
})
const { messages } = useLocale()
const copy = computed(() => messages.value.fundingOverview)
const slots = useSlots()
const managedSlots = new Set(['cell-user_id', 'cell-username', 'cell-funding_balance',
  'cell-contract_equity', 'cell-contract_occupied', 'cell-total_assets'])
const forwardedSlots = computed(() => Object.keys(slots).filter(name => !managedSlots.has(name)))
const defaultSort: TableSortState = { key: 'funding_balance', order: 'desc' }
const sortableFields = new Set(['user_id', 'username', 'funding_balance', 'contract_equity',
  'contract_occupied', 'total_assets', 'last_changed_at'])
const display = (value: unknown): string => value === null || value === undefined || String(value).trim() === '' ? '-' : String(value)
const queryFields = computed<QueryBarField[]>(() => [
  { key: 'keyword', label: copy.value.user, type: 'keyword', defaultValue: '', clearable: true,
    maxlength: 100, width: 210, placeholder: copy.value.keywordPlaceholder },
  { key: 'last_changed_range', label: copy.value.lastChangedTime, type: 'date-range', defaultValue: null,
    width: 190, placeholder: copy.value.lastChangedTimeAll,
    shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'] },
])
const columns = computed<ProTableColumn<Row>[]>(() => {
  const defaults: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 150, sortable: true, hideable: false },
    { key: 'username', dataIndex: 'username', title: copy.value.username, width: 150, sortable: true, formatter: display },
    { key: 'funding_balance', dataIndex: 'funding_balance', title: copy.value.fundingBalance, width: 145, sortable: true },
    { key: 'contract_equity', dataIndex: 'contract_equity', title: copy.value.contractEquity, width: 145, sortable: true },
    { key: 'contract_occupied', dataIndex: 'contract_occupied', title: copy.value.contractOccupied, width: 145, sortable: true },
    { key: 'total_assets', dataIndex: 'total_assets', title: copy.value.totalAssets, width: 150, sortable: true },
    { key: 'last_changed_at', dataIndex: 'last_changed_at', title: copy.value.lastChangedTime, width: 180, sortable: true, formatter: display },
  ]
  return !props.columns ? defaults : typeof props.columns === 'function' ? props.columns(defaults) : props.columns
})
const date = (value: unknown) => value ? String(value).slice(0, 10) : ''
const { proTableBindings, reload } = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0, initialFilters: { keyword: '', last_changed_range: null },
  initialPageSize: props.initialPageSize, initialSort: defaultSort, queryFields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.last_changed_range) ? filters.last_changed_range : null
    const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
    const query: FundingOverviewListQuery = {
      keyword: String(filters.keyword ?? '').trim(), start_time: date(range?.[0]), end_time: date(range?.[1]),
      page_no: page, page_size: pageSize, order_by: activeSort.key as FundingOverviewListQuery['order_by'],
      order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    }
    try { return await props.request(query, { signal }) }
    catch (error: unknown) {
      const candidate = error as { msg?: string; message?: string } | null
      throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
    }
  },
})
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-funding-overview-table"
    :aria-label="ariaLabel ?? copy.tableAria" :columns="columns" :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight" :filter-drawer="false" :inline-query-field-keys="['keyword', 'last_changed_range']"
    :page-sizes="pageSizes" :auto-refreshable="false" row-key="id">
    <template #cell-user_id="slotProps"><slot name="cell-user_id" v-bind="slotProps">{{ display(slotProps.row.user_id) }}</slot></template>
    <template #cell-username="slotProps"><slot name="cell-username" v-bind="slotProps">{{ display(slotProps.row.nice_name || slotProps.row.username) }}</slot></template>
    <template #cell-funding_balance="slotProps"><slot name="cell-funding_balance" v-bind="slotProps"><span class="mm-funding-overview-table__funding">{{ formatFundingMoney(slotProps.row.funding_balance) }}</span></slot></template>
    <template #cell-contract_equity="slotProps"><slot name="cell-contract_equity" v-bind="slotProps">{{ formatFundingMoney(slotProps.row.contract_equity) }}</slot></template>
    <template #cell-contract_occupied="slotProps"><slot name="cell-contract_occupied" v-bind="slotProps">{{ formatFundingMoney(slotProps.row.contract_occupied) }}</slot></template>
    <template #cell-total_assets="slotProps"><slot name="cell-total_assets" v-bind="slotProps"><strong class="mm-funding-overview-table__total">{{ formatFundingMoney(slotProps.row.total_assets) }}</strong></slot></template>
    <template v-for="slotName in forwardedSlots" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style src="./funding-overview-table.css"></style>
