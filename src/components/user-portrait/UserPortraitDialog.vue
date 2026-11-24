<template>
    <mm-dialog
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        :title="tr('用户画像')"
        width="80vw"
        panel-class="user-profile-dialog"
        :close-on-click-modal="false"

    >
        <p v-if="!portrait" class="profile-status" role="status">{{ error || tr('加载中…') }}</p>
        <div v-else class="user-profile">
            <section class="profile-identity-card" aria-label="用户基础资料">
                <mm-avatar
                    class="profile-avatar"
                    :alt="displayName || tr('用户')"
                    :fallback="profileInitial"
                    shape="circle"
                    :size="56"
                />

                <div class="profile-identity-main">
                    <div class="profile-name-row">
                        <strong>{{ displayName || '-' }}</strong>
                        <mm-tag
                            v-if="riskLabel && riskLabel !== '-'"
                            :type="riskLabelTagType"
                            effect="soft"
                            round
                            size="sm"
                        >
                            {{ tr('风险标签') }}：{{ riskLabel }}
                        </mm-tag>
                        <mm-tag :type="riskStatusTagType" effect="soft" round size="sm">
                            {{ tr('风控状态') }}：{{ riskStatus }}
                        </mm-tag>
                    </div>

                    <div class="profile-meta-row">
                        <span>UID&nbsp; {{ detail.public_user_id || '-' }}</span>
                        <span>ID&nbsp; {{ detail.user_id || '-' }}</span>
                        <span>{{ tr('推荐关系') }}&nbsp; {{ detail.agent_name_parse || tr(directUserLabel) }}</span>
                        <span>VIP&nbsp; V{{ detail.vip_level ?? 0 }}</span>
                        <span>{{ tr('注册') }}&nbsp; {{ detail.created_at || '-' }}</span>
                        <span>{{ tr('最近登录') }}&nbsp; {{ detail.last_login_at || '-' }}</span>
                    </div>
                </div>

                <slot name="actions" :portrait="portrait" />
            </section>

            <section class="profile-metric-grid" aria-label="用户资产与交易指标">
                <article v-for="item in assetList" :key="item.label" class="profile-metric-card">
                    <span>{{ tr(item.label) }}</span>
                    <strong>
                        {{ formatMoney(item.value) }}
                    </strong>
                    <small v-if="item.hint">
                        {{ item.hint }}
                    </small>
                </article>
            </section>

            <mm-menu
                v-model="activeTab"
                class="profile-menu"
                mode="horizontal"
                aria-label="用户画像功能"
            >
                <mm-menu-item
                    v-for="item in profileMenuItems.filter(item => item.value === 'basic' || tables[item.value])"
                    :key="item.value"
                    :value="item.value"
                >
                    {{ tr(item.label) }}
                </mm-menu-item>
            </mm-menu>

            <section v-if="activeTab === 'basic'" class="profile-menu-panel" aria-label="概览">
                <section class="profile-overview">
                    <div class="overview-section-head">
                        <div>
                            <strong>{{ tr('账户概览') }}</strong>
                            <span>{{ tr('U 本位账户实时数据') }}</span>
                        </div>
                    </div>

                    <mm-info-grid :columns="5" size="sm">
                        <div>
                            <dt>{{ tr('钱包余额(U)') }}</dt>
                            <dd>{{ formatMoney(portrait.account?.wallet_balance) }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('可用余额(U)') }}</dt>
                            <dd>{{ formatMoney(portrait.account?.available_balance) }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('未实现盈亏(U)') }}</dt>
                            <dd :class="numberTone(positionUnrealizedPnl)">
                                {{ formatSignedMoney(positionUnrealizedPnl) }}
                            </dd>
                        </div>
                        <div>
                            <dt>{{ tr('保证金占用(U)') }}</dt>
                            <dd>{{ formatMoney(positionMargin) }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('当前委托量(U)') }}</dt>
                            <dd>{{ formatMoney(openOrderValue) }}</dd>
                        </div>
                    </mm-info-grid>

                    <div class="overview-section-head is-profile">
                        <div>
                            <strong>{{ tr('用户信息') }}</strong>
                            <span>{{ tr('当前系统可用的身份、登录与风控资料') }}</span>
                        </div>
                    </div>

                    <mm-info-grid :columns="4" size="sm">
                        <div>
                            <dt>ID</dt>
                            <dd>{{ detail.user_id || '-' }}</dd>
                        </div>
                        <div>
                            <dt>UID</dt>
                            <dd>{{ detail.public_user_id || '-' }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('用户名') }}</dt>
                            <dd>{{ displayName || '-' }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('推荐关系') }}</dt>
                            <dd>{{ detail.agent_name_parse || tr(directUserLabel) }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('VIP 等级') }}</dt>
                            <dd>V{{ detail.vip_level ?? 0 }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('风控状态') }}</dt>
                            <dd>{{ riskStatus }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('风险标签') }}</dt>
                            <dd>{{ riskLabel || '-' }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('在线状态') }}</dt>
                            <dd>{{ onlineStatusLabel }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('登录 IP') }}</dt>
                            <dd>{{ detail.last_login_ip || '-' }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('注册时间') }}</dt>
                            <dd>{{ detail.created_at || '-' }}</dd>
                        </div>
                        <div>
                            <dt>{{ tr('最近登录') }}</dt>
                            <dd>{{ detail.last_login_at || '-' }}</dd>
                        </div>
                        <slot name="password" />
                    </mm-info-grid>
                </section>
            </section>

            <section
                v-else-if="activeTab === 'position'"
                class="profile-menu-panel profile-pane-fill"
                aria-label="当前仓位"
            >
                <div class="profile-table-pane is-position">
                    <mm-position-table
                        v-if="activeTab === 'position'"
                        :key="profileTableKey('position')"
                        class="profile-position-table"
                        aria-label="用户当前仓位"
                        :columns="omitIdentity"
                        fill-height
                         :filter-drawer-subtitle="tr('支持交易对、仓位模式、方向、杠杆和开仓时间组合筛选')"
                         :filter-drawer-title="tr('筛选当前仓位')"
                        :initial-keyword="uid" :show-user-type="false"
                        :initial-page-size="20"
                        :market-prices="marketPrices"
                        :page-sizes="[20, 30, 40]"
                        :request="requests.position"
                    />
                </div>
            </section>

            <section
                v-else-if="activeTab === 'order'"
                class="profile-menu-panel profile-pane-fill"
                aria-label="当前委托"
            >
                <div class="profile-table-pane">
                    <mm-current-order-table
                        :key="profileTableKey('order')"
                        class="profile-shared-table"
                        aria-label="用户当前委托"
                        :columns="omitIdentity"
                        fill-height
                        :initial-page-size="20"
                        :page-sizes="[20, 30, 40]"
                        :query-fields="omitIdentityFilters"
                        :request="requests.order"
                    >
                        <template #cell-symbol="{ row }">
                            <slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot>
                        </template>
                    </mm-current-order-table>
                </div>
            </section>

            <section
                v-else-if="activeTab === 'conditionOrder'"
                class="profile-menu-panel profile-pane-fill"
                aria-label="条件委托"
            >
                <div class="profile-table-pane">
                    <mm-condition-order-table
                        :key="profileTableKey('conditionOrder')"
                        class="profile-shared-table"
                        aria-label="用户条件委托"
                        :columns="omitIdentity"
                        fill-height
                        :initial-page-size="20"
                        lifecycle="current"
                        :page-sizes="[20, 30, 40]"
                        :query-fields="omitIdentityFilters"
                        :request="requests.conditionOrder"
                    >
                        <template #cell-symbol="{ row }">
                            <slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot>
                        </template>
                    </mm-condition-order-table>
                </div>
            </section>

            <section
                v-else-if="activeTab === 'historyDeal'"
                class="profile-menu-panel profile-pane-fill"
                aria-label="历史成交"
            >
                <div class="profile-table-pane">
                    <mm-trade-fill-table
                        :key="profileTableKey('historyDeal')"
                        class="profile-shared-table"
                        aria-label="用户历史成交"
                        :columns="omitIdentity"
                        fill-height
                        :initial-keyword="uid" :show-user-type="false"
                        :initial-page-size="20"
                        :page-sizes="[20, 30, 40]"
                        :request="requests.historyDeal"
                    >
                        <template #cell-symbol="{ row }">
                            <slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot>
                        </template>
                    </mm-trade-fill-table>
                </div>
            </section>

            <section
                v-else-if="activeTab === 'historyPosition'"
                class="profile-menu-panel profile-pane-fill"
                aria-label="历史仓位"
            >
                <div class="profile-table-pane">
                    <mm-history-position-table
                        :key="profileTableKey('historyPosition')"
                        class="profile-shared-table"
                        aria-label="用户历史仓位"
                        :columns="omitIdentity"
                        fill-height
                        :initial-keyword="uid" :show-user-type="false"
                        :initial-page-size="20"
                        :page-sizes="[20, 30, 40]"
                        :request="requests.historyPosition"
                    >
                        <template #cell-symbol="{ row }">
                            <slot name="symbol" :symbol="row.symbol">{{ row.symbol }}</slot>
                        </template>
                    </mm-history-position-table>
                </div>
            </section>

            <section
                v-else-if="activeTab === 'fundFlow'"
                class="profile-menu-panel profile-pane-fill"
                aria-label="资金流水"
            >
                <div class="profile-table-pane">
                    <mm-account-change-log-table
                        :key="profileTableKey('fundFlow')"
                        class="profile-shared-table"
                        aria-label="用户资金流水"
                        :columns="omitIdentity"
                        fill-height
                        :initial-page-size="20"
                        mode="all"
                        :page-sizes="[20, 30, 40]"
                        :query-fields="omitIdentityFilters"
                        :request="requests.fundFlow"
                    >
                        <template #cell-change_type="{ row, label }">
                            <mm-tag effect="soft" round size="sm" type="default">
                                {{ getAccountChangeTypeLabel(row, label) }}
                            </mm-tag>
                        </template>

                        <template #cell-symbol="{ row }">
                            <slot name="symbol" :symbol="row.symbol">{{ row.symbol || '-' }}</slot>
                        </template>
                    </mm-account-change-log-table>
                </div>
            </section>
        </div>
    </mm-dialog>

