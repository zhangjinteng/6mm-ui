<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MmButton } from '../button'
import { MmEmpty } from '../empty'
import { MmIcon } from '../icon'
import { MmLoading } from '../loading'
import { MmSegmented } from '../segmented'
import { dashboardNumber, dashboardPalette, dashboardPeriods, dashboardView, type DashboardPayload, type DashboardPeriod, type DashboardPanel } from './model'

defineOptions({ name: 'MmBusinessDashboard' })
const props = defineProps<{ request: (period: DashboardPeriod) => Promise<DashboardPayload>; view?: string }>()
const emit = defineEmits<{ 'update:view': [view: string] }>()
const period = ref<DashboardPeriod>('7'), localView = ref('overview'), loading = ref(false), failed = ref(false)
const data = ref<DashboardPayload | null>(null)
let sequence = 0
async function load() {
  const version = ++sequence
  loading.value = true; failed.value = false
  try { const result = await props.request(period.value); if (version === sequence) data.value = result }
  catch { if (version === sequence) { failed.value = true; data.value = null } }
  finally { if (version === sequence) loading.value = false }
}
const merchant = computed(() => data.value?.scope === 'merchant')
const tabs = computed(() => merchant.value ? [
  { label: '用户数据', value: 'users' }, { label: '资金数据', value: 'funds' }, { label: '合约数据', value: 'contracts' }, { label: '预测数据', value: 'prediction' },
] : [
  { label: '经营总览', value: 'overview' }, { label: '资产概览', value: 'assets' }, { label: '合约数据', value: 'contracts' }, { label: '预测概览', value: 'prediction' },
  ...(data.value?.scope === 'platform' ? [{ label: '合作概览', value: 'partners' }] : []),
])
const view = computed({
  get() {
    const requested = props.view ?? localView.value
    return tabs.value.some(tab => tab.value === requested) ? requested : tabs.value[0]!.value
  },
  set(value: string) {
    localView.value = value
    emit('update:view', value)
  },
})
const content = computed(() => data.value ? dashboardView(data.value, view.value) : { cards: [], panels: [] })
const errors = computed(() => Object.entries(data.value?.blocks ?? {}).filter(([, block]) => block.state === 'error').map(([key]) => ({ users: '用户', trade: '合约成交', assets: '资产', prediction: '预测', prediction_runtime: '预测运行', merchant_users: '用户统计', positions: '持仓', partners: '合作', merchant: '保证金' } as Record<string, string>)[key] ?? key))
const timestamps = computed(() => Object.values(data.value?.blocks ?? {}).map(b => b.data?.coverage?.updated_at).filter(Boolean).sort())
const currentTitle = computed(() => tabs.value.find(tab => tab.value === view.value)?.label ?? '经营总览')
function validItems(panel: DashboardPanel) { return (panel.items ?? []).filter(r => r.value !== null && r.value !== undefined) }
function hasChart(panel: DashboardPanel) {
  return panel.kind === 'donut' ? validItems(panel).some(r => Number(r.value) > 0) : (panel.series ?? []).some(r => r.values.some(v => v !== null))
}
function barWidth(panel: DashboardPanel, value: unknown) {
  const max = Math.max(...validItems(panel).map(r => Math.abs(Number(r.value))), 1)
  return `${Math.min(100, Math.max(0, Math.abs(Number(value)) / max * 100))}%`
}
watch(period, load, { immediate: true })
</script>

