<script setup lang="ts" generic="Row extends TradeFillRow = TradeFillRow">
import { computed, ref, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import type { TableSortState } from '../table'
import {
  displayTradeFillValue,
  formatTradeFillFixed,
  formatTradeFillNumber,
  tradeFillExternalUserId,
  tradeFillUserUid,
} from './formatters'
import type {
  TradeFillListQuery,
  TradeFillRow,
  TradeFillTableActionHandler,
  TradeFillTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmTradeFillTable' })

const props = withDefaults(defineProps<TradeFillTableProps<Row>>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  includeRobotUserType: false,
  initialKeyword: '',
  initialPageSize: 20,
  pageSizes: () => [20, 30, 40],
  showUserType: true,
})

const { messages } = useLocale()
const copy = computed(() => messages.value.tradeFills)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'trade_time', order: 'desc' }
const sortableFields = new Set([
  'trade_time',
  'order_id',
  'position_id',
  'symbol',
  'side',
  'quantity',
  'price',
  'trade_value',
  'handling_fee',
  'role_type',
  'realized_pnl',
])
const managedSlotNames = new Set([
  'cell-order_id',
  'cell-user_uid',
  'cell-agent_user_id',
  'cell-user_type',
  'cell-position_id',
  'cell-symbol',
  'cell-product_category',
  'cell-margin_mode',
  'cell-side',
  'cell-quantity',
  'cell-price',
  'cell-trade_value',
  'cell-handling_fee',
  'cell-role_type',
  'cell-realized_pnl',
  'cell-trade_time',
  'cell-operation',
  'query-actions',
  'toolbar-actions',
])

const queryFields = computed<QueryBarField[]>(() => [
  {
    key: 'keyword',
    label: copy.value.keyword,
    type: 'keyword',
    defaultValue: props.initialKeyword,
    placeholder: copy.value.keywordPlaceholder,
    clearable: true,
    width: 250,
  },
  {
    key: 'symbol',
    label: copy.value.contract,
    type: 'keyword',
    defaultValue: '',
    placeholder: copy.value.symbolPlaceholder,
    clearable: true,
    width: 140,
  },
  {
    key: 'time_range',
    label: copy.value.tradeTime,
    type: 'date-range',
    defaultValue: null,
    placeholder: copy.value.timeRange,
    width: 250,
  },
  ...(props.showUserType
    ? [{
        key: 'user_type',
        label: copy.value.userType,
        type: 'segmented' as const,
        defaultValue: '',
        options: [
          { label: copy.value.all, value: '' },
          { label: copy.value.live, value: 1 },
          { label: copy.value.internal, value: 2 },
          ...(props.includeRobotUserType ? [{ label: copy.value.robot, value: 3 }] : []),
        ],
        block: true,
        width: props.includeRobotUserType ? 208 : 154,
      }]
    : []),
  {
    key: 'margin_mode',
    label: copy.value.marginMode,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.allMarginModes, value: '' },
      { label: copy.value.cross, value: 1 },
      { label: copy.value.isolated, value: 2 },
    ],
    width: 140,
  },
  {
    key: 'side',
    label: copy.value.side,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.allSides, value: '' },
      { label: copy.value.buy, value: 'buy' },
      { label: copy.value.sell, value: 'sell' },
    ],
    width: 130,
  },
  {
    key: 'role_type',
    label: copy.value.tradeRole,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.allRoles, value: '' },
      { label: copy.value.maker, value: 'maker' },
      { label: copy.value.taker, value: 'taker' },
    ],
    width: 130,
  },
])

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'order_id', dataIndex: 'order_id', title: copy.value.orderId, width: 120, hideable: false, sortable: true },
    { key: 'user_uid', title: copy.value.userUid, width: 120 },
    { key: 'agent_user_id', dataIndex: 'agent_user_id', title: copy.value.externalUserId, width: 100 },
    ...(props.showUserType
      ? [{ key: 'user_type', dataIndex: 'user_type', title: copy.value.userType, width: 80 }]
      : []),
    { key: 'position_id', dataIndex: 'position_id', title: copy.value.positionId, width: 120, sortable: true },
    { key: 'symbol', dataIndex: 'symbol', title: copy.value.contract, width: 120, sortable: true },
    { key: 'product_category', dataIndex: 'product_category', title: copy.value.productCategory, width: 80 },
    { key: 'margin_mode', title: copy.value.marginMode, width: 80 },
    { key: 'side', dataIndex: 'side', title: copy.value.side, width: 80, sortable: true },
    { key: 'quantity', dataIndex: 'quantity', title: copy.value.quantity, width: 100, sortable: true },
    { key: 'price', dataIndex: 'price', title: copy.value.price, width: 100, sortable: true },
    { key: 'trade_value', dataIndex: 'trade_value', title: copy.value.tradeValue, width: 100, sortable: true },
    { key: 'handling_fee', dataIndex: 'handling_fee', title: copy.value.handlingFee, width: 100, sortable: true },
    { key: 'role_type', dataIndex: 'role_type', title: copy.value.tradeRole, width: 80, sortable: true },
    { key: 'realized_pnl', dataIndex: 'realized_pnl', title: copy.value.realizedPnl, width: 120, sortable: true },
    { key: 'trade_time', dataIndex: 'trade_time', title: copy.value.tradeTime, width: 150, sortable: true },
  ]
  if (props.actions.detail || slots['cell-operation']) {
    result.push({ key: 'operation', title: copy.value.operation, width: 56, fixed: 'right', hideable: false })
  }
  return result
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
const loadingActions = ref(new Set<string>())

