<template>
    <section ref="editorRoot" class="article-editor" :aria-busy="loading || saving">
        <header class="article-editor__header">
            <MmButton
                icon-only
                title="返回公告列表"
                aria-label="返回公告列表"
                :disabled="saving || uploading"
                @click="close"
                ><MmIcon name="arrow-left" :size="16"
            /></MmButton>
            <div class="article-editor__heading">
                <h2>{{ articleId ? '编辑公告' : '新增公告' }}</h2>
                <span>{{ metadata?.source_locale || 'zh-CN' }} · {{ editorSourceName }}</span>
            </div>
            <div class="article-editor__commands">
                <MmButton
                    v-if="articleId && canDelete"
                    size="sm"
                    :disabled="loading || loadFailed || saving || uploading"
                    @click="deleteOpen = true"
                    >删除公告</MmButton
                >
                <MmButton size="sm" :disabled="loading || loadFailed" @click="seoOpen = true"
                    ><template #icon><MmIcon name="search" :size="14" /></template>SEO
                    设置</MmButton
                >
                <MmButton
                    v-if="!readonly"
                    size="sm"
                    :disabled="loading || loadFailed || saving || uploading"
                    @click="draft"
                    ><template #icon><MmIcon name="save" :size="14" /></template>保存草稿</MmButton
                >
                <span v-if="saveError" class="article-editor__save-error" role="alert">{{
                    saveError
                }}</span>
                <span
                    v-if="!readonly && pendingCount"
                    class="article-editor__pending"
                    role="status"
                    aria-live="polite"
                    >还有 {{ pendingCount }} 项待完善</span
                >
                <MmButton
                    v-if="!readonly && canPublish"
                    variant="primary"
                    size="sm"
                    :disabled="loading || loadFailed || uploading"
                    :loading="saving"
                    @click="save(form.scheduled_local ? 'scheduled' : 'published')"
                    ><template #icon><MmIcon name="arrow-up-to-line" :size="14" /></template
                    >{{ form.scheduled_local ? '定时发布' : '发布' }}</MmButton
                >
            </div>
        </header>
        <div v-if="loading" class="article-editor__loading" role="status">
            <MmIcon name="loader-circle" class="announcement-spin" :size="28" /><span
                >正在读取公告资料...</span
            >
        </div>
        <div v-else-if="loadFailed" class="article-editor__failure">
            <MmAlert type="error" :description="error" :closable="false" /><MmButton @click="load"
                >重新加载</MmButton
            >
        </div>
        <template v-else>
            <div v-if="error" class="article-editor__error">
                <MmAlert type="error" :description="error" :closable="false" />
            </div>
            <div class="article-editor__body">
                <aside class="article-editor__settings">
                    <MmForm :model="form" :rules="fieldRules" label-position="top" @submit.prevent>
                        <MmFormItem
                            label="公告分类"
                            prop="category_id"
                            :error="fieldErrors.category_id"
                            required
                            ><MmSelect
                                v-model="form.category_id"
                                :options="categoryOptions"
                                clearable
                                :disabled="locked"
                                aria-label="公告分类"
                        /></MmFormItem>
                        <h3>公告设置</h3>
                        <MmFormItem
                            label="公告封面"
                            prop="cover_url"
                            :error="fieldErrors.cover_url"
                        >
                            <ContentCoverUpload
                                v-model="form.cover_url"
                                label="公告封面"
                                :disabled="locked"
                                :upload="uploadAnnouncementCover"
                                @busy-change="uploading = $event"
                                @start="error = ''"
                                @error="uploadError"
                            />
                        </MmFormItem>
                        <MmFormItem
                            label="内容来源"
                            prop="content_source"
                            :error="fieldErrors.content_source"
                            ><MmInput
                                v-model="form.content_source"
                                :maxlength="160"
                                :disabled="locked"
                                aria-label="内容来源"
                        /></MmFormItem>
                        <MmFormItem
                            label="作者署名"
                            prop="author_name"
                            :error="fieldErrors.author_name"
                            ><MmInput
                                v-model="form.author_name"
                                :maxlength="120"
                                :disabled="locked"
                                aria-label="作者署名"
                        /></MmFormItem>
                        <MmFormItem
                            label="前端排序"
                            prop="sort_order"
                            :error="fieldErrors.sort_order"
                            ><MmInputNumber
                                v-model="form.sort_order"
                                :min="0"
                                :max="2147483647"
                                :precision="0"
                                :disabled="locked"
                                aria-label="前端排序"
                        /></MmFormItem>
                        <h3>发布设置</h3>
                        <MmFormItem
                            label="允许有帮助评价"
                            prop="helpful_enabled"
                            :error="fieldErrors.helpful_enabled"
                        >
                            <EnabledToggle
                                v-model="form.helpful_enabled"
                                :disabled="locked"
                                label="允许评价"
                                aria-label="允许有帮助评价"
                            />
                        </MmFormItem>
                        <MmFormItem
                            label="启用状态"
                            prop="is_enabled"
                            :error="fieldErrors.is_enabled"
                            ><EnabledToggle
                                v-model="form.is_enabled"
                                :disabled="locked"
                                label="已启用"
                                aria-label="启用状态"
                        /></MmFormItem>
                        <MmFormItem
                            label="计划发布时间（本地时区）"
                            prop="scheduled_local"
                            :error="fieldErrors.scheduled_local"
                            ><MmInput
                                v-model="form.scheduled_local"
                                type="datetime-local"
                                :disabled="locked || !canPublish"
                                aria-label="计划发布时间"
                        /></MmFormItem>
                        <p class="article-editor__hint">
                            不填时间则立即发布。源语言正文修改后，已有对应翻译将标记为待更新。
                        </p>
                    </MmForm>
                </aside>
                <main class="article-editor__content">
                    <MmForm :model="form" :rules="fieldRules" label-position="top" @submit.prevent>
                        <MmFormItem label="标题" prop="title" :error="fieldErrors.title" required
                            ><MmInput
                                v-model="form.title"
                                :maxlength="255"
                                :disabled="locked"
                                placeholder="输入公告标题"
                                aria-label="公告标题"
                        /></MmFormItem>
                        <MmFormItem label="摘要" prop="summary" :error="fieldErrors.summary">
                            <textarea
                                v-model="form.summary"
                                :aria-invalid="!!fieldErrors.summary"
                                class="article-editor__textarea"
                                :rows="3"
                                :maxlength="10000"
                                :disabled="locked"
                                aria-label="公告摘要"
                            />
                        </MmFormItem>
                        <MmFormItem label="正文" prop="body_html" :error="fieldErrors.body_html"
                            ><MmRichTextEditor
                                v-model="form.body_html"
                                :readonly="readonly"
                                :disabled="saving"
                                :min-height="420"
                                :max-height="760"
                                aria-label="公告正文"
                        /></MmFormItem>
                    </MmForm>
                </main>
            </div>
        </template>
        <MmDialog v-model="seoOpen" title="SEO 设置" width="540px" :close-on-click-modal="false"
            ><MmForm :model="form" :rules="fieldRules" label-position="top" @submit.prevent
                ><MmFormItem
                    label="SEO 描述"
                    prop="seo_description"
                    :error="fieldErrors.seo_description"
                >
                    <textarea
                        ref="seoInput"
                        v-model="form.seo_description"
                        :aria-invalid="!!fieldErrors.seo_description"
                        class="article-editor__textarea"
                        :rows="5"
                        :maxlength="2000"
                        :disabled="locked"
                        aria-label="SEO 描述"
                    /></MmFormItem></MmForm
            ><template #footer
                ><MmButton variant="primary" @click="seoOpen = false">确定</MmButton></template
            ></MmDialog
        >
        <MmDialog
            v-model="deleteOpen"
            title="确认删除"
            :subtitle="`操作对象：${form.title || '未命名公告'}`"
            width="460px"
            panel-class="announcement-delete-dialog"
            :close-on-click-modal="false"
            :before-close="() => !saving"
        >
            <template #header-actions>
                <span class="announcement-delete-dialog__icon" aria-hidden="true">
                    <MmIcon name="shield-alert" :size="18" color="var(--mm-color-danger)" />
                </span>
            </template>
            <MmAlert
                class="announcement-delete-dialog__notice"
                type="warning"
                :closable="false"
                :show-icon="false"
                description="确定删除这条公告吗？删除后将不再展示，请谨慎操作。"
            />
            <template #footer
                ><MmButton :disabled="saving" @click="deleteOpen = false">取消</MmButton
                ><MmButton variant="warning" :loading="saving" @click="removeArticle"
                    >确认删除</MmButton
                ></template
            >
        </MmDialog>
        <MmDialog v-model="discardOpen" title="放弃未保存的修改？" width="360px"
            ><template #footer
                ><MmButton @click="discardOpen = false">继续编辑</MmButton
                ><MmButton variant="primary" @click="emit('close')">放弃修改</MmButton></template
            ></MmDialog
        >
        <MmDialog
            v-model="unpublishOpen"
            title="将公告转为草稿？"
            subtitle="当前发布或定时发布状态将被取消。"
            width="420px"
            ><template #footer
                ><MmButton @click="unpublishOpen = false">取消</MmButton
                ><MmButton variant="primary" @click="confirmDraft">转为草稿</MmButton></template
            ></MmDialog
        >
    </section>
