<script setup lang="ts" generic="Row extends UserRow = UserRow">
import { computed, ref, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { formatOnlineUserDateTime, formatOnlineUserVipLevel } from '../online-user-table/formatters'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmIpLocation } from '../ip-location'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import type { TableSortState } from '../table'
import { MmTooltip } from '../tooltip'
import type {
  UserListQuery,
  UserRow,
  UserTableActionHandler,
  UserTableProps,
} from './types'

defineOptions({ inheritAttrs: false, name: 'MmUserTable' })

const props = withDefaults(defineProps<UserTableProps<Row>>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  filterDrawerSubtitle: undefined,
  filterDrawerTitle: undefined,
  includeRobotUserType: false,
  initialPageSize: 20,
  pageSizes: () => [20, 30, 40],
  recommendationOptions: () => [],
})

const { messages } = useLocale()
const copy = messages.value.users
const slots = useSlots()
const defaultSort: TableSortState = { key: 'created_at', order: 'desc' }
const sortableFields = new Set(['user_id', 'vip_level', 'created_at', 'last_login_at'])
const managedSlotNames = new Set([
  'cell-user_id',
  'cell-username',
  'cell-agent_user_id',
  'cell-recommendation',
  'cell-user_type',
  'cell-vip_level',
  'cell-login_ip',
  'cell-created_at',
  'cell-last_login_at',
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
    width: 230,
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
  {
    key: 'vip_level',
    label: copy.vipLevel,
    type: 'select',
    defaultValue: '',
    options: [
      { label: copy.all, value: '' },
      ...Array.from({ length: 10 }, (_, index) => ({
        label: `V${index + 1}`,
        value: index + 1,
      })),
    ],
    width: 150,
  },
  {
    key: 'create_time',
    label: copy.registerTime,
    type: 'date-range',
    defaultValue: null,
    placeholder: copy.registerTime,
    shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'],
    width: 280,
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
    { key: 'user_id', dataIndex: 'user_id', title: messages.value.users.userUid, width: 126, hideable: false, sortable: true },
    { key: 'username', dataIndex: 'username', title: messages.value.users.username, width: 142 },
    { key: 'agent_user_id', dataIndex: 'agent_user_id', title: messages.value.users.externalUserId, width: 154 },
    { key: 'user_type', dataIndex: 'user_type', title: messages.value.users.userType, width: 134 },
    { key: 'vip_level', dataIndex: 'vip_level', title: messages.value.users.vipLevel, width: 112, sortable: true },
    { key: 'login_ip', dataIndex: 'last_login_ip', title: messages.value.users.loginIp, width: 280 },
    { key: 'created_at', dataIndex: 'created_at', title: messages.value.users.registerTime, width: 174, sortable: true },
    { key: 'last_login_at', dataIndex: 'last_login_at', title: messages.value.users.lastLoginTime, width: 174, sortable: true },
  ]

  if (props.recommendationOptions.length > 0) {
    result.splice(2, 0, {
      key: 'recommendation',
      dataIndex: 'agent_id',
      title: messages.value.users.recommendation,
      width: 150,
    })
  }

  return result
})

const columns = computed<ProTableColumn<Row>[]>(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  const configured = !props.columns
    ? defaults
    : typeof props.columns === 'function'
    ? props.columns(defaults)
    : props.columns
  const resolved = Array.isArray(configured)
    ? configured.map(column => ({ ...column }))
    : defaults

  if (
    (props.actions.cancelAllOrders || props.actions.closeAllPositions)
    && !resolved.some(column => column.key === 'actions')
  ) {
    resolved.push({
      key: 'actions',
      title: copy.actions,
      align: 'center',
      fixed: 'right',
      hideable: false,
      width: props.actions.cancelAllOrders && props.actions.closeAllPositions ? 96 : 64,
    })
  }

  return resolved
})

type UserActionKey = keyof NonNullable<UserTableProps<Row>['actions']>
const loadingActions = ref(new Set<string>())

function loadingActionKey(action: UserActionKey, row: Row): string {
  return `${action}:${String(row.user_id)}`
}

function isActionLoading(action: UserActionKey, row: Row): boolean {
  return loadingActions.value.has(loadingActionKey(action, row))
}

