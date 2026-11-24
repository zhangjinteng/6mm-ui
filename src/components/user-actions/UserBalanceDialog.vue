<template>
    <mm-dialog
        v-model="visible"
        :title="dialogTitle"
        :subtitle="dialogSubtitle"
        width="620px"
        panel-class="balance-dialog"
        :close-on-click-modal="false"
        :close-on-escape="!submitting"
        :show-close="!submitting"
        @closed="handleClose"
    >
        <mm-alert
            class="balance-dialog__notice"
            :description="`${dialogTitle}属于人工调账`"
            :show-icon="false"
            :closable="false"
            type="warning"
        />

        <dl class="balance-dialog__summary" :aria-label="`${accountLabel}余额调整预览`">
            <div>
                <dt>当前账户余额(U)</dt>
                <dd>{{ contextLoading ? '加载中…' : formatBalance(currentBalance) }}</dd>
            </div>
            <div>
                <dt>调整方向</dt>
                <dd :class="formData.type === 'inc' ? 'is-increase' : 'is-decrease'">
                    {{ formData.type === 'inc' ? '调增' : '扣减' }}
                </dd>
            </div>
            <div>
                <dt>预计调整后(U)</dt>
                <dd aria-live="polite">{{ contextLoading ? '-' : formatBalance(expectedBalance) }}</dd>
            </div>
        </dl>

        <mm-form
            ref="formRef"
            class="balance-dialog__form"
            :model="formData"
            :rules="formRules"
            :disabled="submitting || contextLoading || fundingAttempted || contractAttempted"
            label-position="top"
            @submit.prevent="handleSubmit"
        >
            <div class="balance-dialog__account-fields">
                <mm-form-item label="账户类型">
                    <mm-select
                        :model-value="accountType"
                        :options="accountOptions"
                        @update:model-value="handleAccountTypeChange"
                    />
                </mm-form-item>
                <mm-form-item label="币种">
                    <mm-select
                        model-value="USDT"
                        :options="[{ label: 'USDT', value: 'USDT' }]"
                        readonly
                    />
                </mm-form-item>
            </div>
            <mm-form-item label="调整金额(U)" prop="balance" required>
                <mm-input v-model="formData.balance" inputmode="decimal" placeholder="请输入金额" />
            </mm-form-item>
            <mm-form-item prop="reason" required>
                <div class="balance-dialog__reason">
                    <label :for="reasonId">操作原因 <span aria-hidden="true">*</span></label>
                    <textarea
                        :id="reasonId"
                        v-model="formData.reason"
                        aria-required="true"
                        :disabled="submitting || contextLoading || fundingAttempted || contractAttempted"
                        maxlength="200"
                        placeholder="请输入操作原因"
                        rows="2"
                    ></textarea>
                </div>
            </mm-form-item>
        </mm-form>

        <mm-alert
            v-if="fundingFeedback"
            class="balance-dialog__feedback"
            :description="fundingFeedback"
            :closable="false"
            :type="fundingRejected ? 'error' : 'warning'"
            show-icon
        />

        <template #footer>
            <div class="balance-dialog__footer">
                <mm-button :disabled="submitting" @click="close">取消</mm-button>
                <mm-button
                    :variant="formData.type === 'inc' ? 'primary' : 'danger'"
                    :loading="submitting"
                    :disabled="storageBlocked || contextLoading || (accountType === 'funding' && !fundingContext) || fundingRejected"
                    @click="handleSubmit"
                >
                    {{ fundingRejected ? '已拒绝' : fundingAttempted || contractAttempted ? '查询结果' : '提交调账' }}
                </mm-button>
            </div>
        </template>
    </mm-dialog>
</template>

<script lang="ts" setup name="user-balance-dialog">
import { computed, nextTick, onBeforeUnmount, reactive, ref, shallowRef, useId } from 'vue'
import { MmAlert } from '../alert'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmForm, MmFormItem, type FormExpose } from '../form'
import { MmInput } from '../input'
import { MmSelect } from '../select'
import { MmIcon } from '../icon'
import { message } from '../../services'
import type { FormRules } from '../../shared'

