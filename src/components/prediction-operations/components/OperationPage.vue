<template>
    <section class="prediction-operation prediction-table-page prediction-compact-table mm-ui" :class="{ 'prediction-rounds-table': isRound, 'prediction-current-orders-table': isCompactCurrent, 'prediction-history-orders-table': isHistory }">
        <p v-if="!allowed" role="alert">{{ t('没有此页面的查询权限') }}</p>
        <template v-else>
            <mm-pro-table
                :aria-label="t(title)"
                :data="items"
                :columns="localizedColumns"
                :loading="loading"
                :error="error"
                :show-pagination="true"
                :current-page="page"
                :page-size="pageSize"
                :page-sizes="[20, 50, 100, 200]"
                :total="paginationTotal"
                :auto-refresh-seconds="0"
                :auto-refresh-options="[0]"
                :query-fields="localizedFields"
                :inline-query-field-keys="inlineKeys"
                :filters="queryFilters"
                filter-drawer
                :filter-drawer-title="t('筛选') + t(title)"
                :filter-drawer-subtitle="
                    t(isRound
                        ? '按开奖时间查询，含预计开奖；最多31天'
                        : props.view === 'history'
                          ? '结算时间仅含资金已完成记录；无结算时间可切换按下单时间查找，最多31天'
                          : '按下单时间查询，最多31天')
                "
                columns-configurable
                fill-height
                show-cell-title
                :row-key="isRound ? 'round_id' : 'order_id'"
                :empty-text="t(queried ? '暂无符合条件的记录' : '请选择条件查询')"
                @update:filters="updateFilters"
                @update:current-page="paginate($event, pageSize)"
                @update:page-size="paginate(1, $event)"
                @query="applyQuery"
                @reset="reset"
                @refresh="refresh"
                @retry="load"
            >
                <template #field-agent_id="{ value, update }">
                    <slot name="field-agent_id" :value="value" :update="update" />
                </template>
                <template #field-created_range="{ value, update }">
                    <MmDateRangePicker
                        size="sm"
                        :model-value="calendarSelection(pickerRange(value))"
                        :placeholder="t(dateLabel)"
                        @update:model-value="update(pickerValue(calendarRange($event)))"
                    />
                </template>
                <template #cell-symbol="{ row }"><SymbolDisplay :symbol="row.symbol" /></template>
                <template #cell-source_type="{ row }"><slot name="cell-source_type" :row="row"><SourceTypeTag :source-type="row.source_type ?? null" /></slot></template>
                <template v-for="key in twoLineTimeKeys" :key="key" #[`cell-${key}`]="{ row }">
                    <span class="prediction-table-time">{{ twoLineTimeText(row, key) }}</span>
                </template>
                <template #cell-status="{ row }">
                    <MmTag :type="roundStatusTagType(row.status)" effect="soft" size="sm" round>{{ t(tableFieldText(row, { key: 'status', label: 'status', kind: 'enum' }, props.game)) }}</MmTag>
                </template>
                <template #cell-direction="{ row }">
                    <span class="prediction-status prediction-direction" :class="`prediction-status--${predictionTone('direction', row.direction)}`">{{ t(tableFieldText(row, { key: 'direction', label: 'direction', kind: 'enum' }, props.game)) }}</span>
                </template>
                <template #cell-ownership_type="{ row }"><span v-if="['白标', '商户', '机器人'].includes(tableFieldText(row, { key: 'ownership_type', label: '' }, props.game))" class="prediction-status prediction-ownership" :class="row.user_type === '3' ? 'prediction-status--warning' : row.agent_id === '0' ? 'prediction-status--primary' : 'prediction-ownership--merchant'">{{ tableFieldText(row, { key: 'ownership_type', label: '' }, props.game) }}</span><span v-else>—</span></template>
                <template #cell-order_status="{ row }">
                    <span v-if="orderStatusSummary(row)" class="prediction-status prediction-order-status" :class="[`prediction-status--${orderStatusSummary(row)!.tone}`, {'prediction-fund-alert': orderStatusSummary(row)!.key === 'fund_status'}]" :title="orderStatusTitle(row)" :data-status-field="orderStatusSummary(row)!.key">{{ t(enumLabel(orderStatusSummary(row)!.value)) }}</span>
                    <span v-else>—</span>
                </template>
                <template #cell-realized_pnl="{ row }"><span class="prediction-pnl" :class="`prediction-pnl--${profitTone(row.realized_pnl)}`">{{ tableFieldText(row, { key: 'realized_pnl', label: '', kind: 'amount' }, props.game) }}</span></template>
                <template #cell-order_id="{ row }">
                    <span :title="tableFieldText(row, { key: 'order_id', label: '订单号' }, props.game)">{{ tableFieldText(row, { key: 'order_id', label: '订单号' }, props.game) }}</span>
                </template>
                <template #cell-round_id="{ row }">
                    <span class="prediction-round-number" :class="{ 'prediction-round-number--legacy': !row.round_no }" :title="row.round_no || row.round_id">{{ row.round_no || row.round_id }}</span>
                </template>
                <template v-if="isHistory" #cell-operation="{ row }">
                    <MmButton size="sm" icon-only :aria-label="t('查看详情')" :title="t('查看详情')" @click="openHistoryDetail(row)">
                        <MmIcon name="panel-left-close" :size="15" />
                    </MmButton>
                </template>
            </mm-pro-table>
            <HistoryOrderDetailDrawer
                v-if="isHistory"
                v-model="historyDetailVisible"
                :game="props.game"
                :row="historyDetailRow"
                @closed="clearHistoryDetail"
            />
        </template>
    </section>
