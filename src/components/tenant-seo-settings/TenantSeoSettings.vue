<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { BadgeCheck } from '@lucide/vue'
import { message } from '../../services/message'
import { MmAlert } from '../alert'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmInput } from '../input'
import { MmLoading } from '../loading'
import { MmSegmented } from '../segmented'
import { MmSelect } from '../select'
import type { TenantSeoSettingsProps, TenantSeoDetail, TenantSeoDraft, SeoTranslationContext } from './model'
import ContentCoverUpload from '../../cms/views/content/components/ContentCoverUpload.vue'
import TenantSeoTranslations from './TenantSeoTranslations.vue'
defineOptions({ name: 'MmTenantSeoSettings' })
const props = withDefaults(defineProps<TenantSeoSettingsProps>(), { canEdit: true, fullPage: true })
const emit = defineEmits<{ saved: []; close: [] }>()
const canSave = computed(() => props.canEdit && detail.value?.can_edit !== false)
const visible = ref(true),
    loading = ref(false),
    savingConfig = ref(false), uploadingImage = ref(false),
    saving = computed(() => savingConfig.value || uploadingImage.value),
    loadFailed = ref(false),
    saveFailed = ref(false)
const showLanguages = ref(false),
    verificationOpen = ref(false),
    confirmClose = ref(false)
const detail = ref<TenantSeoDetail | null>(null),
    draft = ref<TenantSeoDraft | null>(null)
const translationContext = ref<SeoTranslationContext | null>(null),
    translationContextLoading = ref(false),
    translationContextFailed = ref(false)
const locale = ref('zh-CN'),
    baseline = ref('')
