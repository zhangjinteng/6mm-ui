import { onBeforeUnmount, onMounted, reactive, watch, type Ref } from 'vue'
import { useCmsRuntime } from '../../runtime'
import type { ProTableColumn, QueryBarField, TableRow } from "../../../index"

export interface CmsSourceMetadata {
    cms_source_options?: { value: string; label: string }[]
}

/** CMS ownership is independent from user-source snapshots and report scopes. */
export function createCmsSourceColumns<Row extends TableRow>(): ProTableColumn<Row>[] {
    return [
        { key: 'cms_source_name', dataIndex: 'cms_source_name', title: '来源昵称', width: 160 },
        { key: 'cms_source_type', dataIndex: 'cms_source_type', title: '来源类型', width: 100 }
    ]
}

export function useCmsSourceFields<T extends CmsSourceMetadata>(
    load: (signal?: AbortSignal, scope?: { cms_source_type?: string; cms_tenant_id?: string }) => Promise<T>,
    updateMetadata?: (metadata: T) => void
) {
    if (useCmsRuntime().mode === 'white_label') return { fields: [] as QueryBarField[], bindFilters: (_filters: Ref<Record<string, unknown>>) => {} }
    const fields = reactive<QueryBarField[]>([
        { key: 'cms_source_type', label: '来源类型', type: 'segmented', width: 200, defaultValue: '', options: [
            { label: '全部', value: '' }, { label: '平台', value: 'platform' }, { label: '白标', value: 'white_label' }
        ] },
        { key: 'cms_tenant_id', label: '白标昵称', type: 'select', width: 180, defaultValue: '',
            filterable: true, placeholder: '搜索白标昵称', options: [{ label: '全部白标', value: '' }] }
    ])
    const controller = new AbortController()
    let scopedController: AbortController | undefined
    onMounted(async () => {
        try {
            const metadata = await load(controller.signal)
            if (!controller.signal.aborted && fields[1].type === 'select') {
                fields[1].options = [{ label: '全部白标', value: '' }, ...(metadata.cms_source_options || [])]
            }
        } catch {
            // The page's normal metadata/list request owns visible error reporting.
            if (fields[1].type === 'select') fields[1].disabled = true
        }
    })
    onBeforeUnmount(() => { controller.abort(); scopedController?.abort() })
    const bindFilters = (filters: Ref<Record<string, unknown>>) => {
        watch(() => filters.value.cms_source_type, type => {
            if (type === 'platform') filters.value.cms_tenant_id = ''
            fields[1].disabled = type === 'platform'
        }, { immediate: true, flush: 'sync' })
        if (updateMetadata) watch(() => [filters.value.cms_source_type, filters.value.cms_tenant_id], () => {
            // Category/scene dropdowns must follow the selected owner, not keep a
            // category from a previously selected platform/white label.
            for (const key of ['parent_id', 'category_id', 'scene_id', 'issue_category_id']) {
                if (key in filters.value) filters.value[key] = ''
            }
            scopedController?.abort()
            const current = scopedController = new AbortController()
            void load(current.signal, {
                cms_source_type: String(filters.value.cms_source_type || ''),
                cms_tenant_id: String(filters.value.cms_tenant_id || '')
            }).then(metadata => { if (!current.signal.aborted) updateMetadata(metadata) }).catch(() => {})
        })
    }
    return { fields, bindFilters }
}