</template>
<script setup lang="ts">
import { useSymbolOptions } from '../use-symbol-options'
import { calendarRange, calendarSelection } from '../calendar-range'
import { predictionColumnWidth } from '../column-width'
import { predictionTone, orderStatusSummary, orderStatusTitle, profitTone } from '../status-tone'
import { computed, nextTick, onBeforeUnmount, watch, reactive, ref } from 'vue'
import {
    MmProTable,
    MmDateRangePicker,
    MmTag,
    MmButton,
    MmIcon,
    type TagType,
    type ProTableColumn,
    type QueryBarField,
    type QueryBarValue,
    type QueryBarFieldValue
} from '../ui'
import type { OrderRow, RoundRow, PredictionPageContext, PredictionPageAdapter } from '../types'
import { providePresentation } from '../context'
import { usePredictionLocale } from '../locale'
import { locationInput, locationPlan, LinkSession, type LocationInput } from '../order-location'
import { FIXED_DURATIONS, FIXED_HIGH_LOW_DURATIONS } from '../durations'
import {
    buildQuery,
    dateRangeQuery,
    defaultQueryRange,
    hasPermission,
    orderChoices,
    roundChoices
} from '../query'
import { enumLabel, errorMessage, roomLabel, unsigned } from '../format'
import { operationTableFields, tableFieldText } from '../fields'
import { formatUserName } from '../format-user-name'
import SymbolDisplay from '../SymbolDisplay.vue'
import SourceTypeTag from '../SourceTypeTag.vue'
import HistoryOrderDetailDrawer from './HistoryOrderDetailDrawer.vue'
const t = usePredictionLocale(() => props.locale)
const props = defineProps<{
    adapter: PredictionPageAdapter
    context: PredictionPageContext
    showSources?: boolean
    columns?: (defaults: ProTableColumn[]) => ProTableColumn[]
    locale?: string
    game: 'UP_DOWN' | 'HIGH_LOW'
    view: 'rounds' | 'current' | 'history'
}>()
providePresentation(() => ({ symbolComponent: props.adapter.symbolComponent, showSources: props.showSources !== false, locale: props.locale }))
const user = { get perms() { return props.context.permissions }, get userInfo() { return { id: props.context.actorId } } },
    isRound = computed(() => props.view === 'rounds')
