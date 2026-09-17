<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  MmAvatar,
  MmButton,
  MmCard,
  MmDescriptions,
  MmDescriptionsItem,
  MmDialog,
  MmIcon,
  MmRadio,
  MmRadioGroup,
  MmStatistic,
  MmTabPane,
  MmTabs,
  MmTag,
  MmUserTable,
  type TabsValue,
  type UserListQuery,
  type UserRequestContext,
} from '../src'
import {
  resolveUserAccounts,
  type TradingAccountRow,
  type TradingAccountType,
} from './trading-accounts-fixture'

const props = withDefaults(defineProps<{ ariaLabel?: string, fillHeight?: boolean }>(), {
  ariaLabel: '商户用户列表高级表格',
  fillHeight: false,
})

const defaultUserType = ref<TradingAccountType>('live')
const defaultTypeDialogOpen = ref(false)
const draftDefaultUserType = ref<TradingAccountType>('live')
const detailOpen = ref(false)
const detailTab = ref<TabsValue>('contracts')
const selectedAccount = ref<TradingAccountRow>()

interface DetailMetric {
  label: string
  trend?: 'down' | 'neutral' | 'up'
  value: string
}

const contractMetrics: DetailMetric[] = [
  { label: '账户余额(U)', value: '8,654.50' },
  { label: '持仓量(U)', value: '5,200.35' },
  { label: '仓位数量', value: '3' },
  { label: '委托数', value: '1' },
  { label: '未实现盈亏(U)', trend: 'up', value: '+125.93' },
  { label: '30日累计盈亏(U)', trend: 'up', value: '+862.45' },
  { label: '30日手续费(U)', value: '31.68' },
  { label: '最后合约时间', value: '2026-07-11 10:28' },
]
const spotMetrics: DetailMetric[] = [
  { label: '现货资产(U)', value: '6,290.48' },
  { label: '持有币种数', value: '8' },
  { label: '当前委托数', value: '2' },
  { label: '委托冻结(U)', value: '0.00' },
  { label: '30日成交量(U)', value: '82,640.12' },
  { label: '30日手续费(U)', value: '6.18' },
  { label: '最后现货时间', value: '2026-07-11 10:28' },
]
const c2cMetrics: DetailMetric[] = [
  { label: '订单总数', value: '42' },
  { label: '完成订单', value: '39' },
  { label: '取消订单', value: '2' },
  { label: '申诉次数', value: '1' },
  { label: '30日交易金额(U)', value: '8,290.48' },
  { label: '30日手续费(U)', value: '8.29' },
  { label: '完成率', value: '92.86%' },
  { label: '最后C2C时间', value: '2026-07-11 10:28' },
]

const businessTabs = [
  { label: '用户合约', metrics: contractMetrics, name: 'contracts', tone: 'contract' },
  { label: '用户现货', metrics: spotMetrics, name: 'spot', tone: 'spot' },
  { label: '用户C2C', metrics: c2cMetrics, name: 'c2c', tone: 'c2c' },
] as const

const selectedAccountOnline = computed(() => {
  const sequence = Number(selectedAccount.value?.username.match(/\d+$/)?.[0])
  return Number.isFinite(sequence) && sequence % 2 === 1
})

function waitForRequest(signal: AbortSignal, delay = 240): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, delay)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(new Error('request aborted'))
    }, { once: true })
  })
}

async function requestAccounts(query: UserListQuery, context: UserRequestContext) {
  await waitForRequest(context.signal)
  return { ...resolveUserAccounts(query), updatedAt: new Date() }
}

function typeLabel(value: TradingAccountType): string {
  return value === 'live' ? '实盘' : '内盘'
}

function formatMetricValue(value: number | string): string {
  return String(value)
}

function openDefaultTypeDialog(): void {
  draftDefaultUserType.value = defaultUserType.value
  defaultTypeDialogOpen.value = true
}

function saveDefaultType(): void {
  defaultUserType.value = draftDefaultUserType.value
  defaultTypeDialogOpen.value = false
}

function openDetail(row: TradingAccountRow): void {
  selectedAccount.value = { ...row }
  detailTab.value = 'contracts'
  detailOpen.value = true
}

function toggleSelectedType(): void {
  if (!selectedAccount.value) return
  selectedAccount.value = {
    ...selectedAccount.value,
    userType: selectedAccount.value.userType === 'live' ? 'internal' : 'live',
  }
}
</script>

