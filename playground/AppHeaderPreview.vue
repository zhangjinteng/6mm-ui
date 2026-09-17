<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  MmAppHeader,
  MmButton,
  type AppHeaderAction,
  type AppHeaderMetric,
  type AppHeaderProfileItem,
  type AppHeaderTheme,
} from '../src'

const props = withDefaults(defineProps<{ expanded?: boolean }>(), {
  expanded: false,
})

type PreviewDevice = 'desktop' | 'mobile' | 'tablet'

const devices: Array<{ label: string, value: PreviewDevice, width: number }> = [
  { label: '桌面', value: 'desktop', width: 960 },
  { label: '平板', value: 'tablet', width: 768 },
  { label: '手机', value: 'mobile', width: 390 },
]
const device = ref<PreviewDevice>(props.expanded ? 'desktop' : 'mobile')
const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)
const headerTheme = ref<AppHeaderTheme>('light')
const lastEvent = ref('READY / APP HEADER')

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

const activeDevice = computed(() => devices.find((item) => item.value === device.value) ?? devices[0]!)
const forcedDisplay = computed(() => device.value === 'desktop' ? 'desktop' : 'mobile')
const frameStyle = computed(() => ({ width: `${activeDevice.value.width}px` }))

function setDevice(value: PreviewDevice): void {
  device.value = value
  mobileOpen.value = false
  lastEvent.value = `DEVICE / ${value.toUpperCase()}`
}

function handleAction(action: AppHeaderAction): void {
  lastEvent.value = `ACTION / ${action.key.toUpperCase()}`
}
</script>

<template>
  <section
    class="app-header-preview"
    :class="{ 'is-expanded': expanded }"
    data-testid="app-header-preview"
  >
    <header class="app-header-preview__tools">
      <div>
        <small>RESPONSIVE APP SHELL</small>
        <strong>{{ activeDevice.label }} · {{ activeDevice.width }} PX</strong>
      </div>
      <div role="group" aria-label="应用顶栏预览设备">
        <MmButton
          v-for="item in devices"
          :key="item.value"
          :aria-label="`切换到${item.label}预览`"
          :aria-pressed="device === item.value"
          :class="{ 'is-active': device === item.value }"
          :data-preview-device="item.value"
          size="sm"
          @click="setDevice(item.value)"
        >{{ item.label }}</MmButton>
      </div>
    </header>

    <div class="app-header-preview__viewport" :data-preview-viewport="device">
      <div class="app-header-preview__device" :class="`is-${device}`" :data-mm-theme="headerTheme" :style="frameStyle">
        <MmAppHeader
          v-model:mobile-open="mobileOpen"
          v-model:sidebar-collapsed="sidebarCollapsed"
          v-model:theme="headerTheme"
          aria-label="商户管理后台顶栏"
          :brand="{ alt: '6MM', logo, title: '管理后台' }"
          :context-actions="contextActions"
          :display="forcedDisplay"
          :identity="{ label: '商户', tone: 'merchant' }"
          :metrics="metrics"
          page-title="在线账户"
          :profile="{ alt: '管理员', email: 'ops@alphaembed.com', fallback: '管', items: profileItems }"
          summary-label="商户保证金数据"
          @action="handleAction"
          @identity-click="lastEvent = 'IDENTITY / MERCHANT'"
          @profile-click="lastEvent = 'PROFILE / ADMIN'"
          @profile-select="lastEvent = `PROFILE / ${$event.key.toUpperCase()}`"
          @theme-change="lastEvent = `THEME / ${$event.toUpperCase()}`"
          @toggle-mobile="lastEvent = `MOBILE NAV / ${$event ? 'OPEN' : 'CLOSED'}`"
          @toggle-sidebar="lastEvent = `SIDEBAR / ${$event ? 'COLLAPSED' : 'EXPANDED'}`"
        />

        <div class="app-header-preview__workspace" aria-hidden="true">
          <span>{{ device === 'desktop' ? 'SIDEBAR' : 'CONTENT' }}</span>
          <div>
            <i /><i /><i />
            <b>{{ mobileOpen ? 'MOBILE NAV OPEN' : 'ONLINE ACCOUNTS' }}</b>
          </div>
        </div>
      </div>
    </div>

    <footer class="app-header-preview__status">
      <span><i /> <b data-testid="app-header-event">{{ lastEvent }}</b></span>
      <code>{{ forcedDisplay.toUpperCase() }} / {{ headerTheme.toUpperCase() }}</code>
    </footer>
  </section>
