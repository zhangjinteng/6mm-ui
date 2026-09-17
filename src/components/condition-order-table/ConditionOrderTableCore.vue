<script setup lang="ts">
import { computed, useSlots, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import {
  conditionOrderTriggerOperator,
  formatConditionOrderLeverage,
  formatConditionOrderPrice,
  formatConditionOrderQuantity,
  isCancelableConditionOrderStatus,
} from './formatters'
import type {
  ConditionOrderListQuery,
  ConditionOrderRow,
  ConditionOrderTableActionHandler,
  ConditionOrderTableCoreProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmConditionOrderTableCore' })

const props = withDefaults(defineProps<ConditionOrderTableCoreProps>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  initialPageSize: 20,
  pageSizes: () => [20, 30, 40],
  quantityDisplay: 'default',
  showUserType: true,
})

const { messages } = useLocale()
const copy = computed(() => messages.value.conditionOrders)
const slots = useSlots()
const managedSlotNames = new Set([
  'cell-user_id',
  'cell-user_type',
  'cell-condition_id',
  'cell-symbol',
  'cell-product_category',
  'cell-order_type',
  'cell-side',
  'cell-margin_mode',
  'cell-leverage',
  'cell-trigger_status',
  'cell-entrust_price',
  'cell-quantity',
  'cell-trigger_condition',
  'cell-created_at',
  'cell-operation',
  'query-actions',
  'toolbar-actions',
])

const triggerTypeOptions = computed(() => {
  const allOptions = [
    { label: copy.value.stopMarket, value: 'stop_market' },
    { label: copy.value.stopLimit, value: 'stop_limit' },
    { label: copy.value.takeProfitMarket, value: 'take_profit_market' },
    { label: copy.value.takeProfitLimit, value: 'take_profit_limit' },
    { label: copy.value.trailingStop, value: 'trailing_stop' },
    { label: copy.value.limitOrder, value: 'limit' },
    { label: copy.value.marketOrder, value: 'market' },
  ]
  const tpSlTypes = new Set(['stop_market', 'stop_limit', 'take_profit_market', 'take_profit_limit'])
  return props.kind === 'tp_sl' ? allOptions.filter(option => tpSlTypes.has(option.value)) : allOptions
})

const defaultQueryFields = computed<QueryBarField[]>(() => [
  {
    key: 'keyword',
    label: copy.value.keyword,
    type: 'keyword',
    defaultValue: '',
    placeholder: copy.value.keywordPlaceholder,
    clearable: true,
    width: 210,
  },
  ...(props.showUserType
    ? [{
        key: 'user_type',
        label: copy.value.userType,
        type: 'select' as const,
        defaultValue: '',
        options: [
          { label: copy.value.all, value: '' },
          { label: copy.value.live, value: 1 },
          { label: copy.value.internal, value: 2 },
        ],
        width: 132,
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
    label: copy.value.triggerType,
    type: 'select',
    defaultValue: '',
    options: [{ label: copy.value.all, value: '' }, ...triggerTypeOptions.value],
    width: 160,
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
    key: 'reduce_only',
    label: copy.value.reduceOnly,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.value.all, value: '' },
      { label: copy.value.reduceOnlyOption, value: 1 },
      { label: copy.value.nonReduceOnlyOption, value: 0 },
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

const triggerTypeLabels = computed<Record<string, string>>(() => ({
  limit: copy.value.limitOrder,
  market: copy.value.marketOrder,
  stop_limit: copy.value.stopLimit,
  stop_market: copy.value.stopMarket,
  take_profit_limit: copy.value.takeProfitLimit,
  take_profit_market: copy.value.takeProfitMarket,
  trailing_stop: copy.value.trailingStop,
}))
const triggerStatusLabels = computed<Record<number, string>>(() => ({
  [-1]: copy.value.inactive,
  0: copy.value.pendingTrigger,
  1: copy.value.triggering,
  2: copy.value.triggered,
  3: copy.value.canceled,
  4: copy.value.rejected,
  5: copy.value.matched,
}))

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === '' ? '-' : String(value)
}

function userTypeValue(row: ConditionOrderRow): unknown {
  return row.user_type ?? row.user?.user_type ?? row.user_type_parse
}

function userTypeConfig(row: ConditionOrderRow): { label: string, type: 'info' | 'success' | 'warning' } | null {
  const value = Number(userTypeValue(row))
  if (value === 1) return { label: copy.value.live, type: 'success' }
  if (value === 2) return { label: copy.value.internal, type: 'info' }
  if (value === 3) return { label: copy.value.robot, type: 'warning' }
  return null
}

function sideConfig(row: ConditionOrderRow): { label: string, type: 'danger' | 'success' } | null {
  const side = String(row.side ?? '').toLowerCase()
  if (side === 'buy') return { label: copy.value.buy, type: 'success' }
  if (side === 'sell') return { label: copy.value.sell, type: 'danger' }
  return null
}

function marginModeLabel(value: unknown): string {
  if (Number(value) === 1) return copy.value.cross
  if (Number(value) === 2) return copy.value.isolated
  return '-'
}

function productCategoryLabel(value: unknown, name?: unknown): string {
  const configuredName = String(name ?? '').trim()
  if (configuredName) return configuredName
  const normalized = String(value ?? '').trim().toLowerCase()
  if (['crypto', 'cryptocurrency', '加密货币'].includes(normalized)) return copy.value.productCategoryCrypto
  return displayValue(value)
}

function triggerTypeLabel(row: ConditionOrderRow): string {
  return triggerTypeLabels.value[String(row.trigger_type ?? '').toLowerCase()]
    || displayValue(row.trigger_type_parse ?? row.trigger_type)
}

function triggerStatusLabel(row: ConditionOrderRow): string {
  return triggerStatusLabels.value[Number(row.trigger_status)]
    || displayValue(row.trigger_status_parse ?? row.trigger_status)
}

function triggerStatusType(value: unknown): 'danger' | 'info' | 'primary' | 'success' | 'warning' {
  return ({ [-1]: 'info', 0: 'warning', 1: 'primary', 2: 'success', 3: 'info', 4: 'danger', 5: 'primary' } as const)[Number(value)] || 'info'
}

function workingTypeLabel(value: unknown): string {
  return String(value || '').toUpperCase() === 'CONTRACT_PRICE' ? copy.value.lastPrice : copy.value.markPrice
}

function triggerConditionText(row: ConditionOrderRow): string {
  const triggerType = String(row.trigger_type || '').toLowerCase()
  const side = String(row.side || '').toLowerCase()
  const operator = conditionOrderTriggerOperator(triggerType, side)
  const priceLabel = workingTypeLabel(row.working_type)
  if (triggerType === 'trailing_stop') {
    const callbackRate = row.callback_rate == null ? '-' : `${(Number(row.callback_rate) * 100).toFixed(2)}%`
    return `${priceLabel} ${operator} ${formatConditionOrderPrice(row.activate_price)} / ${copy.value.callbackRate} ${callbackRate}`
  }
  if (['take_profit_market', 'take_profit_limit', 'stop_market', 'stop_limit'].includes(triggerType)) {
    return `${priceLabel} ${operator} ${formatConditionOrderPrice(row.trigger_price)}`
  }
  return formatConditionOrderPrice(row.trigger_price)
}

const defaultColumns = computed<ProTableColumn<ConditionOrderRow>[]>(() => {
  const result: ProTableColumn<ConditionOrderRow>[] = [
    { key: 'user_id', dataIndex: 'user_id', title: copy.value.userUid, width: 112, hideable: false },
    ...(props.showUserType
      ? [{ key: 'user_type', dataIndex: 'user_type', title: copy.value.userType, width: 78 }]
      : []),
    { key: 'condition_id', dataIndex: 'condition_id', title: copy.value.orderId, width: 165 },
    { key: 'symbol', dataIndex: 'symbol', title: copy.value.contract, width: 110 },
    { key: 'product_category', dataIndex: 'product_category', title: copy.value.productCategory, width: 88 },
    { key: 'order_type', dataIndex: 'trigger_type', title: copy.value.triggerType, width: 116, formatter: (_value, row) => triggerTypeLabel(row) },
    { key: 'side', dataIndex: 'side', title: copy.value.side, width: 66 },
    { key: 'margin_mode', dataIndex: 'margin_mode', title: copy.value.marginMode, width: 88 },
    { key: 'leverage', dataIndex: 'leverage', title: copy.value.leverage, width: 62, formatter: formatConditionOrderLeverage },
    { key: 'trigger_status', dataIndex: 'trigger_status', title: copy.value.triggerStatus, width: 90, formatter: (_value, row) => triggerStatusLabel(row) },
    { key: 'entrust_price', dataIndex: 'price', title: copy.value.orderPrice, width: 102, formatter: value => formatConditionOrderPrice(value) === '-' ? copy.value.marketPrice : formatConditionOrderPrice(value) },
    { key: 'quantity', dataIndex: 'quantity', title: copy.value.orderQuantity, width: 100, formatter: value => formatConditionOrderQuantity(value, props.quantityDisplay === 'account-change') },
    { key: 'trigger_condition', title: copy.value.triggerSettings, width: 170, formatter: (_value, row) => triggerConditionText(row) },
    { key: 'created_at', dataIndex: 'created_at', title: copy.value.orderTime, width: 176, formatter: displayValue },
  ]
  if (props.actions.detail || props.actions.cancel || slots['cell-operation']) {
    result.push({ key: 'operation', title: copy.value.operation, width: 64, fixed: 'right', hideable: false })
  }
  return result
})

const columns = computed<ProTableColumn<ConditionOrderRow>[]>(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  const resolved = !props.columns
    ? defaults
    : typeof props.columns === 'function'
      ? props.columns(defaults)
      : props.columns
  return Array.isArray(resolved) ? resolved.map(column => ({ ...column })) : defaults
})

const forwardedSlotNames = computed(() => Object.keys(slots).filter(slotName => !managedSlotNames.has(slotName)))

function scalarFilter(filters: QueryBarValue, key: string): string | number | boolean {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}

function apiDateTime(value: string | undefined, boundary: 'start' | 'end'): string {
  if (!value) return ''
  if (value.includes(' ')) return value
  return `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

async function fetchConditionOrders({ filters, page, pageSize, signal }: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
}) {
  const timeRange = Array.isArray(filters.time_range) ? filters.time_range : null
  const query: ConditionOrderListQuery = {
    end: apiDateTime(timeRange?.[1], 'end'),
    keyword: String(scalarFilter(filters, 'keyword')),
    kind: props.kind,
    lifecycle: props.lifecycle,
    order_type: scalarFilter(filters, 'order_type'),
    page_no: page,
    page_size: pageSize,
    reduce_only: scalarFilter(filters, 'reduce_only'),
    side: scalarFilter(filters, 'side'),
    start: apiDateTime(timeRange?.[0], 'start'),
    sym: String(scalarFilter(filters, 'symbol')),
    ...(props.showUserType ? { user_type: scalarFilter(filters, 'user_type') } : {}),
  }
  try {
    return await props.request(query, { filters: { ...filters }, signal })
  }
  catch (error: unknown) {
    const candidate = error as { message?: string, msg?: string } | null
    throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
  }
}

const { proTableBindings, reload } = useMmProTable<ConditionOrderRow>({
  initialPageSize: props.initialPageSize,
  queryFields,
  request: fetchConditionOrders,
})

watch(() => props.lifecycle, () => void reload('manual'))
defineExpose({ reload })

async function runAction(
  action: ConditionOrderTableActionHandler | undefined,
  row: ConditionOrderRow,
): Promise<void> {
  await action?.(row, { reload: () => reload('manual') })
}

function resolvedAriaLabel(): string {
  if (props.ariaLabel) return props.ariaLabel
  if (props.kind === 'tp_sl') return props.lifecycle === 'history' ? copy.value.historyTpSlTableAria : copy.value.tpSlTableAria
  return props.lifecycle === 'history' ? copy.value.historyTableAria : copy.value.tableAria
}

function resolvedFilterSubtitle(): string {
  if (props.filterDrawerSubtitle) return props.filterDrawerSubtitle
  return props.kind === 'tp_sl' ? copy.value.tpSlFilterSubtitle : copy.value.filterSubtitle
}
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-condition-order-table"
    :aria-label="resolvedAriaLabel()"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? copy.filterTitle"
    :filter-drawer-subtitle="resolvedFilterSubtitle()"
    :page-sizes="pageSizes"
    row-key="condition_id"
  >
    <template #cell-user_id="slotProps">
      <slot name="cell-user_id" v-bind="slotProps">{{ slotProps.row.user_id ?? '-' }}</slot>
    </template>
    <template #cell-user_type="slotProps">
      <slot name="cell-user_type" v-bind="slotProps">
        <MmTag v-if="userTypeConfig(slotProps.row)" effect="outline" round size="sm" :type="userTypeConfig(slotProps.row)?.type">
          {{ userTypeConfig(slotProps.row)?.label }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>
    <template #cell-condition_id="slotProps">
      <slot name="cell-condition_id" v-bind="slotProps">{{ slotProps.row.condition_id ?? '-' }}</slot>
    </template>
    <template #cell-symbol="slotProps">
      <slot name="cell-symbol" v-bind="slotProps">{{ slotProps.row.symbol ?? '-' }}</slot>
    </template>
    <template #cell-product_category="slotProps">
      <slot name="cell-product_category" v-bind="slotProps">
        <MmTag v-if="productCategoryLabel(slotProps.row.product_category, slotProps.row.product_category_name) !== '-'" effect="soft" round size="sm" type="primary">
          {{ productCategoryLabel(slotProps.row.product_category, slotProps.row.product_category_name) }}
        </MmTag>
        <span v-else>-</span>
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
        <MmTag v-if="marginModeLabel(slotProps.row.margin_mode) !== '-'" effect="soft" round size="sm" :type="Number(slotProps.row.margin_mode) === 2 ? 'primary' : 'default'">
          {{ marginModeLabel(slotProps.row.margin_mode) }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>
    <template #cell-trigger_status="slotProps">
      <slot name="cell-trigger_status" v-bind="slotProps">
        <MmTag effect="soft" round size="sm" :type="triggerStatusType(slotProps.row.trigger_status)">
          {{ triggerStatusLabel(slotProps.row) }}
        </MmTag>
      </slot>
    </template>
    <template #cell-quantity="slotProps">
      <slot name="cell-quantity" v-bind="slotProps">
        <span class="mm-condition-order-table__number">
          {{ formatConditionOrderQuantity(slotProps.row.quantity, quantityDisplay === 'account-change') }}
        </span>
      </slot>
    </template>
    <template #cell-operation="slotProps">
      <slot name="cell-operation" v-bind="{ ...slotProps, reload }">
        <span class="mm-condition-order-table__actions">
          <MmButton
            v-if="actions.detail"
            :aria-label="`${copy.viewDetails} ${slotProps.row.condition_id || '-'}`"
            icon-only
            size="sm"
            :title="copy.viewDetails"
            @click.stop="runAction(actions.detail, slotProps.row)"
          >
            <template #icon><MmIcon name="panel-left-close" :size="15" /></template>
          </MmButton>
          <MmButton
            v-if="lifecycle === 'current' && actions.cancel && isCancelableConditionOrderStatus(slotProps.row.trigger_status)"
            :aria-label="`${copy.cancelOrder} ${slotProps.row.condition_id || '-'}`"
            class="mm-condition-order-table__cancel"
            icon-only
            size="sm"
            :title="copy.cancelOrder"
            @click.stop="runAction(actions.cancel, slotProps.row)"
          >
            <template #icon><MmIcon name="x" :size="15" /></template>
          </MmButton>
        </span>
      </slot>
    </template>

    <template v-for="slotName in forwardedSlotNames" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
    <template v-if="$slots['query-actions']" #query-actions="slotProps">
      <slot name="query-actions" v-bind="slotProps || {}" />
    </template>
    <template v-if="$slots['toolbar-actions']" #toolbar-actions="slotProps">
      <slot name="toolbar-actions" v-bind="slotProps || {}" />
    </template>
  </MmProTable>
</template>

<style scoped>
.mm-condition-order-table {
  height: calc(100vh - var(--navbar-height, 64px) - 24px);
  min-height: 480px;
}

.mm-condition-order-table__number {
  font-variant-numeric: tabular-nums;
}

.mm-condition-order-table__actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.mm-condition-order-table__cancel {
  color: var(--mm-color-danger);
}

.mm-condition-order-table__cancel:hover {
  color: var(--mm-color-danger);
  background: var(--mm-color-danger-soft);
  border-color: var(--mm-color-danger);
}

.mm-condition-order-table :deep(.mm-table th),
.mm-condition-order-table :deep(.mm-table td) {
  padding: 8px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.mm-condition-order-table :deep(.mm-pro-table__auto-refresh) {
  display: none;
}
</style>
