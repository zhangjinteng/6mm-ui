<script setup lang="ts" generic="Row extends LiquidationRow = LiquidationRow">
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
  displayLiquidationValue,
  formatLiquidationDecimal,
  liquidationUserUid,
} from './formatters'
import type {
  LiquidationListQuery,
  LiquidationRow,
  LiquidationTableActionHandler,
  LiquidationTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmLiquidationTable' })

const props = withDefaults(defineProps<LiquidationTableProps<Row>>(), {
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
  productCategoryOptions: () => [],
  showUserType: true,
})

const { messages } = useLocale()
const copy = computed(() => messages.value.liquidations)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'occurred_at', order: 'desc' }
const sortableFields = new Set([
  'user_uid',
  'user_type',
  'position_id',
  'symbol',
  'position_side',
  'margin_mode',
  'leverage',
  'liquidation_quantity',
  'average_execution_price',
  'occurred_at',
])
const managedSlotNames = new Set([
  'cell-user_uid',
  'cell-user_type',
  'cell-position_id',
  'cell-symbol',
  'cell-product_category',
  'cell-position_side',
  'cell-margin_mode',
  'cell-leverage',
  'cell-liquidation_quantity',
  'cell-average_execution_price',
  'cell-liquidation_fee',
  'cell-occurred_at',
  'cell-operation',
  'query-actions',
  'toolbar-actions',
])

const queryFields = computed<QueryBarField[]>(() => [
  {
    key: 'product_category',
    label: copy.value.productCategory,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.allCategories, value: '' },
      ...(props.productCategoryOptions.length > 0
        ? props.productCategoryOptions
        : [
            { label: copy.value.crypto, value: 'crypto' },
            { label: copy.value.tradfi, value: 'tradfi' },
          ]),
    ],
    width: 180,
  },
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
    width: 150,
  },
  {
    key: 'position_side',
    label: copy.value.side,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.allSides, value: '' },
      { label: copy.value.long, value: 'long' },
      { label: copy.value.short, value: 'short' },
    ],
    width: 130,
  },
  {
    key: 'time_range',
    label: copy.value.occurredAt,
    type: 'date-range',
    defaultValue: null,
    placeholder: copy.value.timeRange,
    width: 220,
  },
])

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'user_uid', title: copy.value.userUid, width: 126, hideable: false, sortable: true },
    ...(props.showUserType
      ? [{ key: 'user_type', dataIndex: 'user_type', title: copy.value.userType, width: 88, sortable: true }]
      : []),
    { key: 'position_id', dataIndex: 'position_id', title: copy.value.positionId, width: 132, sortable: true },
    { key: 'symbol', dataIndex: 'symbol', title: copy.value.contract, width: 130, sortable: true },
    { key: 'product_category', dataIndex: 'product_category', title: copy.value.productCategory, width: 100 },
    { key: 'position_side', dataIndex: 'position_side', title: copy.value.side, width: 82, sortable: true },
    { key: 'margin_mode', dataIndex: 'margin_mode', title: copy.value.marginMode, width: 100, sortable: true },
    { key: 'leverage', dataIndex: 'leverage', title: copy.value.leverage, width: 84, sortable: true },
    { key: 'liquidation_quantity', dataIndex: 'liquidation_quantity', title: copy.value.liquidationQuantity, width: 110, sortable: true },
    { key: 'average_execution_price', dataIndex: 'average_execution_price', title: copy.value.averageExecutionPrice, width: 126, sortable: true },
    { key: 'liquidation_fee', dataIndex: 'liquidation_fee', title: copy.value.liquidationFee, width: 108 },
    { key: 'occurred_at', dataIndex: 'occurred_at', title: copy.value.occurredAt, width: 176, sortable: true },
  ]
  if (props.actions.detail || props.actions.trades || slots['cell-operation']) {
    result.push({ key: 'operation', title: copy.value.operation, width: 92, fixed: 'right', hideable: false })
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
type ActionKey = keyof NonNullable<LiquidationTableProps<Row>['actions']>
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
  if (['crypto', 'cryptocurrency', '加密货币'].includes(normalized)) return copy.value.crypto
  if (['tradfi', 'traditional_finance', '传统金融'].includes(normalized)) return copy.value.tradfi
  return displayLiquidationValue(value)
}

function actionKey(action: ActionKey, row: Row): string {
  return `${action}:${String(row.position_id)}`
}

function isActionLoading(action: ActionKey, row: Row): boolean {
  return loadingActions.value.has(actionKey(action, row))
}

