<script setup lang="ts" generic="Row extends FundingChangeLogRow = FundingChangeLogRow">
import { computed, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import type { TagType } from '../tag'
import type { TableSortState } from '../table'
import { formatFundingAmount, fundingBalanceChangeClass } from './formatters'
import type { FundingChangeLogListQuery, FundingChangeLogRow, FundingChangeLogTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmFundingChangeLogTable' })
const props = withDefaults(defineProps<FundingChangeLogTableProps<Row>>(), {
  agentOptions: () => [], ariaLabel: undefined, columnsConfigurable: true,
  fillHeight: true, initialPageSize: 20, pageSizes: () => [20, 50, 100],
})
const { messages } = useLocale()
const copy = computed(() => messages.value.fundingChangeLogs)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'created_at', order: 'desc' }
const sortableFields = new Set(['ledger_id', 'balance_change', 'balance_before', 'balance_after', 'created_at'])
const managedSlots = new Set(['cell-agent_id', 'cell-user_id', 'cell-username', 'cell-ledger_id', 'cell-business_type', 'cell-business_scope', 'cell-balance_change', 'cell-balance_before', 'cell-balance_after', 'cell-business_id'])

const queryFields = computed<QueryBarField[]>(() => {
  const fields: QueryBarField[] = [{
    key: 'keyword', label: copy.value.user, type: 'keyword', defaultValue: '',
    placeholder: copy.value.keywordPlaceholder, clearable: true, maxlength: 100, width: 255,
  }]
  if (props.agentOptions.length) fields.push({
    key: 'agent_id', label: copy.value.agent, type: 'select', defaultValue: '',
    placeholder: copy.value.allAgents, clearable: true, width: 180,
    options: [{ label: copy.value.allAgents, value: '' }, ...props.agentOptions],
  })
  fields.push(
    { key: 'change_type', label: copy.value.type, type: 'select', defaultValue: '', placeholder: copy.value.allTypes, clearable: true, width: 160, options: [
      { label: copy.value.allTypes, value: '' }, { label: copy.value.typeDeposit, value: 'deposit' },
      { label: copy.value.typeStake, value: 'stake' }, { label: copy.value.typePayout, value: 'payout' }, { label: copy.value.typeRefund, value: 'refund' },
    ] },
    { key: 'game', label: copy.value.game, type: 'select', defaultValue: '', placeholder: copy.value.allGames, clearable: true, width: 150, options: [
      { label: copy.value.allGames, value: '' }, { label: copy.value.gameUpDown, value: 'prediction_updown' },
      { label: copy.value.gameHighLow, value: 'prediction_highlow' }, { label: copy.value.gameGrid, value: 'grid' },
    ] },
    { key: 'created_range', label: copy.value.time, type: 'date-range', defaultValue: null, placeholder: copy.value.timeAll,
      shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'], width: 190 },
  )
  return fields
})

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 135, hideable: false },
    { key: 'username', dataIndex: 'username', title: copy.value.username, width: 145 },
    { key: 'ledger_id', dataIndex: 'ledger_id', title: copy.value.ledgerId, width: 150, sortable: true },
    { key: 'business_type', dataIndex: 'business_type', title: copy.value.type, width: 135 },
    { key: 'business_scope', dataIndex: 'business_scope', title: copy.value.game, width: 115 },
    { key: 'balance_change', dataIndex: 'balance_change', title: copy.value.balanceChange, width: 165, sortable: true },
    { key: 'balance_before', dataIndex: 'balance_before', title: copy.value.balanceBefore, width: 165, sortable: true },
    { key: 'balance_after', dataIndex: 'balance_after', title: copy.value.balanceAfter, width: 165, sortable: true },
    { key: 'business_id', dataIndex: 'business_id', title: copy.value.businessId, width: 165 },
    { key: 'created_at', dataIndex: 'created_at', title: copy.value.time, width: 180, hideable: false, sortable: true },
  ]
  if (props.agentOptions.length) result.splice(0, 0, { key: 'agent_id', dataIndex: 'agent_id', title: copy.value.agent, width: 150 })
  return result
})
const columns = computed(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  const resolved = !props.columns ? defaults : typeof props.columns === 'function' ? props.columns(defaults) : props.columns
  return Array.isArray(resolved) ? resolved.map(column => ({ ...column })) : defaults
})
const forwardedSlots = computed(() => Object.keys(slots).filter(name => !managedSlots.has(name)))
const display = (value: unknown) => value === null || value === undefined || String(value).trim() === '' ? '-' : String(value)
const scalar = (filters: QueryBarValue, key: string) => { const value = filters[key]; return value === null || Array.isArray(value) ? '' : value }
const normalizeDate = (value?: string) => value ? String(value).slice(0, 10) : ''
const agentLabel = (row: Row) => row.agent_name || props.agentOptions.find(option => String(option.value) === String(row.agent_id))?.label || row.agent_id || '-'
const typeLabel = (value: unknown) => ({ DEPOSIT: copy.value.typeDeposit, SECONDS_BET_DEBIT: copy.value.typeStake, SECONDS_BET_STAKE: copy.value.typeStake, SECONDS_BET_PAYOUT: copy.value.typePayout, SECONDS_BET_REFUND: copy.value.typeRefund }[String(value ?? '').toUpperCase()] || display(value))
const typeTag = (value: unknown): TagType => { const type = String(value ?? '').toUpperCase(); return type === 'DEPOSIT' || type === 'SECONDS_BET_PAYOUT' ? 'success' : type === 'SECONDS_BET_REFUND' ? 'info' : type === 'SECONDS_BET_STAKE' || type === 'SECONDS_BET_DEBIT' ? 'warning' : 'default' }
const gameLabel = (value: unknown) => ({ prediction: copy.value.gamePrediction, prediction_updown: copy.value.gameUpDown, prediction_highlow: copy.value.gameHighLow, grid: copy.value.gameGrid }[String(value ?? '').toLowerCase()] || '-')

