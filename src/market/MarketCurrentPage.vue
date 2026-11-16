<template>
    <div class="config-pro-page">
        <mm-pro-table
            v-bind="proTableBindings"
            aria-label="交易对预览"
            :columns="columns"
            columns-configurable
            empty-text="暂无交易对预览数据"
            filter-drawer
            fill-height
            :inline-query-field-keys="['keyword', 'sym']"
            :page-sizes="[20, 30, 40]"
            row-key="id"
            show-cell-title
        >
            <template #cell-symbol="{ row }"><slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot></template>
            <template #cell-last="{ row }"
                ><span class="config-pro-page__number">{{
                    formatAmount(price(row.symbol, 'lastPrice'))
                }}</span></template
            >
            <template #cell-mark="{ row }"
                ><span class="config-pro-page__number">{{
                    formatAmount(price(row.symbol, 'markPrice'))
                }}</span></template
            >
            <template #cell-index="{ row }"
                ><span class="config-pro-page__number">{{
                    formatAmount(price(row.symbol, 'indexPrice'))
                }}</span></template
            >
            <template #cell-funding="{ row }"
                ><span class="config-pro-page__number">{{
                    fundingRate(row.symbol)
                }}</span></template
            >
            <template #cell-volume="{ row }"
                ><span class="config-pro-page__number">{{
                    formatTradeVolume(row.symbol)
                }}</span></template
            >
            <template #cell-quantity="{ row }"
                ><span class="config-pro-page__number">{{
                    formatTradeQuantity(row.symbol)
                }}</span></template
            >
            <template #cell-interest="{ row }"
                ><span class="config-pro-page__number">{{
                    formatAmount(price(row.symbol, 'openInterest'))
                }}</span></template
            >
        </mm-pro-table>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import type { MarketCurrentApi, MarketPriceMap } from './types'
const props = defineProps<{ api: MarketCurrentApi; priceMap?: MarketPriceMap }>()
import { MmProTable, type ProTableColumn } from '../components/pro-table'
import { useMmProTable } from '../composables'
import type { QueryBarField, QueryBarValue } from '../components/query-bar'
import type { SelectOption } from '../components/select'
import type { TableRow } from '../components/table'
interface Row extends TableRow {
    id: number | string
    symbol: string
    remain?: string
}
const symbolOptions = reactive<SelectOption[]>([{ label: '全部交易对', value: 'All' }]),
    tradeStats24h = ref<import('./types').SymbolTradeStats24hMap>({})
let tradeStatsController: AbortController | null = null
const price = (symbol: string, field: string) => Number(props.priceMap?.[symbol]?.[field] ?? NaN)
const formatAmount = (value: unknown) =>
    Number.isFinite(Number(value)) ? (Math.floor(Number(value) * 100) / 100).toFixed(2) : '-'
const formatTradeVolume = (symbol: string) => {
    const stats = tradeStats24h.value[symbol]
    return stats ? formatAmount(stats.trade_volume_24h) : '-'
}
const formatTradeQuantity = (symbol: string) => {
    const stats = tradeStats24h.value[symbol]
    const quantity = Number(stats?.trade_quantity_24h)
    return stats && Number.isFinite(quantity) ? quantity.toFixed(8).replace(/\.?0+$/, '') : '-'
}
const fundingRate = (symbol: string) =>
    Number.isFinite(price(symbol, 'fundingRate'))
        ? `${(price(symbol, 'fundingRate') * 100).toFixed(8).replace(/\.?0+$/, '')}%`
        : '-'
const columns: ProTableColumn<Row>[] = [
    {
        align: 'left',
        dataIndex: 'symbol',
        hideable: false,
        key: 'symbol',
        title: '合约',
        width: 150
    },
    { align: 'left', key: 'last', title: '最新成交价', width: 125 },
    { align: 'left', key: 'mark', title: '标记价格', width: 125 },
    { align: 'left', key: 'index', title: '指数价格', width: 125 },
    { align: 'left', key: 'funding', title: '资金费率(%)', width: 135 },
    {
        align: 'left',
        dataIndex: 'remain',
        key: 'remain',
        title: '费率倒计时/时间',
        width: 145,
        formatter: (v) => String(v || '-')
    },
    { align: 'left', key: 'volume', title: '24 小时成交量(U)', width: 165 },
    { align: 'left', key: 'quantity', title: '24 小时成交数量', width: 165 },
    { align: 'left', key: 'interest', title: '合约持仓量(U)', width: 155 }
]
const queryFields: QueryBarField[] = [
    {
        clearable: true,
        defaultValue: '',
        key: 'keyword',
        label: '交易对',
        placeholder: '请输入交易对',
        type: 'keyword',
        width: 190
    },
    {
        defaultValue: 'All',
        key: 'sym',
        label: '交易对列表',
        options: symbolOptions,
        type: 'select',
        width: 190
    }
]
const value = (f: QueryBarValue, k: string, d = '') => String(f[k] ?? d).trim() || d
const loadTradeStats24h = async (rows: Row[]) => {
    const symbols = Array.from(new Set(rows.map((row) => row.symbol).filter(Boolean)))
    tradeStatsController?.abort()
    tradeStats24h.value = {}
    if (!symbols.length) return

    const controller = new AbortController()
    tradeStatsController = controller
    try {
        const result = await props.api.tradeStats(symbols, controller.signal)
        if (controller.signal.aborted || tradeStatsController !== controller) return

        const nextStats = Object.fromEntries(
            symbols.map((symbol) => [
                symbol,
                result?.[symbol] ?? {
                    trade_quantity_24h: '0',
                    trade_volume_24h: '0'
                }
            ])
        )
        tradeStats24h.value = nextStats
    } catch {
        if (!controller.signal.aborted && tradeStatsController === controller) {
            tradeStats24h.value = {}
        }
    } finally {
        if (tradeStatsController === controller) tradeStatsController = null
    }
}
const { proTableBindings } = useMmProTable<Row>({
    initialAutoRefreshSeconds: 0,
    initialFilters: { keyword: '', sym: 'All' },
    initialPageSize: 20,
    queryFields,
    request: async ({ filters, page, pageSize, signal }) => {
        const result = await props.api.preview({
            keyword: value(filters, 'keyword'),
            sym: value(filters, 'sym', 'All'),
            page_no: page,
            page_size: pageSize
        }, signal)
        const rows = Array.isArray(result?.lists) ? result.lists : []
        if (!signal.aborted) void loadTradeStats24h(rows)
        return {
            rows,
            total: Number(result?.count) || 0,
            updatedAt: new Date()
        }
    }
})
const optionsController = new AbortController()
onMounted(async () => {
    try {
        const result = await props.api.symbols(optionsController.signal)
        if (optionsController.signal.aborted) return
        symbolOptions.splice(
            1,
            symbolOptions.length - 1,
            ...(Array.isArray(result) ? result : []).map((item: any) => ({
                label: item.symbol,
                value: item.symbol
            }))
        )
    } catch {
        /* 保留全部交易对 */
    }
})
onUnmounted(() => { optionsController.abort(); tradeStatsController?.abort() })
</script>

<style scoped>
.config-pro-page {
    height: calc(100vh - var(--navbar-height) - 24px);
    min-height: 420px;
    overflow: hidden;
}
.config-pro-page :deep(.mm-table th:not(.is-fixed-right)),
.config-pro-page :deep(.mm-table td:not(.is-fixed-right)) {
    border-right: 0;
}
.config-pro-page :deep(.mm-pro-table__auto-refresh) {
    display: none;
}
.config-pro-page__number {
    display: block;
    font-variant-numeric: tabular-nums;
}
</style>