</template>
<script setup lang="ts">
import {computed, ref, shallowRef, watch} from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmDialog } from '../dialog'
import { MmAvatar } from '../avatar'
import { MmTag } from '../tag'
import { MmInfoGrid } from '../info-grid'
import { MmMenu, MmMenuItem } from '../menu'
import { MmPositionTable } from '../position-table'
import { MmCurrentOrderTable } from '../current-order-table'
import { MmConditionOrderTable } from '../condition-order-table'
import { MmHistoryPositionTable } from '../history-position-table'
import { MmTradeFillTable } from '../trade-fill-table'
import { MmAccountChangeLogTable, resolveAccountChangeType, type AccountChangeLogRow } from '../account-change-log-table'
import type { PortraitTab, PortraitTables, UserPortrait } from './types'
import { english } from './copy'

const props = withDefaults(defineProps<{
    modelValue: boolean
    subject: number | string | null
    requestKey?: number
    initialTab?: PortraitTab
    request: (subject: number | string, signal: AbortSignal) => Promise<UserPortrait>
    tables: Partial<PortraitTables>
    marketPrices: Record<string, number>
    directUserLabel?: '平台用户' | '白标直属用户'
}>(), { initialTab: 'basic', directUserLabel: '平台用户' })
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    loaded: [snapshot: UserPortrait]
}>()
const { locale } = useLocale()
const tr = (label: string) => locale.value === 'en-US' ? english[label] ?? label : label
const portrait = shallowRef<UserPortrait | null>(null)
const error = ref('')
const activeTab = ref<PortraitTab>('basic')
watch(() => [props.modelValue, props.subject, props.requestKey] as const, async ([open, subject], _, cleanup) => {
    const controller = new AbortController()
    cleanup(() => controller.abort())
    portrait.value = null
    error.value = ''
    activeTab.value = props.initialTab
    if (!open || !subject) return
    try {
        const result = await props.request(subject, controller.signal)
        if (controller.signal.aborted) return
        portrait.value = result
        emit('loaded', result)
    } catch {
        if (!controller.signal.aborted) error.value = tr('无法加载用户画像')
    }
}, { immediate: true })
const detail = computed(() => portrait.value!.detail)
const displayName = computed(() => detail.value.nick_name || detail.value.username || '')
const profileInitial = computed(() => Array.from(displayName.value.trim())[0]?.toUpperCase() || (locale.value === 'en-US' ? 'U' : '用'))
const riskStatus = computed(() => tr(['正常','冻结','封禁','限制提现','限制交易'][detail.value.risk_status ?? -1] ?? '状态未知'))
const riskLabel = computed(() => tr(['正常','高风险账户','套利账户','可疑IP'][detail.value.risk_label ?? -1] ?? '-'))
const riskStatusTagType = computed(() => Number(detail.value.risk_status) === 0 ? 'success' : 'danger')
const riskLabelTagType = computed(() => Number(detail.value.risk_label) === 0 ? 'success' : 'warning')
const onlineStatusLabel = computed(() => tr(Number(detail.value.online_status) === 1 ? '在线' : '离线'))
// An ordinary list keyword can also match a nickname, order or position ID.
const uid = computed(() => 'uid:' + detail.value.public_user_id)
const profileTableKey = (tab: PortraitTab) => tab + ':' + uid.value
const profileMenuItems: {label: string; value: PortraitTab}[] = [
    {label:'概览',value:'basic'}, {label:'当前仓位',value:'position'}, {label:'当前委托',value:'order'},
    {label:'条件委托',value:'conditionOrder'}, {label:'历史成交',value:'historyDeal'},
    {label:'历史仓位',value:'historyPosition'}, {label:'资金流水',value:'fundFlow'},
]
const omitIdentity = <T extends {key: unknown}>(columns: T[]) => columns.filter(c =>
    !['platform_user_id','user_id','username','recommendation','user_type','operation'].includes(String(c.key)))
