<script setup lang="ts" generic="Row extends UserAssetRow = UserAssetRow">
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
import { MmTooltip } from '../tooltip'
import {
  calculateUserAssetPositionAmount,
  calculateUserAssetUnrealizedPnl,
  formatUserAssetAmount,
  formatUserAssetPnl,
} from './formatters'
import type {
  UserAssetListQuery,
  UserAssetRow,
  UserAssetTableActionHandler,
  UserAssetTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmUserAssetTable' })

const props = withDefaults(defineProps<UserAssetTableProps<Row>>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  includeRobotUserType: false,
  initialPageSize: 20,
  marketPrices: () => ({}),
  pageSizes: () => [20, 30, 40],
  recommendationOptions: () => [],
})

const { messages } = useLocale()
const copy = messages.value.userAssets
const slots = useSlots()
const defaultSort: TableSortState = { key: 'ua_id', order: 'desc' }
const sortableFields = new Set(['platform_user_id', 'user_id', 'public_user_id', 'uid'])
const managedSlotNames = new Set([
  'cell-platform_user_id',
  'cell-user_id',
  'cell-username',
  'cell-agent_user_id',
  'cell-recommendation',
  'cell-user_type',
  'cell-wallet_balance',
  'cell-available_balance',
  'cell-position_amount',
  'cell-total_margin',
  'cell-position_pnl',
  'cell-actions',
  'query-actions',
  'toolbar-actions',
])

const queryFields = computed<QueryBarField[]>(() => {
  const fields: QueryBarField[] = [
    {
      key: 'keyword',
      label: copy.keyword,
      type: 'keyword',
      defaultValue: '',
      placeholder: copy.keywordPlaceholder,
      clearable: true,
      width: 240,
    },
    {
      key: 'user_type',
      label: copy.userType,
      type: 'segmented',
      defaultValue: '',
      options: [
        { label: copy.all, value: '' },
        { label: copy.live, value: 1 },
        { label: copy.internal, value: 2 },
        ...(props.includeRobotUserType ? [{ label: copy.robot, value: 3 }] : []),
      ],
      block: true,
      width: props.includeRobotUserType ? 208 : 154,
    },
  ]

  if (props.recommendationOptions.length > 0) {
    fields.splice(1, 0, {
      key: 'agent_id',
      label: copy.recommendation,
      type: 'select',
      defaultValue: '',
      options: [
        { label: copy.all, value: '' },
        ...props.recommendationOptions,
      ],
      width: 180,
    })
  }

  return fields
})

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const result: ProTableColumn<Row>[] = [
    { key: 'platform_user_id', dataIndex: 'platform_user_id', title: messages.value.userAssets.userId, width: 110, hideable: false, sortable: true },
    { key: 'user_id', dataIndex: 'user_id', title: messages.value.userAssets.userUid, width: 126, hideable: false, sortable: true },
    { key: 'username', dataIndex: 'username', title: messages.value.userAssets.username, width: 150 },
    { key: 'agent_user_id', dataIndex: 'agent_user_id', title: messages.value.userAssets.externalUserId, width: 164 },
    { key: 'user_type', dataIndex: 'user_type', title: messages.value.userAssets.userType, width: 120 },
    { key: 'wallet_balance', dataIndex: 'wallet_balance', title: messages.value.userAssets.walletBalance, width: 150 },
    { key: 'available_balance', dataIndex: 'available_balance', title: messages.value.userAssets.availableBalance, width: 150 },
    { key: 'position_amount', dataIndex: 'position_amount', title: messages.value.userAssets.positionAmount, width: 130 },
    { key: 'total_margin', dataIndex: 'total_margin', title: messages.value.userAssets.margin, width: 150 },
    { key: 'position_pnl', dataIndex: 'position_pnl', title: messages.value.userAssets.positionPnl, width: 150 },
  ]

  if (props.recommendationOptions.length > 0) {
    result.splice(3, 0, {
      key: 'recommendation',
      dataIndex: 'agent_id',
      title: messages.value.userAssets.recommendation,
      width: 150,
    })
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
  const configured = Array.isArray(resolved) ? resolved.map(column => ({ ...column })) : defaults

  if (
    (props.actions.deposit || props.actions.deduct)
    && !configured.some(column => column.key === 'actions')
  ) {
    configured.push({
      key: 'actions',
      title: copy.actions,
      align: 'center',
      fixed: 'right',
      hideable: false,
      width: props.actions.deposit && props.actions.deduct ? 96 : 64,
    })
  }

  return configured
})