import type { BalanceAdjustmentParams, BalanceAdjustmentQueryResult, FundingAdjustmentContext, FundingAdjustmentResult } from './types'
const props = defineProps<{
  storageScope?: string
  adjust: (direction: 'inc' | 'dec', params: BalanceAdjustmentParams) => Promise<unknown>
  queryAdjustment?: (direction: 'inc' | 'dec', params: BalanceAdjustmentParams) => Promise<BalanceAdjustmentQueryResult>
  fundingContext?: (userId: number | string) => Promise<FundingAdjustmentContext>
  adjustFunding?: (direction: 'inc' | 'dec', params: BalanceAdjustmentParams) => Promise<FundingAdjustmentResult>
}>()

interface BalanceForm {
    balance: string
    now_balance: number | string
    reason: string
    type: 'dec' | 'inc'
    user_id: number | string
}

interface BalanceUser {
    uid?: number | string | null
    username?: string | null
}

const emit = defineEmits(['success', 'close', 'reconciled'])
const reasonId = `balance-adjustment-reason-${useId()}`
const formRef = shallowRef<FormExpose>()
const user = shallowRef<BalanceUser>({})
const visible = ref(false)
const submitting = ref(false)
const accountType = ref<'contract' | 'funding'>('contract')
const accountOptions = computed(() => [{ label: '合约账户', value: 'contract' }, ...(props.fundingContext && props.adjustFunding ? [{ label: '资金账户', value: 'funding' }] : [])])
const accountLabel = computed(() => accountType.value === 'funding' ? '资金账户' : '合约账户')
const contextLoading = ref(false)
const fundingContext = shallowRef<FundingAdjustmentContext | null>(null)
const fundingResult = shallowRef<FundingAdjustmentResult | null>(null)
const fundingAttempted = ref(false)
const fundingError = ref('')
const contractAttempted = ref(false)
const contractError = ref('')
const storageBlocked = ref(false)
const storageKey = ref('')
let contextRun = 0
let requestedDirection: 'inc' | 'dec' = 'inc'
onBeforeUnmount(() => { contextRun++ })
const fundingRejected = computed(() => ['rejected', 'execution_rejected'].includes(fundingResult.value?.status || ''))
const fundingFeedback = computed(() => {
    if (accountType.value !== 'funding') return contractError.value
    if (fundingError.value) return fundingError.value
    const result = fundingResult.value
    return result ? `${result.message}${result.result_code ? `（${result.result_code}）` : ''}` : ''
})
const formData = reactive<BalanceForm>({
    balance: '',
    now_balance: 0,
    reason: '',
    type: 'inc',
    user_id: ''
})

const dialogTitle = computed(() => (formData.type === 'inc' ? '余额调增' : '余额扣减'))
const dialogSubtitle = computed(() =>
    [`UID ${user.value.uid || '-'}`, user.value.username, accountLabel.value].filter(Boolean).join(' · ')
)
const generateRequestNo = () => {
    const words = crypto.getRandomValues(new Uint32Array(2))
    return (100000000000000000n + ((BigInt(words[0]) << 32n) | BigInt(words[1])) % 900000000000000000n).toString()
}
const outRequestNo = ref<number | string>(generateRequestNo())

const formRules: FormRules = {
    balance: [
        { required: true, message: '请输入金额', trigger: 'blur' },
        {
            validator: (value) => {
                const amount = parseBalance(value)
                return amount !== null && amount > 0n
            },
            message: '请输入大于 0 的金额，最多 8 位小数',
            trigger: ['blur', 'change']
        }
    ],
    reason: [
        { required: true, message: '请输入操作原因', trigger: 'blur' },
        { max: 200, message: '操作原因不能超过 200 个字符', trigger: ['blur', 'change'] },
        { validator: (value) => String(value || '').trim().length > 0 || '请输入操作原因' }
    ]
}

// Keep the preview in eight-decimal units so adding or subtracting does not lose cents.
const parseBalance = (value: unknown): bigint | null => {
    const text = typeof value === 'number' && Number.isFinite(value)
        ? value.toLocaleString('en-US', { useGrouping: false, maximumFractionDigits: 8 })
        : String(value ?? '').trim()
    const match = text.match(/^(-?)(\d*)(?:\.(\d{0,8}))?$/)
    if (!match || (!match[2] && !match[3])) return null
    const amount = BigInt(match[2] || '0') * 100000000n + BigInt((match[3] || '').padEnd(8, '0'))
    return match[1] ? -amount : amount
}

