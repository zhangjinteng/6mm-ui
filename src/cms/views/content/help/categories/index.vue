<template>
    <div class="help-categories">
        <MmProTable
            v-bind="proTableBindings"
            :auto-refreshable="false"
            :columns="columns"
            row-key="id"
            fill-height
            columns-configurable
            show-cell-title
            :aria-label="`${noun}管理`"
            :page-sizes="[20, 50, 100]"
        >
            <template #cell-cms_source_type="{ row }"><SourceTypeTag :source-type="row.cms_source_type ?? null" /></template>
            <template #toolbar-actions>
                <MmButton v-if="can('add')" variant="primary" size="sm" @click="open()"
                    ><template #icon><MmIcon name="plus" :size="14" /></template>新增{{
                        noun
                    }}</MmButton
                >
            </template>
            <template #cell-is_enabled="{ row }"
                ><MmTag size="sm" effect="soft" :type="row.is_enabled ? 'success' : 'danger'">{{
                    row.is_enabled ? '已启用' : '已停用'
                }}</MmTag></template
            >
            <template #cell-actions="{ row }"
                ><MmButton
                    size="sm"
                    icon-only
                    :title="can('edit') ? `编辑${noun}` : `${noun}详情`"
                    :aria-label="`编辑${noun}`"
                    @click="open(row.id)"
                    ><MmIcon
                        :name="can('edit') ? 'square-pen' : 'panel-right-open'"
                        :size="15" /></MmButton
            ></template>
        </MmProTable>
        <MmDialog
            v-model="visible"
            :title="`${form.id ? '编辑' : '新增'}帮助${noun}`"
            width="680px"
            subtitle="帮助分类用于前端导航与内容归档，最多支持两级"
            :close-on-click-modal="false"
            :before-close="beforeClose"
        >
            <div class="taxonomy-editor" :aria-busy="loading">
                <div v-if="loading" class="taxonomy-editor__loading" role="status">
                    <MmIcon name="loader-circle" class="help-spin" :size="24" /><span
                        >正在读取{{ noun }}...</span
                    >
                </div>
                <MmAlert v-if="error" type="error" :closable="false" :description="error" />
                <MmForm
                    v-if="!loading && !loadFailed"
                    :model="form"
                    label-position="top"
                    @submit.prevent="save"
                >
                    <MmFormItem v-if="form.id" label="分类ID"
                        ><MmInput :model-value="form.code" disabled
                    /></MmFormItem>
                    <MmFormItem :label="`${noun}名称`" required
                        ><MmInput
                            v-model="form.name"
                            :maxlength="120"
                            :disabled="readonly || busy"
                            :aria-label="`${noun}名称`"
                    /></MmFormItem>
                    <MmFormItem label="父分类">
                        <div class="taxonomy-editor__field">
                            <MmSelect
                                v-model="form.parent_id"
                                :options="parentOptions"
                                :disabled="readonly || busy"
                                aria-label="父分类"
                            />
                            <p class="help-hint">
                                选择“无”创建一级分类；一级分类数量包含其子分类文章。
                            </p>
                        </div>
                    </MmFormItem>
                    <MmFormItem label="图标标识">
                        <div class="taxonomy-editor__field">
                            <div class="taxonomy-editor__icon-control">
                                <MmAutocomplete
                                    v-model="form.icon_key"
                                    :suggestions="availableIcons"
                                    :min-length="0"
                                    :disabled="readonly || busy"
                                    clearable
                                    placeholder="输入或下拉选择 6mm 图标，例如 circle-help"
                                >
                                    <template #option="{ option }">
                                        <span
                                            class="taxonomy-editor__icon-option"
                                            :title="String(option)"
                                        >
                                            <MmIcon :name="String(option) as IconName" :size="18" />
                                            <span>{{ option }}</span>
                                        </span>
                                    </template>
                                </MmAutocomplete>
                                <span
                                    class="taxonomy-editor__icon-preview"
                                    role="img"
                                    :aria-label="
                                        selectedIcon ? `图标预览：${selectedIcon}` : '暂无图标预览'
                                    "
                                >
                                    <MmIcon v-if="selectedIcon" :name="selectedIcon" :size="20" />
                                    <span v-else>—</span>
                                </span>
                            </div>
                            <p class="help-hint">
                                支持直接输入名称或从下拉列表选择；不填写 SVG 或 HTML。
                            </p>
                            <p v-if="form.icon_key && !selectedIcon" class="help-hint">
                                当前名称不在已安装的 6mm 图标库中，暂无法预览。
                            </p>
                        </div>
                    </MmFormItem>
                    <div class="taxonomy-editor__row">
                        <MmFormItem label="前端排序" required
                            ><MmInputNumber
                                v-model="form.sort_order"
                                :min="0"
                                :max="2147483647"
                                :precision="0"
                                :disabled="readonly || busy"
                                aria-label="前端排序"
                        /></MmFormItem>
                        <MmFormItem label="启用状态"
                            ><EnabledToggle
                                v-model="form.is_enabled"
                                :disabled="readonly || busy"
                                label="已启用"
                                aria-label="启用状态"
                        /></MmFormItem>
                    </div>
                </MmForm>
            </div>
            <template #footer
                ><MmButton
                    v-if="form.id && can('delete')"
                    variant="danger"
                    :disabled="loading || loadFailed || busy"
                    @click="confirmDelete"
                    ><template #icon><MmIcon name="trash-2" :size="14" /></template
                    >删除分类</MmButton
                ><MmButton :disabled="busy" @click="close">取消</MmButton
                ><MmButton
                    v-if="!readonly"
                    variant="primary"
                    :loading="saving"
                    :disabled="loading || loadFailed || deleting"
                    @click="save"
                    >保存{{ noun }}</MmButton
                ></template
            >
        </MmDialog>
        <MmDialog
            v-model="deleteVisible"
            title="删除帮助分类"
            width="420px"
            :close-on-click-modal="false"
            :before-close="() => !deleting"
        >
            <p>确认删除分类“{{ form.name }}”？有关联文章或子分类的分类无法删除。</p>
            <MmAlert v-if="deleteError" type="error" :closable="false" :description="deleteError" />
            <template #footer>
                <MmButton :disabled="deleting" @click="deleteVisible = false">取消</MmButton>
                <MmButton variant="danger" :loading="deleting" @click="removeCategory"
                    >确认删除</MmButton
                >
            </template>
        </MmDialog>
    </div>
