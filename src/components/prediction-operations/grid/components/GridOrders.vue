<template>
    <section class="grid-orders prediction-table-page prediction-compact-table mm-ui" :class="{ 'grid-history-orders': isHistory }">
        <header class="mm-sr-only">
            <h2>{{ text(view) }}</h2>
            <p>{{ text('readOnly') }} · {{ timezone }}</p>
        </header>
        <p v-if="expired" role="alert">{{ text('authExpired') }}</p>
        <p v-else-if="!allowed" role="alert">{{ text('noPermission') }}</p>
        <template v-else>
            <p v-if="validation" role="alert" class="validation">{{ validation }}</p>
            <MmProTable
                fill-height
                :aria-label="text(view)"
                :query-fields="queryFields"
                :filters="filters"
                :inline-query-field-keys="['user_keyword', 'date_range', 'order_no', 'status', 'symbol']"
                filter-drawer
                :filter-drawer-title="text('query')"
                :filter-drawer-subtitle="text('timeRange')"
                :columns="columns"
                :data="page?.lists || []"
                :loading="loading"
                :error="error"
                :empty-text="text('empty')"
                :show-pagination="true"
                :current-page="pageNo"
                :page-size="pageSize"
                :page-sizes="[20, 50, 100]"
                :total="paginationTotal"
                :refreshable="true"
                :auto-refresh-seconds="0"
                :auto-refresh-options="[0]"
                columns-configurable
                :show-cell-title="isHistory"
                row-key="order_id"
                @update:filters="updateFilters"
                @update:current-page="paginate($event, pageSize)"
                @update:page-size="paginate(1, $event)"
                @query="query"
                @reset="reset"
                @refresh="refresh"
                @retry="load"
            >
                <template #field-date_range="{ value, update }"
                    ><GridDateRange :value="value" @update="update"
                /></template>
                <template #cell-symbol="{ row }"><SymbolDisplay :symbol="row.symbol" /></template>
                <template #cell-source_type="{ row }"><SourceTypeTag :source-type="row.source_type ?? null" /></template>
                <template #cell-order_status="{ row }">
                    <span class="prediction-status prediction-grid-status" :class="[`prediction-status--${gridStatusTone(row.status)}`, {'prediction-grid-loss': row.status === 6}]">{{ gridTableDisplay('order_status', row, fieldDisplay) || String(row.status ?? '—') }}</span>
                </template>
                <template #cell-realized_pnl="{ row }"><span class="prediction-pnl" :class="`prediction-pnl--${profitTone(gridTableDisplay('realized_pnl', row, fieldDisplay))}`">{{ gridTableDisplay('realized_pnl', row, fieldDisplay) }}</span></template>
                <template v-for="key in historyTimeKeys" :key="key" #[`cell-${key}`]="{ row }">
                    <span class="grid-history-time">{{ historyTimeText(row, key) }}</span>
                </template>
                <template v-if="isHistory" #cell-operation="{ row }">
                    <MmButton size="sm" icon-only :aria-label="t('查看详情')" :title="t('查看详情')" @click="openHistoryDetail(row)">
                        <MmIcon name="panel-left-close" :size="15" />
                    </MmButton>
                </template>
            </MmProTable>
            <GridHistoryDetailDrawer
                v-if="isHistory"
                v-model="historyDetailVisible"
                :row="historyDetailRow"
                @closed="clearHistoryDetail"
            />
            <p v-if="totalPages > 1000" role="status">{{ text('limit') }}</p>
        </template>
    </section>
