<script setup lang="ts">
import { computed, ref } from 'vue'

import type { SidebarNavChildItem, SidebarNavItem } from '../src'
import { MmButton, MmIcon, MmSidebarNav } from '../src'

const props = withDefaults(defineProps<{ expanded?: boolean }>(), { expanded: false })

const activeKey = ref<string | number>('online-accounts')
const openKeys = ref<Array<string | number>>(['users'])
const collapsed = ref(false)
const mobileOpen = ref(false)
const activeRoute = ref('#/merchant/users/online-accounts')

const items: SidebarNavItem[] = [
  {
    children: [
      { icon: 'layout-dashboard', key: 'user-data', label: '用户数据' },
      { icon: 'bar-chart-3', key: 'funds-data', label: '资金数据' },
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
    ],
    icon: 'users',
    key: 'users',
    label: '用户管理',
  },
  {
    children: [
      { icon: 'wallet-cards', key: 'guarantee', label: '保证金账户' },
      { icon: 'receipt-text', key: 'user-transfers', label: '用户划转' },
    ],
    icon: 'wallet-cards',
    key: 'funds',
    label: '资金管理',
  },
  {
    children: [
      { icon: 'plug-zap', key: 'integration', label: '接入概览' },
      { icon: 'key-round', key: 'api-credentials', label: 'API管理' },
    ],
    icon: 'settings-2',
    key: 'config',
    label: '接入配置',
  },
]

const visibleItems = computed(() => props.expanded ? items : items.slice(0, 3))
const routeByKey: Record<string, string> = {
  'api-credentials': '#/merchant/config/api-credentials',
  'funds-data': '#/merchant/overview/funds-data',
  guarantee: '#/merchant/funds/guarantee',
  integration: '#/merchant/config/integration',
  'online-accounts': '#/merchant/users/online-accounts',
  'trading-accounts': '#/merchant/users/trading-accounts',
  'user-contracts': '#/merchant/users/user-contracts',
  'user-assets': '#/merchant/users/user-assets',
  'user-data': '#/merchant/overview/user-data',
  'user-spot': '#/merchant/users/user-spot',
  'user-transfers': '#/merchant/funds/user-transfers',
}

function handleSelect(item: SidebarNavChildItem): void {
  activeRoute.value = routeByKey[String(item.key)] ?? `#/merchant/${String(item.key)}`
}

function selectOnlineAccounts(): void {
  activeKey.value = 'online-accounts'
  activeRoute.value = routeByKey['online-accounts']!
}
</script>

<template>
  <div class="agent-sidebar-preview">
    <div class="agent-sidebar-preview__tools">
      <span><small>AGENT SIDEBAR</small><strong data-testid="sidebar-active-route">{{ activeRoute }}</strong></span>
      <MmButton data-testid="sidebar-collapse-toggle" size="sm" @click="collapsed = !collapsed">
        <template #icon><MmIcon :name="collapsed ? 'panel-right-open' : 'panel-left-close'" :size="14" /></template>
        {{ collapsed ? '展开' : '收起' }}
      </MmButton>
      <MmButton data-testid="sidebar-mobile-toggle" size="sm" @click="mobileOpen = true">移动菜单</MmButton>
    </div>

    <div class="agent-sidebar-preview__stage">
      <MmSidebarNav
        v-model="activeKey"
        v-model:open-keys="openKeys"
        :collapsed="collapsed"
        display="desktop"
        :items="visibleItems"
        aria-label="商户管理菜单"
        @select="handleSelect"
      >
        <template #brand="{ collapsed: compact }">
          <div class="agent-sidebar-preview__brand"><span>6</span><strong v-if="!compact">管理后台</strong></div>
        </template>
        <template #footer="{ collapsed: compact }">
          <MmButton
            aria-label="当前商户在线用户 7,320"
            class="agent-sidebar-preview__online"
            :icon-only="compact"
            size="sm"
            variant="text"
            @click="selectOnlineAccounts"
          >
            <template #icon><MmIcon name="users-round" :size="15" /></template>
            <span v-if="!compact">在线用户</span><strong v-if="!compact">7,320</strong>
          </MmButton>
        </template>
      </MmSidebarNav>
    </div>

    <MmSidebarNav
      v-model="activeKey"
      v-model:mobile-open="mobileOpen"
      v-model:open-keys="openKeys"
      display="mobile"
      :items="items"
      aria-label="商户移动菜单"
      @select="handleSelect"
    >
      <template #brand><div class="agent-sidebar-preview__brand"><span>6</span><strong>管理后台</strong></div></template>
      <template #footer>
        <MmButton class="agent-sidebar-preview__online" size="sm" variant="text" @click="selectOnlineAccounts">
          <template #icon><MmIcon name="users-round" :size="15" /></template>
          在线用户 <strong>7,320</strong>
        </MmButton>
      </template>
    </MmSidebarNav>
  </div>
</template>

<style scoped>
.agent-sidebar-preview { width: 100%; display: grid; overflow: hidden; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); background: var(--mm-color-panel); }
.agent-sidebar-preview__tools { min-height: 44px; display: flex; align-items: center; justify-content: flex-end; gap: 6px; border-bottom: 1px solid var(--mm-color-line); padding: 7px 9px; background: var(--mm-color-soft); }
.agent-sidebar-preview__tools > span { min-width: 0; display: grid; gap: 4px; margin-right: auto; }
.agent-sidebar-preview__tools small { color: var(--mm-color-primary); font: 750 8px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.agent-sidebar-preview__tools strong { max-width: 230px; overflow: hidden; color: var(--mm-color-text-muted); font: 700 9px/1 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.agent-sidebar-preview__stage { height: 430px; display: flex; align-items: stretch; background: color-mix(in srgb, var(--mm-color-bg) 88%, var(--mm-color-panel)); }
.agent-sidebar-preview__brand { min-width: 0; display: flex; align-items: center; gap: 9px; color: var(--mm-color-text); }
.agent-sidebar-preview__brand > span { width: 31px; height: 31px; display: grid; flex: 0 0 31px; place-items: center; border: 1px solid color-mix(in srgb, var(--mm-color-primary) 36%, var(--mm-color-line)); border-radius: 7px; color: var(--mm-color-on-primary); background: var(--mm-color-primary); font-weight: 800; }
.agent-sidebar-preview__brand > strong { font-size: 14px; white-space: nowrap; }
.agent-sidebar-preview__online { width: 100%; justify-content: flex-start; color: var(--mm-color-primary); }
.agent-sidebar-preview__online > span { flex: 1 1 auto; text-align: left; }
.agent-sidebar-preview__online > strong { color: var(--mm-color-text); font: 750 10px/1 var(--mm-font-family-mono); }

@media (max-width: 560px) {
  .agent-sidebar-preview__tools { align-items: stretch; flex-wrap: wrap; }
  .agent-sidebar-preview__tools > span { width: 100%; }
  .agent-sidebar-preview__stage { height: 390px; }
}
</style>
