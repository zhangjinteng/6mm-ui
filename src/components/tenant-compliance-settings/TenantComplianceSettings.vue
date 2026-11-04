<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmInput } from '../input'
import { MmLoading } from '../loading'
import { MmSegmented } from '../segmented'
import { MmSelect } from '../select'
import { MmTabPane, MmTabs } from '../tabs'
import { MmTag } from '../tag'
import type { ComplianceDetail, ComplianceDraft, ComplianceType, ComplianceSettingsProps } from './types'
import { complianceTypes, profileFields, stateLabel, normalizeCompliance, toComplianceDraft, validateCompliance } from './model'
defineOptions({ name: 'MmTenantComplianceSettings' })
const props = withDefaults(defineProps<ComplianceSettingsProps>(), { canEdit: true, fullPage: true })
const emit = defineEmits<{ saved: []; close: [] }>()
const canSave = computed(() => props.canEdit && detail.value?.can_edit !== false)
const visible = ref(true),
    loading = ref(false),
    saving = ref(false),
    loadFailed = ref(false)
const detail = ref<ComplianceDetail | null>(null),
    draft = ref<ComplianceDraft | null>(null)
const editor = ref<HTMLElement | null>(null),
    activeTab = ref('profile'),
    attempted = ref(false),
    baseline = ref('')
const serverErrors = ref<Record<string, string>>({}),
    saveState = ref<'saved' | 'failed' | 'uncertain' | ''>('')
let controller: AbortController | undefined,
    generation = 0
const errors = computed(() => ({
    ...(attempted.value && draft.value ? validateCompliance(draft.value) : {}),
    ...serverErrors.value
}))
const dirty = computed(() =>
    Boolean(draft.value && JSON.stringify(normalizeCompliance(draft.value)) !== baseline.value)
)
const needsProfile = computed(() =>
    draft.value?.agreements.some((a) => a.mode === 'platform' && a.is_enabled)
)
const customCount = computed(
    () => draft.value?.agreements.filter((a) => a.mode !== 'platform').length || 0
)
const profileErrorCount = computed(
    () => Object.keys(errors.value).filter((k) => k.startsWith('profile.')).length
)
const agreementErrorCount = computed(
    () => Object.keys(errors.value).filter((k) => k.startsWith('agreements')).length
)
const statusText = computed(() =>
    saving.value
        ? '正在保存…'
        : serverErrors.value.expected_revision ||
          (saveState.value === 'uncertain'
              ? '保存未确认，请重新打开核验'
              : Object.keys(errors.value).length
                ? `待完善 ${Object.keys(errors.value).length} 项`
                : dirty.value
                  ? '未保存'
                  : saveState.value === 'saved'
                    ? '已保存'
                    : canSave.value ? '当前配置已保存' : '当前为只读模式')
)
const sourceOptions = [
    { label: '平台模板', value: 'platform' },
    { label: '自定义', value: 'custom' }
]
const typeInfo = (type: ComplianceType) => complianceTypes.find((t) => t.value === type)!
const metadata = (type: ComplianceType) =>
    detail.value?.agreements.find((a) => a.agreement_type === type)