const isCompactCurrent = computed(() => props.game === 'UP_DOWN' && props.view === 'current')
const isCompactHistory = computed(() => props.game === 'UP_DOWN' && props.view === 'history')
const isHighLowHistory = computed(() => props.game === 'HIGH_LOW' && props.view === 'history')
const isHistory = computed(() => props.view === 'history')
const historyDetailVisible = ref(false)
const historyDetailRow = ref<OrderRow | null>(null)
function openHistoryDetail(row: OrderRow) {
    if (!isHistory.value || !allowed.value) return
    historyDetailRow.value = row
    historyDetailVisible.value = true
}
function clearHistoryDetail() {
    if (!historyDetailVisible.value) historyDetailRow.value = null
}
const roundStatusTagType = (value: unknown): TagType => {
    const tone = predictionTone('round', value)
    return tone === 'neutral' ? 'default' : tone
}
const twoLineTimeKeys = computed(() => props.game === 'UP_DOWN' && isRound.value
    ? ['bet_open_at_ms', 'bet_close_at_ms', 'draw_at_ms', 'settled_at_ms']
    : isHighLowHistory.value ? ['expire_at_ms', 'funds_completed_at_ms']
    : isCompactHistory.value ? ['funds_completed_at_ms'] : [])
const dateTimeFormatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
})
const twoLineTimeText = (row: Record<string, unknown>, key: string): string => {
    const value = row[key]
    if (!unsigned(value, 8640000000000000n)) {
        return tableFieldText(row, { key, label: '', kind: 'time' }, props.game)
    }
    const parts = Object.fromEntries(dateTimeFormatter.formatToParts(new Date(Number(value)))
        .map(({ type, value: part }) => [type, part]))
    return `${parts.year}/${parts.month}/${parts.day}\n${parts.hour}:${parts.minute}:${parts.second}`
}
const title = computed(
    () =>
        `${props.game === 'UP_DOWN' ? '涨跌预测' : '自选预测'} · ${isRound.value ? '场次列表' : props.view === 'current' ? '当前订单' : '历史订单'}`
)
const permission = computed(
        () =>
            `prediction_operation:${isRound.value ? 'rounds' : props.view === 'current' ? 'current_orders' : 'history_orders'}`
    ),
    allowed = computed(() => !!props.context.actorId && hasPermission(user.perms, permission.value))
const initialRange = () => defaultQueryRange(props.view)
const defaultTimeField = () =>
    isRound.value ? 'DRAW_AT' : props.view === 'history' ? 'FUNDS_COMPLETED_AT' : 'CREATED_AT'
const range = ref<[Date, Date] | undefined>(props.view === 'current' ? undefined : initialRange()),
    filters = reactive<Record<string, string>>({
        agent_id: '',
        ...(!isRound.value ? { order_source: 'PLAYER' } : {}),
        time_field: defaultTimeField(),
        sort_field: isRound.value ? 'BET_OPEN_AT' : 'CREATED_AT',
        sort_direction: 'DESC'
    })
const timeField = computed(() => filters.time_field || defaultTimeField())
const dateLabel = computed(() =>
    timeField.value === 'DRAW_AT'
        ? '开奖时间'
        : timeField.value === 'FUNDS_COMPLETED_AT'
          ? '结算时间'
          : '下单时间'
)
const textFilters = computed(() => [
    ...(isRound.value ? [] : [{ key: 'order_id', label: '订单号' }]),
    ...(props.game === 'UP_DOWN' ? [{ key: 'round_id', label: '场次编号' }] : []),
    ...(isRound.value
        ? []
        : [
              { key: 'public_user_id', label: 'UID（精确）' },
              { key: 'user_name', label: '用户账号' }
          ]),
    { key: 'symbol', label: '交易品种' }
])
const enumFilters = computed(() =>
    isRound.value
        ? [
              { key: 'status', label: '状态', values: roundChoices.status },
              { key: 'result', label: '结果', values: roundChoices.result }
          ]
        : [
              { key: 'direction', label: '方向', values: orderChoices.direction },
              { key: 'order_source', label: '订单来源', values: orderChoices.order_source },
              { key: 'business_status', label: '业务状态', values: orderChoices.business_status },
              { key: 'fund_status', label: '资金状态', values: orderChoices.fund_status },
              { key: 'result', label: '结果', values: orderChoices.result }
          ]
)
const sortOptions = computed(() =>
    isRound.value
        ? [
              { value: 'BET_OPEN_AT', label: '开放下注时间' },
              { value: 'BET_CLOSE_AT', label: '停止下注时间' },
              { value: 'TOTAL_STAKE', label: '总本金' },
              { value: 'AGENT_REVENUE', label: '代理收益' }
          ]
        : [
              { value: 'CREATED_AT', label: '创建时间' },
              { value: 'SETTLED_AT', label: '结果确定时间' },
              { value: 'STAKE', label: '本金' },
              { value: 'FINAL_RETURN', label: '最终返还' }
          ]
)
const items = ref<(OrderRow | RoundRow)[]>([]),
    loading = ref(false),
    error = ref(''),
    queried = ref(false),
    page = ref(1),
    pageSize = ref(20),
    total = ref('0'),
    totalPages = ref('0')
