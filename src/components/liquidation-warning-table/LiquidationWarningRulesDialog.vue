<template>
    <mm-dialog
        v-model="visible"
        class="warning-rules-dialog"
        title="强平预警规则"
        subtitle="当前持仓达到阈值后自动进入预警列表"
        width="700px"
        :close-on-click-modal="false"
        :close-on-escape="!submitting"
        :show-close="!submitting"
        :before-close="() => !submitting"
        @close="handleCancel"
    >
        <mm-alert v-if="loadError" type="error" show-icon :description="loadError" />
        <div v-if="loadError" class="warning-rules-dialog__retry">
            <mm-button size="sm" @click="loadRules">重新加载</mm-button>
        </div>
        <div v-if="loading" class="warning-rules-dialog__loading" role="status">
            正在加载预警规则…
        </div>

        <div class="warning-rules-summary" aria-label="预警规则概要">
            <div class="warning-rules-summary__item is-warning">
                <span>进入预警</span>
                <strong>{{
                    loaded ? `≥ ${formatWarningThreshold(formData.entryThreshold)}` : '—'
                }}</strong>
                <small>仓位开始出现在强平预警列表</small>
            </div>
            <div class="warning-rules-summary__item is-danger">
                <span>高风险</span>
                <strong>{{
                    loaded ? `≥ ${formatWarningThreshold(formData.highRiskThreshold)}` : '—'
                }}</strong>
                <small>用于标识需要优先处理的仓位</small>
            </div>
            <div class="warning-rules-summary__item">
                <span>强平线</span>
                <strong>100%</strong>
                <small>系统固定，不在此处修改</small>
            </div>
        </div>

        <mm-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-position="top"
            :disabled="isBusy || !loaded || !canEdit"
            @submit.prevent="handleSubmit"
        >
            <section class="warning-rules-section" aria-label="风险率阈值">
                <h3>风险率阈值</h3>
                <div class="warning-rules-fields">
                    <mm-form-item label="进入预警阈值" prop="entryThreshold" required>
                        <div class="warning-rules-field">
                            <mm-input
                                v-model="formData.entryThreshold"
                                inputmode="decimal"
                                placeholder="请输入阈值"
                            >
                                <template #append>%</template>
                            </mm-input>
                            <p>达到该值后，当前仓位自动进入预警列表</p>
                        </div>
                    </mm-form-item>
                    <mm-form-item label="高风险阈值" prop="highRiskThreshold" required>
                        <div class="warning-rules-field">
                            <mm-input
                                v-model="formData.highRiskThreshold"
                                inputmode="decimal"
                                placeholder="请输入阈值"
                            >
                                <template #append>%</template>
                            </mm-input>
                            <p>必须大于进入预警阈值并小于 100%</p>
                        </div>
                    </mm-form-item>
                </div>
            </section>

            <section class="warning-rules-section" aria-label="用户通知">
                <h3>用户通知</h3>
                <div class="warning-rules-notification">
                    <div class="warning-rules-notification__text">
                        <strong>通知用户</strong>
                        <span id="warning-rules-notification-hint"
                            >保存后同步到交易服务，通知发送由上游服务负责</span
                        >
                    </div>
                    <button
                        type="button"
                        role="switch"
                        class="warning-rules-switch"
                        :class="{ 'is-active': formData.notifyEnabled }"
                        :aria-checked="formData.notifyEnabled"
                        aria-label="用户通知"
                        aria-describedby="warning-rules-notification-hint"
                        :disabled="isBusy || !loaded || !canEdit"
                        @click="formData.notifyEnabled = !formData.notifyEnabled"
                    >
                        <span class="warning-rules-switch__track" aria-hidden="true"><i></i></span>
                        <span>{{ formData.notifyEnabled ? '已开启' : '已关闭' }}</span>
                    </button>
                </div>
            </section>
            <mm-alert
                class="warning-rules-dialog__notice"
                type="info"
                show-icon
                description="风险率回落至进入阈值以下，或仓位结束后，将自动从预警列表移出。"
            />
            <mm-alert
                v-if="saveError"
                class="warning-rules-dialog__error"
                type="error"
                show-icon
                :description="saveError"
            />
            <p v-if="!canEdit" class="warning-rules-dialog__readonly">
                当前账号没有系统配置编辑权限，仅可查看规则。
            </p>
        </mm-form>

        <template #footer>
            <div class="warning-rules-dialog__footer">
                <mm-button :disabled="submitting" @click="handleCancel">取消</mm-button>
                <mm-button
                    v-if="canEdit"
                    variant="primary"
                    :disabled="!canSave"
                    :loading="submitting"
                    @click="handleSubmit"
                >
                    保存规则
                </mm-button>
            </div>
        </template>
    </mm-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, shallowRef } from 'vue'
