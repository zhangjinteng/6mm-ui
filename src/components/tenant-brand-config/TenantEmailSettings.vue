<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmInput } from '../input'
import { MmLoading } from '../loading'
import type { TenantEmailAdapter, TenantEmailConfig, TenantEmailSaveInput } from './model'

const props = withDefaults(defineProps<{ siteId: string; adapter: TenantEmailAdapter; canEdit?: boolean }>(), { canEdit: true })
const emit = defineEmits<{ state: [value: { dirty: boolean; busy: boolean }]; saved: [detail: TenantEmailConfig] }>()
const { locale } = useLocale()
const english = computed(() => locale.value === 'en-US')
const detail = ref<TenantEmailConfig | null>(null)
const siteName = ref(''), logoUrl = ref(''), defaultLocale = ref('')
const loading = ref(false), saving = ref(false), error = ref(''), saved = ref(false)
let controller: AbortController | undefined, disposed = false
const busy = computed(() => loading.value || saving.value)
const dirty = computed(() => !!detail.value && (siteName.value !== detail.value.site_name || logoUrl.value !== detail.value.logo_url || defaultLocale.value !== detail.value.default_locale))
const editable = computed(() => props.canEdit && detail.value?.can_publish === true)
const validation = computed(() => {
  if (!siteName.value.trim() || [...siteName.value.trim()].length > 128 || /[\r\n\0]/.test(siteName.value)) return english.value ? 'Enter a brand name (up to 128 characters).' : '请输入品牌名称，最多 128 个字符'
  try {
    if (!defaultLocale.value.trim() || defaultLocale.value.length > 35) throw new Error()
    Intl.getCanonicalLocales(defaultLocale.value.trim())
  } catch { return english.value ? 'Enter a language tag, for example zh-CN or en.' : '请输入语言标签，例如 zh-CN、en' }
  if (logoUrl.value) {
    try {
      const url = new URL(logoUrl.value)
      if (url.protocol !== 'https:' || url.username || url.password || url.hash || (url.port && url.port !== '443') || /[\s\\]/.test(logoUrl.value)
        || new TextEncoder().encode(logoUrl.value).length > 2048 || !detail.value?.resource_hosts.includes(url.hostname.toLowerCase())) throw new Error()
    } catch { return english.value ? 'Use an HTTPS image URL on an allowed host.' : 'Logo 必须是允许主机上的 HTTPS 图片地址' }
  }
  return ''
})
function apply(value: TenantEmailConfig) {
  detail.value = value; siteName.value = value.site_name; logoUrl.value = value.logo_url; defaultLocale.value = value.default_locale
}
function failure(value: unknown): string {
  if (typeof value === 'string') return value
  const e = value as { message?: string; response?: { data?: { msg?: string } } }
  return e?.response?.data?.msg || e?.message || (english.value ? 'Operation failed. Please try again.' : '操作失败，请重试')
}
async function load() {
  controller?.abort(); controller = new AbortController()
  const current = controller, site = props.siteId
  loading.value = true; error.value = ''; saved.value = false; detail.value = null
  try {
    const result = await props.adapter.load(site, current.signal)
    if (!disposed && !current.signal.aborted && site === props.siteId) apply(result)
  } catch (e) { if (!disposed && !current.signal.aborted) error.value = failure(e) }
  finally { if (!disposed && !current.signal.aborted) loading.value = false }
}
async function save() {
  if (busy.value || !editable.value || validation.value || !detail.value || (!dirty.value && detail.value.source === 'rows')) return
  const original = detail.value
  const input: TenantEmailSaveInput = { site_id: props.siteId, expected_version: original.version }
  if (siteName.value !== original.site_name) input.site_name = siteName.value.trim()
  if (logoUrl.value !== original.logo_url) input.logo_url = logoUrl.value // Empty string explicitly clears.
  if (defaultLocale.value !== original.default_locale) input.default_locale = Intl.getCanonicalLocales(defaultLocale.value.trim())[0]
  saving.value = true; error.value = ''; saved.value = false
  try {
    const result = await props.adapter.save(input)
    if (disposed) return
    apply(result.detail); saved.value = true; emit('saved', result.detail)
    try {
      const latest = await props.adapter.load(props.siteId, controller!.signal)
      if (!disposed) { apply(latest); emit('saved', latest) }
    } catch { if (!disposed) error.value = english.value ? 'Saved, but refresh failed. Reload before editing again.' : '已保存，但刷新失败；请重新加载后继续编辑' }
  } catch (e) { if (!disposed) error.value = failure(e) } // Keep draft and original expected version on conflict.
  finally { if (!disposed) saving.value = false }
}
function discard() { if (!busy.value && detail.value) { apply(detail.value); error.value = ''; saved.value = false } }
watch(() => props.siteId, () => { void load() }, { immediate: true })
watch([dirty, busy], () => emit('state', { dirty: dirty.value, busy: busy.value }), { immediate: true })
onBeforeUnmount(() => { disposed = true; controller?.abort() })
</script>

