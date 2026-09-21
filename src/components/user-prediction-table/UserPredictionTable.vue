<script setup lang="ts" generic="Row extends UserPredictionRow = UserPredictionRow">
import { computed, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { TableSortState } from '../table'
import { formatSignedUserPredictionMoney, formatUserPredictionCount, formatUserPredictionMoney } from './formatters'
import type { UserPredictionListQuery, UserPredictionRow, UserPredictionTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmUserPredictionTable' })

const props = withDefaults(defineProps<UserPredictionTableProps<Row>>(), {
  agentOptions: () => [],
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  initialPageSize: 20,
  pageSizes: () => [20, 50, 100],
})

const { messages } = useLocale()
const copy = computed(() => messages.value.userPredictions)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'last_prediction_at', order: 'desc' }
const sortableFields = new Set([
  'pending_orders', 'pending_amount', 'orders_30d', 'win_orders', 'lose_orders',
  'refund_orders', 'stake_30d', 'return_30d', 'net_profit_30d', 'last_prediction_at',
])
const managedSlots = new Set([
  'cell-agent_id', 'cell-user_id', 'cell-username', 'cell-agent_user_id', 'cell-net_profit_30d',
])

const queryFields = computed<QueryBarField[]>(() => {
  const fields: QueryBarField[] = [
    {
      key: 'keyword', label: copy.value.user, type: 'keyword', defaultValue: '',
      placeholder: copy.value.userKeywordPlaceholder, clearable: true, maxlength: 100, width: 210,
    },
    {
      key: 'username', label: copy.value.username, type: 'keyword', defaultValue: '',
      placeholder: copy.value.usernamePlaceholder, clearable: true, maxlength: 100, width: 200,
    },
  ]
  if (props.agentOptions.length) {
    fields.push({
      key: 'agent_id', label: copy.value.agent, type: 'select', defaultValue: '',
      placeholder: copy.value.allAgents, clearable: true, width: 180,
      options: [{ label: copy.value.allAgents, value: '' }, ...props.agentOptions],
    })
  }
  fields.push(
    {
      key: 'play_type', label: copy.value.playType, type: 'select', defaultValue: 'all', width: 170,
      options: [
        { label: copy.value.allPlays, value: 'all' },
        { label: copy.value.grid, value: 'grid' },
        { label: copy.value.highLow, value: 'high_low' },
        { label: copy.value.upDown, value: 'up_down' },
      ],
    },
    {
      key: 'last_prediction_range', label: copy.value.lastPredictionTime, type: 'date-range',
      defaultValue: null, placeholder: copy.value.lastPredictionTimeAll,
      shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'], width: 205,
    },
  )
  return fields
})

const countColumn = (key: keyof UserPredictionRow, title: string, width = 104): ProTableColumn<Row> => ({
  key: String(key), dataIndex: String(key), title, width, sortable: true,
  formatter: formatUserPredictionCount,
})
const moneyColumn = (key: keyof UserPredictionRow, title: string, width = 132): ProTableColumn<Row> => ({
  key: String(key), dataIndex: String(key), title, width, sortable: true,
  formatter: formatUserPredictionMoney,
})
const display = (value: unknown) => value === null || value === undefined || String(value).trim() === '' ? '-' : String(value)

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 116, hideable: false },
    { key: 'username', dataIndex: 'username', title: copy.value.username, width: 112, formatter: display },
    { key: 'agent_user_id', dataIndex: 'agent_user_id', title: copy.value.externalUserId, width: 128, formatter: display },
    countColumn('pending_orders', copy.value.pendingOrders, 112),
    moneyColumn('pending_amount', copy.value.pendingAmount, 132),
    countColumn('orders_30d', copy.value.orders30d, 108),
    countColumn('win_orders', copy.value.winOrders, 102),
    countColumn('lose_orders', copy.value.loseOrders, 108),
    countColumn('refund_orders', copy.value.refundOrders, 126),
    moneyColumn('stake_30d', copy.value.stake30d, 126),
    moneyColumn('return_30d', copy.value.return30d, 126),
    moneyColumn('net_profit_30d', copy.value.netProfit30d, 152),
    { key: 'last_prediction_at', dataIndex: 'last_prediction_at', title: copy.value.lastPredictionTime, width: 168, sortable: true, formatter: display },
  ]
  if (props.agentOptions.length) {
    result.unshift({ key: 'agent_id', dataIndex: 'agent_id', title: copy.value.agent, width: 150 })
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
const normalizeDate = (value?: string) => value ? String(value).slice(0, 10) : ''
const agentLabel = (row: Row) => row.agent_name || props.agentOptions.find(option => String(option.value) === String(row.agent_id))?.label || row.agent_id || '-'
const netProfitClass = (value: unknown) => {
  const amount = Number(value)
  return ['mm-user-prediction-table__net-profit', amount > 0 ? 'is-positive' : amount < 0 ? 'is-negative' : 'is-neutral']
}

const { proTableBindings, reload } = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters: { keyword: '', username: '', agent_id: '', play_type: 'all', last_prediction_range: null },
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.last_prediction_range) ? filters.last_prediction_range : null
    const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
    const query: UserPredictionListQuery = {
      keyword: String(scalar(filters, 'keyword')).trim(),
      username: String(scalar(filters, 'username')).trim(),
      play_type: String(scalar(filters, 'play_type') || 'all') as UserPredictionListQuery['play_type'],
      start_time: normalizeDate(range?.[0]),
      end_time: normalizeDate(range?.[1]),
      order_by: activeSort.key as UserPredictionListQuery['order_by'],
      order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
      page_no: page,
      page_size: pageSize,
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
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-user-prediction-table"
    :aria-label="ariaLabel ?? copy.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer="false"
    :inline-query-field-keys="queryFields.map(field => field.key)"
    :page-sizes="pageSizes"
    row-key="id"
  >
    <template #cell-agent_id="slotProps"><slot name="cell-agent_id" v-bind="slotProps">{{ agentLabel(slotProps.row) }}</slot></template>
    <template #cell-user_id="slotProps"><slot name="cell-user_id" v-bind="slotProps">{{ display(slotProps.row.user_id) }}</slot></template>
    <template #cell-username="slotProps"><slot name="cell-username" v-bind="slotProps">{{ display(slotProps.row.nice_name || slotProps.row.username) }}</slot></template>
    <template #cell-agent_user_id="slotProps"><slot name="cell-agent_user_id" v-bind="slotProps">{{ display(slotProps.row.agent_user_id) }}</slot></template>
    <template #cell-net_profit_30d="slotProps"><slot name="cell-net_profit_30d" v-bind="slotProps"><span :class="netProfitClass(slotProps.row.net_profit_30d)">{{ formatSignedUserPredictionMoney(slotProps.row.net_profit_30d) }}</span></slot></template>
    <template v-for="slotName in forwardedSlots" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style src="./user-prediction-table.css"></style>
