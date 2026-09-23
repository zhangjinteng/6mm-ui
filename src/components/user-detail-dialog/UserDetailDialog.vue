<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmAvatar } from '../avatar'
import { MmButton } from '../button'
import { MmCard } from '../card'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmIpLocation } from '../ip-location'
import { formatOnlineUserDateTime, firstOnlineUserValue, parseOnlineUserDateTime } from '../online-user-table/formatters'
import { MmTabPane, MmTabs } from '../tabs'
import { MmTag } from '../tag'
import type {
  UserDetailData,
  UserDetailDialogProps,
  UserDetailMetricKey,
  UserDetailRequestResult,
} from './types'

defineOptions({ name: 'MmUserDetailDialog' })

const props = withDefaults(defineProps<UserDetailDialogProps>(), {
  closeOnClickModal: false,
  currentListLabel: undefined,
  requestKey: 0,
  showMetricLinks: true,
  userId: null,
  width: 'min(1180px, calc(100vw - 4px))',
})
const emit = defineEmits<{
  loaded: [detail: UserDetailData]
  'metric-click': [key: UserDetailMetricKey, detail: UserDetailData]
  'update:modelValue': [value: boolean]
}>()

const { messages } = useLocale()
const loading = ref(false)
const loadError = ref('')
const detail = ref<UserDetailData | null>(null)
const updatedAt = ref('-')
const nowTimestamp = ref(Date.now())
const activeTab = ref('contract')
let durationTimer: number | undefined
let requestController: AbortController | undefined
let requestSequence = 0

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  const text = String(value).trim()
  return text || '-'
}

function displayName(row: UserDetailData | null): string {
  return displayValue(firstOnlineUserValue(row?.nice_name, row?.username))
}

const userName = computed(() => displayName(detail.value))
const externalUserId = computed(() => displayValue(detail.value?.agent_user_id))
const userInitial = computed(() => (userName.value === '-' ? 'U' : userName.value).slice(0, 1).toUpperCase())

function formatVipLevel(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-'
  const text = String(value).trim()
  return /^v/i.test(text) ? text.toUpperCase() : `V${text}`
}

function formatAmount(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-'
  const number = Number(value)
  return Number.isFinite(number)
    ? new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number)
    : '-'
}

function formatCount(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-'
  const number = Number(value)
  return Number.isFinite(number) ? String(number) : '-'
}

function amountTone(value: unknown): 'negative' | 'positive' | 'neutral' | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const number = Number(value)
  if (!Number.isFinite(number) || number === 0) return 'neutral'
  return number > 0 ? 'positive' : 'negative'
}

function isOnlineValue(value: unknown): boolean {
  if (value === true || value === 1) return true
  return ['1', 'true', 'online'].includes(String(value ?? '').trim().toLowerCase())
}

const isOnline = computed(() => isOnlineValue(detail.value?.online_status))
const loginValue = computed(() => firstOnlineUserValue(
  detail.value?.login_time,
  detail.value?.login_at,
  detail.value?.last_login_at,
))
const lastActiveValue = computed(() => firstOnlineUserValue(
  detail.value?.last_active_at,
  detail.value?.last_activity_at,
  detail.value?.last_active_time,
  detail.value?.active_at,
  detail.value?.updated_at,
  loginValue.value,
))

function durationText(): string {
  const loginTimestamp = parseOnlineUserDateTime(loginValue.value)
  if (loginTimestamp === null) return '-'
  const totalMinutes = Math.floor(Math.max(0, nowTimestamp.value - loginTimestamp) / 60_000)
  if (totalMinutes < 1) return messages.value.userDetail.lessThanMinute
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  if (days > 0) return hours > 0
    ? messages.value.userDetail.daysHours(days, hours)
    : messages.value.userDetail.days(days)
  if (hours > 0) return minutes > 0
    ? messages.value.userDetail.hoursMinutes(hours, minutes)
    : messages.value.userDetail.hours(hours)
  return messages.value.userDetail.minutes(minutes)
}

const onlineDuration = computed(durationText)

