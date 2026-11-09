<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmInput } from '../input'
import { MmLoading } from '../loading'
import { MmRadio } from '../radio'
import { MmSelect } from '../select'
import ContentCoverUpload from '../../cms/views/content/components/ContentCoverUpload.vue'
import themeOnePreview from './previews/template-1-light.svg'
import themeTwoPreview from './previews/template-2-light.svg'
import { brandDomainError, brandDomainsEqual, normalizeBrandDomains, type BrandDomainDraft, type BrandDomainSite,
  type TenantBrandDetail, type TenantBrandSettingsProps } from './model'

defineOptions({ name: 'MmTenantBrandSettings' })
const props = withDefaults(defineProps<TenantBrandSettingsProps>(), { canEdit: true, fullPage: true })
const emit = defineEmits<{ saved: []; close: [] }>()
const { locale } = useLocale()
const english = computed(() => locale.value === 'en-US')
const copy = computed(() => english.value ? {
  title: 'Brand settings', description: 'Manage site domains, themes, logo and browser icon.', updated: 'Last updated',
  tab: 'Domains', titleDomains: 'Access domains', add: 'Add domain', site: 'Site', address: 'Access domain', type: 'Domain type',
  primary: 'Primary domain', backup: 'Backup domain', setPrimary: 'Set primary domain', remove: 'Remove domain',
  emptySites: 'No sites are configured.', empty: 'No access domains.', loading: 'Loading domain settings…',
  loadFailed: 'Could not load domain settings.', saveFailed: 'Could not save. Your changes are preserved; reload if this configuration changed elsewhere.',
  reload: 'Reload', discardReload: 'Discard and reload', save: 'Save settings', saved: 'Current settings are saved', dirty: 'You have unsaved changes',
  readonly: 'Read-only: you do not have permission to save.', discard: 'Discard changes', cancel: 'Cancel', close: 'Close',
  confirm: 'Confirm brand changes', confirmText: 'Save the theme, images and domains? Removed domains will no longer provide access to this site.', removed: 'Removed access domains',
  confirmSave: 'Confirm save', switchTitle: 'Discard unsaved domain changes?', switchSite: 'Switch site',
} : {
  title: '品牌配置', description: '管理所属站点的域名、主题、网站 Logo 和标签页图标。', updated: '最近更新',
  tab: '域名', titleDomains: '访问域名', add: '添加域名', site: '站点', address: '访问域名', type: '域名类型',
  primary: '主域名', backup: '备用域名', setPrimary: '设为主域名', remove: '删除域名',
  emptySites: '尚未配置站点', empty: '暂无访问域名', loading: '正在读取域名配置…',
  loadFailed: '域名配置读取失败', saveFailed: '保存失败，修改已保留；如配置已被其他操作员修改，请放弃并重新加载后再保存。',
  reload: '重新加载', discardReload: '放弃并重新加载', save: '保存配置', saved: '当前配置已保存', dirty: '有未保存的修改',
  readonly: '当前为只读模式，暂无保存权限。', discard: '放弃修改', cancel: '取消', close: '关闭',
  confirm: '确认品牌配置变更', confirmText: '确认保存当前站点的主题、标识和域名配置？移除的域名将不再提供此站点的访问入口。', removed: '移除的访问域名',
  confirmSave: '确认保存', switchTitle: '放弃未保存的域名修改？', switchSite: '切换站点',
})
const id = useId()
const detail = ref<TenantBrandDetail | null>(null)
const loading = ref(false), saving = ref(false), loadFailed = ref(false), saveError = ref('')
const selectedSiteId = ref(''), pendingSiteId = ref('')
const confirmVisible = ref(false), switchVisible = ref(false)
const draft = ref<BrandDomainDraft[]>([])
const activeTab = ref('domains')
const templateId = ref<'template-1' | 'template-2' | null>(null), logoUrl = ref(''), faviconUrl = ref('')
const logoUploading = ref(false), faviconUploading = ref(false)
const uploading = computed(() => logoUploading.value || faviconUploading.value)
const themes = [
  { id: 'template-1' as const, name: '主题1', english: 'Theme 1', preview: themeOnePreview },
  { id: 'template-2' as const, name: '主题2', english: 'Theme 2', preview: themeTwoPreview },
]
let nextKey = 0, controller: AbortController | undefined, disposed = false
const selectedSite = computed(() => detail.value?.sites.find(site => site.site_id === selectedSiteId.value))
const editable = computed(() => props.canEdit && detail.value?.can_edit !== false)
const busy = computed(() => loading.value || saving.value || uploading.value)
const brandDirty = computed(() => !!selectedSite.value && (templateId.value !== (selectedSite.value.template_id ?? null)
  || logoUrl.value !== (selectedSite.value.logo_url ?? '') || faviconUrl.value !== (selectedSite.value.favicon_url ?? '')))
