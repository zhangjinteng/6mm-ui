import type { TenantCustomerServiceTransport } from '../tenant-customer-service/model'

export type TenantContentFeatureCode = 'news' | 'academy' | 'help_center' | 'feedback' | 'announcement'
export type TenantFeatureCode = 'trade_ranking' | TenantContentFeatureCode
export type TenantFeatureValues = { trade_ranking: boolean } & Partial<Record<TenantContentFeatureCode, boolean>>
export interface TenantFeatureSite { site_id: string; site_name: string }
export interface TenantFeatureSettingsDetail extends TenantFeatureSite {
  tenant_id: string
  tenant_name: string
  features: TenantFeatureValues
  expected_updated_at: string | null
  expected_revision?: string
  sites?: TenantFeatureSite[]
  can_edit?: boolean
}
export interface TenantFeatureSaveInput { site_id: string; expected_updated_at: string | null; expected_revision?: string; features: TenantFeatureValues }
export interface TenantFeatureSaveResult { changed: boolean; detail: TenantFeatureSettingsDetail }
export interface TenantFeatureSettingsProps {
  load: (signal: AbortSignal, siteId?: string) => Promise<TenantFeatureSettingsDetail>
  save: (input: TenantFeatureSaveInput) => Promise<TenantFeatureSaveResult>
  canEdit?: boolean
  fullPage?: boolean
  formatUpdatedAt?: (value: string) => string
  customerService?: TenantCustomerServiceTransport
  /** Opt-in for white-label site content switches; platform hosts remain ranking-only. */
  contentFeatures?: boolean
}

// Frontend-entry flags only. Never add business entitlement codes here.
export const tenantFeatureCatalogue = [{ code: 'trade_ranking', group: 'growth', icon: 'chart-candlestick' }] as const
export const tenantContentFeatureCatalogue = [
  { code: 'news', icon: 'newspaper', zh: '新闻', en: 'News', description: '展示本站新闻分类及新闻内容', descriptionEn: 'Show this site’s news categories and articles', path: '首页 / 新闻', pathEn: 'Home / News' },
  { code: 'academy', icon: 'graduation-cap', zh: '学院', en: 'Academy', description: '展示本站学院分类及课程内容', descriptionEn: 'Show this site’s academy categories and courses', path: '学院 / 课程', pathEn: 'Academy / Courses' },
  { code: 'help_center', icon: 'circle-help', zh: '帮助中心', en: 'Help center', description: '展示帮助分类、使用指南和常见问题', descriptionEn: 'Show help categories, guides and frequently asked questions', path: '帮助 / 帮助中心', pathEn: 'Help / Help center' },
  { code: 'feedback', icon: 'message-square-more', zh: '意见反馈', en: 'Feedback', description: '展示用户意见、问题反馈入口', descriptionEn: 'Show the entry point for user feedback and issues', path: '更多 / 意见反馈', pathEn: 'More / Feedback' },
  { code: 'announcement', icon: 'megaphone', zh: '公告', en: 'Announcements', description: '展示公告中心及已发布的站点公告', descriptionEn: 'Show the announcement center and published site announcements', path: '更多 / 公告', pathEn: 'More / Announcements' },
] as const
