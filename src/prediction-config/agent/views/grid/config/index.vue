<template>
    <section class="grid-config" data-grid-config="agent">

        <el-alert v-if="permissionError" :title="permissionError" type="warning" :closable="false" />
        <el-alert v-else-if="storageError" title="本机保存的待确认操作记录已损坏或不可用，请停止操作并联系管理员核验" type="error" :closable="false" />
        <el-alert v-else-if="foreignPending" title="检测到其他账号尚未确认的预测网格配置操作，当前账号不可覆盖，请切回原账号查询回执" type="error" :closable="false" />
        <div v-if="error"><el-alert :title="error" type="error" :closable="false" /><el-button :loading="catalogLoading || detailLoading" :disabled="busy || !!pending" @click="refresh">重试</el-button></div>
        <el-alert v-if="message" :title="message" :type="messageType" :closable="false" />
        <div v-if="boundPending" class="pending-bar">
            <div><strong>原配置操作结果待确认</strong><small>{{ boundPending.command.site_id }} · {{ boundPending.command.symbol }} · {{ boundPending.command.client_request_id }}</small></div>
            <div class="pending-actions">
                <el-button type="warning" :loading="busy" :disabled="!pendingCanQuery || reviewingRecovery" @click="queryReceipt">查询原操作回执</el-button>
                <el-button v-if="pendingCanRecover || reviewingRecovery" type="warning" :disabled="!pendingCanRecover" @click="recoverOriginal">恢复原请求</el-button>
            </div>
        </div>

        <PredictionLoadingRegion :loading="catalogLoading" min-height="0px" class="grid-loading-region">
        <div class="grid-layout">
            <aside class="symbol-panel">
                <div class="panel-heading"><strong>交易对配置</strong><span>{{ filteredProducts.length }} 条</span></div>
                <el-select v-if="sites.length > 1" v-model="siteId" aria-label="选择站点" :disabled="blockingWork" @change="selectSite">
                    <el-option v-for="site in sites" :key="site.site_id" :label="site.site_id" :value="site.site_id" />
                </el-select>
                <p v-if="directoryError" class="directory-error" role="alert">{{ directoryError }}<el-button link type="primary" :disabled="blockingWork" @click="refresh">重试</el-button></p>
                <MmInput v-model="keyword" clearable placeholder="搜索交易对" aria-label="搜索交易对" />
                <div class="symbol-list">
                    <div v-for="product in filteredProducts" :key="product.symbol" class="symbol-row" :class="{ active: product.symbol === symbol }">
                        <button type="button" class="symbol-button" :disabled="!product.configured || (blockingWork && product.symbol !== symbol)" @click="selectProduct(product.symbol)">
                            <symbol-display :symbol="product.symbol" />
                        </button>
                        <span v-if="!product.configured" class="symbol-unconfigured">未配置</span>
                        <el-switch v-else :model-value="displayEnabled(product)" :disabled="switchDisabled(product)" :aria-label="`${product.symbol} 开放配置`" @change="changeEnabled(product, $event)" />
                        <small v-if="product.symbol === symbol && dirty">未保存</small>
                    </div>
                    <el-empty v-if="!catalogLoading && selectedSite && !filteredProducts.length" description="当前站点没有已授权的预测网格产品" :image-size="56" />
                </div>
            </aside>

            <main class="config-panel">
                <el-empty v-if="!catalogLoading && !sites.length && !error" description="当前账号暂无授权站点" />
                <el-empty v-else-if="selectedSite && !symbol" description="请选择交易对查看配置" />
                <template v-else-if="snapshot && draft">
                    <header class="config-heading">
                        <div><h2>{{ snapshot.symbol }} · 预测网格</h2><p data-config-updated-at>更新时间 {{ configUpdatedAt }}</p><p v-if="sites.length > 1">当前站点：{{ snapshot.site_id }}</p></div>
                        <div class="config-heading__actions"><el-button @click="guideVisible = true">玩法说明</el-button><el-button v-if="canSavePermission" type="primary" :loading="busy" :disabled="!editable || !dirty" @click="reviewSave">保存配置</el-button></div>
                    </header>
                    <p v-if="snapshot.requested_agent_id !== '0'" class="parameter-description">{{ snapshot.inherited ? '当前继承平台配置' : '当前使用商户配置' }}；平台更新后恢复平台配置。平台返奖率上限 {{ snapshot.default_target_rtp ? `${ratioToPercent(snapshot.default_target_rtp)}%` : '—' }}，单笔范围 {{ snapshot.default_min_order_amount }} ~ {{ snapshot.default_max_order_amount }} USDT。</p>
                    <el-alert v-if="snapshot.default_enabled === false" title="平台已关闭此币种，商户不能开启" type="info" :closable="false" />
                    <PredictionLoadingRegion :loading="detailLoading">
                        <article v-if="snapshot.layout" class="parameter-card" data-price-precision>
                            <header class="parameter-heading"><h3>价格精度</h3><p class="parameter-description">由平台统一设置，商户只读</p></header>
                            <div class="fields"><label><span>价格小数位：{{ snapshot.layout.price_decimals == null ? '未设置（沿用原规则）' : `${snapshot.layout.price_decimals} 位` }}</span></label></div>
                        </article>
                        <article class="parameter-card"><header class="parameter-heading"><h3>赔率配置</h3><p class="parameter-description">格子赔率按目标返奖率与命中概率动态计算</p></header>
                            <div class="fields odds-fields">
                                <label><span>目标返奖率<ParameterHelp label="目标返奖率" content="例如 97%：命中概率为 20% 时，计算赔率为 4.85x。" /></span><DecimalInput :input-component="MmInput" v-model="rtpPercent" :disabled="!editable" inputmode="decimal" @input="invalidateMessage"><template #append>%</template></DecimalInput><small>例如 97%：命中概率为 20% 时，计算赔率为 4.85x</small></label>
                            </div>
                        </article>
                        <article class="parameter-card"><header class="parameter-heading"><h3>下注限制</h3><p class="parameter-description">{{ snapshot.symbol }} 每个格子生成一笔独立订单</p></header>
                            <div class="fields limit-fields">
                                <label><span>最小下注金额<ParameterHelp label="最小下注金额" /></span><DecimalInput :input-component="MmInput" v-model="draft.min_order_amount" :disabled="!editable" inputmode="decimal" @input="invalidateMessage"><template #append>USDT</template></DecimalInput></label>
                                <label><span>最大下注金额<ParameterHelp label="最大下注金额" /></span><DecimalInput :input-component="MmInput" v-model="draft.max_order_amount" :disabled="!editable" inputmode="decimal" @input="invalidateMessage"><template #append>USDT</template></DecimalInput></label>
                            </div>
                        </article>
                        <el-alert v-if="!canSavePermission" title="当前账号只有预测网格配置查看权限" type="info" :closable="false" />
                    </PredictionLoadingRegion>
                </template>
            </main>
        </div>
        </PredictionLoadingRegion>
        <GridGuide v-model="guideVisible" />
    </section>
