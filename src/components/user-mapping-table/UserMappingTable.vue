<script setup lang="ts" generic="Row extends UserMappingRow = UserMappingRow">
import { computed, useSlots } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable } from '../pro-table'
import type { ProTableColumn } from '../pro-table'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import { MmTag } from '../tag'
import type { TableSortState } from '../table'
import type { UserMappingListQuery, UserMappingRow, UserMappingTableProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmUserMappingTable' })

const props = withDefaults(defineProps<UserMappingTableProps<Row>>(), {
  agentOptions: () => [],
  ariaLabel: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  initialPageSize: 20,
  pageSizes: () => [20, 30, 40],
})

const { messages } = useLocale()
const copy = computed(() => messages.value.userMappings)
const slots = useSlots()
const defaultSort: TableSortState = { key: 'mapping_id', order: 'desc' }
const sortableFields = new Set([
  'mapping_id', 'username', 'agent_user_id', 'user_uid', 'mapping_status',
  'exception_type', 'recent_sync_at', 'agent_id',
])
const managedSlots = new Set([
  'cell-agent_id', 'cell-mapping_id', 'cell-username', 'cell-agent_user_id',
  'cell-user_uid', 'cell-mapping_status', 'cell-exception_type', 'cell-recent_sync_at',
])

const queryFields = computed<QueryBarField[]>(() => {
  const fields: QueryBarField[] = [
    {
      key: 'keyword', label: copy.value.user, type: 'keyword', defaultValue: '',
      placeholder: copy.value.keywordPlaceholder, clearable: true, width: 210,
    },
  ]
  if (props.agentOptions.length) {
    fields.push({
      key: 'agent_id', label: copy.value.agent, type: 'select', defaultValue: '',
      options: [{ label: copy.value.allAgents, value: '' }, ...props.agentOptions], width: 170,
    })
  }
  fields.push(
    {
      key: 'mapping_status', label: copy.value.mappingStatus, type: 'select', defaultValue: '', width: 170,
      options: [
        { label: copy.value.allStatuses, value: '' },
        { label: copy.value.normal, value: 'normal' },
        { label: copy.value.processing, value: 'processing' },
        { label: copy.value.abnormal, value: 'abnormal' },
      ],
    },
    {
      key: 'exception_type', label: copy.value.exceptionType, type: 'select', defaultValue: '', width: 170,
      options: [
        { label: copy.value.allExceptions, value: '' },
        { label: copy.value.duplicateMapping, value: 'duplicate_mapping' },
        { label: copy.value.userNotFound, value: 'user_not_found' },
        { label: copy.value.signatureFailed, value: 'signature_failed' },
        { label: copy.value.syncFailed, value: 'sync_failed' },
      ],
    },
    {
      key: 'recent_sync', label: copy.value.recentSyncTime, type: 'date-range',
      defaultValue: null, placeholder: copy.value.dateRange,
      shortcuts: ['today', 'yesterday', 'last7Days', 'last30Days', 'thisMonth', 'lastMonth'], width: 280,
    },
  )
  return fields
})

const display = (value: unknown): string =>
  value === null || value === undefined || String(value).trim() === '' ? '-' : String(value)
const statusLabel = (status: UserMappingRow['mapping_status']): string =>
  status === 'normal' ? copy.value.normal : status === 'processing' ? copy.value.processing : copy.value.abnormal
const statusTagType = (status: UserMappingRow['mapping_status']): 'success' | 'warning' | 'info' =>
  status === 'normal' ? 'success' : status === 'processing' ? 'warning' : 'info'
const exceptionLabel = (row: Row): string => {
  const labels: Record<string, string> = {
    duplicate_mapping: copy.value.duplicateMapping,
    user_not_found: copy.value.userNotFound,
    signature_failed: copy.value.signatureFailed,
    sync_failed: copy.value.syncFailed,
  }
  return labels[String(row.exception_code ?? '')] ?? display(row.exception_type)
}
const agentLabel = (row: Row): string =>
  display(row.agent_name || props.agentOptions.find(option => String(option.value) === String(row.agent_id))?.label || row.agent_id)
const formatDateTime = (value: unknown): string => {
  const normalized = display(value).replace('T', ' ')
  const match = normalized.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/)
  return match ? `${match[1]} ${match[2]}` : normalized
}