</template>
<script setup lang="ts">
import { useCmsRuntime } from "../../../../runtime"
const { hasPermission } = useCmsRuntime()

import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { onBeforeCmsLeave as onBeforeRouteLeave } from "../../../../runtime"
import {
    MmButton,
    MmIcon,
    MmAlert,
    MmForm,
    MmFormItem,
    MmInput,
    MmInputNumber,
    MmSelect,
    MmDialog,
    MmRichTextEditor,
    message
} from "../../../../../index"
import { useAnnouncementApi, type AnnouncementMetadata, type AnnouncementArticle } from "../../../../api/content/announcement"
const { announcementError, announcementCategoryLabel, deleteAnnouncement, getAnnouncementDetail, getAnnouncementMetadata, saveAnnouncement, uploadAnnouncementCover } = useAnnouncementApi()
import EnabledToggle from '../../help/EnabledToggle.vue'
import { useArticleValidation } from '../../useArticleValidation'
import ContentCoverUpload from '../../components/ContentCoverUpload.vue'

const props = defineProps<{ articleId?: string }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const loading = ref(true),
    saving = ref(false),
    loadFailed = ref(false),
    error = ref(''),
    seoOpen = ref(false),
    discardOpen = ref(false),
    unpublishOpen = ref(false),
    deleteOpen = ref(false)