<template>
  <div class="mm-business-dashboard" :aria-busy="loading">
    <header class="mm-business-dashboard__toolbar">
      <!-- <MmSegmented v-model="view" :options="tabs" size="sm" aria-label="看板分类" /> -->
      <div class="mm-business-dashboard__filters">
        <MmSegmented v-model="period" :options="dashboardPeriods" size="sm" aria-label="统计周期" />
        <MmButton variant="default" size="sm" icon-only :disabled="loading" aria-label="刷新看板" title="刷新看板" @click="load"><MmIcon name="refresh-cw" :size="15" :spin="loading" /></MmButton>
      </div>
    </header>
    <div v-if="data" class="mm-business-dashboard__context" aria-label="数据口径">
      <span><MmIcon name="calendar" :size="13" />{{ data.range.start }} 至 {{ data.range.end }} · UTC</span>
      <span><MmIcon name="clock" :size="13" />统计发布：{{ timestamps.at(-1) || '暂无发布' }}</span>
      <span><MmIcon name="circle-dollar-sign" :size="13" />USDT</span>
      <span v-if="data.scope !== 'tenant'">{{ merchant ? '本商户用户' : '全部来源用户' }}</span>
    </div>
    <div v-if="errors.length" class="mm-business-dashboard__warning" role="status">{{ errors.join('、') }}数据暂不可用 <MmButton size="sm" variant="text" @click="load">重试</MmButton></div>
    <div v-if="failed" class="mm-business-dashboard__empty"><MmEmpty description="加载失败，请稍后重试"><MmButton size="sm" variant="primary" @click="load">重新加载</MmButton></MmEmpty></div>
    <div v-else-if="loading" class="mm-business-dashboard__loading">
      <MmLoading :backdrop="false" />
    </div>
    <template v-else-if="data">
      <h1 class="mm-business-dashboard__title">{{ currentTitle }}</h1>
      <section class="mm-business-dashboard__kpis" :class="{ 'is-merchant': merchant }" aria-label="经营指标">
        <article v-for="(card, index) in content.cards" :key="card.key" class="mm-business-dashboard__kpi" :style="{ '--stat-color': dashboardPalette[index % dashboardPalette.length] }">
          <div class="mm-business-dashboard__kpi-label"><span>{{ card.label }}</span><MmIcon :name="card.icon" :size="15" /></div>
          <strong :title="String(card.value ?? '')">{{ dashboardNumber(card.value, card.unit) }}<small v-if="card.value != null && card.unit">{{ card.unit }}</small></strong>
          <span class="mm-business-dashboard__kpi-detail">{{ card.detail || (card.value == null ? '暂无有效统计' : merchant && view === 'funds' ? '商户保证金账户' : '当前统计范围') }}</span>
        </article>
      </section>
      <section class="mm-business-dashboard__panels" aria-label="经营图表">
        <article v-for="panel in content.panels" :key="panel.key" class="mm-business-dashboard__panel">
          <header><h2>{{ panel.title }}</h2><span>{{ panel.unit }}</span></header>
          <div v-if="panel.kind === 'rank' || panel.kind === 'list'" class="mm-business-dashboard__ranking">
            <div v-for="(item, index) in panel.items" :key="item.name" class="mm-business-dashboard__ranking-row">
              <i v-if="panel.kind === 'rank'">{{ index + 1 }}</i>
              <div><span>{{ item.name }}</span><small v-if="item.detail">{{ item.detail }}</small><div v-if="panel.kind === 'rank' && item.value != null" class="mm-business-dashboard__track"><b :style="{ width: barWidth(panel, item.value), background: dashboardPalette[index % dashboardPalette.length] }" /></div></div>
              <strong>{{ item.display ?? dashboardNumber(item.value, panel.unit) }}{{ item.value == null ? '' : panel.unit === '%' ? '%' : '' }}</strong>
            </div>
            <div v-if="!panel.items?.length" class="mm-business-dashboard__no-data">暂无记录</div>
          </div>
          <div v-else class="mm-business-dashboard__chart" role="img" :aria-label="panel.title">
            <slot v-if="hasChart(panel)" name="chart" :panel="panel" />
            <div v-else class="mm-business-dashboard__no-data">暂无有效数据</div>
          </div>
          <footer v-if="panel.note">{{ panel.note }}</footer>
        </article>
      </section>
    </template>
  </div>
</template>