import { MmAlert } from '../alert'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmForm, MmFormItem, type FormExpose } from '../form'
import type { FormRules } from '../../shared/form'
import { MmInput } from '../input'
import { message } from '../../services/message'
import type { LiquidationWarningRules, LiquidationWarningRulesLoader, LiquidationWarningRulesSaver } from './types'
import {
    formatWarningThreshold,
    parseWarningRules,
    toWarningRulePayload,
    validateWarningDraft,
    type WarningRuleDraft
} from './rules'

const props = defineProps<{ canEdit: boolean; loadRules: LiquidationWarningRulesLoader; saveRules?: LiquidationWarningRulesSaver }>()
const emit = defineEmits<{
    loaded: [rules: LiquidationWarningRules]
    saved: [rules: LiquidationWarningRules]
}>()
const visible = ref(false)
const loading = ref(false)
const loaded = ref(false)
const submitting = ref(false)
const loadError = ref('')
const saveError = ref('')
const formRef = shallowRef<FormExpose>()
const formData = reactive<WarningRuleDraft>({
    entryThreshold: '',
    highRiskThreshold: '',
    notifyEnabled: false
})
const isBusy = computed(() => loading.value || submitting.value)
const canSave = computed(
    () => props.canEdit && !!props.saveRules && loaded.value && !isBusy.value && !!toWarningRulePayload(formData)
)
const formRules: FormRules = {
    entryThreshold: [
        {
            validator: () => validateWarningDraft(formData).entryThreshold,
            trigger: ['change', 'blur', 'submit']
        }
    ],
    highRiskThreshold: [
        {
            validator: () => validateWarningDraft(formData).highRiskThreshold,
            trigger: ['change', 'blur', 'submit']
        }
    ]
}
let requestEpoch = 0

const loadRules = async () => {
    if (!visible.value || submitting.value || loading.value) return
    const epoch = ++requestEpoch
    loading.value = true
    loaded.value = false
    loadError.value = ''
    saveError.value = ''
    try {
        const rules = parseWarningRules(await props.loadRules())
        if (epoch !== requestEpoch || !visible.value) return
        Object.assign(formData, {
            entryThreshold: String(rules.min_large_position_value),
            highRiskThreshold: String(rules.liquidation_high_risk_threshold),
            notifyEnabled: rules.liquidation_warning_notify_enabled
        })
        loaded.value = true
        formRef.value?.clearValidate()
        emit('loaded', rules)
    } catch {
        if (epoch === requestEpoch && visible.value)
            loadError.value = '预警规则加载失败，请重新加载后再保存。'
    } finally {
        if (epoch === requestEpoch) loading.value = false
    }
}

const open = () => {
    if (visible.value || submitting.value) return
    visible.value = true
    void loadRules()
}

const handleCancel = () => {
    if (submitting.value) return
    ++requestEpoch
    visible.value = false
    loading.value = false
    loaded.value = false
    formRef.value?.clearValidate()
}

const handleSubmit = async () => {
    if (!visible.value || !canSave.value) return
    submitting.value = true
    saveError.value = ''
    try {
        if (!(await formRef.value?.validate())) return
        const payload = toWarningRulePayload(formData)
        if (!payload) return
        const rules = parseWarningRules(await props.saveRules!(payload))
        emit('saved', rules)
        visible.value = false
        message.success('强平预警规则已保存')
    } catch {
        saveError.value = '保存未成功确认，请重试或重新打开弹窗核对配置。'
    } finally {
        submitting.value = false
    }
}

defineExpose({ open })
</script>