</template>
<script setup lang="ts">
import { useSymbolOptions } from '../../use-symbol-options'
import { predictionColumnWidth } from '../../column-width'
import { gridStatusTone, profitTone } from '../../status-tone'
import { computed, defineComponent, h, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
    MmProTable,
    MmButton,
    MmIcon,
    type ProTableColumn,
    type QueryBarField,
    type QueryBarValue
} from '../../ui'
import { MmDateRangePicker } from '../../ui'
import { calendarRange, calendarSelection } from '../../calendar-range'
import { defaultQueryRange } from '../../query'
import SymbolDisplay from '../../SymbolDisplay.vue'
import SourceTypeTag from '../../SourceTypeTag.vue'
import { formatUserName } from '../../format-user-name'
import type { GridOrder, GridPage, OrderView, PredictionGridAdapter, PredictionPageContext } from '../../types'
import { providePresentation } from '../../context'
import { usePredictionLocale } from '../../locale'
import { errorMessage } from '../../format'
import GridHistoryDetailDrawer from './GridHistoryDetailDrawer.vue'
import { locationInput, locationPlan, LinkSession } from '../../order-location'
import { epoch, ReadGate, serializeQuery, statuses, validatePage } from '../query'
import {
    display,
    errorInfo,
    fields,
    gridTableKeys,
    gridTableDisplay,
    tableLabels,
    localTime,
    messages,
    statusNames
} from '../format'
const props = defineProps<{ view: OrderView; adapter: PredictionGridAdapter; context: PredictionPageContext; showSources?: boolean; locale?: string }>()
const t = usePredictionLocale(() => props.locale)
const isHistory = computed(() => props.view === 'history')
const historyDetailVisible = ref(false)
const historyDetailRow = ref<GridOrder | null>(null)
function openHistoryDetail(row: GridOrder) {
    if (!isHistory.value || !allowed.value) return
    historyDetailRow.value = row
    historyDetailVisible.value = true
}
function clearHistoryDetail() {
    if (!historyDetailVisible.value) historyDetailRow.value = null
}
const historyTimeKeys = computed(() => isHistory.value ? ['created_at_ms', 'settled_at_ms'] : [])
const historyDateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
})
function historyTimeText(row: Record<string, unknown>, key: string): string {
    const value = row[key]
    if (typeof value !== 'string' || !/^\d+$/.test(value) || BigInt(value) > 253402300799999n) {
        return gridTableDisplay(key, row, display)
    }
    const parts = Object.fromEntries(historyDateTimeFormatter.formatToParts(new Date(Number(value)))
        .map(({ type, value: part }) => [type, part]))
    return `${parts.year}/${parts.month}/${parts.day}\n${parts.hour}:${parts.minute}:${parts.second}`
}
providePresentation(() => ({ symbolComponent: props.adapter.symbolComponent, showSources: props.showSources !== false, locale: props.locale }))
const user = { get perms() { return props.context.permissions }, get userInfo() { return { id: props.context.actorId } } }
const route = { get query() { return props.context.route.query }, get fullPath() { return props.context.route.fullPath } }
const router = { replace: (target: {path: string; query: Record<string, string>}) => props.adapter.navigate(target) }
const gate = new ReadGate()
const text = (key: string) => t(messages[key] || fields[key] || key)
const tableTitle = (key: string) => t(tableLabels[key] || key)
const fieldDisplay = (key: string, value: unknown) => ['status', 'duration_seconds'].includes(key) || key.startsWith('ledger_') ? t(display(key,value)) : display(key,value)
const statusText = (status: number) => t(statusNames[status])
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const actor = computed(() => String(user.userInfo.id || ''))
const permitted = (key: string) =>
    !!actor.value && (user.perms.includes('*') || user.perms.includes(key))
const expired = ref(false),
    allowed = computed(() => permitted('grid_order:lists') && !expired.value)
const context = computed(() =>
    JSON.stringify([actor.value, user.perms, props.view, route.fullPath, props.context.identityKey])
)
const initialRange = (): [string, string] => {
    const [from, to] = defaultQueryRange(props.view)
    return [localTime(from.getTime()), localTime(to.getTime())]
}
const defaults = (): QueryBarValue => ({
    date_range: props.view === 'history' ? initialRange() : null
})
const filters = ref<QueryBarValue>(defaults()),
    validation = ref(''),
    error = ref(''),
    loading = ref(false)
const page = ref<GridPage | null>(null),
    pageNo = ref(1),
    pageSize = ref(20)
