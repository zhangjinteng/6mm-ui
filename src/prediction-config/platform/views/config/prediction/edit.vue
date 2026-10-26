<template>
    <component
        :is="inline ? 'section' : ElDrawer"
        v-if="!inline || visible"
        class="mm-ui"
        :class="{ 'prediction-edit-inline': inline }"
        v-model="visible"
        :close-on-click-modal="false"
        destroy-on-close
        size="min(1080px,96vw)"
        title="玩法配置"
        @closed="emit('close')"
    >
        <el-alert v-if="error" :title="error" type="error" :closable="false" />
        <PredictionLoadingRegion :loading="loading" :hide-content="loading && !model" :min-height="inline ? '0px' : '280px'" class="prediction-edit">
            <div ref="saveArea" data-config-save-area class="config-save-area" :class="{ 'config-save-area--external': externalSave }">
                <write-panel
                    ref="writeRef"
                    :hide-button="externalSave"
                    :hide-success="externalSave"
                    :hide-pending-details="externalSave"
                    :hide-error="externalSave"
                    v-if="visible && editable"
                    action="config.save"
                    :target="target"
                    permission="prediction_config:edit"
                    label="保存配置"
                    automatic-reason="通过总后台玩法配置页面保存配置"
                    :disabled="loading || !editingState.ready"
                    :payload="payload"
                    :send="send"
                    @pending="pending = $event"
                    @busy="saving = $event"
                    @success="saved"
                />
            </div>
            <template v-if="model">
                <el-alert v-if="model.is_new" title="首次配置需填写全部五个周期的必填参数；保存后币种保持关闭。" type="info" :closable="false" />
                <el-card shadow="never" class="room-config">
                    <template #header
                        ><div class="group-heading">
                            <div>
                                <h3>
                                    {{ model.game_type === 'UP_DOWN' ? '房间配置' : '周期配置' }}
                                </h3>
                                <p>
                                    {{ model.symbol }} ·
                                    {{ model.game_type === 'UP_DOWN' ? '涨跌预测' : '自选预测' }}
                                </p>
                            </div>
                            <el-switch
                                v-if="!inline"
                                v-model="model.enabled"
                                :disabled="!editable || pending || model.is_new"
                                active-text="开放"
                                inactive-text="停用"
                            /></div
                    ></template>
                    <div class="field-caption">
                        {{ model.game_type === 'UP_DOWN' ? '支持房间' : '支持周期' }}
                    </div>
                    <FixedRoomControls :description="`${model.symbol} · ${model.game_type === 'UP_DOWN' ? '涨跌预测' : '自选预测'}`" :rooms="roomChoices" :selected="selectedRule?.duration_seconds || ''" :disabled="!editable || !editingState.ready || pending || saving" :context="`${actor}:${target}:${sequence}`" @select="selectRoom" @change="changeRoom" />
                </el-card>
                <el-card shadow="never" class="config-group">
                    <template #header><div class="group-heading"><div><h3>价格精度</h3><p>同一币种全部周期共用，变更只影响后续新场次或订单。</p></div></div></template>
                    <el-form label-position="top"><div class="odds-fields">
                        <el-form-item label="价格小数位">
                            <DecimalInput :input-component="MmInput" v-model="priceDecimalsInput" min="0" max="8" step="1" unit="位" inputmode="numeric" placeholder="请输入 0～8 的整数" aria-label="价格小数位" :disabled="!editable || !editingState.ready || pending || saving" />
                        </el-form-item>
                    </div></el-form>
                    <p class="group-note">可设置 0～8 位，未配置时默认填入 3 位，保存后生效。按所选位数截断，不四舍五入；0 表示整数，旧订单保留原规则。</p>
                </el-card>
                <el-form label-position="top" :disabled="!editable || pending">
                    <section
                        v-for="(rule, index) in visibleRules"
                        :key="rule.market_id || index"
                        class="rule"
                        :data-room="rule.duration_seconds"
                    >
                        <div v-if="!inline" class="rule-heading">
                            <strong
                                >{{ roomLabel(rule.duration_seconds, model.game_type)
                                }}{{ model.game_type === 'UP_DOWN' ? '房间' : '' }}</strong
                            >
                        </div>
                        <el-card
                            v-if="model.game_type === 'UP_DOWN'"
                            shadow="never"
                            class="config-group round-time-summary"
                        >
                            <template #header
                                ><div class="group-heading">
                                    <div>
                                        <h3>
                                            场次时间 ·
                                            {{
                                                roomLabel(rule.duration_seconds, model.game_type)
                                            }}房间
                                        </h3>
                                        <p>每个场次的下注开放时间固定为 30 秒</p>
                                    </div>
                                    <el-tag size="small">{{
                                        roomLabel(rule.duration_seconds, model.game_type)
                                    }}</el-tag>
                                </div></template
                            >
                        </el-card>
                        <el-card shadow="never" class="config-group">
                            <template #header
                                ><div class="group-heading">
                                    <div>
                                        <h3>
                                            赔率配置 ·
                                            {{ roomLabel(rule.duration_seconds, model.game_type) }}
                                        </h3>
                                        <p>
                                            {{
                                                model.game_type === 'UP_DOWN'
                                                    ? '上涨赔率 = 1 + 目标返奖率 × 下跌池 ÷（上涨池＋本次下注）；下跌赔率反向计算。下注期间为预计倍率，封盘后锁定最终倍率。'
                                                    : '用户下单时按当前周期固定赔率锁定，订单存储赔率快照'
                                            }}
                                        </p>
                                    </div>
                                    <el-tag size="small" effect="plain">{{
                                        model.game_type === 'UP_DOWN' ? '动态赔率' : '固定赔率'
                                    }}</el-tag>
                                </div></template
                            >
                            <div
                                class="odds-fields"
                                :class="{ 'one-field': model.game_type === 'HIGH_LOW' }"
                            >
                                <constraint-editor
                                    v-if="model.game_type === 'HIGH_LOW' && rule.fixed_odds"
                                    v-model="rule.fixed_odds"
                                    compact
                                    unit="x"
                                    title="固定赔率"
                                    description="上涨和下跌使用相同赔率，且必须小于 2"
                                />
                                <template v-if="model.game_type === 'UP_DOWN'">
                                    <constraint-editor
                                        v-if="rule.target_payout_rate"
                                        v-model="rule.target_payout_rate"
                                        compact
                                        agent-locked
                                        percentage
                                        title="目标返奖率"
                                        description="例如 90%：按对方资金池的 90% 计算可分配收益，且必须小于 100%"
                                    />
                                    <constraint-editor
                                        v-if="rule.maximum_odds"
                                        v-model="rule.maximum_odds"
                                        compact
                                        agent-locked
                                        unit="x"
                                        title="最高赔率"
                                        description="最终结算倍率不高于此值"
                                    />
                                </template>
                            </div>
                        </el-card>
                        <el-card shadow="never" class="config-group">
                            <template #header
                                ><div class="group-heading">
                                    <div>
                                        <h3>
                                            下注限制 ·
                                            {{ roomLabel(rule.duration_seconds, model.game_type) }}
                                        </h3>
                                        <p>
                                            {{ model.symbol }} 当前{{
                                                model.game_type === 'UP_DOWN' ? '房间' : '周期'
                                            }}的单笔下注范围
                                        </p>
                                    </div>
                                    <el-tag size="small">{{
                                        roomLabel(rule.duration_seconds, model.game_type)
                                    }}</el-tag>
                                </div></template
                            >
                            <div class="two-fields">
                                <el-form-item label="单笔最小额（USDT）">
                                    <template #label>单笔最小额（USDT）<ParameterHelp label="单笔最小额" content="此房间允许的最低单笔下注额。商户可在总后台单笔范围内调整自己的最小额和最大额。" /></template>
                                    <DecimalInput :input-component="MmInput" aria-label="单笔最小额" unit="USDT" :model-value="rule.minimum_stake.default_value" @update:model-value="updatePlatformStake(rule, 'minimum_stake', $event)" />
                                </el-form-item>
                                <el-form-item label="单笔最大额（USDT）">
                                    <template #label>单笔最大额（USDT）<ParameterHelp label="单笔最大额" content="此房间允许的最高单笔下注额。修改生效后，对应房间的商户限额重置为总后台范围。" /></template>
                                    <DecimalInput :input-component="MmInput" aria-label="单笔最大额" unit="USDT" :model-value="rule.maximum_stake.default_value" @update:model-value="updatePlatformStake(rule, 'maximum_stake', $event)" />
                                </el-form-item>
                            </div>
                        </el-card>
                    </section>
                </el-form>
            </template>

        </PredictionLoadingRegion>
        <div v-if="error || !inline || editingState.dirty" class="editor-footer">
            <el-button v-if="editingState.dirty" :data-config-discard="true" :disabled="loading || pending || saving" @click="discardChanges">放弃修改并重新加载</el-button>
            <el-button v-if="error" :disabled="loading" @click="reload">重试</el-button>
            <el-button v-if="!inline" @click="visible = false">关闭</el-button>
        </div>
    </component>