const currentBalance = computed(() => accountType.value === 'funding'
    ? parseBalance(fundingContext.value?.balance)
    : parseBalance(formData.now_balance))
const expectedBalance = computed(() => {
    const current = currentBalance.value
    const amount = parseBalance(formData.balance)
    if (current === null) return null
    if (amount === null || amount <= 0n) return current
    return current + (formData.type === 'inc' ? amount : -amount)
})
const formatBalance = (value: bigint | null) => {
    if (value === null) return '-'
    const cents = ((value < 0n ? -value : value) + 500000n) / 1000000n
    return `${value < 0n && cents > 0n ? '-' : ''}${(cents / 100n).toLocaleString('en-US')}.${String(cents % 100n).padStart(2, '0')}`
}

const close = () => {
    if (submitting.value) return
    contextRun++
    visible.value = false
}

const queryContract = async () => {
    if (!props.queryAdjustment || !contractAttempted.value || contextLoading.value) return
    const run = ++contextRun
    const key = storageKey.value
    const params: BalanceAdjustmentParams = {
        user_id: formData.user_id, balance: formData.balance, reason: formData.reason,
        out_request_no: outRequestNo.value,
    }
    contextLoading.value = true
    contractError.value = '正在核对原调账结果…'
    try {
        // This adapter must only query/reconcile, never send another adjustment.
        const result = await props.queryAdjustment(formData.type, params)
        if (run !== contextRun || !visible.value) return
        if (result.status !== 'success' && result.status !== 'failed') {
            contractError.value = '原调账结果仍待确认，请查询原请求，不要重新调账。'
            return
        }
        if (parseBalance(result.balance) === null) throw new Error('Fresh balance unavailable')
        if (key) {
            const saved = JSON.parse(sessionStorage.getItem(key) || 'null')
            if (saved && String(saved.out_request_no) !== String(params.out_request_no)) throw new Error('Pending request changed')
            sessionStorage.removeItem(key)
        }
        formData.now_balance = result.balance!
        formData.balance = ''
        formData.reason = ''
        formData.type = requestedDirection
        outRequestNo.value = generateRequestNo()
        contractAttempted.value = false
        contractError.value = result.status === 'success'
            ? '原调账已成功，余额已刷新；如需再次调账，请填写后手动提交。'
            : '原调账已明确失败，余额已刷新；可重新填写后手动提交。'
        emit('reconciled', result.status)
        nextTick(() => formRef.value?.clearValidate())
    } catch {
        if (run === contextRun && visible.value) {
            contractError.value = '查询结果或刷新余额失败，请重试查询原请求，不要重新调账。'
        }
    } finally {
        if (run === contextRun) contextLoading.value = false
    }
}

const handleAccountTypeChange = async (value: unknown) => {
    if (submitting.value || fundingAttempted.value || contractAttempted.value || (value !== 'contract' && value !== 'funding')) return
    if (value === 'funding' && (!props.fundingContext || !props.adjustFunding)) return
    accountType.value = value
    const run = ++contextRun
    contextLoading.value = false
    fundingError.value = ''
    if (value === 'contract') return
    fundingContext.value = null
    contextLoading.value = true
    try {
        const context = await props.fundingContext!(formData.user_id)
        if (run !== contextRun || !visible.value) return
        if (!context?.account_id || !context.home_site_id || (!context.pending_request && parseBalance(context.balance) === null)) {
            throw new Error('Invalid funding account context')
        }
        fundingContext.value = context
        const pending = context.pending_request
        if (pending) {
            fundingResult.value = pending
            fundingAttempted.value = true
            outRequestNo.value = pending.out_request_no
            formData.type = pending.direction
            formData.balance = pending.amount
            formData.reason = pending.reason
        }
    } catch {
        if (run === contextRun && visible.value) {
            fundingError.value = '无法读取有效资金账户，请检查账户与站点后重新选择资金账户'
        }
    } finally {
        if (run === contextRun) contextLoading.value = false
    }
}

