<template>
    <div class="feedback-page">
        <MmProTable
            v-bind="proTableBindings"
            :auto-refreshable="false"
            :columns="columns"
            row-key="id"
            fill-height
            columns-configurable
            show-cell-title
            aria-label="意见反馈"
            :page-sizes="[20, 50, 100]"
        >
            <template #cell-cms_source_type="{ row }"><SourceTypeTag :source-type="row.cms_source_type ?? null" /></template>
            <template #cell-source_type="{ row }">
                <MmTag
                    size="sm"
                    effect="soft"
                    :type="
                        row.source_type === 'merchant'
                            ? 'warning'
                            : row.source_type === 'platform'
                              ? 'success'
                              : 'primary'
                    "
                    >{{ feedbackSourceLabel(row.source_type) }}</MmTag
                >
            </template>
            <template #cell-actions="{ row }">
                <MmButton
                    size="sm"
                    icon-only
                    title="查看反馈"
                    aria-label="查看反馈"
                    @click="open(row.id)"
                    ><MmIcon name="eye" :size="15"
                /></MmButton>
            </template>
        </MmProTable>
        <MmDialog
            v-model="visible"
            title="反馈详情"
            :subtitle="detail?.code || '查看用户正式提交的意见反馈'"
            width="760px"
            :close-on-click-modal="false"
        >
            <div class="feedback-detail" :aria-busy="loading">
                <p v-if="loading" role="status">正在读取反馈…</p>
                <MmAlert v-if="error" type="error" :closable="false" :description="error" />
                <template v-if="detail && !loading">
                    <dl class="feedback-info">
                        <div>
                            <dt>UID</dt>
                            <dd>{{ detail.public_user_id_snapshot }}</dd>
                        </div>
                        <div>
                            <dt>用户账号</dt>
                            <dd>{{ detail.username_snapshot || '—' }}</dd>
                        </div>
                        <div>
                            <dt>来源类型</dt>
                            <dd>{{ feedbackSourceLabel(detail.source_type) }}</dd>
                        </div>
                        <div>
                            <dt>来源名称</dt>
                            <dd>{{ detail.source_name_snapshot || '—' }}</dd>
                        </div>
                        <div>
                            <dt>业务场景</dt>
                            <dd>{{ detail.scene_name_snapshot }}</dd>
                        </div>
                        <div>
                            <dt>问题分类</dt>
                            <dd>{{ detail.issue_category_name_snapshot }}</dd>
                        </div>
                        <div>
                            <dt>联系方式（脱敏）</dt>
                            <dd>{{ detail.contact_display }}</dd>
                        </div>
                        <div>
                            <dt>提交时间</dt>
                            <dd>{{ formatDateTimeInClientTimezone(detail.submitted_at) }}</dd>
                        </div>
                    </dl>
                    <section>
                        <h3>反馈内容</h3>
                        <div class="feedback-content">{{ detail.content }}</div>
                    </section>
                    <section>
                        <h3>
                            附件 <span>{{ detail.attachments?.length || 0 }}</span>
                        </h3>
                        <p v-if="!detail.attachments?.length" class="muted">暂无附件</p>
                        <div
                            v-for="a in detail.attachments"
                            :key="a.id"
                            class="feedback-attachment"
                        >
                            <div class="attachment-title">
                                <span
                                    >{{ a.original_name || '图片附件' }} ·
                                    {{ Math.ceil(a.byte_size / 1024) }} KB</span
                                >
                                <MmButton
                                    size="sm"
                                    :loading="attachmentLoading === a.id"
                                    @click="preview(a.id)"
                                    >查看图片</MmButton
                                >
                            </div>
                            <img
                                v-if="previews[a.id]"
                                :src="previews[a.id]"
                                :alt="a.original_name || '反馈图片'"
                            />
                        </div>
                    </section>
                    <p class="muted">来源和分类为提交时快照；此页面仅查看，不修改用户原始反馈。</p>
                </template>
            </div>
            <template #footer><MmButton @click="visible = false">关闭</MmButton></template>
        </MmDialog>
    </div>
