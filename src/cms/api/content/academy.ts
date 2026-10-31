import { useCmsRuntime } from "../../runtime"
export type AcademyKind = 'categories' | 'courses'
export interface AcademyRow {
    [key: string]: unknown
    id: string
    row_version: string
    code: string
    name: string
    title: string
    sort_order: number
    is_enabled: boolean
    difficulty_levels: number[]
    course_count: number
    updated_by_name: string
    updated_at: string
}
export interface AcademyCourse extends AcademyRow {
    category_ids: string[]
    categories: { id: string; name: string }[]
    summary: string | null
    body_html: string
    seo_description: string | null
    cover_url: string | null
    difficulty_level: number | null
    estimated_minutes: number | null
    publish_status: 'draft' | 'scheduled' | 'published'
    scheduled_at: string | null
    published_at: string | null
}
export interface AcademyMetadata {
    cms_source_options?: { value: string; label: string }[]
    source_locale: string
    enabled_locales: string[]
    categories: Pick<AcademyRow, 'id' | 'name' | 'is_enabled' | 'difficulty_levels'>[]
}
export function useAcademyApi() {
const request = useCmsRuntime().request
const base = '/cms/academy'
const getAcademyMetadata = (signal?: AbortSignal, scope: { space_id?: string; cms_source_type?: string; cms_tenant_id?: string } = {}) =>
    request.get<AcademyMetadata>({ url: `${base}/metadata`, params: scope, signal })
const getAcademyList = <T = AcademyRow>(
    kind: AcademyKind,
    params: Record<string, unknown>,
    signal?: AbortSignal
) => request.get<{ lists: T[]; count: number }>({ url: `${base}/${kind}`, params, signal })
const getAcademyDetail = <T = AcademyRow>(
    kind: AcademyKind,
    id: string,
    signal?: AbortSignal
) => request.get<T>({ url: `${base}/${kind}/detail`, params: { id }, signal })
const saveAcademy = <T = AcademyRow>(kind: AcademyKind, params: Record<string, unknown>) =>
    request.post<T>(
        { url: `${base}/${kind}/${params.id ? 'edit' : 'create'}`, params },
        { isOpenRetry: false }
    )
const uploadAcademyCover = (file: File, signal?: AbortSignal) => {
    const data = new FormData()
    data.append('file', file)
    return request.post<{ url: string }>(
        { url: `${base}/upload`, data, signal, headers: { 'Content-Type': 'multipart/form-data' } },
        { isOpenRetry: false }
    )
}
const deleteAcademyCourse = (params: Pick<AcademyRow, 'id' | 'row_version'>) =>
    request.post<{ id: string }>({ url: `${base}/courses/delete`, params }, { isOpenRetry: false })
const deleteAcademyCategory = (params: Pick<AcademyRow, 'id' | 'row_version'>) =>
    request.post<{ id: string }>(
        { url: `${base}/categories/delete`, params },
        { isOpenRetry: false }
    )
const academyDifficulties = [
    { label: '入门', value: 1 },
    { label: '进阶', value: 2 },
    { label: '专业', value: 3 }
]
const academyPublishStates = [
    { label: '草稿', value: 'draft' },
    { label: '定时发布', value: 'scheduled' },
    { label: '已发布', value: 'published' }
]
const academyError = (error: unknown): string => {
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
return { getAcademyMetadata, getAcademyList, getAcademyDetail, saveAcademy, uploadAcademyCover, deleteAcademyCourse, deleteAcademyCategory, academyDifficulties, academyPublishStates, academyError }
}
