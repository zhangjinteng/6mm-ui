<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmLoading } from '../loading'
import { MmSelect } from '../select'
import { MmTenantCustomerServiceCard, type TenantCustomerServiceDetail } from '../tenant-customer-service'
import { tenantFeatureCatalogue, type TenantFeatureSettingsDetail, type TenantFeatureSettingsProps } from './model'

defineOptions({ name: 'MmTenantFeatureSettings' })
const props = withDefaults(defineProps<TenantFeatureSettingsProps>(), { canEdit: true, fullPage: true })
const emit = defineEmits<{ saved: []; close: [] }>()
const { locale } = useLocale()
const english = computed(() => locale.value === 'en-US')
const copy = computed(() => english.value ? {
  title: 'Feature switches', description: 'Control the visibility of frontend entry points for the current site.',
  updated: 'Last updated', site: 'Site', frontend: 'Frontend features', hint: 'Turning off an entry point does not delete existing business data or history.',
  group: 'Growth & engagement', groupDescription: 'User participation, incentives and engagement entry points',
  services: 'Services & content', servicesDescription: 'Customer support and service management for this white label',
  serviceHint: 'Entry switches only hide frontend links. Customer service changes take effect immediately for all sites.',
  ranking: 'Trading ranking', rankingDescription: 'Show trading competition rankings, progress and reward tiers', path: 'Activities / Trading ranking',
  enabled: 'Enabled', disabled: 'Disabled', count: 'enabled', loading: 'Loading feature switches…',
  loadError: 'Could not load feature switches.', retry: 'Reload', discardReload: 'Discard and reload',
  saveError: 'Could not save. Your changes are preserved. Reload if this configuration changed elsewhere.',
  saved: 'Current settings are saved', dirty: '1 setting changed, pending save', readonly: 'Read-only: you do not have permission to save.',
  discard: 'Discard changes', cancel: 'Cancel', close: 'Close', save: 'Save settings', switchTitle: 'Discard unsaved switch changes?', switchSite: 'Switch site',
} : {
  title: '功能开关', description: '控制当前站点前端功能入口的显示状态。', updated: '最近更新', site: '站点', frontend: '前端功能',
  hint: '关闭功能后仅隐藏对应前端入口，不影响已有业务数据和历史记录。', group: '运营增长', groupDescription: '用户参与、激励相关入口',
  services: '服务与内容', servicesDescription: '当前白标的用户支持与服务管理',
  serviceHint: '入口开关仅隐藏前端入口；6MM客服即时生效，并影响当前白标所有站点。',
  ranking: '交易排行', rankingDescription: '展示交易竞赛排名、进度和奖励档位', path: '活动 / 交易排行',
  enabled: '已启用', disabled: '已关闭', count: '已启用', loading: '正在读取功能开关…', loadError: '功能开关读取失败', retry: '重新加载',
  discardReload: '放弃并重新加载', saveError: '保存失败，修改已保留；如配置已被其他操作员修改，请放弃并重新加载后再保存。',
  saved: '当前配置已保存', dirty: '已修改 1 项配置，待保存', readonly: '当前为只读模式，暂无保存权限。',
  discard: '放弃修改', cancel: '取消', close: '关闭', save: '保存配置', switchTitle: '放弃未保存的开关修改？', switchSite: '切换站点',
})
const detail = ref<TenantFeatureSettingsDetail | null>(null)
const enabled = ref(true), loading = ref(false), saving = ref(false), loadFailed = ref(false), saveError = ref('')
const switchVisible = ref(false), pendingSiteId = ref('')
const customerBusy = ref(false), customerState = ref<TenantCustomerServiceDetail | null>(null)
const enabledCount = computed(() => Number(enabled.value) + Number(!!customerState.value?.enabled))
let controller: AbortController | undefined, disposed = false, requestedSiteId: string | undefined
const editable = computed(() => props.canEdit && detail.value?.can_edit !== false)
const busy = computed(() => loading.value || saving.value || customerBusy.value)
const dirty = computed(() => detail.value !== null && enabled.value !== detail.value.features.trade_ranking)
const siteOptions = computed(() => detail.value?.sites?.map(site => ({ label: `${site.site_name} · ${site.site_id}`, value: site.site_id })) ?? [])
const updatedAt = computed(() => {
  const value = detail.value?.expected_updated_at
  if (!value) return '—'
  if (props.formatUpdatedAt) return props.formatUpdatedAt(value)
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(english.value ? 'en-GB' : 'zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)
})
function accept(value: TenantFeatureSettingsDetail): void {
  if (typeof value.features?.trade_ranking !== 'boolean') throw new Error('Invalid feature response')
  detail.value = value; enabled.value = value.features.trade_ranking
}
async function load(siteId?: string): Promise<void> {
  if (busy.value) return
  requestedSiteId = siteId
  controller?.abort(); controller = new AbortController()
  loading.value = true; loadFailed.value = false; saveError.value = ''
  try { const result = await props.load(controller.signal, siteId); if (!disposed) accept(result) }
  catch { if (!disposed) loadFailed.value = true }
  finally { if (!disposed) loading.value = false }
}
function selectSite(siteId: string): void {
  if (busy.value || siteId === detail.value?.site_id || !detail.value?.sites?.some(site => site.site_id === siteId)) return
  if (dirty.value) { pendingSiteId.value = siteId; switchVisible.value = true }
  else void load(siteId)
}
function confirmSwitch(): void { if (!busy.value) { switchVisible.value = false; void load(pendingSiteId.value) } }
function toggle(): void { if (!busy.value && editable.value && detail.value && !loadFailed.value) enabled.value = !enabled.value }
function discard(): void { if (!busy.value && detail.value) { enabled.value = detail.value.features.trade_ranking; saveError.value = '' } }
async function save(): Promise<void> {
  if (busy.value || !editable.value || !dirty.value || !detail.value || loadFailed.value) return
  saving.value = true; saveError.value = ''
  try {
    const result = await props.save({ site_id: detail.value.site_id, expected_updated_at: detail.value.expected_updated_at, features: { trade_ranking: enabled.value } })
    if (!disposed) { accept(result.detail); emit('saved') }
  } catch (error) {
    if (!disposed) {
      const message = (error as { response?: { data?: { msg?: unknown } } })?.response?.data?.msg
      saveError.value = typeof message === 'string' ? `${message} ${copy.value.saveError}` : copy.value.saveError
    }
  } finally { if (!disposed) saving.value = false }
}
function beforeUnload(event: BeforeUnloadEvent): void { if (dirty.value) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => { window.addEventListener('beforeunload', beforeUnload); void load() })
onBeforeUnmount(() => { disposed = true; controller?.abort(); window.removeEventListener('beforeunload', beforeUnload) })
defineExpose({ hasUnsavedChanges: dirty, isSaving: saving, isBusy: busy })
</script>

<template>
  <section class="mm-tenant-feature-settings" :class="{ 'is-page': fullPage }" data-mm-component="tenant-feature-settings" :aria-label="copy.title" :aria-busy="busy">
    <header v-if="fullPage" class="mm-tenant-feature-settings__header">
      <span class="mm-tenant-feature-settings__icon"><MmIcon name="list-checks" :size="22" /></span>
      <div><h1>{{ copy.title }}</h1><p>{{ copy.description }}</p></div>
      <div class="mm-tenant-feature-settings__updated"><span><MmIcon name="clock" :size="12" />{{ copy.updated }}</span><time>{{ updatedAt }}</time></div>
    </header>
    <div class="mm-tenant-feature-settings__body">
      <MmLoading v-if="loading" :text="copy.loading" />
      <div v-else-if="loadFailed" class="mm-tenant-feature-settings__empty" role="alert"><p>{{ copy.loadError }}</p><MmButton @click="load(requestedSiteId)">{{ copy.retry }}</MmButton></div>
      <div v-else-if="detail" class="mm-tenant-feature-settings__content">
        <div class="mm-tenant-feature-settings__summary"><div><h2>{{ copy.frontend }}</h2><p>{{ customerService ? copy.serviceHint : copy.hint }}</p></div><span class="mm-tenant-feature-settings__count">{{ enabledCount }} / {{ tenantFeatureCatalogue.length + (customerService ? 1 : 0) }} {{ copy.count }}</span></div>
        <label v-if="siteOptions.length > 1" class="mm-tenant-feature-settings__site"><span>{{ copy.site }}</span><MmSelect :model-value="detail.site_id" :options="siteOptions" :aria-label="copy.site" :disabled="busy" @update:model-value="selectSite(String($event))" /></label>
        <p v-else class="mm-tenant-feature-settings__site-context">{{ copy.site }}：{{ detail.site_name }} · {{ detail.site_id }}</p>
        <section class="mm-tenant-feature-settings__group" :aria-label="copy.group">
          <header><span class="mm-tenant-feature-settings__group-icon"><MmIcon name="chart-candlestick" :size="18" /></span><div><h3>{{ copy.group }}</h3><p>{{ copy.groupDescription }}</p></div><span>{{ enabled ? 1 : 0 }} / 1 {{ copy.count }}</span></header>
          <div class="mm-tenant-feature-settings__grid">
            <article v-for="feature in tenantFeatureCatalogue" :key="feature.code" class="mm-tenant-feature-settings__card" :class="{ 'is-enabled': enabled }" :data-feature-code="feature.code">
              <span class="mm-tenant-feature-settings__card-icon"><MmIcon :name="feature.icon" :size="20" /></span>
              <div class="mm-tenant-feature-settings__card-copy"><h4>{{ copy.ranking }}</h4><p>{{ copy.rankingDescription }}</p><small>{{ copy.path }}</small></div>
              <div class="mm-tenant-feature-settings__controls"><span>{{ enabled ? copy.enabled : copy.disabled }}</span>
                <button type="button" class="mm-tenant-feature-settings__switch" role="switch" :aria-label="copy.ranking" :aria-checked="enabled" :disabled="busy || !editable" @click="toggle"><span /></button>
              </div>
            </article>
          </div>
        </section>
        <section v-if="customerService" class="mm-tenant-feature-settings__group" :aria-label="copy.services">
          <header><span class="mm-tenant-feature-settings__group-icon"><MmIcon name="layout-dashboard" :size="18" /></span><div><h3>{{ copy.services }}</h3><p>{{ copy.servicesDescription }}</p></div><span>{{ customerState?.enabled ? 1 : 0 }} / 1 {{ copy.count }}</span></header>
          <div class="mm-tenant-feature-settings__grid">
            <MmTenantCustomerServiceCard :transport="customerService" :can-edit="editable" :disabled="loading || saving"
              @state-change="customerState = $event" @busy-change="customerBusy = $event" />
          </div>
        </section>
      </div>
    </div>
    <footer class="mm-tenant-feature-settings__footer">
      <span v-if="saveError" class="mm-tenant-feature-settings__feedback is-error" role="alert">{{ saveError }}</span>
      <span v-else-if="detail" class="mm-tenant-feature-settings__feedback" role="status"><MmIcon :name="dirty ? 'alert' : 'circle-check'" :size="14" />{{ !editable ? copy.readonly : dirty ? copy.dirty : copy.saved }}</span>
      <span v-else class="mm-tenant-feature-settings__feedback" />
      <MmButton v-if="saveError" :disabled="busy" @click="load(detail?.site_id)">{{ copy.discardReload }}</MmButton>
      <MmButton v-if="fullPage" :disabled="busy || !dirty || !editable" @click="discard">{{ copy.discard }}</MmButton>
      <MmButton v-else :disabled="busy" @click="emit('close')">{{ editable ? copy.cancel : copy.close }}</MmButton>
      <MmButton variant="primary" :loading="saving" :disabled="busy || !detail || !dirty || !editable || loadFailed" @click="save">
        <template #icon><MmIcon name="save" :size="14" /></template>
        {{ copy.save }}
      </MmButton>
    </footer>
    <MmDialog v-model="switchVisible" :title="copy.switchTitle" width="400px" :close-on-click-modal="false"><template #footer><MmButton @click="switchVisible = false">{{ copy.cancel }}</MmButton><MmButton variant="primary" @click="confirmSwitch">{{ copy.switchSite }}</MmButton></template></MmDialog>
  </section>
</template>

<style src="./tenant-features.css"></style>
