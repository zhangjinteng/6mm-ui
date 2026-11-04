import { TenantCustomerServiceTransport } from '../tenant-customer-service/model';
export type TenantContentFeatureCode = 'news' | 'academy' | 'help_center' | 'feedback' | 'announcement';
export type TenantFeatureCode = 'trade_ranking' | TenantContentFeatureCode;
export type TenantFeatureValues = {
    trade_ranking: boolean;
} & Partial<Record<TenantContentFeatureCode, boolean>>;
export interface TenantFeatureSite {
    site_id: string;
    site_name: string;
}
export interface TenantFeatureSettingsDetail extends TenantFeatureSite {
    tenant_id: string;
    tenant_name: string;
    features: TenantFeatureValues;
    expected_updated_at: string | null;
    expected_revision?: string;
    sites?: TenantFeatureSite[];
    can_edit?: boolean;
}
export interface TenantFeatureSaveInput {
    site_id: string;
    expected_updated_at: string | null;
    expected_revision?: string;
    features: TenantFeatureValues;
}
export interface TenantFeatureSaveResult {
    changed: boolean;
    detail: TenantFeatureSettingsDetail;
}
export interface TenantFeatureSettingsProps {
    load: (signal: AbortSignal, siteId?: string) => Promise<TenantFeatureSettingsDetail>;
    save: (input: TenantFeatureSaveInput) => Promise<TenantFeatureSaveResult>;
    canEdit?: boolean;
    fullPage?: boolean;
    formatUpdatedAt?: (value: string) => string;
    customerService?: TenantCustomerServiceTransport;
    /** Opt-in for white-label site content switches; platform hosts remain ranking-only. */
    contentFeatures?: boolean;
}
export declare const tenantFeatureCatalogue: readonly [{
    readonly code: "trade_ranking";
    readonly group: "growth";
    readonly icon: "chart-candlestick";
}];
export declare const tenantContentFeatureCatalogue: readonly [{
    readonly code: "news";
    readonly icon: "newspaper";
    readonly zh: "新闻";
    readonly en: "News";
    readonly description: "展示本站新闻分类及新闻内容";
    readonly descriptionEn: "Show this site’s news categories and articles";
    readonly path: "首页 / 新闻";
    readonly pathEn: "Home / News";
}, {
    readonly code: "academy";
    readonly icon: "graduation-cap";
    readonly zh: "学院";
    readonly en: "Academy";
    readonly description: "展示本站学院分类及课程内容";
    readonly descriptionEn: "Show this site’s academy categories and courses";
    readonly path: "学院 / 课程";
    readonly pathEn: "Academy / Courses";
}, {
    readonly code: "help_center";
    readonly icon: "circle-help";
    readonly zh: "帮助中心";
    readonly en: "Help center";
    readonly description: "展示帮助分类、使用指南和常见问题";
    readonly descriptionEn: "Show help categories, guides and frequently asked questions";
    readonly path: "帮助 / 帮助中心";
    readonly pathEn: "Help / Help center";
}, {
    readonly code: "feedback";
    readonly icon: "message-square-more";
    readonly zh: "意见反馈";
    readonly en: "Feedback";
    readonly description: "展示用户意见、问题反馈入口";
    readonly descriptionEn: "Show the entry point for user feedback and issues";
    readonly path: "更多 / 意见反馈";
    readonly pathEn: "More / Feedback";
}, {
    readonly code: "announcement";
    readonly icon: "megaphone";
    readonly zh: "公告";
    readonly en: "Announcements";
    readonly description: "展示公告中心及已发布的站点公告";
    readonly descriptionEn: "Show the announcement center and published site announcements";
    readonly path: "更多 / 公告";
    readonly pathEn: "More / Announcements";
}];