const omitIdentityFilters = <T extends {key: unknown}>(fields: T[]) => fields.filter(f => !['keyword','user_type'].includes(String(f.key)))
const getAccountChangeTypeLabel = (row: AccountChangeLogRow, label: unknown) =>
    resolveAccountChangeType(row.change_type, row.amount, 'all') === 'adjust_isolated_margin'
        ? tr('调整逐仓保证金') : String(label || row.change_type || '-')
const requests: PortraitTables = {
    position: (q,c) => props.tables.position!({...q, keyword: uid.value}, c),
    order: (q,c) => props.tables.order!({...q, keyword: uid.value}, c),
    conditionOrder: (q,c) => props.tables.conditionOrder!({...q, keyword: uid.value, kind:'condition', lifecycle:'current'}, c),
    historyDeal: (q,c) => props.tables.historyDeal!({...q, keyword: uid.value}, c),
    historyPosition: (q,c) => props.tables.historyPosition!({...q, keyword: uid.value}, c),
    fundFlow: (q,c) => props.tables.fundFlow!({...q, keyword: uid.value}, c),
}
const currentPositions = computed(() => portrait.value?.positions)
const currentOpenOrders = computed(() => portrait.value?.orders)
const sum = <T>(rows: T[] | null | undefined, get: (r:T) => number) => rows?.reduce((total,row) => total + get(row),0) ?? null
const calcPositionValue = (rows: UserPortrait['positions'] | undefined) => sum(rows, p => Number(p.quantity) * Number(props.marketPrices[p.symbol] ?? NaN))
const getPositionMargin = (rows: UserPortrait['positions'] | undefined) => sum(rows,p => Number(p.margin ?? p.margin_price ?? 0))
const getPositionUnrealizedPnl = (rows: UserPortrait['positions'] | undefined) => sum(rows,p => Number(p.unrealized_pnl ?? 0))
const calcOpenOrderValue = (rows: UserPortrait['orders'] | undefined) => sum(rows, o =>
    Math.max(Number(o.original_qty) - Number(o.filled_qty),0) * (Number(o.order_price) || Number(props.marketPrices[o.symbol] ?? NaN)))