type UserAssetActionKey = keyof NonNullable<UserAssetTableProps<Row>['actions']>
const loadingActions = ref(new Set<string>())

function loadingActionKey(action: UserAssetActionKey, row: Row): string {
  return `${action}:${String(row.platform_user_id ?? row.user_id)}`
}

function isActionLoading(action: UserAssetActionKey, row: Row): boolean {
  return loadingActions.value.has(loadingActionKey(action, row))
}

async function runAction(
  action: UserAssetActionKey,
  handler: UserAssetTableActionHandler<Row> | undefined,
  row: Row,
): Promise<void> {
  if (!handler) return
  const key = loadingActionKey(action, row)
  if (loadingActions.value.has(key)) return

  loadingActions.value.add(key)
  try {
    await handler(row, { reload })
  }
  finally {
    loadingActions.value.delete(key)
  }
}

const forwardedSlotNames = computed(() => Object.keys(slots).filter(
  slotName => !managedSlotNames.has(slotName),
))

function scalarFilter(filters: QueryBarValue, key: string): string | number | boolean {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}

function nestedValue(row: Row, key: keyof NonNullable<UserAssetRow['user']>): unknown {
  return row.user?.[key]
}

function platformUserId(row: Row): string {
  return String(row.platform_user_id ?? nestedValue(row, 'platform_user_id') ?? '-')
}

function displayName(row: Row): string {
  return String(row.nice_name || nestedValue(row, 'nice_name') || row.username || nestedValue(row, 'username') || '-')
}

function externalUserId(row: Row): string {
  return String(row.agent_user_id || nestedValue(row, 'agent_user_id') || '-')
}

function recommendationLabel(row: Row): string {
  const relation = props.recommendationOptions.find(option =>
    String(option.value) === String(row.agent_id ?? nestedValue(row, 'agent_id') ?? ''),
  )

  return String(
    relation?.label
    || row.agent_name_parse
    || nestedValue(row, 'agent_name_parse')
    || row.agent_name
    || nestedValue(row, 'agent_name')
    || '-',
  )
}

function userType(row: Row): unknown {
  return row.user_type ?? nestedValue(row, 'user_type')
}

function userTypeConfig(row: Row): { label: string, type: 'info' | 'success' | 'warning' } | null {
  const normalized = Number(userType(row))
  if (normalized === 1) return { label: messages.value.userAssets.live, type: 'success' }
  if (normalized === 2) return { label: messages.value.userAssets.internal, type: 'info' }
  if (normalized === 3) return { label: messages.value.userAssets.robot, type: 'warning' }
  return null
}

function positionAmount(row: Row): string {
  return formatUserAssetAmount(calculateUserAssetPositionAmount(row, props.marketPrices))
}

function pnlValue(row: Row): number {
  return calculateUserAssetUnrealizedPnl(row, props.marketPrices)
}

async function fetchUserAssets({
  filters,
  page,
  pageSize,
  signal,
  sort,
}: {
  filters: QueryBarValue
  page: number
  pageSize: number
  signal: AbortSignal
  sort: TableSortState
}) {
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const query: UserAssetListQuery = {
    keyword: String(scalarFilter(filters, 'keyword')),
    order_by: activeSort.key as UserAssetListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    user_type: scalarFilter(filters, 'user_type'),
  }

  if (props.recommendationOptions.length > 0) {
    query.agent_id = scalarFilter(filters, 'agent_id')
  }

  try {
    return await props.request(query, { signal })
  }
  catch (error: unknown) {
    const candidate = error as { message?: string, msg?: string } | null
    throw new Error(candidate?.msg || candidate?.message || messages.value.userAssets.loadFailed)
  }
}

const { proTableBindings, reload } = useMmProTable<Row>({
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchUserAssets,
})