<template>
  <MmUserTable
    class="trading-accounts-pro-table"
    :aria-label="props.ariaLabel"
    :fill-height="props.fillHeight"
    :page-sizes="[20, 50, 100]"
    :request="requestAccounts"
  >
    <template #query-actions>
      <MmButton
        class="trading-accounts-pro-table__default-type"
        :aria-label="`设置新用户默认类型，当前${typeLabel(defaultUserType)}`"
        size="sm"
        @click="openDefaultTypeDialog"
      >
        <template #icon><MmIcon name="settings-2" :size="13" /></template>
        <span>新用户默认：</span><strong>{{ typeLabel(defaultUserType) }}</strong>
      </MmButton>
    </template>

    <template #cell-user_id="{ row }">
      <MmButton
        class="trading-accounts-pro-table__uid"
        size="sm"
        variant="text"
        :aria-label="`查看用户 ${row.uid}`"
        @click.stop="openDetail(row)"
      >{{ row.uid }}</MmButton>
    </template>
    <template #cell-user_type="{ row }">
      <MmTag round size="sm" :type="row.userType === 'live' ? 'primary' : 'info'">{{ row.userType === 'live' ? '实盘' : '内盘' }}</MmTag>
    </template>
    <template #cell-login_ip="{ row }">
      <div class="trading-accounts-pro-table__location">
        <strong>{{ row.flag }} {{ row.location }}</strong>
        <small>IP: {{ row.loginIp }}</small>
      </div>
    </template>
  </MmUserTable>

  <MmDialog
    v-model="defaultTypeDialogOpen"
    aria-describedby="new-client-type-dialog-description"
    panel-class="new-client-type-dialog-panel"
    :width="500"
  >
    <template #header>
      <div class="new-client-type-dialog__header">
        <strong>新客类型</strong>
        <span>仅对新客生效</span>
      </div>
    </template>

    <section id="new-client-type-dialog-description" class="new-client-type-dialog__body">
      <p>请选择新客默认类型。</p>
      <MmRadioGroup
        v-model="draftDefaultUserType"
        aria-label="新客默认类型"
        class="new-client-type-dialog__options"
        name="new-client-default-type"
      >
        <MmRadio button class="new-client-type-dialog__option" value="live">
          <span class="new-client-type-dialog__option-copy">
            <MmTag round size="sm" type="primary">实盘</MmTag>
            <span>真实交易</span>
          </span>
          <MmIcon class="new-client-type-dialog__check" name="check" :size="14" />
        </MmRadio>
        <MmRadio button class="new-client-type-dialog__option" value="internal">
          <span class="new-client-type-dialog__option-copy">
            <MmTag round size="sm" type="info">内盘</MmTag>
            <span>内部交易</span>
          </span>
          <MmIcon class="new-client-type-dialog__check" name="check" :size="14" />
        </MmRadio>
      </MmRadioGroup>
      <p class="new-client-type-dialog__note">已有用户保持不变。</p>
    </section>

    <template #footer>
      <MmButton @click="defaultTypeDialogOpen = false">取消</MmButton>
      <MmButton variant="primary" @click="saveDefaultType">确认保存</MmButton>
    </template>
  </MmDialog>

  <MmDialog
    v-model="detailOpen"
    panel-class="trading-account-detail-dialog"
    width="min(1180px, calc(100vw - 40px))"
  >
    <template #header>
      <div v-if="selectedAccount" class="trading-account-detail__dialog-header">
        <div class="trading-account-detail__dialog-title">
          <strong>用户详情</strong>
          <span>{{ selectedAccount.username }} · UID {{ selectedAccount.uid }}</span>
        </div>
      </div>
    </template>
    <template v-if="selectedAccount" #header-actions>
      <MmButton class="trading-account-detail__type-switch" size="sm" @click="toggleSelectedType">
          <template #icon><MmIcon name="arrow-left-right" :size="13" /></template>
          切换类型
      </MmButton>
    </template>

    <div v-if="selectedAccount" class="trading-account-detail" data-testid="trading-account-detail">
      <MmCard class="trading-account-detail__profile-card">
        <section class="trading-account-detail__profile">
          <MmAvatar :fallback="selectedAccount.username.slice(0, 1).toUpperCase()" :size="38" />
          <div class="trading-account-detail__name">
            <strong>{{ selectedAccount.username }}</strong>
            <span>{{ selectedAccount.externalId }}</span>
          </div>
          <div class="trading-account-detail__badges">
            <MmTag round size="sm" :type="selectedAccount.userType === 'live' ? 'primary' : 'info'">{{ typeLabel(selectedAccount.userType) }}</MmTag>
            <MmTag round size="sm" type="warning">{{ selectedAccount.vipLevel }}</MmTag>
          </div>
        </section>

        <MmDescriptions bordered :column="5" direction="vertical" size="sm">
          <MmDescriptionsItem label="用户 UID"><strong>{{ selectedAccount.uid }}</strong></MmDescriptionsItem>
          <MmDescriptionsItem label="用户名"><strong>{{ selectedAccount.username }}</strong></MmDescriptionsItem>
          <MmDescriptionsItem label="外部用户 ID"><strong>{{ selectedAccount.externalId }}</strong></MmDescriptionsItem>
          <MmDescriptionsItem label="注册时间"><strong>{{ selectedAccount.registeredAt }}</strong></MmDescriptionsItem>
          <MmDescriptionsItem label="最后登录时间"><strong>{{ selectedAccount.lastLoginAt }}</strong></MmDescriptionsItem>
        </MmDescriptions>
      </MmCard>

      <MmCard class="trading-account-detail__login-card" aria-label="登录信息">
        <template #header>
          <div class="trading-account-detail__login-title">
            <strong>登录信息</strong>
            <MmTag round size="sm" :type="selectedAccountOnline ? 'success' : 'default'">
              <template #icon><i class="trading-account-detail__presence-dot" /></template>
              {{ selectedAccountOnline ? '在线' : '离线' }}
            </MmTag>
          </div>
          <span>当前列表：用户列表</span>
        </template>
        <div class="trading-account-detail__login-grid">
          <div class="trading-account-detail__login-location">
            <span>登录 IP / 地区</span>
            <strong>{{ selectedAccount.flag }} {{ selectedAccount.location }}</strong>
            <small>IP: {{ selectedAccount.loginIp }}</small>
          </div>
          <div v-if="selectedAccountOnline"><span>在线时长</span><strong>6小时12分钟</strong></div>
          <div><span>{{ selectedAccountOnline ? '最后活跃时间' : '最后登录时间' }}</span><strong>{{ selectedAccount.lastLoginAt }}</strong></div>
          <div v-if="selectedAccountOnline"><span>当前会话</span><strong>活跃</strong></div>
          <div v-else class="trading-account-detail__offline-note"><span>当前会话</span><strong>用户当前不在线，无在线时长</strong></div>
        </div>
      </MmCard>

      <section class="trading-account-detail__business">
        <MmTabs v-model="detailTab" aria-label="用户业务详情">
          <MmTabPane v-for="business in businessTabs" :key="business.name" :name="business.name" :label="business.label">
            <MmCard
              class="trading-account-detail__business-card"
              :class="[`is-${business.tone}`, { 'is-count-seven': business.metrics.length === 7 }]"
            >
              <template #header><strong>{{ business.label }}</strong><span>用户汇总</span></template>
              <MmStatistic
                v-for="item in business.metrics"
                :key="item.label"
                :formatter="formatMetricValue"
                :title="item.label"
                :trend="item.trend"
                :value="item.value"
              />
            </MmCard>
          </MmTabPane>
        </MmTabs>
      </section>
    </div>

    <template v-if="selectedAccount" #footer>
      <span class="trading-account-detail__updated-at">数据更新时间：{{ selectedAccount.lastLoginAt }}</span>
    </template>
  </MmDialog>
