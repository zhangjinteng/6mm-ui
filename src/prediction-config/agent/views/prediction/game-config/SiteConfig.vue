<template>
    <el-config-provider :locale="elementLocale">
        <section class="prediction-config prediction-table-page" data-prediction-page="GAME_CONFIG">
            <nav class="game-tabs" aria-label="选择预测玩法">
                <el-button :type="mode === 'UP_DOWN' ? 'primary' : undefined" :aria-pressed="mode === 'UP_DOWN'" @click="selectMode('UP_DOWN')">涨跌预测<small>按系统场次预测结算价格相对开盘价格上涨或下跌</small></el-button>
                <el-button :type="mode === 'HIGH_LOW' ? 'primary' : undefined" :aria-pressed="mode === 'HIGH_LOW'" @click="selectMode('HIGH_LOW')">自选预测<small>用户自主选择方向和预测周期，生成独立预测订单</small></el-button>
                <el-button :type="mode === 'GRID' ? 'primary' : undefined" :aria-pressed="mode === 'GRID'" @click="selectMode('GRID')">预测网格<small>按时间格与价格区间展示网格预测规则</small></el-button>
            </nav>
            <template v-if="mode !== 'GRID'">
            <el-select v-if="targets.length > 1" v-model="siteId" placeholder="请选择配置站点" aria-label="配置站点" :disabled="busy || dirty || !!pending || !!legacyPending"><el-option v-for="(site, index) in targets" :key="site.site_id" :label="`站点配置 ${index + 1}`" :value="site.site_id" /></el-select>
            <p v-if="!canRead" role="alert">{{ t('predictionPages.noPermission') }}</p>
            <div v-else class="config-layout">
                <aside class="symbol-directory" :aria-label="t('predictionPages.symbolDirectory')">
                    <h3>交易对配置 <small>{{ directory.length }} 条</small></h3>
                    <el-input v-model="symbolSearch" clearable :aria-label="t('predictionPages.searchSymbol')" :placeholder="t('predictionPages.searchSymbol')" />
                    <p v-if="directoryError" class="catalog-error" role="alert">{{ directoryError }}<el-button size="small" :disabled="dirty || busy || !!pending || listLoading" @click="loadSite">重试币种目录</el-button></p>
                    <p v-if="catalogLoading || listLoading" role="status">{{ t('predictionPages.loading') }}</p>
                    <div v-if="catalogError" class="catalog-error" role="alert"><p>{{ catalogError }}</p><el-button data-action="retry-catalog" size="small" :disabled="catalogLoading" @click="loadCatalog">{{ t('predictionPages.retry') }}</el-button></div>
                    <p v-if="!catalogLoading && !catalogError && !visibleSymbols.length" role="status">{{ !targets.length ? '当前账号暂无预测配置站点授权，请联系管理员配置后刷新。' : !siteId ? '请选择配置站点。' : !symbols.length ? '当前站点尚未开放此玩法的交易对配置。' : '没有匹配的交易对。' }}</p>
                    <div class="symbol-list">
                        <div v-for="item in visibleSymbols" :key="item" class="symbol-entry" :class="{ selected: item === symbol }">
                        <button type="button" class="symbol-option" :data-symbol="item" :aria-pressed="item === symbol" :disabled="!symbols.includes(item)" @click="selectSymbol(item)">
                            <SymbolCell :symbol="item" />
                            <span v-if="!symbols.includes(item)" class="symbol-status">{{ templateSymbols.includes(item) ? '未开放配置' : '未配置' }}</span>
                            <span v-else-if="states[item] === 'loading'" class="symbol-status">{{ t('predictionPages.loading') }}</span>
                            <span v-else-if="states[item] === 'unconfigured'" class="symbol-status">{{ t('predictionPages.unconfigured') }}</span>
                            <span v-else-if="enabledRooms(item) === null" class="symbol-status">{{ t('predictionPages.unavailableConfig') }}</span>
                            <span v-else class="symbol-status">{{ symbolPeriods(item) }}</span>
                            <span v-if="item === symbol && dirty" class="draft-label">{{ t('predictionPages.unsaved') }}</span>
                        </button>
                        <div v-if="states[item] === 'configured'" class="symbol-all-control">

                            <el-switch inline-prompt active-text="开放" inactive-text="停用" :data-symbol-enabled="item" :aria-label="`${item} ${symbolEnabledLabel}`" :model-value="symbolEnabled(item)" :disabled="allSwitchDisabled(item)" @change="changeAllRooms(item, $event)" />

                        </div>
                        </div>
                    </div>
                </aside>
                <main class="config-content">
                    <header class="config-title"><div><h3>{{ symbol || t('predictionPages.selectSymbol') }} · {{ t('predictionPages.games.' + game) }}</h3><p>当前商户生效</p></div><div class="config-title-actions"><span v-if="dirty" class="draft-label" data-dirty="true">{{ t('predictionPages.unsaved') }}</span><el-button v-if="canEdit" data-action="save" type="primary" :loading="busy" :disabled="!editable" @click="save">保存配置</el-button></div></header>
                    <p v-if="loading" role="status">{{ t('predictionPages.loading') }}</p>
                    <p v-if="error" role="alert">{{ error }}<el-button v-if="canRead" :disabled="loading || catalogLoading || busy || dirty || !!pending || !!legacyPending" @click="refresh">重试</el-button></p>
                    <p v-if="!operator" role="alert">{{ t('predictionPages.identityError') }}</p>
                    <p v-if="unconfigured">该交易对尚未配置，请联系管理员完成初始配置后刷新。</p>
                    <el-alert v-if="legacyPending" type="warning" :closable="false" title="存在旧版代理配置待确认请求"><p>旧请求按原协议恢复，不会转换为站点保存。</p><p>{{ legacyPending.body.symbol }} · {{ legacyPending.body.client_request_id }}</p><el-button v-if="legacyBound" :disabled="busy || !canEdit || storageError" @click="replayLegacy">确认旧版原请求</el-button><p v-else>请使用原操作账号恢复该请求。</p></el-alert>
                    <el-alert v-if="storageError" type="error" :closable="false" :title="t('predictionPages.storageError')" />
                    <el-alert v-else-if="pending" type="warning" :closable="false" :title="t('predictionPages.pending')">
                        <template v-if="boundPending">
                            <p>{{ t('predictionPages.fields.client_request_id') }}: <code>{{ boundPending.body.client_request_id }}</code></p>
                            <p>{{ boundPending.body.symbol }} · 站点 {{ boundPending.body.site_id }} · 公共版本 {{ boundPending.body.based_on_public_version }} / 站点版本 {{ boundPending.body.based_on_site_version }}</p>
                            <ul><li v-for="row in boundPending.body.overrides" :key="row.duration_seconds">{{ row.duration_seconds }}s · {{ row.enabled === undefined ? '继承原设置' : row.enabled ? t('predictionPages.on') : t('predictionPages.off') }} · {{ row.maximum_stake ?? row.stake_tiers?.[0]?.maximum_stake ?? '继承平台设置' }}<span v-if="row.fixed_odds !== undefined"> · 固定赔率 {{ row.fixed_odds }}x</span><span v-if="row.minimum_stake !== undefined"> · 最小下注金额 {{ row.minimum_stake }} USDT</span></li></ul>
                            <el-button v-if="canEdit" :disabled="busy" data-action="replay" @click="replay">{{ t('predictionPages.confirmOriginal') }}</el-button>
                        </template>
                        <p v-else>{{ t('predictionPages.otherPending') }}</p>
                    </el-alert>
                    <p v-if="message" role="status">{{ message }}</p>
                    <template v-if="config">
                        <p v-if="!aggregateEnabled">交易对已关闭；以下房间设置仍会保留。</p><p v-if="config.adjustments.length">部分保存值受当前公共配置调整，编辑框保留原设置；实际生效金额见下方。</p>
                        <p v-if="!canEdit">{{ t('predictionPages.readOnlyConfig') }}</p>
                        <nav class="room-tabs" :aria-label="game === 'UP_DOWN' ? t('predictionPages.observationRoom') : '支持周期'"><button v-for="row in rows" :key="row.duration_seconds" type="button" :data-room="row.duration_seconds" :aria-pressed="selectedRoom === row.duration_seconds" :class="{ active: selectedRoom === row.duration_seconds }" @click="selectedRoom = row.duration_seconds">{{ periodLabel(row) }}</button></nav>
                        <template v-if="activeRow && activeRule">
                            <div class="room-heading"><div><h3>{{ periodLabel(activeRow) }} · {{ game === 'UP_DOWN' ? t('predictionPages.observationRoom') : '支持周期' }}</h3></div><label class="room-switch">{{ t('predictionPages.roomEnabled') }}<el-switch v-model="activeRow.enabled" data-field="enabled" :aria-label="t('predictionPages.roomEnabled')" :disabled="!editable" @change="invalidate" /></label></div>
                            <p v-if="activeRow.inherited_enabled">房间开关包含继承设置；未修改时保留继承状态。</p>
                            <div class="parameter-cards">

                                <article v-if="game === 'UP_DOWN'" class="parameter-card"><h4>{{ t('predictionPages.oddsSettings') }}</h4><p class="field-description">上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。</p><dl class="parameter-facts"><div v-for="key in ['target_payout_rate', 'maximum_odds']" :key="key"><dt>{{ label(key) }}<ParameterHelp :label="label(key)" /></dt><dd>{{ oddsValue(key, activeRule[key]) }}</dd></div></dl><span class="read-only-label">{{ t('predictionPages.readOnly') }}</span></article>
                                <article v-if="game === 'HIGH_LOW'" class="parameter-card"><h4>赔率配置 · {{ periodLabel(activeRow) }}</h4><p class="field-description">用户下单时按当前周期固定赔率锁定，订单存储赔率快照；上涨和下跌使用相同赔率。</p><dl class="parameter-facts"><div><dt>当前生效固定赔率<ParameterHelp label="固定赔率" /></dt><dd data-field="fixed_odds">{{ oddsValue('fixed_odds', activeRule.fixed_odds) }}</dd></div></dl><span class="read-only-label">{{ t('predictionPages.readOnly') }}</span></article>
                                <article class="parameter-card"><h4>{{ t('predictionPages.stakeLimits') }} · {{ periodLabel(activeRow) }}</h4><p class="field-description">不同周期独立保存下注限制，变更不影响已受理订单。</p><div class="limit-fields"><dl v-if="game === 'UP_DOWN'"><dt>{{ t('predictionPages.fields.minimum_stake') }}<ParameterHelp label="单笔最小额" content="用户创建一笔预测订单时允许输入的最低下注金额。本版涨跌预测固定为 1 USDT，由平台统一维护。" /></dt><dd>{{ readonlyValue(activeRule.stake_tiers?.find(tier => tier.stake_tier_id === activeRow?.stake_tier_id)?.minimum_stake) }}</dd></dl><div v-else><label>{{ t('predictionPages.fields.minimum_stake') }}<ParameterHelp label="单笔最小额" /></label><el-input v-model="activeRow.minimum_stake" data-field="minimum_stake" :aria-label="t('predictionPages.fields.minimum_stake')" :disabled="!editable" @input="invalidate"><template #append>USDT</template></el-input></div><div><label>{{ t('predictionPages.fields.maximum_stake') }}<ParameterHelp label="单笔最大额" /></label><el-input v-model="activeRow.maximum_stake" data-field="maximum_stake" :aria-label="t('predictionPages.fields.maximum_stake')" :disabled="!editable || !activeRow.editable" @input="invalidate" /><small>当前生效：{{ activeRow.effective_maximum }}；可填写更高限额，最终由平台范围校验。</small></div></div></article>
                            </div>
                        </template>
                    </template>
                </main>
            </div>
            </template>
            <GridConfig v-else ref="gridRef" />
        </section>
    </el-config-provider>
