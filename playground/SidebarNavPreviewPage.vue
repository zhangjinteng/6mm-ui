<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type {
  AppHeaderAction,
  AppHeaderMetric,
  AppHeaderProfileItem,
  AppHeaderTheme,
  SidebarNavChildItem,
  SidebarNavItem,
} from '../src'
import { MmAppHeader, MmIcon, MmSidebarNav } from '../src'
import OnlineAccountsProTable from './OnlineAccountsProTable.vue'
import TradingAccountsProTable from './TradingAccountsProTable.vue'
import UserAssetsProTable from './UserAssetsProTable.vue'

const items: SidebarNavItem[] = [
  {
    children: [
      { icon: 'layout-dashboard', key: 'user-data', label: '用户数据' },
      { icon: 'bar-chart-3', key: 'funds-data', label: '资金数据' },
      { icon: 'chart-candlestick', key: 'futures-data', label: '合约数据' },
      { icon: 'coins', key: 'spot-data', label: '现货数据' },
    ],
    icon: 'layout-dashboard',
    key: 'overview',
    label: '经营总览',
  },
  {
    children: [
      { icon: 'users-round', key: 'online-accounts', label: '在线账户' },
      { icon: 'users', key: 'trading-accounts', label: '用户列表' },
      { icon: 'user', key: 'user-contracts', label: '用户合约' },
      { icon: 'wallet-cards', key: 'user-assets', label: '用户资产' },
      { icon: 'id-card', key: 'user-spot', label: '用户现货' },
      { icon: 'wallet-cards', key: 'user-c2c', label: '用户C2C' },
      { icon: 'receipt-text', key: 'external-mapping', label: '用户映射' },
    ],
    icon: 'users',
    key: 'users',
    label: '用户管理',
  },
  {
    children: [
      { icon: 'wallet-cards', key: 'guarantee', label: '保证金账户' },
      { icon: 'receipt-text', key: 'guarantee-flow', label: '保证金账变' },
      { icon: 'arrow-left-right', key: 'user-transfers', label: '用户划转' },
      { icon: 'badge-dollar-sign', key: 'merchant-earnings', label: '返佣记录' },
    ],
    icon: 'wallet-cards',
    key: 'funds',
    label: '资金管理',
  },
  {
    children: [
      { icon: 'plug-zap', key: 'integration', label: '接入概览' },
      { icon: 'key-round', key: 'api-credentials', label: 'API管理' },
      { icon: 'terminal', key: 'webhook-config', label: '联调工具' },
      { icon: 'scroll-text', key: 'api-logs', label: '调用日志' },
    ],
    icon: 'settings-2',
    key: 'config',
    label: '接入配置',
  },
]

const routeByKey: Record<string, string> = Object.fromEntries(items.flatMap((group) =>
  (group.children ?? [group]).map((item) => [
    String(item.key),
    `#/merchant/${String(group.key)}/${String(item.key)}`,
  ]),
))

function keyFromHash(): string {
  const route = window.location.hash
  return Object.entries(routeByKey).find(([, value]) => value === route)?.[0] ?? 'online-accounts'
}

const activeKey = ref<string | number>(keyFromHash())
const activeGroup = items.find((group) => group.children?.some((item) => item.key === activeKey.value))
const openKeys = ref<Array<string | number>>(activeGroup ? [activeGroup.key] : ['users'])
const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)
const theme = ref<AppHeaderTheme>('light')
const lastEvent = ref('READY / APP SHELL')

const metrics: AppHeaderMetric[] = [
  { key: 'available', label: '可用', value: '9,787,646.35' },
  { key: 'occupied', label: '占用', value: '162,124.99' },
  { key: 'total', label: '总保证金', tone: 'primary', value: '9,949,771.34' },
]
const contextActions: AppHeaderAction[] = [
  { icon: 'triangle-alert', key: 'guarantee', label: '保证金不足', tone: 'warning' },
  { icon: 'arrow-up-to-line', key: 'deposit', label: '充值', tone: 'primary' },
]
const profileItems: AppHeaderProfileItem[] = [
  { icon: 'user', key: 'personal-center', label: '个人中心' },
  { icon: 'key-round', key: 'change-password', label: '修改密码' },
  { icon: 'logout', key: 'logout', label: '退出登录', tone: 'danger' },
]
const logo = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="2" y="2" width="60" height="60" rx="13" fill="#ffffff" stroke="#bfe6df" stroke-width="2"/>
    <path d="M20 18h24L29 46h16" fill="none" stroke="#087765" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="20" cy="45" r="4" fill="#0accaa"/>
  </svg>