function platformText(type: ComplianceType) {
    const m = metadata(type)
    // Switching from a custom row does not have platform publication metadata yet.
    if (!m || m.mode !== 'platform') return '保存后引用平台最新发布版本'
    if (m.state === 'incomplete') return `已发布 ${m.published_chapters} 章 · 请完善主体信息`
    if (m.state === 'disabled' && m.published_version !== '0')
        return `平台已发布 ${m.published_chapters} 章`
    return m.state === 'ready'
        ? `自动同步 ${m.published_chapters} 个章节 · V${m.published_version}`
        : stateLabel(m.state)
}
function setMode(index: number, value: string) {
    if (!draft.value || saving.value || !canSave.value) return
    draft.value.agreements[index].mode =
        value === 'platform'
            ? 'platform'
            : metadata(draft.value.agreements[index].agreement_type)?.mode === 'content'
              ? 'content'
              : 'url'
}
function applyDetail(value: ComplianceDetail) {
    detail.value = value
    draft.value = toComplianceDraft(value)
    baseline.value = JSON.stringify(normalizeCompliance(draft.value))
    serverErrors.value = {}
    attempted.value = false
}
async function loadDetail() {
    if (saving.value) return
    controller?.abort()
    controller = new AbortController()
    const current = ++generation
    loading.value = true
    loadFailed.value = false
    detail.value = null
    draft.value = null
    serverErrors.value = {}
    saveState.value = ''
    try {
        const result = await props.load(controller.signal,requestedSiteId)
        if (current === generation && visible.value) {
            requestedSiteId = result.site_id
            applyDetail(result)
        }
    } catch {
        if (current === generation) loadFailed.value = true
    } finally {
        if (current === generation) loading.value = false
    }
}
watch(
    draft,
    () => {
        serverErrors.value = serverErrors.value.expected_revision
            ? { expected_revision: serverErrors.value.expected_revision }
            : {}
        if (saveState.value !== 'uncertain') saveState.value = ''
    },
    { deep: true, flush: 'sync' }
)
async function locateError() {
    const first = Object.keys(errors.value).find(
        (k) => k.startsWith('profile.') || k.startsWith('agreements.')
    )
    if (!first) return
    activeTab.value = first.startsWith('profile.') ? 'profile' : 'agreements'
    await nextTick()
    const el = Array.from(
        editor.value?.querySelectorAll<HTMLElement>('[data-error-key]') || []
    ).find((e) => e.dataset.errorKey === first)
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    ;(el?.matches('input') ? el : el?.querySelector<HTMLElement>('input'))?.focus()
}
async function save() {
    if (
        !canSave.value ||
        !draft.value ||
        !dirty.value ||
        !detail.value ||
        saving.value ||
        Boolean(serverErrors.value.expected_revision) ||
        saveState.value === 'uncertain'
    )
        return
    serverErrors.value = {}
    attempted.value = true
    if (Object.keys(errors.value).length) {
        await locateError()
        return
    }
    saving.value = true
    const current = generation
    try {
        const r = await props.save({
            site_id: detail.value.site_id,
            expected_revision: detail.value.revision,
            ...normalizeCompliance(draft.value)
        })
        if (current !== generation) return
        applyDetail(r.detail)
        saveState.value = 'saved'
        emit('saved')
    } catch (e: unknown) {
        if (current !== generation) return
        const error = e as { errors?: Record<string, string[]>; response?: { data?: { data?: { errors?: Record<string, string[]> } } } } | null
        const returned = error?.errors || error?.response?.data?.data?.errors
        if (returned) {
            serverErrors.value = Object.fromEntries(
                Object.entries(returned).map(([k, v]) => [k, v[0] || '内容不正确'])
            )
            saveState.value = 'failed'
        } else saveState.value = 'uncertain'
        await locateError()
    } finally {
        saving.value = false
    }
}
function disposeEditor() {
    controller?.abort()
    ++generation
    loading.value = false
    detail.value = null
    draft.value = null
    serverErrors.value = {}
    saveState.value = ''
}
function closeEditor() {
    if (!saving.value) {
        visible.value = false
        disposeEditor()
        emit('close')
    }
}