const editorSourceName = ref(useCmsRuntime().mode === 'white_label' ? '当前站点内容' : '平台默认内容模板')
const metadata = ref<AnnouncementMetadata>(),
    currentStatus = ref('draft')
const uploading = ref(false)
const canPublish = computed(() => hasPermission(['cms_announcement:publish']))
const readonly = computed(
    () =>
        !hasPermission([`cms_announcement:${props.articleId ? 'edit' : 'add'}`]) ||
        (!canPublish.value && currentStatus.value !== 'draft')
)
const canDelete = computed(
    () =>
        hasPermission(['cms_announcement:delete']) &&
        (canPublish.value || currentStatus.value === 'draft')
)
async function removeArticle() {
    if (!canDelete.value || saving.value || loading.value || loadFailed.value) return
    saving.value = true
    error.value = ''
    try {
        await deleteAnnouncement('articles', form.id, form.row_version)
        original = JSON.stringify(form)
        message.success('公告已删除')
        emit('saved')
    } catch (e) {
        error.value = announcementError(e)
        deleteOpen.value = false
    } finally {
        saving.value = false
    }
}
const locked = computed(() => readonly.value || saving.value)
const form = reactive({
    id: '',
    row_version: '',
    title: '',
    category_id: '',
    summary: '',
    body_html: '',
    seo_description: '',
    cover_url: '',
    content_source: '',
    author_name: '',
    sort_order: 10 as number | null,
    is_enabled: true,
    helpful_enabled: true,
    scheduled_local: ''
})
const {
    editorRoot,
    seoInput,
    fieldRules,
    fieldErrors,
    pendingCount,
    saveError,
    validateSave,
    setSaveFailure,
    focusFirstError,
    focusSeoError
} = useArticleValidation(form, () => metadata.value?.categories || [], 'announcement', seoOpen)