const totalPages = computed(() => (page.value ? Math.ceil(page.value.count / pageSize.value) : 0))
const paginationTotal = computed(() => Math.min(page.value?.count ?? 0, 1000 * pageSize.value))
const textKeys = ['order_no', 'public_user_id', 'symbol', 'user_id', 'client_order_id', 'home_site_id']
const filterKeys = ['user_keyword', 'order_id', ...textKeys]
const symbolOptions = useSymbolOptions(allowed, props.adapter.symbols, () => props.context.identityKey)
const queryFields = computed<QueryBarField[]>(() => [
    { key: 'user_keyword', label: t('用户搜索'), type: 'keyword', placeholder: t('用户 UID/用户名/昵称'), width: 230, maxlength: 128, clearable: true },
    { key: 'date_range', type: 'date-range', label: text('timeRange'), width: 240 },
    ...textKeys.map((key) => key === 'symbol' ? {
        key, type: 'coin' as const, label: text(key), clearable: true, width: 150, options: symbolOptions.value
    } : ({
        key,
        type: 'keyword' as const,
        label: key === 'public_user_id' ? tableTitle('public_user_id') : key === 'user_id' ? tableTitle('internal_user_id') : text(key),
        clearable: true,
        width: key === 'public_user_id' ? 130 : 150
    })),
    {
        key: 'status',
        type: 'select',
        label: text('status'),
        clearable: true,
        width: 120,
        options: statuses(props.view).map((value) => ({
            value: String(value),
            label: statusText(value)
        }))
    }
])
const columns = computed<ProTableColumn[]>(() => [
    ...gridTableKeys(props.view, props.showSources !== false).map((key) => ({
        key,
        dataIndex: key,
        title: key === 'user_name' ? t('用户名') : tableTitle(key),
        width: predictionColumnWidth(key, isHistory.value ? 'grid-history' : undefined),
        align: 'left' as const,
        formatter: (_: unknown, row: Record<string, unknown>) =>
            key === 'user_name'
                ? formatUserName(typeof row.nick_name === 'string' ? row.nick_name : undefined, typeof row.user_name === 'string' ? row.user_name : undefined)
                : gridTableDisplay(key, row, fieldDisplay)
    })),
    ...(isHistory.value ? [{ key: 'operation', title: t('操作'), width: predictionColumnWidth('operation', 'grid-history'), align: 'center' as const, fixed: 'right' as const }] : [])
])
const rangePart = (value: unknown, index: number): string =>
    Array.isArray(value) && typeof value[index] === 'string' ? value[index] : ''
// Keep drawer drafts independent; selecting days emits one complete time range.
const GridDateRange = defineComponent({
    props: { value: { type: null } },
    emits: ['update'],
    setup(props, { emit }) {
        return () => h(MmDateRangePicker, {
            size: 'sm',
            modelValue: calendarSelection([0, 1].map(index => new Date(rangePart(props.value, index).replace(' ', 'T')))),
            placeholder: tableTitle('created_at_ms'),
            'onUpdate:modelValue': (value: unknown) => emit('update', calendarRange(value)?.map(date => localTime(date.getTime())) ?? ['', ''])
        })
    }
})
function invalidate() {
    historyDetailVisible.value = false
    historyDetailRow.value = null
    paginationSequence++
    lastRefreshQuery = ''
    gate.close()
    page.value = null
    loading.value = false
    error.value = ''
}
function expire() {
    invalidate()
    expired.value = true
}
function updateFilters(value: QueryBarValue) {
    filters.value = {
        date_range: [rangePart(value.date_range, 0), rangePart(value.date_range, 1)],
        ...Object.fromEntries(
            [...filterKeys, 'status'].map((key) => [
                key,
                typeof value[key] === 'string' ? value[key] : ''
            ])
        )
    }
}
let lastRefreshQuery = ''
let paginationSequence = 0
async function load(preserve = false) {
    paginationSequence++
    if (linkPending || linkBlocked) return
    if (!preserve) { lastRefreshQuery = ''; invalidate() }
    else error.value = ''
    validation.value = ''
    if (!allowed.value) return
    const read = gate.next(),
        view = props.view,
        number = pageNo.value,
        size = pageSize.value
    let query: string
    const selectedRange = [rangePart(filters.value.date_range, 0), rangePart(filters.value.date_range, 1)]
    const [from, to] = selectedRange.every(value => !value) ? initialRange() : selectedRange
    try {
        if (preserve && lastRefreshQuery) {
            const submitted = new URLSearchParams(lastRefreshQuery)
            submitted.set('page_no', String(number))
            submitted.set('page_size', String(size))
            query = submitted.toString()
        } else query = serializeQuery(
            view,
            {
                ...Object.fromEntries(
                    [...filterKeys, 'status'].map((key) => [key, filters.value[key]])
                ),
                created_from_ms: epoch(from),
                created_to_ms: epoch(to)
            },
            number,
            size
        )
    } catch {
        validation.value = text('invalidQuery')
        return
    }
    loading.value = true
    try {
        const result = await props.adapter.orders(query, read.signal)
        if (!read.current()) return
        const validated = validatePage(result, view, number, size)
        if (linkedOrder && !validated.lists.some(row => row.order_id === linkedOrder)) {
            session.retry()
            await openLink(linkedOrder)
            return
        }
        page.value = validated
        lastRefreshQuery = query
    } catch (e) {
        if (read.current()) {
            page.value = null
            const info = errorInfo(e)
            if (info.unauthorized) expire()
            else error.value = t(errorMessage(e))
        }
    } finally {
        if (read.current()) loading.value = false
    }
}
function query(value: QueryBarValue) {
    cancelLink()
    updateFilters(value)
    pageNo.value = 1
    void load()
}
function reset() {
    cancelLink()
    filters.value = defaults()
    pageNo.value = 1
    void load()
}
function paginate(number: number, size: number) {
    if (loading.value || !page.value || ![20, 50, 100].includes(size) || !Number.isSafeInteger(number) || number < 1 || number > 1000) return
    if (number === pageNo.value && size === pageSize.value) return
    pageSize.value = size
    pageNo.value = number
    const current = ++paginationSequence
    void nextTick(() => {
        if (current === paginationSequence) void load(!!lastRefreshQuery)
    })
}