const dirty = computed(() => !!selectedSite.value && (!brandDomainsEqual(draft.value, selectedSite.value.domains) || brandDirty.value))
const validationError = computed(() => brandDomainError(draft.value, english.value))
const primaryKey = computed(() => draft.value.find(row => row.is_primary)?.key)
const siteOptions = computed(() => detail.value?.sites.map(site => ({ label: `${site.site_name} · ${site.site_id}`, value: site.site_id })) ?? [])
const removedDomains = computed(() => selectedSite.value?.domains.filter(row => !normalizeBrandDomains(draft.value).some(next => next.domain === row.domain)).map(row => row.domain) ?? [])
const updatedAt = computed(() => {
  const value = selectedSite.value?.updated_at
  if (!value) return '—'
  if (props.formatUpdatedAt) return props.formatUpdatedAt(value)
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(english.value ? 'en-GB' : 'zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)
})
function useSite(site: BrandDomainSite): void {
  selectedSiteId.value = site.site_id
  draft.value = site.domains.map(row => ({ ...row, key: ++nextKey, existing: true }))
  templateId.value = site.template_id ?? null; logoUrl.value = site.logo_url ?? ''; faviconUrl.value = site.favicon_url ?? ''
  saveError.value = ''
}
async function load(): Promise<void> {
  if (busy.value) return
  controller?.abort(); controller = new AbortController()
  loading.value = true; loadFailed.value = false; saveError.value = ''
  try {
    const result = await props.load(controller.signal)
    if (disposed) return
    detail.value = result
    const site = result.sites.find(site => site.site_id === selectedSiteId.value) ?? result.sites[0]
    if (site) useSite(site)
    else { selectedSiteId.value = ''; draft.value = [] }
  } catch { if (!disposed) loadFailed.value = true }
  finally { if (!disposed) loading.value = false }
}
function selectSite(value: string): void {
  if (busy.value || value === selectedSiteId.value || !detail.value?.sites.some(site => site.site_id === value)) return
  if (dirty.value) { pendingSiteId.value = value; switchVisible.value = true; return }
  useSite(detail.value.sites.find(site => site.site_id === value)!)
}
function confirmSwitch(): void {
  if (busy.value) return
  const site = detail.value?.sites.find(site => site.site_id === pendingSiteId.value)
  if (site) useSite(site)
  switchVisible.value = false
}
function addDomain(): void {
  if (busy.value || !editable.value || !selectedSite.value || draft.value.length >= 20) return
  draft.value.push({ key: ++nextKey, domain: '', is_primary: !draft.value.length, existing: false })
}
function setPrimary(key: number): void {
  if (busy.value || !editable.value) return
  draft.value.forEach(row => { row.is_primary = row.key === key })
}
function removeDomain(key: number): void {
  if (busy.value || !editable.value) return
  draft.value = draft.value.filter(row => row.key !== key)
}
function discard(): void { if (!busy.value && selectedSite.value) useSite(selectedSite.value) }
function confirmSave(): void {
  if (busy.value || !editable.value || !dirty.value || validationError.value || loadFailed.value) return
  confirmVisible.value = true
}
async function submit(): Promise<void> {
  if (busy.value || !editable.value || !dirty.value || validationError.value || !selectedSite.value || loadFailed.value) return
  saving.value = true; saveError.value = ''
  const site = selectedSite.value
  const domains = normalizeBrandDomains(draft.value)
  const brand = site.brand_revision ? { expected_brand_revision: site.brand_revision, template_id: templateId.value,
    logo_url: logoUrl.value || null, favicon_url: faviconUrl.value || null } : {}
  try {
    const result = await props.save({ site_id: site.site_id, expected_revision: site.revision, expected_config_version: site.config_version, domains, ...brand })
    if (disposed) return
    // The server returns the exact revision for the normalized domain set; keep other sites untouched.
    if (result.config_version) site.config_version = result.config_version
    site.domains = domains
    if (result.revision) site.revision = result.revision
    if (result.brand_revision) site.brand_revision = result.brand_revision
    Object.assign(site, { template_id: templateId.value, logo_url: logoUrl.value || null, favicon_url: faviconUrl.value || null })
    if (result.changed) site.updated_at = result.updated_at ?? new Date().toISOString()
    useSite(site); confirmVisible.value = false; emit('saved')
  } catch (error) {
    if (!disposed) {
      const response = error as { response?: { data?: { msg?: unknown } } }
      const message = response?.response?.data?.msg
      saveError.value = typeof message === 'string' ? `${message} ${copy.value.saveFailed}` : copy.value.saveFailed
      confirmVisible.value = false
    }
  } finally { if (!disposed) saving.value = false }
}
async function uploadImage(file: File, signal: AbortSignal) {
  if (!props.uploadImage || !selectedSite.value || !editable.value) throw new Error('当前站点不支持图片上传')
  return props.uploadImage(selectedSite.value.site_id, file, signal)
}
async function moveTab(event: KeyboardEvent): Promise<void> {
  if (busy.value) return
  const group = (event.currentTarget as HTMLElement).parentElement
  activeTab.value = activeTab.value === 'domains' ? 'identity' : 'domains'
  await nextTick()
  group?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus()
}
function uploadError(error: unknown): void {
  const failure = error as { message?: string; response?: { data?: { msg?: string } } }
  saveError.value = failure?.response?.data?.msg || failure?.message || '图片上传失败，请重试'
}
function beforeUnload(event: BeforeUnloadEvent): void { if (dirty.value || uploading.value) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => { window.addEventListener('beforeunload', beforeUnload); void load() })
onBeforeUnmount(() => { disposed = true; controller?.abort(); window.removeEventListener('beforeunload', beforeUnload) })
defineExpose({ hasUnsavedChanges: dirty, isSaving: busy })
</script>

<template>
  <section class="mm-tenant-brand-settings" :class="{ 'is-page': fullPage }" data-mm-component="tenant-brand-settings" :aria-busy="busy">
    <header v-if="fullPage" class="mm-tenant-brand-settings__header">
      <span class="mm-tenant-brand-settings__icon"><MmIcon name="globe" :size="22" /></span>
      <div><h1>{{ copy.title }}</h1><p>{{ copy.description }}</p></div>
      <div class="mm-tenant-brand-settings__updated"><span><MmIcon name="clock" :size="12" />{{ copy.updated }}</span><time>{{ updatedAt }}</time></div>
    </header>
    <div class="mm-tenant-brand-settings__tabs" role="tablist" :aria-label="copy.title">
      <button v-for="tab in ['domains', 'identity']" :id="`${id}-tab-${tab}`" :key="tab" type="button" role="tab"
        :aria-selected="activeTab === tab" :aria-controls="`${id}-panel`" :tabindex="activeTab === tab ? 0 : -1" :disabled="busy"
        @click="activeTab = tab" @keydown.right.prevent="moveTab" @keydown.left.prevent="moveTab">
        <MmIcon :name="tab === 'domains' ? 'globe' : 'image'" :size="16" />{{ tab === 'domains' ? copy.tab : english ? 'Theme & identity' : '主题与标识' }}
        <b v-if="tab === 'domains'" role="status" :aria-label="english ? `Access domain count: ${draft.length}` : `访问域名数量：${draft.length}`">{{ loading || loadFailed ? '—' : draft.length }}</b>
      </button>
    </div>
    <div :id="`${id}-panel`" role="tabpanel" :aria-labelledby="`${id}-tab-${activeTab}`" class="mm-tenant-brand-settings__body">
      <MmLoading v-if="loading" :text="copy.loading" />
      <div v-else-if="loadFailed" role="alert" class="mm-tenant-brand-settings__empty"><p>{{ copy.loadFailed }}</p><MmButton @click="load">{{ copy.reload }}</MmButton></div>
      <div v-else-if="detail" class="mm-tenant-brand-settings__content">
        <div v-show="activeTab === 'domains'" class="mm-tenant-brand-settings__toolbar"><h3>{{ copy.titleDomains }}</h3>
          <MmButton v-if="editable && selectedSite" variant="primary" size="sm" :disabled="busy || draft.length >= 20" @click="addDomain"><template #icon><MmIcon name="plus" :size="14" /></template>{{ copy.add }}</MmButton>
        </div>
        <label v-if="detail.sites.length > 1" class="mm-tenant-brand-settings__site"><span>{{ copy.site }}</span>
          <MmSelect :model-value="selectedSiteId" :options="siteOptions" :aria-label="copy.site" :disabled="busy" @update:model-value="selectSite(String($event))" />
        </label>
        <p v-if="!detail.sites.length" class="mm-tenant-brand-settings__empty">{{ copy.emptySites }}</p>
        <template v-else>
          <p v-if="validationError && activeTab === 'domains'" class="mm-tenant-brand-settings__validation" role="alert">{{ validationError }}</p>
          <p v-if="!draft.length && activeTab === 'domains'" class="mm-tenant-brand-settings__empty">{{ copy.empty }}</p>
          <fieldset v-show="activeTab === 'domains' && draft.length" class="mm-tenant-brand-settings__domains" :disabled="busy || !editable">
            <legend class="mm-tenant-brand-settings__sr-only">{{ copy.titleDomains }}</legend>
            <div v-for="(row, index) in draft" :key="row.key" class="mm-tenant-brand-settings__row">
              <label class="mm-tenant-brand-settings__address"><span>{{ copy.address }}</span>
                <MmInput v-model="row.domain" :aria-label="`${copy.address} ${index + 1}`" placeholder="trade.example.com" :maxlength="254" :readonly="!editable" :disabled="busy || !editable">
                  <template #prefix><MmIcon name="globe" :size="15" /></template>
                </MmInput>
              </label>
              <div class="mm-tenant-brand-settings__role"><span>{{ copy.type }}</span>
                <MmRadio button size="sm" :name="`${id}-primary-domain`" :model-value="primaryKey" :value="row.key" :disabled="busy || !editable" :aria-label="`${copy.setPrimary} ${row.domain || index + 1}`" @update:model-value="setPrimary(row.key)">
                  {{ row.is_primary ? copy.primary : copy.backup }}
                </MmRadio>
              </div>
              <MmButton v-if="editable" class="mm-tenant-brand-settings__delete" icon-only :aria-label="`${copy.remove} ${row.domain || index + 1}`" :title="copy.remove" :disabled="busy" @click="removeDomain(row.key)"><MmIcon name="trash-2" :size="15" /></MmButton>
            </div>
          </fieldset>
          <div v-show="activeTab === 'identity'" class="mm-tenant-brand-settings__identity">
            <fieldset class="mm-tenant-brand-settings__themes" :disabled="busy || !editable || !selectedSite?.brand_revision">
              <legend>{{ english ? 'Site theme' : '网站主题' }}</legend>
              <p v-if="!templateId" class="mm-tenant-brand-settings__hint">{{ english ? 'No override selected. Your current theme is preserved.' : '尚未选择新主题，保留站点原有主题。' }}</p>
              <div class="mm-tenant-brand-settings__theme-grid">
                <label v-for="theme in themes" :key="theme.id" class="mm-tenant-brand-settings__theme" :class="{ 'is-selected': templateId === theme.id }">
                  <img :src="theme.preview" :alt="english ? theme.english : theme.name" width="640" height="400" />
                  <span><input v-model="templateId" type="radio" :name="`${id}-theme`" :value="theme.id" /><strong>{{ english ? theme.english : theme.name }}</strong><MmIcon v-if="templateId === theme.id" name="circle-check" :size="16" /></span>
                </label>
              </div>
            </fieldset>
            <div class="mm-tenant-brand-settings__image-grid">
              <section class="mm-tenant-brand-settings__asset"><h3>{{ english ? 'Website logo' : '网站 Logo' }}</h3>
                <p class="mm-tenant-brand-settings__hint">{{ english ? 'Used in the site header and brand identity.' : '用于网站页头等品牌展示位置。' }}</p>
                <ContentCoverUpload :key="`${selectedSiteId}-logo`" v-model="logoUrl" :label="english ? 'Website logo' : '网站 Logo'"
                  :disabled="busy || !editable || !props.uploadImage || !selectedSite?.brand_revision" :upload="uploadImage"
                  @busy-change="logoUploading = $event" @start="saveError = ''" @error="uploadError" />
              </section>
              <section class="mm-tenant-brand-settings__asset"><h3>{{ english ? 'Browser tab icon' : '浏览器标签页图标' }}</h3>
                <p class="mm-tenant-brand-settings__hint">{{ english ? 'Use a square image for the browser tab.' : '用于浏览器标签页，建议上传正方形图片。' }}</p>
                <ContentCoverUpload :key="`${selectedSiteId}-favicon`" v-model="faviconUrl" :label="english ? 'Browser tab icon' : '浏览器标签页图标'"
                  :disabled="busy || !editable || !props.uploadImage || !selectedSite?.brand_revision" :upload="uploadImage"
                  @busy-change="faviconUploading = $event" @start="saveError = ''" @error="uploadError" />
              </section>
            </div>
            <p class="mm-tenant-brand-settings__hint">JPG / PNG / WebP / SVG / ICO，最大 5 MB · {{ english ? 'Changes take effect after saving and apply to all domains of this site.' : '保存配置后生效，同一站点的所有域名共用。' }}</p>
          </div>
        </template>
      </div>
    </div>
    <footer class="mm-tenant-brand-settings__footer">
      <span v-if="saveError" class="mm-tenant-brand-settings__feedback is-error" role="alert">{{ saveError }}</span>
      <span v-else class="mm-tenant-brand-settings__feedback" role="status"><MmIcon :name="dirty ? 'alert' : 'circle-check'" :size="14" />{{ !editable ? copy.readonly : dirty ? copy.dirty : copy.saved }}</span>
      <MmButton v-if="saveError" :disabled="busy" @click="load">{{ copy.discardReload }}</MmButton>
      <MmButton v-if="fullPage" :disabled="busy || !dirty || !editable" @click="discard">{{ copy.discard }}</MmButton>
      <MmButton v-else :disabled="busy" @click="emit('close')">{{ editable ? copy.cancel : copy.close }}</MmButton>
      <MmButton v-if="editable" variant="primary" :loading="saving" :disabled="busy || !selectedSite || !dirty || !!validationError || loadFailed" @click="confirmSave">
        <template #icon><MmIcon name="save" :size="14" /></template>
        {{ copy.save }}
      </MmButton>
    </footer>
    <MmDialog v-model="switchVisible" :title="copy.switchTitle" width="400px" :close-on-click-modal="false">
      <template #footer><MmButton @click="switchVisible = false">{{ copy.cancel }}</MmButton><MmButton variant="primary" @click="confirmSwitch">{{ copy.switchSite }}</MmButton></template>
    </MmDialog>
    <MmDialog v-model="confirmVisible" :title="copy.confirm" width="480px" :close-on-click-modal="false" :before-close="() => !saving" :show-close="!saving" :close-on-escape="!saving">
      <p>{{ copy.confirmText }}</p>
      <div v-if="removedDomains.length" class="mm-tenant-brand-settings__removed"><strong>{{ copy.removed }}</strong><span v-for="domain in removedDomains" :key="domain">{{ domain }}</span></div>
      <template #footer><MmButton :disabled="saving" @click="confirmVisible = false">{{ copy.cancel }}</MmButton><MmButton variant="primary" :loading="saving" :disabled="saving" @click="submit">{{ copy.confirmSave }}</MmButton></template>
    </MmDialog>
  </section>
</template>

<style src="./tenant-brand.css"></style>