<template>
  <section class="mm-tenant-email-settings" :aria-busy="busy" data-mm-component="tenant-email-settings">
    <header><h3>{{ english ? 'Email brand' : '邮件品牌' }}</h3><p>{{ english ? 'Publish site-specific branding. Existing subjects and message bodies stay unchanged.' : '仅发布本站邮件品牌信息，已有邮件主题和正文保持不变。' }}</p></header>
    <MmLoading v-if="loading" :text="english ? 'Loading email settings…' : '正在读取邮件配置…'" />
    <template v-else-if="detail">
      <div class="mm-tenant-email-settings__versions"><span>{{ english ? 'Email version' : '邮件版本' }}：{{ detail.version }}</span><span>{{ english ? 'Site publication' : '站点发布版本' }}：{{ detail.publication_version }}</span></div>
      <p v-if="!detail.can_publish" role="status">{{ english ? 'Publishing is disabled until the database and v5 consumers are ready.' : '发布尚未启用，请先确认数据库及 v5 消费者已就绪。' }}</p>
      <fieldset :disabled="busy || !editable">
        <label><span>{{ english ? 'Brand name' : '品牌名称' }}</span><MmInput v-model="siteName" :aria-label="english ? 'Email brand name' : '邮件品牌名称'" :maxlength="128" /></label>
        <label><span>{{ english ? 'Email Logo URL' : '邮件 Logo 地址' }}</span><MmInput v-model="logoUrl" :aria-label="english ? 'Email Logo URL' : '邮件 Logo 地址'" :maxlength="2048" placeholder="https://cdn.example.com/logo.png" /><small>{{ english ? 'Leave empty for no logo. This does not modify the website Logo.' : '留空不显示 Logo，不会修改网站 Logo。' }}</small></label>
        <label><span>{{ english ? 'Default language' : '默认语言' }}</span><MmInput v-model="defaultLocale" :aria-label="english ? 'Default email language' : '邮件默认语言'" :maxlength="35" placeholder="zh-CN / en" /></label>
      </fieldset>
      <p class="mm-tenant-email-settings__hosts">{{ english ? 'Allowed image hosts' : '允许的图片主机' }}：{{ detail.resource_hosts.join(', ') || (english ? 'None (use no Logo)' : '未配置（可使用空 Logo）') }}</p>
      <p v-if="detail.source === 'legacy'">{{ english ? 'Saving migrates this site to rows and preserves its existing templates. Static images in old templates are not replaced.' : '保存后本站迁入分行存储并保留现有文案；旧模板中的静态图片不会自动替换。' }}</p>
      <p v-if="dirty && validation" role="alert" class="mm-tenant-email-settings__error">{{ validation }}</p>
    </template>
    <p v-if="error" role="alert" class="mm-tenant-email-settings__error">{{ error }}</p>
    <p v-else-if="saved" role="status">{{ english ? 'Email branding published.' : '邮件品牌已发布' }}</p>
    <div class="mm-tenant-email-settings__actions">
      <MmButton :disabled="busy" @click="load">{{ english ? 'Discard and reload' : '放弃并重新加载' }}</MmButton>
      <MmButton v-if="detail" :disabled="busy || !dirty" @click="discard">{{ english ? 'Discard changes' : '放弃修改' }}</MmButton>
      <MmButton v-if="canEdit && detail" variant="primary" :loading="saving" :disabled="busy || !editable || !!validation || (!dirty && detail.source === 'rows')" @click="save">{{ english ? 'Save and publish' : '保存并发布' }}</MmButton>
    </div>
  </section>
</template>

<style scoped>
.mm-tenant-email-settings { display: grid; gap: 16px; max-width: 720px; margin: 0 auto; }
.mm-tenant-email-settings h3 { margin: 0 0 8px; font-size: 14px; }
.mm-tenant-email-settings p, .mm-tenant-email-settings small { margin: 0; color: var(--mm-color-text-muted); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere; }
.mm-tenant-email-settings__versions { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12px; color: var(--mm-color-text-muted); font-variant-numeric: tabular-nums; }
.mm-tenant-email-settings fieldset { display: grid; gap: 18px; border: 0; padding: 0; margin: 0; min-width: 0; }
.mm-tenant-email-settings label { display: grid; gap: 8px; min-width: 0; }
.mm-tenant-email-settings .mm-input { width: 100%; }
.mm-tenant-email-settings__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; border-top: 1px solid var(--mm-color-line); padding-top: 16px; }
.mm-tenant-email-settings p.mm-tenant-email-settings__error { color: var(--mm-color-danger); }
</style>
