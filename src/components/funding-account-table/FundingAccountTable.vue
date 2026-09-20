<script setup lang="ts" generic="Row extends FundingAccountRow = FundingAccountRow">
import { computed, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { TableSortState } from '../table'
import { formatFundingMoney } from './formatters'
import type { FundingAccountListQuery, FundingAccountRow, FundingAccountTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmFundingAccountTable' })

const props = withDefaults(defineProps<FundingAccountTableProps<Row>>(), {
  agentOptions: () => [],
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  initialPageSize: 20,
  pageSizes: () => [20, 50, 100],
})

const { messages } = useLocale()
const copy = computed(() => messages.value.fundingAccounts)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'last_changed_at', order: 'desc' }
const sortableFields = new Set(['currency', 'account_balance', 'last_changed_at'])
const managedSlots = new Set(['cell-agent_id', 'cell-user_id', 'cell-username', 'cell-currency', 'cell-account_balance'])

const queryFields = computed<QueryBarField[]>(() => {
  const fields: QueryBarField[] = [{
    key: 'keyword', label: copy.value.user, type: 'keyword', defaultValue: '',
    placeholder: copy.value.keywordPlaceholder, clearable: true, maxlength: 100, width: 210,
  }]
  if (props.agentOptions.length) {
    fields.push({
      key: 'agent_id', label: copy.value.agent, type: 'select', defaultValue: '',
      placeholder: copy.value.allAgents, clearable: true, width: 180,
      options: [{ label: copy.value.allAgents, value: '' }, ...props.agentOptions],
    })
  }
  fields.push({
    key: 'last_changed_range', label: copy.value.lastChangedTime, type: 'date-range',
    defaultValue: null, placeholder: copy.value.lastChangedTimeAll,
    shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'], width: 190,
  })
  return fields
})

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 150, hideable: false },
    { key: 'username', dataIndex: 'username', title: copy.value.username, width: 150 },
    { key: 'currency', dataIndex: 'currency', title: copy.value.currency, width: 120, sortable: true },
    { key: 'account_balance', dataIndex: 'account_balance', title: copy.value.accountBalance, width: 145, sortable: true },
    { key: 'last_changed_at', dataIndex: 'last_changed_at', title: copy.value.lastChangedTime, width: 180, sortable: true },
  ]
  if (props.agentOptions.length) {
    result.splice(0, 0, { key: 'agent_id', dataIndex: 'agent_id', title: copy.value.agent, width: 150 })
  }
  return result
})

const columns = computed(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  const resolved = !props.columns ? defaults : typeof props.columns === 'function' ? props.columns(defaults) : props.columns
  return Array.isArray(resolved) ? resolved.map(column => ({ ...column })) : defaults
})

const forwardedSlots = computed(() => Object.keys(slots).filter(name => !managedSlots.has(name)))
const scalar = (filters: QueryBarValue, key: string) => {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}
const display = (value: unknown) => value === null || value === undefined || String(value).trim() === '' ? '-' : String(value)
const agentLabel = (row: Row) => row.agent_name || props.agentOptions.find(option => String(option.value) === String(row.agent_id))?.label || row.agent_id || '-'
const normalizeDate = (value?: string) => value ? String(value).slice(0, 10) : ''

const { proTableBindings, reload } = useMmProTable<Row>({
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.last_changed_range) ? filters.last_changed_range : null
    const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
    const query: FundingAccountListQuery = {
      keyword: String(scalar(filters, 'keyword')).trim(),
      order_by: activeSort.key as FundingAccountListQuery['order_by'],
      order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
      page_no: page,
      page_size: pageSize,
      start_time: normalizeDate(range?.[0]),
      end_time: normalizeDate(range?.[1]),
    }
    if (props.agentOptions.length) query.agent_id = scalar(filters, 'agent_id')
    try { return await props.request(query, { signal }) }
    catch (error: unknown) {
      const candidate = error as { message?: string, msg?: string } | null
      throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
    }
  },
})

defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-funding-account-table"
    :aria-label="ariaLabel ?? copy.tableAria" :columns="columns" :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight" :filter-drawer="false" :page-sizes="pageSizes" row-key="id">
    <template #cell-agent_id="slotProps"><slot name="cell-agent_id" v-bind="slotProps">{{ agentLabel(slotProps.row) }}</slot></template>
    <template #cell-user_id="slotProps"><slot name="cell-user_id" v-bind="slotProps">{{ display(slotProps.row.user_id) }}</slot></template>
    <template #cell-username="slotProps"><slot name="cell-username" v-bind="slotProps">{{ display(slotProps.row.nice_name || slotProps.row.username) }}</slot></template>
    <template #cell-currency="slotProps"><slot name="cell-currency" v-bind="slotProps">{{ display(slotProps.row.currency) }}</slot></template>
    <template #cell-account_balance="slotProps"><slot name="cell-account_balance" v-bind="slotProps"><span class="mm-funding-account-table__amount">{{ formatFundingMoney(slotProps.row.account_balance) }}</span></slot></template>
    <template v-for="slotName in forwardedSlots" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style src="./funding-account-table.css"></style>