</template>

<style scoped>
.app-header-preview { width: 100%; min-width: 0; overflow: hidden; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); background: var(--mm-color-panel); box-shadow: var(--mm-shadow-sm); }
.app-header-preview__tools { min-height: 50px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--mm-color-line); padding: 8px 9px 8px 12px; background: var(--mm-color-soft); }
.app-header-preview__tools > div:first-child { min-width: 0; display: grid; gap: 5px; }
.app-header-preview__tools small { color: var(--mm-color-primary); font: 750 8px/1 var(--mm-font-family-mono); letter-spacing: .09em; }
.app-header-preview__tools strong { overflow: hidden; color: var(--mm-color-text-muted); font: 700 9px/1 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.app-header-preview__tools > div:last-child { display: flex; gap: 4px; }
.app-header-preview__tools :deep(.mm-button) { min-width: 46px; box-shadow: none; }
.app-header-preview__tools :deep(.mm-button.is-active) { border-color: var(--mm-color-primary); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.app-header-preview__viewport { width: 100%; min-width: 0; overflow: auto; padding: 12px; background: color-mix(in srgb, var(--mm-color-bg) 90%, var(--mm-color-panel)); }
.app-header-preview__device { max-width: none; overflow: hidden; border: 1px solid var(--mm-color-line-strong); border-radius: 8px; margin: 0 auto; background: var(--mm-color-bg); box-shadow: 0 10px 28px rgb(15 23 42 / 12%); transition: width var(--mm-duration-normal) var(--mm-ease-standard); }
.app-header-preview__device.is-mobile { border-radius: 14px; }
.app-header-preview__workspace { min-height: 104px; display: grid; grid-template-columns: 92px minmax(0, 1fr); color: var(--mm-color-text-subtle); background: var(--mm-color-bg); }
.app-header-preview__device:not(.is-desktop) .app-header-preview__workspace { grid-template-columns: 1fr; }
.app-header-preview__workspace > span { display: grid; place-items: center; border-right: 1px solid var(--mm-color-line); background: var(--mm-color-panel); font: 750 8px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.app-header-preview__device:not(.is-desktop) .app-header-preview__workspace > span { display: none; }
.app-header-preview__workspace > div { min-width: 0; display: grid; grid-template-columns: repeat(3, 1fr); align-content: start; gap: 8px; padding: 14px; }
.app-header-preview__workspace i { height: 34px; display: block; border: 1px solid var(--mm-color-line); border-radius: 5px; background: var(--mm-color-panel); }
.app-header-preview__workspace b { grid-column: 1 / -1; color: var(--mm-color-text-subtle); font: 750 8px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.app-header-preview__status { min-height: 34px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-top: 1px solid var(--mm-color-line); padding: 0 11px; background: var(--mm-color-panel); }
.app-header-preview__status span { min-width: 0; display: inline-flex; align-items: center; gap: 7px; }
.app-header-preview__status i { width: 6px; height: 6px; flex: 0 0 auto; border-radius: 50%; background: var(--mm-color-success); box-shadow: 0 0 0 3px var(--mm-color-success-soft); }
.app-header-preview__status b, .app-header-preview__status code { overflow: hidden; color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .06em; text-overflow: ellipsis; white-space: nowrap; }
.app-header-preview__status code { color: var(--mm-color-primary); }

@media (max-width: 520px) {
  .app-header-preview__tools { align-items: stretch; flex-direction: column; }
  .app-header-preview__tools > div:last-child { width: 100%; }
  .app-header-preview__tools :deep(.mm-button) { min-width: 0; flex: 1; }
  .app-header-preview__viewport { padding: 8px; }
}

@media (prefers-reduced-motion: reduce) {
  .app-header-preview__device { transition: none; }
}
</style>