let session = new LinkSession(route.query?._order_link_retry, route.query?._order_link_hops)
let linkedOrder = '', linkPending = false, linkBlocked = false
function cancelLink() {
    session.cancel(); linkedOrder = ''; linkPending = false; linkBlocked = false
    invalidate()
}
async function openLink(orderId: string) {
    invalidate()
    if (!allowed.value) return
    const read = session.begin()
    linkedOrder = orderId; linkPending = true; linkBlocked = false
    try {
        const target = await props.adapter.locate(orderId, read.signal)
        if (!read.current()) return
        const plan = locationPlan(target, 'grid', props.view, permitted)
        if (target.order_id !== orderId || target.segment !== 'grid') throw Error('订单定位响应无效')
        if (plan.redirect) {
            await router.replace({path: plan.redirect, query: {order_id: orderId, _order_link_retry: String(session.retryCount), _order_link_hops: String(session.redirect())}})
            return
        }
        filters.value = {date_range: [localTime(+plan.range[0]), localTime(+plan.range[1])], order_id: orderId}
        pageNo.value = 1; linkPending = false
        await load()
    } catch (e) {
        if (!read.current()) return
        linkPending = false; linkBlocked = true; loading.value = false
        error.value = t(errorMessage(e))
    }
}
function initializeLink() {
    cancelLink(); session = new LinkSession(route.query?._order_link_retry, route.query?._order_link_hops)
    if (!allowed.value) return
    try {
        const input = locationInput(route.query)
        if (!input) { void load(); return }
        const id = 'order_id' in input ? input.order_id : input.scope === 'grid' ? input.business_id : ''
        if (!id) throw Error('网格订单定位参数无效')
        void openLink(id)
    } catch (e) { linkBlocked = true; error.value = t(errorMessage(e)) }
}

watch(
    context,
    (_value, old) => {
        if (old && JSON.parse(old)[0] !== actor.value) expired.value = false
        pageNo.value = 1
        initializeLink()
    },
    { immediate: true, flush: 'sync' }
)
function refresh() { if (!loading.value) return load(!!lastRefreshQuery) }
onBeforeUnmount(() => { session.cancel(); invalidate() })
</script>
<style scoped>
.grid-orders {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--navbar-height) - 24px);
    height: calc(100dvh - var(--navbar-height) - 24px);
    min-height: 420px;
    min-width: 0;
    color: var(--el-text-color-primary);
}
.grid-orders > header,
.grid-orders > p {
    flex: none;
}
/* Reserve the footer before giving the remaining height to the table body. */
.grid-orders :deep(.mm-pro-table.is-fill-height) {
    flex: 1;
    height: auto;
    min-height: 0;
}
header {
    margin-bottom: 18px;
}
h2 {
    margin: 0 0 6px;
    font-size: 20px;
}
header p {
    margin: 0;
    color: var(--el-text-color-secondary);
    font-size: 13px;
}
.validation {
    padding: 12px 16px;
    border-radius: 6px;
    color: var(--el-color-danger);
    background: var(--el-color-danger-light-9);
}
.grid-orders :deep(.mm-pro-table__auto-refresh) {
    display: none;
}
.grid-orders :deep(.symbol-display) {
    color: var(--el-text-color-primary);
}
.grid-history-orders :deep(.mm-table th),
.grid-history-orders :deep(.mm-table td) {
    padding-inline: 8px;
}
.grid-history-time {
    display: inline-block;
    white-space: pre;
    line-height: 1.5;
    font-variant-numeric: tabular-nums;
}
</style>

<style src="../../table.css"></style>

<style scoped src="../../status-tone.css"></style>