const metrics = computed(() => {
  const contract = detail.value?.contract ?? {}
  return [
    { key: 'wallet_balance' as const, label: messages.value.userDetail.accountBalance, value: formatAmount(contract.wallet_balance) },
    { key: 'position_amount' as const, label: messages.value.userDetail.positionAmount, value: formatAmount(contract.position_amount) },
    { key: 'position_count' as const, label: messages.value.userDetail.positionCount, value: formatCount(contract.position_count) },
    { key: 'order_count' as const, label: messages.value.userDetail.orderCount, value: formatCount(contract.order_count) },
    { key: 'unrealized_pnl' as const, label: messages.value.userDetail.unrealizedPnl, value: formatAmount(contract.unrealized_pnl), tone: amountTone(contract.unrealized_pnl) },
    { key: 'pnl_30d' as const, label: messages.value.userDetail.pnl30d, value: formatAmount(contract.pnl_30d), tone: amountTone(contract.pnl_30d) },
    { key: 'fee_30d' as const, label: messages.value.userDetail.fee30d, value: formatAmount(contract.fee_30d) },
    { key: 'last_trade_at' as const, label: messages.value.userDetail.lastContractTime, value: displayValue(contract.last_trade_at) },
  ]
})

const predictionMetrics = computed(() => {
  const prediction = detail.value?.prediction ?? {}
  return [
    { key: 'prediction_orders_30d' as const, label: messages.value.userDetail.predictionOrders30d, value: formatCount(prediction.orders_30d) },
    { key: 'prediction_win_orders' as const, label: messages.value.userDetail.predictionWinOrders, value: formatCount(prediction.win_orders) },
    { key: 'prediction_lose_orders' as const, label: messages.value.userDetail.predictionLoseOrders, value: formatCount(prediction.lose_orders) },
    { key: 'prediction_refund_orders' as const, label: messages.value.userDetail.predictionRefundOrders, value: formatCount(prediction.refund_orders) },
    { key: 'prediction_stake_30d' as const, label: messages.value.userDetail.predictionStake30d, value: formatAmount(prediction.stake_30d) },
    { key: 'prediction_return_30d' as const, label: messages.value.userDetail.predictionReturn30d, value: formatAmount(prediction.return_30d) },
    { key: 'prediction_net_profit_30d' as const, label: messages.value.userDetail.predictionNetProfit30d, value: formatAmount(prediction.net_profit_30d), tone: amountTone(prediction.net_profit_30d) },
    { key: 'prediction_last_at' as const, label: messages.value.userDetail.predictionLastAt, value: displayValue(prediction.last_prediction_at) },
  ]
})