let requestedSiteId: string | undefined, pendingSiteId: string | undefined
const confirmReload = ref(false)
const siteOptions = computed(() => detail.value?.sites?.map(site => ({ label: site.site_name + ' · ' + site.site_id, value: site.site_id })) || [])
const updatedLabel = computed(() => {
    const value = detail.value?.updated_at
    if (!value) return '—'
    if (props.formatUpdatedAt) return props.formatUpdatedAt(value)
    const date = new Date(value.replace(' ', 'T'))
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('zh-CN', { year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false }).format(date)
})
function selectSite(value: string) {
    if (saving.value || loading.value || value === detail.value?.site_id || !detail.value?.sites?.some(site => site.site_id === value)) return
    pendingSiteId = value
    if (dirty.value || saveState.value === 'uncertain') confirmReload.value = true
    else confirmLoad()
}
function confirmLoad() {
    if (saving.value) return
    confirmReload.value = false
    requestedSiteId = pendingSiteId || detail.value?.site_id || requestedSiteId
    pendingSiteId = undefined
    void loadDetail()
}
function discardDraft() {
    if (!saving.value && detail.value && saveState.value !== 'uncertain' && !errors.value.expected_revision) applyDetail(detail.value)
}
function beforeUnload(event: BeforeUnloadEvent) { if (dirty.value) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => { window.addEventListener('beforeunload',beforeUnload); void loadDetail() })
defineExpose({ hasUnsavedChanges: dirty, isSaving: saving, isBusy: computed(() => saving.value || loading.value) })

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload',beforeUnload)
    controller?.abort()
    ++generation
})

