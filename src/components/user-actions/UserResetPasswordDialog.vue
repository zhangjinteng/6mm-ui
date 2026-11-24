<template>
    <operation-confirm-dialog
        v-model="visible"
        title="确认重置用户密码"
        :subtitle="subtitle"
        :object-id="user?.user_id"
        confirm-text="确认重置用户密码"
        description="确认后，用户当前登录密码将立即失效。系统将生成新的随机密码并显示在用户画像中，请妥善保存并通过安全渠道告知用户。"
        :loading="submitting"
        @confirm="handleSubmit"
        @closed="handleClosed"
    >
        <template #summary>
            <dl class="user-reset-password__summary">
                <div>
                    <dt>当前登录密码</dt>
                    <dd>立即失效</dd>
                </div>
                <div>
                    <dt>用户来源</dt>
                    <dd>{{ sourceLabel }}</dd>
                </div>
            </dl>
        </template>
        <template #feedback>
            <mm-alert
                v-if="saveError"
                class="user-reset-password__error"
                :description="saveError"
                :closable="false"
                type="error"
            />
        </template>
    </operation-confirm-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue'
import { message } from '../../services'
import { MmAlert } from '../alert'
import OperationConfirmDialog from './OperationConfirmDialog.vue'
import type { ResetPasswordUser, ResetUserPasswordResult } from './types'
const props = defineProps<{ resetPassword: (params: { user_id: number | string; reason: string }) => Promise<ResetUserPasswordResult> }>()

const emit = defineEmits<{
    success: [result: ResetUserPasswordResult, userId: number | string]
}>()
const visible = ref(false)
const user = shallowRef<ResetPasswordUser | null>(null)
const submitting = ref(false)
const saveError = ref('')
const subtitle = computed(() => `操作对象：${user.value?.public_user_id || '-'}`)
const sourceLabel = computed(() => {
    const row = user.value
    if (!row?.source_type) return '-'
    const labels = { platform: '平台', white_label: '白标', merchant: '商户' }
    return `${labels[row.source_type]} · ${(row.source_name || row.agent_name_parse || '-')}`
})

const open = (row: ResetPasswordUser) => {
    if (submitting.value || !row?.user_id) return
    user.value = { ...row }
    saveError.value = ''
    visible.value = true
}

const handleClosed = () => {
    user.value = null
    saveError.value = ''
}

const handleSubmit = async (reason: string) => {
    const row = user.value
    const trimmedReason = reason.trim()
    if (
        !visible.value ||
        !row ||
        submitting.value ||
        !trimmedReason ||
        Array.from(trimmedReason).length > 200
    )
        return
    submitting.value = true
    saveError.value = ''
    try {
        const result = await props.resetPassword({ user_id: row.user_id, reason: trimmedReason })
        if (!result?.password) throw new Error('Empty reset response')
        visible.value = false
        emit('success', result, row.user_id)
        message.success('密码已重置，请在用户画像中查看新密码')
    } catch {
        saveError.value = '重置失败，请重试。'
    } finally {
        submitting.value = false
    }
}

defineExpose({ open })
</script>

<style scoped>
.user-reset-password__summary {
    display: grid;
    gap: 10px;
    margin: 14px 0 16px;
    padding: 16px 12px;
    border: 1px solid var(--mm-color-line-strong);
    border-radius: 8px;
    font-size: 11px;
    line-height: 1.5;
}

.user-reset-password__summary > div {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 12px;
}

.user-reset-password__summary dt {
    color: var(--mm-color-text-muted);
}

.user-reset-password__summary dd {
    min-width: 0;
    margin: 0;
    color: var(--mm-color-text);
    font-weight: 600;
    text-align: right;
    overflow-wrap: anywhere;
}

.user-reset-password__error {
    margin-top: 12px;
}
</style>