<style scoped>
.warning-rules-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: hidden;
    border: 1px solid var(--mm-color-line);
    border-radius: var(--mm-radius-lg);
    margin-bottom: var(--mm-space-5);
}
.warning-rules-summary__item {
    display: flex;
    flex-direction: column;
    gap: var(--mm-space-2);
    padding: var(--mm-space-4);
}
.warning-rules-summary__item + .warning-rules-summary__item {
    border-left: 1px solid var(--mm-color-line);
}
.warning-rules-summary__item span,
.warning-rules-summary__item small {
    color: var(--mm-color-text-subtle);
    font-size: var(--mm-font-size-xs);
    line-height: 1.6;
}
.warning-rules-summary__item strong {
    font-size: 20px;
    line-height: 1.3;
    font-variant-numeric: tabular-nums;
}
.warning-rules-summary__item.is-warning strong {
    color: var(--mm-color-warning);
}
.warning-rules-summary__item.is-danger strong {
    color: var(--mm-color-danger);
}
.warning-rules-section {
    margin-bottom: var(--mm-space-5);
}
.warning-rules-section h3 {
    margin: 0 0 var(--mm-space-3);
    font-size: var(--mm-font-size-sm);
    font-weight: 600;
}
.warning-rules-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--mm-space-4);
}
.warning-rules-fields :deep(.mm-form-item) {
    margin-bottom: 0;
}
.warning-rules-field {
    width: 100%;
}
.warning-rules-field p {
    margin: var(--mm-space-1) 0 0;
    color: var(--mm-color-text-subtle);
    font-size: var(--mm-font-size-xs);
    line-height: 1.6;
}
.warning-rules-notification {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--mm-space-4);
    padding: var(--mm-space-3);
    border: 1px solid var(--mm-color-line);
    border-radius: var(--mm-radius-lg);
    background: var(--mm-color-soft);
}
.warning-rules-notification__text {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--mm-space-1);
}
.warning-rules-notification__text strong {
    font-size: var(--mm-font-size-sm);
    font-weight: 600;
}
.warning-rules-notification__text span {
    color: var(--mm-color-text-subtle);
    font-size: var(--mm-font-size-xs);
    line-height: 1.6;
}
.warning-rules-switch {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: var(--mm-space-2);
    padding: 6px 10px;
    border: 1px solid var(--mm-color-line-strong);
    border-radius: var(--mm-radius-round);
    color: var(--mm-color-text-muted);
    background: var(--mm-color-panel);
    cursor: pointer;
    font: inherit;
    font-size: var(--mm-font-size-sm);
}
.warning-rules-switch:focus-visible {
    outline: none;
    box-shadow: var(--mm-focus-ring);
}
.warning-rules-switch:disabled {
    opacity: 0.56;
    cursor: not-allowed;
}
.warning-rules-switch__track {
    position: relative;
    width: 40px;
    height: 24px;
    border-radius: var(--mm-radius-round);
    background: var(--mm-color-line-strong);
    transition: background-color var(--mm-duration-fast);
}
.warning-rules-switch__track i {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--mm-color-panel);
    box-shadow: var(--mm-shadow-sm);
    transition: transform var(--mm-duration-fast);
}
.warning-rules-switch.is-active {
    border-color: color-mix(in srgb, var(--mm-color-primary) 30%, var(--mm-color-line));
}
.warning-rules-switch.is-active .warning-rules-switch__track {
    background: var(--mm-color-primary);
}
.warning-rules-switch.is-active .warning-rules-switch__track i {
    transform: translateX(16px);
}
.warning-rules-dialog__notice :deep(.mm-alert__description) {
    font-size: var(--mm-font-size-xs);
}
.warning-rules-dialog__error,
.warning-rules-dialog__readonly {
    margin-top: var(--mm-space-3);
}
.warning-rules-dialog__readonly {
    color: var(--mm-color-text-muted);
    font-size: var(--mm-font-size-xs);
}
.warning-rules-dialog__retry {
    margin: var(--mm-space-3) 0;
}
.warning-rules-dialog__loading {
    margin-bottom: var(--mm-space-3);
    color: var(--mm-color-text-muted);
    font-size: var(--mm-font-size-sm);
}
.warning-rules-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--mm-space-2);
}
.warning-rules-dialog__footer .mm-button {
    min-width: 84px;
}
@media (max-width: 600px) {
    .warning-rules-summary__item {
        padding: var(--mm-space-3);
    }
    .warning-rules-summary__item strong {
        font-size: 18px;
    }
    .warning-rules-fields {
        grid-template-columns: 1fr;
    }
    .warning-rules-notification {
        align-items: flex-start;
    }
}
@media (prefers-reduced-motion: reduce) {
    .warning-rules-switch__track,
    .warning-rules-switch__track i {
        transition: none;
    }
}
</style>
