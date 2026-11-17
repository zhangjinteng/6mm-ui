<template>
    <section class="asset-distribution-page" data-mm-component="asset-distribution-table">
        <MmProTable
            v-bind="proTableBindings"
            aria-label="资产分布"
            :columns="columns"
            :auto-refreshable="false"
            columns-configurable
            fill-height
            show-cell-title
            filter-drawer-title="筛选资产分布"
            :page-sizes="[20, 30, 40]"
            row-key="id"
        >
            <template #cell-source_type="{ row }">
                <MmTag :type="row.source_type === 'tenant' ? 'info' : row.source_type === 'merchant' ? 'warning' : 'success'"
                    effect="outline" size="sm" round>
                    {{ row.source_type === 'tenant' ? '白标' : row.source_type === 'merchant' ? '商户' : '平台' }}
                </MmTag>
            </template>
            <template #cell-account_type="{ row }">
                <MmTag :type="row.account_type === 'funding' ? 'success' : 'primary'" effect="soft" size="sm" round>
                    {{ row.account_type === 'funding' ? '资金账户' : '合约账户' }}
                </MmTag>
            </template>
            <template #cell-currency="{ row }"><slot name="currency" :row="row">{{ row.currency }}</slot></template>
            <template #cell-updated_at="{ row }">
                <div class="asset-distribution-page__updated-at">
                    <span>{{ formatTimestamp(row.updated_at) }}</span>
                    <MmTag v-if="row.snapshot_status === 'incomplete'" type="warning" size="sm" effect="soft">数据不完整</MmTag>
                </div>
            </template>
        </MmProTable>
    </section>
</template>

<script setup lang="ts">
import { MmProTable, type ProTableColumn } from '../pro-table'
import { MmTag } from '../tag'
import { useMmProTable, type MmProTableRequestParams } from '../../composables/use-pro-table'
import type { QueryBarField } from '../query-bar'
import { computed, watch } from 'vue'
import type { AssetDistributionRow, AssetDistributionTableProps } from './types'
import { formatDistributionBalance as formatBalance, formatDistributionCount as formatCount, formatDistributionShare as formatShare } from './formatters'
defineOptions({ name: 'MmAssetDistributionTable' })
const props = withDefaults(defineProps<AssetDistributionTableProps>(), { showSources: true })
const formatTimestamp = (value: string | null) => props.formatTimestamp ? props.formatTimestamp(value) : (value || '-')

const queryFields = computed<QueryBarField[]>(() => [
    { key: 'source_type', type: 'segmented', label: '来源类型', defaultValue: 'platform', width: 180, block: true,
        options: [{ value: 'platform', label: '平台' }, { value: 'tenant', label: '白标' }, { value: 'merchant', label: '商户' }] },
    { key: 'source_keyword', type: 'keyword', label: '来源名称', placeholder: '来源名称 / ID', defaultValue: '', maxlength: 128, clearable: true, width: 200 },
    { key: 'account_type', type: 'select', label: '账户类型', defaultValue: '', width: 160,
        options: [{ value: '', label: '账户类型：全部' }, { value: 'funding', label: '资金账户' }, { value: 'contract', label: '合约账户' }] }
].filter(field => props.showSources || !['source_type', 'source_keyword'].includes(field.key)) as QueryBarField[])
const columns = computed<ProTableColumn<AssetDistributionRow>[]>(() => [
    { key: 'currency', title: '币种', width: 100 },
    { key: 'account_type', title: '账户类型', width: 100, sortable: true },
    { key: 'source_name', title: '来源名称', width: 130, sortable: true, hideable: false },
    { key: 'source_type', title: '来源类型', width: 100, sortable: true },
    { key: 'funded_user_count', title: '持有用户数', width: 110, sortable: true, formatter: formatCount },
    { key: 'total_balance', title: '总余额（原币）', width: 150, sortable: true, formatter: formatBalance },
    { key: 'available_balance', title: '可用余额（原币）', width: 150, sortable: true, formatter: formatBalance },
    { key: 'restricted_balance', title: '受限余额（原币）', width: 150, sortable: true, formatter: formatBalance },
    { key: 'current_price', title: '当前价格（USDT）', width: 150 },
    { key: 'total_valuation', title: '总估值（USDT）', width: 150, sortable: true, formatter: formatBalance },
    { key: 'asset_share', title: '资产占比', width: 100, sortable: true, formatter: formatShare },
    { key: 'updated_at', title: '更新时间', width: 170, sortable: true }
].filter(column => props.showSources || !['source_name', 'source_type'].includes(column.key)))
const requestDistribution = async ({ filters, page, pageSize, signal, sort }: MmProTableRequestParams) => {
    const sourceType = filters.source_type === 'tenant' || filters.source_type === 'merchant' ? filters.source_type : 'platform'
    const accountType = filters.account_type === 'funding' || filters.account_type === 'contract' ? filters.account_type : ''
    try {
        return await props.request({
            ...(props.showSources ? { source_type: sourceType,
                source_keyword: typeof filters.source_keyword === 'string' ? filters.source_keyword.trim() : '' } : {}),
            account_type: accountType, page_no: page, page_size: pageSize,
            order_by: sort.order ? sort.key : 'source_name', order_dir: sort.order === 'desc' ? 'desc' : 'asc'
        }, { signal })
    } catch (error: unknown) {
        const candidate = error as { message?: string; msg?: string } | null
        throw new Error(candidate?.msg || candidate?.message || '加载资产分布失败')
    }
}
const { filters, proTableBindings, query } = useMmProTable<AssetDistributionRow>({
    queryFields, initialPageSize: 20, initialSort: { key: 'source_name', order: 'asc' },
    initialAutoRefreshSeconds: 0, request: requestDistribution
})
watch([() => filters.value.source_type, () => filters.value.account_type], () => query())
</script>

<style scoped>
.asset-distribution-page {
    box-sizing: border-box;
    height: calc(100vh - var(--navbar-height) - 24px);
    min-height: 420px;
    font-variant-numeric: tabular-nums;
}
.asset-distribution-page :deep(.mm-pro-table) { height: 100%; }
.asset-distribution-page__updated-at { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; }
@media (max-width: 640px) {
    .asset-distribution-page { height: calc(100dvh - var(--navbar-height) - 16px); }
}
</style>