</template>
<script setup lang="ts">
import { useCmsRuntime } from "../../../../runtime"
const { getFeedbackList, getFeedbackMetadata, getFeedbackDetail, getFeedbackAttachment, feedbackSourceTypes, feedbackSourceLabel, feedbackError } = useFeedbackApi()
const { formatDateTime: formatDateTimeInClientTimezone } = useCmsRuntime()

import { createCmsSourceColumns, useCmsSourceFields } from "../../cmsSources"
import SourceTypeTag from "../../../../components/source-type-tag/index.vue"
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
    MmProTable,
    MmButton,
    MmIcon,
    MmTag,
    MmDialog,
    MmAlert,
    useMmProTable,
    type ProTableColumn,
    type QueryBarField
} from "../../../../../index"
import { useFeedbackApi, type FeedbackMetadata, type FeedbackRow } from "../../../../api/content/feedback"

const metadata = ref<FeedbackMetadata>({ scenes: [], issues: [] })
const cmsSources = useCmsSourceFields(getFeedbackMetadata, value => { metadata.value = value })
const columns: ProTableColumn<FeedbackRow>[] = [
    ...createCmsSourceColumns(),
    { key: 'code', dataIndex: 'code', title: '反馈ID', width: 200 },
    {
        key: 'public_user_id_snapshot',
        dataIndex: 'public_user_id_snapshot',
        title: 'UID',
        width: 120
    },
    { key: 'username_snapshot', dataIndex: 'username_snapshot', title: '用户账号', width: 150 },
    { key: 'source_type', title: '用户来源类型', width: 90 },
    {
        key: 'source_name_snapshot',
        dataIndex: 'source_name_snapshot',
        title: '用户来源名称',
        width: 140
    },
    {
        key: 'category',
        title: '业务场景 / 问题分类',
        width: 190,
        formatter: (_v, row) => `${row.scene_name_snapshot} / ${row.issue_category_name_snapshot}`
    },
    { key: 'content', dataIndex: 'content', title: '反馈内容', width: 340 },
    { key: 'contact_display', dataIndex: 'contact_display', title: '联系方式', width: 180 },
    {
        key: 'submitted_at',
        dataIndex: 'submitted_at',
        title: '提交时间',
        width: 180,
        formatter: formatDateTimeInClientTimezone
    },
    { key: 'actions', title: '操作', width: 64, fixed: 'right', align: 'center', hideable: false }
]
const queryFields = computed<QueryBarField[]>(() => [
    ...cmsSources.fields,
    {
        key: 'code',
        label: '反馈ID',
        type: 'keyword',
        width: 180,
        placeholder: '反馈ID',
        defaultValue: ''
    },
    {
        key: 'uid',
        label: 'UID',
        type: 'keyword',
        width: 160,
        placeholder: 'UID（精确查询）',
        defaultValue: ''
    },
    {
        key: 'source_name',
        label: '用户来源名称',
        type: 'keyword',
        width: 180,
        placeholder: '搜索用户来源名称',
        defaultValue: ''
    },
    {
        key: 'source_type',
        label: '用户来源类型',
        type: 'select',
        width: 140,
        defaultValue: '',
        options: [{ label: '全部', value: '' }, ...feedbackSourceTypes]
    },
    {
        key: 'scene_id',
        label: '业务场景',
        type: 'select',
        width: 160,
        defaultValue: '',
        options: [
            { label: '全部', value: '' },
            ...metadata.value.scenes.map((s) => ({ label: s.name, value: s.id }))
        ]
    },
    {
        key: 'issue_category_id',
        label: '问题分类',
        type: 'select',
        width: 180,
        defaultValue: '',
        options: [
            { label: '全部', value: '' },
            ...metadata.value.issues.map((s) => ({
                label: `${metadata.value.scenes.find((p) => p.id === s.scene_id)?.name || '—'} / ${s.name}`,
                value: s.id
            }))
        ]
    },
    {
        key: 'submitted_range',
        label: '提交时间',
        type: 'date-range',
        width: 240,
        defaultValue: null
    }
])
const { proTableBindings, filters: cmsSourceFilters } = useMmProTable<FeedbackRow>({
    initialAutoRefreshSeconds: 0,
    initialPageSize: 20,
    queryFields,
    request: async ({ filters, page, pageSize, signal }) => {
        const params: Record<string, unknown> = Object.fromEntries(
            Object.entries(filters).filter(
                ([k, v]) => k !== 'submitted_range' && v !== '' && v != null
            )
        )
        const range = filters.submitted_range
        if (Array.isArray(range) && range.length === 2) {
            params.submitted_from = new Date(`${range[0]}T00:00:00`).toISOString()
            params.submitted_to = new Date(`${range[1]}T23:59:59.999`).toISOString()
        }
        const result = await getFeedbackList(
            { ...params, page_no: page, page_size: pageSize },
            signal
        )
        return { rows: result.lists, total: result.count }
    }
})
cmsSources.bindFilters(cmsSourceFilters)

