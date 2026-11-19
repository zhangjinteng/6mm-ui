<template>
    <div class="current-contract-page">
        <mm-pro-table
            v-bind="proTableBindings"
            aria-label="持仓汇总"
            :columns="columns"
            columns-configurable
            empty-text="暂无持仓汇总数据"
            filter-drawer
            :filter-drawer-subtitle="showSources ? '可按交易对、来源类型和持仓方向组合筛选' : '可按交易对和持仓方向筛选'"
            filter-drawer-title="筛选持仓汇总"
            fill-height
            :inline-query-field-keys="queryFields.map(field => field.key)"
            :page-sizes="[20, 30, 40]"
            row-key="symbol"
            show-cell-title
        >
            <template #field-source_type="{ field, value, update }">
                <mm-segmented
                    :aria-label="field.label"
                    :model-value="String(value ?? '')"
                    :options="sourceTypeOptions"
                    :disabled="loading || field.disabled"
                    size="sm"
                    block
                    @update:model-value="handleSourceTypeChange($event, update)"
                />
            </template>

            <template #cell-symbol="{ row }">
                <slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot>
            </template>


            <template #cell-total_value="{ row }">
                <span class="current-contract-page__number current-contract-page__number--strong">
                    {{ formatAmount(calcPrice(row.symbol, row.total_quantity)) }}
                </span>
            </template>

            <template #cell-long_value="{ row }">
                <span class="current-contract-page__number is-long">
                    {{ formatAmount(calcPrice(row.symbol, row.long_quantity)) }}
                </span>
            </template>

            <template #cell-short_value="{ row }">
                <span class="current-contract-page__number is-short">
                    {{ formatAmount(calcPrice(row.symbol, row.short_quantity)) }}
                </span>
            </template>

            <template #cell-side_count="{ row }">
                <div class="current-contract-page__side-count">
                    <span class="is-long">{{ formatCount(row.long_count) }}</span>
                    <span class="current-contract-page__separator">/</span>
                    <span class="is-short">{{ formatCount(row.short_count) }}</span>
                </div>
            </template>

            <template #cell-position_diff="{ row }">
                <span
                    :class="[
                        'current-contract-page__number',
                        'current-contract-page__number--strong',
                        getAmountClass(calcPositionDiff(row))
                    ]"
                >
                    {{ formatAmount(calcPositionDiff(row)) }}
                </span>
            </template>

            <template #cell-pnl="{ row }">
                <span
                    :class="[
                        'current-contract-page__number',
                        'current-contract-page__number--strong',
                        getAmountClass(calcPnl(row))
                    ]"
                >
                    {{ formatAmount(calcPnl(row)) }}
                </span>
            </template>
        </mm-pro-table>


    </div>
</template>

<script lang="ts" setup>
import { MmProTable, type ProTableColumn } from '../pro-table'
import { MmSegmented } from '../segmented'
import { useMmProTable } from '../../composables/use-pro-table'
import type { QueryBarField, QueryBarFieldValue, QueryBarValue } from '../query-bar'
import type { SelectOption } from '../select'
import type { TableRow } from '../table'
import { reactive } from 'vue'

const props = defineProps<{
    request: (params: Record<string, unknown>) => Promise<{lists?: CurrentContractRow[]; count?: number}>
    markPrice: (symbol: string) => unknown
    loadSymbols?: () => Promise<{symbol: string}[]>
    showSources?: boolean
}>()

interface CurrentContractRow extends TableRow {
    account_count?: number | string | null
    long_count?: number | string | null
    long_entry_value?: number | string | null
    long_quantity?: number | string | null
    short_count?: number | string | null
    short_entry_value?: number | string | null
    short_quantity?: number | string | null
    symbol: string
    total_count?: number | string | null
    total_quantity?: number | string | null
}

const symbolFilterOptions = reactive<SelectOption[]>([{ label: '全部交易对', value: '' }])

const columns: ProTableColumn<CurrentContractRow>[] = [
    {
        align: 'left',
        dataIndex: 'symbol',
        hideable: false,
        key: 'symbol',
        title: '合约',
        width: 150
    },
    // Temporarily hide the detail column; retain its slot and dialog for restoration.
    /*
    {
        align: 'left',
        hideable: false,
        key: 'detail',
        title: '查看详情',
        width: 100
    },
    */
    {
        align: 'left',
        key: 'total_value',
        title: '持仓名义价值（USDT）',
        width: 200
    },
    {
        align: 'left',
        dataIndex: 'account_count',
        formatter: (value) => formatCount(value),
        key: 'account_count',
        title: '持仓账户数',
        width: 120
    },
    /*
    {
        align: 'left',
        dataIndex: 'total_count',
        formatter: (value) => formatCount(value),
        key: 'total_count',
        sortable: true,
        title: '持仓笔数',
        width: 110
    },
    */
    {
        align: 'left',
        key: 'long_value',
        title: '多头名义价值（USDT）',
        width: 200
    },
    {
        align: 'left',
        key: 'short_value',
        title: '空头名义价值（USDT）',
        width: 200
    },
    {
        align: 'left',
        key: 'side_count',
        title: '多 / 空仓位',
        width: 130
    },
    {
        align: 'left',
        key: 'position_diff',
        title: '净敞口（USDT）',
        width: 180
    },
    {
        align: 'left',
        hideable: false,
        key: 'pnl',
        title: '未实现盈亏（USDT）',
        width: 190
    }
]

const sourceTypeOptions = [
    { label: '全部', value: '' },
    { label: '商户', value: 'merchant' },
    { label: '白标', value: 'white_label' },
    { label: '平台', value: 'platform' }
]