const paginationTotal = computed(() => {
    if (!queried.value) return 0
    const count = BigInt(total.value)
    const limit = 2147483647n * BigInt(pageSize.value)
    return Number(count > limit ? limit : count)
})
const columns = computed<ProTableColumn[]>(() => [
    ...operationTableFields(props.game, props.view).filter(field => props.showSources !== false || !['source_name', 'source_type'].includes(field.key)).map((field) => ({
        key: field.key,
        dataIndex: field.key,
        title: field.key === 'user_name' ? '用户名' : field.label,
        width: predictionColumnWidth(field.key, isHighLowHistory.value ? 'high-low-history' : isCompactHistory.value ? 'up-down-history' : isCompactCurrent.value ? 'up-down-current' : props.game === 'UP_DOWN' && isRound.value ? 'rounds' : undefined),
        align: 'left' as const,
        formatter: (_: unknown, row: Record<string, unknown>) =>
            field.key === 'user_name'
                ? formatUserName(typeof row.nick_name === 'string' ? row.nick_name : undefined, typeof row.user_name === 'string' ? row.user_name : undefined)
                : tableFieldText(row, field, props.game)
    })),
    ...(isHistory.value ? [{ key: 'operation', title: '操作', width: 64, align: 'center' as const, fixed: 'right' as const }] : [])
])
const localizedColumns = computed(() => (props.columns ? props.columns(columns.value.map(column => ({ ...column }))) : columns.value).map(column => ({
    ...column, title: t(String(column.title)),
    formatter: column.formatter ? (value: unknown, row: Record<string, unknown>, index: number) => {
        const result = column.formatter!(value, row, index)
        return ['user_name', 'source_name', 'symbol', 'order_id', 'round_id', 'public_user_id'].includes(String(column.key)) ? result : t(String(result))
    } : undefined
})))
const inlineKeys = computed(() => isRound.value
    ? ['created_range', 'status', 'round_id', 'symbol', 'duration_seconds']
    : ['user_keyword', 'created_range', 'order_id', ...(props.game === 'UP_DOWN' ? ['round_id'] : [])])