async function runAction(
  action: UserActionKey,
  handler: UserTableActionHandler<Row> | undefined,
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

function apiDateTime(value: string | undefined, boundary: 'start' | 'end'): string {
  if (!value) return ''
  return value.includes(' ')
    ? value
    : `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

function userTypeConfig(value: unknown): { label: string, type: 'info' | 'success' | 'warning' } | null {
  const normalized = Number(value)
  if (normalized === 1) return { label: messages.value.users.live, type: 'success' }
  if (normalized === 2) return { label: messages.value.users.internal, type: 'info' }
  if (normalized === 3) return { label: messages.value.users.robot, type: 'warning' }
  return null
}

function recommendationLabel(row: Row): string {
  const relation = props.recommendationOptions.find(option =>
    String(option.value) === String(row.agent_id ?? ''),
  )

  return relation?.label || row.agent_name_parse || row.agent_name || '-'
}

async function fetchUsers({
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
  const dateRange = Array.isArray(filters.create_time) ? filters.create_time : null
  const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
  const query: UserListQuery = {
    create_time_end: apiDateTime(dateRange?.[1], 'end'),
    create_time_start: apiDateTime(dateRange?.[0], 'start'),
    keyword: String(scalarFilter(filters, 'keyword')),
    order_by: activeSort.key as UserListQuery['order_by'],
    order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
    page_no: page,
    page_size: pageSize,
    user_type: scalarFilter(filters, 'user_type'),
    vip_level: scalarFilter(filters, 'vip_level'),
  }

  if (props.recommendationOptions.length > 0) {
    query.agent_id = scalarFilter(filters, 'agent_id')
  }

  try {
    return await props.request(query, { signal })
  }
  catch (error: unknown) {
    const candidate = error as { message?: string, msg?: string } | null
    throw new Error(candidate?.msg || candidate?.message || messages.value.users.loadFailed)
  }
}

const { proTableBindings, reload } = useMmProTable<Row>({
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchUsers,
})

defineExpose({ reload })
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-user-table"
    :aria-label="ariaLabel ?? messages.users.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? messages.users.filterTitle"
    :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.users.filterSubtitle"
    :page-sizes="pageSizes"
    row-key="user_id"
  >
    <template #cell-user_id="slotProps">
      <slot name="cell-user_id" v-bind="slotProps">{{ slotProps.row.user_id ?? '-' }}</slot>
    </template>

    <template #cell-username="slotProps">
      <slot name="cell-username" v-bind="slotProps">
        {{ slotProps.row.nice_name || slotProps.row.username || '-' }}
      </slot>
    </template>

    <template #cell-agent_user_id="slotProps">
      <slot name="cell-agent_user_id" v-bind="slotProps">
        {{ slotProps.row.agent_user_id || '-' }}
      </slot>
    </template>

    <template #cell-recommendation="slotProps">
      <slot name="cell-recommendation" v-bind="slotProps">
        {{ recommendationLabel(slotProps.row) }}
      </slot>
    </template>

    <template #cell-user_type="slotProps">
      <slot name="cell-user_type" v-bind="slotProps">
        <MmTag
          v-if="userTypeConfig(slotProps.row.user_type)"
          effect="outline"
          round
          size="sm"
          :type="userTypeConfig(slotProps.row.user_type)?.type"
        >
          {{ userTypeConfig(slotProps.row.user_type)?.label }}
        </MmTag>
        <span v-else>-</span>
      </slot>
    </template>

    <template #cell-vip_level="slotProps">
      <slot name="cell-vip_level" v-bind="slotProps">
        <span class="mm-user-table__emphasis">{{ formatOnlineUserVipLevel(slotProps.row.vip_level) }}</span>
      </slot>
    </template>

    <template #cell-login_ip="slotProps">
      <slot name="cell-login_ip" v-bind="slotProps">
        <MmIpLocation
          country-first
          :info="slotProps.row.last_login_ip_info"
          :ip="slotProps.row.last_login_ip"
          location-first
          show-ip-label
          :show-tooltip="false"
        />
      </slot>
    </template>

    <template #cell-created_at="slotProps">
      <slot name="cell-created_at" v-bind="slotProps">
        {{ formatOnlineUserDateTime(slotProps.row.created_at) }}
      </slot>
    </template>

    <template #cell-last_login_at="slotProps">
      <slot name="cell-last_login_at" v-bind="slotProps">
        {{ formatOnlineUserDateTime(slotProps.row.last_login_at) }}
      </slot>
    </template>

    <template #cell-actions="slotProps">
      <slot
        name="cell-actions"
        v-bind="slotProps"
        :cancel-all-orders="() => runAction('cancelAllOrders', actions.cancelAllOrders, slotProps.row)"
        :close-all-positions="() => runAction('closeAllPositions', actions.closeAllPositions, slotProps.row)"
      >
        <div class="mm-user-table__actions">
          <MmTooltip v-if="actions.cancelAllOrders" :content="messages.users.cancelAllOrders">
            <MmButton
              :aria-label="messages.users.cancelAllOrders"
              icon-only
              plain
              size="sm"
              variant="danger"
              :loading="isActionLoading('cancelAllOrders', slotProps.row)"
              @click.stop="runAction('cancelAllOrders', actions.cancelAllOrders, slotProps.row)"
            >
              <MmIcon name="circle-x" :size="14" />
            </MmButton>
          </MmTooltip>
          <MmTooltip v-if="actions.closeAllPositions" :content="messages.users.closeAllPositions">
            <MmButton
              :aria-label="messages.users.closeAllPositions"
              icon-only
              plain
              size="sm"
              variant="danger"
              :loading="isActionLoading('closeAllPositions', slotProps.row)"
              @click.stop="runAction('closeAllPositions', actions.closeAllPositions, slotProps.row)"
            >
              <MmIcon name="ban" :size="14" />
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

<style src="./user-table.css"></style>
