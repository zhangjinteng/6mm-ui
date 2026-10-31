<template>
    <section ref="editorRoot" class="course-editor" :aria-busy="loading || saving">
        <header class="course-editor__header">
            <MmButton
                icon-only
                title="返回课程列表"
                aria-label="返回课程列表"
                :disabled="saving || uploading"
                @click="close"
                ><MmIcon name="arrow-left" :size="16"
            /></MmButton>
            <div class="course-editor__heading">
                <h2>{{ courseId ? '编辑课程' : '新增课程' }}</h2>
                <span>{{ metadata?.source_locale || 'zh-CN' }} · {{ editorSourceName }}</span>
            </div>
            <div class="course-editor__commands">
                <MmButton
                    v-if="canDelete"
                    variant="danger"
                    size="sm"
                    :disabled="loading || loadFailed || saving || uploading"
                    @click="openDeleteDialog"
                    >删除课程</MmButton
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
                <span v-if="saveError" class="course-editor__save-error" role="alert">{{
                    saveError
                }}</span>
                <div v-if="!readonly" class="course-editor__publish-actions">
                    <span
                        v-if="pendingCount"
                        class="course-editor__pending"
                        role="status"
                        aria-live="polite"
                        >还有 {{ pendingCount }} 项待完善</span
                    >
                    <MmButton
                        v-if="canPublish"
                        variant="primary"
                        size="sm"
                        :disabled="loading || loadFailed || uploading"
                        :loading="saving"
                        @click="save(form.scheduled_local ? 'scheduled' : 'published')"
                        ><template #icon><MmIcon name="arrow-up-to-line" :size="14" /></template
                        >{{ form.scheduled_local ? '定时发布' : '发布' }}</MmButton
                    >
                </div>
            </div>
        </header>
        <div v-if="loading" class="course-editor__loading" role="status">
            <MmIcon name="loader-circle" class="academy-spin" :size="28" /><span
                >正在读取课程资料...</span
            >
        </div>
        <div v-else-if="loadFailed" class="course-editor__failure">
            <MmAlert type="error" :description="error" :closable="false" /><MmButton @click="load"
                >重新加载</MmButton
            >
        </div>
        <template v-else>
            <div class="course-editor__body">
                <aside class="course-editor__settings">
                    <MmForm :model="form" :rules="fieldRules" label-position="top" @submit.prevent>
                        <MmFormItem
                            label="课程分类"
                            prop="category_ids"
                            :error="fieldErrors.category_ids"
                            required
                            ><MmSelect
                                v-model="form.category_ids"
                                :options="categoryOptions"
                                multiple
                                filterable
                                clearable
                                :disabled="locked"
                                aria-label="课程分类"
                        /></MmFormItem>
                        <h3>课程设置</h3>
                        <MmFormItem
                            label="课程封面"
                            prop="cover_url"
                            :error="fieldErrors.cover_url"
                        >
                            <ContentCoverUpload
                                v-model="form.cover_url"
                                label="课程封面"
                                :disabled="locked"
                                :upload="uploadAcademyCover"
                                @busy-change="uploading = $event"
                                @start="error = ''"
                                @error="uploadError"
                                @success="clearCoverError"
                            />
                        </MmFormItem>
                        <MmFormItem
                            label="课程难度"
                            prop="difficulty_level"
                            :error="fieldErrors.difficulty_level"
                            ><MmSelect
                                v-model="form.difficulty_level"
                                :options="difficultyOptions"
                                :disabled="locked"
                                aria-label="课程难度"
                        /></MmFormItem>
                        <MmFormItem
                            label="预计课时(分钟)"
                            prop="estimated_minutes"
                            :error="fieldErrors.estimated_minutes"
                            ><MmInputNumber
                                v-model="form.estimated_minutes"
                                :min="1"
                                :max="100000"
                                :precision="0"
                                :disabled="locked"
                                aria-label="预计课时"
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
                            label="启用状态"
                            prop="is_enabled"
                            :error="fieldErrors.is_enabled"
                            ><MmCheckbox
                                v-model="form.is_enabled"
                                :disabled="locked"
                                label="已启用"
                                aria-label="启用状态"
                        /></MmFormItem>
                        <MmFormItem
                            label="计划发布时间"
                            prop="scheduled_local"
                            :error="fieldErrors.scheduled_local"
                            ><MmInput
                                v-model="form.scheduled_local"
                                type="datetime-local"
                                :disabled="locked || !canPublish"
                                aria-label="计划发布时间"
                        /></MmFormItem>
                    </MmForm>
                </aside>
                <main class="course-editor__content">
                    <MmForm :model="form" :rules="fieldRules" label-position="top" @submit.prevent>
                        <MmFormItem label="标题" prop="title" :error="fieldErrors.title" required
                            ><MmInput
                                v-model="form.title"
                                :maxlength="255"
                                :disabled="locked"
                                placeholder="输入课程标题"
                                aria-label="课程标题"
                        /></MmFormItem>
                        <MmFormItem label="摘要" prop="summary" :error="fieldErrors.summary">
                            <textarea
                                v-model="form.summary"
                                class="course-editor__textarea"
                                :rows="3"
                                :maxlength="10000"
                                :disabled="locked"
                                :aria-invalid="!!fieldErrors.summary"
                                aria-label="课程摘要"
                            />
                        </MmFormItem>
                        <MmFormItem label="正文" prop="body_html" :error="fieldErrors.body_html"
                            ><MmRichTextEditor
                                v-model="form.body_html"
                                :readonly="readonly"
                                :disabled="saving"
                                :min-height="420"
                                :max-height="760"
                                aria-label="课程正文"
                        /></MmFormItem>
                    </MmForm>
                </main>
            </div>
        </template>
        <MmDialog
            v-model="seoOpen"
            title="SEO 设置"
            width="540px"
            :close-on-click-modal="false"
            @opened="focusSeoError"
            ><MmForm :model="form" :rules="fieldRules" label-position="top" @submit.prevent
                ><MmFormItem
                    label="SEO 描述"
                    prop="seo_description"
                    :error="fieldErrors.seo_description"
                >
                    <textarea
                        ref="seoInput"
                        v-model="form.seo_description"
                        class="course-editor__textarea"
                        :rows="5"
                        :maxlength="2000"
                        :disabled="locked"
                        :aria-invalid="!!fieldErrors.seo_description"
                        aria-label="SEO 描述"
                    /></MmFormItem></MmForm
            ><template #footer
                ><MmButton variant="primary" @click="seoOpen = false">确定</MmButton></template
            ></MmDialog
        >
        <MmDialog
            v-model="deleteOpen"
            title="确认删除"
            :subtitle="`操作对象：${form.title || '未命名课程'}`"
            width="460px"
            panel-class="course-delete-dialog"
            :close-on-click-modal="false"
            :before-close="() => !saving"
        >
            <template #header-actions>
                <span class="course-delete-dialog__icon" aria-hidden="true">
                    <MmIcon name="shield-alert" :size="18" color="var(--mm-color-danger)" />
                </span>
            </template>
            <MmAlert
                class="course-delete-dialog__notice"
                type="warning"
                :closable="false"
                :show-icon="false"
                description="确定删除这门课程吗？删除后将不再展示，请谨慎操作。"
            />
            <MmAlert v-if="deleteError" type="error" :closable="false" :description="deleteError" />
            <template #footer>
                <MmButton :disabled="saving" @click="deleteOpen = false">取消</MmButton>
                <MmButton variant="warning" :loading="saving" @click="removeCourse"
                    >确认删除</MmButton
                >
            </template>
        </MmDialog>
        <MmDialog v-model="discardOpen" title="放弃未保存的修改？" width="360px"
            ><template #footer
                ><MmButton @click="discardOpen = false">继续编辑</MmButton
                ><MmButton variant="primary" @click="emit('close')">放弃修改</MmButton></template
            ></MmDialog
        >
        <MmDialog
            v-model="unpublishOpen"
            title="将课程转为草稿？"
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