</template>

<script setup lang="ts">
import { ElAlert, ElButton, ElSelect, ElOption, ElSwitch, ElEmpty } from 'element-plus'
import { MmInput } from '../../../../ui'
import PredictionLoadingRegion from '../../../../platform/views/prediction/components/PredictionLoadingRegion.vue'

import { useAgentConfigRuntime } from '../../../../runtime'
const { initializeGridMerchant, gridConfigSymbols: readSymbolDirectory, gridConfigCatalog, gridConfigReceipt, gridConfigSite, saveGridConfig } = useAgentConfigRuntime().grid

import { timestamp as formatConfigTime } from '../../prediction/shared/format'
import DecimalInput from '../../../../platform/views/prediction/components/DecimalInput.vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useConfigBeforeLeave as onBeforeRouteLeave } from '../../../../runtime'
import { ElMessageBox } from 'element-plus'
import ParameterHelp from '../../../../platform/views/prediction/components/ParameterHelp.vue'
import GridGuide from '../../../../platform/views/prediction/components/GridGuide.vue'
import { useConfigSymbol } from '../../../../runtime'
const SymbolDisplay = useConfigSymbol()
import { useConfigUser as useUserStore } from '../../../../runtime'
import type { AgentGridCatalog as GridCatalog } from '../../../../runtime'
import { attemptPending, isUnconfirmedReceipt, captureSaveReview, makeCommand, normalizeSnapshotForTarget, pendingForActor, percentToRatio, persistReviewedCommand, ratioToPercent, secureRequestId, SelectionGate, type GridCommand, type GridSnapshot, type PendingGridCommand } from './model'
import { mergeGridDirectory } from './directory'
const user = useUserStore()
const can = (permission: string) => user.perms.includes('*') || user.perms.includes(permission)
const canRead = computed(() => can('grid_config:read'))
const canSavePermission = computed(() => can('grid_config:save'))
const operator = computed(() => {
    const value = String(user.userInfo.id || '')
    return /^[1-9]\d*$/.test(value) ? value : ''
})
const sites = ref<GridCatalog['sites']>([])
const siteId = ref('')
const symbol = ref('')
const keyword = ref('')
const snapshot = ref<GridSnapshot | null>(null)
const draft = ref<GridSnapshot | null>(null)
const rtpPercent = ref('')
const reason = ref('通过预测网格配置页面保存配置')
const guideVisible = ref(false)
const catalogReady = ref(false)
const catalogLoading = ref(false)
const detailLoading = ref(false)
const busy = ref(false)
const error = ref('')
const message = ref('')
const messageType = ref<'success' | 'warning' | 'info'>('info')
const pending = ref<PendingGridCommand | null>(null)
const storageError = ref(false)
const recoverablePending = ref('')
const reviewingRecovery = ref(false)
const catalogGate = new SelectionGate()
const detailGate = new SelectionGate()
const writeGate = new SelectionGate()
let detailTask: Promise<void> | undefined
let writeGeneration = 0

