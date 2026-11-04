export type TenantFeatureValues = { trade_ranking: boolean }
export interface TenantFeatureSite { site_id: string; site_name: string }
export interface TenantFeatureSettingsDetail extends TenantFeatureSite {
  tenant_id: string
  tenant_name: string
  features: TenantFeatureValues
  expected_updated_at: string | null
  sites?: TenantFeatureSite[]
  can_edit?: boolean
}
export interface TenantFeatureSaveInput { site_id: string; expected_updated_at: string | null; features: TenantFeatureValues }
export interface TenantFeatureSaveResult { changed: boolean; detail: TenantFeatureSettingsDetail }
export interface TenantFeatureSettingsProps {
  load: (signal: AbortSignal, siteId?: string) => Promise<TenantFeatureSettingsDetail>
  save: (input: TenantFeatureSaveInput) => Promise<TenantFeatureSaveResult>
  canEdit?: boolean
  fullPage?: boolean
  formatUpdatedAt?: (value: string) => string
}

// Only the implemented frontend-entry flag is exposed. Never add business entitlement codes here.
export const tenantFeatureCatalogue = [{ code: 'trade_ranking', group: 'growth', icon: 'chart-candlestick' }] as const
