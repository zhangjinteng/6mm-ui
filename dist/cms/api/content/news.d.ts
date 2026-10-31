export type NewsKind = 'categories' | 'articles';
export interface NewsRow {
    [key: string]: unknown;
    id: string;
    row_version: string;
    code: string;
    name: string;
    parent_id: string | null;
    sort_order: number;
    is_enabled: boolean;
    news_count: number;
    updated_by_name: string;
    updated_at: string;
}
export interface NewsArticle extends NewsRow {
    title: string;
    category_id: string | null;
    summary: string | null;
    body_html: string;
    seo_description: string | null;
    cover_url: string | null;
    content_source: string | null;
    author_name: string | null;
    publish_status: 'draft' | 'scheduled' | 'published';
    scheduled_at: string | null;
    published_at: string | null;
}
export interface NewsMetadata {
    cms_source_options?: {
        value: string;
        label: string;
    }[];
    source_locale: string;
    categories: (Pick<NewsRow, 'id' | 'name' | 'parent_id' | 'is_enabled' | 'sort_order'> & {
        effective_enabled: boolean;
    })[];
}
export declare function useNewsApi(): {
    getNewsMetadata: (signal?: AbortSignal, scope?: {
        space_id?: string;
        cms_source_type?: string;
        cms_tenant_id?: string;
    }) => Promise<NewsMetadata>;
    getNewsList: <T = NewsRow>(kind: NewsKind, params: Record<string, unknown>, signal?: AbortSignal) => Promise<{
        lists: T[];
        count: number;
    }>;
    getNewsDetail: <T = NewsRow>(kind: NewsKind, id: string, signal?: AbortSignal) => Promise<T>;
    saveNews: <T = NewsRow>(kind: NewsKind, params: Record<string, unknown>) => Promise<T>;
    deleteNews: (kind: NewsKind, id: string, row_version: string) => Promise<unknown>;
    uploadNewsCover: (file: File, signal?: AbortSignal) => Promise<{
        url: string;
    }>;
    newsPublishStates: {
        label: string;
        value: string;
    }[];
    newsCategoryLabel: (metadata: NewsMetadata | undefined, id: unknown) => string;
    newsError: (error: unknown) => string;
};
