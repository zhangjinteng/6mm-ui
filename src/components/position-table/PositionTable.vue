<script setup lang="ts" generic="Row extends PositionRow = PositionRow">
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
  calculatePositionPnl,
  calculatePositionRoe,
  calculatePositionValue,
  formatPositionAmount,
  formatPositionOptionalPrice,
  formatPositionPrice,
  formatPositionQuantity,
  formatSignedPositionAmount,
  formatSignedPositionPercent,
  resolvePositionMarkPrice,
} from './formatters'
import type {
  PositionListQuery,
  PositionRow,
  PositionTableActionHandler,
  PositionTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmPositionTable' })

const props = withDefaults(defineProps<PositionTableProps<Row>>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  includeRobotUserType: false,
  initialKeyword: '',
  initialPageSize: 20,
  marketPrices: () => ({}),
  pageSizes: () => [20, 30, 40],
  showUserType: true,
})

const { messages } = useLocale()
const copy = computed(() => messages.value.currentPositions)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'position_id', order: 'desc' }
const sortableFields = new Set([
  'position_id',
  'symbol',
  'margin_mode',
  'position_side',
  'leverage',
  'quantity',
  'entry_price',
  'created_at',
])
const managedSlotNames = new Set([
  'cell-user_id',
  'cell-user_type',
  'cell-position_id',
  'cell-symbol',
  'cell-product_category',
  'cell-position_side',
  'cell-margin_mode',
  'cell-position_value',
  'cell-mark_price',
  'cell-pnl',
  'cell-return_rate',
  'cell-liq_price',
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
    width: 230,
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
    key: 'symbol',
    label: copy.value.contract,
    type: 'keyword',
    defaultValue: '',
    placeholder: copy.value.symbolPlaceholder,
    clearable: true,
    width: 150,
  },
  {
    key: 'margin_mode',
    label: copy.value.marginMode,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.cross, value: 1 },
      { label: copy.value.isolated, value: 2 },
    ],
    width: 150,
  },
  {
    key: 'position_side',
    label: copy.value.side,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.long, value: 'long' },
      { label: copy.value.short, value: 'short' },
    ],
    width: 150,
  },
  {
    key: 'leverage',
    label: copy.value.leverage,
    type: 'keyword',
    defaultValue: '',
    placeholder: copy.value.leveragePlaceholder,
    clearable: true,
    width: 140,
  },
  {
    key: 'open_time',
    label: copy.value.openTime,
    type: 'date-range',
    defaultValue: null,
    placeholder: copy.value.openTime,
    shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'],
    width: 280,
  },
])

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 110, hideable: false },
    ...(props.showUserType
      ? [{ key: 'user_type', dataIndex: 'user_type', title: copy.value.userType, width: 80 }]
      : []),
    { key: 'position_id', dataIndex: 'id', title: copy.value.positionId, width: 110, sortable: true },
    { key: 'symbol', dataIndex: 'symbol', title: copy.value.contract, width: 120, sortable: true },
    { key: 'product_category', dataIndex: 'product_category', title: copy.value.productCategory, width: 100 },
    { key: 'position_side', dataIndex: 'position_side', title: copy.value.side, width: 80, sortable: true },
    { key: 'margin_mode', dataIndex: 'margin_mode', title: copy.value.marginMode, width: 80, sortable: true },
    { key: 'leverage', dataIndex: 'leverage', title: copy.value.leverage, width: 70, sortable: true, formatter: value => value == null || value === '' ? '-' : `${value}x` },
    { key: 'quantity', dataIndex: 'quantity', title: copy.value.quantity, width: 110, sortable: true, formatter: formatPositionQuantity },
    { key: 'position_value', dataIndex: 'position_value', title: copy.value.positionValue, width: 125 },
    { key: 'entry_price', dataIndex: 'entry_price', title: copy.value.entryPrice, width: 115, sortable: true, formatter: formatPositionPrice },
    { key: 'mark_price', title: copy.value.markPrice, width: 115 },
    { key: 'pnl', title: copy.value.unrealizedPnl, width: 110 },
    { key: 'return_rate', title: copy.value.returnRate, width: 80 },
    { key: 'liq_price', dataIndex: 'liq_price', title: copy.value.liquidationPrice, width: 125 },
    { key: 'created_at', dataIndex: 'created_at', title: copy.value.openTime, width: 150, sortable: true },
  ]
  if (props.actions.detail || props.actions.close || slots['cell-operation']) {
    result.push({ key: 'operation', title: copy.value.operation, width: 88, fixed: 'right', hideable: false })
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
type ActionKey = keyof NonNullable<PositionTableProps<Row>['actions']>
const loadingActions = ref(new Set<string>())

function scalarFilter(filters: QueryBarValue, key: string): string | number | boolean {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}

function apiDateTime(value: string | undefined, boundary: 'start' | 'end'): string {
  if (!value) return ''
  return value.includes(' ') ? value : `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
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

function sideConfig(row: Row): { label: string, type: 'danger' | 'success' } | null {
  const side = String(row.position_side ?? '').toLowerCase()
  if (side === 'long') return { label: copy.value.long, type: 'success' }
  if (side === 'short') return { label: copy.value.short, type: 'danger' }
  return null
}

function marginModeLabel(row: Row): string {
  if (Number(row.margin_mode) === 1) return copy.value.cross
  if (Number(row.margin_mode) === 2) return copy.value.isolated
  return '-'
}

function productCategoryLabel(value: unknown, name?: unknown): string {
  const configuredName = String(name ?? '').trim()
  if (configuredName) return configuredName
  const normalized = String(value ?? '').trim().toLowerCase()
  if (['crypto', 'cryptocurrency', '加密货币'].includes(normalized)) return copy.value.productCategoryCrypto
  return displayValue(value)
}

function markPrice(row: Row): number {
  return resolvePositionMarkPrice(row, props.marketPrices)
}

function positionValue(row: Row): number {
  return calculatePositionValue(row, props.marketPrices)
}

function pnl(row: Row): number {
  return calculatePositionPnl(row, props.marketPrices)
}

function roe(row: Row): number {
  return calculatePositionRoe(row, props.marketPrices)
}

function changeClass(value: number): string {
  if (value > 0) return 'is-profit'
  if (value < 0) return 'is-loss'
  return 'is-neutral'
}

function actionKey(action: ActionKey, row: Row): string {
  return `${action}:${String(row.id)}`
}

function isActionLoading(action: ActionKey, row: Row): boolean {
  return loadingActions.value.has(actionKey(action, row))
}

async function runAction(action: ActionKey, handler: PositionTableActionHandler<Row> | undefined, row: Row): Promise<void> {
  if (!handler) return
  const key = actionKey(action, row)
  if (loadingActions.value.has(key)) return
  loadingActions.value.add(key)
  try {
    await handler(row, { reload })
  }
  finally {
    loadingActions.value.delete(key)
  }
}

async function fetchPositions({ filters, page, pageSize, signal, sort }: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
  sort: TableSortState
}) {
  const openTime = Array.isArray(filters.open_time) ? filters.open_time : null
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const query: PositionListQuery = {
    end_time: apiDateTime(openTime?.[1], 'end'),
    keyword: String(scalarFilter(filters, 'keyword')),
    leverage: scalarFilter(filters, 'leverage'),
    margin_mode: scalarFilter(filters, 'margin_mode'),
    order_by: activeSort.key as PositionListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    position_side: String(scalarFilter(filters, 'position_side')),
    start_time: apiDateTime(openTime?.[0], 'start'),
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
  request: fetchPositions,
})

defineExpose({ reload })
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-position-table"
    :class="{ 'is-fill-height': fillHeight }"
    :aria-label="ariaLabel ?? messages.currentPositions.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? messages.currentPositions.filterTitle"
    :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.currentPositions.filterSubtitle"
    :page-sizes="pageSizes"
    row-key="id"
  >
    <template #cell-user_id="slotProps">
      <slot name="cell-user_id" v-bind="slotProps">{{ displayValue(slotProps.row.user_id) }}</slot>
    </template>

    <template #cell-user_type="slotProps">
      <slot name="cell-user_type" v-bind="slotProps">
        <MmTag v-if="userTypeConfig(slotProps.row)" effect="outline" round size="sm" :type="userTypeConfig(slotProps.row)?.type">
          {{ userTypeConfig(slotProps.row)?.label }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>

    <template #cell-position_id="slotProps">
      <slot name="cell-position_id" v-bind="slotProps">
        <span class="mm-position-table__id">{{ displayValue(slotProps.row.id) }}</span>
      </slot>
    </template>

    <template #cell-symbol="slotProps">
      <slot name="cell-symbol" v-bind="slotProps">{{ displayValue(slotProps.row.symbol) }}</slot>
    </template>

    <template #cell-product_category="slotProps">
      <slot name="cell-product_category" v-bind="slotProps">
        <MmTag effect="soft" round size="sm" type="primary">{{ productCategoryLabel(slotProps.row.product_category, slotProps.row.product_category_name) }}</MmTag>
      </slot>
    </template>

    <template #cell-position_side="slotProps">
      <slot name="cell-position_side" v-bind="slotProps">
        <MmTag v-if="sideConfig(slotProps.row)" effect="soft" round size="sm" :type="sideConfig(slotProps.row)?.type">
          {{ sideConfig(slotProps.row)?.label }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>

    <template #cell-margin_mode="slotProps">
      <slot name="cell-margin_mode" v-bind="slotProps">
        <MmTag effect="soft" round size="sm" :type="Number(slotProps.row.margin_mode) === 2 ? 'primary' : 'default'">
          {{ marginModeLabel(slotProps.row) }}
        </MmTag>
      </slot>
    </template>

    <template #cell-position_value="slotProps">
      <slot name="cell-position_value" v-bind="slotProps" :value="positionValue(slotProps.row)">
        <span class="mm-position-table__number">{{ formatPositionAmount(positionValue(slotProps.row)) }}</span>
      </slot>
    </template>

    <template #cell-mark_price="slotProps">
      <slot name="cell-mark_price" v-bind="slotProps" :value="markPrice(slotProps.row)">
        <span class="mm-position-table__number">{{ formatPositionPrice(markPrice(slotProps.row)) }}</span>
      </slot>
    </template>

    <template #cell-pnl="slotProps">
      <slot name="cell-pnl" v-bind="slotProps" :value="pnl(slotProps.row)">
        <span class="mm-position-table__change" :class="changeClass(pnl(slotProps.row))">
          {{ formatSignedPositionAmount(pnl(slotProps.row)) }}
        </span>
      </slot>
    </template>

    <template #cell-return_rate="slotProps">
      <slot name="cell-return_rate" v-bind="slotProps" :value="roe(slotProps.row)">
        <span class="mm-position-table__change" :class="changeClass(roe(slotProps.row))">
          {{ formatSignedPositionPercent(roe(slotProps.row)) }}
        </span>
      </slot>
    </template>

    <template #cell-liq_price="slotProps">
      <slot name="cell-liq_price" v-bind="slotProps">
        <span class="mm-position-table__number">{{ formatPositionOptionalPrice(slotProps.row.liq_price) }}</span>
      </slot>
    </template>

    <template #cell-operation="slotProps">
      <slot
        name="cell-operation"
        v-bind="slotProps"
        :close="() => runAction('close', actions.close, slotProps.row)"
        :detail="() => runAction('detail', actions.detail, slotProps.row)"
      >
        <div class="mm-position-table__actions">
          <MmButton
            v-if="actions.detail"
            :aria-label="messages.currentPositions.viewDetails"
            icon-only
            size="sm"
            :loading="isActionLoading('detail', slotProps.row)"
            :title="messages.currentPositions.viewDetails"
            @click.stop="runAction('detail', actions.detail, slotProps.row)"
          >
            <MmIcon name="panel-left-close" :size="15" />
          </MmButton>
          <MmButton
            v-if="actions.close"
            :aria-label="messages.currentPositions.closePosition"
            icon-only
            plain
            size="sm"
            :loading="isActionLoading('close', slotProps.row)"
            :title="messages.currentPositions.closePosition"
            variant="danger"
            @click.stop="runAction('close', actions.close, slotProps.row)"
          >
            <MmIcon name="x" :size="15" />
          </MmButton>
        </div>
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
</template>

<style src="./position-table.css"></style>