<style>
.mm-business-dashboard { color:var(--mm-color-text, #172033); min-width:0; padding:12px; letter-spacing:0; }
.mm-business-dashboard__toolbar { display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; padding:10px 12px; background:var(--mm-color-panel, #fff); border:1px solid var(--mm-color-line, #dfe4ec); border-radius:6px; }
.mm-business-dashboard__filters { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.mm-business-dashboard__context { display:flex; gap:22px; flex-wrap:wrap; padding:10px 12px; margin:10px 0 14px; background:var(--mm-color-panel, #fff); border:1px solid var(--mm-color-line, #dfe4ec); border-radius:5px; color:var(--mm-color-text-muted, #657187); font-size:11px; }
.mm-business-dashboard__context > span { display:flex; align-items:center; gap:6px; }
.mm-business-dashboard__title { font-size:15px; font-weight:600; margin:14px 0; }
.mm-business-dashboard__kpis { display:grid; grid-template-columns:repeat(6,minmax(0,1fr)); gap:10px; }
.mm-business-dashboard__kpis.is-merchant { grid-template-columns:repeat(4,minmax(0,1fr)); }
.mm-business-dashboard__kpi { min-width:0; min-height:106px; padding:12px; background:var(--mm-color-panel, #fff); border:1px solid var(--mm-color-line, #dfe4ec); border-top:2px solid var(--stat-color); border-radius:6px; }
.mm-business-dashboard__kpi-label { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; color:var(--mm-color-text-muted,#657187); font-size:12px; font-weight:600; min-height:25px; }
.mm-business-dashboard__kpi-label > .mm-icon { flex-shrink:0; color:var(--stat-color); }
.mm-business-dashboard__kpi strong { display:flex; align-items:baseline; gap:5px; flex-wrap:wrap; font-size:21px; line-height:1.45; font-variant-numeric:tabular-nums; overflow-wrap:anywhere; }
.mm-business-dashboard__kpi strong small { font-size:10px; font-weight:400; color:var(--mm-color-text-muted,#657187); }
.mm-business-dashboard__kpi-detail { display:block; color:var(--mm-color-text-muted,#657187); font-size:10px; margin-top:7px; min-height:15px; }
.mm-business-dashboard__panels { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:12px; }
.mm-business-dashboard__panel { min-width:0; overflow:hidden; border:1px solid var(--mm-color-line,#dfe4ec); border-radius:6px; background:var(--mm-color-panel,#fff); }
.mm-business-dashboard__panel > header { display:flex; align-items:center; justify-content:space-between; gap:8px; border-bottom:1px solid var(--mm-color-line,#dfe4ec); padding:12px; }
.mm-business-dashboard__panel h2 { margin:0; font-size:13px; font-weight:600; }
.mm-business-dashboard__panel header > span, .mm-business-dashboard__panel footer { font-size:10px; color:var(--mm-color-text-muted,#657187); }
.mm-business-dashboard__panel footer { padding:8px 12px; border-top:1px solid var(--mm-color-line,#dfe4ec); }
.mm-business-dashboard__chart { height:258px; padding:10px; }
.mm-business-dashboard__chart > * { width:100%; height:100%; }
.mm-business-dashboard__ranking { min-height:258px; padding:8px 14px; }
.mm-business-dashboard__ranking-row { display:flex; align-items:center; gap:12px; min-height:51px; border-bottom:1px solid var(--mm-color-line,#edf0f5); font-size:12px; }
.mm-business-dashboard__ranking-row:last-child { border:0; }
.mm-business-dashboard__ranking-row > div { flex:1; min-width:0; }
.mm-business-dashboard__ranking-row > div > span { overflow-wrap:anywhere; }
.mm-business-dashboard__ranking-row > i { width:18px; color:var(--mm-color-text-muted,#657187); font-style:normal; font-size:11px; }
.mm-business-dashboard__ranking-row > strong { flex-shrink:0; font-size:12px; font-variant-numeric:tabular-nums; }
.mm-business-dashboard__ranking-row small { display:block; font-size:10px; color:var(--mm-color-text-muted,#657187); margin-top:3px; overflow-wrap:anywhere; }
.mm-business-dashboard__track { height:5px; margin-top:7px; background:var(--mm-color-bg,#f2f5f9); border-radius:2px; overflow:hidden; }
.mm-business-dashboard__track b { height:5px; display:block; }
.mm-business-dashboard__no-data { display:flex; min-height:220px; align-items:center; justify-content:center; color:var(--mm-color-text-muted,#657187); font-size:12px; }
.mm-business-dashboard__warning { display:flex; align-items:center; gap:8px; padding:8px 12px; margin:10px 0; background:#fff8ed; border:1px solid #f4d39f; border-radius:4px; color:#945500; font-size:12px; }
.mm-business-dashboard__empty { min-height:350px; display:grid; place-items:center; }
.mm-business-dashboard__loading { position:relative; min-height:350px; }
@media(max-width:1200px) { .mm-business-dashboard__kpis { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media(max-width:800px) { .mm-business-dashboard__kpis,.mm-business-dashboard__kpis.is-merchant { grid-template-columns:repeat(2,minmax(0,1fr)); } .mm-business-dashboard__panels { grid-template-columns:minmax(0,1fr); } .mm-business-dashboard__toolbar .mm-segmented { max-width:100%; flex-wrap:wrap; } .mm-business-dashboard__toolbar { align-items:flex-start; } .mm-business-dashboard__context { gap:8px; } }
</style>
