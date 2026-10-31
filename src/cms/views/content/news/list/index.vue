<template>
    <div class="news-articles">
        <ArticleEditor
            v-if="editing"
            :article-id="selectedId"
            @close="editing = false"
            @saved="saved"
        />
        <MmProTable
            v-show="!editing"
            v-bind="proTableBindings"
            :auto-refreshable="false"
            :columns="columns"
            row-key="id"
            fill-height
            columns-configurable
            show-cell-title
            aria-label="新闻列表"
            :page-sizes="[20, 50, 100]"
        >
            <template #cell-cms_source_type="{ row }"><SourceTypeTag :source-type="row.cms_source_type ?? null" /></template>
            <template #toolbar-actions
                ><MmButton v-if="can('add')" variant="primary" size="sm" @click="open()"
                    ><template #icon><MmIcon name="plus" :size="14" /></template>新增新闻</MmButton
                ></template
            >
            <template #cell-publish_status="{ row }"
                ><MmTag
                    size="sm"
                    effect="soft"
                    :type="row.publish_status === 'published' ? 'success' : 'warning'"
                    >{{
                        newsPublishStates.find((s) => s.value === row.publish_status)?.label
                    }}</MmTag
                ></template
            >
            <template #cell-is_enabled="{ row }"
                ><MmTag size="sm" effect="soft" :type="row.is_enabled ? 'success' : 'danger'">{{
                    row.is_enabled ? '已启用' : '已停用'
                }}</MmTag></template
            >
            <template #cell-publish_time="{ row }">{{
                formatDateTimeInClientTimezone(row.published_at || row.scheduled_at)
            }}</template>
            <template #cell-actions="{ row }"
                ><MmButton
                    size="sm"
                    icon-only
                    :title="can('edit') ? '编辑新闻' : '新闻详情'"
                    :aria-label="can('edit') ? '编辑新闻' : '新闻详情'"
                    @click="open(row.id)"
                    ><MmIcon
                        :name="can('edit') ? 'square-pen' : 'panel-right-open'"
                        :size="15" /></MmButton
            ></template>
        </MmProTable>
    </div>
</template>
<script setup lang="ts">
import { useCmsRuntime } from "../../../../runtime"
const { newsPublishStates, newsCategoryLabel, getNewsList, getNewsMetadata } = useNewsApi()
const { hasPermission } = useCmsRuntime()
const { formatDateTime: formatDateTimeInClientTimezone } = useCmsRuntime()

import { createCmsSourceColumns, useCmsSourceFields } from "../../cmsSources"
import SourceTypeTag from "../../../../components/source-type-tag/index.vue"
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
    MmProTable,
    MmButton,
    MmIcon,
    MmTag,
    useMmProTable,
    type ProTableColumn,
    type QueryBarField
} from "../../../../../index"
import { useNewsApi, type NewsArticle, type NewsMetadata } from "../../../../api/content/news"


import ArticleEditor from './ArticleEditor.vue'
const editing = ref(false),
    selectedId = ref<string>()
const can = (action: string) => hasPermission([`cms_news:${action}`])
const metadata = ref<NewsMetadata>()
const cmsSources = useCmsSourceFields(getNewsMetadata, value => { metadata.value = value })
const columns: ProTableColumn<NewsArticle>[] = [
    ...createCmsSourceColumns(),
    { key: 'code', dataIndex: 'code', title: '新闻ID', width: 220 },
    { key: 'title', dataIndex: 'title', title: '新闻标题', width: 240, hideable: false },
    {
        key: 'category_id',
        dataIndex: 'category_id',
        title: '新闻分类',
        width: 220,
        formatter: (v) => newsCategoryLabel(metadata.value, v)
    },
    { key: 'sort_order', dataIndex: 'sort_order', title: '排序', width: 70 },
    { key: 'publish_status', title: '发布状态', width: 100 },
    { key: 'is_enabled', title: '状态', width: 85 },
    { key: 'publish_time', title: '发布时间', width: 180 },
    { key: 'updated_by_name', dataIndex: 'updated_by_name', title: '最后编辑人', width: 130 },
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
        label: '新闻ID',
        type: 'keyword',
        width: 170,
        placeholder: '新闻ID',
        defaultValue: ''
    },
    {
        key: 'keyword',
        label: '新闻标题',
        type: 'keyword',
        width: 200,
        placeholder: '新闻标题',
        defaultValue: ''
    },
    {
        key: 'category_id',
        label: '新闻分类',
        type: 'select',
        width: 160,
        defaultValue: '',
        options: [
            { label: '全部', value: '' },
            ...(metadata.value?.categories || []).map((c) => ({
                label: newsCategoryLabel(metadata.value, c.id),
                value: c.id
            }))
        ]
    },
    {
        key: 'publish_status',
        label: '发布状态',
        type: 'select',
        width: 150,
        defaultValue: '',
        options: [{ label: '全部', value: '' }, ...newsPublishStates]
    },
    {
        key: 'is_enabled',
        label: '状态',
        type: 'select',
        width: 130,
        defaultValue: '',
        options: [
            { label: '全部', value: '' },
            { label: '已启用', value: '1' },
            { label: '已停用', value: '0' }
        ]
    },
    { key: 'publish_range', label: '发布时间', type: 'date-range', width: 240, defaultValue: null }
])
const { proTableBindings, reload, filters: cmsSourceFilters } = useMmProTable<NewsArticle>({
    initialAutoRefreshSeconds: 0,
    initialPageSize: 20,
    queryFields,
    request: async ({ filters, page, pageSize, signal }) => {
        const params: Record<string, unknown> = Object.fromEntries(
            Object.entries(filters).filter(
                ([k, v]) => k !== 'publish_range' && v !== '' && v != null
            )
        )
        const range = filters.publish_range
        if (Array.isArray(range) && range.length === 2) {
            params.published_from = new Date(`${range[0]}T00:00:00`).toISOString()
            params.published_to = new Date(`${range[1]}T23:59:59.999`).toISOString()
        }
        const result = await getNewsList<NewsArticle>(
            'articles',
            { ...params, page_no: page, page_size: pageSize },
            signal
        )
        return { rows: result.lists, total: result.count }
    }
})
cmsSources.bindFilters(cmsSourceFilters)

const controller = new AbortController()
async function loadMetadata() {
    try {
        metadata.value = await getNewsMetadata(controller.signal)
    } catch {
        /* Request layer reports the error. */
    }
}
function open(id?: string) {
    selectedId.value = id
    editing.value = true
}
function saved() {
    editing.value = false
    void reload()
    void loadMetadata()
}
onMounted(loadMetadata)
onBeforeUnmount(() => controller.abort())
</script>
<style scoped>
.news-articles {
    height: calc(100vh - var(--navbar-height) - 24px);
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
</style>
