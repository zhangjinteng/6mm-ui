<script setup lang="ts" generic="Row extends FeeCommissionRow = FeeCommissionRow">
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
  displayFeeCommissionValue,
  formatFeeCommissionNumber,
  formatFeeCommissionQuantity,
} from './formatters'
import type {
  FeeCommissionListQuery,
  FeeCommissionRow,
  FeeCommissionTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmFeeCommissionTable' })

const props = withDefaults(defineProps<FeeCommissionTableProps<Row>>(), {
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  initialPageSize: 20,
  pageSizes: () => [20, 30, 40],
  showCommissionAmount: true,
})

const { messages } = useLocale()
const copy = computed(() => messages.value.feeCommissions)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'trade_time', order: 'desc' }
const sortableFields = new Set([
  'commission_amount',
  'handling_fee',
  'order_id',
  'position_id',
  'public_user_id',
  'trade_time',
  'trade_value',
  'user_id',
])
const managedSlotNames = new Set([
  'cell-order_id',
  'cell-public_user_id',
  'cell-agent_user_id',
  'cell-position_id',
  'cell-symbol',
  'cell-margin_mode',
  'cell-side',
  'cell-quantity',
  'cell-price',
  'cell-trade_value',
  'cell-handling_fee',
  'cell-role_type',
  'cell-commission_amount',
  'cell-trade_time',
  'query-actions',
  'toolbar-actions',
])

const defaultQueryFields = computed<QueryBarField[]>(() => [
  {
    key: 'keyword',
    label: copy.value.keyword,
    type: 'keyword',
    clearable: true,
    defaultValue: '',
    placeholder: copy.value.keywordPlaceholder,
    width: 240,
  },
  {
    key: 'symbol',
    label: copy.value.symbol,
    type: 'keyword',
    clearable: true,
    defaultValue: '',
    placeholder: copy.value.symbolPlaceholder,
    width: 130,
  },
  {
    key: 'margin_mode',
    label: copy.value.marginMode,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.marginModeAll, value: '' },
      { label: copy.value.cross, value: 'cross' },
      { label: copy.value.isolated, value: 'isolated' },
    ],
    placeholder: copy.value.marginModeAll,
    width: 130,
  },
  {
    key: 'side',
    label: copy.value.side,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.sideAll, value: '' },
      { label: copy.value.buy, value: 'buy' },
      { label: copy.value.sell, value: 'sell' },
    ],
    placeholder: copy.value.sideAll,
    width: 120,
  },
  {
    key: 'role_type',
    label: copy.value.roleType,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.roleAll, value: '' },
      { label: copy.value.roleMaker, value: 'maker' },
      { label: copy.value.roleTaker, value: 'taker' },
    ],
    placeholder: copy.value.roleAll,
    width: 120,
  },
  {
    key: 'time_range',
    label: copy.value.time,
    type: 'date-range',
    defaultValue: null,
    placeholder: `${copy.value.startTime} / ${copy.value.endTime}`,
    width: 240,
  },
])

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
    { key: 'order_id', dataIndex: 'order_id', title: copy.value.orderId, width: 140, hideable: false, sortable: true },
    { key: 'public_user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 110, sortable: true },
    { key: 'agent_user_id', dataIndex: 'agent_user_id', title: copy.value.externalUserId, width: 150 },
    { key: 'position_id', dataIndex: 'position_id', title: copy.value.positionId, width: 140, sortable: true },
    { key: 'symbol', dataIndex: 'symbol', title: copy.value.symbol, width: 120 },
    { key: 'margin_mode', dataIndex: 'margin_mode', title: copy.value.marginMode, width: 88 },
    { key: 'side', dataIndex: 'side', title: copy.value.side, width: 76 },
    { key: 'quantity', dataIndex: 'quantity', title: copy.value.filledQuantity, width: 120 },
    { key: 'price', dataIndex: 'price', title: copy.value.filledPrice, width: 110 },
    { key: 'trade_value', dataIndex: 'trade_value', title: copy.value.filledAmount, width: 120, sortable: true },
    { key: 'handling_fee', dataIndex: 'handling_fee', title: copy.value.handlingFee, width: 110, sortable: true },
    { key: 'role_type', dataIndex: 'role_type', title: copy.value.roleType, width: 90 },
    { key: 'trade_time', dataIndex: 'trade_time', title: copy.value.time, width: 168, sortable: true },
  ]
  if (props.showCommissionAmount) {
    columns.splice(columns.length - 1, 0, {
      key: 'commission_amount',
      dataIndex: 'commission_amount',
      title: copy.value.commissionAmount,
      width: 130,
      sortable: true,
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

function agentUserId(row: Row): unknown {
  return row.agent_user_id ?? row.user?.agent_user_id
}

function marginModeLabel(value: unknown): string {
  const normalized = String(value ?? '').toLowerCase()
  if (normalized === 'cross' || normalized === '1') return copy.value.cross
  if (normalized === 'isolated' || normalized === '2') return copy.value.isolated
  return '-'
}

function marginModeTagType(value: unknown): TagType {
  const normalized = String(value ?? '').toLowerCase()
  return normalized === 'isolated' || normalized === '2' ? 'primary' : 'default'
}

function sideLabel(value: unknown): string {
  const normalized = String(value ?? '').toLowerCase()
  if (normalized === 'buy') return copy.value.buy
  if (normalized === 'sell') return copy.value.sell
  return '-'
}

function sideTagType(value: unknown): TagType {
  const normalized = String(value ?? '').toLowerCase()
  if (normalized === 'buy') return 'success'
  if (normalized === 'sell') return 'danger'
  return 'info'
}

function roleLabel(value: unknown): string {
  const normalized = String(value ?? '').toLowerCase()
  if (normalized === 'maker') return copy.value.roleMaker
  if (normalized === 'taker') return copy.value.roleTaker
  return '-'
}

function roleTagType(value: unknown): TagType {
  return String(value ?? '').toLowerCase() === 'maker' ? 'primary' : 'warning'
}

async function fetchFeeCommissions({ filters, page, pageSize, signal, sort }: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
  sort: TableSortState
}) {
  const timeRange = Array.isArray(filters.time_range) ? filters.time_range : null
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const query: FeeCommissionListQuery = {
    end_time: apiDateTime(timeRange?.[1], 'end'),
    keyword: String(scalarFilter(filters, 'keyword')).trim(),
    margin_mode: scalarFilter(filters, 'margin_mode'),
    order_by: activeSort.key as FeeCommissionListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    role_type: scalarFilter(filters, 'role_type'),
    side: scalarFilter(filters, 'side'),
    start_time: apiDateTime(timeRange?.[0], 'start'),
    symbol: String(scalarFilter(filters, 'symbol')).trim(),
  }

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
    keyword: '',
    margin_mode: '',
    role_type: '',
    side: '',
    symbol: '',
    time_range: null,
  },
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchFeeCommissions,
})
const { proTableBindings } = proTable