async function runAction(action: ActionKey, handler: LiquidationTableActionHandler<Row> | undefined, row: Row): Promise<void> {
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

async function fetchLiquidations({ filters, page, pageSize, signal, sort }: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
  sort: TableSortState
}) {
  const timeRange = Array.isArray(filters.time_range) ? filters.time_range : null
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const query: LiquidationListQuery = {
    end_time: apiDateTime(timeRange?.[1], 'end'),
    keyword: String(scalarFilter(filters, 'keyword')),
    order_by: activeSort.key === 'user_uid' ? 'user_id' : activeSort.key as LiquidationListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    position_side: scalarFilter(filters, 'position_side'),
    product_category: scalarFilter(filters, 'product_category'),
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
  request: fetchLiquidations,
})

defineExpose({ reload })
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-liquidation-table"
    :class="{ 'is-fill-height': fillHeight }"
    :aria-label="ariaLabel ?? messages.liquidations.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? messages.liquidations.filterTitle"
    :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.liquidations.filterSubtitle"
    :page-sizes="pageSizes"
    row-key="position_id"
  >
    <template #cell-user_uid="slotProps">
      <slot name="cell-user_uid" v-bind="slotProps">{{ liquidationUserUid(slotProps.row) }}</slot>
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
        <span class="mm-liquidation-table__id">{{ displayLiquidationValue(slotProps.row.position_id) }}</span>
      </slot>
    </template>

    <template #cell-symbol="slotProps">
      <slot name="cell-symbol" v-bind="slotProps">{{ displayLiquidationValue(slotProps.row.symbol) }}</slot>
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
        <MmTag v-if="marginModeLabel(slotProps.row) !== '-'" effect="soft" round size="sm" :type="Number(slotProps.row.margin_mode) === 2 ? 'primary' : 'default'">
          {{ marginModeLabel(slotProps.row) }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>

    <template #cell-leverage="slotProps">
      <slot name="cell-leverage" v-bind="slotProps">
        <span class="mm-liquidation-table__number">{{ slotProps.row.leverage == null ? '-' : `${slotProps.row.leverage}x` }}</span>
      </slot>
    </template>

    <template #cell-liquidation_quantity="slotProps">
      <slot name="cell-liquidation_quantity" v-bind="slotProps">
        <span class="mm-liquidation-table__number">{{ formatLiquidationDecimal(slotProps.row.liquidation_quantity, 8) }}</span>
      </slot>
    </template>

    <template #cell-average_execution_price="slotProps">
      <slot name="cell-average_execution_price" v-bind="slotProps">
        <span class="mm-liquidation-table__number">{{ formatLiquidationDecimal(slotProps.row.average_execution_price, 4, 2) }}</span>
      </slot>
    </template>

    <template #cell-liquidation_fee="slotProps">
      <slot name="cell-liquidation_fee" v-bind="slotProps">
        <span class="mm-liquidation-table__number">{{ formatLiquidationDecimal(slotProps.row.liquidation_fee, 2, 2) }}</span>
      </slot>
    </template>

    <template #cell-occurred_at="slotProps">
      <slot name="cell-occurred_at" v-bind="slotProps">{{ displayLiquidationValue(slotProps.row.occurred_at) }}</slot>
    </template>

    <template #cell-operation="slotProps">
      <slot
        name="cell-operation"
        v-bind="slotProps"
        :detail="() => runAction('detail', actions.detail, slotProps.row)"
        :trades="() => runAction('trades', actions.trades, slotProps.row)"
      >
        <div class="mm-liquidation-table__actions">
          <MmButton
            v-if="actions.detail"
            :aria-label="messages.liquidations.viewDetailFor(displayLiquidationValue(slotProps.row.position_id))"
            icon-only
            size="sm"
            :loading="isActionLoading('detail', slotProps.row)"
            :title="messages.liquidations.viewDetail"
            @click.stop="runAction('detail', actions.detail, slotProps.row)"
          >
            <MmIcon name="panel-left-close" :size="15" />
          </MmButton>
          <MmButton
            v-if="actions.trades"
            :aria-label="messages.liquidations.viewTradesFor(displayLiquidationValue(slotProps.row.position_id))"
            icon-only
            size="sm"
            :loading="isActionLoading('trades', slotProps.row)"
            :title="messages.liquidations.viewTrades"
            @click.stop="runAction('trades', actions.trades, slotProps.row)"
          >
            <MmIcon name="list" :size="15" />
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

<style src="./liquidation-table.css"></style>