</script>
<template>
<section class="mm-tenant-compliance-settings" :class="{ 'is-page': fullPage }" data-mm-component="tenant-compliance-settings">
    <header v-if="fullPage" class="compliance-header">
        <span class="compliance-header__icon"><MmIcon name="scale" :size="22" /></span>
        <div><h1>合规配置</h1><p>维护法律主体信息以及前台展示的协议文件。</p></div>
        <div class="compliance-updated"><span><MmIcon name="clock" :size="12" />最近更新</span><time>{{ updatedLabel }}</time></div>
    </header>
    <div class="compliance-body">
        <label v-if="detail && siteOptions.length > 1" class="compliance-site">站点<MmSelect :model-value="detail.site_id" :options="siteOptions" aria-label="配置站点" :disabled="saving || loading" @update:model-value="selectSite(String($event))" /></label>
        <p v-else-if="detail" class="compliance-site">站点：{{ detail.site_name }} · {{ detail.site_id }}</p>
            <div ref="editor" class="compliance-editor" :aria-busy="loading">
                <MmLoading v-if="loading" text="正在读取合规配置…" />
                <div v-else-if="loadFailed" class="load-message">
                    <p role="alert">读取失败，请重试。</p>
                    <mm-button @click="loadDetail">重新加载</mm-button>
                </div>
                <template v-else-if="draft && detail">
                    <mm-tabs v-model="activeTab">
                        <mm-tab-pane
                            name="profile"
                            :label="
                                profileErrorCount ? `主体信息 (${profileErrorCount})` : '主体信息'
                            "
                        >
                            <header class="section-intro">
                                <h3>协议变量</h3>
                                <p>
                                    各站点独立管理。主体信息与该站点开户资料共用；启用平台模板时需完整填写。
                                </p>
                            </header>
                            <div class="profile-grid">
                                <div class="field">
                                    <label for="compliance-tenant-name">白标名称</label
                                    ><mm-input
                                        id="compliance-tenant-name"
                                        :model-value="detail.tenant_name"
                                        aria-label="白标名称"
                                        disabled
                                    /><small v-text="'{{WHITE_LABEL_NAME}} · 读取开户资料'" />
                                </div>
                                <div
                                    v-for="field in profileFields"
                                    :key="field.key"
                                    class="field"
                                >
                                    <label :for="`compliance-${field.key}`"
                                        >{{ field.label
                                        }}<span v-if="needsProfile" class="required">
                                            *</span
                                        ></label
                                    >
                                    <mm-input
                                        :id="`compliance-${field.key}`"
                                        v-model="draft.profile[field.key]"
                                        :aria-label="field.label"
                                        :type="field.type || 'text'"
                                        :maxlength="field.max"
                                        :disabled="saving || !canSave"
                                        :aria-invalid="Boolean(errors[`profile.${field.key}`])"
                                        :status="
                                            errors[`profile.${field.key}`] ? 'error' : undefined
                                        "
                                        :aria-describedby="`error-${field.key}`"
                                        :data-error-key="`profile.${field.key}`"
                                    />
                                    <p
                                        v-if="errors[`profile.${field.key}`]"
                                        :id="`error-${field.key}`"
                                        class="field-error"
                                    >
                                        {{ errors[`profile.${field.key}`] }}
                                    </p>
                                    <small v-text="'{{' + field.token + '}}'" />
                                </div>
                            </div>
                            <p class="footnote">
                                协议联系邮箱使用本站点资料中的
                                support_email；不会改动渠道配置中的租户级备用客服邮箱。
                            </p>
                        </mm-tab-pane>
                        <mm-tab-pane
                            name="agreements"
                            :label="
                                agreementErrorCount
                                    ? `协议文件 (${agreementErrorCount})`
                                    : '协议文件'
                            "
                        >
                            <header class="section-intro intro-row">
                                <div>
                                    <h3>协议文件</h3>
                                    <p>
                                        使用平台最新已发布模板，或填写本站点的公开 HTTPS 协议链接。
                                    </p>
                                </div>
                                <mm-tag size="sm" effect="soft">{{ customCount }} 项自定义</mm-tag>
                            </header>
                            <p
                                v-if="
                                    detail.agreements.some(
                                        (a) => a.mode === 'platform' && a.state === 'unpublished'
                                    )
                                "
                                class="footnote"
                            >
                                平台模板尚未发布。保存站点配置不会发布平台草稿，也不会复制覆盖自定义协议。
                            </p>
                            <div class="agreement-cards">
                                <article
                                    v-for="(item, index) in draft.agreements"
                                    :key="item.agreement_type"
                                    class="agreement-card"
                                >
                                    <div class="agreement-heading">
                                        <span class="agreement-icon"
                                            ><mm-icon
                                                :name="typeInfo(item.agreement_type).icon"
                                                :size="20"
                                        /></span>
                                        <div>
                                            <h4>{{ typeInfo(item.agreement_type).label }}</h4>
                                            <p>{{ typeInfo(item.agreement_type).description }}</p>
                                        </div>
                                    </div>
                                    <div class="agreement-controls">
                                        <mm-segmented
                                            :model-value="
                                                item.mode === 'platform' ? 'platform' : 'custom'
                                            "
                                            :options="sourceOptions"
                                            :aria-label="`${typeInfo(item.agreement_type).label}来源`"
                                            :disabled="saving || !canSave"
                                            @update:model-value="setMode(index, String($event))"
                                        />
                                        <div class="agreement-value">
                                            <template v-if="item.mode === 'platform'"
                                                ><span
                                                    :class="[
                                                        'platform-state',
                                                        {
                                                            ready:
                                                                metadata(item.agreement_type)
                                                                    ?.state === 'ready'
                                                        }
                                                    ]"
                                                    ><mm-icon name="refresh-cw" :size="14" />{{
                                                        platformText(item.agreement_type)
                                                    }}</span
                                                ></template
                                            >
                                            <template v-else-if="item.mode === 'content'"
                                                ><span class="muted"
                                                    >保留已存自定义正文 · 此入口不编辑正文</span
                                                ><mm-button
                                                    size="sm"
                                                    :disabled="saving || !canSave"
                                                    @click="item.mode = 'url'"
                                                    >改用链接</mm-button
                                                ></template
                                            >
                                            <template v-else
                                                ><mm-input
                                                    v-model="item.url"
                                                    :maxlength="2048"
                                                    placeholder="https://…"
                                                    :aria-label="`${typeInfo(item.agreement_type).label}链接`"
                                                    :disabled="saving || !canSave"
                                                    :aria-invalid="
                                                        Boolean(errors[`agreements.${index}.url`])
                                                    "
                                                    :status="
                                                        errors[`agreements.${index}.url`]
                                                            ? 'error'
                                                            : undefined
                                                    "
                                                    :data-error-key="`agreements.${index}.url`"
                                                    :aria-describedby="`agreement-error-${index}`"
                                                />
                                                <p
                                                    v-if="errors[`agreements.${index}.url`]"
                                                    :id="`agreement-error-${index}`"
                                                    class="field-error"
                                                >
                                                    {{ errors[`agreements.${index}.url`] }}
                                                </p></template
                                            >
                                        </div>
                                        <button type="button" class="compliance-switch" role="switch"
                                            :aria-label="`${typeInfo(item.agreement_type).label}启用`" :aria-checked="item.is_enabled"
                                            :disabled="saving || !canSave" @click="item.is_enabled = !item.is_enabled"><span /></button><span class="enable-label">{{
                                            item.is_enabled ? '已启用' : '已停用'
                                        }}</span>
                                    </div>
                                </article>
                            </div>
                        </mm-tab-pane>
                    </mm-tabs>
                    <p v-if="errors.agreements || errors.config" class="field-error" role="alert">
                        {{ errors.agreements || errors.config }}
                    </p>
                </template>
            </div>

    </div>
    <footer class="compliance-footer">
