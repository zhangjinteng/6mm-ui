<template>
    <section class="manual-adjustment-page">
        <MmAccountChangeLogTable
            aria-label="人工调账"
            :actions="tableActions"
            :columns="columns"
            columns-configurable
            fill-height
            filter-drawer-title="筛选人工调账"
            filter-drawer-subtitle="合约账户 / 资金账户"
            :query-fields="queryFields"
            :request="request"
            :show-user-type="false"
            show-cell-title
        >
            <template v-if="$slots['field-keyword']" #field-keyword="props"><slot name="field-keyword" v-bind="props" /></template>
            <template #cell-source_type="{ row }"><slot name="source-type" :row="row"><MmTag size="sm" effect="soft" round>{{ sourceLabel(row) }}</MmTag></slot></template>
            <template v-if="$slots.uid" #cell-user_id="{ row }"><slot name="uid" :row="row" /></template>
            <template v-if="$slots.username" #cell-username="{ row }"><slot name="username" :row="row" /></template>
            <template #cell-asset_type="{ row }"><slot name="asset" :row="row">{{ row.asset_type }}</slot></template>
            <template #cell-account_type="{ row }">
                <MmTag :type="row.account_type === 'funding' ? 'success' : 'primary'" effect="soft" round size="sm">{{ accountTypeLabel(row.account_type) }}</MmTag>
            </template>
            <template #cell-change_type="{ row, label }">
                <MmTag effect="soft" round size="sm">{{ row.change_type_parse || label }}</MmTag>
            </template>
            <template #cell-id="{ row }">
                {{ row.flow_id || '-' }}
            </template>
            <template #cell-ledger_sync_status="{ row }">
                <MmTag :type="row.ledger_sync_status === 'linked' ? 'success' : row.ledger_sync_status === 'failed' ? 'danger' : 'warning'" effect="soft" size="sm">
                    {{ ledgerSyncLabel(row.ledger_sync_status) }}
                </MmTag>
            </template>
            <template #cell-operator_name="{ row }">
                <span class="manual-adjustment-operator" :title="operatorLabel(row)">{{ operatorLabel(row) }}</span>
            </template>
            <template #cell-reason="{ row }">
                {{ row.reason || '-' }}
            </template>
            <template #cell-direction="{ row }">
                <MmTag v-if="row.direction" :type="row.direction === 'inc' ? 'success' : 'danger'" effect="soft" round size="sm">
                    {{ row.direction === 'inc' ? '调增' : '扣减' }}
                </MmTag>
                <span v-else>-</span>
            </template>
            <template #cell-available_balance_after="{ row }">
                {{ formatBalance(row.available_balance_after) }}
            </template>
            <template #cell-balance_before="{ row }">
                {{ formatBalance(row.wallet_balance_before) }}
            </template>
            <template #cell-balance_after="{ row }">
                {{ formatBalance(row.wallet_balance_after) }}
            </template>
        </MmAccountChangeLogTable>
        <MmDrawer v-model="detailVisible" title="人工调账详情" :size="500" @closed="detailRow = null">
            <MmInfoGrid v-if="detailRow" class="manual-adjustment-detail" size="md">
                <MmInfoGridItem label="调账单号" :span="2">{{ detailRow.order_no || '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="流水同步状态" :span="2">{{ ledgerSyncLabel(detailRow.ledger_sync_status) }}（资金已调账成功）</MmInfoGridItem>
                <MmInfoGridItem v-if="detailRow.ledger_sync_status !== 'linked'" label="说明" :span="2">{{ detailRow.ledger_sync_status === 'failed' ? '流水关联异常，请凭调账单号核查；请勿重复调账。' : '正在同步实际资金流水，完成后显示流水ID和历史余额。' }}</MmInfoGridItem>
                <MmInfoGridItem label="流水ID" :span="2">{{ detailRow.flow_id || '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="用户 UID">{{ detailRow.user_id || '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="用户名">{{ detailRow.username || '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="来源名称">{{ detailRow.source_name || '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="来源类型"><slot name="source-type" :row="detailRow">{{ sourceLabel(detailRow) }}</slot></MmInfoGridItem>
                <MmInfoGridItem label="币种">{{ detailRow.asset_type }}</MmInfoGridItem>
                <MmInfoGridItem label="账户类型">{{ accountTypeLabel(detailRow.account_type) }}</MmInfoGridItem>
                <MmInfoGridItem label="调账方向">{{ detailRow.direction === 'inc' ? '调增' : detailRow.direction === 'dec' ? '扣减' : '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="调账金额">{{ formatAccountChangeAmount(detailRow.amount) }}</MmInfoGridItem>
                <MmInfoGridItem label="调账前余额">{{ formatBalance(detailRow.wallet_balance_before) }}</MmInfoGridItem>
                <MmInfoGridItem label="调账后余额">{{ formatBalance(detailRow.wallet_balance_after) }}</MmInfoGridItem>
                <MmInfoGridItem label="调账后可用余额">{{ formatBalance(detailRow.available_balance_after) }}</MmInfoGridItem>
                <MmInfoGridItem label="操作人">
                    {{ operatorLabel(detailRow) }}
                </MmInfoGridItem>
                <MmInfoGridItem label="创建时间">{{ detailRow.created_at || '-' }}</MmInfoGridItem>
                <MmInfoGridItem label="操作原因" :span="2">{{ detailRow.reason || '-' }}</MmInfoGridItem>
            </MmInfoGrid>
            <template #footer><MmButton @click="detailVisible = false">关闭</MmButton></template>
        </MmDrawer>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MmAccountChangeLogTable, formatAccountChangeAmount, formatAccountChangeBalance,
    type AccountChangeLogTableActions, type AccountChangeLogTableColumns, type AccountChangeLogListRequest,
    type AccountChangeLogTableQueryFields } from '../account-change-log-table'
import { MmButton } from '../button'
import { MmDrawer } from '../drawer'
import { MmInfoGrid, MmInfoGridItem } from '../info-grid'
import { MmTag } from '../tag'
import type { ManualAdjustmentRow } from './types'

defineProps<{ request: AccountChangeLogListRequest<ManualAdjustmentRow> }>()
const sourceLabel = (row: ManualAdjustmentRow) => row.source_type ? ({ merchant: '商户', platform: '平台', white_label: '白标' })[row.source_type] : '-'
const ledgerSyncLabel = (status: ManualAdjustmentRow['ledger_sync_status']) => ({ pending: '流水同步中', linked: '已关联', failed: '关联异常' }[status] || '流水同步中')
const accountTypeLabel = (type: ManualAdjustmentRow['account_type']) => ({ contract: '合约账户', funding: '资金账户' }[type] || '-')
const formatBalance = (value: unknown) => value === null || value === undefined || value === ''
    ? '-' : formatAccountChangeBalance(value)
const operatorLabel = (row: ManualAdjustmentRow): string =>
    row.operator_display_name?.trim() || row.operator_account?.trim() || '—'
const queryFields: AccountChangeLogTableQueryFields = defaults => [
    { key: 'flow_id', label: '流水ID', type: 'keyword', placeholder: '流水ID', defaultValue: '', maxlength: 20, clearable: true, width: 140 },
    { key: 'keyword', label: '用户搜索', type: 'keyword', placeholder: '用户 UID/用户名/昵称', defaultValue: '', maxlength: 100, clearable: true, width: 230 },
    { key: 'account_type', label: '账户类型', type: 'select', defaultValue: '', placeholder: '账户类型：全部', width: 160, options: [
        { label: '账户类型：全部', value: '' }, { label: '合约账户', value: 'contract' }, { label: '资金账户', value: 'funding' }
    ] },
    { key: 'direction', label: '调账方向', type: 'segmented', defaultValue: '', options: [
        { label: '全部', value: '' }, { label: '调增', value: 'inc' }, { label: '扣减', value: 'dec' }
    ], block: true, width: 154 },
    { key: 'asset_type', label: '币种', type: 'keyword', placeholder: '币种', defaultValue: '', maxlength: 32, clearable: true, width: 120 },
    ...defaults.filter(field => field.key === 'time_range').map(field => ({ ...field, label: '创建时间' }))
]
const columns: AccountChangeLogTableColumns<ManualAdjustmentRow> = defaults => {
    const column = (key: string) => ({ ...defaults.find(item => item.key === key)!, align: 'left' as const })
    return [
        { ...column('id'), dataIndex: 'flow_id', title: '流水ID', width: 110, sortable: false, hideable: false },
        { key: 'ledger_sync_status', title: '流水同步状态', width: 112 },
        { key: 'platform_user_id', dataIndex: 'platform_user_id', title: 'ID', width: 56 },
        { ...column('user_id'), title: 'UID', width: 110 },
        { key: 'username', title: '用户名', width: 110 },
        { key: 'source_name', dataIndex: 'source_name', title: '来源名称', width: 96, formatter: (_, row) => row.source_name || row.agent_name_parse || '-' },
        { key: 'source_type', dataIndex: 'source_type', title: '来源类型', width: 80 },
        { ...column('change_type'), title: '流水类型', width: 84 },
        { key: 'asset_type', dataIndex: 'asset_type', title: '币种', width: 100 },
        { key: 'account_type', title: '账户类型', width: 80 },
        { key: 'direction', title: '调账方向', width: 80 },
        { ...column('amount'), title: '调账金额', width: 104 },
        { ...column('balance_before'), title: '调账前余额', width: 104 },
        { ...column('balance_after'), title: '调账后余额', width: 104 },
        { key: 'available_balance_after', title: '调账后可用余额', width: 116 },
        { key: 'operator_name', dataIndex: 'operator_name', title: '操作人', width: 128 },
        { key: 'reason', dataIndex: 'reason', title: '操作原因', width: 160 },
        { ...column('created_at'), title: '创建时间', width: 156 },
        { ...column('operation'), title: '操作', width: 60, align: 'center', fixed: 'right' }
    ]
}
const detailVisible = ref(false)
const detailRow = ref<ManualAdjustmentRow | null>(null)
const tableActions: AccountChangeLogTableActions<ManualAdjustmentRow> = {
    detail: row => { detailRow.value = row; detailVisible.value = true }
}
</script>

<style scoped>
.manual-adjustment-page {
    box-sizing: border-box;
    min-height: 420px;
    height: calc(100vh - var(--navbar-height) - 24px);
    font-variant-numeric: tabular-nums;
}
.manual-adjustment-page :deep(.mm-account-change-log-table) { height: 100%; }
.manual-adjustment-page :deep(.mm-pro-table__auto-refresh) { display: none; }
.manual-adjustment-detail { overflow-wrap: anywhere; white-space: pre-wrap; }
.manual-adjustment-operator { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (max-width: 640px) {
    .manual-adjustment-page { height: calc(100dvh - var(--navbar-height) - 16px); }
}
</style>
