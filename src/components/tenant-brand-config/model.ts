export interface BrandDomain { domain: string; is_primary: boolean }
export interface BrandDomainDraft extends BrandDomain { key: number; existing: boolean }
export interface SiteBrandAssets {
  template_id?: 'template-1' | 'template-2' | null
  logo_url?: string | null
  favicon_url?: string | null
  brand_revision?: string
}
export interface BrandDomainSite extends SiteBrandAssets {
  site_id: string
  site_name: string
  domains: BrandDomain[]
  config_version: string
  revision: string
  updated_at?: string | null
}
export interface TenantBrandDetail { tenant_id: string; tenant_name: string; sites: BrandDomainSite[]; can_edit?: boolean }
export interface TenantBrandSaveInput extends SiteBrandAssets { site_id: string; expected_revision: string; expected_config_version: string; expected_brand_revision?: string; domains: BrandDomain[] }
export interface TenantBrandSaveResult { changed: boolean; config_version?: string; snapshot_version?: string; revision?: string; brand_revision?: string; updated_at?: string }
export interface TenantBrandSettingsProps {
  load: (signal: AbortSignal) => Promise<TenantBrandDetail>
  save: (input: TenantBrandSaveInput) => Promise<TenantBrandSaveResult>
  uploadImage?: (siteId: string, file: File, signal: AbortSignal) => Promise<import('../../services/media-upload').MediaUploadResult>
  canEdit?: boolean
  fullPage?: boolean
  formatUpdatedAt?: (value: string) => string
}

export function normalizeBrandDomains(rows: BrandDomain[]): BrandDomain[] {
  return rows.map(row => ({ domain: row.domain.trim().toLowerCase().replace(/\.$/, ''), is_primary: row.is_primary }))
}
export function brandDomainsEqual(a: BrandDomain[], b: BrandDomain[]): boolean {
  const sorted = (rows: BrandDomain[]) => JSON.stringify(normalizeBrandDomains(rows).sort((a, b) => a.domain.localeCompare(b.domain)))
  return sorted(a) === sorted(b)
}
export function brandDomainError(rows: BrandDomain[], english = false): string {
  if (rows.length > 20) return english ? 'Up to 20 domains are supported.' : '访问域名最多 20 个'
  if (!rows.length) return english ? 'At least one domain is required.' : '请保留至少一个站点域名'
  if (rows.filter(row => row.is_primary).length !== 1) return english ? 'Select exactly one primary domain.' : '请指定一个主域名'
  const names = normalizeBrandDomains(rows).map(row => row.domain)
  if (new Set(names).size !== names.length) return english ? 'Domains must be unique.' : '域名不能重复'
  if (names.some(domain => !/^(?=.{1,253}$)(?:\*\.)?(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(domain))) {
    return english ? 'Enter a full domain without a protocol, port, or path. Use Punycode for internationalized domains.' : '请输入完整域名，不包含协议、端口或路径；国际化域名请使用 Punycode'
  }
  return ''
}