const { proTableBindings, reload } = useMmProTable<Row>({
  initialPageSize: props.initialPageSize, initialSort: defaultSort, queryFields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.created_range) ? filters.created_range : null
    const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
    const query: FundingChangeLogListQuery = {
      keyword: String(scalar(filters, 'keyword')).trim(), change_type: String(scalar(filters, 'change_type')),
      game: String(scalar(filters, 'game')), order_by: activeSort.key as FundingChangeLogListQuery['order_by'],
      order_dir: activeSort.order === 'asc' ? 'asc' : 'desc', page_no: page, page_size: pageSize,
      start_time: normalizeDate(range?.[0]), end_time: normalizeDate(range?.[1]),
    }
    if (props.agentOptions.length) query.agent_id = scalar(filters, 'agent_id')
    try { return await props.request(query, { signal }) }
    catch (error: unknown) { const candidate = error as { message?: string, msg?: string } | null; throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed) }
  },
})
defineExpose({ reload })
</script>

<template>
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-funding-change-log-table"
    :aria-label="ariaLabel ?? copy.tableAria" :columns="columns" :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight" :filter-drawer="false" :page-sizes="pageSizes" row-key="ledger_id">
    <template #cell-agent_id="slotProps"><slot name="cell-agent_id" v-bind="slotProps">{{ agentLabel(slotProps.row) }}</slot></template>
    <template #cell-user_id="slotProps"><slot name="cell-user_id" v-bind="slotProps">{{ display(slotProps.row.user_id) }}</slot></template>
    <template #cell-username="slotProps"><slot name="cell-username" v-bind="slotProps">{{ display(slotProps.row.nice_name || slotProps.row.username) }}</slot></template>
    <template #cell-ledger_id="slotProps"><slot name="cell-ledger_id" v-bind="slotProps">{{ display(slotProps.row.ledger_id) }}</slot></template>
    <template #cell-business_type="slotProps"><slot name="cell-business_type" v-bind="slotProps"><MmTag :type="typeTag(slotProps.row.business_type)" effect="soft" round size="sm">{{ typeLabel(slotProps.row.business_type) }}</MmTag></slot></template>
    <template #cell-business_scope="slotProps"><slot name="cell-business_scope" v-bind="slotProps">{{ gameLabel(slotProps.row.business_scope) }}</slot></template>
    <template #cell-balance_change="slotProps"><slot name="cell-balance_change" v-bind="slotProps"><span class="mm-funding-change-log-table__amount" :class="fundingBalanceChangeClass(slotProps.row.balance_change)">{{ formatFundingAmount(slotProps.row.balance_change, slotProps.row.currency, true) }}</span></slot></template>
    <template #cell-balance_before="slotProps"><slot name="cell-balance_before" v-bind="slotProps"><span class="mm-funding-change-log-table__amount">{{ formatFundingAmount(slotProps.row.balance_before, slotProps.row.currency) }}</span></slot></template>
    <template #cell-balance_after="slotProps"><slot name="cell-balance_after" v-bind="slotProps"><span class="mm-funding-change-log-table__amount">{{ formatFundingAmount(slotProps.row.balance_after, slotProps.row.currency) }}</span></slot></template>
    <template #cell-business_id="slotProps"><slot name="cell-business_id" v-bind="slotProps">{{ display(slotProps.row.business_id) }}</slot></template>
    <template v-for="slotName in forwardedSlots" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style src="./funding-change-log-table.css"></style>
