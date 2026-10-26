<template>
    <section class="prediction-page prediction-table-page mm-ui">
        <header class="prediction-page__header">
            <div class="game-tabs" role="group" aria-label="选择预测玩法">
                <el-button
                    v-for="game in games"
                    :key="game.value"
                    :type="uiMode === game.value ? 'primary' : undefined"
                    :aria-pressed="uiMode === game.value"
                    :aria-label="game.label"
                    @click="selectMode(game.value)"
                    ><svg class="game-choice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><template v-if="game.value === 'UP_DOWN'"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V8"/></template><template v-else-if="game.value === 'HIGH_LOW'"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2"/></template><template v-else><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></template></svg><span class="game-choice-content"
                        ><strong>{{ game.label }}</strong
                        ><small>{{ game.description }}</small></span
                    ></el-button
                >
            </div>
        </header>
        <div v-if="uiMode !== 'GRID' && error"><el-alert :title="error" type="error" :closable="false" /><el-button :loading="loading" @click="refresh">重试</el-button></div>
        <div v-if="uiMode !== 'GRID' && catalogError" class="catalog-error">
            <el-alert
                :title="`币种目录加载失败：${catalogError}`"
                type="warning"
                :closable="false"
            /><el-button aria-label="重试币种目录" :loading="catalogLoading" @click="loadCatalog"
                >重试币种目录</el-button
            >
        </div>
        <PredictionLoadingRegion
            v-if="uiMode !== 'GRID' && allowed"
            class="prediction-page__loading-workspace"
            :loading="workspaceLoading"
            :hide-content="workspaceLoading"
            min-height="0px"
        >
        <div class="prediction-page__workspace">
            <PredictionLoadingRegion
                as="aside"
                :loading="(loading || catalogLoading) && !workspaceLoading"
                min-height="0px"
                class="symbol-panel"
                aria-label="交易对配置列表"
            >
                <div class="symbol-panel__heading">
                    <strong>币种配置</strong><span>{{ filteredRows.length }} 条</span>
                </div>
                <MmInput
                    v-model="symbolKeyword"
                    clearable
                    placeholder="搜索交易对"
                    aria-label="搜索交易对"
                />

                <div class="symbol-panel__list">
                    <div
                        v-for="row in filteredRows"
                        :key="row.row_key"
                        class="symbol-row"
                        :class="{ 'is-active': selectedKey === row.row_key }"
                    >
                        <button
                            type="button"
                            class="symbol-choice"
                            :aria-pressed="selectedKey === row.row_key"
                            :data-config-symbol="row.symbol"
                            :disabled="!row.editable || loading || Boolean(error)"
                            @click="openEdit(row)"
                        >
                            <span class="symbol-choice__top"
                                ><symbol-display :symbol="row.symbol" />
                                <el-tag v-if="!row.configured" size="small" type="info"
                                    >待首次配置</el-tag
                                ></span
                            >
                            <span class="symbol-choice__periods" :title="periodSummary(row)">{{ periodSummary(row) }}</span>
                        </button>
                        <el-switch
                            v-if="row.configured"
                            :data-config-enabled="row.symbol"
                            :aria-label="`${row.symbol} 开放配置`"
                            :model-value="displayEnabled(row)"
                            :disabled="switchDisabled(row)"
                            :title="switchHint(row)"
                            @change="changeEnabled(row, $event)"
                        />
                        <span
                            v-if="selectedKey === row.row_key && editorState?.dirty"
                            class="symbol-row__draft"
                            >未保存</span
                        >
                    </div>
                    <el-empty
                        v-if="!loading && !catalogLoading && !error && !catalogError && !filteredRows.length"
                        description="暂无符合条件的交易对"
                        :image-size="56"
                    />
                </div>
            </PredictionLoadingRegion>
            <main class="config-content">
                <div v-if="selectedRow" class="config-content__heading">
                    <div>
                        <h2>
                            {{ selectedRow.symbol }}
                            <span class="config-game-label"> · {{ gameTypeLabel(selectedRow.game_type) }}</span>
                        </h2>
                        <p data-config-updated-at>更新时间 {{ selectedRow.updated_at }}</p>
                    </div>
                    <div v-if="hasPermission(user.perms, 'prediction_config:edit')" class="config-heading-actions">
                        <span
                            v-if="saveFeedback"
                            data-config-save-feedback
                            class="config-save-feedback"
                            :class="`config-save-feedback--${saveFeedback.tone}`"
                            role="status"
                            :title="saveFeedback.detail || undefined"
                            :aria-label="saveFeedback.detail ? `${saveFeedback.text}：${saveFeedback.detail}` : undefined"
                        >{{ saveFeedback.text }}</span>
                        <el-button
                            type="primary"
                            :loading="editorState?.saving"
                            :disabled="!editorState || editorState.saving || (!editorState.pending && !editorState.ready)"
                            @click="editRef?.saveConfig()"
                            >{{ editorState?.pending ? '核验原操作' : '保存配置' }}</el-button
                        >
                    </div>
                </div>
                <prediction-edit
                    v-if="selectedKey"
                    ref="editRef"
                    inline
                    external-save
                    @success="loadConfigurations"
                />
                <el-empty v-else-if="!loading && !catalogLoading && !error" description="请选择交易对查看配置" />
            </main>
        </div>
        </PredictionLoadingRegion>
        <grid-config v-else-if="uiMode === 'GRID'" ref="gridRef" class="grid-mode" />
    </section>