const symbolOptions = useSymbolOptions(allowed, props.adapter.symbols, () => props.context.identityKey)
const queryFields = computed<QueryBarField[]>(() => {
    const fields: QueryBarField[] = [
        ...(!isRound.value ? [{ key: 'user_keyword', label: '用户搜索', type: 'keyword' as const, placeholder: '用户 UID/用户名/昵称', width: 230, maxlength: 128, clearable: true }] : []),
        ...textFilters.value.map((field) => field.key === 'symbol' ? {
            ...field, type: 'coin' as const, clearable: true, width: 150, options: symbolOptions.value
        } : ({
            ...field,
            type: 'keyword' as const,
            clearable: true,
            maxlength: field.key === 'public_user_id' ? 64 : 128,
            placeholder: field.label,
            width: field.key === 'round_id' ? 180 : field.key === 'public_user_id' ? 130 : 150
        })),
        ...enumFilters.value.map((field) => ({
            key: field.key,
            label: field.label,
            type: 'select' as const,
            clearable: true,
            placeholder: `${field.label}：全部`,
            width: 120,
            options: field.values.map((value) => ({ value, label: enumLabel(value) }))
        })),
        props.game === 'UP_DOWN'
            ? {
                  key: 'duration_seconds',
                  label: '周期',
                  type: 'select',
                  clearable: true,
                  placeholder: '周期：全部',
                  width: 110,
                  options: FIXED_DURATIONS.map((value) => ({ value, label: roomLabel(value) }))
              }
            : {
                  key: 'duration_seconds',
                  label: '周期',
                  type: 'select',
                  clearable: true,
                  placeholder: '周期：全部',
                  width: 110,
                  options: FIXED_HIGH_LOW_DURATIONS.map(value => ({ value, label: roomLabel(value, 'HIGH_LOW') }))
              },
        ...(!isRound.value && props.showSources !== false
            ? [{ key: 'agent_id', label: '归属名称', type: 'keyword' as const }]
            : []),
        ...(props.view === 'history'
            ? [
                  {
                      key: 'time_field',
                      label: '查找方式',
                      type: 'select' as const,
                      options: [
                          { value: 'FUNDS_COMPLETED_AT', label: '按结算时间' },
                          { value: 'CREATED_AT', label: '按下单时间查找' }
                      ]
                  }
              ]
            : []),
        { key: 'created_range', label: `${dateLabel.value}（最多31天）`, type: 'date-range', width: 240 },
        {
            key: 'sort_field',
            label: '排序',
            type: 'select',
            options: sortOptions.value,
            defaultValue: isRound.value ? 'BET_OPEN_AT' : 'CREATED_AT'
        },
        {
            key: 'sort_direction',
            label: '顺序',
            type: 'select',
            options: [
                { value: 'DESC', label: '降序' },
                { value: 'ASC', label: '升序' }
            ],
            defaultValue: 'DESC'
        }
    ]
    const primary = isRound.value
        ? ['created_range', 'status', 'round_id', 'symbol', 'duration_seconds']
        : [
              'user_keyword',
              'created_range',
              'order_id',
              ...(props.game === 'UP_DOWN' ? ['round_id'] : []),
              'public_user_id',
              'user_name',
              'agent_id',
              'order_source',
              'business_status',
              'symbol',
              ...(props.game === 'HIGH_LOW' ? ['direction'] : []),
              'duration_seconds',
              ...(props.view === 'history' ? ['time_field'] : [])
          ]
    return [
        ...primary.flatMap((key) => fields.filter((field) => field.key === key)),
        ...fields.filter((field) => !primary.includes(field.key))
    ]
})
const localizedFields = computed<QueryBarField[]>(() => queryFields.value.map(field => {
    const result = { ...field, label: t(field.label), placeholder: field.placeholder ? t(field.placeholder) : undefined }
    if (result.type === 'select') result.options = result.options.map(option => ({ ...option, label: t(option.label) }))
    if (result.type === 'segmented') result.options = result.options.map(option => typeof option === 'object' ? { ...option, label: t(option.label) } : option)
    return result
}))
const pickerValue = (value: unknown): [string, string] | null =>
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((date) => date instanceof Date && Number.isFinite(date.getTime()))
        ? [value[0].getTime().toString(), value[1].getTime().toString()]
        : null