defineExpose({ reload: proTable.reload })
</script>

<template>
  <div
    v-bind="$attrs"
    class="mm-fee-commission-table"
    :class="{ 'is-fill-height': fillHeight }"
    data-mm-component="fee-commission-table"
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
      <template #cell-order_id="slotProps">
        <slot name="cell-order_id" v-bind="slotProps">
          <span class="mm-fee-commission-table__order-id">{{ displayFeeCommissionValue(slotProps.row.order_id) }}</span>
        </slot>
      </template>

      <template #cell-public_user_id="slotProps">
        <slot name="cell-public_user_id" v-bind="slotProps">{{ displayFeeCommissionValue(slotProps.row.user_id) }}</slot>
      </template>

      <template #cell-agent_user_id="slotProps">
        <slot name="cell-agent_user_id" v-bind="slotProps">{{ displayFeeCommissionValue(agentUserId(slotProps.row)) }}</slot>
      </template>

      <template #cell-position_id="slotProps">
        <slot name="cell-position_id" v-bind="slotProps">
          <span class="mm-fee-commission-table__number">{{ displayFeeCommissionValue(slotProps.row.position_id) }}</span>
        </slot>
      </template>

      <template #cell-symbol="slotProps">
        <slot name="cell-symbol" v-bind="slotProps">{{ displayFeeCommissionValue(slotProps.row.symbol) }}</slot>
      </template>

      <template #cell-margin_mode="slotProps">
        <slot name="cell-margin_mode" v-bind="slotProps" :label="marginModeLabel(slotProps.row.margin_mode)">
          <MmTag effect="soft" round size="sm" :type="marginModeTagType(slotProps.row.margin_mode)">
            {{ marginModeLabel(slotProps.row.margin_mode) }}
          </MmTag>
        </slot>
      </template>

      <template #cell-side="slotProps">
        <slot name="cell-side" v-bind="slotProps" :label="sideLabel(slotProps.row.side)">
          <MmTag effect="soft" round size="sm" :type="sideTagType(slotProps.row.side)">
            {{ sideLabel(slotProps.row.side) }}
          </MmTag>
        </slot>
      </template>

      <template #cell-quantity="slotProps">
        <slot name="cell-quantity" v-bind="slotProps">
          <span
            class="mm-fee-commission-table__number"
            :class="{ 'is-buy': String(slotProps.row.side).toLowerCase() === 'buy', 'is-sell': String(slotProps.row.side).toLowerCase() === 'sell' }"
          >
            {{ formatFeeCommissionQuantity(slotProps.row) }}
          </span>
        </slot>
      </template>

      <template #cell-price="slotProps">
        <slot name="cell-price" v-bind="slotProps">
          <span class="mm-fee-commission-table__number">{{ formatFeeCommissionNumber(slotProps.row.price, 2) }}</span>
        </slot>
      </template>

      <template #cell-trade_value="slotProps">
        <slot name="cell-trade_value" v-bind="slotProps">
          <span class="mm-fee-commission-table__number">{{ formatFeeCommissionNumber(slotProps.row.trade_value, 2) }}</span>
        </slot>
      </template>

      <template #cell-handling_fee="slotProps">
        <slot name="cell-handling_fee" v-bind="slotProps">
          <span class="mm-fee-commission-table__number">{{ formatFeeCommissionNumber(slotProps.row.handling_fee, 4) }}</span>
        </slot>
      </template>

      <template #cell-role_type="slotProps">
        <slot name="cell-role_type" v-bind="slotProps" :label="roleLabel(slotProps.row.role_type)">
          <MmTag effect="soft" round size="sm" :type="roleTagType(slotProps.row.role_type)">
            {{ roleLabel(slotProps.row.role_type) }}
          </MmTag>
        </slot>
      </template>

      <template #cell-commission_amount="slotProps">
        <slot name="cell-commission_amount" v-bind="slotProps">
          <span class="mm-fee-commission-table__commission">{{ formatFeeCommissionNumber(slotProps.row.commission_amount, 4) }}</span>
        </slot>
      </template>

      <template #cell-trade_time="slotProps">
        <slot name="cell-trade_time" v-bind="slotProps">
          <span class="mm-fee-commission-table__time">{{ displayFeeCommissionValue(slotProps.row.trade_time) }}</span>
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

<style src="./fee-commission-table.css"></style>