function formatUpdatedAt(value: Date | string | undefined): string {
  const date = value instanceof Date ? value : value ? new Date(value) : new Date()
  if (!Number.isFinite(date.getTime())) return displayValue(value)
  const pad = (part: number) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function normalizedResult(result: UserDetailData | UserDetailRequestResult): UserDetailRequestResult {
  if ('data' in result && result.data && typeof result.data === 'object') return result
  return { data: result as UserDetailData }
}

async function load(): Promise<void> {
  const userId = props.userId
  if (userId === null || userId === undefined || String(userId).trim() === '') return
  requestController?.abort()
  requestController = new AbortController()
  const sequence = ++requestSequence
  loading.value = true
  loadError.value = ''
  detail.value = null
  activeTab.value = 'contract'

  try {
    const result = normalizedResult(await props.request(userId, { signal: requestController.signal }))
    if (requestController.signal.aborted || sequence !== requestSequence) return
    detail.value = result.data
    updatedAt.value = formatUpdatedAt(result.updatedAt)
    emit('loaded', result.data)
  }
  catch (error: unknown) {
    if (requestController.signal.aborted || sequence !== requestSequence) return
    const candidate = error as { message?: string, msg?: string } | null
    loadError.value = candidate?.msg || candidate?.message || messages.value.userDetail.loadFailed
    updatedAt.value = '-'
  }
  finally {
    if (sequence === requestSequence) loading.value = false
  }
}

function onMetricClick(key: UserDetailMetricKey): void {
  if (detail.value) emit('metric-click', key, detail.value)
}

watch(
  [() => props.modelValue, () => props.userId, () => props.requestKey],
  ([open]) => {
    if (open) void load()
    else requestController?.abort()
  },
  { immediate: true },
)

onMounted(() => {
  durationTimer = window.setInterval(() => {
    nowTimestamp.value = Date.now()
  }, 60_000)
})

onBeforeUnmount(() => {
  requestController?.abort()
  if (durationTimer !== undefined) window.clearInterval(durationTimer)
})

defineExpose({ reload: load })
</script>

<template>
  <MmDialog
    v-model="visible"
    :aria-describedby="detail ? 'mm-user-detail-description' : undefined"
    :close-on-click-modal="closeOnClickModal"
    overlay-class="mm-user-detail-dialog__overlay"
    panel-class="mm-user-detail-dialog__panel"
    :width="width"
  >
    <template #header>
      <div class="mm-user-detail-dialog__title">
        <strong>{{ messages.userDetail.title }}</strong>
        <span id="mm-user-detail-description">
          {{ userName }} · UID {{ detail?.user_id ?? userId ?? '-' }}
        </span>
      </div>
    </template>

    <template #header-actions>
      <slot name="header-actions" :detail="detail" :loading="loading" :reload="load">
        <MmButton v-if="loadError" size="sm" @click="load">
          <template #icon><MmIcon name="refresh-cw" :size="13" /></template>
          {{ messages.userDetail.retry }}
        </MmButton>
      </slot>
    </template>

    <div v-if="loading" class="mm-user-detail-dialog__state" role="status">
      <MmIcon class="is-loading" name="loader-circle" :size="24" />
      <strong>{{ messages.userDetail.loading }}</strong>
      <span>UID {{ userId || '-' }}</span>
    </div>

    <div v-else-if="loadError" class="mm-user-detail-dialog__state is-error" role="alert">
      <MmIcon name="alert" :size="24" />
      <strong>{{ messages.userDetail.loadFailedTitle }}</strong>
      <span>{{ loadError }}</span>
    </div>

    <div v-else-if="detail" class="mm-user-detail-dialog__content">
      <MmCard class="mm-user-detail-profile" bordered shadow="never">
        <div class="mm-user-detail-profile__identity">
          <MmAvatar :size="38" :fallback="userInitial">{{ userInitial }}</MmAvatar>
          <div class="mm-user-detail-profile__name">
            <strong>{{ userName }}</strong>
            <span>{{ externalUserId }}</span>
          </div>
          <div class="mm-user-detail-profile__badges">
            <slot name="user-type" :value="detail.user_type" :detail="detail">
              <MmTag round size="sm" :type="Number(detail.user_type) === 1 ? 'success' : 'info'">
                {{ Number(detail.user_type) === 1 ? messages.userDetail.live : Number(detail.user_type) === 2 ? messages.userDetail.internal : messages.userDetail.robot }}
              </MmTag>
            </slot>
            <MmTag round size="sm" type="warning">{{ formatVipLevel(detail.vip_level) }}</MmTag>
          </div>
        </div>

        <div class="mm-user-detail-profile__summary" role="list" :aria-label="messages.userDetail.basicInfo">
          <div v-for="item in [
            [messages.userDetail.userUid, detail.user_id],
            [messages.userDetail.username, userName],
            [messages.userDetail.externalUserId, externalUserId],
            [messages.userDetail.registerTime, formatOnlineUserDateTime(detail.created_at)],
            [messages.userDetail.lastLoginTime, formatOnlineUserDateTime(detail.last_login_at)],
          ]" :key="String(item[0])" class="mm-user-detail-field" role="listitem">
            <strong class="mm-user-detail-field__label">{{ item[0] }}</strong>
            <strong class="mm-user-detail-field__value">{{ item[1] }}</strong>
          </div>
        </div>
      </MmCard>

      <MmCard class="mm-user-detail-login" bordered shadow="never">
        <template #header>
          <div class="mm-user-detail-heading">
            <strong>{{ messages.userDetail.loginInfo }}</strong>
            <MmTag round size="sm" :type="isOnline ? 'success' : 'info'">
              <span class="mm-user-detail-presence-dot" />
              {{ isOnline ? messages.userDetail.online : messages.userDetail.offline }}
            </MmTag>
          </div>
          <span class="mm-user-detail-caption">
            {{ messages.userDetail.currentList(currentListLabel || messages.userDetail.currentPage) }}
          </span>
        </template>

        <div class="mm-user-detail-login__summary" :class="{ 'is-online': isOnline }" role="list" :aria-label="messages.userDetail.loginSummary">
          <div class="mm-user-detail-login-field is-location" role="listitem">
            <strong class="mm-user-detail-login-field__label">
              {{ isOnline ? messages.userDetail.loginIpRegion : messages.userDetail.lastLoginIpRegion }}
            </strong>
            <slot name="login-location" :detail="detail" :ip="detail.last_login_ip" :info="detail.last_login_ip_info">
              <MmIpLocation
                class="mm-user-detail-login-field__value"
                country-first
                :info="detail.last_login_ip_info"
                :ip="detail.last_login_ip"
                location-first
              />
            </slot>
          </div>
          <div class="mm-user-detail-login-field" role="listitem">
            <strong class="mm-user-detail-login-field__label">{{ isOnline ? messages.userDetail.loginTime : messages.userDetail.lastLoginTime }}</strong>
            <strong class="mm-user-detail-login-field__value">{{ formatOnlineUserDateTime(loginValue) }}</strong>
          </div>
          <div class="mm-user-detail-login-field" role="listitem">
            <strong class="mm-user-detail-login-field__label">{{ isOnline ? messages.userDetail.onlineDuration : messages.userDetail.currentSession }}</strong>
            <strong class="mm-user-detail-login-field__value">{{ isOnline ? onlineDuration : messages.userDetail.offlineSession }}</strong>
          </div>
          <div v-if="isOnline" class="mm-user-detail-login-field" role="listitem">
            <strong class="mm-user-detail-login-field__label">{{ messages.userDetail.lastActiveTime }}</strong>
            <strong class="mm-user-detail-login-field__value">{{ formatOnlineUserDateTime(lastActiveValue) }}</strong>
          </div>
        </div>
      </MmCard>

      <MmTabs v-model="activeTab" class="mm-user-detail-tabs">
        <MmTabPane :label="messages.userDetail.contract" name="contract">
          <MmCard class="mm-user-detail-business" bordered shadow="never">
            <template #header>
              <strong>{{ messages.userDetail.contract }}</strong>
              <span class="mm-user-detail-caption">{{ messages.userDetail.summary }}</span>
            </template>
            <div class="mm-user-detail-business__metrics">
              <article v-for="metric in metrics" :key="metric.key" class="mm-user-detail-metric">
                <span>{{ metric.label }}</span>
                <strong :class="metric.tone ? `is-${metric.tone}` : undefined">{{ metric.value }}</strong>
                <MmButton v-if="showMetricLinks" class="mm-user-detail-metric__link" size="sm" variant="text" @click="onMetricClick(metric.key)">
                  {{ messages.userDetail.goToPage }}
                  <MmIcon name="chevron-right" :size="11" />
                </MmButton>
              </article>
            </div>
          </MmCard>
        </MmTabPane>
        <MmTabPane :label="messages.userDetail.prediction" name="prediction">
          <MmCard class="mm-user-detail-business" bordered shadow="never">
            <template #header>
              <strong>{{ messages.userDetail.prediction }}</strong>
              <span class="mm-user-detail-caption">{{ messages.userDetail.summary }}</span>
            </template>
            <div class="mm-user-detail-business__metrics">
              <article v-for="metric in predictionMetrics" :key="metric.key" class="mm-user-detail-metric">
                <span>{{ metric.label }}</span>
                <strong :class="metric.tone ? `is-${metric.tone}` : undefined">{{ metric.value }}</strong>
                <MmButton v-if="showMetricLinks" class="mm-user-detail-metric__link" size="sm" variant="text" @click="onMetricClick(metric.key)">
                  {{ messages.userDetail.goToPage }}
                  <MmIcon name="chevron-right" :size="11" />
                </MmButton>
              </article>
            </div>
          </MmCard>
        </MmTabPane>
      </MmTabs>
    </div>

    <template #footer>
      <span class="mm-user-detail-dialog__updated-at">{{ messages.userDetail.updatedAt(updatedAt) }}</span>
    </template>
  </MmDialog>
</template>

<style src="./user-detail-dialog.css"></style>