</template>
<script setup lang="ts">
import { useCmsRuntime } from "../../../../runtime"
const { helpError, deleteHelp, getHelpMetadata, getHelpList, getHelpDetail, saveHelp } = useHelpApi()
const { hasPermission } = useCmsRuntime()
const { formatDateTime: formatDateTimeInClientTimezone } = useCmsRuntime()

import { createCmsSourceColumns, useCmsSourceFields } from "../../cmsSources"
import SourceTypeTag from "../../../../components/source-type-tag/index.vue"
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
    MmProTable,
    MmButton,
    MmIcon,
    MmDialog,
    MmForm,
    MmFormItem,
    MmInput,
    MmAutocomplete,
    iconNames,
    type IconName,
    MmSelect,
    MmInputNumber,
    MmAlert,
    MmTag,
    message,
    useMmProTable,
    type ProTableColumn,
    type QueryBarField
} from "../../../../../index"
import { useHelpApi, type HelpMetadata, type HelpRow } from "../../../../api/content/help"
import EnabledToggle from '../EnabledToggle.vue'


const noun = '分类'
const can = (action: string) => hasPermission([`cms_help_category:${action}`])
const metadata = ref<HelpMetadata>()
const editorMetadata = ref<HelpMetadata>()
const cmsSources = useCmsSourceFields(getHelpMetadata, value => { metadata.value = value })
const columns: ProTableColumn<HelpRow>[] = [
    ...createCmsSourceColumns(),
    { key: 'code', dataIndex: 'code', title: '分类ID', width: 220 },
    { key: 'name', dataIndex: 'name', title: '分类名称', width: 210 },
    {
        key: 'parent_id',
        dataIndex: 'parent_id',
        title: '父分类',
        width: 180,
        formatter: (v) => metadata.value?.categories.find((c) => c.id === v)?.name || '一级分类'
    },
    { key: 'help_count', dataIndex: 'help_count', title: '文章数量', width: 100 },
    { key: 'sort_order', dataIndex: 'sort_order', title: '排序', width: 80 },
    { key: 'is_enabled', title: '状态', width: 100 },
    { key: 'updated_by_name', dataIndex: 'updated_by_name', title: '最后编辑人', width: 150 },
    {
        key: 'updated_at',
        dataIndex: 'updated_at',
        title: '更新时间',
        width: 180,
        formatter: formatDateTimeInClientTimezone
    },
    { key: 'actions', title: '操作', width: 64, align: 'center', fixed: 'right', hideable: false }
]
const queryFields = computed<QueryBarField[]>(() => [
    ...cmsSources.fields,
    {
        key: 'code',
        label: '分类ID',
        type: 'keyword',
        width: 200,
        placeholder: '分类ID',
        defaultValue: ''
    },
    {
        key: 'keyword',
        label: '分类名称',
        type: 'keyword',
        width: 200,
        placeholder: '分类名称',
        defaultValue: ''
    },
    {
        key: 'parent_id',
        label: '父级分类',
        type: 'select',
        width: 180,
        defaultValue: '',
        options: [
            { label: '全部', value: '' },
            ...(metadata.value?.categories || [])
                .filter((c) => !c.parent_id)
                .map((c) => ({ label: c.name, value: c.id }))
        ]
    },
    {
        key: 'is_enabled',
        label: '状态',
        type: 'segmented',
        width: 200,
        defaultValue: '',
        options: [
            { label: '全部', value: '' },
            { label: '已启用', value: '1' },
            { label: '已停用', value: '0' }
        ]
    }
])
const { proTableBindings, reload, filters: cmsSourceFilters } = useMmProTable<HelpRow>({
    initialAutoRefreshSeconds: 0,
    initialPageSize: 20,
    queryFields,
    request: async ({ filters, page, pageSize, signal }) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== '' && v != null)
        )
        const result = await getHelpList(
            'categories',
            { ...params, page_no: page, page_size: pageSize },
            signal
        )
        return { rows: result.lists, total: result.count }
    }
})
cmsSources.bindFilters(cmsSourceFilters)

