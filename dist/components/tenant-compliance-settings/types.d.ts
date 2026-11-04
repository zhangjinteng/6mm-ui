export type ComplianceType = 'terms' | 'privacy' | 'risk' | 'cookies' | 'aml';
export type ComplianceMode = 'platform' | 'url' | 'content';
export interface ComplianceProfile {
    legal_entity_name: string;
    registration_number: string;
    registered_address: string;
    support_email: string;
    effective_date: string;
}
export interface ComplianceAgreement {
    agreement_type: ComplianceType;
    label: string;
    mode: ComplianceMode;
    is_enabled: boolean;
    url: string;
    state: 'disabled' | 'template_disabled' | 'unpublished' | 'incomplete' | 'ready';
    template_code: string | null;
    published_chapters: number;
    published_version: string;
}
export interface ComplianceRow {
    [key: string]: unknown;
    tenant_id: string;
    tenant_name: string;
    site_id: string;
    site_name: string;
    legal_entity_name: string;
    agreements: ComplianceAgreement[];
    platform_count: number;
    updated_at: string | null;
}
export interface ComplianceDetail extends ComplianceRow {
    profile: ComplianceProfile;
    revision: string;
    sites?: {
        site_id: string;
        site_name: string;
    }[];
    can_edit?: boolean;
}
export interface ComplianceDraft {
    profile: ComplianceProfile;
    agreements: Pick<ComplianceAgreement, 'agreement_type' | 'mode' | 'is_enabled' | 'url'>[];
}
export interface ComplianceSaveInput extends ComplianceDraft {
    site_id: string;
    expected_revision: string;
}
export interface ComplianceSaveResult {
    changed: boolean;
    detail: ComplianceDetail;
}
export interface ComplianceSettingsProps {
    load: (signal: AbortSignal, siteId?: string) => Promise<ComplianceDetail>;
    save: (input: ComplianceSaveInput) => Promise<ComplianceSaveResult>;
    canEdit?: boolean;
    fullPage?: boolean;
    formatUpdatedAt?: (value: string) => string;
}