const positionValue = computed(() => calcPositionValue(currentPositions.value))
const positionMargin = computed(() => getPositionMargin(currentPositions.value))
const positionUnrealizedPnl = computed(() => getPositionUnrealizedPnl(currentPositions.value))
const openOrderValue = computed(() => calcOpenOrderValue(currentOpenOrders.value))
const assetList = computed(() => [
    {label:'U本位钱包余额(U)',value:portrait.value?.account?.wallet_balance},
    {label:'可用余额(U)',value:portrait.value?.account?.available_balance},
    {label:'当前持仓面值(U)',value:positionValue.value,hint:currentPositions.value && currentPositions.value.length+' '+tr('个仓位')},
    {label:'保证金占用(U)',value:positionMargin.value},
    {label:'30日成交量(U)',value:portrait.value?.volume_30d},
    {label:'累计已实现盈亏(U)',value:portrait.value?.realized_pnl},
])
function formatMoney(val: unknown) {
    if (val == null || typeof val === 'number' && !Number.isFinite(val)) return '-'
    const num = Number(val)
    if (!Number.isFinite(num)) return String(val)
    return Number(num.toFixed(2)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

function formatSignedMoney(val: unknown) {
    if (val == null || typeof val === 'number' && !Number.isFinite(val)) return '-'
    const num = Number(val)
    if (!Number.isFinite(num)) return '-'
    const formatted = formatMoney(Math.abs(num))
    if (num > 0) return `+${formatted}`
    if (num < 0) return `-${formatted}`
    return formatted
}

function numberTone(val: unknown) {
    if (val == null || typeof val === 'number' && !Number.isFinite(val)) return '-'
    const num = Number(val)
    if (num > 0) return 'is-positive'
    if (num < 0) return 'is-negative'
    return ''
}
</script>

<style scoped>
:global(.user-profile-dialog .mm-dialog__body) {
    padding: 12px;
    overflow: hidden;
}

.profile-status { padding: 24px; color: var(--mm-color-text-muted); }

.user-profile {
    display: grid;
    grid-template-rows: auto auto auto minmax(0, 1fr);
    gap: 12px;
    height: min(760px, calc(100vh - 138px));
    min-height: 560px;
    color: var(--mm-color-text);
    overflow: hidden;
}

.profile-identity-card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border: 1px solid var(--mm-color-line);
    border-radius: var(--mm-radius-md);
    background: var(--mm-color-panel);
}

.profile-avatar {
    color: var(--mm-color-on-primary);
    background: var(--mm-color-primary);
    border: 0;
    font-size: 18px;
    font-weight: 700;
}

.profile-identity-main {
    min-width: 0;
}

.profile-name-row,
.profile-meta-row,
:slotted(.profile-actions) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.profile-name-row {
    gap: 8px;
}

.profile-name-row > strong {
    max-width: min(420px, 45vw);
    font-size: 17px;
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.profile-meta-row {
    gap: 5px 16px;
    margin-top: 7px;
    color: var(--mm-color-text-muted);
    font-size: 11px;
    line-height: 18px;
}

.profile-meta-row > span {
    white-space: nowrap;
}

:slotted(.profile-actions) {
    justify-content: flex-end;
    gap: 7px;
}

.profile-metric-grid {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 10px;
}

.profile-metric-card {
    min-width: 0;
    min-height: 78px;
    padding: 11px 13px;
    border: 1px solid var(--mm-color-line);
    border-radius: var(--mm-radius-md);
    background: var(--mm-color-panel);
}

.profile-metric-card > span,
.profile-metric-card > small {
    display: block;
    color: var(--mm-color-text-muted);
    font-size: 11px;
    line-height: 17px;
}

.profile-metric-card > strong {
    display: block;
    margin-top: 5px;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    font-variant-numeric: tabular-nums;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.profile-metric-card > small {
    margin-top: 1px;
    color: var(--mm-color-primary);
}

.profile-menu {
    min-width: 0;
    border: 1px solid var(--mm-color-line);
    border-radius: var(--mm-radius-md);
    padding: 4px 8px;
}

.profile-menu-panel {
    box-sizing: border-box;
    height: 100%;
    min-width: 0;
    min-height: 0;
    padding: 0;
    background: var(--mm-color-panel);
    overflow: auto;
}

.profile-pane-fill {
    height: 100%;
    min-height: 0;
}

.profile-overview,
.profile-table-pane {
    min-width: 0;
}

.profile-table-pane,
.profile-position-table,
.profile-shared-table {
    height: 100%;
    min-height: 360px;
}

.profile-table-pane {
    overflow: hidden;
}

.profile-position-table :deep(.mm-query-bar__field[data-query-field='keyword']),
.profile-shared-table :deep(.mm-query-bar__field[data-query-field='keyword']),
.profile-shared-table :deep(.mm-query-bar__field[data-query-field='user_type']) {
    display: none;
}

.overview-section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    padding: 0 12px;
}

.overview-section-head.is-profile {
    margin-top: 16px;
}

.overview-section-head > div {
    display: grid;
    gap: 2px;
}

.overview-section-head strong {
    font-size: 13px;
    line-height: 20px;
}

.overview-section-head span {
    color: var(--mm-color-text-muted);
    font-size: 11px;
    line-height: 16px;
}

.is-positive {
    color: var(--mm-color-success);
}

.is-negative {
    color: var(--mm-color-danger);
}

@media (max-width: 1400px) {
    .profile-metric-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

@media (max-width: 900px) {
    .user-profile {
        height: calc(100vh - 120px);
    }

    .profile-identity-card {
        grid-template-columns: auto minmax(0, 1fr);
    }

    :slotted(.profile-actions) {
        grid-column: 1 / -1;
        justify-content: flex-start;
    }

    .profile-metric-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
