<script setup lang="ts" generic="Row extends UserContractRow = UserContractRow">
import { computed, useSlots } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { TableSortState } from '../table'
import type { UserContractListQuery, UserContractRow, UserContractTableProps } from './types'
import { formatSignedUserPredictionMoney, formatUserPredictionMoney } from '../user-prediction-table/formatters'

defineOptions({ inheritAttrs: false, name: 'MmUserContractTable' })
const props = withDefaults(defineProps<UserContractTableProps<Row>>(), {
  initialKeyword: '', initialPageSize: 20,
})
const { messages } = useLocale()
const copy = computed(() => messages.value.userContracts)
const slots = useSlots()
const managedSlots = new Set(['cell-user_id', 'cell-username', 'cell-agent_user_id'])
const forwardedSlots = computed(() => Object.keys(slots).filter(name => !managedSlots.has(name)))
const numeric = (value: unknown) => value === null || value === undefined || value === '' ? null : Number(value)
const money = (value: unknown) => formatUserPredictionMoney(value ?? '0')
const optionalMoney = (value: unknown) => numeric(value) === null ? '-' : money(value)
const signed = (value: unknown) => numeric(value) === null ? '-' : formatSignedUserPredictionMoney(value)
const display = (value: unknown) => value === null || value === undefined || String(value).trim() === '' ? '-' : String(value)
const dateTime = (value: unknown) => {
  const text = display(value)
  if (text === '-') return text
  const match = text.replace('T', ' ').match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2})/)
  return match ? `${match[1]} ${match[2]}:${match[3]}` : text
}
const pnlClass = (value: unknown) => ['mm-user-contract-table__pnl', Number(value) > 0 ? 'is-profit' : Number(value) < 0 ? 'is-loss' : 'is-neutral']
const queryFields = computed<QueryBarField[]>(() => [
  { key: 'keyword', label: copy.value.identityKeyword, type: 'keyword', defaultValue: '', placeholder: copy.value.identityKeyword, clearable: true, width: 210 },
  { key: 'username', label: copy.value.username, type: 'keyword', defaultValue: '', placeholder: copy.value.username, clearable: true, width: 208 },
  { key: 'last_contract_time', label: copy.value.lastContractTime, type: 'date-range', defaultValue: null, placeholder: copy.value.lastContractTimeAll,
    shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'], width: 188 },
  { key: 'has_position', label: copy.value.positionStatus, type: 'segmented', defaultValue: '', block: true, width: 220,
    options: [
      { label: copy.value.positionStatusAll, value: '' },
      { label: copy.value.hasPosition, value: '1' },
      { label: copy.value.noPosition, value: '0' },
    ] },
])
const column = (key: keyof UserContractRow, title: string, width: number, formatter?: (value: unknown) => string): ProTableColumn<Row> =>
  ({ key: String(key), dataIndex: String(key), title, width, formatter })
const defaultColumns = computed<ProTableColumn<Row>[]>(() => [
  { ...column('user_id', copy.value.userUid, 125, display), hideable: false, sortable: true },
  column('username', copy.value.username, 140, display),
  column('agent_user_id', copy.value.externalUserId, 100, display),
  { ...column('wallet_balance', copy.value.walletBalance, 140, money), sortable: true },
  column('available_balance', copy.value.availableBalance, 140, money),
  column('position_amount', copy.value.positionAmount, 130, money),
  column('position_count', copy.value.positionCount, 110, value => String(Math.max(0, Math.trunc(Number(value) || 0)))),
  column('order_amount', copy.value.orderAmount, 130, money),
  column('order_count', copy.value.orderCount, 100, value => String(Math.max(0, Math.trunc(Number(value) || 0)))),
  column('unrealized_pnl', copy.value.unrealizedPnl, 150, signed),
  { ...column('pnl_30d', copy.value.pnl30d, 150, signed), sortable: true },
  column('fee_30d', copy.value.fee30d, 150, optionalMoney),
  column('last_contract_at', copy.value.lastContractTime, 170, dateTime),
])
const columns = computed(() => {
  const defaults = defaultColumns.value.map(item => ({ ...item }))
  const resolved = !props.columns ? defaults : typeof props.columns === 'function' ? props.columns(defaults) : props.columns
  return resolved.map(item => ({ ...item }))
})
const scalar = (filters: QueryBarValue, key: string) => {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : String(value)
}
const defaultSort: TableSortState = { key: 'user_id', order: 'asc' }
const sortable = new Set(['user_id', 'wallet_balance', 'pnl_30d'])
const { proTableBindings, reload } = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters: { keyword: String(props.initialKeyword), username: '', has_position: '', last_contract_time: null },
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: async ({ filters, page, pageSize, sort, signal }) => {
    const range = Array.isArray(filters.last_contract_time) ? filters.last_contract_time : null
    const activeSort = sort.order && sortable.has(sort.key) ? sort : defaultSort
    const query: UserContractListQuery = {
      keyword: scalar(filters, 'keyword').trim(),
      username: scalar(filters, 'username').trim(),
      has_position: scalar(filters, 'has_position') as UserContractListQuery['has_position'],
      start_time: range?.[0] ? String(range[0]).slice(0, 10) : undefined,
      end_time: range?.[1] ? String(range[1]).slice(0, 10) : undefined,
      order_by: activeSort.key as UserContractListQuery['order_by'],
      order_dir: activeSort.order === 'desc' ? 'desc' : 'asc',
      page_no: page, page_size: pageSize,
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
  <MmProTable v-bind="{ ...$attrs, ...proTableBindings }" class="mm-user-contract-table"
    :aria-label="copy.tableAria" :columns="columns" columns-configurable fill-height
    :filter-drawer-title="copy.filterTitle" :filter-drawer-subtitle="copy.filterSubtitle"
    :inline-query-field-keys="queryFields.map(field => field.key)" :page-sizes="[20, 30, 40]" row-key="user_id">
    <template #cell-user_id="slotProps"><slot name="cell-user_id" v-bind="slotProps">{{ display(slotProps.row.user_id) }}</slot></template>
    <template #cell-username="slotProps"><slot name="cell-username" v-bind="slotProps">{{ display(slotProps.row.nice_name || slotProps.row.username) }}</slot></template>
    <template #cell-agent_user_id="slotProps"><slot name="cell-agent_user_id" v-bind="slotProps">{{ display(slotProps.row.agent_user_id) }}</slot></template>
    <template #cell-unrealized_pnl="{ row }"><span :class="pnlClass(row.unrealized_pnl)">{{ signed(row.unrealized_pnl) }}</span></template>
    <template #cell-pnl_30d="{ row }"><span :class="pnlClass(row.pnl_30d)">{{ signed(row.pnl_30d) }}</span></template>
    <template v-for="slotName in forwardedSlots" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style>
.mm-user-contract-table .mm-table th,.mm-user-contract-table .mm-table td{font-size:12px;font-variant-numeric:tabular-nums}
.mm-user-contract-table__pnl.is-profit{color:var(--mm-color-success)}
.mm-user-contract-table__pnl.is-loss{color:var(--mm-color-danger)}
.mm-user-contract-table__pnl.is-neutral{color:var(--mm-color-text-primary)}
.mm-user-contract-table .mm-pro-table__auto-refresh{display:none}
</style>
