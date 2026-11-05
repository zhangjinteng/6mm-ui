<script setup lang="ts">
import { computed, watch } from 'vue'
import { MmProTable, type ProTableColumn } from '../pro-table'
import { MmTag } from '../tag'
import { useMmProTable, type MmProTableRequestParams } from '../../composables/use-pro-table'
import { formatTradeReportDecimal } from '../futures-trade-report/formatters'
import type { QueryBarField } from '../query-bar'
import type { AssetReportKind, AssetReportQuery, AssetReportRow, AssetReportRequest } from './types'

const props = defineProps<{ kind: AssetReportKind; showSources?: boolean; request: AssetReportRequest; formatTimestamp: (value: string) => string }>()
const title = computed(() => props.kind === 'distribution' ? '用户资产分布' : '资产变动')
const bucketLabels = ['0–100U', '100–1,000U', '1千–1万U', '1万–10万U', '10万U以上']
const money = (value: unknown): string => value === null || value === undefined || value === '' ? '—' : formatTradeReportDecimal(value, 2)
const count = (value: unknown): string => value === null || value === undefined || value === '' ? '—' : formatTradeReportDecimal(value, 0)
const share = (value: unknown): string => value === null || value === undefined || value === '' ? '—' : `${formatTradeReportDecimal(value, 2)}%`
const queryFields = computed<QueryBarField[]>(() => [
  { key: 'period', type: 'segmented', label: '统计粒度', defaultValue: 'day', width: 110,
    options: [{ value: 'day', label: '日报' }, { value: 'month', label: '月报' }] },
  { key: 'account_type', type: 'segmented', label: '账户类型', defaultValue: 'funding', width: 190,
    options: [{ value: 'funding', label: '资金账户' }, { value: 'contract', label: '合约账户' }] },
  ...(props.showSources ? [
  { key: 'source_type', type: 'segmented' as const, label: '来源类型', defaultValue: 'platform', width: 180,
    options: [{ value: 'platform', label: '平台' }, { value: 'tenant', label: '白标' }, { value: 'merchant', label: '商户' }] },
  { key: 'source_keyword', type: 'keyword' as const, label: '来源名称', placeholder: '来源名称 / ID', defaultValue: '', maxlength: 128, clearable: true, width: 180 },
  ] : []),
  { key: 'date_range', type: 'date-range', label: '统计日期', placeholder: 'UTC统计日期范围', defaultValue: null, width: 250 },
])
const columns = computed<ProTableColumn<AssetReportRow>[]>(() => [
  { key: 'stat_date', title: filters.value.period === 'month' ? '统计月份' : '统计日期', width: props.kind === 'distribution' ? 105 : 120, sortable: true, hideable: false },
  ...(props.showSources ? [
  { key: 'source_name', title: '来源名称', width: props.kind === 'distribution' ? 110 : 140, sortable: true },
  { key: 'source_type', title: '来源类型', width: props.kind === 'distribution' ? 75 : 90 },
  ] : []),
  { key: 'account_type', title: '账户类型', width: props.kind === 'distribution' ? 85 : 100 },
  { key: 'currency', title: '币种', width: props.kind === 'distribution' ? 60 : 80 },
  ...(props.kind === 'distribution' ? [
    { key: 'funded_user_count', title: '有资产用户', width: 100, sortable: true, formatter: count },
    { key: 'total_assets', title: '资产总额(U)', width: 125, sortable: true, formatter: money },
    { key: 'negative_assets', title: '负余额合计(U)', width: 120, sortable: true, formatter: money },
    ...bucketLabels.map((label, index) => ({ key: `bucket_${index}_amount`, title: `${label} 人数/金额`, width: 160, sortable: true })),
  ] : [
    { key: 'opening_assets', title: '期初资产(U)', width: 150, sortable: true, formatter: money },
    { key: 'deposit_in', title: '充值/划入(U)', width: 150, sortable: true, formatter: money },
    { key: 'withdraw_out', title: '提现/划出(U)', width: 150, sortable: true, formatter: money },
    { key: 'transfer_net', title: '账户划转净额(U)', width: 160, sortable: true, formatter: money },
    ...(filters.value.account_type === 'contract' ? [
      { key: 'realized_pnl', title: '合约已实现盈亏(U)', width: 170, sortable: true, formatter: money },
      { key: 'fee_net', title: '合约手续费及资金费(U)', width: 180, sortable: true, formatter: money },
    ] : []),
    { key: 'manual_adjust', title: '人工调账(U)', width: 150, sortable: true, formatter: money },
    { key: 'closing_assets', title: '实际期末(U)', width: 150, sortable: true, formatter: money },
  ]),
  { key: 'updated_at', title: '快照采集时间', width: props.kind === 'distribution' ? 165 : 180 },
  { key: 'stat_status', title: '统计状态', width: props.kind === 'distribution' ? 90 : 115, fixed: 'right' },
])
const requestReport = async ({ filters, page, pageSize, signal, sort }: MmProTableRequestParams) => {
  const range = Array.isArray(filters.date_range) ? filters.date_range : []
  const params: AssetReportQuery = {
    period: filters.period === 'month' ? 'month' : 'day',
    account_type: filters.account_type === 'contract' ? 'contract' : 'funding', currency: 'USDT',
    ...(props.showSources ? { source_type: filters.source_type === 'tenant' || filters.source_type === 'merchant' ? filters.source_type : 'platform',
    source_keyword: String(filters.source_keyword ?? '').trim() } : {}), start_date: String(range[0] ?? ''), end_date: String(range[1] ?? ''),
    page_no: page, page_size: pageSize, order_by: sort.order ? sort.key : 'stat_date', order_dir: sort.order === 'asc' ? 'asc' : 'desc',
  }
  try {
    return await props.request(params, { signal })
  } catch (error: unknown) {
    const candidate = error as { msg?: string; message?: string } | null
    throw new Error(candidate?.msg || candidate?.message || '加载资产报表失败')
  }
}
const { filters, proTableBindings, query } = useMmProTable<AssetReportRow>({
  queryFields, initialPageSize: 20, initialSort: { key: 'stat_date', order: 'desc' },
  initialAutoRefreshSeconds: 0, request: requestReport,
})
watch([() => filters.value.period, () => filters.value.source_type, () => filters.value.account_type], () => query())
</script>

