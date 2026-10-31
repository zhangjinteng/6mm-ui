import { useCmsRuntime } from "../../runtime"
export type HelpKind = 'categories' | 'articles'
export interface HelpRow {
    [key: string]: unknown
    id: string
    row_version: string
    code: string
    name: string
    parent_id: string | null
    sort_order: number
    is_enabled: boolean
    help_count: number
    icon_key: string | null
    updated_by_name: string
    updated_at: string
}
export interface HelpArticle extends HelpRow {
    search_keywords: string | null
    helpful_enabled: boolean
    related_content_ids: string[]
    related_articles: Pick<HelpArticle, 'id' | 'code' | 'title'>[]
    view_count: string | null
    vote_count: string | null
    helpful_rate: number | null
    title: string
    category_id: string | null
    summary: string | null
    body_html: string
    seo_description: string | null
    cover_url: string | null
    content_source: string | null
    author_name: string | null
    publish_status: 'draft' | 'scheduled' | 'published'
    scheduled_at: string | null
    published_at: string | null
}
export interface HelpMetadata {
    cms_source_options?: { value: string; label: string }[]
    source_locale: string
    statistics_scope: 'template'
    categories: (Pick<HelpRow, 'id' | 'name' | 'parent_id' | 'is_enabled' | 'sort_order'> & {
        effective_enabled: boolean
    })[]
}
export function useHelpApi() {
const request = useCmsRuntime().request
const base = '/cms/help'
const getHelpMetadata = (signal?: AbortSignal, scope: { space_id?: string; cms_source_type?: string; cms_tenant_id?: string } = {}) =>
    request.get<HelpMetadata>({ url: `${base}/metadata`, params: scope, signal })
const getHelpList = <T = HelpRow>(
    kind: HelpKind,
    params: Record<string, unknown>,
    signal?: AbortSignal
) => request.get<{ lists: T[]; count: number }>({ url: `${base}/${kind}`, params, signal })
const getHelpDetail = <T = HelpRow>(kind: HelpKind, id: string, signal?: AbortSignal) =>
    request.get<T>({ url: `${base}/${kind}/detail`, params: { id }, signal })
const saveHelp = <T = HelpRow>(kind: HelpKind, params: Record<string, unknown>) =>
    request.post<T>(
        { url: `${base}/${kind}/${params.id ? 'edit' : 'create'}`, params },
        { isOpenRetry: false }
    )
const deleteHelp = (kind: HelpKind, id: string, row_version: string) =>
    request.post(
        { url: `${base}/${kind}/delete`, params: { id, row_version } },
        { isOpenRetry: false }
    )
const uploadHelpCover = (file: File, signal?: AbortSignal) => {
    const data = new FormData()
    data.append('file', file)
    return request.post<{ url: string }>(
        { url: `${base}/upload`, data, signal, headers: { 'Content-Type': 'multipart/form-data' } },
        { isOpenRetry: false }
    )
}
const helpPublishStates = [
    { label: '草稿', value: 'draft' },
    { label: '定时发布', value: 'scheduled' },
    { label: '已发布', value: 'published' }
]
function helpCategoryLabel(metadata: HelpMetadata | undefined, id: unknown): string {
    const category = metadata?.categories.find((c) => c.id === String(id))
    if (!category) return '—'
    const parent = metadata?.categories.find((c) => c.id === category.parent_id)
    return parent ? `${parent.name} / ${category.name}` : category.name
}
function helpError(error: unknown): string {
    if (error && typeof error === 'object') {
        const value = error as { msg?: string; message?: string; errors?: Record<string, string[]> }
        return (
            Object.values(value.errors || {}).flat()[0] ||
            value.msg ||
            value.message ||
            '操作失败，请稍后重试'
        )
    }
    return '操作失败，请稍后重试'
}
return { getHelpMetadata, getHelpList, getHelpDetail, saveHelp, deleteHelp, uploadHelpCover, helpPublishStates, helpCategoryLabel, helpError }
}