</template>
<script setup lang="ts">
import { ElConfigProvider, ElButton, ElSelect, ElOption, ElInput, ElSwitch, ElAlert } from 'element-plus'

import { useAgentConfigRuntime } from '../../../../runtime'
const { siteDirectorySymbols, configurations, siteConfigurationTargets, siteConfiguration, saveSiteConfiguration, saveConfiguration, configuration } = useAgentConfigRuntime().api

import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { useConfigLocale as useI18n } from '../../../../runtime'
import elementEn from 'element-plus/es/locale/lang/en'
import elementZh from 'element-plus/es/locale/lang/zh-cn'
import { ElMessage } from 'element-plus'
import { useConfigSymbol } from '../../../../runtime'
const SymbolCell = useConfigSymbol()
import ParameterHelp from '../../../../platform/views/prediction/components/ParameterHelp.vue'
import GridConfig from '../../grid/config/index.vue'
import { useConfigUser as useUserStore } from '../../../../runtime'
import type { SiteActor, SiteGame, SiteConfigRead, SiteTargets } from '../../../api/prediction/site-types'
import type { OperationReceipt } from '../../../api/prediction/types'
import { exact, identity } from '../shared/format'
import { ReadGate } from '../shared/query'
import { dispatchPending, readPending, configSymbol, type Pending } from '../shared/mutation'
import { publicSymbols, symbolDirectory } from './site-directory'
import { assertTargets, assertSiteRead, makeSiteBody, siteRequestId, siteRows, SiteIntentGate, type SiteRow, type SiteBinding } from './site-model'
import { dispatchSitePendingWithRefresh, persistSitePending, readSitePending, type SitePending } from './site-mutation'
const { t, te, locale } = useI18n(), user = useUserStore()
const legacyGate = new ReadGate(), catalogGate = new ReadGate(), listGate = new ReadGate(), detailGate = new ReadGate(), intent = new SiteIntentGate()
const mode = ref<SiteGame | 'GRID'>('UP_DOWN'), gridRef = shallowRef<InstanceType<typeof GridConfig>>()
const game = computed<SiteGame>(() => mode.value === 'HIGH_LOW' ? 'HIGH_LOW' : 'UP_DOWN')
const elementLocale = computed(() => locale.value === 'en-US' ? elementEn : elementZh)
const can = (key: string) => user.perms.includes('*') || user.perms.includes(key)
const canRead = computed(() => can('prediction_config:lists')), canEdit = canRead
const operator = computed(() => identity(user.userInfo.id))
const actor = ref<SiteActor | null>(null), targets = ref<SiteTargets['sites']>([]), siteId = ref(''), symbol = ref(''), symbolSearch = ref('')
const symbols = computed(() => targets.value.find(s => s.site_id === siteId.value)?.games.find(g => g.game_type === game.value)?.symbols ?? [])
const commonSymbols = ref<string[]>([]), templateSymbols = ref<string[]>([]), directoryError = ref('')
const directory = computed(() => symbolDirectory(symbols.value, templateSymbols.value, commonSymbols.value, Object.keys(cache.value).filter(s => symbolEnabled(s) && (enabledRooms(s) ?? 0) > 0)))
const visibleSymbols = computed(() => directory.value.map(item => item.symbol).filter(s => s.toLowerCase().includes(symbolSearch.value.toLowerCase())))
const cache = ref<Record<string, SiteConfigRead>>({}), states = ref<Record<string, 'loading' | 'configured' | 'unconfigured' | 'unavailable'>>({})
const config = ref<SiteConfigRead | null>(null), rows = ref<SiteRow[]>([]), aggregateEnabled = ref(false), selectedRoom = ref('35'), reason = ref('通过商户玩法配置页面保存配置'), baselineDraft = ref('')
const catalogLoading = ref(false), listLoading = ref(false), catalogError = ref(''), loading = ref(false), busy = ref(false), error = ref(''), message = ref(''), unconfigured = ref(false), storageError = ref(false)
const pending = shallowRef<SitePending | null>(null), legacyPending = shallowRef<Pending | null>(null), receipt = shallowRef<OperationReceipt | null>(null)
let writeController: AbortController | undefined
let detailBatch: { current: () => boolean; requests: Map<string, Promise<SiteConfigRead>>; read: (name: string) => Promise<SiteConfigRead> } | undefined
let selectionGeneration = 0
const symbolEnabledLabel = computed(() => locale.value === 'en-US' ? 'Enabled' : '启用交易对')
const boundPending = computed(() => pending.value && actor.value && pending.value.operator_id === actor.value.operator_id && pending.value.agent_id === actor.value.agent_id && pending.value.body.site_id === siteId.value && pending.value.body.game_type === game.value && pending.value.body.symbol === symbol.value ? pending.value : null)
const legacyActor = ref<SiteActor | null>(null)
const legacyBound = computed(() => legacyPending.value && legacyActor.value && legacyPending.value.operator_id === operator.value && legacyPending.value.operator_id === legacyActor.value.operator_id && legacyPending.value.agent_id === legacyActor.value.agent_id)
const editable = computed(() => canRead.value && canEdit.value && actor.value?.operator_id === operator.value && !!config.value && (game.value === 'UP_DOWN' ? rows.value.length === 5 : rows.value.length > 0) && !error.value && !pending.value && !legacyPending.value && !storageError.value && !busy.value && !loading.value)
const activeRow = computed(() => rows.value.find(r => r.duration_seconds === selectedRoom.value))
const activeRule = computed(() => config.value?.effective.rules.find(r => r.duration_seconds === selectedRoom.value))
const draftFingerprint = () => JSON.stringify({enabled: aggregateEnabled.value, rows: rows.value.map(r => ({duration: r.duration_seconds, enabled: r.enabled, maximum: r.maximum_stake, minimum: r.minimum_stake, odds: r.fixed_odds})), reason: reason.value})
const dirty = computed(() => !!config.value && !!baselineDraft.value && draftFingerprint() !== baselineDraft.value)
function binding(): SiteBinding | null {
    return actor.value ? {...actor.value, site_id: siteId.value, game_type: game.value, symbol: symbol.value, public_version: config.value?.effective.public_version ?? '', site_version: config.value?.stored.version ?? ''} : null
}
function syncPending() {
    storageError.value = false
    try { pending.value = readSitePending(sessionStorage) } catch { storageError.value = true }
    try { legacyPending.value = readPending(sessionStorage) } catch { storageError.value = true }
}
function invalidate() { intent.close(); message.value = ''; receipt.value = null; writeController?.abort(); busy.value = false }
function resetDetail() { invalidate(); detailGate.close(); config.value = null; rows.value = []; baselineDraft.value = ''; reason.value = '通过商户玩法配置页面保存配置'; error.value = ''; unconfigured.value = false; loading.value = false; syncPending() }
function apply(value: SiteConfigRead) {
    assertSiteRead(value, siteId.value, symbol.value, game.value)
    config.value = value; rows.value = siteRows(value); aggregateEnabled.value = value.stored.enabled
    cache.value[symbol.value] = value; states.value[symbol.value] = 'configured'; reason.value = '通过商户玩法配置页面保存配置'; baselineDraft.value = draftFingerprint(); syncPending()
}
function failure(value: unknown) {
    const code = (value as {error_code?: string})?.error_code
    return code === 'NOT_FOUND' ? '该交易对尚未配置，请联系管理员完成初始配置。' : code === 'UNAVAILABLE' ? '站点配置暂不可用，请稍后刷新。' : code === 'PERMISSION_DENIED' ? '当前账号无权访问该站点配置。' : t('predictionPages.loadFailed')
}
async function loadCatalog() {
    resetDetail(); listGate.close(); detailBatch = undefined; listLoading.value = false; const read = catalogGate.next(), op = operator.value, token = user.token
    actor.value = null; legacyActor.value = null; legacyGate.close(); void loadLegacyIdentity(); targets.value = []; commonSymbols.value = []; templateSymbols.value = []; directoryError.value = ''; siteId.value = ''; symbol.value = ''; cache.value = {}; states.value = {}; catalogError.value = ''; catalogLoading.value = false
    if (!canRead.value || !op) return
    catalogLoading.value = true
    try {
        const result = await siteConfigurationTargets(read.signal)
        if (!read.current() || operator.value !== op || user.token !== token) return
        assertTargets(result)
        if (result.actor.operator_id !== op) throw Error('IDENTITY_UNCONFIRMED')
        actor.value = result.actor; targets.value = result.sites
        if (pending.value?.operator_id === op && pending.value.agent_id === result.actor.agent_id) mode.value = pending.value.body.game_type
        const wanted = pending.value?.operator_id === op ? result.sites.find(s => s.site_id === pending.value?.body.site_id)?.site_id : undefined
        if (wanted || result.sites.length === 1) siteId.value = wanted ?? result.sites[0].site_id
    } catch (e) { if (read.current()) catalogError.value = failure(e) }
    finally { if (read.current()) catalogLoading.value = false }
}
async function loadLegacyIdentity() {
    const read = legacyGate.next(), original = legacyPending.value, op = operator.value, token = user.token
    if (!original || original.operator_id !== op || !canRead.value) return
    try {
        const result = await configuration(original.body.symbol, read.signal)
        if (!read.current() || operator.value !== op || user.token !== token) return
        if (configSymbol(result.configuration) === original.body.symbol && result.configuration.agent_id === original.agent_id) legacyActor.value = {operator_id: original.operator_id, agent_id: original.agent_id}
    } catch { /* The original pending stays intact until its own trusted identity can be confirmed. */ }
}
async function loadSite() {
    resetDetail(); const read = listGate.next(), selectedSite = siteId.value, who = JSON.stringify(actor.value), token = user.token, selectedGame = game.value, names = [...symbols.value]
    detailBatch = undefined; cache.value = {}; states.value = {}; commonSymbols.value = []; templateSymbols.value = []; directoryError.value = ''; listLoading.value = false
    if (mode.value === 'GRID' || !actor.value || !selectedSite || !canRead.value) return
    const current = () => read.current() && mode.value !== 'GRID' && canRead.value && user.token === token && siteId.value === selectedSite && game.value === selectedGame && who === JSON.stringify(actor.value)
    const requests = new Map<string, Promise<SiteConfigRead>>()
    const batch = { current, requests, read(name: string) {
        let request = requests.get(name)
        if (!request) {
            request = siteConfiguration({site_id: selectedSite, game_type: selectedGame, symbol: name}, read.signal).then(value => { assertSiteRead(value, selectedSite, name, selectedGame); return value })
            requests.set(name, request)
        }
        return request
    } }
    detailBatch = batch
    for (const name of names) states.value[name] = 'loading'
    const wanted = pending.value?.body.game_type === selectedGame && pending.value.body.site_id === selectedSite ? pending.value.body.symbol : symbol.value
    const selected = names.includes(wanted) ? wanted : names[0] ?? ''
    // Keep the original pending target recoverable even if the platform has since closed it.
    const recovering = pending.value?.body.game_type === selectedGame && pending.value.body.site_id === selectedSite && names.includes(pending.value.body.symbol)
    symbol.value = recovering ? selected : ''
    if (recovering) void loadDetail(true)
    listLoading.value = true
    const directoryTask = Promise.allSettled([
        siteDirectorySymbols(read.signal).then(value => {
            symbolDirectory([], [], value)
            if (current()) commonSymbols.value = value
        }),
        configurations(read.signal, selectedGame).then(value => {
            const platformSymbols = publicSymbols(value, selectedGame)
            if (!current()) return
            templateSymbols.value = platformSymbols
            if (!recovering) {
                const visible = names.filter(name => platformSymbols.includes(name))
                const next = visible.includes(selected) ? selected : visible[0] ?? ''
                if (symbol.value === next) void loadDetail(true); else symbol.value = next
            }
        })
    ]).then(results => {
        if (!current()) return
        if (results.some(result => result.status === 'rejected')) directoryError.value = '平台币种目录未完整加载，请重试。'
    })
    const remaining = names.filter(name => name !== selected)
    const worker = async () => {
        while (current() && remaining.length) {
            const name = remaining.shift()!
            if (states.value[name] !== 'loading') continue
            const request = batch.read(name)
            try {
                const value = await request
                if (!current() || requests.get(name) !== request) continue
                cache.value[name] = value; states.value[name] = 'configured'
            } catch (e) {
                if (!current() || requests.get(name) !== request) continue
                states.value[name] = (e as {error_code?: string})?.error_code === 'NOT_FOUND' ? 'unconfigured' : 'unavailable'
                requests.delete(name)
            }
        }
    }
    await Promise.all([directoryTask, ...Array.from({length: Math.min(3, remaining.length)}, worker)])
    if (current()) listLoading.value = false
}
async function loadDetail(reuseBatch = false) {
    resetDetail(); const read = detailGate.next(), target = {site_id: siteId.value, game_type: game.value, symbol: symbol.value}, who = JSON.stringify(actor.value), batch = detailBatch
    selectedRoom.value = '35'
    if (mode.value === 'GRID' || !canRead.value || !actor.value || !target.site_id || !symbols.value.includes(target.symbol)) return
    loading.value = true
    // Prefetched data is consumed once in this load scope. Revisits and refreshes read again.
    if (!reuseBatch) batch?.requests.delete(target.symbol)
    const request = reuseBatch && batch?.current() ? batch.read(target.symbol) : siteConfiguration(target, read.signal)
    try {
        const result = await request
        if (batch?.current() && batch.requests.get(target.symbol) === request) {
            cache.value[target.symbol] = result; states.value[target.symbol] = 'configured'
        }
        if (!read.current() || who !== JSON.stringify(actor.value) || target.site_id !== siteId.value || target.game_type !== game.value || target.symbol !== symbol.value) return
        apply(result); selectedRoom.value = rows.value[0]?.duration_seconds ?? ''
    } catch (e) {
        if (batch?.current() && batch.requests.get(target.symbol) === request) {
            states.value[target.symbol] = (e as {error_code?: string})?.error_code === 'NOT_FOUND' ? 'unconfigured' : 'unavailable'
            batch.requests.delete(target.symbol)
        }
        if (!read.current()) return
        unconfigured.value = (e as {error_code?: string})?.error_code === 'NOT_FOUND'
        states.value[target.symbol] = unconfigured.value ? 'unconfigured' : 'unavailable'; error.value = failure(e)
    } finally {
        if (read.current() && batch?.requests.get(target.symbol) === request) batch.requests.delete(target.symbol)
        if (read.current()) loading.value = false
    }
}
function enabledRooms(value: string): number | null {
    const entry = value === symbol.value ? config.value : cache.value[value]
    if (!entry) return null
    if (value === symbol.value && (game.value === 'UP_DOWN' ? rows.value.length === 5 : rows.value.length > 0)) return aggregateEnabled.value ? rows.value.filter(r => r.enabled).length : 0
    return entry.effective.rules.filter(r => r.enabled && (game.value === 'HIGH_LOW' || r.stake_tiers.some(t => !t.retired && t.enabled))).length
}
function symbolEnabled(value: string) { return value === symbol.value && config.value ? aggregateEnabled.value : cache.value[value]?.stored.enabled ?? false }
function allSwitchDisabled(value: string) { return !editable.value || states.value[value] !== 'configured' || (value !== symbol.value && dirty.value) }
function selectSymbol(value: string) {
    if (!symbols.value.includes(value)) return
    if (value !== symbol.value && (dirty.value || busy.value || pending.value)) { ElMessage.warning('请先处理当前未保存修改或待确认操作'); return }
    symbol.value = value
}
async function changeAllRooms(value: string, enabled: unknown) {
    if (typeof enabled !== 'boolean' || allSwitchDisabled(value)) return
    const who = JSON.stringify(actor.value), site = siteId.value
    if (value !== symbol.value) symbol.value = value
    const generation = selectionGeneration
    if (loading.value) {
        const request = detailBatch?.requests.get(value)
        if (request) { try { await request } catch { return } }
    }
    if (generation !== selectionGeneration || who !== JSON.stringify(actor.value) || site !== siteId.value || symbol.value !== value || !editable.value) return
    invalidate(); aggregateEnabled.value = enabled
}
function refresh() { if (actor.value && siteId.value && symbol.value) void loadDetail(); else void loadCatalog() }
async function selectMode(value: SiteGame | 'GRID') {
    if (mode.value === value) return
    if (mode.value === 'GRID' && gridRef.value && !(await gridRef.value.confirmLeave())) return
    if (mode.value !== 'GRID' && (dirty.value || pending.value || legacyPending.value)) { ElMessage.warning('请先处理当前未保存修改或待确认操作'); return }
    mode.value = value; symbolSearch.value = ''; resetDetail(); symbol.value = ''; void loadSite()
}
async function save() {
    const currentBinding = binding()
    if (!editable.value || !config.value || !actor.value || !currentBinding) return
    let body
    try { body = makeSiteBody(config.value, rows.value, aggregateEnabled.value, reason.value, siteRequestId()) }
    catch { message.value = t('predictionPages.invalidSave'); return }
    const ticket = intent.next(currentBinding)
    if (!ticket.current(binding()) || !canRead.value || !canEdit.value) return
    let original: SitePending
    try { original = persistSitePending(sessionStorage, actor.value, body); syncPending() }
    catch { storageError.value = true; return }
    await send(original)
}
function replay() { syncPending(); if (boundPending.value && canRead.value && canEdit.value && !busy.value && !storageError.value) void send(boundPending.value) }
async function send(original: SitePending) {
    const currentBinding = binding(); if (!currentBinding) return
    const ticket = intent.next(currentBinding), controller = new AbortController(); writeController = controller
    const owns = () => ticket.current(binding()) && canRead.value && canEdit.value
    busy.value = true; message.value = ''; receipt.value = null
    try {
        const result = await dispatchSitePendingWithRefresh(sessionStorage, original,
            body => saveSiteConfiguration(body, controller.signal),
            async body => {
                const latest = await siteConfiguration({site_id: body.site_id, game_type: body.game_type, symbol: body.symbol}, controller.signal)
                assertSiteRead(latest, body.site_id, body.symbol, body.game_type)
                return latest
            })
        if (!owns()) return
        syncPending()
        if (result.status === 'success') {
            receipt.value = result.value.receipt
            if (result.latest) { apply(result.latest); error.value = ''; message.value = t('predictionPages.saved') }
            else { config.value = null; rows.value = []; baselineDraft.value = ''; error.value = '已保存，刷新失败。请刷新查看当前配置。'; message.value = '已保存，刷新失败' }
        } else if (result.status !== 'superseded') message.value = t('predictionPages.' + (result.status === 'unknown' ? 'pending' : 'rejected')) + ' · ' + exact((result.error as {error_code?: string})?.error_code)
    } catch { if (owns()) { syncPending(); message.value = t('predictionPages.pending') } }
    finally { if (writeController === controller) busy.value = false }
}
async function replayLegacy() {
    syncPending(); if (!legacyPending.value || !legacyBound.value || !canRead.value || !canEdit.value || busy.value || storageError.value) return
    const original = legacyPending.value, token = user.token, generation = selectionGeneration, controller = new AbortController()
    const owns = () => generation === selectionGeneration && token === user.token && legacyBound.value && canRead.value && canEdit.value
    writeController = controller; busy.value = true
    try {
        const result = await dispatchPending(sessionStorage, original, body => saveConfiguration(body, controller.signal))
        if (!owns()) return
        syncPending(); message.value = result.status === 'success' ? '旧版原请求已确认成功。站点设置请单独查看。' : t('predictionPages.pending')
    } catch { if (owns()) { syncPending(); message.value = t('predictionPages.pending') } }
    finally { if (writeController === controller) busy.value = false }
}
function periodLabel(row: SiteRow): string {
    const seconds = game.value === 'UP_DOWN' ? BigInt(row.observation_seconds) : BigInt(row.duration_seconds)
    return game.value === 'HIGH_LOW' && seconds >= 60n && seconds % 60n === 0n ? `${seconds / 60n}分钟` : `${seconds}秒`
}
function symbolPeriods(value: string): string {
    const entry = value === symbol.value ? config.value : cache.value[value]
    return entry ? siteRows(entry).map(periodLabel).join(' · ') : ''
}
function readonlyValue(value: unknown) { return typeof value === 'string' || typeof value === 'boolean' ? exact(value) : t('predictionPages.notProvided') }
function oddsValue(key: string, value: unknown): string {
    const raw = readonlyValue(value)
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(raw)) return raw
    if (key !== 'target_payout_rate') return raw + 'x'
    const [whole, fraction = ''] = raw.split('.'), digits = whole + fraction, point = whole.length + 2
    return (point >= digits.length ? digits + '0'.repeat(point - digits.length) : digits.slice(0, point) + '.' + digits.slice(point)).replace(/^0+(?=\d)/, '') + '%'
}
const label = (key: string) => te('predictionPages.fields.' + key) ? t('predictionPages.fields.' + key) : key
watch(siteId, () => { selectionGeneration++; symbol.value = ''; void loadSite() }, {flush: 'sync'})
watch(symbol, () => { selectionGeneration++; void loadDetail(true) }, {flush: 'sync'})
watch(() => [user.userInfo.id, user.token, canRead.value, canEdit.value], () => { selectionGeneration++; invalidate(); catalogGate.close(); listGate.close(); detailGate.close(); legacyGate.close(); void loadCatalog() }, {immediate: true, flush: 'sync'})
onBeforeUnmount(() => { selectionGeneration++; invalidate(); catalogGate.close(); listGate.close(); detailGate.close(); legacyGate.close() })
</script>

