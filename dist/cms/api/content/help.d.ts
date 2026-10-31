export type HelpKind = 'categories' | 'articles';
export interface HelpRow {
    [key: string]: unknown;
    id: string;
    row_version: string;
    code: string;
    name: string;
    parent_id: string | null;
    sort_order: number;
    is_enabled: boolean;
    help_count: number;
    icon_key: string | null;
    updated_by_name: string;
    updated_at: string;
}
export interface HelpArticle extends HelpRow {
    search_keywords: string | null;
    helpful_enabled: boolean;
    related_content_ids: string[];
    related_articles: Pick<HelpArticle, 'id' | 'code' | 'title'>[];
    view_count: string | null;
    vote_count: string | null;
    helpful_rate: number | null;
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
export interface HelpMetadata {
    cms_source_options?: {
        value: string;
        label: string;
    }[];
    source_locale: string;
    statistics_scope: 'template';
    categories: (Pick<HelpRow, 'id' | 'name' | 'parent_id' | 'is_enabled' | 'sort_order'> & {
        effective_enabled: boolean;
    })[];
}
export declare function useHelpApi(): {
    getHelpMetadata: (signal?: AbortSignal, scope?: {
        space_id?: string;
        cms_source_type?: string;
        cms_tenant_id?: string;
    }) => Promise<HelpMetadata>;
    getHelpList: <T = HelpRow>(kind: HelpKind, params: Record<string, unknown>, signal?: AbortSignal) => Promise<{
        lists: T[];
        count: number;
    }>;
    getHelpDetail: <T = HelpRow>(kind: HelpKind, id: string, signal?: AbortSignal) => Promise<T>;
    saveHelp: <T = HelpRow>(kind: HelpKind, params: Record<string, unknown>) => Promise<T>;
    deleteHelp: (kind: HelpKind, id: string, row_version: string) => Promise<unknown>;
    uploadHelpCover: (file: File, signal?: AbortSignal) => Promise<{
        url: string;
    }>;
    helpPublishStates: {
        label: string;
        value: string;
    }[];
    helpCategoryLabel: (metadata: HelpMetadata | undefined, id: unknown) => string;
    helpError: (error: unknown) => string;
};