defineExpose({ reload })
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-user-asset-table"
    :aria-label="ariaLabel ?? messages.userAssets.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? messages.userAssets.filterTitle"
    :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.userAssets.filterSubtitle"
    :page-sizes="pageSizes"
    :row-key="(row: Row) => row.ua_id ?? row.user_id"
  >
    <template #cell-platform_user_id="slotProps">
      <slot name="cell-platform_user_id" v-bind="slotProps">{{ platformUserId(slotProps.row) }}</slot>
    </template>

    <template #cell-user_id="slotProps">
      <slot name="cell-user_id" v-bind="slotProps">{{ slotProps.row.user_id ?? '-' }}</slot>
    </template>

    <template #cell-username="slotProps">
      <slot name="cell-username" v-bind="slotProps">{{ displayName(slotProps.row) }}</slot>
    </template>

    <template #cell-agent_user_id="slotProps">
      <slot name="cell-agent_user_id" v-bind="slotProps">{{ externalUserId(slotProps.row) }}</slot>
    </template>

    <template #cell-recommendation="slotProps">
      <slot name="cell-recommendation" v-bind="slotProps">
        {{ recommendationLabel(slotProps.row) }}
      </slot>
    </template>

    <template #cell-user_type="slotProps">
      <slot name="cell-user_type" v-bind="slotProps">
        <MmTag
          v-if="userTypeConfig(slotProps.row)"
          effect="outline"
          round
          size="sm"
          :type="userTypeConfig(slotProps.row)?.type"
        >
          {{ userTypeConfig(slotProps.row)?.label }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>

    <template #cell-wallet_balance="slotProps">
      <slot name="cell-wallet_balance" v-bind="slotProps">
        <span class="mm-user-asset-table__amount">{{ formatUserAssetAmount(slotProps.row.wallet_balance) }}</span>
      </slot>
    </template>

    <template #cell-available_balance="slotProps">
      <slot name="cell-available_balance" v-bind="slotProps">
        <span class="mm-user-asset-table__amount">{{ formatUserAssetAmount(slotProps.row.available_balance) }}</span>
      </slot>
    </template>

    <template #cell-position_amount="slotProps">
      <slot name="cell-position_amount" v-bind="slotProps" :value="positionAmount(slotProps.row)">
        <span class="mm-user-asset-table__amount">{{ positionAmount(slotProps.row) }}</span>
      </slot>
    </template>

    <template #cell-total_margin="slotProps">
      <slot name="cell-total_margin" v-bind="slotProps">
        <span class="mm-user-asset-table__amount">{{ formatUserAssetAmount(slotProps.row.total_margin) }}</span>
      </slot>
    </template>

    <template #cell-position_pnl="slotProps">
      <slot name="cell-position_pnl" v-bind="slotProps" :value="pnlValue(slotProps.row)">
        <span
          class="mm-user-asset-table__pnl"
          :class="pnlValue(slotProps.row) >= 0 ? 'is-profit' : 'is-loss'"
        >
          {{ formatUserAssetPnl(pnlValue(slotProps.row)) }}
        </span>
      </slot>
    </template>

    <template #cell-actions="slotProps">
      <slot
        name="cell-actions"
        v-bind="slotProps"
        :deposit="() => runAction('deposit', actions.deposit, slotProps.row)"
        :deduct="() => runAction('deduct', actions.deduct, slotProps.row)"
      >
        <div class="mm-user-asset-table__actions">
          <MmTooltip v-if="actions.deposit" :content="messages.userAssets.deposit">
            <MmButton
              :aria-label="messages.userAssets.deposit"
              icon-only
              size="sm"
              :loading="isActionLoading('deposit', slotProps.row)"
              @click.stop="runAction('deposit', actions.deposit, slotProps.row)"
            >
              <MmIcon name="plus" :size="14" />
            </MmButton>
          </MmTooltip>
          <MmTooltip v-if="actions.deduct" :content="messages.userAssets.deduct">
            <MmButton
              :aria-label="messages.userAssets.deduct"
              icon-only
              plain
              size="sm"
              variant="danger"
              :loading="isActionLoading('deduct', slotProps.row)"
              @click.stop="runAction('deduct', actions.deduct, slotProps.row)"
            >
              <MmIcon name="banknote" :size="14" />
            </MmButton>
          </MmTooltip>
        </div>
      </slot>
    </template>

    <template #query-actions="slotProps">
      <slot name="query-actions" v-bind="slotProps" />
    </template>

    <template #toolbar-actions>
      <slot name="toolbar-actions" />
    </template>

    <template
      v-for="slotName in forwardedSlotNames"
      :key="slotName"
      #[slotName]="slotProps"
    >
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </MmProTable>
</template>

<style src="./user-asset-table.css"></style>