<style scoped>
.prediction-config { color: var(--el-text-color-primary); }
.game-tabs { display:flex; gap:16px; margin-bottom:16px; }
.game-tabs .el-button { flex:1; min-width:0; height:auto; margin:0; padding:18px 20px; border:1px solid var(--el-border-color-lighter); border-radius:8px; background:var(--el-bg-color); text-align:left; }
.game-tabs .el-button[aria-pressed='true'] { border-color:var(--el-color-primary); background:var(--el-color-primary-light-9); color:var(--el-color-primary); }
.game-tabs :deep(.el-button > span) { display:block; white-space:normal; }
.game-tabs small { font-weight:normal; line-height:1.5; }
.symbol-directory h3 small { display:inline; margin-left:8px; }
.field-description { margin-bottom:16px; color:var(--el-text-color-secondary); font-size:12px; }
.page-heading, .config-title, .room-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
h2, h3, h4, p { margin: 0; } .page-heading { margin-bottom: 20px; } h2 { font-size: 20px; } h3 { font-size: 16px; } h4 { font-size: 14px; }
.page-heading p, .config-title p, .room-heading p { margin-top: 6px; color: var(--el-text-color-secondary); font-size: 13px; }
.config-layout { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 0; align-items: stretch; border:1px solid var(--el-border-color-lighter); border-radius:8px; overflow:hidden; background:var(--el-bg-color); }
.symbol-directory, .config-content { background: var(--el-bg-color); }
.symbol-directory { border-right:1px solid var(--el-border-color-lighter); }
.symbol-directory { padding: 16px; } .symbol-directory h3 { margin-bottom: 16px; } .symbol-list { display: grid; gap: 8px; margin-top: 16px; }
.symbol-entry { display:flex; align-items:center; border:1px solid transparent; border-radius:6px; }
.symbol-all-control { display: flex; align-items: center; flex-shrink:0; gap: 8px; padding: 0 8px 0 0; font-size: 12px; color: var(--el-text-color-secondary); }
.mixed-state { color: var(--el-color-warning); }
.game-choice { border: 1px solid var(--el-color-primary-light-5); border-radius: 8px; background: var(--el-color-primary-light-9); padding: 14px 24px; color: var(--el-color-primary); }
.symbol-option { flex:1; min-width:0; display: grid; gap: 6px; text-align: left; border: 1px solid transparent; border-radius: 6px; padding: 12px 8px; background: transparent; color: inherit; cursor: pointer; }
.symbol-option:disabled { cursor:not-allowed; opacity:.55; }
.symbol-list { max-height:max(300px, calc(100dvh - 340px)); overflow-y:auto; }
.symbol-option:not(:disabled):hover { background: var(--el-fill-color-light); } .symbol-entry.selected { border-color: var(--el-color-primary-light-5); background: var(--el-color-primary-light-9); }
.symbol-status { color: var(--el-text-color-secondary); font-size: 12px; } .draft-label { color: var(--el-color-warning); font-size: 12px; }
.config-content { min-width: 0; padding: 20px; } .config-content > p, .catalog-error { margin: 12px 0; } .catalog-error { color: var(--el-color-danger); font-size: 12px; }
.versions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px 20px; margin: 20px 0; } dt { color: var(--el-text-color-secondary); font-size: 12px; margin-bottom: 6px; } dd { margin: 0; overflow-wrap: anywhere; font-variant-numeric: tabular-nums; }
.room-tabs { display: flex; gap: 10px; margin: 20px 0 16px; flex-wrap: wrap; } .room-tabs button { border: 1px solid var(--el-border-color); border-radius: 6px; background: var(--el-bg-color); color: inherit; padding: 9px 18px; cursor: pointer; }
.room-tabs button.active { color: var(--el-color-primary); background: var(--el-color-primary-light-9); border-color: var(--el-color-primary-light-5); }
.room-heading { margin-bottom: 16px; } .room-switch { display: flex; align-items: center; gap: 10px; font-size: 13px; }
.parameter-cards { display: grid; grid-template-columns: minmax(0, 1fr); gap: 16px; } .parameter-card { border: 1px solid var(--el-border-color-lighter); border-radius: 8px; padding: 18px; min-width: 0; }
.parameter-card h4 { margin-bottom: 18px; } .parameter-card dl { margin: 0; } .parameter-card dd { margin-bottom: 0; } .parameter-card label, .read-only-label { color: var(--el-text-color-secondary); font-size: 12px; display: block; margin-bottom: 8px; }
.parameter-facts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px 24px; } .limit-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 24px; }
.config-title { flex-wrap: wrap; } .config-title-actions { display: flex; align-items: center; gap: 12px; } .read-only-label { margin-top: 14px; }
small { display: block; margin-top: 8px; color: var(--el-text-color-secondary); overflow-wrap: anywhere; } .reason { max-width: 720px; margin: 24px 0; } pre { white-space: pre-wrap; margin: 0; }
.rule-facts + .rule-facts, .receipt { border-top: 1px solid var(--el-border-color-lighter); padding-top: 20px; margin-top: 20px; }
@media(max-width:1280px) { .config-layout { grid-template-columns:250px minmax(0,1fr); } .config-content { padding:18px; } .versions { grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media(max-width:760px) { .config-layout { grid-template-columns:1fr; } .symbol-directory { border-right:0; border-bottom:1px solid var(--el-border-color-lighter); } .symbol-list { grid-template-columns:repeat(2,minmax(0,1fr)); } .game-tabs { gap:8px; } .game-tabs .el-button { padding:12px 8px; } .parameter-facts, .limit-fields { grid-template-columns:1fr; } }
</style>