let scope: { tenant_id: string; site_id: string } | undefined
let controller: AbortController | undefined
let translationController: AbortController | undefined
let generation = 0
const dirty = computed(() => draft.value !== null && JSON.stringify(draft.value) !== baseline.value)
const imageUrl = computed({
    get: () => draft.value?.og_image_url ?? '',
    set: (value: string) => { if (draft.value) draft.value.og_image_url = value.trim() || null }
})
const validImageUrl = computed(() => {
    if (!/^https:\/\/[^/@?#\s]+(?:[/?#][^\s]*)?$/i.test(imageUrl.value)) return false
    try { return !!new URL(imageUrl.value).hostname } catch { return false }
})
const updatedLabel = computed(() => {
    const value = detail.value?.updated_at
    if (!value) return '—'
    if (props.formatUpdatedAt) return props.formatUpdatedAt(value)
    const date = new Date(value.replace(' ', 'T'))
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
})
const indexingOptions = [
    { label: '允许收录', value: 'enabled' },
    { label: '禁止收录', value: 'disabled' }
]
const indexingMode = computed({
    get: () => (draft.value?.indexing_enabled ? 'enabled' : 'disabled'),
    set: (value) => {
        if (draft.value) draft.value.indexing_enabled = value === 'enabled'
    }
})
const title = computed({
    get: () => draft.value?.translations[locale.value]?.title || '',
    set: (value: string) => updateCopy('title', value)
})
const description = computed({
    get: () => draft.value?.translations[locale.value]?.description || '',
    set: (value: string) => updateCopy('description', value)
})
const configuredLocales = computed(() => {
    const targets = new Set(translationContext.value?.settings?.target_locales || [])
    return detail.value?.locales.filter((item) => targets.has(item.value)) || []
})
const completeCount = computed(
    () =>
        configuredLocales.value.filter((item) => {
            const copy = draft.value?.translations[item.value]
            return copy?.title.trim() && copy?.description.trim()
        }).length
)
const translationCountLabel = computed(() =>
    translationContextLoading.value
        ? '正在读取翻译配置'
        : translationContextFailed.value
          ? '翻译配置读取失败'
          : `已配置 ${completeCount.value}/${configuredLocales.value.length}`
)
const domainMismatch = computed(
    () =>
        !!draft.value?.google_verification_token &&
        (!detail.value?.primary_domain ||
            draft.value.verification_domain !== detail.value.primary_domain)
)
function editingLocaleKey(site: Pick<TenantSeoDetail, 'tenant_id' | 'site_id'>) {
    return `tenant_seo_editing_locale:${site.tenant_id}:${site.site_id}`
}
function initialEditingLocale(site: TenantSeoDetail) {
    let remembered: string | null = null
    try { remembered = localStorage.getItem(editingLocaleKey(site)) } catch {}
    const hasCopy = (code: string) => {
        const copy = site.translations[code]
        return Boolean(copy?.title.trim() || copy?.description.trim())
    }
    if (
        typeof remembered === 'string' &&
        site.locales.some((item) => item.value === remembered) &&
        hasCopy(remembered)
    )
        return remembered
    if (hasCopy(site.default_locale)) return site.default_locale
    return site.locales.find((item) => hasCopy(item.value))?.value || site.default_locale
}
function updateCopy(key: 'title' | 'description', value: string) {
    if (!draft.value) return
    const copy = draft.value.translations[locale.value] || { title: '', description: '' }
    draft.value.translations[locale.value] = { ...copy, [key]: value }
}
function setToken(value: string | number) {
    if (!draft.value) return
    draft.value.google_verification_token = String(value).trim() || null
    draft.value.verification_domain = draft.value.google_verification_token
        ? detail.value?.primary_domain || null
        : null
}
function applyTranslations(value: { translations: TenantSeoDraft['translations'] }) {
    if (!draft.value || !canSave.value || saving.value) return
    draft.value.translations = value.translations
}
let requestedSiteId: string | undefined, pendingSiteId: string | undefined
const siteOptions = computed(() => detail.value?.sites?.map(site => ({ label: site.site_name + ' · ' + site.site_id, value: site.site_id })) || [])
function selectSite(value: string) {
    if (saving.value || loading.value || value === detail.value?.site_id || !detail.value?.sites?.some(site => site.site_id === value)) return
    if (dirty.value) { pendingSiteId = value; confirmClose.value = true; return }
    requestedSiteId = value; void loadDetail()
}
async function loadDetail() {
    if (saving.value) return
    controller?.abort()
    translationController?.abort()
    translationContext.value = null
    translationContextLoading.value = false
    translationContextFailed.value = false
    controller = new AbortController()
    const current = ++generation
    loading.value = true
    loadFailed.value = false
    saveFailed.value = false
    detail.value = null
    draft.value = null
    try {
        const result = await props.load(controller.signal, requestedSiteId)
        if (current !== generation || !visible.value) return
        detail.value = result
        scope = { tenant_id: result.tenant_id, site_id: result.site_id }
        requestedSiteId = result.site_id
        draft.value = {
            indexing_enabled: result.indexing_enabled,
            default_locale: result.default_locale,
            translations: JSON.parse(JSON.stringify(result.translations)),
            google_verification_token: result.google_verification_token,
            og_image_url: result.og_image_url ?? null,
            verification_domain: result.verification_domain
        }
        baseline.value = JSON.stringify(draft.value)
        locale.value = initialEditingLocale(result)
        verificationOpen.value = !!result.google_verification_token
        void loadTranslationContext()
    } catch {
        if (current === generation) loadFailed.value = true
    } finally {
        if (current === generation) loading.value = false
    }
}
async function loadTranslationContext() {
    if (!scope || !detail.value) return
    translationController?.abort()
    const request = (translationController = new AbortController())
    const requestScope = { ...scope }
    translationContextLoading.value = true
    translationContextFailed.value = false
    try {
        const value = await props.translation.loadContext({ site_id: requestScope.site_id }, request.signal)
        if (!request.signal.aborted && visible.value) translationContext.value = value
    } catch {
        if (!request.signal.aborted && visible.value) translationContextFailed.value = true
    } finally {
        if (!request.signal.aborted) translationContextLoading.value = false
    }
}
function updateTranslationContext(value: SeoTranslationContext) {
    if (!visible.value || !detail.value) return
    translationController?.abort()
    translationContext.value = value
    translationContextLoading.value = false
    translationContextFailed.value = false
}
function beforeClose() {
    if (saving.value) return false
    if (dirty.value) {
        confirmClose.value = true
        return false
    }
    return true
}
function cancelDiscard() { confirmClose.value = false; pendingSiteId = undefined }
function requestClose() {
    if (beforeClose()) {
        visible.value = false
        disposeEditor()
        emit('close')
    }
}
function discard() {
    confirmClose.value = false
    if (props.fullPage || pendingSiteId) {
        requestedSiteId = pendingSiteId || detail.value?.site_id
        pendingSiteId = undefined
        void loadDetail()
    } else {
        visible.value = false
        disposeEditor()
        emit('close')
    }
}
function disposeEditor() {
    ++generation
    controller?.abort()
    translationController?.abort()
    translationContext.value = null
    translationContextLoading.value = false
    translationContextFailed.value = false
    detail.value = null
    draft.value = null
    loading.value = false
    showLanguages.value = false
    scope = undefined
}
async function save() {
    if (!canSave.value || !draft.value || !detail.value || saving.value || !dirty.value) return
    const copy = draft.value.translations[draft.value.default_locale]
    if (imageUrl.value && !validImageUrl.value) {
        message.error('图片地址无效，请重新上传')
        return
    }
    if (draft.value.indexing_enabled && (!copy?.title.trim() || !copy?.description.trim())) {
        message.error('允许收录前，请填写默认语言的首页标题和描述')
        return
    }
    if (domainMismatch.value) {
        message.error('请清除旧令牌或重新配置当前主域名的令牌')
        return
    }
    if (
        draft.value.google_verification_token &&
        !/^[A-Za-z0-9_-]+$/.test(draft.value.google_verification_token)
    ) {
        message.error('请填写验证令牌，不要粘贴完整 HTML 标签')
        return
    }
    const localePreferenceKey = editingLocaleKey(detail.value)
    const savedEditingLocale = locale.value
    savingConfig.value = true
    saveFailed.value = false
    const current = generation
    try {
        const result = await props.save({
            ...draft.value,
            site_id: detail.value.site_id,
            expected_version: detail.value.version
        })
        if (current !== generation) return
        try { localStorage.setItem(localePreferenceKey, savedEditingLocale) } catch {}
        if (result.detail) {
            detail.value = result.detail
            draft.value = { indexing_enabled: result.detail.indexing_enabled, default_locale: result.detail.default_locale,
                og_image_url: result.detail.og_image_url ?? null,
                translations: JSON.parse(JSON.stringify(result.detail.translations)), google_verification_token: result.detail.google_verification_token,
                verification_domain: result.detail.verification_domain }
        }
        else detail.value = { ...detail.value, ...JSON.parse(JSON.stringify(draft.value)), version: result.version }
        baseline.value = JSON.stringify(draft.value)
        message.success('SEO 配置已保存')
        emit('saved')
    } catch {
        if (current === generation) saveFailed.value = true
    } finally {
        savingConfig.value = false
    }
}
function beforeUnload(event: BeforeUnloadEvent) { if (dirty.value || uploadingImage.value) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => { window.addEventListener('beforeunload', beforeUnload); void loadDetail() })
defineExpose({ hasUnsavedChanges: dirty, isSaving: saving, isBusy: computed(() => loading.value || saving.value), requestClose })
onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnload)
    ++generation
    controller?.abort()
    translationController?.abort()
})