`)}`

const activeItem = computed(() => items
  .flatMap((group) => group.children ?? [group])
  .find((item) => item.key === activeKey.value))
const pageTitle = computed(() => activeItem.value?.label ?? '在线账户')
const isDataTablePage = computed(() => ['online-accounts', 'trading-accounts', 'user-assets'].includes(String(activeKey.value)))
const workspaceAriaLabel = computed(() => activeKey.value === 'online-accounts'
  ? '在线账户数据工作台'
  : activeKey.value === 'trading-accounts'
    ? '用户列表数据工作台'
    : activeKey.value === 'user-assets'
      ? '用户资产数据工作台'
      : undefined)

watch(theme, (value) => {
  document.documentElement.dataset.mmTheme = value
}, { immediate: true })

watch(mobileOpen, (value) => {
  lastEvent.value = `MOBILE NAV / ${value ? 'OPEN' : 'CLOSED'}`
})

function handleSelect(item: SidebarNavChildItem): void {
  window.location.hash = routeByKey[String(item.key)] ?? `#/merchant/${String(item.key)}`
  lastEvent.value = `ROUTE / ${String(item.key).toUpperCase()}`
}

function selectOnlineAccounts(): void {
  activeKey.value = 'online-accounts'
  openKeys.value = ['users']
  window.location.hash = routeByKey['online-accounts']!
}

function handleHeaderAction(action: AppHeaderAction): void {
  lastEvent.value = `ACTION / ${action.key.toUpperCase()}`
}
</script>