<span
                    role="status"
                    aria-live="polite"
                    class="save-status"
                    :class="{ invalid: Object.keys(errors).length || saveState === 'uncertain' }"
                    >{{ statusText }}</span
                ><mm-button :disabled="saving || (fullPage && (!dirty || saveState === 'uncertain' || Boolean(errors.expected_revision)))" @click="fullPage ? discardDraft() : closeEditor()">{{
                    fullPage ? '放弃修改' : canSave ? '取消' : '关闭'
                }}</mm-button
                ><mm-button
                    v-if="canSave"
                    variant="primary"
                    :loading="saving"
                    :disabled="
                        loading ||
                        !draft ||
                        !dirty ||
                        saving ||
                        saveState === 'uncertain' ||
                        Boolean(errors.expected_revision)
                    "
                    @click="save"
                    >保存配置</mm-button
                >
        <MmButton v-if="saveState === 'uncertain' || errors.expected_revision" :disabled="saving" @click="pendingSiteId = undefined; confirmReload = true">重新加载核验</MmButton>
    </footer>
    <MmDialog v-model="confirmReload" title="放弃未保存的修改并重新加载？" width="400px" :close-on-click-modal="false">
        <p>重新加载后将以服务器上的配置为准，当前未保存的修改不会保留。</p>
        <template #footer><MmButton @click="confirmReload = false; pendingSiteId = undefined">继续编辑</MmButton><MmButton variant="primary" @click="confirmLoad">确认重新加载</MmButton></template>
    </MmDialog>