const permissionError = computed(() => !canRead.value ? '当前账号没有预测网格配置查询权限' : !operator.value ? '无法确认当前操作人身份' : '')
const selectedSite = computed(() => sites.value.find(site => site.site_id === siteId.value))
const directorySymbols = ref<string[]>([]), directoryError = ref('')
const products = computed(() => mergeGridDirectory(selectedSite.value?.products ?? [], directorySymbols.value))
const filteredProducts = computed(() => {
    const query = keyword.value.trim().toUpperCase()
    return products.value.filter(product => !query || product.symbol.includes(query))
})
const dirty = computed(() => {
    if (!snapshot.value || !draft.value) return false
    try {
        return ratioToPercent(snapshot.value.target_rtp) !== rtpPercent.value ||
            ['enabled', 'min_multiplier', 'max_multiplier', 'min_order_amount', 'max_order_amount'].some(key => snapshot.value![key as keyof GridSnapshot] !== draft.value![key as keyof GridSnapshot])
    } catch { return true }
})
const pendingState = computed(() => pending.value ? (pending.value.operator_id === operator.value ? 'bound' : 'foreign') : 'none')
const boundPending = computed(() => pendingState.value === 'bound' ? pending.value : null)
const foreignPending = computed(() => pendingState.value === 'foreign')
const blockingWork = computed(() => dirty.value || !!pending.value || busy.value)
const editable = computed(() => canRead.value && canSavePermission.value && !!selectedSite.value?.can_edit && !!operator.value && !!snapshot.value && !pending.value && !storageError.value && !detailLoading.value && !busy.value)
// A hidden product must not prevent receipt recovery; the server rechecks the original actor and site.
const pendingCanQuery = computed(() => !!boundPending.value && canRead.value && canSavePermission.value && sites.value.some(site => site.site_id === boundPending.value!.command.site_id && site.can_edit))

const pendingCanRecover = computed(() => pendingCanQuery.value && catalogReady.value && !catalogLoading.value && !detailLoading.value && !busy.value && !storageError.value && !reviewingRecovery.value && recoverablePending.value === JSON.stringify(boundPending.value))