const allFields: QueryBarField[] = [
    {
        defaultValue: '',
        key: 'sym',
        label: '交易对',
        options: symbolFilterOptions,
        placeholder: '输入或选择交易对',
        type: props.loadSymbols ? 'coin' : 'keyword',
        width: 180
    },
    {
        block: true,
        defaultValue: '',
        key: 'source_type',
        label: '来源类型',
        options: sourceTypeOptions,
        type: 'segmented',
        width: 208
    },
    {
        defaultValue: 'All',
        key: 'position_side',
        label: '持仓方向',
        options: [
            { label: '全部敞口', value: 'All' },
            { label: '净多头', value: 'long' },
            { label: '净空头', value: 'short' }
        ],
        type: 'select',
        width: 180
    }
]

const queryFields = allFields.filter(field => props.showSources || field.key !== 'source_type')

const createDefaultFilters = (): QueryBarValue => ({
    position_side: 'All',
    source_type: '',
    sym: ''
})

const getFilterValue = (filters: QueryBarValue, key: string) => {
    const value = filters[key]
    return value === undefined || value === null ? '' : String(value)
}

const getMarketPrice = (symbol?: string | null) => {
    if (!symbol) return 0
    return Number(props.markPrice(symbol) ?? NaN)
}

const calcPrice = (symbol: string, quantity: unknown) => {
    return getMarketPrice(symbol) * Number(quantity || 0)
}

const calcPositionDiff = (row: CurrentContractRow) => {
    return calcPrice(row.symbol, row.long_quantity) - calcPrice(row.symbol, row.short_quantity)
}

const calcPnl = (row: CurrentContractRow) => {
    const markPrice = getMarketPrice(row.symbol)
    const longPnl = markPrice * Number(row.long_quantity || 0) - Number(row.long_entry_value || 0)
    const shortPnl =
        Number(row.short_entry_value || 0) - markPrice * Number(row.short_quantity || 0)
    return longPnl + shortPnl
}

const isBlank = (value: unknown) => value === undefined || value === null || value === ''

const formatAmount = (value: unknown) => {
    if (isBlank(value)) return '-'

    const number = Number(value)
    if (!Number.isFinite(number)) return '-'

    const truncated = Math.trunc(number * 100) / 100
    return truncated.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    })
}

const formatCount = (value: unknown) => {
    if (isBlank(value)) return '-'

    const number = Number(value)
    return Number.isFinite(number) ? number.toLocaleString('en-US') : '-'
}

const getAmountClass = (value: unknown) => {
    const number = Number(value || 0)
    if (number > 0) return 'is-long'
    if (number < 0) return 'is-short'
    return ''
}

const { filters, loading, proTableBindings, query } = useMmProTable<CurrentContractRow>({
    initialAutoRefreshSeconds: 0,
    initialFilters: createDefaultFilters(),
    initialPageSize: 20,
    queryFields,
    request: async ({ filters: requestFilters, page, pageSize, sort }) => {
        const result = await props.request({
            page_no: page,
            page_size: pageSize,
            position_side: getFilterValue(requestFilters, 'position_side') || 'All',
            ...(props.showSources ? { source_type: getFilterValue(requestFilters, 'source_type') } : {}),
            sort_field: sort.order ? sort.key : '',
            sort_order: sort.order || '',
            sym: getFilterValue(requestFilters, 'sym') || 'All'
        })

        return {
            rows: Array.isArray(result?.lists) ? result.lists : [],
            total: Number(result?.count) || 0,
            updatedAt: new Date()
        }
    }
})

const handleSourceTypeChange = (value: unknown, update: (value: QueryBarFieldValue) => void) => {
    const sourceType = String(value ?? '')
    if (!sourceTypeOptions.some(option => option.value === sourceType)
        || sourceType === getFilterValue(filters.value, 'source_type')) return
    update(sourceType)
    query({ ...filters.value, source_type: sourceType })
}

const loadSymbolFilters = async () => {
    try {
        if (!props.loadSymbols) return
        const symbols = await props.loadSymbols()
        symbolFilterOptions.splice(
            1,
            symbolFilterOptions.length - 1,
            ...(Array.isArray(symbols) ? symbols : []).map((item) => ({
                label: String(item.symbol || '-'),
                value: String(item.symbol || '')
            }))
        )
    } catch (error) {
        console.error('Failed to load symbol filters', error)
    }
}

loadSymbolFilters()
</script>

<style scoped>
.current-contract-page {
    display: flex;
    box-sizing: border-box;
    height: calc(100vh - var(--navbar-height) - 24px);
    min-height: 420px;
}

.current-contract-page :deep(.mm-pro-table) {
    flex: 1;
    min-height: 0;
}

.current-contract-page__number {
    display: block;
    font-variant-numeric: tabular-nums;
}

.current-contract-page__number--strong {
    font-weight: 700;
}

.current-contract-page__side-count {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    font-variant-numeric: tabular-nums;
    gap: 5px;
}

.current-contract-page__separator {
    color: var(--mm-color-text-tertiary);
}

.is-long {
    color: var(--mm-color-success);
}

.is-short {
    color: var(--mm-color-danger);
}

.current-contract-page :deep(.mm-table td) {
    font-variant-numeric: tabular-nums;
}

.current-contract-page :deep(.mm-table th:not(.is-fixed-right)),
.current-contract-page :deep(.mm-table td:not(.is-fixed-right)) {
    border-right: 0;
}

.current-contract-page :deep(.mm-pro-table__auto-refresh) {
    display: none;
}
</style>