<template>
  <main
    class="sidebar-nav-preview-page mm-ui"
    :data-mm-theme="theme"
    :data-last-event="lastEvent"
    data-testid="sidebar-nav-preview-page"
  >
    <MmSidebarNav
      v-model="activeKey"
      v-model:collapsed="sidebarCollapsed"
      v-model:mobile-open="mobileOpen"
      v-model:open-keys="openKeys"
      aria-label="商户管理菜单"
      display="auto"
      :items="items"
      :width="240"
      @select="handleSelect"
    >
      <template #brand="{ collapsed }">
        <div class="sidebar-nav-preview-page__brand" :class="{ 'is-collapsed': collapsed }">
          <span>6</span><strong v-if="!collapsed">管理后台</strong>
        </div>
      </template>
      <template #footer="{ collapsed }">
        <button
          class="sidebar-nav-preview-page__online"
          :class="{ 'is-collapsed': collapsed }"
          type="button"
          aria-label="当前商户在线用户 7,320"
          @click="selectOnlineAccounts"
        >
          <MmIcon name="users-round" :size="15" />
          <template v-if="!collapsed"><span>在线用户</span><strong>7,320</strong></template>
        </button>
      </template>
    </MmSidebarNav>

    <section class="sidebar-nav-preview-page__shell">
      <MmAppHeader
        v-model:mobile-open="mobileOpen"
        v-model:sidebar-collapsed="sidebarCollapsed"
        v-model:theme="theme"
        aria-label="商户管理后台顶栏"
        :brand="{ alt: '6MM', logo, title: '管理后台' }"
        :context-actions="contextActions"
        display="auto"
        :identity="{ label: '商户', tone: 'merchant' }"
        :metrics="metrics"
        :page-title="pageTitle"
        :profile="{ alt: '管理员', email: 'ops@alphaembed.com', fallback: '管', items: profileItems }"
        summary-label="商户保证金数据"
        @action="handleHeaderAction"
        @identity-click="lastEvent = 'IDENTITY / MERCHANT'"
        @profile-click="lastEvent = 'PROFILE / ADMIN'"
        @profile-select="lastEvent = `PROFILE / ${$event.key.toUpperCase()}`"
        @theme-change="lastEvent = `THEME / ${$event.toUpperCase()}`"
        @toggle-sidebar="lastEvent = `SIDEBAR / ${$event ? 'COLLAPSED' : 'EXPANDED'}`"
      />

      <section
        class="sidebar-nav-preview-page__workspace"
        :class="{ 'is-pro-table': isDataTablePage }"
        :aria-label="workspaceAriaLabel"
        :aria-labelledby="isDataTablePage ? undefined : 'sidebar-nav-workspace-title'"
      >
        <OnlineAccountsProTable v-if="activeKey === 'online-accounts'" fill-height />
        <TradingAccountsProTable v-else-if="activeKey === 'trading-accounts'" fill-height />
        <UserAssetsProTable v-else-if="activeKey === 'user-assets'" fill-height />

        <template v-else>
          <header class="sidebar-nav-preview-page__workspace-header">
            <div>
              <span>LIVE COMPOSITION / APP HEADER + SIDEBAR NAV</span>
              <h1 id="sidebar-nav-workspace-title">{{ pageTitle }}</h1>
              <p>顶栏与侧栏共享折叠、移动抽屉和主题状态。</p>
            </div>
            <code data-testid="sidebar-nav-shell-event">{{ lastEvent }}</code>
          </header>

          <div class="sidebar-nav-preview-page__summary" aria-label="当前页面摘要">
            <article><small>ACTIVE ROUTE</small><strong>{{ String(activeKey).toUpperCase() }}</strong></article>
            <article><small>SIDEBAR</small><strong>{{ sidebarCollapsed ? 'COLLAPSED' : 'EXPANDED' }}</strong></article>
            <article><small>THEME</small><strong>{{ theme.toUpperCase() }}</strong></article>
          </div>

          <div class="sidebar-nav-preview-page__surface" aria-hidden="true">
            <div class="sidebar-nav-preview-page__surface-toolbar"><i /><i /><i /><span /></div>
            <div v-for="index in 7" :key="index" class="sidebar-nav-preview-page__surface-row">
              <i /><span /><span /><span /><b />
            </div>
          </div>
        </template>
      </section>
    </section>
  </main>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) { width: 100%; min-width: 320px; height: 100%; margin: 0; }
:global(body) { background: var(--mm-color-bg); font-family: var(--mm-font-family); }