function errorText(value: unknown) {
    const problem = value as { message?: string; error_code?: string }
    const descriptions: Record<string, string> = {
        INVALID_LAYOUT: '网格区间超出允许范围，请检查价格区间和每列时长后重试',
        LAYOUT_PRICE_UNAVAILABLE: '当前标记价暂不可用，请稍后刷新重试',
        INVALID_LAYOUT_DURATION: '横向格子区间必须为 1 至 25 的整数秒数',
        INVALID_LAYOUT_HORIZON: '横向格子区间过大，当前列数加起始等待时间后超出允许的报价时长',
        INVALID_LAYOUT_WIDTH: '纵向格子区间必须大于 0',
        INVALID_DECIMAL: '请输入有效的十进制数，纵向格子区间最多支持 18 位有效小数',
        INVALID_RTP: '目标返奖率必须大于 0 且小于 100%',
        INVALID_GRID_LAYOUT: '网格区间返回格式不正确，请刷新后重试',
        FIELD_FORBIDDEN: '当前账号无权修改所选配置，请刷新后重试',
        CONFIG_IDENTITY_REQUIRED: '配置接口版本需要更新，请联系管理员完成本次升级',
        PLATFORM_LIMIT: '商户配置不能超出平台的开关、返奖率和金额范围',
        EMPTY_CHANGES: '配置没有实际变化，无需保存'
    }
    const code = problem?.error_code || problem?.message || ''
    return descriptions[code] || [problem?.message || '预测网格配置请求失败', problem?.error_code].filter(Boolean).join(' · ')

}
// Grid versions take effect immediately at the authoritative database write time.
const configUpdatedAt = computed(() => {
    const times = [snapshot.value?.effective_from_ms, snapshot.value?.layout?.effective_from_ms].filter((value): value is string => typeof value === 'string' && /^[1-9][0-9]*$/.test(value))
    const latest = times.reduce((a, b) => BigInt(a) > BigInt(b) ? a : b, '0')
    return latest === '0' ? '未提供' : formatConfigTime(latest)
})
function normalizeCatalog(value: GridCatalog) {
    if (!value || !Array.isArray(value.sites)) throw new Error('币种目录返回格式不正确')
    const seenSites = new Set<string>()
    for (const site of value.sites) {
        if (!site || typeof site.site_id !== 'string' || !site.site_id || site.site_id.trim() !== site.site_id || typeof site.can_edit !== 'boolean' || typeof site.can_edit_limits !== 'boolean' || !Array.isArray(site.products) || seenSites.has(site.site_id)) throw new Error('币种目录返回格式不正确')
        seenSites.add(site.site_id)
        const seenProducts = new Set<string>()
        for (const product of site.products) {
            if (!product || typeof product.symbol !== 'string' || !/^[A-Z0-9]{2,32}$/.test(product.symbol) || typeof product.enabled !== 'boolean' || typeof product.default_enabled !== 'boolean' || seenProducts.has(product.symbol)) throw new Error('币种目录返回格式不正确')
            seenProducts.add(product.symbol)
        }
    }
    return value.sites.map(site => ({...site, products: site.products.filter(product => product.default_enabled)}))
}
function syncPending() {
    try {
        const state = pendingForActor(sessionStorage, operator.value)
        pending.value = state.pending ?? null
        storageError.value = false
    } catch {
        storageError.value = true
        pending.value = null
    }
}
function currentKey() { return `${operator.value}:${siteId.value}:${symbol.value}` }
function clearEditor() {
    detailGate.close()
    snapshot.value = null
    draft.value = null
    rtpPercent.value = ''
    reason.value = '通过预测网格配置页面保存配置'
    detailLoading.value = false
}
async function loadCatalog(preferredTarget?: GridCommand) {
    catalogReady.value = false
    catalogGate.close()
    writeGate.close()
    recoverablePending.value = ''
    clearEditor()
    sites.value = []
    directorySymbols.value = []
    directoryError.value = ''
    siteId.value = ''
    symbol.value = ''
    keyword.value = ''
    error.value = ''
    message.value = ''
    syncPending()
    if (permissionError.value || storageError.value) return
    const read = catalogGate.next(operator.value)
    catalogLoading.value = true
    try {
        await initializeGridMerchant(read.signal)
        if (!read.current(operator.value)) return
        const [catalog, directory] = await Promise.allSettled([gridConfigCatalog(read.signal), readSymbolDirectory(read.signal)])
        if (!read.current(operator.value)) return
        if (directory.status === 'fulfilled' && Array.isArray(directory.value) && directory.value.every(value => typeof value === 'string')) {
            directorySymbols.value = directory.value
        } else {
            directoryError.value = '通用币种目录暂不可用，当前仅显示已授权的网格配置。'
        }
        if (catalog.status === 'rejected') throw catalog.reason
        sites.value = normalizeCatalog(catalog.value)
        catalogReady.value = true
        const pendingTarget = boundPending.value ?? (preferredTarget ? { command: preferredTarget } : null)
        const wantedSite = pendingTarget && sites.value.some(site => site.site_id === pendingTarget.command.site_id) ? pendingTarget.command.site_id : sites.value[0]?.site_id || ''
        siteId.value = wantedSite
        const site = sites.value.find(entry => entry.site_id === wantedSite)
        const wantedSymbol = pendingTarget && pendingTarget.command.site_id === wantedSite && site?.products.some(product => product.symbol === pendingTarget.command.symbol) ? pendingTarget.command.symbol : products.value.find(product => product.configured)?.symbol || ''
        symbol.value = wantedSymbol
        if (wantedSymbol) detailTask = loadDetail()
    } catch (problem) {
        if (read.current(operator.value)) error.value = errorText(problem)
    } finally {
        if (read.current(operator.value)) catalogLoading.value = false
    }
}
function selectSite(value: string) {
    if (blockingWork.value) return
    clearEditor()
    siteId.value = value
    symbol.value = products.value.find(product => product.configured)?.symbol || ''
    if (symbol.value) detailTask = loadDetail()
}
function selectProduct(value: string) {
    if (value === symbol.value || blockingWork.value || !selectedSite.value?.products.some(product => product.symbol === value)) return
    clearEditor()
    symbol.value = value
    detailTask = loadDetail()
}
async function loadDetail() {
    clearEditor()
    if (!canRead.value || !siteId.value || !symbol.value) return
    const requestedSite = siteId.value
    const requestedSymbol = symbol.value
    const key = currentKey()
    const read = detailGate.next(key)
    detailLoading.value = true
    try {
        const value = await gridConfigSite(requestedSite, requestedSymbol, read.signal)
        if (!read.current(currentKey())) return
        const result = normalizeSnapshotForTarget(value, requestedSite, requestedSymbol)
        snapshot.value = result
        draft.value = structuredClone(result)
        rtpPercent.value = ratioToPercent(result.target_rtp)
    } catch (problem) {
        if (read.current(currentKey())) error.value = errorText(problem)
    } finally {
        if (read.current(currentKey())) detailLoading.value = false
    }
}
function displayEnabled(product: { symbol: string; enabled: boolean }) {
    return product.symbol === symbol.value && draft.value ? draft.value.enabled && draft.value.default_enabled !== false : product.enabled
}
function switchDisabled(product: { symbol: string }) {
    return (product.symbol === symbol.value && snapshot.value?.default_enabled === false) || !selectedSite.value?.products.some(item => item.symbol === product.symbol) || !canSavePermission.value || !selectedSite.value?.can_edit || detailLoading.value || busy.value || !!pending.value || storageError.value || (dirty.value && product.symbol !== symbol.value)
}
async function changeEnabled(product: { symbol: string }, value: unknown) {
    if (typeof value !== 'boolean' || switchDisabled(product)) return
    if (product.symbol !== symbol.value) {
        selectProduct(product.symbol)
        await detailTask
    }
    if (draft.value && draft.value.symbol === product.symbol && !switchDisabled(product)) {
        draft.value.enabled = value
        invalidateMessage()
    }
}
function invalidateMessage() {
    message.value = ''
}
async function reviewSave() {
    if (!editable.value || !snapshot.value || !draft.value || !operator.value) return
    let command
    try {
        command = makeCommand(snapshot.value, { ...draft.value, target_rtp: percentToRatio(rtpPercent.value) }, reason.value, secureRequestId(), false, false)
    } catch (problem) {
        messageType.value = 'warning'
        message.value = errorText(problem)
        return
    }
    const review = captureSaveReview(operator.value, command)
    try {
        await ElMessageBox.confirm(`确认保存 ${command.site_id} / ${command.symbol} 的 ${Object.keys(command.changes).length} 项修改？`, '确认预测网格配置', { type: 'warning', confirmButtonText: '确认保存', cancelButtonText: '取消' })
    } catch { return }
    syncPending()
    if (!editable.value || !snapshot.value || !draft.value) {
        messageType.value = 'warning'
        message.value = '确认期间账号、目标或编辑状态已变化，本次保存已取消'
        return
    }
    let currentCommand
    try {
        currentCommand = makeCommand(snapshot.value, { ...draft.value, target_rtp: percentToRatio(rtpPercent.value) }, reason.value, review.command.client_request_id, false, false)
    } catch {
        messageType.value = 'warning'
        message.value = '确认期间账号、目标或编辑状态已变化，本次保存已取消'
        return
    }
    let original: PendingGridCommand
    try {
        original = persistReviewedCommand(sessionStorage, review, operator.value, currentCommand)
        syncPending()
    } catch (problem) {
        if ((problem as Error)?.message === 'STALE_CONFIRMATION') {
            messageType.value = 'warning'
            message.value = '确认期间账号、目标或编辑状态已变化，本次保存已取消'
            return
        }
        storageError.value = true
        return
    }
    void send(original, 'save')
}
async function queryReceipt() {
    syncPending()
    if (!boundPending.value || !pendingCanQuery.value || busy.value || reviewingRecovery.value) return
    void send(boundPending.value, 'receipt')
}
async function recoverOriginal() {
    syncPending()
    if (!pendingCanRecover.value || !boundPending.value) return
    const original = boundPending.value
    reviewingRecovery.value = true
    try {
        await ElMessageBox.confirm(`确认恢复 ${original.command.site_id} / ${original.command.symbol} 的原请求 ${original.command.client_request_id}？将沿用原编号和原参数；已提交则返回原回执，尚未提交则保存原配置，不使用当前页面的新修改。`, '恢复原配置请求', { type: 'warning', confirmButtonText: '确认恢复', cancelButtonText: '取消' })
    } catch { return }
    finally { reviewingRecovery.value = false }
    syncPending()
    if (!pendingCanRecover.value || JSON.stringify(original) !== JSON.stringify(boundPending.value)) {
        messageType.value = 'warning'
        message.value = '确认期间账号、权限或原请求已变化，本次恢复已取消，请重新查询原操作回执'
        return
    }
    await send(original, 'recover')
}
async function send(original: PendingGridCommand, mode: 'save' | 'receipt' | 'recover') {
    const generation = ++writeGeneration
    const key = currentKey()
    const owner = writeGate.next(key)
    busy.value = true
    recoverablePending.value = ''
    message.value = ''
    try {
        const result = await attemptPending(sessionStorage, original, mode, (route, command) => route === 'save' ? saveGridConfig(command) : gridConfigReceipt(command))
        if (!owner.current(currentKey())) return
        syncPending()
        if (result.status === 'success') {
            const savedOperator = operator.value
            reason.value = '通过预测网格配置页面保存配置'
            busy.value = false
            await loadCatalog()
            if (savedOperator === operator.value) {
                messageType.value = 'warning'
                message.value = error.value ? '配置已保存；最新配置刷新失败，请手动刷新' : ''
            }
        } else if (mode === 'recover' && result.status === 'rejected' && (result.error as { error_code?: string })?.error_code === 'VERSION_CONFLICT') {
            if (!result.journalCleared || pending.value || storageError.value) {
                messageType.value = 'warning'
                message.value = '旧请求已明确拒绝，但本机待确认记录已变化，请重新核对当前记录'
            } else {
                const savedOperator = operator.value
                await loadCatalog(original.command)
                if (siteId.value && symbol.value && detailTask) await detailTask
                if (savedOperator === operator.value) {
                    messageType.value = 'warning'
                    const targetVisible = siteId.value === original.command.site_id && symbol.value === original.command.symbol && sites.value.some(site => site.site_id === original.command.site_id && site.products.some(product => product.symbol === original.command.symbol))
                    message.value = '旧请求未生效，配置版本已变化；已清除旧待确认记录。' + (!targetVisible ? `原目标当前不可见（${original.command.site_id} / ${original.command.symbol}），请核对权限和配置` : error.value || !snapshot.value ? '最新配置刷新失败，请手动刷新' : '请以当前配置为准')
                }
            }
        } else {
            messageType.value = result.status === 'unknown' ? 'warning' : 'info'
            if (mode === 'receipt' && isUnconfirmedReceipt(result.error) && JSON.stringify(boundPending.value) === JSON.stringify(original)) {
                recoverablePending.value = JSON.stringify(original)
                message.value = '未找到原操作回执，可使用原编号和原参数恢复请求'
            } else if (mode === 'recover') {
                message.value = '恢复尚未确认，原请求已保留，请重新查询原操作回执 · ' + errorText(result.error)
            } else {
                message.value = result.status === 'unknown' ? '原操作结果仍待确认，请使用原请求查询回执' : '保存已明确拒绝，可修正后重新提交 · ' + errorText(result.error)
            }
        }
    } catch (problem) {
        if (owner.current(currentKey())) {
            syncPending()
            messageType.value = 'warning'
            message.value = '原操作结果仍待确认 · ' + errorText(problem)
        }
    } finally {
        if (generation === writeGeneration) {
            busy.value = false
            syncPending()
        }
    }
}
async function confirmLeave() {
    if (!blockingWork.value) return true
    try {
        await ElMessageBox.confirm('当前有未保存修改或待确认操作，离开不会删除原记录。仍要离开吗？', '离开预测网格配置', { type: 'warning' })
        return true
    } catch { return false }
}
function editorFingerprint() {
    return JSON.stringify({ operator: operator.value, site: siteId.value, symbol: symbol.value, snapshot: snapshot.value, draft: draft.value, rtp: rtpPercent.value, reason: reason.value })
}
async function refresh() {
    if (busy.value) return
    if (dirty.value) {
        const before = editorFingerprint()
        try {
            await ElMessageBox.confirm('刷新会丢弃当前未保存修改，仍要刷新吗？', '刷新预测网格配置', { type: 'warning' })
        } catch { return }
        if (busy.value || before !== editorFingerprint()) {
            messageType.value = 'warning'
            message.value = '确认期间编辑状态已变化，本次刷新已取消'
            return
        }
    }
    await loadCatalog()
}
function beforeUnload(event: BeforeUnloadEvent) {
    if (!blockingWork.value) return
    event.preventDefault()
    event.returnValue = ''
}
watch(() => [operator.value, canRead.value, canSavePermission.value], () => loadCatalog(), { immediate: true })
onBeforeRouteLeave(confirmLeave)
window.addEventListener('beforeunload', beforeUnload)
onBeforeUnmount(() => {
    recoverablePending.value = ''
    catalogReady.value = false
    catalogGate.close()
    detailGate.close()
    writeGate.close()
    window.removeEventListener('beforeunload', beforeUnload)
})
defineExpose({ hasBlockingWork: blockingWork, confirmLeave, refresh, loading: catalogLoading })
</script>

