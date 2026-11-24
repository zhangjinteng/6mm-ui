<template>
    <mm-dialog
        :model-value="modelValue"
        :title="title"
        :subtitle="subtitle ?? `操作对象：${objectId || '-'}`"
        :width="width"
        panel-class="operation-confirm-dialog"
        :close-on-click-modal="false"
        :close-on-escape="!loading"
        :show-close="!loading"
        @update:model-value="updateVisible"
        @closed="handleClosed"
    >
        <template #header-actions>
            <span class="operation-confirm-dialog__header-icon" aria-hidden="true">
                <mm-icon name="shield-check" :size="18" color="var(--mm-color-primary)" />
            </span>
        </template>

        <slot>
            <mm-alert
                class="operation-confirm-dialog__notice"
                :closable="false"
                :description="description"
                :show-icon="false"
                type="warning"
            />

            <slot name="summary" />

            <mm-form
                ref="formRef"
                class="operation-confirm-dialog__form"
                label-position="top"
                :model="form"
                :rules="rules"
                @submit.prevent="handleConfirm"
            >
                <mm-form-item prop="reason" required>
                    <div class="operation-confirm-dialog__reason-field">
                        <label class="operation-confirm-dialog__reason-label" :for="reasonId">
                            操作原因
                            <small>必填</small>
                        </label>
                        <textarea
                            :id="reasonId"
                            v-model="form.reason"
                            aria-label="操作原因"
                            aria-required="true"
                            :disabled="loading"
                            maxlength="200"
                            placeholder="请输入具体原因"
                            rows="3"
                        ></textarea>
                    </div>
                </mm-form-item>
            </mm-form>
            <slot name="feedback" />
        </slot>

        <template #footer>
            <div class="operation-confirm-dialog__footer">
                <slot name="footer">
                    <mm-button size="md" :disabled="loading" @click="updateVisible(false)">
                        取消
                    </mm-button>
                    <mm-button
                        size="md"
                        variant="primary"
                        :disabled="loading || validating || !form.reason.trim()"
                        :loading="loading"
                        @click="handleConfirm"
                    >
                        {{ confirmText }}
                    </mm-button>
                </slot>
            </div>
        </template>
    </mm-dialog>
</template>

<script lang="ts" setup>
import { MmAlert } from '../alert'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmForm, MmFormItem, type FormExpose } from '../form'
import { MmInput } from '../input'
import { MmSelect } from '../select'
import { MmIcon } from '../icon'
import { message } from '../../services'
import type { FormRules } from '../../shared'
import { nextTick, reactive, ref, shallowRef, useId, watch } from 'vue'

const props = withDefaults(
    defineProps<{
        modelValue: boolean
        title: string
        subtitle?: string
        width?: number | string
        description?: string
        objectId?: number | string | null
        confirmText?: string
        loading?: boolean
    }>(),
    {
        objectId: null,
        confirmText: '确认',
        loading: false,
        width: '460px',
        description: '该操作会改变当前业务状态，并记录到操作日志。提交前请确认对象和原因。'
    }
)
const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: [reason: string]
    closed: []
}>()
const reasonId = `operation-reason-${useId()}`
const formRef = shallowRef<FormExpose>()
const form = reactive({ reason: '' })
const validating = ref(false)
const rules: FormRules = {
    reason: [
        { required: true, message: '请输入操作原因', trigger: 'blur' },
        { max: 200, message: '操作原因不能超过 200 个字符', trigger: ['blur', 'change'] },
        { validator: (value) => String(value || '').trim().length > 0 || '请输入操作原因' }
    ]
}

const resetForm = () => {
    form.reason = ''
    nextTick(() => formRef.value?.clearValidate())
}

watch(
    () => [props.modelValue, props.objectId] as const,
    ([visible]) => {
        if (visible) resetForm()
    }
)

const updateVisible = (visible: boolean) => {
    if (!props.loading) emit('update:modelValue', visible)
}

const handleClosed = () => {
    resetForm()
    emit('closed')
}

const handleConfirm = async () => {
    if (props.loading || validating.value || !props.modelValue) return
    const objectId = props.objectId
    validating.value = true
    try {
        if (
            !(await formRef.value?.validate()) ||
            props.loading ||
            !props.modelValue ||
            props.objectId !== objectId
        ) {
            return
        }
        emit('confirm', form.reason.trim())
    } finally {
        validating.value = false
    }
}
</script>

<style scoped>
:global(.operation-confirm-dialog .mm-dialog__header) {
    min-height: 68px;
    padding: 0 16px;
}

:global(.operation-confirm-dialog .mm-dialog__header-actions) {
    order: -1;
}

:global(.operation-confirm-dialog .mm-dialog__title) {
    font-size: var(--mm-font-size-lg);
}

:global(.operation-confirm-dialog .mm-dialog__close) {
    width: 32px;
    height: 32px;
    border: 1px solid var(--mm-color-line-strong);
}

:global(.operation-confirm-dialog .mm-dialog__body) {
    padding: 16px;
}

:global(.operation-confirm-dialog .mm-dialog__footer) {
    min-height: 54px;
    padding: 10px 16px;
    background: var(--mm-color-soft);
}

.operation-confirm-dialog__header-icon {
    display: inline-flex;
    flex: 0 0 34px;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 6px;
    background: var(--mm-color-primary-soft);
    color: var(--mm-color-primary);
}

.operation-confirm-dialog__notice {
    border-left-width: 1px;
    border-radius: 6px;
}

.operation-confirm-dialog__notice :deep(.mm-alert__description) {
    margin-top: 0;
    color: var(--mm-color-warning);
    font-size: 11px;
}

.operation-confirm-dialog__form {
    margin-top: 12px;
}

.operation-confirm-dialog__form :deep(.mm-form-item) {
    margin-bottom: 0;
}

.operation-confirm-dialog__reason-field {
    width: 100%;
    min-width: 0;
}

.operation-confirm-dialog__reason-label {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 6px;
    color: var(--mm-color-text);
    font-size: var(--mm-font-size-sm);
    font-weight: var(--mm-font-weight-semibold);
}

.operation-confirm-dialog__reason-label small {
    color: var(--mm-color-danger);
    font-size: var(--mm-font-size-xs);
}

.operation-confirm-dialog__reason-field textarea {
    box-sizing: border-box;
    width: 100%;
    height: 64px;
    min-height: 64px;
    padding: 9px 10px;
    resize: vertical;
    color: var(--mm-color-text);
    font: inherit;
    font-size: var(--mm-font-size-sm);
    line-height: 1.55;
    background: var(--mm-color-panel);
    border: 1px solid var(--mm-color-line-strong);
    border-radius: var(--mm-radius-sm);
    outline: 0;
}

.operation-confirm-dialog__reason-field textarea:focus {
    border-color: var(--mm-color-primary);
    box-shadow: var(--mm-focus-ring);
}

.operation-confirm-dialog__reason-field textarea:disabled {
    opacity: 0.65;
}

.operation-confirm-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    width: 100%;
}

.operation-confirm-dialog__footer :deep(.mm-button) {
    min-width: 76px;
}
</style>

