export interface BrandDomain {
    domain: string;
    is_primary: boolean;
}
export interface BrandDomainDraft extends BrandDomain {
    key: number;
    existing: boolean;
}
export interface SiteBrandAssets {
    template_id?: 'template-1' | 'template-2' | null;
    logo_url?: string | null;
    favicon_url?: string | null;
    brand_revision?: string;
}
export interface BrandDomainSite extends SiteBrandAssets {
    site_id: string;
    site_name: string;
    domains: BrandDomain[];
    config_version: string;
    revision: string;
    updated_at?: string | null;
}
export interface TenantBrandDetail {
    tenant_id: string;
    tenant_name: string;
    sites: BrandDomainSite[];
    can_edit?: boolean;
}
export interface TenantBrandSaveInput extends SiteBrandAssets {
    site_id: string;
    expected_revision: string;
    expected_config_version: string;
    expected_brand_revision?: string;
    domains: BrandDomain[];
}
export interface TenantBrandSaveResult {
    changed: boolean;
    config_version?: string;
    snapshot_version?: string;
    revision?: string;
    brand_revision?: string;
    updated_at?: string;
}
export interface TenantBrandSettingsProps {
    load: (signal: AbortSignal) => Promise<TenantBrandDetail>;
    save: (input: TenantBrandSaveInput) => Promise<TenantBrandSaveResult>;
    uploadImage?: (siteId: string, file: File, signal: AbortSignal) => Promise<import('../../services/media-upload').MediaUploadResult>;
    canEdit?: boolean;
    fullPage?: boolean;
    formatUpdatedAt?: (value: string) => string;
}
export declare function normalizeBrandDomains(rows: BrandDomain[]): BrandDomain[];
export declare function brandDomainsEqual(a: BrandDomain[], b: BrandDomain[]): boolean;
export declare function brandDomainError(rows: BrandDomain[], english?: boolean): string;
