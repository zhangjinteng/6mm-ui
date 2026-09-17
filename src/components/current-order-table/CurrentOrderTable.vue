<script setup lang="ts" generic="Row extends CurrentOrderRow = CurrentOrderRow">
import { computed, ref, useSlots, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmProTable, MmProTableCursorPagination } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import {
  formatCurrentOrderPrice,
  formatCurrentOrderQuantity,
  isCurrentOrderFlag,
} from './formatters'
import type {
  CurrentOrderListQuery,
  CurrentOrderRow,
  CurrentOrderTableActionHandler,
  CurrentOrderTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmCurrentOrderTable' })

const props = withDefaults(defineProps<CurrentOrderTableProps<Row>>(), {
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
const copy = computed(() => messages.value.currentOrders)
const slots = useSlots()
const managedSlotNames = new Set([
  'cell-user_id',
  'cell-user_type',
  'cell-order_id',
  'cell-symbol',
  'cell-product_category',
  'cell-side',
  'cell-margin_mode',
  'cell-leverage',
  'cell-price',
  'cell-quantity',
  'cell-filled_quantity',
  'cell-operation',
  'query-actions',
  'toolbar-actions',
])

const defaultQueryFields = computed<QueryBarField[]>(() => [
  {
    key: 'keyword',
    label: copy.value.keyword,
    type: 'keyword',
    defaultValue: props.initialKeyword,
    placeholder: copy.value.keywordPlaceholder,
    clearable: true,
    width: 210,
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
    width: 140,
  },
  {
    key: 'order_type',
    label: copy.value.orderType,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.limitOrder, value: 'limit' },
      { label: copy.value.marketOrder, value: 'market' },
    ],
    width: 140,
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
    width: 132,
  },
  {
    key: 'side',
    label: copy.value.side,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.buy, value: 'buy' },
      { label: copy.value.sell, value: 'sell' },
    ],
    width: 120,
  },
  {
    key: 'leverage',
    label: copy.value.leverage,
    type: 'keyword',
    defaultValue: '',
    placeholder: copy.value.leveragePlaceholder,
    clearable: true,
    width: 118,
  },
  {
    key: 'reduce_only',
    label: copy.value.reduceOnly,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.reduceOnly, value: 1 },
      { label: copy.value.nonReduceOnly, value: 0 },
    ],
    width: 132,
  },
  {
    key: 'maker_only',
    label: copy.value.makerOnly,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.makerOnly, value: 1 },
      { label: copy.value.nonMakerOnly, value: 0 },
    ],
    width: 132,
  },
  {
    key: 'time_range',
    label: copy.value.orderTime,
    type: 'date-range',
    defaultValue: null,
    placeholder: `${copy.value.startTime} - ${copy.value.endTime}`,
    width: 224,
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

const orderStatusLabels = computed<Record<number, string>>(() => ({
  0: copy.value.newOrder,
  1: copy.value.pending,
  2: copy.value.partiallyFilled,
  3: copy.value.filled,
  4: copy.value.canceled,
  5: copy.value.rejected,
  6: copy.value.partiallyFilledCanceled,
}))

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
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

function sideConfig(row: Row): { label: string, type: 'danger' | 'success' } | null {
  const side = String(row.side ?? '').toLowerCase()
  if (side === 'buy') return { label: copy.value.buy, type: 'success' }
  if (side === 'sell') return { label: copy.value.sell, type: 'danger' }
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

function orderTypeLabel(row: Row): string {
  const orderType = String(row.order_type ?? '').toLowerCase()
  if (orderType === 'limit' && isCurrentOrderFlag(row.maker_only)) return copy.value.limitMaker
  if (orderType === 'limit') return copy.value.limitOrder
  if (orderType === 'market') return copy.value.marketOrder
  return displayValue(row.order_type)
}

function orderStatusLabel(row: Row): string {
  return orderStatusLabels.value[Number(row.order_status)] || displayValue(row.order_status_parse ?? row.order_status)
}

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 126, hideable: false },
    ...(props.showUserType
      ? [{ key: 'user_type', dataIndex: 'user_type', title: copy.value.userType, width: 80 }]
      : []),
    { key: 'order_id', dataIndex: 'order_id', title: copy.value.orderId, width: 150 },
    { key: 'symbol', dataIndex: 'symbol', title: copy.value.contract, width: 130 },
    { key: 'product_category', dataIndex: 'product_category', title: copy.value.productCategory, width: 100 },
    { key: 'side', dataIndex: 'side', title: copy.value.side, width: 80 },
    { key: 'margin_mode', dataIndex: 'margin_mode', title: copy.value.marginMode, width: 100 },
    { key: 'order_type', dataIndex: 'order_type', title: copy.value.orderType, width: 110, formatter: (_value, row) => orderTypeLabel(row) },
    { key: 'leverage', dataIndex: 'leverage', title: copy.value.leverage, width: 100, formatter: value => value == null || value === '' ? '-' : `${value}x` },
    { key: 'price', dataIndex: 'price', title: copy.value.orderPrice, width: 110, formatter: formatCurrentOrderPrice },
    { key: 'quantity', dataIndex: 'quantity', title: copy.value.orderQuantity, width: 130, formatter: formatCurrentOrderQuantity },
    { key: 'filled_quantity', dataIndex: 'filled_quantity', title: copy.value.filledQuantity, width: 126, formatter: formatCurrentOrderQuantity },
    { key: 'reduce_only', dataIndex: 'reduce_only', title: copy.value.reduceOnly, width: 110, formatter: value => isCurrentOrderFlag(value) ? copy.value.yes : copy.value.no },
    { key: 'order_status', dataIndex: 'order_status', title: copy.value.orderStatus, width: 110, formatter: (_value, row) => orderStatusLabel(row) },
    { key: 'created_at', dataIndex: 'created_at', title: copy.value.orderTime, width: 180, formatter: displayValue },
  ]
  if (props.actions.detail || props.actions.cancel || slots['cell-operation']) {
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
const activeCursor = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const cursorStack = ref<(string | null)[]>([null])
const hasMore = ref(false)

function resetCursorPagination(): void {
  activeCursor.value = null
  nextCursor.value = null
  cursorStack.value = [null]
  hasMore.value = false
}

function scalarFilter(filters: QueryBarValue, key: string): string | number | boolean {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}

function apiDateTime(value: string | undefined, boundary: 'start' | 'end'): string {
  if (!value) return ''
  if (value.includes(' ')) return value
  return `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

async function fetchOrders({ filters, pageSize, signal }: {
  filters: QueryBarValue
  pageSize: number
  signal: AbortSignal
}) {
  const timeRange = Array.isArray(filters.time_range) ? filters.time_range : null
  const query: CurrentOrderListQuery = {
    cursor: activeCursor.value || undefined,
    end_time: apiDateTime(timeRange?.[1], 'end'),
    keyword: String(scalarFilter(filters, 'keyword')),
    leverage: scalarFilter(filters, 'leverage'),
    maker_only: scalarFilter(filters, 'maker_only'),
    margin_mode: scalarFilter(filters, 'margin_mode'),
    order_status: [],
    order_type: scalarFilter(filters, 'order_type'),
    page_size: pageSize,
    reduce_only: scalarFilter(filters, 'reduce_only'),
    side: scalarFilter(filters, 'side'),
    start_time: apiDateTime(timeRange?.[0], 'start'),
    symbol: String(scalarFilter(filters, 'symbol')),
    ...(props.showUserType ? { user_type: scalarFilter(filters, 'user_type') } : {}),
  }

  try {
    const result = await props.request(query, { filters: { ...filters }, signal })
    if (!signal.aborted) {
      nextCursor.value = result.nextCursor || null
      hasMore.value = Boolean(result.hasMore && nextCursor.value)
    }
    return { rows: Array.isArray(result.rows) ? result.rows : [], total: 0, updatedAt: result.updatedAt }
  }
  catch (error: unknown) {
    const candidate = error as { message?: string, msg?: string } | null
    throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
  }
}

const proTable = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters: { keyword: props.initialKeyword },
  initialPageSize: props.initialPageSize,
  queryFields,
  request: fetchOrders,
})
const { currentPage, filters, loading, pageSize, refreshing, rows } = proTable

const cursorProTableBindings = computed(() => ({
  ...proTable.proTableBindings.value,
  onQuery: (value: QueryBarValue) => {
    resetCursorPagination()
    proTable.query(value)
  },
  onReset: (value: QueryBarValue) => {
    resetCursorPagination()
    proTable.reset(value)
  },
  'onUpdate:pageSize': (size: number) => {
    resetCursorPagination()
    currentPage.value = 1
    pageSize.value = Math.max(1, Math.round(Number(size) || props.initialPageSize))
  },
}))

function goToNextPage(): void {
  if (loading.value || refreshing.value || !hasMore.value || !nextCursor.value) return
  cursorStack.value = [...cursorStack.value.slice(0, currentPage.value), nextCursor.value]
  activeCursor.value = nextCursor.value
  currentPage.value += 1
}

function goToPreviousPage(): void {
  if (loading.value || refreshing.value || currentPage.value <= 1) return
  const previousPage = currentPage.value - 1
  activeCursor.value = cursorStack.value[previousPage - 1] || null
  currentPage.value = previousPage
}

type ActionKey = keyof NonNullable<CurrentOrderTableProps<Row>['actions']>
const loadingActions = ref(new Set<string>())

function actionKey(action: ActionKey, row: Row): string {
  return `${action}:${String(row.order_id)}`
}

function isActionLoading(action: ActionKey, row: Row): boolean {
  return loadingActions.value.has(actionKey(action, row))
}

async function runAction(
  action: ActionKey,
  handler: CurrentOrderTableActionHandler<Row> | undefined,
  row: Row,
): Promise<void> {
  if (!handler) return
  const key = actionKey(action, row)
  if (loadingActions.value.has(key)) return
  loadingActions.value.add(key)
  try {
    await handler(row, { reload: proTable.reload })
  }
  finally {
    loadingActions.value.delete(key)
  }
}

watch(
  () => props.initialKeyword,
  (value) => {
    const keyword = String(value || '').trim()
    if (keyword === String(filters.value.keyword || '')) return
    resetCursorPagination()
    proTable.query({ ...filters.value, keyword })
  },
)

defineExpose({ reload: proTable.reload })
</script>

<template>
  <div
    v-bind="$attrs"
    class="mm-current-order-table"
    :class="{ 'is-fill-height': fillHeight }"
    data-mm-component="current-order-table"
  >
    <MmProTable
      v-bind="cursorProTableBindings"
      :aria-label="ariaLabel ?? messages.currentOrders.tableAria"
      :columns="columns"
      :columns-configurable="columnsConfigurable"
      :fill-height="fillHeight"
      :filter-drawer-title="filterDrawerTitle ?? messages.currentOrders.filterTitle"
      :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.currentOrders.filterSubtitle"
      :page-sizes="pageSizes"
      row-key="order_id"
      :show-pagination="false"
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

      <template #cell-order_id="slotProps">
        <slot name="cell-order_id" v-bind="slotProps">
          <span class="mm-current-order-table__id">{{ displayValue(slotProps.row.order_id) }}</span>
        </slot>
      </template>

      <template #cell-symbol="slotProps">
        <slot name="cell-symbol" v-bind="slotProps">{{ displayValue(slotProps.row.symbol) }}</slot>
      </template>

      <template #cell-product_category="slotProps">
        <slot name="cell-product_category" v-bind="slotProps">
          <MmTag effect="soft" round size="sm" type="primary">
            {{ productCategoryLabel(slotProps.row.product_category, slotProps.row.product_category_name) }}
          </MmTag>
        </slot>
      </template>

      <template #cell-side="slotProps">
        <slot name="cell-side" v-bind="slotProps">
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

      <template #cell-leverage="slotProps">
        <slot name="cell-leverage" v-bind="slotProps">
          <span class="mm-current-order-table__number">
            {{ slotProps.row.leverage == null || slotProps.row.leverage === '' ? '-' : `${slotProps.row.leverage}x` }}
          </span>
        </slot>
      </template>

      <template #cell-price="slotProps">
        <slot name="cell-price" v-bind="slotProps">
          <span class="mm-current-order-table__number">{{ formatCurrentOrderPrice(slotProps.row.price) }}</span>
        </slot>
      </template>

      <template #cell-quantity="slotProps">
        <slot name="cell-quantity" v-bind="slotProps">
          <span class="mm-current-order-table__number">{{ formatCurrentOrderQuantity(slotProps.row.quantity) }}</span>
        </slot>
      </template>

      <template #cell-filled_quantity="slotProps">
        <slot name="cell-filled_quantity" v-bind="slotProps">
          <span class="mm-current-order-table__number">{{ formatCurrentOrderQuantity(slotProps.row.filled_quantity) }}</span>
        </slot>
      </template>

      <template #cell-operation="slotProps">
        <slot
          name="cell-operation"
          v-bind="slotProps"
          :cancel="() => runAction('cancel', actions.cancel, slotProps.row)"
          :open-detail="() => runAction('detail', actions.detail, slotProps.row)"
        >
          <div class="mm-current-order-table__operation">
            <MmButton
              v-if="actions.detail"
              :aria-label="`${messages.currentOrders.viewDetails} ${slotProps.row.order_id}`"
              icon-only
              :loading="isActionLoading('detail', slotProps.row)"
              size="sm"
              :title="messages.currentOrders.viewDetails"
              @click.stop="runAction('detail', actions.detail, slotProps.row)"
            >
              <template #icon><MmIcon name="panel-left-close" :size="15" /></template>
            </MmButton>
            <MmButton
              v-if="actions.cancel"
              :aria-label="`${messages.currentOrders.cancelOrder} ${slotProps.row.order_id}`"
              class="mm-current-order-table__cancel"
              icon-only
              :loading="isActionLoading('cancel', slotProps.row)"
              size="sm"
              :title="messages.currentOrders.cancelOrder"
              @click.stop="runAction('cancel', actions.cancel, slotProps.row)"
            >
              <template #icon><MmIcon name="x" :size="15" /></template>
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

    <MmProTableCursorPagination
      :current-page="currentPage"
      :has-more="hasMore"
      :has-previous="currentPage > 1"
      :loading="loading || refreshing"
      :page-size="pageSize"
      :row-count="rows.length"
      size="md"
      @next="goToNextPage"
      @prev="goToPreviousPage"
    />
  </div>
</template>

<style src="./current-order-table.css"></style>