</section>
</template>
<style scoped>
.compliance-editor {
    min-height: 260px;
}
.section-intro {
    margin: 18px 0;
}
.section-intro h3 {
    margin: 0 0 6px;
    font-size: 14px;
    font-weight: 600;
}
.section-intro p,
.agreement-heading p,
.footnote {
    color: var(--mm-color-text-muted);
    font-size: 12px;
    line-height: 1.7;
    margin: 0;
}
.intro-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}
.profile-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 16px;
}
.field {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 7px;
}
.field label {
    font-size: 13px;
    font-weight: 500;
}
.required,
.field-error {
    color: var(--mm-color-danger, #dc2626);
}
.field-error {
    font-size: 12px;
    line-height: 1.5;
    margin: 5px 0 0;
}
.field small,
.muted {
    color: var(--mm-color-text-muted);
    font-size: 11px;
}
.footnote {
    margin: 18px 0;
    padding: 10px 12px;
    background: var(--mm-color-fill, #f6f8fb);
    border-radius: 6px;
}
.agreement-cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.agreement-card {
    border: 1px solid var(--mm-color-line, #dce2ec);
    border-radius: 9px;
    padding: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
}
.agreement-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1 1 230px;
}
.agreement-heading h4 {
    margin: 0 0 4px;
    font-size: 13px;
}
.agreement-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: var(--mm-color-primary);
    background: var(--mm-color-primary-soft);
}
.agreement-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 2 1 480px;
}
.agreement-value {
    min-width: 0;
    flex: 1;
}
.platform-state {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    padding: 9px;
    border-radius: 5px;
    background: var(--mm-color-fill, #f6f8fb);
    color: var(--mm-color-text-muted);
}
.platform-state.ready {
    color: var(--mm-color-success);
}
.enable-label {
    font-size: 11px;
    white-space: nowrap;
}
.agreement-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
}
.save-status {
    margin-right: auto;
    color: var(--mm-color-text-muted);
    font-size: 12px;
    text-align: left;
}
.save-status.invalid {
    color: var(--mm-color-warning, #b45309);
}
.load-message {
    padding: 40px 0;
    text-align: center;
}
@media (max-width: 640px) {
    .profile-grid {
        grid-template-columns: 1fr;
    }
    .agreement-card {
        padding: 12px;
    }
    .agreement-controls {
        flex-wrap: wrap;
        flex-basis: 100%;
    }
    .agreement-value {
        flex-basis: 100%;
        order: 2;
    }
    .enable-label {
        margin-right: auto;
    }
}
</style>

<style scoped>
.mm-tenant-compliance-settings { display:flex; flex-direction:column; height:100%; min-height:0; color:var(--mm-color-text); background:var(--mm-color-panel); font:13px var(--mm-font-family); }
.mm-tenant-compliance-settings.is-page { box-sizing:border-box; height:calc(100vh - var(--navbar-height, 60px) - 24px); min-height:440px; border:1px solid var(--mm-color-line); border-radius:12px; overflow:hidden; }
.compliance-header { display:flex; align-items:center; gap:16px; padding:18px 20px; border-bottom:1px solid var(--mm-color-line); }
.compliance-header__icon { display:grid; place-items:center; flex-shrink:0; width:40px; height:40px; border-radius:9px; color:var(--mm-color-primary); background:var(--mm-color-primary-soft); }
.compliance-header h1 { margin:0 0 5px; font-size:17px; }
.compliance-header p { margin:0; font-size:12px; color:var(--mm-color-text-muted); }
.compliance-updated { margin-left:auto; display:grid; gap:6px; text-align:right; font-size:11px; color:var(--mm-color-text-muted); }
.compliance-updated > span { display:inline-flex; justify-content:flex-end; align-items:center; gap:5px; }
.compliance-body { flex:1; min-height:180px; overflow:auto; padding:16px 20px 24px; }
.compliance-site { display:flex; align-items:center; gap:12px; margin:0 0 12px; font-size:12px; }
.compliance-site .mm-select { width:340px; max-width:calc(100% - 50px); }
.compliance-footer { display:flex; gap:8px; align-items:center; padding:14px 18px; border-top:1px solid var(--mm-color-line); }
.is-page .section-intro,.is-page .profile-grid,.is-page .agreement-cards,.is-page .footnote,.is-page .compliance-site { max-width:1180px; margin-left:auto; margin-right:auto; }
.compliance-switch { position:relative; width:34px; height:32px; padding:0; border:0; border-radius:7px; flex-shrink:0; background:transparent; cursor:pointer; }
.compliance-switch::before { content:''; position:absolute; left:2px; top:8px; width:30px; height:16px; background:var(--mm-color-line-strong,#d6dce7); border-radius:20px; }
.compliance-switch > span { position:absolute; top:10px; left:4px; width:12px; height:12px; border-radius:50%; background:white; transition:transform .15s; }
.compliance-switch[aria-checked='true']::before { background:var(--mm-color-primary); }
.compliance-switch[aria-checked='true'] > span { transform:translateX(14px); }
.compliance-switch:disabled { opacity:.5; cursor:not-allowed; }
.compliance-switch:focus-visible { outline:2px solid var(--mm-color-primary); outline-offset:2px; }
@media(max-width:640px) { .compliance-header,.compliance-footer { flex-wrap:wrap; } .compliance-updated { margin-left:56px; text-align:left; } .compliance-footer .save-status { flex-basis:100%; } .compliance-body { padding:16px; } }
@media(prefers-reduced-motion:reduce) { .compliance-switch > span { transition:none; } }
</style>
