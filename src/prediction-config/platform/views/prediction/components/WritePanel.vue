<template>
    <section v-if="panelVisible" class="prediction-write" :data-action="action">
        <el-alert v-if="error && !hideError" :title="error" type="error" :closable="false" show-icon />
        <el-alert
            v-if="pending && !hidePendingDetails"
            title="上次操作结果尚未确定。核验将使用原操作内容，不会重复创建新的操作。"
            type="warning"
            :closable="false"
        />
        <div v-if="pending && !hidePendingDetails" class="pending-summary">
            操作号：{{ pending.body.client_request_id }}<span v-if="!automaticReason"> · 原因：{{ pending.body.reason }}</span>
        </div>
        <el-form-item v-else-if="!pending && !automaticReason" label="操作原因" required>
            <el-input
                v-model="reason"
                type="textarea"
                :rows="2"
                maxlength="500"
                show-word-limit
                placeholder="请说明本次调整原因"
                :disabled="busy || disabled"
            />
        </el-form-item>
        <el-button
            v-if="allowed && !hideButton"
            type="primary"
            :loading="busy"
            :disabled="busy || blocked || (!pending && disabled) || Boolean(storageError)"
            @click="submit"
        >
            {{ pending ? '核验原操作' : label }}
        </el-button>
        <p v-if="success && !hideSuccess" role="status">{{ success }}</p>
    </section>
</template>
<script setup lang="ts">
import { ElAlert, ElFormItem, ElInput, ElButton } from 'element-plus'

import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useConfigUser as useUserStore } from '../../../../runtime'
import { hasPermission } from '../query'
import { errorMessage } from '../format'
import { SubmissionJournal, type PendingWrite } from '../submission'
const props = withDefaults(
    defineProps<{
        action: string
        target: string
        permission: string
        hideButton?: boolean
        hideSuccess?: boolean
        hidePendingDetails?: boolean
        hideError?: boolean
        label?: string
        automaticReason?: string
        disabled?: boolean
        blocked?: boolean
        newAllowed?: boolean
        payload: () => Record<string, unknown>
        send: (p: Record<string, unknown>) => Promise<unknown>
    }>(),
    { label: '保存', disabled: false, blocked: false, newAllowed: true }
)
const emit = defineEmits<{
    success: [response: unknown]
    pending: [value: boolean]
    busy: [value: boolean]
}>()
const user = useUserStore(),
    allowed = computed(() => hasPermission(user.perms, props.permission))
const reason = ref(''),
    error = ref(''),
    success = ref(''),
    busy = ref(false),
    pending = ref<PendingWrite | null>(null),
    storageError = ref('')
const panelVisible = computed(() => Boolean(
    (pending.value || props.newAllowed) &&
    ((error.value && !props.hideError) || (pending.value && !props.hidePendingDetails) || (!pending.value && !props.automaticReason) ||
        (allowed.value && !props.hideButton) || (success.value && !props.hideSuccess))
))
let journal: SubmissionJournal | undefined
let contextGeneration = 0
watch(busy, (value) => emit('busy', value), { flush: 'sync' })
function sync() {
    try {
        pending.value = journal?.read() ?? null
        emit('pending', Boolean(pending.value))
    } catch (e) {
        storageError.value = errorMessage(e)
        error.value = storageError.value
    }
}
watch(
    () => [props.action, props.target, String(user.userInfo.id || '')],
    () => {
        contextGeneration++
        busy.value = false
        reason.value = ''
        error.value = ''
        success.value = ''
        storageError.value = ''
        pending.value = null
        emit('pending', false)
        journal = undefined
        if (!props.target) return
        try {
            journal = new SubmissionJournal(
                sessionStorage,
                String(user.userInfo.id || ''),
                props.action,
                props.target
            )
            sync()
        } catch (e) {
            storageError.value = errorMessage(e)
            error.value = storageError.value
        }
    },
    { immediate: true, flush: 'sync' }
)
async function submit() {
    if (busy.value || props.blocked || !allowed.value || !journal || storageError.value) return
    const activeJournal = journal,
        generation = contextGeneration,
        actor = String(user.userInfo.id || ''),
        action = props.action,
        target = props.target,
        send = props.send
    const isCurrent = () =>
        generation === contextGeneration &&
        journal === activeJournal &&
        actor === String(user.userInfo.id || '') &&
        action === props.action &&
        target === props.target
    error.value = ''
    success.value = ''
    try {
        if (!pending.value) {
            if (props.disabled || !props.newAllowed) return
            const auditReason = props.automaticReason?.trim() || reason.value.trim()
            if (!auditReason) throw Error('请填写操作原因')
            activeJournal.begin({ ...props.payload(), reason: auditReason })
            sync()
        }
        busy.value = true
        const response = await activeJournal.attempt(send)
        if (!isCurrent()) return
        success.value = '操作已确认成功'
        reason.value = ''
        emit('success', response)
    } catch (e) {
        if (isCurrent()) error.value = errorMessage(e)
    } finally {
        if (isCurrent()) {
            busy.value = false
            sync()
        }
    }
}
onBeforeUnmount(() => {
    contextGeneration++
    emit('busy', false)
})
function clearFeedback() {
    if (busy.value || pending.value) return
    success.value = ''
    if (!storageError.value) error.value = ''
}
defineExpose({ submit, success, error, clearFeedback })
</script>
<style scoped>
.prediction-write {
    margin-top: 18px;
    display: grid;
    gap: 12px;
}
.prediction-write :deep(.el-button) {
    justify-self: start;
}
.pending-summary {
    overflow-wrap: anywhere;
    font-size: 12px;
    color: var(--el-text-color-secondary);
}
</style>