const visible = ref(false),
    loading = ref(false),
    error = ref(''),
    detail = ref<FeedbackRow>(),
    previews = ref<Record<string, string>>({}),
    attachmentLoading = ref('')
let detailController: AbortController | undefined
const controller = new AbortController()
async function open(id: string) {
    detailController?.abort()
    const current = new AbortController()
    detailController = current
    detail.value = undefined
    previews.value = {}
    error.value = ''
    attachmentLoading.value = ''
    visible.value = true
    loading.value = true
    try {
        const result = await getFeedbackDetail(id, current.signal)
        if (!current.signal.aborted) detail.value = result
    } catch (e) {
        if (!current.signal.aborted) error.value = feedbackError(e)
    } finally {
        if (!current.signal.aborted) loading.value = false
    }
}
async function preview(id: string) {
    const current = detailController,
        feedbackId = detail.value?.id
    if (!current || !feedbackId || attachmentLoading.value) return
    attachmentLoading.value = id
    error.value = ''
    try {
        const result = await getFeedbackAttachment(feedbackId, id, current.signal)
        if (
            !current.signal.aborted &&
            /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(result.data_url)
        )
            previews.value[id] = result.data_url
    } catch (e) {
        if (!current.signal.aborted) error.value = feedbackError(e)
    } finally {
        if (!current.signal.aborted) attachmentLoading.value = ''
    }
}
watch(visible, (value) => {
    if (!value) {
        detailController?.abort()
        detail.value = undefined
        previews.value = {}
        error.value = ''
    }
})
onMounted(async () => {
    try {
        metadata.value = await getFeedbackMetadata(controller.signal)
    } catch {
        /* Request layer reports errors. */
    }
})
onBeforeUnmount(() => {
    controller.abort()
    detailController?.abort()
})
</script>
<style scoped>
.feedback-page {
    height: calc(100dvh - var(--navbar-height, 54px) - 24px);
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.feedback-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.feedback-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px 24px;
    margin: 0;
}
.feedback-info dt,
.muted {
    color: var(--mm-text-secondary, #687386);
    font-size: 12px;
}
.feedback-info dd {
    margin: 5px 0 0;
    overflow-wrap: anywhere;
}
h3 {
    font-size: 13px;
    margin: 0 0 10px;
}
h3 span {
    color: var(--mm-text-secondary, #687386);
    font-weight: normal;
}
.feedback-content {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.8;
    padding: 14px;
    border: 1px solid var(--mm-border-color, #dce1e9);
    border-radius: 6px;
}
.feedback-attachment {
    border: 1px solid var(--mm-border-color, #dce1e9);
    border-radius: 6px;
    padding: 12px;
    margin-top: 8px;
}
.attachment-title {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    font-size: 12px;
    overflow-wrap: anywhere;
}
.feedback-attachment img {
    display: block;
    max-width: 100%;
    max-height: 480px;
    object-fit: contain;
    margin: 12px auto 0;
}
@media (max-width: 600px) {
    .feedback-info {
        grid-template-columns: 1fr;
    }
}
</style>