const handleSubmit = async () => {
    if (submitting.value || !visible.value || storageBlocked.value || contextLoading.value || fundingRejected.value) return
    if (accountType.value === 'contract' && contractAttempted.value && props.queryAdjustment) {
        await queryContract()
        return
    }
    if (accountType.value === 'funding' && !fundingContext.value) return
    submitting.value = true
    try {
        const valid = fundingAttempted.value || contractAttempted.value || await formRef.value?.validate()
        if (!valid || !visible.value) return
        const params = {
            balance: formData.balance.trim(),
            reason: formData.reason.trim(),
            out_request_no: outRequestNo.value,
            user_id: formData.user_id
        }
        if (params.balance.startsWith('.')) params.balance = `0${params.balance}`
        if (params.balance.endsWith('.')) params.balance += '0'
        if (accountType.value === 'funding') {
            // Normalize decimal shorthand without converting the submitted amount to a number.
            if (params.balance.startsWith('.')) params.balance = `0${params.balance}`
            if (params.balance.endsWith('.')) params.balance += '0'
            fundingAttempted.value = true
            fundingError.value = ''
            try {
                const result = await props.adjustFunding!(formData.type, params)
                fundingResult.value = result
                if (result.status === 'executed' && result.result_code === 'OK') {
                    message.success(result.message)
                    visible.value = false
                    emit('success')
                } else if (result.status === 'executed') {
                    fundingResult.value = { ...result, status: 'unknown', message: '调账结果尚未满足成功条件，请查询原单' }
                }
            } catch {
                fundingError.value = '请求结果未确认，请查询原单；勿重新创建调账。'
            }
            return
        }
        try {
            // Persist the original intent before sending; closing/reopening cannot create a second write.
            if (storageKey.value) sessionStorage.setItem(storageKey.value, JSON.stringify({ ...params, direction: formData.type }))
            contractAttempted.value = true
            await props.adjust(formData.type, params)
        } catch (error: unknown) {
            // Only a confirmed rejection permits a fresh adjustment on the next submit.
            if ((error as { status?: string } | null)?.status === 'failed') {
                if (storageKey.value) sessionStorage.removeItem(storageKey.value)
                contractAttempted.value = false
                outRequestNo.value = generateRequestNo()
            }
            contractError.value = (error as { status?: string; message?: string })?.status === 'failed'
                ? '调账被拒绝，请核对后重新提交。' : '调账结果待确认，请查询原请求，不要重新调账。'
            return
        }
        if (storageKey.value) sessionStorage.removeItem(storageKey.value)
        contractAttempted.value = false
        message.success(`${dialogTitle.value}成功`)
        visible.value = false
        emit('success')
    } finally {
        submitting.value = false
    }
}

const handleClose = () => {
    contextRun++
    contextLoading.value = false
    formData.balance = ''
    formData.reason = ''
    formData.user_id = ''
    user.value = {}
    fundingContext.value = null
    fundingResult.value = null
    fundingAttempted.value = false
    fundingError.value = ''
    emit('close')
}

const open = (
    userId: number | string,
    type: 'dec' | 'inc' = 'inc',
    nowBalance: number | string = 0,
    userContext: BalanceUser = {},
    initialAccount: 'contract' | 'funding' = 'contract'
) => {
    if (submitting.value) return
    requestedDirection = type
    formData.type = type
    formData.user_id = userId
    formData.now_balance = nowBalance
    formData.balance = ''
    formData.reason = ''
    accountType.value = 'contract'
    fundingContext.value = null
    fundingResult.value = null
    fundingAttempted.value = false
    fundingError.value = ''
    contextLoading.value = false
    contextRun++
    user.value = { ...userContext }
    outRequestNo.value = generateRequestNo()
    contractAttempted.value = false
    contractError.value = ''
    storageBlocked.value = false
    storageKey.value = props.storageScope ? `manual-user-adjustment:${props.storageScope}:${userId}` : ''
    if (storageKey.value) {
        try {
            const saved = JSON.parse(sessionStorage.getItem(storageKey.value) || 'null')
            if (saved) {
                if (String(saved.user_id) !== String(userId) || !['inc', 'dec'].includes(saved.direction)
                    || typeof saved.balance !== 'string' || typeof saved.reason !== 'string'
                    || !/^[1-9]\d{0,17}$/.test(String(saved.out_request_no))) throw new Error('Invalid saved intent')
                formData.balance = saved.balance
                formData.reason = saved.reason
                formData.type = saved.direction
                outRequestNo.value = saved.out_request_no
                contractAttempted.value = true
                contractError.value = '该用户有待确认调账，请查询原请求。'
            }
        } catch {
            storageBlocked.value = true
            contractError.value = '无法读取待确认调账，请先联系管理员核对。'
        }
    }
    visible.value = true
    nextTick(() => formRef.value?.clearValidate())
    if (contractAttempted.value && !storageBlocked.value && props.queryAdjustment) void queryContract()
    if (initialAccount === 'funding') void handleAccountTypeChange('funding')
}