const initial = () => ({
    id: '',
    row_version: '',
    name: '',
    code: '',
    parent_id: '',
    icon_key: '',
    sort_order: 10 as number | null,
    is_enabled: true
})
const form = reactive(initial())
const availableIcons = [...iconNames]
const availableIconSet = new Set<string>(availableIcons)
const selectedIcon = computed(() =>
    availableIconSet.has(form.icon_key) ? (form.icon_key as IconName) : undefined
)
const visible = ref(false),
    loading = ref(false),
    saving = ref(false),
    deleting = ref(false),
    deleteVisible = ref(false),
    deleteError = ref(''),
    loadFailed = ref(false),
    error = ref('')
const readonly = computed(() => !can(form.id ? 'edit' : 'add'))
const busy = computed(() => saving.value || deleting.value)
let controller: AbortController | undefined
async function open(id?: string) {
    controller?.abort()
    controller = new AbortController()
    const current = controller
    Object.assign(form, initial(), { id: id || '' })
    error.value = ''
    deleteVisible.value = false
    deleteError.value = ''
    loadFailed.value = false
    visible.value = true
    loading.value = true
    try {
        editorMetadata.value = await getHelpMetadata(current.signal, { cms_source_type: 'platform' })
        if (!id || current.signal.aborted) return
        const data = await getHelpDetail('categories', id, current.signal)
        editorMetadata.value = await getHelpMetadata(current.signal, { space_id: String(data.space_id) })
        if (current.signal.aborted) return
        Object.assign(form, {
            id: data.id,
            row_version: data.row_version,
            name: data.name,
            code: data.code,
            parent_id: data.parent_id || '',
            icon_key: data.icon_key || '',
            sort_order: data.sort_order,
            is_enabled: data.is_enabled
        })
    } catch (e) {
        if (!current.signal.aborted) {
            loadFailed.value = true
            error.value = helpError(e)
        }
    } finally {
        if (!current.signal.aborted) loading.value = false
    }
}
function beforeClose() {
    if (busy.value) return false
    controller?.abort()
    return true
}
function close() {
    if (beforeClose()) visible.value = false
}
async function save() {
    if (readonly.value || busy.value || loading.value || loadFailed.value) return
    if (!form.name.trim() || form.sort_order === null) {
        error.value = '请填写分类名称和排序'
        return
    }
    if (form.icon_key.length > 128) {
        error.value = '图标标识最多 128 个字符'
        return
    }
    saving.value = true
    error.value = ''
    try {
        await saveHelp('categories', {
            name: form.name,
            parent_id: form.parent_id || null,
            icon_key: form.icon_key || null,
            sort_order: form.sort_order,
            is_enabled: form.is_enabled,
            id: form.id || undefined,
            row_version: form.id ? form.row_version : undefined
        })
        visible.value = false
        message.success('保存成功')
        await Promise.all([reload(), loadMetadata()])
    } catch (e) {
        error.value = helpError(e)
    } finally {
        saving.value = false
    }
}
function confirmDelete() {
    if (!form.id || !can('delete') || busy.value || loading.value || loadFailed.value) return
    deleteError.value = ''
    deleteVisible.value = true
}
async function removeCategory() {
    if (
        !deleteVisible.value ||
        !form.id ||
        !can('delete') ||
        busy.value ||
        loading.value ||
        loadFailed.value
    )
        return
    deleting.value = true
    deleteError.value = ''
    try {
        await deleteHelp('categories', form.id, form.row_version)
        deleteVisible.value = false
        visible.value = false
        message.success('分类已删除')
        await Promise.all([reload(), loadMetadata()])
    } catch (e) {
        deleteError.value = helpError(e)
    } finally {
        deleting.value = false
    }
}
const parentOptions = computed(() => [
    { label: '无（一级分类）', value: '' },
    ...(editorMetadata.value?.categories || [])
        .filter((c) => !c.parent_id && c.id !== form.id)
        .map((c) => ({
            label: c.name + (c.is_enabled ? '' : '（已停用）'),
            value: c.id
        }))
])
const metadataController = new AbortController()
async function loadMetadata() {
    try {
        metadata.value = await getHelpMetadata(metadataController.signal)
    } catch {
        /* request reports error */
    }
}
onMounted(loadMetadata)
onBeforeUnmount(() => {
    controller?.abort()
    metadataController.abort()
})
</script>
<style scoped>
.help-categories {
    height: calc(100vh - var(--navbar-height, 54px) - 24px);
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}
.help-hint {
    margin: 8px 0 0;
    font-size: 12px;
    color: var(--mm-color-text-muted);
}
.taxonomy-editor {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.taxonomy-editor__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}
.taxonomy-editor__field {
    width: 100%;
    min-width: 0;
}
.taxonomy-editor__icon-control {
    display: flex;
    align-items: center;
    gap: 8px;
}
.taxonomy-editor__icon-control :deep(.mm-autocomplete) {
    flex: 1;
    min-width: 0;
}
.taxonomy-editor__icon-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 0;
    gap: 8px;
}
.taxonomy-editor__icon-option > span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
    font-size: 10px;
}
/* Autocomplete teleports its popup to body; only style this icon picker. */
:global(.mm-popover__floating:has(.taxonomy-editor__icon-option)) {
    width: min(600px, calc(100vw - 32px)) !important;
}
:global(.mm-autocomplete__dropdown:has(.taxonomy-editor__icon-option)) {
    max-height: 300px;
}
:global(.mm-autocomplete__list:has(.taxonomy-editor__icon-option)) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 8px;
}
:global(.mm-autocomplete__option:has(.taxonomy-editor__icon-option)) {
    min-width: 0;
    min-height: 64px;
    padding: 8px 4px;
    border: 1px solid var(--mm-color-line);
    border-radius: 6px;
}
.taxonomy-editor__icon-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 36px;
    height: 36px;
    border: 1px solid var(--mm-color-line);
    border-radius: 6px;
    color: var(--mm-color-text-muted);
}
.taxonomy-editor__loading {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--mm-color-text-muted);
}
.help-spin {
    animation: help-spin 1s linear infinite;
}
@keyframes help-spin {
    to {
        transform: rotate(360deg);
    }
}
@media (prefers-reduced-motion: reduce) {
    .help-spin {
        animation: none;
    }
}
</style>