</template>
<script setup lang="ts">
import { ElAlert, ElCard, ElSwitch, ElForm, ElFormItem, ElTag, ElButton, ElDrawer } from 'element-plus'

import { usePlatformConfigRuntime } from '../../../../runtime'
const { predictionConfigurationDetail, predictionConfigurationList, predictionConfigurationSave } = usePlatformConfigRuntime().api

import { computed, ref, toRaw, watch, onBeforeUnmount } from 'vue'
import { createInitialModel, creationSnapshot } from './creation'
import { useConfigUser as useUserStore } from '../../../../runtime'
import WritePanel from '../../prediction/components/WritePanel.vue'
import PredictionLoadingRegion from '../../prediction/components/PredictionLoadingRegion.vue'
import { roomLabel, errorMessage } from '../../prediction/format'
import { hasPermission } from '../../prediction/query'
import ParameterHelp from '../../prediction/components/ParameterHelp.vue'
import ConstraintEditor from './constraint-editor.vue'
import { MmInput } from '../../../../ui'
import DecimalInput from '../../prediction/components/DecimalInput.vue'
import FixedRoomControls from '../../prediction/components/FixedRoomControls.vue'
import {
    updatePlatformStake,
    createEditModel,
    createSavePayload,
    validatePredictionModel,
    summarizePredictionValidationErrors,
    FIXED_DURATIONS
} from './form'
import type {
    PredictionEditModel,
    PredictionGameType,
    PlatformRuleInput,
    SavePredictionConfigurationPayload,
    PredictionConfiguration
} from './types'
const props = withDefaults(defineProps<{ inline?: boolean; externalSave?: boolean }>(), { inline: false, externalSave: false })
const selectedRule = ref<PlatformRuleInput>()
const writeRef = ref<InstanceType<typeof WritePanel>>()
const saving = ref(false)
const saveArea = ref<HTMLElement>()
function saveConfig() { void writeRef.value?.submit() }
function focusSave() {
    saveArea.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const emit = defineEmits(['success', 'close']),
    user = useUserStore(),
    visible = ref(false),
    loading = ref(false),
    error = ref(''),
    model = ref<PredictionEditModel>(),
    pending = ref(false)
const editable = computed(() => hasPermission(user.perms, 'prediction_config:edit')),
    target = ref(''),
    game = ref<PredictionGameType>('UP_DOWN'),
    symbol = ref('')
const priceDecimals = computed<number | undefined>({
    get: () => model.value?.rules[0]?.price_rule.price_decimals ?? undefined,
    set: value => {
        if (!model.value || !editable.value || !editingState.value.ready || pending.value || saving.value) return
        for (const rule of model.value.rules) rule.price_rule.price_decimals = value ?? null
    }
})
const priceDecimalsText = ref('')
watch(priceDecimals, value => {
    if (!Number.isNaN(value)) priceDecimalsText.value = value == null ? '' : String(value)
}, { immediate: true, flush: 'sync' })
const priceDecimalsInput = computed<string>({
    get: () => priceDecimalsText.value,
    set: value => {
        if (!model.value || !editable.value || !editingState.value.ready || pending.value || saving.value) return
        priceDecimalsText.value = value
        priceDecimals.value = value === '' ? undefined : /^[0-8]$/.test(value) ? Number(value) : Number.NaN
    }
})
const creating = ref(false)
const sortedRules = computed(() =>
    model.value?.game_type === 'UP_DOWN'
        ? [...model.value.rules].sort(
              (a, b) =>
                  FIXED_DURATIONS.indexOf(a.duration_seconds as (typeof FIXED_DURATIONS)[number]) -
                  FIXED_DURATIONS.indexOf(b.duration_seconds as (typeof FIXED_DURATIONS)[number])
          )
        : (model.value?.rules ?? [])
)
const presentRules = computed(() => sortedRules.value.filter(rule => rule.enabled_by_default))
const roomChoices = computed(() => sortedRules.value.map(rule => ({ key: rule.duration_seconds, label: roomLabel(rule.duration_seconds, model.value?.game_type), present: rule.enabled_by_default, allowed: true })))
const visibleRules = computed(() => props.inline ? (selectedRule.value?.enabled_by_default ? [selectedRule.value] : []) : presentRules.value)
function selectRoom(key: string) { selectedRule.value = presentRules.value.find(rule => rule.duration_seconds === key) }
function changeRoom(key: string, present: boolean) {
    if (!editable.value || !editingState.value.ready || pending.value || saving.value) return
    const rule = sortedRules.value.find(rule => rule.duration_seconds === key)
    if (!rule || rule.enabled_by_default === present) return
    rule.enabled_by_default = present
    selectedRule.value = present ? rule : presentRules.value[0]
}
const sequence = ref(0),
    loadedGeneration = ref(0),
    loadedActor = ref(''),
    baseline = ref('')
let controller: AbortController | undefined
const actor = computed(() => String(user.userInfo.id || ''))
const editingState = computed(() => ({
    target: target.value,
    generation: sequence.value,
    actor: loadedActor.value,
    enabled: model.value?.enabled,
    roomDurations: presentRules.value.map(rule => rule.duration_seconds),
    loading: loading.value,
    pending: pending.value,
    saving: saving.value,
    saveError: writeRef.value?.error || '',
    isNew: Boolean(model.value?.is_new),
    dirty: Boolean(model.value && baseline.value && JSON.stringify(model.value) !== baseline.value),
    ready: Boolean(
        model.value &&
            !loading.value &&
            !error.value &&
            loadedGeneration.value === sequence.value &&
            loadedActor.value === actor.value &&
            `${model.value.game_type}:${model.value.symbol}` === target.value
    )
}))
watch(model, () => {
    if (props.externalSave && !loading.value) writeRef.value?.clearFeedback()
}, { deep: true, flush: 'sync' })
function setEnabled(
    expectedTarget: string,
    generation: number,
    expectedActor: string,
    value: boolean
) {
    if (
        typeof value !== 'boolean' ||
        !model.value ||
        model.value.is_new ||
        !editingState.value.ready ||
        !editable.value ||
        !hasPermission(user.perms, 'prediction_config:lists') ||
        (pending.value || saving.value) ||
        expectedTarget !== target.value ||
        generation !== sequence.value ||
        expectedActor !== actor.value
    )
        return false
    model.value.enabled = value
    return true
}
watch(
    () => [actor.value, hasPermission(user.perms, 'prediction_config:lists'), editable.value],
    () => {
        sequence.value++
        controller?.abort()
        loading.value = false
    },
    { flush: 'sync' }
)
function applyConfiguration(configuration: PredictionConfiguration, generation: number) {
    if (
        !configuration.rules.length ||
        configuration.rules.some(
            (rule) =>
                rule.game_type !== `GAME_TYPE_${game.value}` ||
                rule.symbol !== symbol.value
        )
    )
        throw Error('返回配置与当前币种或玩法不匹配，请重新加载')
    const duration = selectedRule.value?.duration_seconds
    model.value = createEditModel(configuration)
    creating.value = false
    baseline.value = JSON.stringify(model.value)
    loadedGeneration.value = generation
    loadedActor.value = actor.value
    selectedRule.value =
        presentRules.value.find((rule) => rule.duration_seconds === duration) ||
        presentRules.value[0]
}
async function reload() {
    if (!hasPermission(user.perms, 'prediction_config:lists')) return
    controller?.abort()
    controller = new AbortController()
    const seq = ++sequence.value,
        requestGame = game.value,
        requestSymbol = symbol.value
    loading.value = true
    error.value = ''
    try {
        if (creating.value) {
            if (!editable.value) throw Error('没有配置新增权限')
            const response = await predictionConfigurationList({}, controller.signal)
            if (seq !== sequence.value) return
            const snapshot = creationSnapshot(response, requestGame, requestSymbol)
            if (snapshot.existing) applyConfiguration(snapshot.existing, seq)
            else {
                model.value = createInitialModel(requestGame, requestSymbol, snapshot.version)
                baseline.value = JSON.stringify(model.value)
                loadedGeneration.value = seq
                loadedActor.value = actor.value
                selectedRule.value = presentRules.value[0]
            }
            return seq
        }
        const response = await predictionConfigurationDetail(
            { game_type: requestGame, symbol: requestSymbol },
            controller.signal
        )
        if (seq === sequence.value) {
            applyConfiguration(response.configuration, seq)
            return seq
        }
    } catch (e) {
        if (seq === sequence.value) error.value = errorMessage(e)
    } finally {
        if (seq === sequence.value) loading.value = false
    }
}
async function open(value: PredictionGameType, pair: string, initial?: PredictionConfiguration, create = false) {
    game.value = value
    symbol.value = pair
    target.value = `${value}:${pair}`
    creating.value = create
    model.value = undefined
    baseline.value = ''
    selectedRule.value = undefined
    pending.value = false
    visible.value = true
    if (initial && hasPermission(user.perms, 'prediction_config:lists')) {
        controller?.abort()
        const generation = ++sequence.value
        loading.value = false
        error.value = ''
        try { applyConfiguration(initial, generation); return generation }
        catch (e) { error.value = errorMessage(e); return }
    }
    return await reload()
}
function payload() {
    if (!model.value) throw Error('请先加载配置')
    const errors = validatePredictionModel(toRaw(model.value))
    if (errors.length) throw Error(summarizePredictionValidationErrors(errors, model.value.game_type, selectedRule.value?.duration_seconds || model.value.rules[0]?.duration_seconds || ''))
    const { client_request_id, reason, ...body } = createSavePayload(toRaw(model.value), '', '')
    return body
}
const send = (body: Record<string, unknown>) =>
    predictionConfigurationSave(body as unknown as SavePredictionConfigurationPayload)
function saved() {
    creating.value = false
    emit('success')
    void reload()
}
async function discardChanges() {
    if (loading.value || pending.value || saving.value) return
    await reload()
}
onBeforeUnmount(() => {
    sequence.value++
    controller?.abort()
})
defineExpose({ open, focusSave, saveConfig, editingState, setEnabled })
</script>
<style scoped>
.prediction-edit {
    display: grid;
    gap: 14px;
}
.prediction-edit-inline {
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.prediction-edit-inline > .prediction-edit {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}
.prediction-edit-inline > .prediction-edit > :deep(.prediction-loading-region__content) {
    box-sizing: border-box;
    overflow: auto;
    padding: 12px;
}
.prediction-edit-inline > .prediction-edit > :deep(.prediction-loading-region__content > .el-card) {
    flex-shrink: 0;
}
.prediction-edit-inline > .editor-footer {
    flex-shrink: 0;
}
.group-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}
.group-heading h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
}
.group-heading p,
.group-note {
    margin: 6px 0 0;
    font-size: 10px;
    line-height:14px;
    color: var(--el-text-color-secondary);
}
.field-caption {
    font-size: 12px;
    font-weight: 700;
    color: var(--el-text-color-primary);
}
.room-tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 10px 0;
}
.room-tabs .el-button + .el-button {
    margin-left: 0;
}
.rule {
    display: grid;
    gap: 14px;
}
.rule + .rule {
    margin-top: 20px;
}
.rule-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 12px;
}
.basic,
.odds-fields {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
}
.two-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}
.one-field {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
}
.config-save-area {
    scroll-margin-top: 16px;
}
.config-save-area--external {
    display: contents;
}
.editor-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 14px;
}
.prediction-edit :deep(.el-card__header) {
    padding:12px 14px;
}
.prediction-edit :deep(.el-card__body) {
    padding:14px;
}
.round-time-summary :deep(.el-card__header) { border-bottom:0; }
.round-time-summary :deep(.el-card__body) { display:none; }
.prediction-edit :deep(.el-form-item) {
    margin-bottom: 0;
}
.prediction-edit :deep(.el-form-item__label) {
    font-size: 12px;
}
@media (max-width: 1100px) {
    .odds-fields,
    .basic {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .one-field {
        grid-template-columns: 1fr;
    }
}
@media (max-width: 700px) {
    .odds-fields,
    .basic,
    .two-fields {
        grid-template-columns: 1fr;
    }
}
.prediction-edit :deep(.el-card) { border-radius:9px; }
.prediction-edit :deep(.el-form-item__label) { font-size:11px; font-weight:650; line-height:16px; margin-bottom:6px; }
.prediction-edit .parameter-description { font-size:11px; line-height:1.6; margin:0; color:var(--el-text-color-secondary); }
</style>

<style scoped>
.odds-rule-note { margin:0 0 16px; color:var(--el-color-warning); font-size:12px; line-height:1.6; }
</style>