</script>
<template>
<section class="mm-tenant-seo-settings" :class="{ 'is-page': fullPage }" data-mm-component="tenant-seo-settings">
  <header v-if="fullPage" class="mm-tenant-seo-settings__header">
    <span class="mm-tenant-seo-settings__icon"><MmIcon name="search-check" :size="22" /></span>
    <div><h1>SEO 配置</h1><p>配置站点搜索文案、收录意愿与 Google 域名验证。</p></div>
    <div class="mm-tenant-seo-settings__updated">最近更新<time>{{ updatedLabel }}</time></div>
  </header>
  <div class="mm-tenant-seo-settings__body">
    <label v-if="detail && siteOptions.length > 1" class="mm-tenant-seo-settings__site">站点<MmSelect :model-value="detail.site_id" :options="siteOptions" aria-label="配置站点" :disabled="saving || loading" @update:model-value="selectSite(String($event))" /></label>
    <p v-else-if="detail" class="mm-tenant-seo-settings__site">站点：{{ detail.site_name }} · {{ detail.site_id }}</p>
            <div class="seo-editor" :aria-busy="loading">
                <mm-loading v-if="loading" :backdrop="false" text="正在读取 SEO 配置" />
                <div v-else-if="loadFailed" class="seo-error">
                    <mm-alert type="error" :closable="false" description="SEO 配置读取失败" />
                    <mm-button @click="loadDetail">重新加载</mm-button>
                </div>
                <template v-else-if="detail && draft">
                    <div class="seo-indexing">
                        <div class="seo-heading">
                            <span class="seo-indexing-icon"
                                ><mm-icon name="search-check" :size="18"
                            /></span>
                            <span class="seo-heading-copy">
                                <strong>Google 收录</strong>
                                <small>控制首页是否允许 Google 收录</small>
                            </span>
                        </div>
                        <div class="seo-indexing-actions">
                            <span
                                class="seo-indexing-status"
                                :class="{ 'is-disabled': !draft.indexing_enabled }"
                            >
                                <span aria-hidden="true">●</span
                                >{{ draft.indexing_enabled ? '允许收录' : '禁止收录' }}
                            </span>
                            <mm-segmented
                                v-model="indexingMode"
                                :options="indexingOptions"
                                :disabled="!canSave || saving"
                                aria-label="Google 收录"
                            />
                        </div>
                    </div>
                    <mm-alert
                        v-if="
                            draft.indexing_enabled &&
                            detail.blocking_reason &&
                            detail.blocking_reason !== '默认语言文案未完整配置'
                        "
                        type="warning"
                        :closable="false"
                        :description="`自动禁止收录：${detail.blocking_reason}`"
                    />
                    <section class="seo-section seo-copy-card">
                        <div class="seo-copy-heading">
                            <h3>首页搜索文案</h3>
                            <p>配置首页在 Google 搜索结果中展示的标题和描述。</p>
                        </div>
                        <div class="seo-locale-row">
                            <label class="seo-field"
                                >编辑语言
                                <mm-select
                                    v-model="locale"
                                    :options="detail.locales"
                                    aria-label="编辑语言"
                                    :disabled="saving"
                                />
                            </label>
                            <div class="seo-locale-actions">
                                <span class="seo-locale-count"
                                    >{{ translationCountLabel }}</span
                                >
                                <mm-button
                                    class="seo-language-button"
                                    size="sm"
                                    @click="showLanguages = true"
                                >
                                    <template #icon><mm-icon name="languages" :size="14" /></template>
                                    多语言文案
                                </mm-button>
                            </div>
                        </div>
                        <label class="seo-field"
                            >首页标题
                            <mm-input
                                v-model="title"
                                :maxlength="200"
                                aria-label="首页标题"
                                :disabled="!canSave || saving"
                            />
                            <small class="seo-field-help">建议不超过 60 个字符</small>
                        </label>
                        <label class="seo-field"
                            >首页描述
                            <textarea class="mm-tenant-seo-textarea"
                                v-model="description"
                                :rows="3"
                                :maxlength="1000"
                                aria-label="首页描述"
                                :disabled="!canSave || saving"
                            ></textarea>
                            <small class="seo-field-help">建议 80–160 个字符</small>
                        </label>
                    </section>
                    <section class="seo-section seo-copy-card">
                        <div class="seo-copy-heading"><h3>分享预览图（选填）</h3>
                            <p>分享站点链接时使用。上传、替换或移除后，保存配置即可生效。</p>
                        </div>
                        <ContentCoverUpload class="seo-share-upload" :key="detail.site_id" v-model="imageUrl"
                            label="站点分享预览图" :disabled="!canSave || savingConfig"
                            :upload="(file, signal) => upload(detail!.site_id, file, signal)"
                            @busy-change="uploadingImage = $event"
                            @error="message.error($event instanceof Error ? $event.message : '图片上传失败，请重试')" />
                    </section>
                    <section class="seo-section seo-verification">
                        <button
                            class="seo-disclosure"
                            type="button"
                            aria-label="Google Search Console 验证"
                            :aria-expanded="verificationOpen"
                            aria-controls="seo-verification-fields"
                            @click="verificationOpen = !verificationOpen"
                        >
                            <span class="seo-heading"
                                ><BadgeCheck
                                    class="seo-verification-icon"
                                    :size="18"
                                    :stroke-width="1.8"
                                    aria-hidden="true"
                                />
                                <span class="seo-verification-title">
                                    <strong>Google Search Console 验证</strong>
                                    <small>用于确认当前白标域名的所有权</small>
                                </span></span
                            >
                            <span class="seo-disclosure-end">
                                <span class="seo-optional">选填</span>
                                <mm-icon
                                    :name="verificationOpen ? 'chevron-up' : 'chevron-down'"
                                    :size="14"
                                />
                            </span>
                        </button>
                        <div
                            v-if="verificationOpen"
                            id="seo-verification-fields"
                            class="seo-verification-fields"
                        >
                            <p class="seo-verification-hint">
                                仅使用“网址前缀 → HTML 标记”验证时填写；通过 DNS 验证则留空。
                            </p>
                            <label class="seo-field"
                                >HTML 标记验证码
                                <mm-input
                                    :model-value="draft.google_verification_token || ''"
                                    @update:model-value="setToken"
                                    :maxlength="512"
                                    aria-label="HTML 标记验证码"
                                    aria-describedby="seo-verification-help"
                                    :disabled="!canSave || saving"
                                    placeholder="只填写 content 中的验证码"
                                />
                            </label>
                            <p id="seo-verification-help" class="seo-verification-hint">
                                在 Search Console 的 HTML 标记中复制 content 内容
                            </p>
                            <dl class="seo-domain">
                                <dt>绑定域名</dt>
                                <dd>
                                    {{
                                        draft.verification_domain ||
                                        detail.primary_domain ||
                                        '未配置主域名'
                                    }}
                                </dd>
                            </dl>
                            <mm-alert
                                v-if="domainMismatch"
                                type="warning"
                                :closable="false"
                                description="主域名已变更，请清除旧令牌或重新配置当前域名的令牌"
                            />
                            <div class="seo-verification-note">
                                <mm-icon name="circle-check" :size="14" />
                                <span
                                    >Canonical、Sitemap、robots.txt、hreflang
                                    和语言路径无需在此填写。</span
                                >
                            </div>
                        </div>
                    </section>
                    <mm-alert
                        v-if="saveFailed"
                        type="error"
                        :closable="false"
                        description="保存失败，修改已保留。若提示版本冲突，请重新打开配置后再编辑。"
                    />
                </template>
            </div>

  </div>
  <footer class="mm-tenant-seo-settings__footer">
    <span class="mm-tenant-seo-settings__feedback">{{ loading ? '正在读取 SEO 配置' : loadFailed ? 'SEO 配置读取失败' : !canSave ? '当前为只读模式' : dirty ? '配置已修改，待保存' : '当前配置已保存' }}</span>

                <mm-button class="seo-footer-button" :disabled="saving || loading || (fullPage && !dirty)" @click="fullPage ? discard() : requestClose()">{{
                    fullPage ? '放弃修改' : canSave ? '取消' : '关闭'
                }}</mm-button>
                <mm-button
                    v-if="canSave"
                    class="seo-footer-button"
                    variant="primary"
                    :loading="savingConfig"
                    :disabled="loading || !draft || !dirty || saving"
                    @click="save"
                    >保存配置</mm-button
                >

  </footer>
        <TenantSeoTranslations
            v-if="showLanguages && detail && draft"
            :site-id="detail.site_id"
            :callbacks="translation"
            :locales="detail.locales"
            :translations="draft.translations"
            :editing-locale="locale"
            :readonly="!canSave || saving"
            @apply="applyTranslations"
            @context-change="updateTranslationContext"
            @close="showLanguages = false"
        />
        <mm-dialog
            v-model="confirmClose"
            title="放弃未保存的修改？"
            width="360px"
            :close-on-click-modal="false"
        >
            <template #footer>
                <mm-button @click="cancelDiscard">继续编辑</mm-button>
                <mm-button variant="danger" @click="discard">放弃修改</mm-button>
            </template>
        </mm-dialog>

