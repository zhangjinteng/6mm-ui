import { computed, nextTick, onBeforeUnmount, onMounted, reactive, watch, type Ref } from 'vue'
import { useCmsRuntime } from '../../runtime'
import type { ProTableColumn, QueryBarField, QueryBarValue, TableRow, UseMmProTableReturn } from "../../../index"

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
    const platform = useCmsRuntime().mode === 'platform'
    const fields = reactive<QueryBarField[]>(platform ? [
        { key: 'cms_source_type', label: '来源类型', type: 'segmented', width: 200, defaultValue: '', options: [
            { label: '全部', value: '' }, { label: '平台', value: 'platform' }, { label: '白标', value: 'white_label' }
        ] },
        { key: 'cms_tenant_id', label: '白标昵称', type: 'select', width: 180, defaultValue: '',
            filterable: true, placeholder: '搜索白标昵称', options: [{ label: '全部白标', value: '' }] }
    ] : [])
    let filters: Ref<QueryBarValue> | undefined
    let metadataController: AbortController | undefined
    let disposed = false
    const owner = (value: QueryBarValue) => [String(value.cms_source_type || ''), String(value.cms_tenant_id || '')] as const
    const sameOwner = (a: readonly string[], b: readonly string[]) => a[0] === b[0] && a[1] === b[1]
    const clearDependentFilters = (value: QueryBarValue) => {
        for (const key of ['parent_id', 'category_id', 'scene_id', 'issue_category_id']) {
            if (key in value) value[key] = ''
        }
    }
    async function loadMetadata() {
        if (disposed) return
        metadataController?.abort()
        const current = metadataController = new AbortController()
        const scope = platform ? {
            cms_source_type: String(filters?.value.cms_source_type || ''),
            cms_tenant_id: String(filters?.value.cms_tenant_id || '')
        } : {}
        try {
            const metadata = await load(current.signal, scope)
            if (disposed || current.signal.aborted) return
            const tenant = fields[1]
            if (tenant?.type === 'select') {
                tenant.options = [{ label: '全部白标', value: '' }, ...(metadata.cms_source_options || [])]
                tenant.disabled = filters?.value.cms_source_type === 'platform'
            }
            updateMetadata?.(metadata)
        } catch {
            if (!disposed && !current.signal.aborted && fields[1]?.type === 'select') fields[1].disabled = true
        }
    }
    onMounted(() => {
        if (platform || updateMetadata) return loadMetadata()
    })
    onBeforeUnmount(() => { disposed = true; metadataController?.abort() })

    function bindTable<Row extends TableRow>(table: UseMmProTableReturn<Row>): UseMmProTableReturn<Row> {
        if (!platform) return table
        const currentFilters = table.filters
        filters = currentFilters
        let submittedOwner = owner(currentFilters.value)
        const normalize = (value: QueryBarValue) => {
            const next = { ...value }
            if (next.cms_source_type === 'platform') next.cms_tenant_id = ''
            if (!sameOwner(submittedOwner, owner(next))) clearDependentFilters(next)
            return next
        }
        const query = (value: QueryBarValue = currentFilters.value) => {
            const next = normalize(value)
            submittedOwner = owner(next)
            table.query(next)
        }
        const reset = (value?: QueryBarValue) => {
            table.reset(value === undefined ? undefined : normalize(value))
            submittedOwner = owner(currentFilters.value)
        }
        watch(() => currentFilters.value.cms_source_type, type => {
            if (type === 'platform') currentFilters.value.cms_tenant_id = ''
            fields[1].disabled = type === 'platform'
        }, { immediate: true, flush: 'sync' })
        watch([
            () => String(currentFilters.value.cms_source_type || ''),
            () => String(currentFilters.value.cms_tenant_id || '')
        ], () => {
            clearDependentFilters(currentFilters.value)
            void loadMetadata()
            // A reset/manual query can already have submitted this scope in the same tick.
            void nextTick(() => {
                if (!disposed && !sameOwner(submittedOwner, owner(currentFilters.value))) query()
            })
        })
        return {
            ...table, query, reset,
            proTableBindings: computed(() => ({ ...table.proTableBindings.value, onQuery: query, onReset: reset }))
        }
    }
    return { fields, bindTable, loadMetadata }
}
