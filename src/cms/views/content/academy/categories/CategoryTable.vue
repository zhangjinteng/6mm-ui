<template>
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
        :title="`${form.id ? '编辑' : '新增'}课程${noun}`"
        width="620px"
        :close-on-click-modal="false"
        :before-close="beforeClose"
    >
        <div class="taxonomy-editor" :aria-busy="loading">
            <div v-if="loading" class="taxonomy-editor__loading" role="status">
                <MmIcon name="loader-circle" class="academy-spin" :size="24" /><span
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
                <MmFormItem :label="`${noun}名称`" required
                    ><MmInput
                        v-model="form.name"
                        :maxlength="120"
                        :disabled="readonly || busy"
                        :aria-label="`${noun}名称`"
                /></MmFormItem>
                <MmFormItem label="适用难度" required
                    ><MmSelect
                        v-model="form.difficulty_levels"
                        multiple
                        :options="academyDifficulties"
                        :disabled="readonly || busy"
                        aria-label="适用难度"
                /></MmFormItem>
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
                        ><MmCheckbox
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
                ><template #icon><MmIcon name="trash-2" :size="14" /></template>删除分类</MmButton
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
        title="删除课程分类"
        width="420px"
        :close-on-click-modal="false"
        :before-close="() => !deleting"
    >
        <p>确认删除分类“{{ form.name }}”？有关联课程的分类无法删除。</p>
        <MmAlert v-if="deleteError" type="error" :closable="false" :description="deleteError" />
        <template #footer>
            <MmButton :disabled="deleting" @click="deleteVisible = false">取消</MmButton>
            <MmButton variant="danger" :loading="deleting" @click="removeCategory"
                >确认删除</MmButton
            >
        </template>
    </MmDialog>
    <MmDialog v-model="discard" title="放弃未保存的修改？" width="360px"
        ><template #footer
            ><MmButton @click="discard = false">继续编辑</MmButton
            ><MmButton variant="primary" @click="discardChanges">放弃修改</MmButton></template
        ></MmDialog
    >
</template>
<script setup lang="ts">
import { useCmsRuntime } from "../../../../runtime"
const { hasPermission } = useCmsRuntime()
const { formatDateTime: formatDateTimeInClientTimezone } = useCmsRuntime()

import { createCmsSourceColumns, useCmsSourceFields } from "../../cmsSources"
import SourceTypeTag from "../../../../components/source-type-tag/index.vue"
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import {
    MmProTable,
    MmButton,
    MmIcon,
    MmDialog,
    MmForm,
    MmFormItem,
    MmInput,
    MmSelect,
    MmInputNumber,
    MmCheckbox,
    MmAlert,
    MmTag,
    message,
    useMmProTable,
    type ProTableColumn,
    type QueryBarField
} from "../../../../../index"
import { useAcademyApi, type AcademyRow } from "../../../../api/content/academy"
const { academyDifficulties, academyError, getAcademyList, getAcademyMetadata, getAcademyDetail, saveAcademy, deleteAcademyCategory } = useAcademyApi()


const noun = '分类'
const can = (action: string) => hasPermission([`cms_academy_category:${action}`])
const cmsSources = useCmsSourceFields(getAcademyMetadata)
const columns: ProTableColumn<AcademyRow>[] = [
    ...createCmsSourceColumns(),
    { key: 'code', dataIndex: 'code', title: '分类ID', width: 220 },
    { key: 'name', dataIndex: 'name', title: '分类名称', width: 210 },
    {
        key: 'difficulty_levels',
        dataIndex: 'difficulty_levels',
        title: '难度范围',
        width: 170,
        formatter: (v: unknown) =>
            ((v as number[]) || [])
                .map((n) => academyDifficulties.find((d) => d.value === n)?.label)
                .join(' / ')
    },
    { key: 'course_count', dataIndex: 'course_count', title: '课程数量', width: 100 },
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
const queryFields: QueryBarField[] = [
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
        key: 'difficulty_level',
        label: '难度范围',
        type: 'select' as const,
        width: 160,
        defaultValue: '',
        options: [{ label: '全部', value: '' }, ...academyDifficulties]
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
]
const { proTableBindings, reload, currentPage, pageSize, total, filters: cmsSourceFilters } = useMmProTable<AcademyRow>({
    initialAutoRefreshSeconds: 0,
    initialPageSize: 20,
    queryFields,
    request: async ({ filters, page, pageSize, signal }) => {
        const params = Object.fromEntries(
            Object.entries(filters).filter(([, v]) => v !== '' && v != null)
        )
        const result = await getAcademyList(
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
    difficulty_levels: [1, 2, 3],
    sort_order: 10 as number | null,
    is_enabled: true
})
const form = reactive(initial())
const visible = ref(false),
    loading = ref(false),
    saving = ref(false),
    deleting = ref(false),
    deleteVisible = ref(false),
    deleteError = ref(''),
    loadFailed = ref(false),
    error = ref(''),
    discard = ref(false)
const readonly = computed(() => !can(form.id ? 'edit' : 'add'))
const busy = computed(() => saving.value || deleting.value)
let original = '',
    controller: AbortController | undefined
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
    loading.value = !!id
    original = JSON.stringify(form)
    if (!id) return
    try {
        const data = await getAcademyDetail('categories', id, current.signal)
        if (current.signal.aborted) return
        Object.assign(form, {
            id: data.id,
            row_version: data.row_version,
            name: data.name,
            difficulty_levels: data.difficulty_levels || [1, 2, 3],
            sort_order: data.sort_order,
            is_enabled: data.is_enabled
        })
        original = JSON.stringify(form)
    } catch (e) {
        if (!current.signal.aborted) {
            loadFailed.value = true
            error.value = academyError(e)
        }
    } finally {
        if (!current.signal.aborted) loading.value = false
    }
}
function beforeClose() {
    if (busy.value) return false
    if (!loading.value && !loadFailed.value && JSON.stringify(form) !== original) {
        discard.value = true
        return false
    }
    controller?.abort()
    return true
}
function close() {
    if (busy.value) return
    controller?.abort()
    visible.value = false
}
function discardChanges() {
    discard.value = false
    visible.value = false
}
async function save() {
    if (readonly.value || busy.value || loading.value || loadFailed.value) return
    if (!form.name.trim() || form.sort_order === null || !form.difficulty_levels.length) {
        error.value = '请填写名称、排序和适用难度'
        return
    }
    saving.value = true
    error.value = ''
    try {
        await saveAcademy('categories', {
            ...form,
            id: form.id || undefined,
            row_version: form.id ? form.row_version : undefined
        })
        visible.value = false
        message.success('保存成功')
        await reload()
    } catch (e) {
        error.value = academyError(e)
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
        await deleteAcademyCategory({ id: form.id, row_version: form.row_version })
        deleteVisible.value = false
        visible.value = false
        message.success('分类已删除')
        await reload()
        currentPage.value = Math.min(
            currentPage.value,
            Math.max(1, Math.ceil(total.value / pageSize.value))
        )
    } catch (e) {
        deleteError.value = academyError(e)
    } finally {
        deleting.value = false
    }
}
onBeforeUnmount(() => controller?.abort())
</script>
<style scoped>
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
.taxonomy-editor__loading {
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--mm-color-text-muted);
}
.academy-spin {
    animation: academy-spin 1s linear infinite;
}
@keyframes academy-spin {
    to {
        transform: rotate(360deg);
    }
}
@media (prefers-reduced-motion: reduce) {
    .academy-spin {
        animation: none;
    }
}
</style>