</template>

<style scoped>
.trading-accounts-pro-table :deep(.mm-pro-table__auto-refresh) { display: none; }
.trading-accounts-pro-table :deep(.mm-table th),
.trading-accounts-pro-table :deep(.mm-table td) { min-width: 0; padding: 6px 9px; }
.trading-accounts-pro-table :deep(.mm-pro-table__pagination .mm-pagination__size) {
  width: 102px;
  min-width: 102px;
  flex-basis: 102px;
}
.trading-accounts-pro-table__default-type { gap: 5px; color: var(--mm-color-text-muted); white-space: nowrap; }
.trading-accounts-pro-table__default-type strong { color: var(--mm-color-primary); font-size: 10px; }
.trading-accounts-pro-table__uid { min-height: 24px; padding: 0; color: var(--mm-color-primary); font-family: var(--mm-font-family-mono); font-weight: 800; }
.trading-accounts-pro-table__location { min-width: 0; display: grid; gap: 2px; }
.trading-accounts-pro-table__location strong { overflow: hidden; color: var(--mm-color-text); font-size: 11px; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
.trading-accounts-pro-table__location small { color: var(--mm-color-text-subtle); font: 9px/1.2 var(--mm-font-family-mono); }

:global(.new-client-type-dialog-panel .mm-dialog__header) { min-height: 60px; padding-inline: 18px 14px; }
:global(.new-client-type-dialog-panel .mm-dialog__body) { padding: 20px 18px 18px; }
.new-client-type-dialog__header { min-width: 0; display: grid; gap: 2px; }
.new-client-type-dialog__header strong { color: var(--mm-color-text); font-size: 15px; line-height: 1.25; }
.new-client-type-dialog__header span { color: var(--mm-color-text-subtle); font-size: 11px; font-weight: 500; line-height: 1.25; }
.new-client-type-dialog__body { display: grid; gap: 14px; }
.new-client-type-dialog__body > p { margin: 0; color: var(--mm-color-text); font-size: 12px; }
.new-client-type-dialog__options { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.new-client-type-dialog__option.mm-radio--button {
  width: 100%;
  min-height: 74px;
  justify-content: space-between;
  border-color: var(--mm-color-line-strong);
  border-radius: var(--mm-radius-md);
  padding: 14px 12px;
  color: var(--mm-color-text);
  background: var(--mm-color-panel);
}
.new-client-type-dialog__option.mm-radio--button:hover:not(.is-disabled):not(.is-checked) { border-color: var(--mm-color-primary); color: var(--mm-color-text); }
.new-client-type-dialog__option.mm-radio--button.is-checked {
  border-color: var(--mm-color-primary);
  color: var(--mm-color-text);
  background: color-mix(in srgb, var(--mm-color-primary-soft) 72%, var(--mm-color-panel));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--mm-color-primary) 15%, transparent);
}
.new-client-type-dialog__option :deep(.mm-radio__label) { min-width: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.new-client-type-dialog__option-copy { min-width: 0; display: flex; align-items: center; gap: 9px; }
.new-client-type-dialog__option-copy > span { overflow: hidden; color: var(--mm-color-text-muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.new-client-type-dialog__check { flex: 0 0 auto; color: var(--mm-color-primary); opacity: 0; transition: opacity var(--mm-duration-fast); }
.new-client-type-dialog__option.is-checked .new-client-type-dialog__check { opacity: 1; }
.new-client-type-dialog__body > .new-client-type-dialog__note { color: var(--mm-color-text-subtle); font-size: 11px; }

:global(.trading-account-detail-dialog .mm-dialog__header) { min-height: 62px; padding: 10px 14px 10px 16px; }
:global(.trading-account-detail-dialog .mm-dialog__title) { display: flex; align-items: center; }
:global(.trading-account-detail-dialog .mm-dialog__body) { padding: 15px; background: var(--mm-color-soft); }
:global(.trading-account-detail-dialog .mm-dialog__footer) { min-height: 42px; justify-content: flex-start; padding: 8px 16px; }

.trading-account-detail__dialog-header { width: 100%; min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.trading-account-detail__dialog-title { min-width: 0; display: grid; gap: 3px; }
.trading-account-detail__dialog-title strong { color: var(--mm-color-text); font-size: 17px; line-height: 1.2; }
.trading-account-detail__dialog-title span { overflow: hidden; color: var(--mm-color-text-muted); font: 11px/1.3 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.trading-account-detail__type-switch { flex: 0 0 auto; color: var(--mm-color-text-muted); }
.trading-account-detail__type-switch :deep(.mm-button__icon) { color: var(--mm-color-primary); }

.trading-account-detail { display: grid; gap: 12px; }
.trading-account-detail__profile-card { border-radius: var(--mm-radius-md); }
.trading-account-detail__profile-card :deep(.mm-card__body) { padding: 0; }
.trading-account-detail__profile { min-width: 0; display: flex; align-items: center; gap: 11px; padding: 12px; }
.trading-account-detail__name { min-width: 0; display: grid; gap: 3px; }
.trading-account-detail__name strong { overflow: hidden; color: var(--mm-color-text); font-size: 15px; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; }
.trading-account-detail__name span { color: var(--mm-color-text-muted); font: 11px/1.2 var(--mm-font-family-mono); }
.trading-account-detail__badges { display: flex; align-items: center; gap: 7px; margin-left: auto; }
.trading-account-detail__profile-card :deep(.mm-descriptions__grid) { border-width: 1px 0 0; border-radius: 0; }
.trading-account-detail__profile-card :deep(.mm-descriptions-item__content) { font-variant-numeric: tabular-nums; }

.trading-account-detail__login-card { border-radius: var(--mm-radius-md); }
.trading-account-detail__login-card :deep(.mm-card__header) { min-height: 42px; padding: 9px 12px; }
.trading-account-detail__login-card :deep(.mm-card__header > span) { color: var(--mm-color-text-muted); font-size: 11px; }
.trading-account-detail__login-card :deep(.mm-card__body) { padding: 0; }
.trading-account-detail__login-title { display: flex; align-items: center; gap: 8px; }
.trading-account-detail__login-title > strong { color: var(--mm-color-text); font-size: 13px; }
.trading-account-detail__presence-dot { width: 6px; height: 6px; display: block; border-radius: 50%; background: currentColor; }
.trading-account-detail__login-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) repeat(3, minmax(0, 1fr)); }
.trading-account-detail__login-grid > div { min-width: 0; display: grid; align-content: center; gap: 5px; border-right: 1px solid var(--mm-color-line); padding: 10px 12px; }
.trading-account-detail__login-grid > div:last-child { border-right: 0; }
.trading-account-detail__login-grid span { color: var(--mm-color-text-muted); font-size: 11px; }
.trading-account-detail__login-grid strong { overflow-wrap: anywhere; color: var(--mm-color-text); font-size: 12px; font-variant-numeric: tabular-nums; }
.trading-account-detail__login-grid small { color: var(--mm-color-text-muted); font: 10px/1.2 var(--mm-font-family-mono); }
.trading-account-detail__login-location { gap: 3px; }
.trading-account-detail__offline-note { grid-column: span 2; }

.trading-account-detail__business { min-width: 0; margin-top: 2px; }
.trading-account-detail__business :deep(.mm-tabs__list) { gap: 8px; padding-inline: 4px; }
.trading-account-detail__business :deep(.mm-tabs__tab) { min-width: 88px; }
.trading-account-detail__business :deep(.mm-tabs__panels) { padding-top: 10px; }
.trading-account-detail__business-card { border-radius: var(--mm-radius-md); }
.trading-account-detail__business-card :deep(.mm-card__header) { min-height: 42px; border-top: 3px solid var(--mm-color-primary); padding: 8px 11px; }
.trading-account-detail__business-card.is-spot :deep(.mm-card__header) { border-top-color: var(--mm-color-info); }
.trading-account-detail__business-card.is-c2c :deep(.mm-card__header) { border-top-color: var(--mm-color-warning); }
.trading-account-detail__business-card :deep(.mm-card__header > strong) { color: var(--mm-color-text); font-size: 13px; }
.trading-account-detail__business-card :deep(.mm-card__header > span) { color: var(--mm-color-text-muted); font-size: 10px; }
.trading-account-detail__business-card :deep(.mm-card__body) { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; padding: 0; background: var(--mm-color-line); }
.trading-account-detail__business-card :deep(.mm-statistic) { min-width: 0; min-height: 66px; align-content: center; gap: 5px; padding: 9px 11px; background: var(--mm-color-panel); }
.trading-account-detail__business-card :deep(.mm-statistic__title) { overflow: hidden; color: var(--mm-color-text-muted); font-size: 11px; letter-spacing: 0; text-overflow: ellipsis; white-space: nowrap; }
.trading-account-detail__business-card :deep(.mm-statistic__number) { overflow-wrap: anywhere; color: var(--mm-color-text); font: 650 13px/1.25 var(--mm-font-family-mono); letter-spacing: 0; }
.trading-account-detail__business-card :deep(.mm-statistic__trend) { font-size: 12px; }
.trading-account-detail__business-card.is-count-seven :deep(.mm-statistic:last-child) { grid-column: span 2; }
.trading-account-detail__updated-at { color: var(--mm-color-text-muted); font-size: 11px; }

@media (max-width: 900px) {
  .trading-account-detail__profile-card :deep(.mm-descriptions__grid) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .trading-account-detail__profile-card :deep(.mm-descriptions-item) { grid-column: auto; }
  .trading-account-detail__profile-card :deep(.mm-descriptions-item:last-child) { grid-column: span 2; }
  .trading-account-detail__login-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .trading-account-detail__login-grid > div:nth-child(2n) { border-right: 0; }
  .trading-account-detail__login-grid > div:nth-child(-n + 2) { border-bottom: 1px solid var(--mm-color-line); }
  .trading-account-detail__business-card :deep(.mm-card__body) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 520px) {
  .new-client-type-dialog__options { grid-template-columns: 1fr; }
  :global(.trading-account-detail-dialog .mm-dialog__body) { padding: 10px; }
  .trading-account-detail__dialog-header { gap: 8px; }
  .trading-account-detail__dialog-title strong { font-size: 15px; }
  .trading-account-detail__profile { flex-wrap: wrap; }
  .trading-account-detail__badges { width: 100%; margin-left: 49px; }
  .trading-account-detail__login-card :deep(.mm-card__header) { align-items: flex-start; flex-direction: column; gap: 5px; }
}
</style>
