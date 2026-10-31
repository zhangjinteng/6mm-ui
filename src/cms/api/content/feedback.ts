import { useCmsRuntime } from "../../runtime"
export interface FeedbackAttachment {
    id: string
    original_name: string | null
    mime_type: string
    byte_size: number
}
export interface FeedbackRow {
    [key: string]: unknown
    id: string
    code: string
    home_site_id: string
    public_user_id_snapshot: string
    username_snapshot: string | null
    nickname_snapshot: string | null
    source_type: 'merchant' | 'white_label' | 'platform'
    source_agent_id: string | null
    source_name_snapshot: string | null
    scene_name_snapshot: string
    issue_category_name_snapshot: string
    content: string
    contact_display: string
    submitted_at: string
    attachments?: FeedbackAttachment[]
}
export interface FeedbackMetadata {
    cms_source_options?: { value: string; label: string }[]
    scenes: { id: string; name: string }[]
    issues: { id: string; scene_id: string; name: string }[]
}
export function useFeedbackApi() {
const request = useCmsRuntime().request
const base = '/cms/feedback'
const getFeedbackList = (params: Record<string, unknown>, signal?: AbortSignal) =>
    request.get<{ lists: FeedbackRow[]; count: number }>({ url: `${base}/list`, params, signal })
const getFeedbackMetadata = (signal?: AbortSignal, scope: { space_id?: string; cms_source_type?: string; cms_tenant_id?: string } = {}) =>
    request.get<FeedbackMetadata>({ url: `${base}/metadata`, params: scope, signal })
const getFeedbackDetail = (id: string, signal?: AbortSignal) =>
    request.get<FeedbackRow>({ url: `${base}/detail`, params: { id }, signal })
const getFeedbackAttachment = (id: string, attachment_id: string, signal?: AbortSignal) =>
    request.get<{ data_url: string }>({
        url: `${base}/attachment`,
        params: { id, attachment_id },
        signal
    })
const feedbackSourceTypes = [
    { label: '商户', value: 'merchant' },
    { label: '白标', value: 'white_label' },
    { label: '平台', value: 'platform' }
]
const feedbackSourceLabel = (type: string) =>
    feedbackSourceTypes.find((s) => s.value === type)?.label || '—'
function feedbackError(error: unknown): string {
    const e = error as { errors?: Record<string, string[]>; message?: string } | undefined
    return Object.values(e?.errors || {}).flat()[0] || e?.message || '读取失败，请稍后重试'
}
return { getFeedbackList, getFeedbackMetadata, getFeedbackDetail, getFeedbackAttachment, feedbackSourceTypes, feedbackSourceLabel, feedbackError }
}
