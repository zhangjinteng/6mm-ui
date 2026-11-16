<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useMmProTable } from '../../composables/use-pro-table'
import { MmProTable, type ProTableColumn } from '../pro-table'
import { MmLink } from '../link'
import type { QueryBarField, QueryBarValue } from '../query-bar'
import type { ContractVipQuery, ContractVipRow, ContractVipTableProps } from './types'

defineOptions({ name: 'MmContractVipTable' })
const props = defineProps<ContractVipTableProps>()
const emit = defineEmits<{ 'open-user': [row: ContractVipRow] }>()
const slots = useSlots()
const managed = new Set(['cell-user_id', 'cell-username'])
const forwardedSlots = computed(() => Object.keys(slots).filter(name => !managed.has(name)))
const queryFields = (): QueryBarField[] => [
  { key: 'keyword', label: '用户搜索', type: 'keyword', placeholder: '用户 UID/用户名/昵称', defaultValue: '', clearable: true, width: 230 },
  { key: 'vip_level', label: 'VIP等级', type: 'select', defaultValue: '', width: 148,
    options: [{ label: '全部等级', value: '' }, ...Array.from({ length: 11 }, (_, level) => ({ label: `VIP${level}`, value: level }))] },
]
const scalar = (filters: QueryBarValue, key: string): string | number =>
  typeof filters[key] === 'string' || typeof filters[key] === 'number' ? filters[key] as string | number : ''
const sortable = new Set(['volume_30d', 'vip_level', 'last_calculated_at'])
const { proTableBindings: tableBindings } = useMmProTable<ContractVipRow>({
  initialPageSize: 20,
  queryFields,
  request: ({ filters, page, pageSize, signal, sort }) => {
    const field = sort.order && sortable.has(sort.key) ? sort.key as ContractVipQuery['sort_field'] : undefined
    return props.request({ page_no: page, page_size: pageSize, sort_field: field,
      sort_order: field ? sort.order! : undefined, keyword: String(scalar(filters, 'keyword')).trim(),
      vip_level: scalar(filters, 'vip_level') }, { signal })
  },
})
const columns = computed<ProTableColumn<ContractVipRow>[]>(() => [
  { key: 'user_id', dataIndex: 'user_id', title: 'UID', width: 126, hideable: false },
  { key: 'username', dataIndex: 'username', title: '用户名', width: 232 },
  ...(props.sourceColumns ?? []),
  { key: 'vip_level', dataIndex: 'vip_level', title: 'VIP等级', width: 100, sortable: true },
  { key: 'volume_30d', dataIndex: 'volume_30d', title: '30日成交量(U)', width: 210, sortable: true },
  { key: 'current_threshold', dataIndex: 'current_threshold', title: '当前等级门槛(U)', width: 200 },
  { key: 'next_threshold', dataIndex: 'next_threshold', title: '下一等级门槛(U)', width: 200 },
  { key: 'progress_percent', dataIndex: 'progress_percent', title: '升级进度', width: 104 },
  { key: 'last_calculated_at', dataIndex: 'last_calculated_at', title: '最近计算时间', width: 195, sortable: true },
])
const formatAmount = (value: number | string | null): string => Number.isFinite(Number(value))
  ? Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'
const formatProgress = (value: number): string => Number(value.toFixed(2)).toString()
</script>

<template>
  <div class="mm-contract-vip-page" data-mm-component="contract-vip-table">
    <MmProTable v-bind="tableBindings" aria-label="合约VIP用户列表" :auto-refresh-seconds="0" :auto-refresh-options="[0]"
      :columns="columns" columns-configurable fill-height filter-drawer filter-drawer-title="筛选合约VIP用户"
      :filter-drawer-subtitle="sourceColumns?.length ? '按用户UID、用户名、昵称、来源名称或VIP等级筛选' : '按用户UID、用户名、昵称或VIP等级筛选'"
      :page-sizes="[20, 30, 40]" query-size="sm" row-key="id" show-cell-title>
      <template v-for="name in forwardedSlots" #[name]="scope"><slot :name="name" v-bind="scope" :loading="tableBindings.loading" /></template>
      <template #cell-user_id="{ row }">
        <slot name="cell-user_id" :row="row"><MmLink tone="primary" underline="hover" @click.stop="emit('open-user', row)">{{ row.user_id || '-' }}</MmLink></slot>
      </template>
      <template #cell-username="{ row }"><slot name="cell-username" :row="row">{{ row.nice_name || row.username || '-' }}</slot></template>
      <template #cell-vip_level="{ row }"><span class="mm-contract-vip-page__level">VIP{{ row.vip_level }}</span></template>
      <template #cell-volume_30d="{ row }">{{ formatAmount(row.volume_30d) }}</template>
      <template #cell-current_threshold="{ row }">{{ formatAmount(row.current_threshold) }}</template>
      <template #cell-next_threshold="{ row }">{{ row.next_threshold == null ? '—' : formatAmount(row.next_threshold) }}</template>
      <template #cell-progress_percent="{ row }">
        <span v-if="row.next_threshold == null && row.progress_percent !== null">最高等级</span>
        <span v-else-if="row.progress_percent !== null" class="mm-contract-vip-page__progress">{{ formatProgress(row.progress_percent) }}%</span>
        <span v-else>—</span>
      </template>
      <template #cell-last_calculated_at="{ row }">{{ row.last_calculated_at || '—' }}</template>
    </MmProTable>
  </div>
</template>

<style scoped>
.mm-contract-vip-page { box-sizing: border-box; height: calc(100vh - var(--navbar-height) - 24px); min-height: 460px; }
.mm-contract-vip-page :deep(.mm-pro-table) { height: 100%; }
.mm-contract-vip-page :deep(.mm-pro-table__auto-refresh) { display: none; }
.mm-contract-vip-page :deep(.mm-query-bar--single-line .contract-source-fields__symbol) { width: 230px; flex-basis: 230px; }
.mm-contract-vip-page :deep(.mm-table th), .mm-contract-vip-page :deep(.mm-table td) { padding-inline: 8px; }
.mm-contract-vip-page__level { font-weight: 600; }
.mm-contract-vip-page__progress { font-variant-numeric: tabular-nums; }
</style>
