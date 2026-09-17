<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { MmContainer, MmIcon, MmText, type QueryBarReturnContext } from '../src'
import OnlineAccountsProTable from './OnlineAccountsProTable.vue'
import { onlineAccountRows } from './online-accounts-fixture'

const theme = ref<'dark' | 'light'>('light')
const onlineCount = computed(() => onlineAccountRows.filter((row) => row.status === 'online').length)
const liveCount = computed(() => onlineAccountRows.filter((row) => row.userType === 'live').length)
const returnContext = readReturnContext()

watch(theme, (value) => {
  document.documentElement.dataset.mmTheme = value
}, { immediate: true })

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function readReturnContext(): QueryBarReturnContext | undefined {
  const params = new URLSearchParams(window.location.search)
  const route = params.get('mmReturnTo')?.trim()
  const label = params.get('mmReturnLabel')?.trim()
  if (!route || !label) return undefined

  let destination: URL
  try {
    destination = new URL(route, window.location.origin)
  }
  catch {
    return undefined
  }
  if (destination.origin !== window.location.origin) return undefined

  return {
    label: label.slice(0, 80),
    route: `${destination.pathname}${destination.search}${destination.hash}`,
  }
}

function returnToContext(context: QueryBarReturnContext): void {
  window.location.assign(context.route)
}
</script>