.sidebar-nav-preview-page { width: 100%; height: 100vh; display: flex; overflow: hidden; align-items: stretch; background: var(--mm-color-bg); }
.sidebar-nav-preview-page__shell { min-width: 0; min-height: 0; display: flex; flex: 1 1 auto; overflow: hidden; flex-direction: column; }
.sidebar-nav-preview-page__brand { min-width: 0; display: flex; align-items: center; gap: 10px; color: var(--mm-color-text); }
.sidebar-nav-preview-page__brand > span { width: 31px; height: 31px; display: grid; flex: 0 0 31px; place-items: center; border-radius: 7px; color: var(--mm-color-on-primary); background: var(--mm-color-primary); font-weight: 800; }
.sidebar-nav-preview-page__brand > strong { overflow: hidden; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
.sidebar-nav-preview-page__online { width: 100%; min-height: 34px; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 7px; border: 0; border-radius: var(--mm-radius-sm); padding: 6px 7px; color: var(--mm-color-primary); background: transparent; cursor: pointer; text-align: left; }
.sidebar-nav-preview-page__online.is-collapsed { display: grid; grid-template-columns: 1fr; place-items: center; padding-inline: 0; }
.sidebar-nav-preview-page__online:hover { background: var(--mm-color-primary-soft); }
.sidebar-nav-preview-page__online:focus-visible { outline: 0; box-shadow: var(--mm-focus-ring); }
.sidebar-nav-preview-page__online > span { color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); }
.sidebar-nav-preview-page__online > strong { color: var(--mm-color-text); font: 750 10px/1 var(--mm-font-family-mono); }
.sidebar-nav-preview-page__workspace { min-height: 0; flex: 1 1 auto; overflow: auto; padding: clamp(18px, 3vw, 36px); background-color: var(--mm-color-bg); }
.sidebar-nav-preview-page__workspace.is-pro-table { overflow: hidden; padding: 12px; }
.sidebar-nav-preview-page__workspace-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; border: 1px solid var(--mm-color-line); padding: clamp(18px, 2.5vw, 28px); background: color-mix(in srgb, var(--mm-color-panel) 96%, transparent); box-shadow: var(--mm-shadow-sm); }
.sidebar-nav-preview-page__workspace-header > div { min-width: 0; }
.sidebar-nav-preview-page__workspace-header span { color: var(--mm-color-primary); font: 750 9px/1 var(--mm-font-family-mono); letter-spacing: .09em; }
.sidebar-nav-preview-page__workspace-header h1 { margin: 9px 0 6px; color: var(--mm-color-text); font-size: clamp(22px, 3vw, 34px); line-height: 1; }
.sidebar-nav-preview-page__workspace-header p { margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-sm); }
.sidebar-nav-preview-page__workspace-header code { flex: 0 0 auto; color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .06em; }
.sidebar-nav-preview-page__summary { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); border: 1px solid var(--mm-color-line); border-top: 0; background: var(--mm-color-panel); }
.sidebar-nav-preview-page__summary article { min-width: 0; display: grid; gap: 8px; padding: 16px 18px; }
.sidebar-nav-preview-page__summary article + article { border-left: 1px solid var(--mm-color-line); }
.sidebar-nav-preview-page__summary small { color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.sidebar-nav-preview-page__summary strong { overflow: hidden; color: var(--mm-color-primary); font: 750 11px/1 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.sidebar-nav-preview-page__surface { overflow: hidden; border: 1px solid var(--mm-color-line); margin-top: 22px; background: var(--mm-color-panel); box-shadow: var(--mm-shadow-sm); }
.sidebar-nav-preview-page__surface-toolbar { min-height: 48px; display: grid; grid-template-columns: 150px 120px 120px 1fr; align-items: center; gap: 10px; border-bottom: 1px solid var(--mm-color-line); padding: 8px 12px; background: var(--mm-color-soft); }
.sidebar-nav-preview-page__surface-toolbar i,
.sidebar-nav-preview-page__surface-toolbar span { height: 30px; border: 1px solid var(--mm-color-line); border-radius: 5px; background: var(--mm-color-panel); }
.sidebar-nav-preview-page__surface-row { min-width: 620px; min-height: 51px; display: grid; grid-template-columns: 34px 1.2fr 1fr 1fr 90px; align-items: center; gap: 18px; border-bottom: 1px solid var(--mm-color-line); padding: 0 16px; }
.sidebar-nav-preview-page__surface-row:last-child { border-bottom: 0; }
.sidebar-nav-preview-page__surface-row i { width: 14px; height: 14px; border: 1px solid var(--mm-color-line-strong); border-radius: 3px; }
.sidebar-nav-preview-page__surface-row span,
.sidebar-nav-preview-page__surface-row b { height: 7px; border-radius: 4px; background: var(--mm-color-line); }
.sidebar-nav-preview-page__surface-row b { background: color-mix(in srgb, var(--mm-color-primary) 28%, var(--mm-color-line)); }

@media (max-width: 900px) {
  .sidebar-nav-preview-page__shell { width: 100%; }
  .sidebar-nav-preview-page__workspace { padding: 16px; }
  .sidebar-nav-preview-page__workspace-header { align-items: flex-start; flex-direction: column; gap: 14px; }
  .sidebar-nav-preview-page__summary { grid-template-columns: 1fr; }
  .sidebar-nav-preview-page__summary article + article { border-top: 1px solid var(--mm-color-line); border-left: 0; }
  .sidebar-nav-preview-page__surface { overflow-x: auto; }
}

@media (max-width: 520px) {
  .sidebar-nav-preview-page__workspace { padding: 10px; }
  .sidebar-nav-preview-page__workspace-header { padding: 16px; }
  .sidebar-nav-preview-page__workspace-header h1 { font-size: 24px; }
  .sidebar-nav-preview-page__workspace-header p { line-height: 1.6; }
  .sidebar-nav-preview-page__surface-toolbar { min-width: 620px; }
}
</style>
