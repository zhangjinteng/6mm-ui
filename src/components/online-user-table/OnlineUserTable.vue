<script setup lang="ts" generic="Row extends OnlineUserRow = OnlineUserRow">
import { computed, onBeforeUnmount, onMounted, ref, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmIpLocation } from '../ip-location'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import type { TableSortState } from '../table'
import {
  formatOnlineUserDateTime,
  formatOnlineUserDuration,
  formatOnlineUserVipLevel,
  onlineUserLastActiveTime,
  onlineUserLoginTime,
} from './formatters'
import type { OnlineUserListQuery, OnlineUserRow, OnlineUserTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmOnlineUserTable' })

const props = withDefaults(defineProps<OnlineUserTableProps<Row>>(), {
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
const copy = messages.value.onlineUsers
const slots = useSlots()
const defaultSort: TableSortState = { key: 'last_login_at', order: 'desc' }
const sortableFields = new Set(['vip_level', 'login_time', 'last_login_at'])
const managedSlotNames = new Set([
  'cell-user_id',
  'cell-username',
  'cell-agent_user_id',
  'cell-user_type',
  'cell-vip_level',
  'cell-login_ip',
  'cell-login_time',
  'cell-online_duration',
  'cell-last_active_at',
  'query-actions',
  'toolbar-actions',
])
const nowTimestamp = ref(Date.now())
let durationTimer: number | undefined

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
        { label: copy.allRecommendations, value: '' },
        ...props.recommendationOptions,
      ],
      width: 180,
    })
  }

  return fields
})

const defaultColumns = computed<ProTableColumn<Row>[]>(() => [
  { key: 'user_id', dataIndex: 'user_id', title: messages.value.onlineUsers.userUid, width: 126, hideable: false },
  { key: 'username', dataIndex: 'username', title: messages.value.onlineUsers.username, width: 142, hideable: false },
  { key: 'agent_user_id', dataIndex: 'agent_user_id', title: messages.value.onlineUsers.externalUserId, width: 154, hideable: false },
  { key: 'user_type', dataIndex: 'user_type', title: messages.value.onlineUsers.userType, width: 134 },
  { key: 'vip_level', dataIndex: 'vip_level', title: messages.value.onlineUsers.vipLevel, width: 112, sortable: true },
  { key: 'login_ip', dataIndex: 'last_login_ip', title: messages.value.onlineUsers.loginIp, width: 300 },
  { key: 'login_time', dataIndex: 'last_login_at', title: messages.value.onlineUsers.loginTime, width: 174, sortable: true },
  { key: 'online_duration', title: messages.value.onlineUsers.onlineDuration, width: 150 },
  { key: 'last_active_at', dataIndex: 'updated_at', title: messages.value.onlineUsers.lastActiveTime, width: 174 },
])

const columns = computed<ProTableColumn<Row>[]>(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  if (!props.columns) return defaults

  const resolved = typeof props.columns === 'function'
    ? props.columns(defaults)
    : props.columns
  return Array.isArray(resolved) ? resolved : defaults
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
  return value.includes(' ')
    ? value
    : `${value} ${boundary === 'start' ? '00:00:00' : '23:59:59'}`
}

function userTypeConfig(value: unknown): { label: string, type: 'info' | 'success' | 'warning' } | null {
  const normalized = Number(value)
  if (normalized === 1) return { label: messages.value.onlineUsers.live, type: 'success' }
  if (normalized === 2) return { label: messages.value.onlineUsers.internal, type: 'info' }
  if (normalized === 3) return { label: messages.value.onlineUsers.robot, type: 'warning' }
  return null
}

async function fetchOnlineUsers({
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
  const orderBy = activeSort.key === 'login_time' ? 'last_login_at' : activeSort.key
  const query: OnlineUserListQuery = {
    create_time_end: apiDateTime(dateRange?.[1], 'end'),
    create_time_start: apiDateTime(dateRange?.[0], 'start'),
    keyword: String(scalarFilter(filters, 'keyword')),
    order_by: orderBy as OnlineUserListQuery['order_by'],
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
    throw new Error(candidate?.msg || candidate?.message || messages.value.onlineUsers.loadFailed)
  }
}

const { proTableBindings, reload } = useMmProTable<Row>({
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: fetchOnlineUsers,
})

defineExpose({ reload })

onMounted(() => {
  durationTimer = window.setInterval(() => {
    nowTimestamp.value = Date.now()
  }, 60_000)
})

onBeforeUnmount(() => {
  if (durationTimer !== undefined) window.clearInterval(durationTimer)
})
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-online-user-table"
    :aria-label="ariaLabel ?? messages.onlineUsers.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer-title="filterDrawerTitle ?? messages.onlineUsers.filterTitle"
    :filter-drawer-subtitle="filterDrawerSubtitle ?? messages.onlineUsers.filterSubtitle"
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
        <span class="mm-online-user-table__emphasis">
          {{ formatOnlineUserVipLevel(slotProps.row.vip_level) }}
        </span>
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

    <template #cell-login_time="slotProps">
      <slot name="cell-login_time" v-bind="slotProps">
        {{ formatOnlineUserDateTime(onlineUserLoginTime(slotProps.row)) }}
      </slot>
    </template>

    <template #cell-online_duration="slotProps">
      <slot name="cell-online_duration" v-bind="slotProps">
        <span class="mm-online-user-table__emphasis">
          {{ formatOnlineUserDuration(slotProps.row, nowTimestamp, messages.onlineUsers) }}
        </span>
      </slot>
    </template>

    <template #cell-last_active_at="slotProps">
      <slot name="cell-last_active_at" v-bind="slotProps">
        {{ formatOnlineUserDateTime(onlineUserLastActiveTime(slotProps.row)) }}
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

<style src="./online-user-table.css"></style>