</template>

<script lang="ts" setup name="config-prediction">
import { ElButton, ElAlert, ElTag, ElSwitch, ElEmpty } from 'element-plus'

import { usePlatformConfigRuntime } from '../../../../runtime'
const { predictionConfigurationList } = usePlatformConfigRuntime().api
const { symbols: readSymbols } = usePlatformConfigRuntime().api

import { MmInput } from '../../../../ui'
import { configurationEnabled, configuredRoomDurations } from './form'
import { sortConfigSymbols } from '../../grid/config/directory'
import { computed, ref, shallowRef, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'
import PredictionEdit from './edit.vue'
import PredictionLoadingRegion from '../../prediction/components/PredictionLoadingRegion.vue'
import GridConfig from '../../grid/config/index.vue'
import { useConfigSymbol } from '../../../../runtime'
const SymbolDisplay = useConfigSymbol()
import { useConfigUser as useUserStore } from '../../../../runtime'
import { hasPermission } from '../../prediction/query'
import { timeText, errorMessage, roomLabel } from '../../prediction/format'
import type { PredictionConfiguration, PredictionGameType, PredictionProtoGameType } from './types'
interface PredictionRow {
    row_key: string
    configuration: PredictionConfiguration | null
    directory_label?: string
    game_type: PredictionGameType | null
    symbol: string
    enabled: boolean
    configured: boolean
    editable: boolean
    rule_count: number
    template_version: string
    effective_version: string
    updated_at: string
}

const user = useUserStore(),
    error = ref('')
const loading = ref(false)
const configurations = ref<PredictionConfiguration[]>([])
type UiMode = PredictionGameType | 'GRID'
const gameTypeFilter = ref<PredictionGameType>('UP_DOWN')
const uiMode = ref<UiMode>('UP_DOWN')
const gridRef = shallowRef<InstanceType<typeof GridConfig>>()
const games: { value: UiMode; label: string; description: string }[] = [
    {
        value: 'UP_DOWN',
        label: '涨跌预测',
        description: '按系统场次预测结算价格相对开盘价格上涨或下跌'
    },
    {
        value: 'HIGH_LOW',
        label: '自选预测',
        description: '用户随时发起独立订单，自选方向及预测周期'
    },
    {
        value: 'GRID',
        label: '预测网格',
        description: '纵轴为价格区间、横轴为时间区间，一格生成一笔订单'
    }
]
const selectedKey = ref('')
const allowed = computed(() => hasPermission(user.perms, 'prediction_config:lists'))
const symbolKeyword = ref('')
const editRef = shallowRef<InstanceType<typeof PredictionEdit>>()
const editorState = computed(() => editRef.value?.editingState)
const saveFeedback = computed(() => {
    const state = editorState.value
    if (!state || state.target !== selectedKey.value || state.actor !== String(user.userInfo.id || '') ||
        !allowed.value || !hasPermission(user.perms, 'prediction_config:edit') || state.saving) return null
    if (state.pending) return {text: '未保存', tone: 'warning', detail: state.saveError || '结果尚未确认，请核验原操作'}
    if (state.saveError) return {text: '保存失败', tone: 'danger', detail: state.saveError}
    if (!state.ready) return null
    return state.dirty || state.isNew
        ? {text: '未保存', tone: 'warning', detail: ''}
        : {text: '已保存', tone: 'success', detail: ''}
})
let selectionSequence = 0
const displayEnabled = (row: PredictionRow) =>
    selectedKey.value === row.row_key && editorState.value?.target === row.row_key
        ? (editorState.value.enabled ?? row.enabled)
        : row.enabled
function switchHint(row: PredictionRow) {
    if (!hasPermission(user.perms, 'prediction_config:edit')) return '没有配置修改权限'
    if (editorState.value?.pending) return '请先核验待确认的操作'
    if (loading.value || editorState.value?.loading) return '正在加载配置'
    if (selectedKey.value !== row.row_key && editorState.value?.dirty)
        return '请先处理当前未保存修改'
    if (selectedKey.value === row.row_key && !editorState.value?.ready) return '请重新加载当前配置'
    return '修改后需保存配置'
}
function switchDisabled(row: PredictionRow) {
    const state = editorState.value
    return (
        !allowed.value ||
        !hasPermission(user.perms, 'prediction_config:edit') ||
        !row.editable ||
        loading.value ||
        !state ||
        state.loading ||
        state.pending ||
        (selectedKey.value === row.row_key
            ? !state.ready || state.target !== row.row_key
            : state.dirty)
    )
}
async function changeEnabled(row: PredictionRow, value: string | number | boolean) {
    if (typeof value !== 'boolean' || switchDisabled(row)) return
    const actor = String(user.userInfo.id || '')
    let generation = editorState.value?.generation
    if (selectedKey.value !== row.row_key) {
        const opened = await openEdit(row)
        // The persistent WritePanel must first restore this target's original pending operation.
        await nextTick()
        if (!opened || opened.selection !== selectionSequence) return
        generation = opened.detail
    }
    if (generation === undefined || selectedKey.value !== row.row_key || switchDisabled(row)) return
    editRef.value?.setEnabled(row.row_key, generation, actor, value)
}

const gameTypeFromProto = (value?: PredictionProtoGameType): PredictionGameType | null => {
    if (value === 'GAME_TYPE_UP_DOWN') return 'UP_DOWN'
    if (value === 'GAME_TYPE_HIGH_LOW') return 'HIGH_LOW'
    return null
}
const gameTypeLabel = (value: PredictionGameType | null) =>
    value === 'UP_DOWN' ? '涨跌预测' : value === 'HIGH_LOW' ? '自选预测' : '--'
const formatUpdatedAt = timeText
const configuredRows = computed<PredictionRow[]>(() =>
    configurations.value
        .map((configuration, index) => {
            const firstRule = configuration.rules[0]
            const gameType = gameTypeFromProto(firstRule?.game_type) || gameTypeFilter.value || null
            const symbol = firstRule?.symbol || ''
            return {
                row_key: gameType && symbol ? `${gameType}:${symbol}` : `empty:${index}`,
                configuration,
                game_type: gameType,
                symbol,
                enabled: configurationEnabled(configuration),
                configured: configuration.rules.length > 0,
                editable: Boolean(gameType && symbol && configuration.rules.length > 0),
                rule_count: configuration.rules.length,
                template_version: configuration.template_version,
                effective_version: configuration.effective_version,
                updated_at: formatUpdatedAt(configuration.updated_at_ms)
            }
        })
        .sort((left, right) =>
            left.game_type === right.game_type
                ? left.symbol.localeCompare(right.symbol)
                : (left.game_type || '').localeCompare(right.game_type || '')
        )
)
function periodSummary(row: PredictionRow) {
    const durations = row.row_key === editorState.value?.target && editorState.value?.ready
        ? editorState.value.roomDurations : row.configuration ? configuredRoomDurations(row.configuration) : undefined
    return durations ? (durations.map(duration => roomLabel(duration, row.game_type || undefined)).join(' · ') || '暂无房间') : row.directory_label
}
type SymbolDirectoryRow = { symbol: string; base_asset: string; quote_asset: string }
const directory = ref<SymbolDirectoryRow[]>([]),
    catalogLoading = ref(false),
    catalogError = ref('')
const canonicalSymbol = (value: string) => value.trim().toUpperCase()
let catalogSequence = 0,
    catalogController: AbortController | undefined
async function loadCatalog() {
    if (!allowed.value) return
    catalogController?.abort()
    catalogController = new AbortController()
    const seq = ++catalogSequence
    catalogLoading.value = true
    catalogError.value = ''
    try {
        const data = await readSymbols(catalogController.signal)
        if (seq !== catalogSequence) return
        if (!Array.isArray(data)) throw Error('币种目录返回格式不正确')
        const unique = new Map<string, SymbolDirectoryRow>()
        for (const item of data) {
            if (typeof item !== 'string') throw Error('币种目录返回格式不正确')
            const row = {symbol:item,base_asset:'',quote_asset:''}
            if (typeof row.symbol !== 'string' || !row.symbol.trim()) continue
            const symbol = canonicalSymbol(row.symbol)
            if (!unique.has(symbol))
                unique.set(symbol, {
                    symbol,
                    base_asset: typeof row.base_asset === 'string' ? row.base_asset : '',
                    quote_asset: typeof row.quote_asset === 'string' ? row.quote_asset : ''
                })
        }
        directory.value = [...unique.values()]
    } catch (e) {
        if (seq === catalogSequence) catalogError.value = errorMessage(e)
    } finally {
        if (seq === catalogSequence) catalogLoading.value = false
    }
}
const rows = computed<PredictionRow[]>(() => {
    const result = [...configuredRows.value]
    const existing = new Set(
        result
            .filter((row) => row.game_type === gameTypeFilter.value)
            .map((row) => canonicalSymbol(row.symbol))
    )
    for (const item of directory.value) {
        if (existing.has(item.symbol)) continue
        result.push({
            row_key: `${gameTypeFilter.value}:${item.symbol}`,
            configuration: null,
            game_type: gameTypeFilter.value,
            symbol: item.symbol,
            enabled: false,
            configured: false,
            editable: hasPermission(user.perms, 'prediction_config:edit') && !catalogError.value,
            rule_count: 0,
            template_version: '未配置',
            effective_version: '未配置',
            updated_at: '未提供',
            directory_label:
                [item.base_asset, item.quote_asset].filter(Boolean).join(' / ') || '点击填写配置'
        })
    }
    return sortConfigSymbols(result, directory.value.map(item=>item.symbol))
})
const filteredRows = computed(() => {
    const keyword = symbolKeyword.value.trim().toUpperCase()
    return rows.value.filter(
        (row) =>
            (!gameTypeFilter.value || row.game_type === gameTypeFilter.value) &&
            (!keyword || row.symbol.includes(keyword))
    )
})

const selectedRow = computed(() => rows.value.find((row) => row.row_key === selectedKey.value))
const workspaceLoading = computed(() => (loading.value || catalogLoading.value) && !selectedRow.value)
let sequence = 0,
    controller: AbortController | undefined
const loadConfigurations = async () => {
    if (!hasPermission(user.perms, 'prediction_config:lists')) {
        error.value = '没有玩法配置查询权限'
        return
    }
    error.value = ''
    controller?.abort()
    controller = new AbortController()
    const seq = ++sequence
    const requestActor = String(user.userInfo.id || '')
    loading.value = true
    try {
        const response = await predictionConfigurationList(
            {
                game_type: gameTypeFilter.value || undefined
            },
            controller.signal
        )
        if (seq !== sequence || requestActor !== String(user.userInfo.id || '') || !allowed.value) return
        if (!Array.isArray(response.configurations)) throw Error('配置列表格式异常，请重新加载')
        configurations.value = response.configurations
        if (!rows.value.some((row) => row.row_key === selectedKey.value && row.editable)) {
            const first = rows.value.find(
                (row) => row.configured && row.editable && row.game_type === gameTypeFilter.value
            )
            if (first) await openEdit(first, true)
            else selectedKey.value = ''
        }
    } catch (e) {
        if (seq === sequence) {
            error.value = errorMessage(e)
            configurations.value = []
        }
    } finally {
        if (seq === sequence) loading.value = false
    }
}
const selectMode = async (value: UiMode) => {
    if (uiMode.value === value) return
    if (uiMode.value === 'GRID' && gridRef.value && !(await gridRef.value.confirmLeave())) return
    if (uiMode.value !== 'GRID' && (editorState.value?.dirty || editorState.value?.pending)) {
        ElMessage.warning('请先处理当前未保存修改或待确认操作')
        return
    }
    selectionSequence++
    uiMode.value = value
    if (value === 'GRID') {
        selectedKey.value = ''
        return
    }
    gameTypeFilter.value = value
    selectedKey.value = ''
    symbolKeyword.value = ''
    configurations.value = []
    void loadConfigurations()
    if (!directory.value.length) void loadCatalog()
}
const openEdit = async (row: PredictionRow, useListSnapshot = false) => {
    if (editorState.value?.saving) {
        ElMessage.warning('请先处理当前未保存修改或待确认操作')
        return
    }
    const selectionActor = String(user.userInfo.id || '')
    const selection = ++selectionSequence
    if (
        !allowed.value ||
        !row.editable ||
        (loading.value && !useListSnapshot) || Boolean(error.value) ||
        !row.game_type ||
        !row.symbol ||
        selectedKey.value === row.row_key
    )
        return
    selectedKey.value = row.row_key
    await nextTick()
    if (selection !== selectionSequence || selectedKey.value !== row.row_key || selectionActor !== String(user.userInfo.id || '') || !allowed.value) return
    const detail = await editRef.value?.open(row.game_type, row.symbol, useListSnapshot ? row.configuration ?? undefined : undefined, !row.configured)
    return { selection, detail }
}

const refresh = () => {
    if (uiMode.value === 'GRID') {
        void gridRef.value?.refresh()
        return
    }
    selectionSequence++
    void loadConfigurations()
    void loadCatalog()
}
watch(
    () => [user.userInfo.id, allowed.value, hasPermission(user.perms, 'prediction_config:edit')],
    () => { selectionSequence++; sequence++; controller?.abort(); loading.value = false },
    { flush: 'sync' }
)
onMounted(refresh)
onBeforeUnmount(() => {
    selectionSequence++
    sequence++
    controller?.abort()
    catalogSequence++
    catalogController?.abort()
})
</script>

<style scoped>
.prediction-page {
    box-sizing: border-box;
    font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    font-size:12px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--navbar-height, 54px) - 24px);
    height: calc(100dvh - var(--navbar-height, 54px) - 24px);
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    gap: 6px;
    background: transparent;
}
.prediction-page__header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-bg-color);
}
.game-tabs {
    display: flex;
    gap: 0;
    flex: 1;
}
.game-tabs .el-button + .el-button {
    margin-left: 0;
}
.prediction-page__loading-workspace {
    flex: 1;
    min-height: 0;
}
.prediction-page__workspace {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-bg-color);
    min-height: 0;
    flex: 1;
}
.symbol-panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding: 16px 12px;
    border-right: 1px solid var(--el-border-color-lighter);
}
.symbol-panel__count {
    padding: 10px 4px;
    font-size: 12px;
    color: var(--el-text-color-secondary);
}
.symbol-panel__list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: grid;
    align-content: start;
    gap: 6px;
}
.symbol-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 0 6px;
    padding: 6px 4px;
    border: 1px solid transparent;
    border-radius: 6px;
}
.symbol-row__draft {
    grid-column: 1 / -1;
    color: var(--el-color-warning);
    font-size: 11px;
    margin-top: 5px;
}
.symbol-choice {
    display: grid;
    gap: 2px;
    min-width:0;
    position:relative;
    width: 100%;
    min-height:40px;
    padding: 2px 0 2px 38px;
    text-align: left;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--el-text-color-secondary);
    background: transparent;
    font-size: 12px;
    cursor: pointer;
}
.symbol-row:hover {
    background: var(--el-fill-color-light);
}
.symbol-row.is-active {
    border-color: var(--el-color-primary-light-5);
    background: var(--el-color-primary-light-9);
}
.symbol-choice:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
.symbol-choice__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}
.symbol-choice strong {
    color: var(--el-text-color-primary);
    font-size: 13px;
    font-weight:700;
}
.config-content {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
}
.config-content__heading {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
}
.config-heading-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
}
.config-save-feedback {
    font-size: 12px;
    white-space: nowrap;
}
.config-save-feedback--success { color: var(--el-color-success); }
.config-save-feedback--warning { color: var(--el-color-warning); }
.config-save-feedback--danger { color: var(--el-color-danger); }
.config-content > :deep(.prediction-edit-inline) {
    flex: 1;
    min-height: 0;
    overflow: auto;
}
.symbol-panel__heading,
.symbol-panel :deep(.mm-input) {
    flex-shrink: 0;
}
.config-content__heading h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    line-height:22px;
}
.config-content__heading h2 span {
    font:inherit;
    color:inherit;
}
.config-content__heading p {
    margin: 4px 0 0;
    font-size: 10px;
    line-height:14px;
    color: var(--el-text-color-secondary);
}
.config-content__versions {
    margin-left: auto;
    display: grid;
    gap: 4px;
    font-size: 11px;
    color: var(--el-text-color-secondary);
    overflow-wrap: anywhere;
    font-variant-numeric: tabular-nums;
}
@media (max-width: 1150px) {
    .prediction-page__workspace {
        grid-template-columns: 300px minmax(0, 1fr);
    }
}
@media (max-width: 700px) {
    .prediction-page__workspace {
        grid-template-columns: 1fr;
        grid-template-rows: minmax(0, 30%) minmax(0, 1fr);
    }
    .symbol-panel {
        border-right: 0;
        border-bottom: 1px solid var(--el-border-color-lighter);
    }
    .symbol-panel__list {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
.game-tabs .el-button {
    height:72px;
    flex: 1;
    min-width:0;
    margin: 0;
    padding:12px 16px;
    justify-content: flex-start;
    text-align: left;
    border: 0;
    border-radius: 0;
    border-bottom: 3px solid transparent;
    background: transparent;
    color: var(--el-text-color-primary);
}
.game-tabs .el-button[aria-pressed='true'] {
    border-bottom-color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}
.game-choice-content {
    display: grid;
    gap: 5px;
    white-space: normal;
}
.game-choice-content strong {
    font-size: 13px;
    font-weight:700;
}
.game-choice-content small {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    line-height: 1.5;
    font-weight: 400;
}
.prediction-page__header > .el-button {
    margin: 0 16px;
}
.symbol-panel__heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    font-size: 12px;
}
.symbol-panel__heading span {
    color: var(--el-text-color-secondary);
}
.symbol-panel__list {
    margin-top: 10px;
}
.symbol-choice__periods {
    display:block; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    font-size: 11px;
    line-height: 1.5;
}
@media (max-width: 1150px) {
    .config-content__heading {
        padding: 14px;
    }
}
.catalog-error {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 10px 14px;
}
.catalog-error .el-alert {
    flex: 1;
}
.symbol-panel :deep(.symbol-display__name) {
    color: var(--el-text-color-primary);
    font-weight: 600;
}
.grid-mode {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    padding:0;
}
.symbol-panel :deep(.symbol-display__icon), .symbol-panel :deep(.symbol-display__placeholder) { position:absolute; left:0; top:50%; transform:translateY(-50%); width:30px; height:30px; }
.symbol-row :deep(.el-switch) { flex-shrink:0; --el-switch-height:18px; --el-switch-button-size:14px; --el-switch-width:32px; }
.symbol-row :deep(.el-switch__core) { min-width:32px; }
.config-content__heading :deep(.el-button--primary) { height:34px; padding:0 13px; font-size:11px; font-weight:700; border-radius:7px; }
.game-choice-icon { flex:none; width:20px; height:20px; margin-right:12px; }
.game-tabs :deep(.el-button > span) { display:flex; align-items:center; min-width:0; }
.game-choice-content { display:block; min-width:0; }
.game-choice-content strong { display:block; }

.prediction-page :deep(button), .prediction-page :deep(input) { font-family:inherit; }
</style>

