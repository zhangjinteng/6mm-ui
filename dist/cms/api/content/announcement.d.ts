export type AnnouncementKind = 'categories' | 'articles';
export interface AnnouncementRow {
    [key: string]: unknown;
    id: string;
    row_version: string;
    code: string;
    name: string;
    parent_id: string | null;
    sort_order: number;
    is_enabled: boolean;
    announcement_count: number;
    updated_by_name: string;
    updated_at: string;
}
export interface AnnouncementArticle extends AnnouncementRow {
    helpful_enabled: boolean;
    related_content_ids: string[];
    related_articles: Pick<AnnouncementArticle, 'id' | 'code' | 'title'>[];
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
export interface AnnouncementMetadata {
    cms_source_options?: {
        value: string;
        label: string;
    }[];
    source_locale: string;
    categories: (Pick<AnnouncementRow, 'id' | 'name' | 'parent_id' | 'is_enabled' | 'sort_order'> & {
        effective_enabled: boolean;
    })[];
}
export declare function useAnnouncementApi(): {
    getAnnouncementMetadata: (signal?: AbortSignal, scope?: {
        space_id?: string;
        cms_source_type?: string;
        cms_tenant_id?: string;
    }) => Promise<AnnouncementMetadata>;
    getAnnouncementList: <T = AnnouncementRow>(kind: AnnouncementKind, params: Record<string, unknown>, signal?: AbortSignal) => Promise<{
        lists: T[];
        count: number;
    }>;
    getAnnouncementDetail: <T = AnnouncementRow>(kind: AnnouncementKind, id: string, signal?: AbortSignal) => Promise<T>;
    saveAnnouncement: <T = AnnouncementRow>(kind: AnnouncementKind, params: Record<string, unknown>) => Promise<T>;
    deleteAnnouncement: (kind: AnnouncementKind, id: string, row_version: string) => Promise<unknown>;
    uploadAnnouncementCover: (file: File, signal?: AbortSignal) => Promise<{
        url: string;
    }>;
    announcementPublishStates: {
        label: string;
        value: string;
    }[];
    announcementCategoryLabel: (metadata: AnnouncementMetadata | undefined, id: unknown) => string;
    announcementError: (error: unknown) => string;
};