const defaultColumns = computed<ProTableColumn<Row>[]>(() => {
  const columns: ProTableColumn<Row>[] = [
    { key: 'mapping_id', dataIndex: 'mapping_id', title: copy.value.mappingId, width: 100, hideable: false, sortable: true },
    { key: 'username', dataIndex: 'username', title: copy.value.username, width: 160, sortable: true },
    { key: 'agent_user_id', dataIndex: 'agent_user_id', title: copy.value.externalUserId, width: 200, sortable: true },
    { key: 'user_uid', dataIndex: 'user_uid', title: copy.value.userUid, width: 110, sortable: true },
    { key: 'mapping_status', dataIndex: 'mapping_status', title: copy.value.mappingStatus, width: 140, sortable: true },
    { key: 'exception_type', dataIndex: 'exception_type', title: copy.value.exceptionType, width: 170, sortable: true },
    { key: 'recent_sync_at', dataIndex: 'recent_sync_at', title: copy.value.recentSyncTime, width: 180, sortable: true },
  ]
  if (props.agentOptions.length) {
    columns.splice(1, 0, { key: 'agent_id', dataIndex: 'agent_id', title: copy.value.agent, width: 140, sortable: true })
  }
  return columns
})
const columns = computed(() => {
  const defaults = defaultColumns.value.map(column => ({ ...column }))
  const resolved = !props.columns ? defaults : typeof props.columns === 'function' ? props.columns(defaults) : props.columns
  return Array.isArray(resolved) ? resolved.map(column => ({ ...column })) : defaults
})

const forwardedSlots = computed(() => Object.keys(slots).filter(name => !managedSlots.has(name)))
const scalar = (filters: QueryBarValue, key: string) => {
  const value = filters[key]
  return value === null || Array.isArray(value) ? '' : value
}
const toDate = (value: unknown) => value ? String(value).slice(0, 10) : ''

const { proTableBindings, reload } = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters: { keyword: '', agent_id: '', mapping_status: '', exception_type: '', recent_sync: null },
  initialPageSize: props.initialPageSize,
  initialSort: defaultSort,
  queryFields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const range = Array.isArray(filters.recent_sync) ? filters.recent_sync : null
    const activeSort = sort.order && sortableFields.has(sort.key) ? sort : defaultSort
    const query: UserMappingListQuery = {
      keyword: String(scalar(filters, 'keyword')).trim(),
      mapping_status: String(scalar(filters, 'mapping_status')) as UserMappingListQuery['mapping_status'],
      exception_type: String(scalar(filters, 'exception_type')) as UserMappingListQuery['exception_type'],
      start_time: toDate(range?.[0]), end_time: toDate(range?.[1]),
      order_by: activeSort.key as UserMappingListQuery['order_by'],
      order_dir: activeSort.order === 'asc' ? 'asc' : 'desc',
      page_no: page, page_size: pageSize,
    }
    if (props.agentOptions.length) query.agent_id = scalar(filters, 'agent_id')
    try { return await props.request(query, { signal }) }
    catch (error: unknown) {
      const candidate = error as { message?: string, msg?: string } | null
      throw new Error(candidate?.msg || candidate?.message || copy.value.loadFailed)
    }
  },
})

defineExpose({ reload })
</script>

<template>
  <MmProTable
    v-bind="{ ...$attrs, ...proTableBindings }"
    class="mm-user-mapping-table"
    :aria-label="ariaLabel ?? copy.tableAria"
    :columns="columns"
    :columns-configurable="columnsConfigurable"
    :fill-height="fillHeight"
    :filter-drawer="false"
    :inline-query-field-keys="queryFields.map(field => field.key)"
    :page-sizes="pageSizes"
    row-key="id"
  >
    <template #cell-agent_id="slotProps"><slot name="cell-agent_id" v-bind="slotProps">{{ agentLabel(slotProps.row) }}</slot></template>
    <template #cell-mapping_id="slotProps"><slot name="cell-mapping_id" v-bind="slotProps">{{ display(slotProps.row.mapping_id) }}</slot></template>
    <template #cell-username="slotProps"><slot name="cell-username" v-bind="slotProps">{{ display(slotProps.row.nice_name || slotProps.row.username) }}</slot></template>
    <template #cell-agent_user_id="slotProps"><slot name="cell-agent_user_id" v-bind="slotProps">{{ display(slotProps.row.agent_user_id) }}</slot></template>
    <template #cell-user_uid="slotProps"><slot name="cell-user_uid" v-bind="slotProps">{{ display(slotProps.row.user_uid) }}</slot></template>
    <template #cell-mapping_status="slotProps"><slot name="cell-mapping_status" v-bind="slotProps"><MmTag :type="statusTagType(slotProps.row.mapping_status)" effect="soft" round size="sm">{{ statusLabel(slotProps.row.mapping_status) }}</MmTag></slot></template>
    <template #cell-exception_type="slotProps"><slot name="cell-exception_type" v-bind="slotProps"><span class="mm-user-mapping-table__exception" :class="{ 'is-abnormal': !!slotProps.row.exception_code }">{{ exceptionLabel(slotProps.row) }}</span></slot></template>
    <template #cell-recent_sync_at="slotProps"><slot name="cell-recent_sync_at" v-bind="slotProps">{{ formatDateTime(slotProps.row.recent_sync_at) }}</slot></template>
    <template v-for="slotName in forwardedSlots" :key="slotName" #[slotName]="slotProps"><slot :name="slotName" v-bind="slotProps" /></template>
  </MmProTable>
</template>

<style src="./user-mapping-table.css"></style>