<template>
  <section class="asset-phase-one-report" :class="{ 'asset-phase-one-report--distribution': kind === 'distribution' }">
    <MmProTable v-bind="proTableBindings" :columns="columns" :aria-label="title" :auto-refreshable="false"
      columns-configurable fill-height show-cell-title row-key="id" :filter-drawer-title="`筛选${title}`" :page-sizes="[20, 30, 50]">
      <template #cell-stat_date="{ row }"><strong>{{ row.stat_date }}</strong></template>
      <template #cell-source_type="{ row }">
        <MmTag :type="row.source_type === 'platform' ? 'success' : row.source_type === 'tenant' ? 'info' : 'warning'" size="sm" round>
          {{ row.source_type === 'platform' ? '平台' : row.source_type === 'tenant' ? '白标' : '商户' }}
        </MmTag>
      </template>
      <template #cell-account_type="{ row }">{{ row.account_type === 'funding' ? '资金账户' : '合约账户' }}</template>
      <template v-for="(_, index) in bucketLabels" :key="index" #[`cell-bucket_${index}_amount`]="{ row }">
        <div class="asset-phase-one-report__bucket">
          <span>{{ count(row.buckets[index]?.count) }} <small v-if="row.buckets[index]?.user_share != null">（{{ share(row.buckets[index]?.user_share) }}）</small></span>
          <span>{{ money(row.buckets[index]?.amount) }} <small v-if="row.buckets[index]?.asset_share != null">（{{ share(row.buckets[index]?.asset_share) }}）</small></span>
        </div>
      </template>
      <template #cell-updated_at="{ row }">{{ row.updated_at ? formatTimestamp(row.updated_at) : '—' }}</template>
      <template #cell-stat_status="{ row }">
        <slot name="cell-stat_status" :row="row" />
      </template>
    </MmProTable>
  </section>
</template>

<style scoped>
.asset-phase-one-report { display: flex; flex-direction: column; gap: 8px; min-width: 0; height: calc(100vh - var(--navbar-height, 60px) - 24px); min-height: 480px; font-variant-numeric: tabular-nums; }
.asset-phase-one-report :deep(.mm-pro-table) { flex: 1 1 0%; min-height: 0; }
.asset-phase-one-report--distribution :deep(.mm-table th),
.asset-phase-one-report--distribution :deep(.mm-table td) { min-width: 0; padding-inline: 8px; }
.asset-phase-one-report__bucket { display: grid; gap: 3px; line-height: 1.4; }
.asset-phase-one-report__bucket small { color: var(--mm-text-secondary, #626f85); }
@media (max-width: 640px) { .asset-phase-one-report { height: calc(100dvh - var(--navbar-height, 60px) - 16px); } }
</style>
