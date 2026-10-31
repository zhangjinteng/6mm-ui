export type TranslationKind = 'content' | 'category';
export interface TranslationScope {
    space_id: string;
    module: string;
    kind: TranslationKind;
}
export interface TranslationLocale {
    code: string;
    label: string;
    native: string;
    flag: string;
    done: number;
    total: number;
}
export interface TranslationModule {
    key: string;
    module: string;
    kind: TranslationKind | 'display';
    label: string;
    icon: string;
    count: number;
    done: number;
    total: number;
    available: boolean;
    reason?: string;
}
export interface TranslationMetadata {
    spaces: {
        id: string;
        label: string;
        is_enabled: boolean;
    }[];
    space_id: string | null;
    space_revision: string | null;
    space_enabled: boolean;
    source_locale: string;
    target_locales: string[];
    locales: TranslationLocale[];
    modules: TranslationModule[];
    done: number;
    total: number;
}
export interface TranslationRow {
    id: string;
    space_id: string;
    code: string;
    title: string;
    publish_status: string | null;
    done: number;
    total: number;
}
export interface TranslationValue {
    locale: string;
    text: string;
    row_version: string;
    status: 'missing' | 'draft' | 'ready' | 'stale';
    method: string | null;
}
export interface TranslationField {
    key: string;
    label: string;
    source: string;
    source_hash: string;
    max_length: number;
    translatable: boolean;
    translations: TranslationValue[];
}
export interface TranslationDetail extends TranslationRow {
    fields: TranslationField[];
    space_revision: string;
    source_locale: string;
}
export interface TranslationSettings {
    [key: string]: unknown;
    space_id: string;
    space_revision: string;
    target_locales: string[];
    provider: string;
    api_version: string;
    credential_ref: string;
    credential_configured: boolean;
    supported: boolean;
    is_enabled: boolean;
    concurrency_limit: number;
    request_timeout_seconds: number;
    max_attempts: number;
}
export interface TranslationJob {
    id: string;
    space_id: string;
    status: string;
    total: number;
    counts: Record<string, number>;
    errors: {
        target_locale: string;
        field_name: string;
        error_code: string;
    }[];
    created_at: string;
}
export interface TranslationEdit {
    field_name: string;
    locale: string;
    text: string;
    source_hash: string;
    row_version: string;
}
export declare function useTranslationsApi(): {
    getTranslationMetadata: (space_id?: string, signal?: AbortSignal) => Promise<TranslationMetadata>;
    getTranslationList: (scope: TranslationScope, keyword: string, page_no: number, signal?: AbortSignal) => Promise<{
        lists: TranslationRow[];
        count: number;
        page_size: number;
    }>;
    getTranslationDetail: (scope: TranslationScope, id: string, signal?: AbortSignal) => Promise<TranslationDetail>;
    saveTranslations: (scope: TranslationScope, id: string, items: TranslationEdit[]) => Promise<TranslationDetail>;
    getTranslationSettings: (space_id: string, signal?: AbortSignal) => Promise<TranslationSettings>;
    saveTranslationSettings: (settings: TranslationSettings) => Promise<TranslationSettings>;
    testTranslationConnection: (space_id: string) => Promise<{
        connected: boolean;
    }>;
    createTranslationJob: (scope: TranslationScope, options: {
        id?: string;
        field_name?: string;
        keyword?: string;
        request_key: string;
        target_locales: string[];
    }) => Promise<{
        job: TranslationJob;
    }>;
    getTranslationJob: (space_id: string, signal?: AbortSignal) => Promise<{
        job: TranslationJob | null;
    }>;
    cancelTranslationJob: (space_id: string, job_id: string) => Promise<{
        job: TranslationJob;
    }>;
};