defineExpose({ open })
</script>

<style scoped>
:global(.balance-dialog .mm-dialog__header) {
    min-height: 64px;
    padding: 12px 16px;
}

:global(.balance-dialog .mm-dialog__close) {
    width: 32px;
    height: 32px;
    border: 1px solid var(--mm-color-line-strong);
}

:global(.balance-dialog .mm-dialog__body) {
    padding: 16px;
}

:global(.balance-dialog .mm-dialog__footer) {
    padding: 12px 16px;
    background: var(--mm-color-soft);
}

.balance-dialog__notice {
    border-left-width: 1px;
    border-radius: 6px;
}

.balance-dialog__notice :deep(.mm-alert__description) {
    margin-top: 0;
    color: var(--mm-color-warning);
    font-size: 11px;
}

.balance-dialog__feedback {
    margin-top: 14px;
}

.balance-dialog__summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 12px 0;
    border: 1px solid var(--mm-color-line);
    border-radius: 6px;
}

.balance-dialog__summary > div {
    min-width: 0;
    padding: 10px 12px;
}

.balance-dialog__summary > div + div {
    border-left: 1px solid var(--mm-color-line);
}

.balance-dialog__summary dt {
    color: var(--mm-color-text-muted);
    font-size: 10px;
}

.balance-dialog__summary dd {
    margin: 2px 0 0;
    color: var(--mm-color-text);
    font-size: 14px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
}

.balance-dialog__summary .is-increase {
    color: var(--mm-color-success);
}

.balance-dialog__summary .is-decrease {
    color: var(--mm-color-danger);
}

.balance-dialog__account-fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}

.balance-dialog__form :deep(.mm-form-item) {
    margin-bottom: 12px;
}

.balance-dialog__form :deep(.mm-form-item:last-child) {
    margin-bottom: 0;
}

.balance-dialog__account-fields :deep(.mm-form-item:last-child) {
    margin-bottom: 12px;
}

.balance-dialog__form :deep(.mm-form-item.is-error) {
    margin-bottom: 22px;
}

.balance-dialog__form :deep(.mm-form-item__label),
.balance-dialog__reason > label {
    color: var(--mm-color-text);
    font-size: 11px;
    font-weight: 600;
}

.balance-dialog__reason {
    width: 100%;
    min-width: 0;
}

.balance-dialog__reason > label {
    display: block;
    margin-bottom: 6px;
}

.balance-dialog__reason > label span {
    color: var(--mm-color-danger);
}

.balance-dialog__reason textarea {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-height: 58px;
    padding: 8px 10px;
    resize: vertical;
    color: var(--mm-color-text);
    font: inherit;
    line-height: 1.5;
    background: var(--mm-color-panel);
    border: 1px solid var(--mm-color-line-strong);
    border-radius: var(--mm-radius-sm);
    outline: none;
}

.balance-dialog__reason textarea:focus {
    border-color: var(--mm-color-primary);
    box-shadow: var(--mm-focus-ring);
}

.balance-dialog__reason textarea:disabled {
    opacity: 0.65;
}

.balance-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.balance-dialog__footer :deep(.mm-button) {
    min-width: 84px;
}
</style>