<template>
  <main class="pro-table-preview-page mm-ui" :data-mm-theme="theme">
    <MmContainer class="pro-table-preview-shell" :gutter="24" size="xl">
      <header class="pro-table-masthead">
        <a class="pro-table-brand" href="/" aria-label="返回 6MM UI 首页"><span>6</span><i /></a>
        <div>
          <MmText as="p" size="xs" tone="primary" weight="bold">6MM UI / COMPOSITE DATA SURFACE</MmText>
          <h1>MmProTable 数据工作台</h1>
          <p>服务端查询、排序、分页、列偏好与恢复状态的一体化预览。</p>
        </div>
        <nav aria-label="页面导航">
          <a href="/">HOME</a>
          <a href="/component-info">COMPONENT INFO</a>
          <a class="is-active" href="/pro-table" aria-current="page">PRO TABLE</a>
          <button type="button" :aria-label="theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'" @click="toggleTheme">
            <MmIcon :name="theme === 'light' ? 'moon' : 'sun'" :size="15" />
          </button>
        </nav>
      </header>

      <section class="pro-table-hero" aria-labelledby="pro-table-hero-title">
        <div>
          <span>ORCHESTRATION / ZERO BUSINESS COUPLING</span>
          <h2 id="pro-table-hero-title">一套列表骨架，承接高频运营决策。</h2>
          <p>展示壳只组合 UI；请求控制器处理竞态、重试和后台刷新；业务页面继续拥有权限、接口映射与详情动作。</p>
        </div>
        <dl>
          <div><dt>DATASET</dt><dd>{{ onlineAccountRows.length }}</dd></div>
          <div><dt>ONLINE</dt><dd>{{ onlineCount }}</dd></div>
          <div><dt>LIVE USERS</dt><dd>{{ liveCount }}</dd></div>
          <div><dt>PAGE SIZE</dt><dd>20</dd></div>
        </dl>
      </section>

      <section class="pro-table-preview-stage" aria-label="MmProTable 交互预览">
        <OnlineAccountsProTable
          :return-context="returnContext"
          @return-context="returnToContext"
        />
      </section>
    </MmContainer>
  </main>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(html), :global(body), :global(#app) { min-width: 320px; min-height: 100%; margin: 0; }
:global(body) { background: #0b1114; font-family: var(--mm-font-family); }
.pro-table-preview-page { min-height: 100vh; padding: 28px 0 64px; color: var(--mm-color-text); background-color: var(--mm-color-bg); background-image: linear-gradient(var(--mm-color-line) 1px, transparent 1px), linear-gradient(90deg, var(--mm-color-line) 1px, transparent 1px); background-size: 32px 32px; }
.pro-table-preview-shell { min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr); gap: 0; }
.pro-table-masthead { min-height: 92px; display: grid; grid-template-columns: auto minmax(260px, 1fr) auto; align-items: center; gap: 18px; border: 1px solid var(--mm-color-line); padding: 18px 20px; background: color-mix(in srgb, var(--mm-color-panel) 95%, transparent); }
.pro-table-brand { width: 52px; height: 52px; position: relative; display: grid; place-items: center; overflow: hidden; border-radius: var(--mm-radius-md); color: var(--mm-color-on-primary); background: var(--mm-color-primary); text-decoration: none; }
.pro-table-brand span { z-index: 1; font-size: 26px; font-weight: 800; letter-spacing: -.08em; }
.pro-table-brand i { width: 32px; height: 1px; position: absolute; right: -8px; bottom: 10px; background: currentColor; transform: rotate(-45deg); }
.pro-table-masthead > div { min-width: 0; display: grid; gap: 4px; }
.pro-table-masthead :deep(.mm-text), .pro-table-masthead p { margin: 0; }
.pro-table-masthead h1 { margin: 0; font-size: clamp(22px, 3vw, 32px); line-height: 1; letter-spacing: -.04em; }
.pro-table-masthead > div > p:last-child { color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); }
.pro-table-masthead nav { display: flex; align-items: center; justify-content: flex-end; gap: 6px; flex-wrap: wrap; }
.pro-table-masthead nav a, .pro-table-masthead nav button { height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-sm); padding: 0 9px; color: var(--mm-color-text-muted); background: var(--mm-color-panel); font: 700 var(--mm-font-size-xs)/1 var(--mm-font-family-mono); letter-spacing: .04em; text-decoration: none; }
.pro-table-masthead nav a:hover, .pro-table-masthead nav a.is-active { border-color: color-mix(in srgb, var(--mm-color-primary) 44%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.pro-table-masthead nav button { width: 30px; padding: 0; cursor: pointer; }
.pro-table-hero { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(380px, .75fr); align-items: end; gap: 34px; border: 1px solid var(--mm-color-line); border-top: 0; padding: 32px 28px; background: linear-gradient(120deg, color-mix(in srgb, var(--mm-color-primary-soft) 54%, var(--mm-color-panel)), var(--mm-color-panel) 62%); }
.pro-table-hero > div { display: grid; gap: 9px; }
.pro-table-hero span { color: var(--mm-color-primary); font: 750 9px/1 var(--mm-font-family-mono); letter-spacing: .11em; }
.pro-table-hero h2 { max-width: 780px; margin: 0; font-size: clamp(28px, 4vw, 48px); line-height: 1.02; letter-spacing: -.055em; }
.pro-table-hero p { max-width: 720px; margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-sm); line-height: 1.75; }
.pro-table-hero dl { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border: 1px solid var(--mm-color-line); margin: 0; background: color-mix(in srgb, var(--mm-color-panel) 84%, transparent); }
.pro-table-hero dl > div { min-width: 0; display: grid; gap: 5px; border-left: 1px solid var(--mm-color-line); padding: 12px; }
.pro-table-hero dl > div:first-child { border-left: 0; }
.pro-table-hero dt { color: var(--mm-color-text-subtle); font: 700 7px/1 var(--mm-font-family-mono); letter-spacing: .07em; }
.pro-table-hero dd { margin: 0; color: var(--mm-color-primary); font: 800 16px/1 var(--mm-font-family-mono); }
.pro-table-preview-stage { margin-top: 18px; border: 1px solid var(--mm-color-line); padding: 14px; background: color-mix(in srgb, var(--mm-color-panel) 96%, transparent); box-shadow: var(--mm-shadow-md); }
@media (max-width: 1080px) { .pro-table-masthead { grid-template-columns: auto minmax(0, 1fr); } .pro-table-masthead nav { grid-column: 1 / -1; justify-content: flex-start; } .pro-table-hero { grid-template-columns: 1fr; } }
@media (max-width: 720px) { .pro-table-preview-page { padding-top: 12px; } .pro-table-hero { padding: 24px 18px; } .pro-table-hero dl { grid-template-columns: repeat(2, 1fr); } .pro-table-hero dl > div:nth-child(3) { border-left: 0; border-top: 1px solid var(--mm-color-line); } .pro-table-hero dl > div:nth-child(4) { border-top: 1px solid var(--mm-color-line); } .pro-table-preview-stage { padding: 8px; } }
</style>