function scalarFilter(filters: QueryBarValue, key: string): string | number | boolean {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}

function apiDateTime(value: string | undefined, boundary: 'start' | 'end'): string {
  if (!value) return ''
  return value.includes(' ') ? value : `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

function userType(row: Row): unknown {
  return row.user_type ?? row.user?.user_type
}

function userTypeConfig(row: Row): { label: string, type: 'info' | 'success' | 'warning' } | null {
  const value = Number(userType(row))
  if (value === 1) return { label: copy.value.live, type: 'success' }
  if (value === 2) return { label: copy.value.internal, type: 'info' }
  if (value === 3) return { label: copy.value.robot, type: 'warning' }
  return null
}

function marginModeLabel(row: Row): string {
  if (Number(row.position?.margin_mode) === 1) return copy.value.cross
  if (Number(row.position?.margin_mode) === 2) return copy.value.isolated
  return '-'
}

function sideConfig(row: Row): { label: string, type: 'danger' | 'success' } | null {
  const side = String(row.side ?? '').toLowerCase()
  if (side === 'buy') return { label: copy.value.buy, type: 'success' }
  if (side === 'sell') return { label: copy.value.sell, type: 'danger' }
  return null
}

function roleConfig(row: Row): { label: string, type: 'success' | 'warning' } | null {
  const role = String(row.role_type ?? '').toLowerCase()
  if (role === 'maker') return { label: copy.value.maker, type: 'success' }
  if (role === 'taker') return { label: copy.value.taker, type: 'warning' }
  return null
}

function numberClass(value: unknown): 'is-loss' | 'is-neutral' | 'is-profit' {
  const amount = Number(value)
  if (amount > 0) return 'is-profit'
  if (amount < 0) return 'is-loss'
  return 'is-neutral'
}

function sideNumberClass(row: Row): 'is-buy' | 'is-sell' | '' {
  const side = String(row.side ?? '').toLowerCase()
  return side === 'buy' ? 'is-buy' : side === 'sell' ? 'is-sell' : ''
}

async function runAction(handler: TradeFillTableActionHandler<Row> | undefined, row: Row): Promise<void> {
  if (!handler) return
  const key = String(row.fill_id)
  if (loadingActions.value.has(key)) return
  loadingActions.value.add(key)
  try {
    await handler(row, { reload })
  }
  finally {
    loadingActions.value.delete(key)
  }
}

async function fetchTradeFills({ filters, page, pageSize, signal, sort }: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
  sort: TableSortState
}) {
  const timeRange = Array.isArray(filters.time_range) ? filters.time_range : null
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const query: TradeFillListQuery = {
    end_time: apiDateTime(timeRange?.[1], 'end'),
    keyword: String(scalarFilter(filters, 'keyword')),
    margin_mode: scalarFilter(filters, 'margin_mode'),
    order_by: activeSort.key as TradeFillListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    role_type: scalarFilter(filters, 'role_type'),
    side: scalarFilter(filters, 'side'),
    start_time: apiDateTime(timeRange?.[0], 'start'),
    symbol: String(scalarFilter(filters, 'symbol')),
    ...(props.showUserType ? { user_type: scalarFilter(filters, 'user_type') } : {}),
  }

  try {
    return await props.request(query, { signal })
  }
  catch (error: unknown) {
    const candidate = error as { message?: string, msg?: string } | null
    throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
  }
}

const { proTableBindings, reload } = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters: { keyword: props.initialKeyword },
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchTradeFills,
})

defineExpose({ reload })
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-trade-fill-table"
    :class="{ 'is-fill-height': fillHeight }"
    :aria-label="ariaLabel ?? messages.tradeFills.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? messages.tradeFills.filterTitle"
    :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.tradeFills.filterSubtitle"
    :page-sizes="pageSizes"
    row-key="fill_id"
  >
    <template #cell-order_id="slotProps">
      <slot name="cell-order_id" v-bind="slotProps"><span class="mm-trade-fill-table__id">{{ displayTradeFillValue(slotProps.row.order_id) }}</span></slot>
    </template>
    <template #cell-user_uid="slotProps">
      <slot name="cell-user_uid" v-bind="slotProps">{{ tradeFillUserUid(slotProps.row) }}</slot>
    </template>
    <template #cell-agent_user_id="slotProps">
      <slot name="cell-agent_user_id" v-bind="slotProps">{{ tradeFillExternalUserId(slotProps.row) }}</slot>
    </template>
    <template #cell-user_type="slotProps">
      <slot name="cell-user_type" v-bind="slotProps">
        <MmTag v-if="userTypeConfig(slotProps.row)" effect="outline" round size="sm" :type="userTypeConfig(slotProps.row)?.type">{{ userTypeConfig(slotProps.row)?.label }}</MmTag>
        <span v-else>-</span>
      </slot>
    </template>
    <template #cell-position_id="slotProps">
      <slot name="cell-position_id" v-bind="slotProps"><span class="mm-trade-fill-table__id">{{ displayTradeFillValue(slotProps.row.position_id) }}</span></slot>
    </template>
    <template #cell-symbol="slotProps">
      <slot name="cell-symbol" v-bind="slotProps">{{ displayTradeFillValue(slotProps.row.symbol) }}</slot>
    </template>
    <template #cell-product_category="slotProps">
      <slot name="cell-product_category" v-bind="slotProps"><MmTag effect="soft" round size="sm" type="primary">{{ displayTradeFillValue(slotProps.row.product_category_name || slotProps.row.product_category) }}</MmTag></slot>
    </template>
    <template #cell-margin_mode="slotProps">
      <slot name="cell-margin_mode" v-bind="slotProps">
        <MmTag v-if="marginModeLabel(slotProps.row) !== '-'" effect="soft" round size="sm" :type="Number(slotProps.row.position?.margin_mode) === 2 ? 'primary' : 'default'">{{ marginModeLabel(slotProps.row) }}</MmTag>
        <span v-else>-</span>
      </slot>
    </template>
    <template #cell-side="slotProps">
      <slot name="cell-side" v-bind="slotProps">
        <MmTag v-if="sideConfig(slotProps.row)" effect="soft" round size="sm" :type="sideConfig(slotProps.row)?.type">{{ sideConfig(slotProps.row)?.label }}</MmTag>
        <span v-else>-</span>
      </slot>
    </template>
    <template #cell-quantity="slotProps">
      <slot name="cell-quantity" v-bind="slotProps"><span class="mm-trade-fill-table__number" :class="sideNumberClass(slotProps.row)">{{ formatTradeFillNumber(slotProps.row.quantity) }}</span></slot>
    </template>
    <template #cell-price="slotProps">
      <slot name="cell-price" v-bind="slotProps"><span class="mm-trade-fill-table__number">{{ formatTradeFillNumber(slotProps.row.price) }}</span></slot>
    </template>
    <template #cell-trade_value="slotProps">
      <slot name="cell-trade_value" v-bind="slotProps"><span class="mm-trade-fill-table__number">{{ formatTradeFillNumber(slotProps.row.trade_value) }}</span></slot>
    </template>
    <template #cell-handling_fee="slotProps">
      <slot name="cell-handling_fee" v-bind="slotProps"><span class="mm-trade-fill-table__number">{{ formatTradeFillNumber(slotProps.row.handling_fee) }}</span></slot>
    </template>
    <template #cell-role_type="slotProps">
      <slot name="cell-role_type" v-bind="slotProps">
        <MmTag v-if="roleConfig(slotProps.row)" effect="soft" round size="sm" :type="roleConfig(slotProps.row)?.type">{{ roleConfig(slotProps.row)?.label }}</MmTag>
        <span v-else>-</span>
      </slot>
    </template>
    <template #cell-realized_pnl="slotProps">
      <slot name="cell-realized_pnl" v-bind="slotProps"><span class="mm-trade-fill-table__number" :class="numberClass(slotProps.row.realized_pnl)">{{ formatTradeFillFixed(slotProps.row.realized_pnl) }}</span></slot>
    </template>
    <template #cell-trade_time="slotProps">
      <slot name="cell-trade_time" v-bind="slotProps">{{ displayTradeFillValue(slotProps.row.trade_time) }}</slot>
    </template>
    <template #cell-operation="slotProps">
      <slot name="cell-operation" v-bind="slotProps" :detail="() => runAction(actions.detail, slotProps.row)">
        <div class="mm-trade-fill-table__actions">
          <MmButton v-if="actions.detail" :aria-label="messages.tradeFills.viewDetailFor(displayTradeFillValue(slotProps.row.fill_id))" icon-only size="sm" :loading="loadingActions.has(String(slotProps.row.fill_id))" :title="messages.tradeFills.viewDetail" @click.stop="runAction(actions.detail, slotProps.row)">
            <template #icon><MmIcon name="panel-left-close" :size="15" /></template>
          </MmButton>
        </div>
      </slot>
    </template>
    <template #query-actions="slotProps"><slot name="query-actions" v-bind="slotProps" /></template>
    <template #toolbar-actions><slot name="toolbar-actions" /></template>
    <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style src="./trade-fill-table.css"></style>
