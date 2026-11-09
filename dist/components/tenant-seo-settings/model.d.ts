import { TranslationSettings } from '../../cms/api/content/translations';
export type { TranslationSettings };
export interface SeoCopy {
    title: string;
    description: string;
}
export interface SeoTranslationContext {
    available: boolean;
    reason: string | null;
    source_locale?: string;
    settings: TranslationSettings | null;
}
export interface TenantSeoDraft {
    indexing_enabled: boolean;
    default_locale: string;
    translations: Record<string, SeoCopy>;
    og_image_url: string | null;
    google_verification_token: string | null;
    verification_domain: string | null;
}
export interface TenantSeoDetail extends TenantSeoDraft {
    tenant_id: string;
    tenant_name: string;
    site_id: string;
    site_name: string;
    primary_domain: string | null;
    effective_indexing_enabled: boolean;
    blocking_reason: string | null;
    configured_locales: number;
    total_locales: number;
    updated_at: string | null;
    verification_domain_matches: boolean;
    version: number;
    locales: {
        value: string;
        label: string;
    }[];
    sites?: {
        site_id: string;
        site_name: string;
    }[];
    can_edit?: boolean;
}
export interface SeoTranslateInput {
    site_id: string;
    source_locale: string;
    target_locale: string;
    fields: Partial<SeoCopy>;
}
export interface SeoTranslateResult {
    target_locale: string;
    values: Partial<SeoCopy>;
    errors: Partial<SeoCopy>;
}
export interface TenantSeoSaveInput extends TenantSeoDraft {
    site_id: string;
    expected_version: number;
}
export interface TenantSeoSaveResult {
    changed: boolean;
    version: number;
    detail?: TenantSeoDetail;
}
export interface SeoTranslationCallbacks {
    loadContext: (site: {
        site_id: string;
    }, signal: AbortSignal) => Promise<SeoTranslationContext>;
    translate: (input: SeoTranslateInput, signal: AbortSignal) => Promise<SeoTranslateResult>;
    saveSettings?: (settings: TranslationSettings, apiKey: string) => Promise<TranslationSettings>;
    testConnection?: (spaceId: string, revision: string, apiKey: string) => Promise<unknown>;
}
export interface TenantSeoSettingsProps {
    upload: (siteId: string, file: File, signal: AbortSignal) => Promise<{
        url: string;
    }>;
    load: (signal: AbortSignal, siteId?: string) => Promise<TenantSeoDetail>;
    save: (input: TenantSeoSaveInput) => Promise<TenantSeoSaveResult>;
    translation: SeoTranslationCallbacks;
    canEdit?: boolean;
    fullPage?: boolean;
    formatUpdatedAt?: (value: string) => string;
}
