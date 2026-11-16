<template>
    <div class="history-page">
        <mm-pro-table
            v-bind="proTableBindings"
            aria-label="历史行情"
            :columns="columns"
            :columns-configurable="false"
            :filter-drawer="false"
            fill-height
            :page-sizes="[20, 30, 40]"
            :query-fields="queryFields"
            row-key="_rowKey"
            show-cell-title
        >
            <template #toolbar-actions>
                <mm-segmented
                    aria-label="历史行情时间范围"
                    :model-value="String(filters.range || '24h')"
                    :options="timeRangeOptions"
                    size="sm"
                    @update:model-value="changeRange"
                />
            </template>
            <template #cell-symbol="{ row }">
                <slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot>
            </template>
            <template #cell-close="{ value }">
                <strong class="history-page__close">{{ formatHistoryValue(value) }}</strong>
            </template>
        </mm-pro-table>
    </div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, onUnmounted, reactive } from 'vue'
import type { MarketHistoryApi, MarketHistoryRow } from './types'
const props = defineProps<{ api: MarketHistoryApi }>()
import { MmProTable, type ProTableColumn } from '../components/pro-table'
import { MmSegmented, type SegmentedValue } from '../components/segmented'
import { useMmProTable } from '../composables'
import type { QueryBarField } from '../components/query-bar'
import type { TableRow } from '../components/table'

import {
    defaultMetric,
    formatHistoryTime,
    formatHistoryValue,
    intervalOptions,
    metricOptions,
    rangeOptions,
    valueColumnTitles,
    type HistoryInterval,
    type HistoryMetric,
    type HistoryRange
} from './history'

interface HistoryRow extends TableRow {
    _rowKey: string
    timestamp_ms: number
    symbol: string
    open: string | null
    high: string | null
    low: string | null
    close: string | null
    metric: HistoryMetric
}

const timeRangeOptions = rangeOptions.map((option) => ({ ...option }))
const optionsData = reactive<{ symbolList: { symbol?: string | null }[] }>({ symbolList: [] })
const optionsController = new AbortController()
onMounted(async () => {
    try {
        const symbols = await props.api.symbols(optionsController.signal)
        if (!optionsController.signal.aborted) optionsData.symbolList = symbols
    } catch { /* Keep the empty catalog; the table reports history request failures. */ }
})
onUnmounted(() => optionsController.abort())

const queryFields = computed<QueryBarField[]>(() => [
    {
        key: 'symbol',
        label: '合约',
        type: 'coin',
        defaultValue: '',
        placeholder: '搜索或选择币种 / 交易对',
        clearable: true,
        width: 240,
        options: [
            { label: '全部交易对', value: '' },
            ...(Array.isArray(optionsData.symbolList) ? optionsData.symbolList : [])
                .map((item) => String(item.symbol || '').trim())
                .filter(Boolean)
                .map((symbol) => ({ label: symbol, value: symbol }))
        ]
    },
    {
        key: 'metric',
        label: '行情指标',
        type: 'select',
        defaultValue: defaultMetric,
        clearable: false,
        width: 190,
        options: metricOptions.map((option) => ({ ...option }))
    },
    {
        key: 'interval',
        label: 'K线周期',
        type: 'select',
        defaultValue: '1m',
        clearable: false,
        width: 160,
        options: intervalOptions.map((option) => ({ ...option }))
    }
])

let queryEndMs: number | undefined

const { proTableBindings, filters, query } = useMmProTable<HistoryRow>({
    initialFilters: { symbol: '', metric: defaultMetric, interval: '1m', range: '24h' },
    initialPageSize: 20,
    queryFields,
    request: async ({ filters: values, page = 1, pageSize = 20, reason, signal }) => {
        if (reason !== 'state-change' && reason !== 'retry') queryEndMs = undefined
        const metric = String(values.metric || defaultMetric) as HistoryMetric
        const result = await props.api.history(
            {
                metric,
                interval: String(values.interval || '1m') as HistoryInterval,
                range: String(values.range || '24h') as HistoryRange,
                symbol: String(values.symbol || ''),
                page_no: page,
                page_size: pageSize,
                end_ms: queryEndMs
            },
            signal
        )
        if (!signal.aborted) queryEndMs = Number(result?.end_ms) || undefined
        const resultRows = (Array.isArray(result?.lists) ? result.lists : []).map(
            (row: MarketHistoryRow) => ({
                ...row,
                metric,
                _rowKey: `${metric}-${row.symbol}-${row.timestamp_ms}`
            })
        )
        return { rows: resultRows, total: Number(result?.count) || 0, updatedAt: new Date() }
    }
})

const columns = computed<ProTableColumn<HistoryRow>[]>(() => {
    const titles = valueColumnTitles()
    return [
        {
            key: 'timestamp_ms',
            dataIndex: 'timestamp_ms',
            title: '记录时间',
            width: 180,
            align: 'left',
            formatter: (value) => formatHistoryTime(value)
        },
        { key: 'symbol', dataIndex: 'symbol', title: '合约', width: 180, align: 'left' },
        ...(['open', 'high', 'low', 'close'] as const).map((key, index) => ({
            key,
            dataIndex: key,
            title: titles[index],
            width: 170,
            align: 'left' as const,
            formatter: formatHistoryValue
        }))
    ]
})

function changeRange(value: SegmentedValue) {
    query({ ...filters.value, range: String(value) })
}

// 合约输入由查询按钮/回车提交，避免输入过程中逐字请求、禁用输入框。
watch(
    () => [filters.value.metric, filters.value.interval],
    (value, previous) => {
        if (value.some((item, index) => item !== previous?.[index])) query(filters.value)
    }
)
</script>

<style scoped>
.history-page {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--navbar-height) - 24px);
    min-height: 420px;
}

.history-page :deep(.mm-pro-table) {
    flex: 1;
    min-height: 0;
}

.history-page :deep(.mm-pro-table__auto-refresh) {
    display: none;
}
.history-page :deep(.mm-table th),
.history-page :deep(.mm-table td) {
    border-right: 0;
}
.history-page :deep(.mm-table td) {
    font-variant-numeric: tabular-nums;
}
.history-page__close {
    font-weight: 600;
}

</style>