<style scoped>
.grid-config { display:flex; flex-direction:column; gap:12px; min-height:420px; font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size:12px; }
.grid-loading-region { flex:1; min-height:0; }
.grid-layout { display:grid; grid-template-columns:290px minmax(0,1fr); min-height:520px; border:1px solid var(--el-border-color-lighter); border-radius:8px; background:var(--el-bg-color); overflow:hidden; }
.symbol-panel { min-width:0; padding:14px 10px 10px; border-right:1px solid var(--el-border-color-lighter); }
.panel-heading,.config-heading,.pending-bar { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.panel-heading { margin:2px 3px 10px; font-size:13px; font-weight:700; }
.panel-heading span,small { color:var(--el-text-color-secondary); font-size:10px; font-weight:400; }
.symbol-panel > :deep(.mm-input) { margin:0; flex-shrink:0; }
.symbol-list { display:grid; align-content:start; margin-top:8px; gap:6px; max-height:calc(100dvh - 330px); overflow-y:auto; }
.symbol-row { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:0; padding:0; border:1px solid transparent; border-radius:6px; }
.symbol-row.active { border-color:var(--el-color-primary); background:var(--el-color-primary-light-9); box-shadow:inset 2px 0 var(--el-color-primary); }
.symbol-row small { grid-column:1/-1; color:var(--el-color-warning); }
.symbol-row :deep(.el-switch) { margin-right:7px; --el-switch-height:20px; --el-switch-width:34px; --el-switch-button-size:14px; }
.symbol-row :deep(.el-switch__core) { min-width:34px; }
.symbol-button { min-width:0; position:relative; display:grid; align-content:center; gap:2px; padding:5px 7px 5px 41px; min-height:46px; border:0; color:inherit; background:transparent; text-align:left; cursor:pointer; }
.symbol-button:disabled { cursor:not-allowed; }
.symbol-button :deep(.symbol-display__name), .symbol-button :deep(.symbol-cell__text) { color:var(--el-text-color-primary); font-size:11px; font-weight:700; }
.symbol-button :deep(.symbol-display__icon), .symbol-button :deep(.symbol-display__placeholder), .symbol-button :deep(.symbol-cell__icon) { position:absolute; left:7px; top:50%; transform:translateY(-50%); width:26px!important; height:26px!important; flex-basis:26px!important; }
.config-panel { min-width:0; padding:14px; }
.config-heading { flex-wrap:wrap; margin:-14px -14px 12px; padding:18px 16px; border-bottom:1px solid var(--el-border-color-lighter); }
.config-heading h2 { font-size:15px; font-weight:700; line-height:19px; }
.config-heading p { margin-top:4px; color:var(--el-text-color-secondary); font-size:10px; }
.config-heading__actions { display:flex; flex-wrap:wrap; gap:8px; }
.config-heading__actions .el-button { height:30px; padding:5px 10px; border-radius:6px; font-size:10px; font-weight:650; }
.config-heading__actions .el-button--primary { font-weight:650; }
.config-heading__actions .el-button + .el-button { margin-left:0; }
h2,h3,p { margin:0; }
.parameter-card { margin-top:10px; border:1px solid var(--el-border-color-lighter); border-radius:8px; overflow:hidden; }
.parameter-heading { padding:12px; border-bottom:1px solid var(--el-border-color-lighter); }
.parameter-heading h3 { font-size:12px; font-weight:700; line-height:16px; }
.parameter-description { margin:3px 0 0; color:var(--el-text-color-secondary); font-size:10px; line-height:14px; }
.fields { display:grid; gap:12px; padding:12px; }
.odds-fields { grid-template-columns:repeat(2,minmax(0,1fr)); }
.limit-fields { grid-template-columns:repeat(2,minmax(0,1fr)); }
.fields label { min-width:0; }
.fields label>span:not(.mm-input) { display:block; margin-bottom:6px; color:var(--el-text-color-primary); font-size:10px; font-weight:650; line-height:14px; }
.fields small { display:block; margin-top:6px; font-size:10px; line-height:16px; }
.layout-notice { padding:0 12px 12px; color:var(--el-text-color-secondary); font-size:10px; line-height:16px; }
.directory-error { color:var(--el-color-warning); font-size:11px; line-height:1.6; }
.symbol-unconfigured { color:var(--el-text-color-secondary); font-size:11px; }
.pending-bar { flex-wrap:wrap; padding:12px 16px; border:1px solid var(--el-color-warning-light-5); border-radius:8px; background:var(--el-color-warning-light-9); }
.pending-actions { display:flex; flex-wrap:wrap; gap:8px; }
.pending-actions .el-button { margin-left:0; }
.pending-bar small { display:block; margin-top:5px; overflow-wrap:anywhere; }
/* 桌面配置区与涨跌、自选共用剩余高度，两栏分别滚动。 */
@media (min-width: 761px) {
    .grid-config.grid-mode { flex:1; min-height:0; overflow:hidden; }
    .grid-mode .grid-layout { flex:1; min-height:0; grid-template-rows:minmax(0,1fr); }
    .grid-mode .symbol-panel { display:flex; flex-direction:column; min-height:0; }
    .grid-mode .symbol-panel > :not(.symbol-list) { flex-shrink:0; }
    .grid-mode .symbol-list { flex:1; min-height:0; max-height:none; }
    .grid-mode .config-panel { min-height:0; overflow-y:auto; }
}

@media(max-width:760px){.grid-layout{grid-template-columns:1fr}.symbol-panel{border-right:0;border-bottom:1px solid var(--el-border-color-lighter)}.symbol-list{max-height:220px}.odds-fields,.limit-fields{grid-template-columns:1fr}}



.grid-config :deep(button), .grid-config :deep(input) { font-family:inherit; }
</style>