const categoryOptions = computed(() =>
    (metadata.value?.categories || []).map((c) => ({
        label:
            announcementCategoryLabel(metadata.value, c.id) +
            (c.effective_enabled ? '' : ' (已停用)'),
        value: c.id,
        disabled: !c.effective_enabled
    }))
)
let original = '',
    controller: AbortController | undefined
function localDate(value: string | null) {
    if (!value) return ''
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
async function load() {
    controller?.abort()
    controller = new AbortController()
    const current = controller
    loading.value = true
    loadFailed.value = false
    error.value = ''
    try {
        metadata.value = await getAnnouncementMetadata(current.signal, { cms_source_type: 'platform' })
        if (props.articleId) {
            const data = await getAnnouncementDetail<AnnouncementArticle>(
                'articles',
                props.articleId,
                current.signal
            )
            metadata.value = await getAnnouncementMetadata(current.signal, { space_id: String(data.space_id) })
            editorSourceName.value = String(data.cms_source_name || '—')
            if (current.signal.aborted) return
            for (const key of ['id', 'row_version', 'title', 'sort_order', 'is_enabled'] as const)
                Object.assign(form, { [key]: data[key] })
            form.category_id = data.category_id || ''
            form.helpful_enabled = data.helpful_enabled ?? true
            for (const key of [
                'summary',
                'body_html',
                'seo_description',
                'cover_url',
                'content_source',
                'author_name'
            ] as const)
                form[key] = data[key] || ''
            form.scheduled_local =
                data.publish_status === 'scheduled' ? localDate(data.scheduled_at) : ''
            currentStatus.value = data.publish_status
        }
        original = JSON.stringify(form)
    } catch (e) {
        if (!current.signal.aborted) {
            error.value = announcementError(e)
            loadFailed.value = true
        }
    } finally {
        if (!current.signal.aborted) loading.value = false
    }
}
const dirty = () => !loading.value && !loadFailed.value && original !== JSON.stringify(form)
function close() {
    if (dirty()) discardOpen.value = true
    else emit('close')
}
function draft() {
    if (currentStatus.value !== 'draft') unpublishOpen.value = true
    else void save('draft')
}
function confirmDraft() {
    unpublishOpen.value = false
    void save('draft')
}
async function save(status: AnnouncementArticle['publish_status']) {
    if (locked.value || loading.value || loadFailed.value || uploading.value) return
    error.value = ''
    if (!(await validateSave(status))) return
    const scheduled = form.scheduled_local ? new Date(form.scheduled_local) : null
    saving.value = true
    error.value = ''
    try {
        await saveAnnouncement('articles', {
            ...form,
            id: form.id || undefined,
            row_version: form.id ? form.row_version : undefined,
            category_id: form.category_id || null,
            publish_status: status,
            scheduled_at: status === 'scheduled' ? scheduled!.toISOString() : null
        })
        original = JSON.stringify(form)
        message.success(
            status === 'draft'
                ? '草稿已保存'
                : status === 'scheduled'
                  ? '已安排定时发布'
                  : '公告已发布'
        )
        emit('saved')
    } catch (e) {
        setSaveFailure(e)
    } finally {
        saving.value = false
    }
    if (pendingCount.value) await focusFirstError()
}
function uploadError(reason: unknown) {
    error.value = announcementError(reason)
}
const beforeUnload = (e: BeforeUnloadEvent) => {
    if (dirty()) {
        e.preventDefault()
        e.returnValue = ''
    }
}
onBeforeRouteLeave(
    () =>
        !saving.value &&
        !uploading.value &&
        (!dirty() || window.confirm('公告有未保存的修改，确定离开？'))
)
onMounted(() => {
    void load()
    window.addEventListener('beforeunload', beforeUnload)
})
onBeforeUnmount(() => {
    controller?.abort()
    window.removeEventListener('beforeunload', beforeUnload)
})
</script>
<style scoped>
:global(.announcement-delete-dialog .mm-dialog__header) {
    min-height: 68px;
    padding: 0 16px;
}
:global(.announcement-delete-dialog .mm-dialog__header-actions) {
    order: -1;
}
:global(.announcement-delete-dialog .mm-dialog__title) {
    font-size: 16px;
}
:global(.announcement-delete-dialog .mm-dialog__heading) {
    flex: 1;
    min-width: 0;
}
:global(.announcement-delete-dialog .mm-dialog__subtitle) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
:global(.announcement-delete-dialog .mm-dialog__close) {
    width: 32px;
    height: 32px;
    border: 1px solid var(--mm-color-line-strong);
}
:global(.announcement-delete-dialog .mm-dialog__body) {
    min-height: 84px;
    padding: 16px;
}
:global(.announcement-delete-dialog .mm-dialog__footer) {
    min-height: 54px;
    padding: 10px 16px;
    background: var(--mm-color-soft);
}
:global(.announcement-delete-dialog .mm-dialog__footer .mm-button) {
    min-width: 76px;
}
.announcement-delete-dialog__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 6px;
    color: var(--mm-color-danger);
    background: var(--mm-color-danger-soft);
}
.announcement-delete-dialog__notice {
    border-left-width: 1px;
    border-radius: 6px;
}
.announcement-delete-dialog__notice :deep(.mm-alert__description) {
    margin-top: 0;
    color: var(--mm-color-warning);
    font-size: 11px;
}
.article-editor__pending,
.article-editor__save-error {
    font-size: 12px;
    color: var(--mm-color-danger);
}
.article-editor__pending {
    white-space: nowrap;
}
.article-editor__save-error {
    max-width: 280px;
    overflow-wrap: anywhere;
}
.article-editor :deep(.mm-form-item__error) {
    position: static;
    margin-top: 4px;
    white-space: normal;
    overflow-wrap: anywhere;
}
.article-editor :deep(.mm-form-item.is-error .article-editor__textarea),
.article-editor :deep(.mm-form-item.is-error .mm-rich-text-editor) {
    border-color: var(--mm-color-danger);
}
.article-editor {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--mm-color-line);
    border-radius: 8px;
    background: var(--mm-color-panel);
}
.article-editor__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--mm-color-line);
    flex: none;
}
.article-editor__heading {
    flex: 1;
    min-width: 160px;
}
.article-editor h2 {
    font-size: 15px;
    margin: 0 0 3px;
}
.article-editor__heading span {
    font-size: 11px;
    color: var(--mm-color-text-muted);
}
.article-editor__commands {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}
.article-editor__body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    overflow: auto;
}
.article-editor__settings {
    min-width: 0;
    border-right: 1px solid var(--mm-color-line);
    padding: 18px;
}
.article-editor__settings h3 {
    font-size: 13px;
    border-top: 1px solid var(--mm-color-line);
    margin: 18px 0 14px;
    padding-top: 16px;
}
.article-editor__content {
    min-width: 0;
    padding: 20px 24px;
}
.article-editor__hint {
    font-size: 12px;
    line-height: 1.6;
    color: var(--mm-color-text-muted);
}
.article-editor__content :deep(input[aria-label='公告标题']) {
    font-size: 22px;
    font-weight: 600;
}
.article-editor__textarea {
    display: block;
    width: 100%;
    resize: vertical;
    padding: 10px 12px;
    border: 1px solid var(--mm-color-line-strong);
    border-radius: 4px;
    color: var(--mm-color-text);
    background: var(--mm-color-panel);
    font: inherit;
    outline: none;
}
.article-editor__textarea:focus {
    border-color: var(--mm-color-primary);
}
.article-editor__textarea:disabled {
    background: var(--mm-color-soft);
}
.article-editor__loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}
.article-editor__failure,
.article-editor__error {
    padding: 16px;
}
.article-editor__failure {
    display: grid;
    gap: 16px;
    justify-items: start;
}
.announcement-spin {
    animation: announcement-spin 1s linear infinite;
}
@keyframes announcement-spin {
    to {
        transform: rotate(360deg);
    }
}
@media (max-width: 800px) {
    .article-editor__body {
        grid-template-columns: 1fr;
    }
    .article-editor__settings {
        border-right: 0;
    }
    .article-editor__content {
        padding: 18px;
    }
}
@media (prefers-reduced-motion: reduce) {
    .announcement-spin {
        animation: none;
    }
}
</style>
