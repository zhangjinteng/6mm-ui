import { useCmsRuntime } from "../../runtime"
export type TranslationKind = 'content' | 'category'
export interface TranslationScope {
    space_id: string
    module: string
    kind: TranslationKind
}
export interface TranslationLocale {
    code: string
    label: string
    native: string
    flag: string
    done: number
    total: number
}
export interface TranslationModule {
    key: string
    module: string
    kind: TranslationKind | 'display'
    label: string
    icon: string
    count: number
    done: number
    total: number
    available: boolean
    reason?: string
}
export interface TranslationMetadata {
    spaces: { id: string; label: string; is_enabled: boolean }[]
    space_id: string | null
    space_revision: string | null
    space_enabled: boolean
    source_locale: string
    target_locales: string[]
    locales: TranslationLocale[]
    modules: TranslationModule[]
    done: number
    total: number
}
export interface TranslationRow {
    id: string
    space_id: string
    code: string
    title: string
    publish_status: string | null
    done: number
    total: number
}
export interface TranslationValue {
    locale: string
    text: string
    row_version: string
    status: 'missing' | 'draft' | 'ready' | 'stale'
    method: string | null
}
export interface TranslationField {
    key: string
    label: string
    source: string
    source_hash: string
    max_length: number
    translatable: boolean
    translations: TranslationValue[]
}
export interface TranslationDetail extends TranslationRow {
    fields: TranslationField[]
    space_revision: string
    source_locale: string
}
export interface TranslationSettings {
    [key: string]: unknown
    space_id: string
    space_revision: string
    target_locales: string[]
    provider: string
    api_version: string
    credential_ref: string
    credential_configured: boolean
    supported: boolean
    is_enabled: boolean
    concurrency_limit: number
    request_timeout_seconds: number
    max_attempts: number
}
export interface TranslationJob {
    id: string
    space_id: string
    status: string
    total: number
    counts: Record<string, number>
    errors: { target_locale: string; field_name: string; error_code: string }[]
    created_at: string
}
export interface TranslationEdit {
    field_name: string
    locale: string
    text: string
    source_hash: string
    row_version: string
}
export function useTranslationsApi() {
const request = useCmsRuntime().request
const base = '/cms/translations'
const getTranslationMetadata = (space_id?: string, signal?: AbortSignal) =>
    request.get<TranslationMetadata>({ url: `${base}/metadata`, params: { space_id }, signal })
const getTranslationList = (
    scope: TranslationScope,
    keyword: string,
    page_no: number,
    signal?: AbortSignal
) =>
    request.get<{ lists: TranslationRow[]; count: number; page_size: number }>({
        url: `${base}/listing`,
        params: { ...scope, keyword, page_no },
        signal
    })
const getTranslationDetail = (scope: TranslationScope, id: string, signal?: AbortSignal) =>
    request.get<TranslationDetail>({ url: `${base}/detail`, params: { ...scope, id }, signal })
const saveTranslations = (scope: TranslationScope, id: string, items: TranslationEdit[]) =>
    request.post<TranslationDetail>(
        { url: `${base}/save`, params: { ...scope, id, items } },
        { isOpenRetry: false }
    )
const getTranslationSettings = (space_id: string, signal?: AbortSignal) =>
    request.get<TranslationSettings>({ url: `${base}/settings`, params: { space_id }, signal })
const saveTranslationSettings = (settings: TranslationSettings) =>
    request.post<TranslationSettings>(
        { url: `${base}/saveSettings`, params: settings },
        { isOpenRetry: false }
    )
const testTranslationConnection = (space_id: string) =>
    request.post<{ connected: boolean }>(
        { url: `${base}/testConnection`, params: { space_id } },
        { isOpenRetry: false }
    )
const createTranslationJob = (
    scope: TranslationScope,
    options: {
        id?: string
        field_name?: string
        keyword?: string
        request_key: string
        target_locales: string[]
    }
) =>
    request.post<{ job: TranslationJob }>(
        { url: `${base}/createJob`, params: { ...scope, ...options } },
        { isOpenRetry: false }
    )
const getTranslationJob = (space_id: string, signal?: AbortSignal) =>
    request.get<{ job: TranslationJob | null }>({
        url: `${base}/jobStatus`,
        params: { space_id },
        signal
    })
const cancelTranslationJob = (space_id: string, job_id: string) =>
    request.post<{ job: TranslationJob }>(
        { url: `${base}/cancelJob`, params: { space_id, job_id } },
        { isOpenRetry: false }
    )
return { getTranslationMetadata, getTranslationList, getTranslationDetail, saveTranslations, getTranslationSettings, saveTranslationSettings, testTranslationConnection, createTranslationJob, getTranslationJob, cancelTranslationJob }
}
