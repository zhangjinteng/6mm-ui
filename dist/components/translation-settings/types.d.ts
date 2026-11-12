export interface TranslationSettings {
    [key: string]: unknown;
    space_id: string;
    space_revision: string;
    source_locale?: string;
    configuration_scope?: string;
    target_locales: string[];
    provider: string;
    api_version: string;
    credential_ref: string;
    credential_configured: boolean;
    credential_source?: 'database' | 'env';
    api_key_mask?: string | null;
    credential_error?: string | null;
    supported: boolean;
    is_enabled: boolean;
    concurrency_limit: number;
    request_timeout_seconds: number;
    max_attempts: number;
}
export interface TranslationSettingsActions {
    load: () => Promise<TranslationSettings>;
    save: (settings: TranslationSettings, apiKey: string) => Promise<TranslationSettings>;
    testConnection: (settings: TranslationSettings, apiKey: string) => Promise<unknown>;
}
