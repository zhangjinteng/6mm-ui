<script setup lang="ts" generic="Row extends MarginChangeLogRow = MarginChangeLogRow">
import { computed, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import type { TagType } from '../tag'
import type { TableSortState } from '../table'
import {
  formatMarginChangeAmount,
  formatMarginChangeBalance,
  formatMarginChangeDateTime,
  formatMarginTransferAmount,
} from './formatters'
import type {
  MarginChangeLogListQuery,
  MarginChangeLogRow,
  MarginChangeLogTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmMarginChangeLogTable' })

const props = withDefaults(defineProps<MarginChangeLogTableProps<Row>>(), {
  allowedBizTypes: () => [],
  ariaLabel: undefined,
  bizTypeLabels: () => ({}),
  bizTypeTagTypes: () => ({}),
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  hiddenBizTypes: () => [],
  includeZeroAmount: false,
  initialPageSize: 20,
  pageSizes: () => [20, 30, 40],
  showTransferAmount: false,
  showTransferStatus: false,
  showUserFilters: true,
})

const { messages } = useLocale()
const copy = computed(() => messages.value.marginChangeLogs)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'created_at', order: 'desc' }
const sortableFields = new Set([
  'created_at',
  'biz_type',
  'delta_amount',
  'balance_before',
  'balance_after',
])
const managedSlotNames = new Set([
  'cell-user_id',
  'cell-username',
  'cell-user_type',
  'cell-currency',
  'cell-biz_type',
  'cell-delta_amount',
  'cell-transfer_amount',
  'cell-balance_before',
  'cell-balance_after',
  'cell-created_at',
  'cell-transfer_status',
  'query-actions',
  'toolbar-actions',
])

const defaultBizTypeLabels = computed<Record<string, string>>(() => ({
  admin_deduct: copy.value.typeSystemDeduct,
  admin_recharge: copy.value.typeSystemDeposit,
  agent_transfer: copy.value.typeAgentTransfer,
  agent_transfer_all_out: copy.value.typeAgentTransferAllOut,
  close_position: copy.value.typeClosePosition,
  commission_rebate: copy.value.typeFeeCommission,
  deposit: copy.value.typeDeposit,
  fee: copy.value.typeHandlingFee,
  fee_commission: copy.value.typeFeeCommission,
  funding_fee: copy.value.typeFundingFee,
  funding_fee_settle: copy.value.typeFundingFee,
  handling_fee: copy.value.typeHandlingFee,
  liquidation: copy.value.typeLiquidation,
  liquidation_fee: copy.value.typeLiquidationFee,
  open_position: copy.value.typeOpenPosition,
  realized_pnl: copy.value.typeRealizedPnl,
  recharge: copy.value.typeMarginDeposit,
  reverse_transfer_in: copy.value.typeReverseTransferIn,
  reverse_transfer_out: copy.value.typeReverseTransferOut,
  simulated_reverse_transfer_in: copy.value.typeSimulatedReverseTransferIn,
  simulated_reverse_transfer_out: copy.value.typeSimulatedReverseTransferOut,
  simulated_transfer_all_out: copy.value.typeSimulatedTransferAllOut,
  simulated_transfer_in: copy.value.typeSimulatedTransferIn,
  simulated_transfer_out: copy.value.typeSimulatedTransferOut,
  transfer_all_out: copy.value.typeTransferAllOut,
  transfer_freeze: copy.value.typeTransferFreeze,
  transfer_in: copy.value.typeTransferIn,
  transfer_in_rollback: copy.value.typeTransferInRollback,
  transfer_out: copy.value.typeTransferOut,
  transfer_out_rollback: copy.value.typeTransferOutRollback,
  transfer_recharge: copy.value.typeTransferRecharge,
  transfer_unfreeze: copy.value.typeTransferRelease,
  transfer_withdraw: copy.value.typeTransferWithdraw,
  user_type_convert: copy.value.typeUserTypeConvert,
  user_type_convert_equity_credit: copy.value.typeUserTypeConvertEquityCredit,
  user_type_convert_equity_debit: copy.value.typeUserTypeConvertEquityDebit,
  user_type_convert_estimated_close_fee: copy.value.typeUserTypeConvertEstimatedCloseFee,
  withdraw: copy.value.typeMarginWithdraw,
  withdraw_freeze: copy.value.typeWithdrawFreeze,
  withdraw_reject_refund: copy.value.typeWithdrawRejectRefund,
}))

const selectableBizTypes = [
  'recharge',
  'withdraw',
  'withdraw_reject_refund',
  'admin_recharge',
  'admin_deduct',
  'fee',
  'handling_fee',
  'funding_fee',
  'funding_fee_settle',
  'fee_commission',
  'commission_rebate',
  'transfer_in',
  'transfer_out',
  'transfer_all_out',
  'simulated_transfer_in',
  'simulated_transfer_out',
  'simulated_transfer_all_out',
  'user_type_convert_equity_debit',
  'user_type_convert_estimated_close_fee',
  'user_type_convert_equity_credit',
]

function normalizedSet(values: readonly string[]): Set<string> {
  return new Set(values.map(value => String(value).trim().toLowerCase()).filter(Boolean))
}

function bizTypeLabel(value: unknown): string {
  const normalized = String(value ?? '').trim().toLowerCase()
  return props.bizTypeLabels[normalized]
    || defaultBizTypeLabels.value[normalized]
    || displayValue(value)
}

const bizTypeOptions = computed(() => {
  const allowed = normalizedSet(props.allowedBizTypes)
  const hidden = normalizedSet(props.hiddenBizTypes)
  const grouped = new Map<string, { label: string, value: string }>()

  selectableBizTypes.forEach((value) => {
    const normalized = value.toLowerCase()
    if ((allowed.size > 0 && !allowed.has(normalized)) || hidden.has(normalized)) return
    const label = bizTypeLabel(normalized)
    const existing = grouped.get(label)
    if (existing) existing.value = `${existing.value},${normalized}`
    else grouped.set(label, { label, value: normalized })
  })

  return [
    { label: copy.value.allTypes, value: '' },
    ...grouped.values(),
  ]
})

const defaultQueryFields = computed<QueryBarField[]>(() => {
  const fields: QueryBarField[] = []
  if (props.showUserFilters) {
    fields.push(
      {
        key: 'user_id',
        label: copy.value.userUid,
        type: 'keyword',
        clearable: true,
        defaultValue: '',
        placeholder: copy.value.userUid,
        width: 150,
      },
      {
        key: 'username',
        label: copy.value.username,
        type: 'keyword',
        clearable: true,
        defaultValue: '',
        placeholder: copy.value.username,
        width: 160,
      },
      {
        key: 'user_type',
        label: copy.value.userType,
        type: 'segmented',
        defaultValue: '',
        options: [
          { label: copy.value.all, value: '' },
          { label: copy.value.live, value: 1 },
          { label: copy.value.internal, value: 2 },
        ],
        block: true,
        width: 154,
      },
    )
  }
  fields.push(
    {
      key: 'biz_type',
      label: copy.value.type,
      type: 'select',
      clearable: true,
      defaultValue: '',
      options: bizTypeOptions.value,
      placeholder: copy.value.allTypes,
      width: 180,
    },
    {
      key: 'time_range',
      label: copy.value.time,
      type: 'date-range',
      defaultValue: null,
      placeholder: `${copy.value.startTime} / ${copy.value.endTime}`,
      width: 280,
    },
  )
  return fields
})

const queryFields = computed<QueryBarField[]>(() => {
  const defaults = defaultQueryFields.value.map(field => ({ ...field }))
  const resolved = !props.queryFields
    ? defaults
    : typeof props.queryFields === 'function'
      ? props.queryFields(defaults)
      : props.queryFields
  return Array.isArray(resolved) ? resolved.map(field => ({ ...field })) : defaults
})

const inlineQueryFieldKeys = computed(() => queryFields.value.map(field => field.key))

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const columns: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 110, hideable: false },
    { key: 'username', dataIndex: 'username', title: copy.value.username, width: 140 },
    { key: 'user_type', dataIndex: 'user_type', title: copy.value.userType, width: 80 },
    { key: 'currency', dataIndex: 'currency', title: copy.value.currency, width: 105 },
    { key: 'biz_type', dataIndex: 'biz_type', title: copy.value.type, width: 100, sortable: true },
    { key: 'delta_amount', dataIndex: 'delta_amount', title: copy.value.balanceChange, width: 180, sortable: true },
    { key: 'balance_before', dataIndex: 'balance_before', title: copy.value.balanceBefore, width: 160, sortable: true },
    { key: 'balance_after', dataIndex: 'balance_after', title: copy.value.balanceAfter, width: 160, sortable: true },
    { key: 'created_at', dataIndex: 'created_at', title: copy.value.time, width: 168, hideable: false, sortable: true },
  ]
  if (props.showTransferAmount) {
    columns.splice(5, 0, {
      key: 'transfer_amount',
      dataIndex: 'transfer_amount',
      title: copy.value.transferAmount,
      width: 160,
    })
  }
  if (props.showTransferStatus) {
    columns.splice(columns.length - 1, 0, {
      key: 'transfer_status',
      title: copy.value.status,
      width: 100,
    })
  }
  return columns
})

