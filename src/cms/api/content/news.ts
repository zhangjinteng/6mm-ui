import { useCmsRuntime } from "../../runtime"
export type NewsKind = 'categories' | 'articles'
export interface NewsRow {
    [key: string]: unknown
    id: string
    row_version: string
    code: string
    name: string
    parent_id: string | null
    sort_order: number
    is_enabled: boolean
    news_count: number
    updated_by_name: string
    updated_at: string
}
export interface NewsArticle extends NewsRow {
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
export interface NewsMetadata {
    cms_source_options?: { value: string; label: string }[]
    source_locale: string
    categories: (Pick<NewsRow, 'id' | 'name' | 'parent_id' | 'is_enabled' | 'sort_order'> & {
        effective_enabled: boolean
    })[]
}
export function useNewsApi() {
const request = useCmsRuntime().request
const base = '/cms/news'
const getNewsMetadata = (signal?: AbortSignal, scope: { space_id?: string; cms_source_type?: string; cms_tenant_id?: string } = {}) =>
    request.get<NewsMetadata>({ url: `${base}/metadata`, params: scope, signal })
const getNewsList = <T = NewsRow>(
    kind: NewsKind,
    params: Record<string, unknown>,
    signal?: AbortSignal
) => request.get<{ lists: T[]; count: number }>({ url: `${base}/${kind}`, params, signal })
const getNewsDetail = <T = NewsRow>(kind: NewsKind, id: string, signal?: AbortSignal) =>
    request.get<T>({ url: `${base}/${kind}/detail`, params: { id }, signal })
const saveNews = <T = NewsRow>(kind: NewsKind, params: Record<string, unknown>) =>
    request.post<T>(
        { url: `${base}/${kind}/${params.id ? 'edit' : 'create'}`, params },
        { isOpenRetry: false }
    )
const deleteNews = (kind: NewsKind, id: string, row_version: string) =>
    request.post(
        { url: `${base}/${kind}/delete`, params: { id, row_version } },
        { isOpenRetry: false }
    )
const uploadNewsCover = (file: File, signal?: AbortSignal) => {
    const data = new FormData()
    data.append('file', file)
    return request.post<{ url: string }>(
        { url: `${base}/upload`, data, signal, headers: { 'Content-Type': 'multipart/form-data' } },
        { isOpenRetry: false }
    )
}
const newsPublishStates = [
    { label: '草稿', value: 'draft' },
    { label: '定时发布', value: 'scheduled' },
    { label: '已发布', value: 'published' }
]
function newsCategoryLabel(metadata: NewsMetadata | undefined, id: unknown): string {
    const category = metadata?.categories.find((c) => c.id === String(id))
    if (!category) return '—'
    const parent = metadata?.categories.find((c) => c.id === category.parent_id)
    return parent ? `${parent.name} / ${category.name}` : category.name
}
function newsError(error: unknown): string {
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
return { getNewsMetadata, getNewsList, getNewsDetail, saveNews, deleteNews, uploadNewsCover, newsPublishStates, newsCategoryLabel, newsError }
}