</section>
</template>
<style scoped>
.seo-editor {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    --el-color-primary: var(--mm-color-primary);
}
.seo-indexing {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    min-height: 74px;
    padding: 16px 14px;
    background: color-mix(in srgb, var(--mm-color-primary) 2%, var(--mm-color-panel));
    border: 1px solid var(--mm-color-line-strong);
    border-radius: 10px;
    flex-shrink: 0;
}
.seo-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    font-size: 13px;
    line-height: 18px;
    color: var(--mm-color-text);
}
.seo-indexing-icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: var(--mm-color-primary-soft);
}
.seo-section.seo-copy-card {
    padding-bottom: 14px;
}
.seo-share-upload { max-width: 320px; }
.seo-heading-copy {
    display: grid;
    gap: 3px;
}
.seo-heading-copy small {
    font-size: 10px;
    line-height: 16px;
    color: var(--mm-color-text-muted);
}
.seo-indexing-actions {
    display: flex;
    align-items: center;
    gap: 14px;
}
.seo-indexing-status {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 9px;
    border-radius: 999px;
    color: var(--mm-color-success, #009b6a);
    background: var(--mm-color-success-soft, #e5f7ef);
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
}
.seo-indexing-status.is-disabled {
    color: var(--mm-color-text-muted);
    background: var(--mm-color-bg-subtle, #f7f9fb);
}
.seo-indexing-status > span {
    font-size: 7px;
}
.seo-indexing :deep(.mm-segmented) {
    min-height: 38px;
    padding: 3px;
    border-color: var(--mm-color-line-strong);
    background: var(--mm-color-bg-subtle, #f7f9fb);
    border-radius: 8px;
}
.seo-indexing :deep(.mm-segmented__item) {
    min-height: 30px;
    padding-inline: 11px;
    font-size: 12px;
    font-weight: 400;
}
.seo-indexing :deep(.mm-segmented__item.is-selected) {
    background: var(--mm-color-panel);
    color: var(--mm-color-primary);
    font-weight: 600;
    box-shadow: 0 1px 3px rgb(15 23 42 / 6%);
}
.seo-heading .mm-icon {
    color: var(--mm-color-primary);
    flex-shrink: 0;
}
.seo-section {
    border: 1px solid var(--mm-color-line-strong);
    border-radius: 10px;
    padding: 16px;
    display: grid;
    gap: 16px;
    flex-shrink: 0;
}
h3 {
    font-size: 13px;
    line-height: 18px;
    font-weight: 600;
    color: var(--mm-color-text);
    margin: 0;
}
.seo-copy-heading p {
    margin: 4px 0 0;
    color: var(--mm-color-text-muted);
    font-size: 11px;
    line-height: 18px;
}
.seo-field {
    display: grid;
    gap: 8px;
    font-size: 12px;
    min-width: 0;
    line-height: 16px;
    font-weight: 500;
    color: var(--mm-color-text);
}
.seo-field-help {
    font-size: 11px;
    font-weight: 400;
    line-height: 14px;
    color: var(--mm-color-text-muted);
}
.seo-copy-card > .seo-field {
    gap: 6px;
}
.seo-copy-card :deep(.mm-input),
.seo-copy-card :deep(.mm-select) {
    width: 100%;
}
.seo-copy-card :deep(.mm-input__native),
.seo-copy-card :deep(.mm-select__value),
.seo-copy-card :deep(.el-textarea__inner) {
    font-size: 12px;
}
.seo-copy-card :deep(.el-textarea__inner) {
    min-height: 76px !important;
    padding: 10px 12px;
}
.seo-locale-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--mm-color-line-strong);
}
.seo-locale-row .seo-field {
    width: 260px;
    max-width: 100%;
    flex: 0 1 260px;
    gap: 6px;
    font-size: 11px;
}
.seo-locale-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-top: 22px;
}
.seo-locale-count {
    padding: 4px 9px;
    border-radius: 999px;
    background: var(--mm-color-bg-subtle, #f7f9fb);
    color: var(--mm-color-text-muted);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
}
.seo-language-button {
    height: 34px;
    padding-inline: 11px;
    font-size: 11px;
    color: var(--mm-color-primary);
    border-color: color-mix(in srgb, var(--mm-color-primary) 50%, var(--mm-color-panel));
    background: color-mix(in srgb, var(--mm-color-primary) 4%, var(--mm-color-panel));
}
.seo-disclosure {
    width: 100%;
    border: 0;
    background: transparent;
    color: inherit;
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    cursor: pointer;
    padding: 0;
    font: inherit;
    font-size: 13px;
}
.seo-disclosure:focus-visible {
    outline: 2px solid var(--mm-color-primary);
    outline-offset: 3px;
}
.seo-verification-fields {
    display: grid;
    gap: 12px;
    padding: 16px;
    border-top: 1px solid var(--mm-color-line);
}
.seo-verification {
    padding: 0;
    gap: 0;
    border: 1px solid var(--mm-color-line-strong, var(--mm-color-line));
    border-radius: 10px;
    overflow: hidden;
}
.seo-verification .seo-disclosure {
    min-height: 59px;
    padding: 13px 16px;
}
.seo-verification .seo-heading {
    gap: 14px;
    font-size: 12px;
}
.seo-verification .seo-heading > .mm-icon {
    width: 18px !important;
    height: 18px !important;
}
.seo-verification-icon {
    flex-shrink: 0;
    color: var(--mm-color-primary);
}
.seo-verification-title small {
    font-size: 10px;
    line-height: 14px;
    color: var(--mm-color-text-muted);
    font-weight: 400;
}
.seo-verification-title strong {
    line-height: 16px;
}
.seo-footer-button {
    min-width: 82px;
    height: 36px;
    font-size: 12px;
    border-radius: 6px;
}
.seo-default-language {
    margin-bottom: 12px;
}
@media (max-width: 600px) {
    .seo-indexing {
        align-items: flex-start;
    }
    .seo-indexing-actions {
        margin-left: auto;
    }
    .seo-locale-row .seo-field {
        flex: 1 1 100%;
        width: 100%;
    }
    .seo-locale-actions {
        padding-top: 0;
        margin-left: auto;
    }
}
.seo-verification-title {
    display: grid;
    gap: 3px;
}
.seo-verification-hint {
    color: var(--mm-color-text-muted);
    font-size: 11px;
    font-weight: 400;
    line-height: 1.6;
}
.seo-verification-hint {
    margin: 0;
}
.seo-disclosure-end {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 12px;
    color: var(--mm-color-text-muted);
}
.seo-optional {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--mm-color-bg-subtle, #f7f9fb);
    font-size: 11px;
}
.seo-verification-note {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 6px;
    background: var(--mm-color-bg-subtle, #f7f9fb);
    color: var(--mm-color-text-muted);
    font-size: 11px;
    line-height: 1.6;
}
.seo-verification-note .mm-icon {
    flex-shrink: 0;
    margin-top: 2px;
    color: var(--mm-color-primary);
}
.seo-domain {
    display: flex;
    gap: 12px;
    margin: 0;
    font-size: 12px;
}
.seo-domain dt {
    color: var(--mm-color-text-muted);
    flex-shrink: 0;
}
.seo-domain dd {
    margin: 0;
    overflow-wrap: anywhere;
}
.seo-error {
    display: grid;
    gap: 16px;
    justify-items: start;
}
</style>
<style>
.tenant-seo-overlay.has-mask {
    background: rgb(15 23 42 / 38%);
    backdrop-filter: none;
}
.tenant-seo-panel {
    border-radius: 8px;
}
.tenant-seo-panel > .mm-dialog__header {
    min-height: 64px;
    padding: 10px 16px;
}
.tenant-seo-panel .mm-dialog__title {
    font-size: 16px;
    font-weight: 700;
}
.tenant-seo-panel .mm-dialog__subtitle {
    font-size: 11px;
    line-height: 16px;
    margin-top: 4px;
}
.tenant-seo-panel .mm-dialog__close {
    width: 32px;
    height: 32px;
    border: 1px solid var(--mm-color-line-strong);
    border-radius: 6px;
}
.tenant-seo-panel > .mm-dialog__body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    padding: 0;
}
.tenant-seo-panel > .mm-dialog__footer {
    min-height: 56px;
    padding: 9px 14px;
    gap: 8px;
}
.tenant-seo-panel .el-textarea__inner {
    font-family: inherit;
    color: var(--mm-color-text);
    box-shadow: 0 0 0 1px var(--mm-color-line-strong) inset;
}
.tenant-seo-panel .el-textarea__inner:focus {
    box-shadow: 0 0 0 1px var(--mm-color-primary) inset;
}
</style>

<style>
.mm-tenant-seo-settings { height: 100%; min-height: 0; display: flex; flex-direction: column; color: var(--mm-color-text); background: var(--mm-color-panel); font-family: var(--mm-font-family); font-size: 13px; }
.mm-tenant-seo-settings.is-page { height: calc(100vh - var(--navbar-height, 60px) - 24px); min-height: 440px; border: 1px solid var(--mm-color-line); border-radius: 12px; overflow: hidden; }
.mm-tenant-seo-settings__header { display: flex; align-items: center; gap: 16px; padding: 18px 20px; border-bottom: 1px solid var(--mm-color-line); }
.mm-tenant-seo-settings__icon { display: grid; place-items: center; flex-shrink: 0; width: 40px; height: 40px; color: var(--mm-color-primary); background: var(--mm-color-primary-soft); border-radius: 9px; }
.mm-tenant-seo-settings__header h1 { margin: 0 0 5px; font-size: 17px; }
.mm-tenant-seo-settings__header p { margin: 0; font-size: 12px; color: var(--mm-color-text-muted); }
.mm-tenant-seo-settings__updated { display: grid; gap: 6px; margin-left: auto; text-align: right; font-size: 11px; color: var(--mm-color-text-muted); }
.mm-tenant-seo-settings__body { flex: 1; min-height: 160px; overflow: auto; padding: 20px 22px; }
.is-page .seo-editor, .is-page .mm-tenant-seo-settings__site { max-width: 1180px; margin-inline: auto; }
.mm-tenant-seo-settings__site { display: flex; gap: 12px; align-items: center; margin: 0 0 18px; font-size: 12px; }
.mm-tenant-seo-settings__site .mm-select { width: 340px; max-width: calc(100% - 50px); }
.mm-tenant-seo-settings__footer { display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-top: 1px solid var(--mm-color-line); }
.mm-tenant-seo-textarea { box-sizing: border-box; display: block; width: 100%; min-width: 0; padding: 8px 11px; border: 1px solid var(--mm-color-line-strong); border-radius: 5px; color: var(--mm-color-text); background: var(--mm-color-panel); font: inherit; font-weight: 400; font-size: 13px; line-height: 1.6; resize: vertical; }
.mm-tenant-seo-textarea:focus { outline: 1px solid var(--mm-color-primary); border-color: var(--mm-color-primary); }
.mm-tenant-seo-textarea:disabled { background: var(--mm-color-bg-subtle, #f7f9fb); color: var(--mm-color-text-muted); cursor: not-allowed; }
.mm-tenant-seo-settings__feedback { margin-right: auto; font-size: 12px; color: var(--mm-color-text-muted); }
@media (max-width: 650px) { .mm-tenant-seo-settings__header, .mm-tenant-seo-settings__footer { flex-wrap: wrap; } .mm-tenant-seo-settings__feedback { flex-basis: 100%; } .mm-tenant-seo-settings__updated { margin-left: 56px; text-align: left; } .mm-tenant-seo-settings__body { padding: 16px; } }
</style>