const columns = computed<ProTableColumn<Row>[]>(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  const resolved = !props.columns
    ? defaults
    : typeof props.columns === 'function'
      ? props.columns(defaults)
      : props.columns
  return Array.isArray(resolved) ? resolved.map(column => ({ ...column })) : defaults
})

const forwardedSlotNames = computed(() => Object.keys(slots).filter(
  slotName => !managedSlotNames.has(slotName),
))

function scalarFilter(filters: QueryBarValue, key: string): string | number | boolean {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}

function apiDateTime(value: string | undefined, boundary: 'start' | 'end'): string {
  if (!value) return ''
  if (value.includes(' ')) return value
  return `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

function displayName(row: Row): string {
  return String(row.nice_name || row.user?.nice_name || row.username || row.user?.username || '-')
}

function userTypeValue(row: Row): unknown {
  return row.user_type ?? row.user?.user_type
}

function userTypeConfig(row: Row): { label: string, type: 'info' | 'success' | 'warning' } | null {
  const value = Number(userTypeValue(row))
  if (value === 1) return { label: copy.value.live, type: 'success' }
  if (value === 2) return { label: copy.value.internal, type: 'info' }
  if (value === 3) return { label: copy.value.robot, type: 'warning' }
  return null
}

function bizTypeTagType(value: unknown): TagType {
  return props.bizTypeTagTypes[String(value ?? '').trim().toLowerCase()] || 'default'
}

async function fetchMarginChanges({ filters, page, pageSize, signal, sort }: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
  sort: TableSortState
}) {
  const timeRange = Array.isArray(filters.time_range) ? filters.time_range : null
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const selectedBizTypes = String(scalarFilter(filters, 'biz_type'))
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
  const query: MarginChangeLogListQuery = {
    end_time: apiDateTime(timeRange?.[1], 'end'),
    include_zero_amount: props.includeZeroAmount ? 1 : 0,
    order_by: activeSort.key as MarginChangeLogListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    start_time: apiDateTime(timeRange?.[0], 'start'),
    user_id: String(scalarFilter(filters, 'user_id')).trim(),
    user_type: scalarFilter(filters, 'user_type'),
    username: String(scalarFilter(filters, 'username')).trim(),
  }
  if (selectedBizTypes.length > 1) query.biz_types = selectedBizTypes
  else if (selectedBizTypes.length === 1) query.biz_type = selectedBizTypes[0]
  else if (props.allowedBizTypes.length > 0) query.biz_types = [...props.allowedBizTypes]
  else query.biz_type = ''

  try {
    const result = await props.request(query, { filters: { ...filters }, signal })
    return {
      rows: Array.isArray(result.rows) ? result.rows : [],
      total: Math.max(0, Number(result.total) || 0),
      updatedAt: result.updatedAt,
    }
  }
  catch (error: unknown) {
    const candidate = error as { message?: string, msg?: string } | null
    throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
  }
}

const proTable = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters: {
    biz_type: '',
    time_range: null,
    user_id: '',
    username: '',
    user_type: '',
  },
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchMarginChanges,
})
const { proTableBindings } = proTable

defineExpose({ reload: proTable.reload })
</script>

<template>
  <div
    v-bind="$attrs"
    class="mm-margin-change-log-table"
    :class="{ 'is-fill-height': fillHeight }"
    data-mm-component="margin-change-log-table"
  >
    <MmProTable
      v-bind="proTableBindings"
      :aria-label="ariaLabel ?? copy.tableAria"
      :columns="columns"
      :columns-configurable="columnsConfigurable"
      :fill-height="fillHeight"
      :filter-drawer-subtitle="filterDrawerSubtitle ?? copy.filterSubtitle"
      :filter-drawer-title="filterDrawerTitle ?? copy.filterTitle"
      :inline-query-field-keys="inlineQueryFieldKeys"
      :page-sizes="pageSizes"
      row-key="id"
    >
      <template #cell-user_id="slotProps">
        <slot name="cell-user_id" v-bind="slotProps">{{ displayValue(slotProps.row.user_id) }}</slot>
      </template>

      <template #cell-username="slotProps">
        <slot name="cell-username" v-bind="slotProps">{{ displayName(slotProps.row) }}</slot>
      </template>

      <template #cell-user_type="slotProps">
        <slot name="cell-user_type" v-bind="slotProps">
          <MmTag v-if="userTypeConfig(slotProps.row)" effect="outline" round size="sm" :type="userTypeConfig(slotProps.row)?.type">
            {{ userTypeConfig(slotProps.row)?.label }}
          </MmTag>
          <span v-else>-</span>
        </slot>
      </template>

      <template #cell-currency="slotProps">
        <slot name="cell-currency" v-bind="slotProps">
          <span class="mm-margin-change-log-table__currency">{{ displayValue(slotProps.row.currency) }}</span>
        </slot>
      </template>

      <template #cell-biz_type="slotProps">
        <slot name="cell-biz_type" v-bind="slotProps" :label="bizTypeLabel(slotProps.row.biz_type)">
          <MmTag effect="soft" round size="sm" :type="bizTypeTagType(slotProps.row.biz_type)">
            {{ bizTypeLabel(slotProps.row.biz_type) }}
          </MmTag>
        </slot>
      </template>

      <template #cell-delta_amount="slotProps">
        <slot name="cell-delta_amount" v-bind="slotProps">
          <span
            class="mm-margin-change-log-table__amount"
            :class="{ 'is-positive': Number(slotProps.row.delta_amount) > 0, 'is-negative': Number(slotProps.row.delta_amount) < 0 }"
          >
            {{ formatMarginChangeAmount(slotProps.row.delta_amount) }}
          </span>
        </slot>
      </template>

      <template #cell-transfer_amount="slotProps">
        <slot name="cell-transfer_amount" v-bind="slotProps">
          <span class="mm-margin-change-log-table__number">{{ formatMarginTransferAmount(slotProps.row.transfer_amount) }}</span>
        </slot>
      </template>

      <template #cell-balance_before="slotProps">
        <slot name="cell-balance_before" v-bind="slotProps">
          <span class="mm-margin-change-log-table__number">{{ formatMarginChangeBalance(slotProps.row.balance_before) }}</span>
        </slot>
      </template>

      <template #cell-balance_after="slotProps">
        <slot name="cell-balance_after" v-bind="slotProps">
          <span class="mm-margin-change-log-table__number">{{ formatMarginChangeBalance(slotProps.row.balance_after) }}</span>
        </slot>
      </template>

      <template #cell-created_at="slotProps">
        <slot name="cell-created_at" v-bind="slotProps">
          {{ formatMarginChangeDateTime(slotProps.row.created_at) }}
        </slot>
      </template>

      <template #cell-transfer_status="slotProps">
        <slot name="cell-transfer_status" v-bind="slotProps">
          <MmTag effect="soft" round size="sm" type="success">{{ copy.completed }}</MmTag>
        </slot>
      </template>

      <template #query-actions="slotProps">
        <slot name="query-actions" v-bind="slotProps" />
      </template>

      <template #toolbar-actions>
        <slot name="toolbar-actions" />
      </template>

      <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>
    </MmProTable>
  </div>
</template>

<style src="./margin-change-log-table.css"></style>