const pickerRange = (value: QueryBarFieldValue): [Date, Date] | undefined => {
    if (value == null || (Array.isArray(value) && value.length === 2 && value.every(item => item === ''))) return undefined
    if (
        !Array.isArray(value) ||
        value.length !== 2 ||
        !value.every((item) => typeof item === 'string' && /^\d+$/.test(item))
    )
        return [new Date(NaN), new Date(NaN)]
    const dates = value.map((item) => new Date(Number(item)))
    return dates.every((date) => Number.isFinite(date.getTime())) ? [dates[0], dates[1]] : [new Date(NaN), new Date(NaN)]
}
const queryFilters = computed<QueryBarValue>(() => ({
    ...filters,
    created_range: pickerValue(range.value)
}))
function updateFilters(value: QueryBarValue) {
    for (const field of queryFields.value) {
        if (field.key !== 'created_range')
            filters[field.key] =
                typeof value[field.key] === 'string' ? (value[field.key] as string) : ''
    }
    if ('created_range' in value) range.value = pickerRange(value.created_range)
}
function applyQuery(value: QueryBarValue) {
    updateFilters(value)
    query()
}
let seq = 0,
    controller: AbortController | undefined,
    lastQuery: Record<string, string | number> | undefined
async function load() {
    if (linkPending || linkBlocked) return
    if (!allowed.value) return
    controller?.abort()
    controller = new AbortController()
    const current = ++seq
    error.value = ''
    try {
        const params = lastQuery
            ? { ...lastQuery, page_number: page.value, page_size: pageSize.value }
            : buildQuery(
                  props.game,
                  isRound.value,
                  { ...filters, ...dateRangeQuery(range.value ?? initialRange(), timeField.value) },
                  page.value,
                  pageSize.value
              )
        loading.value = true
        const response = isRound.value
            ? await props.adapter.rounds(params, controller.signal)
            : await props.adapter.orders(
                  props.view === 'current' ? 'current' : 'history',
                  params,
                  controller.signal
              )
        if (current !== seq) return
        if (
            response.page_number !== page.value || response.page_size !== pageSize.value ||
            !Array.isArray(response.items) || response.items.length > pageSize.value ||
            response.items.some(row => !row || typeof row !== 'object' || typeof row[isRound.value ? 'round_id' : 'order_id'] !== 'string' || (!isRound.value && row.game_type !== 'GAME_TYPE_' + props.game)) ||
            !unsigned(response.total_count) ||
            !unsigned(response.total_pages)
        )
            throw Error('分页响应格式异常')
        if (linkedOrder && !response.items.some(row => row.order_id === linkedOrder)) {
            session.retry()
            await openLink({order_id: linkedOrder})
            return
        }
        items.value = response.items
        total.value = response.total_count
        totalPages.value = response.total_pages
        queried.value = true
        lastQuery = params
    } catch (e) {
        if (current === seq) {
            error.value = t(errorMessage(e))
            items.value = []
            total.value = '0'
            totalPages.value = '0'
            queried.value = false
        }
    } finally {
        if (current === seq) loading.value = false
    }
}
function query() {
    if (linkPending || linkBlocked || linkedOrder) cancelLink()
    page.value = 1
    lastQuery = undefined
    void load()
}
function reset() {
    cancelLink()
    for (const key of Object.keys(filters)) delete filters[key]
    Object.assign(filters, {
        agent_id: '',
        ...(!isRound.value ? { order_source: 'PLAYER' } : {}),
        time_field: defaultTimeField(),
        sort_field: isRound.value ? 'BET_OPEN_AT' : 'CREATED_AT',
        sort_direction: 'DESC'
    })
    range.value = props.view === 'current' ? undefined : initialRange()
    query()
}
function paginate(number: number, size: number) {
    if (loading.value || !queried.value) return
    if (!Number.isSafeInteger(number) || number < 1 || number > 2147483647) return
    if (![20, 50, 100, 200].includes(size)) return
    if (number === page.value && size === pageSize.value) return
    page.value = number
    pageSize.value = size
    const current = seq
    // 查询和重置也会触发页码更新，合并同一轮事件以避免重复请求。
    void nextTick(() => {
        if (current === seq) void load()
    })
}
const route = { get query() { return props.context.route.query }, get fullPath() { return props.context.route.fullPath } }
const router = { replace: (target: {path: string; query: Record<string, string>}) => props.adapter.navigate(target) }
let session = new LinkSession(route.query?._order_link_retry, route.query?._order_link_hops)
let linkedOrder = '', linkPending = false, linkBlocked = false
function cancelLink() {
    historyDetailVisible.value = false
    historyDetailRow.value = null
    session.cancel(); linkedOrder = ''; linkPending = false; linkBlocked = false
    seq++; controller?.abort(); loading.value = false
    lastQuery = undefined; items.value = []; error.value = ''; total.value = '0'; totalPages.value = '0'; queried.value = false
}
async function openLink(input: LocationInput) {
    seq++; controller?.abort(); items.value = []; lastQuery = undefined
    if (!allowed.value) return
    const read = session.begin()
    linkPending = true; linkBlocked = false
    try {
        const target = await props.adapter.locate(input, props.view === 'current' ? 'current' : 'history', read.signal)
        if (!read.current()) return
        if ('order_id' in input && target.order_id !== input.order_id) throw Error('订单定位响应无效')
        const plan = locationPlan(target, props.game === 'HIGH_LOW' ? 'high-low' : 'up-down', props.view === 'current' ? 'current' : 'history', key => hasPermission(user.perms, key))
        if (plan.redirect) {
            await router.replace({path: plan.redirect, query: {order_id: target.order_id, _order_link_retry: String(session.retryCount), _order_link_hops: String(session.redirect())}})
            return
        }
        for (const key of Object.keys(filters)) delete filters[key]
        filters.order_id = target.order_id; filters.time_field = 'CREATED_AT'
        linkedOrder = target.order_id; range.value = plan.range; page.value = 1
        linkPending = false
        await load()
    } catch (e) {
        if (!read.current()) return
        linkPending = false; linkBlocked = true; loading.value = false
        error.value = t(errorMessage(e))
    }
}
function initializeLink() {
    cancelLink(); session = new LinkSession(route.query?._order_link_retry, route.query?._order_link_hops)
    page.value = 1
    if (!allowed.value) return
    try {
        const input = isRound.value ? null : locationInput(route.query)
        if (input) void openLink(input)
        else void load()
    } catch (e) { linkBlocked = true; error.value = t(errorMessage(e)) }
}
function refresh() { if (!loading.value) return load() }
watch(() => [route.fullPath, props.game, props.view, user.userInfo.id, user.perms, props.context.identityKey], initializeLink, {immediate: true, deep: true})
onBeforeUnmount(() => { session.cancel(); seq++; controller?.abort() })
</script>
<style scoped>
.prediction-operation {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--navbar-height) - 24px);
    height: calc(100dvh - var(--navbar-height) - 24px);
    min-height: 420px;
    min-width: 0;
    overflow: hidden;
}
.prediction-operation :deep(.mm-pro-table) {
    flex: 1;
    min-height: 0;
}
.prediction-operation :deep(.mm-table__cell) {
    font-variant-numeric: tabular-nums;
}
.prediction-rounds-table :deep(.mm-table th),
.prediction-rounds-table :deep(.mm-table td) {
    padding-inline: 6px;
}
.prediction-current-orders-table :deep(.mm-table th),
.prediction-current-orders-table :deep(.mm-table td) {
    padding: 8px 6px;
}
.prediction-history-orders-table :deep(.mm-table th),
.prediction-history-orders-table :deep(.mm-table td) {
    padding-inline: 8px;
}
.prediction-round-number {
    white-space: nowrap;
    user-select: text;
    font-variant-numeric: tabular-nums;
}
.prediction-table-time {
    display: inline-block;
    white-space: pre;
    line-height: 1.5;
    font-variant-numeric: tabular-nums;
}
.prediction-round-number--legacy {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
}
.prediction-operation :deep(.el-date-editor) {
    width: 100%;
    min-width: 0;
}
/* Match the page theme without changing the shared symbol component. */
.prediction-operation :deep(.symbol-display__name) { color: var(--el-text-color-primary); }
.prediction-operation :deep(.symbol-display__placeholder) { color: var(--el-text-color-secondary); background: var(--el-fill-color-light); border-color: var(--el-border-color); }
</style>

<style src="../table.css"></style>

<style scoped src="../status-tone.css"></style>