import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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
    MmCheckbox,
    MmDialog,
    MmRichTextEditor,
    message
} from "../../../../../index"
import { useAcademyApi, type AcademyMetadata, type AcademyCourse } from "../../../../api/content/academy"
const { academyDifficulties, academyError, deleteAcademyCourse, getAcademyDetail, getAcademyMetadata, saveAcademy, uploadAcademyCover } = useAcademyApi()
import ContentCoverUpload from '../../components/ContentCoverUpload.vue'

import { courseFields, courseFieldErrors, validateCourse, type CourseErrors } from './validation'
const props = defineProps<{ courseId?: string }>()
const emit = defineEmits<{ close: []; saved: [] }>()
const loading = ref(true),
    saving = ref(false),
    loadFailed = ref(false),
    error = ref(''),
    seoOpen = ref(false),
    discardOpen = ref(false),
    unpublishOpen = ref(false)
const editorSourceName = ref(useCmsRuntime().mode === 'white_label' ? '当前站点内容' : '平台默认内容模板')
const metadata = ref<AcademyMetadata>(),
    currentStatus = ref('draft')
const uploading = ref(false)
const deleteOpen = ref(false),
    deleteError = ref('')
const canPublish = computed(() => hasPermission(['cms_academy:publish']))
const canDelete = computed(
    () =>
        !!props.courseId &&
        hasPermission(['cms_academy:delete']) &&
        (canPublish.value || currentStatus.value === 'draft')
)
const readonly = computed(
    () =>
        !hasPermission([`cms_academy:${props.courseId ? 'edit' : 'add'}`]) ||
        (!canPublish.value && currentStatus.value !== 'draft')
)
const locked = computed(() => readonly.value || saving.value)
const form = reactive({
    id: '',
    row_version: '',
    title: '',
    category_ids: [] as string[],
    summary: '',
    body_html: '',
    seo_description: '',
    cover_url: '',
    difficulty_level: 1 as number | '',
    estimated_minutes: 6 as number | null,
    sort_order: 10 as number | null,
    is_enabled: true,
    scheduled_local: ''
})
const editorRoot = ref<HTMLElement>()
const seoInput = ref<HTMLTextAreaElement>()
const attempted = ref<'draft' | 'publish' | null>(null)
const validationNow = ref(Date.now())
const serverErrors = reactive<CourseErrors>({})
const saveError = ref('')
// Validation is controlled by the submit attempt, not by the UI library's blur/change rules.
const fieldRules = Object.fromEntries(
    courseFields.map((field) => [
        field,
        {
            required: field === 'title' || field === 'category_ids',
            trigger: 'submit' as const
        }
    ])
)
const localErrors = computed(() =>
    attempted.value
        ? validateCourse(
              form,
              metadata.value?.categories || [],
              attempted.value === 'draft'
                  ? 'draft'
                  : form.scheduled_local
                    ? 'scheduled'
                    : 'published',
              validationNow.value
          )
        : {}
)
const fieldErrors = computed<CourseErrors>(() => ({ ...serverErrors, ...localErrors.value }))
const pendingCount = computed(() => Object.keys(fieldErrors.value).length)
for (const field of courseFields) {
    watch(
        () => form[field],
        () => {
            delete serverErrors[field]
            if (field === 'category_ids') delete serverErrors.difficulty_level
            saveError.value = ''
            validationNow.value = Date.now()
        },
        { deep: true }
    )
}
function focusSeoError() {
    if (fieldErrors.value.seo_description) seoInput.value?.focus()
}
async function focusFirstError() {
    await nextTick()
    const field = [...(editorRoot.value?.querySelectorAll<HTMLElement>('[data-prop]') || [])].find(
        (el) => fieldErrors.value[el.dataset.prop as keyof CourseErrors]
    )
    if (!field && fieldErrors.value.seo_description) {
        if (seoOpen.value) focusSeoError()
        else seoOpen.value = true
        return
    }
    if (!field) return
    field.scrollIntoView({ block: 'center', behavior: 'auto' })
    // Prefer the rich-text document or combobox over toolbar/clear buttons.
    const control =
        field.querySelector<HTMLElement>(
            '[contenteditable="true"], [role="combobox"]:not([aria-disabled="true"])'
        ) ||
        field.querySelector<HTMLElement>(
            'input:not(:disabled), textarea:not(:disabled), button:not(:disabled)'
        )
    control?.focus({ preventScroll: true })
}
const categoryOptions = computed(() =>
    (metadata.value?.categories || []).map((c) => ({
        label: c.name + (c.is_enabled ? '' : ' (已停用)'),
        value: c.id,
        disabled: !c.is_enabled
    }))
)
const difficultyOptions = computed(() => {
    const selected = (metadata.value?.categories || []).filter((c) =>
        form.category_ids.includes(c.id)
    )
    return academyDifficulties.map((d) => ({
        ...d,
        disabled: selected.some((c) => !c.difficulty_levels.includes(d.value))
    }))
})
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
        metadata.value = await getAcademyMetadata(current.signal, { cms_source_type: 'platform' })
        if (props.courseId) {
            const data = await getAcademyDetail<AcademyCourse>(
                'courses',
                props.courseId,
                current.signal
            )
            metadata.value = await getAcademyMetadata(current.signal, { space_id: String(data.space_id) })
            editorSourceName.value = String(data.cms_source_name || '—')
            if (current.signal.aborted) return
            for (const key of [
                'id',
                'row_version',
                'title',
                'category_ids',
                'estimated_minutes',
                'sort_order',
                'is_enabled'
            ] as const)
                Object.assign(form, { [key]: data[key] })
            form.difficulty_level = data.difficulty_level || ''
            for (const key of ['summary', 'body_html', 'seo_description', 'cover_url'] as const)
                form[key] = data[key] || ''
            form.scheduled_local =
                data.publish_status === 'scheduled' ? localDate(data.scheduled_at) : ''
            currentStatus.value = data.publish_status
        }
        original = JSON.stringify(form)
    } catch (e) {
        if (!current.signal.aborted) {
            error.value = academyError(e)
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
async function save(status: AcademyCourse['publish_status']) {
    if (locked.value || loading.value || loadFailed.value || uploading.value) return
    attempted.value = status === 'draft' ? 'draft' : 'publish'
    validationNow.value = Date.now()
    saveError.value = ''
    // A new submit retries server validation; local issues still block the request.
    for (const field of courseFields) delete serverErrors[field]
    if (pendingCount.value) {
        await focusFirstError()
        return
    }
    const scheduled = form.scheduled_local ? new Date(form.scheduled_local) : null
    saving.value = true
    error.value = ''
    try {
        await saveAcademy('courses', {
            ...form,
            id: form.id || undefined,
            row_version: form.id ? form.row_version : undefined,
            difficulty_level: form.difficulty_level || null,
            publish_status: status,
            scheduled_at: status === 'scheduled' ? scheduled!.toISOString() : null
        })
        original = JSON.stringify(form)
        message.success(
            status === 'draft'
                ? '草稿已保存'
                : status === 'scheduled'
                  ? '已安排定时发布'
                  : '课程已发布'
        )
        emit('saved')
    } catch (e) {
        const failure = courseFieldErrors(e)
        Object.assign(serverErrors, failure.fields)
        saveError.value = failure.general
    } finally {
        saving.value = false
    }
    if (pendingCount.value) await focusFirstError()
}
function openDeleteDialog() {
    deleteError.value = ''
    deleteOpen.value = true
}

async function removeCourse() {
    if (!canDelete.value || loading.value || loadFailed.value || saving.value || uploading.value)
        return
    saving.value = true
    deleteError.value = ''
    try {
        await deleteAcademyCourse({ id: form.id, row_version: form.row_version })
        original = JSON.stringify(form)
        deleteOpen.value = false
        message.success('课程已删除')
        emit('saved')
    } catch (e) {
        deleteError.value = academyError(e)
    } finally {
        saving.value = false
    }
}
function uploadError(error: unknown) {
    serverErrors.cover_url = academyError(error)
}
function clearCoverError() {
    delete serverErrors.cover_url
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
        (!dirty() || window.confirm('课程有未保存的修改，确定离开？'))
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
:global(.course-delete-dialog .mm-dialog__header) {
    min-height: 68px;
    padding: 0 16px;
}
:global(.course-delete-dialog .mm-dialog__header-actions) {
    order: -1;
}
:global(.course-delete-dialog .mm-dialog__title) {
    font-size: 16px;
}
:global(.course-delete-dialog .mm-dialog__heading) {
    flex: 1;
    min-width: 0;
}
:global(.course-delete-dialog .mm-dialog__subtitle) {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
:global(.course-delete-dialog .mm-dialog__close) {
    width: 32px;
    height: 32px;
    border: 1px solid var(--mm-color-line-strong);
}
:global(.course-delete-dialog .mm-dialog__body) {
    min-height: 84px;
    padding: 16px;
}
:global(.course-delete-dialog .mm-dialog__footer) {
    min-height: 54px;
    padding: 10px 16px;
    background: var(--mm-color-soft);
}
:global(.course-delete-dialog .mm-dialog__footer .mm-button) {
    min-width: 76px;
}
.course-delete-dialog__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 6px;
    color: var(--mm-color-danger);
    background: var(--mm-color-danger-soft);
}
.course-delete-dialog__notice {
    border-left-width: 1px;
    border-radius: 6px;
}
.course-delete-dialog__notice :deep(.mm-alert__description) {
    margin-top: 0;
    color: var(--mm-color-warning);
    font-size: 11px;
}
.course-editor {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--mm-color-line);
    border-radius: 8px;
    background: var(--mm-color-panel);
}
.course-editor__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--mm-color-line);
    flex: none;
}
.course-editor__heading {
    flex: 1;
    min-width: 160px;
}
.course-editor h2 {
    font-size: 15px;
    margin: 0 0 3px;
}
.course-editor__heading span {
    font-size: 11px;
    color: var(--mm-color-text-muted);
}
.course-editor__commands {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}
.course-editor__pending,
.course-editor__save-error {
    font-size: 12px;
    color: var(--mm-color-danger);
}
.course-editor__publish-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}
.course-editor__save-error {
    max-width: 280px;
    overflow-wrap: anywhere;
}
.course-editor :deep(.mm-form-item__error) {
    position: static;
    margin-top: 4px;
    white-space: normal;
    overflow-wrap: anywhere;
}
.course-editor :deep(.mm-form-item.is-error .course-editor__textarea),
.course-editor :deep(.mm-form-item.is-error .mm-rich-text-editor) {
    border-color: var(--mm-color-danger);
}
.course-editor__body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    overflow: auto;
}
.course-editor__settings {
    min-width: 0;
    border-right: 1px solid var(--mm-color-line);
    padding: 18px;
}
.course-editor__settings h3 {
    font-size: 13px;
    border-top: 1px solid var(--mm-color-line);
    margin: 18px 0 14px;
    padding-top: 16px;
}
.course-editor__content {
    min-width: 0;
    padding: 20px 24px;
}
.course-editor__textarea {
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
.course-editor__textarea:focus {
    border-color: var(--mm-color-primary);
}
.course-editor__textarea:disabled {
    background: var(--mm-color-soft);
}
.course-editor__loading {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}
.course-editor__failure {
    padding: 16px;
}
.course-editor__failure {
    display: grid;
    gap: 16px;
    justify-items: start;
}
.academy-spin {
    animation: academy-spin 1s linear infinite;
}
@keyframes academy-spin {
    to {
        transform: rotate(360deg);
    }
}
@media (max-width: 800px) {
    .course-editor__body {
        grid-template-columns: 1fr;
    }
    .course-editor__settings {
        border-right: 0;
    }
    .course-editor__content {
        padding: 18px;
    }
}
@media (prefers-reduced-motion: reduce) {
    .academy-spin {
        animation: none;
    }
}
</style>
