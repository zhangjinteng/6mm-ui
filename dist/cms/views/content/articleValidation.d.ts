export interface ArticleForm {
    title: string;
    category_id: string;
    summary: string;
    body_html: string;
    seo_description: string;
    cover_url: string;
    content_source: string;
    author_name: string;
    sort_order: number | null;
    is_enabled: boolean;
    scheduled_local: string;
    search_keywords?: string;
    helpful_enabled?: boolean;
    related_content_ids?: string[];
}
export type ArticleField = keyof ArticleForm;
export type ArticleErrors = Partial<Record<ArticleField, string>>;
export type ArticleModule = 'news' | 'help' | 'announcement';
export declare const articleLabels: {
    news: string;
    help: string;
    announcement: string;
};
export declare const articleFields: ArticleField[];
interface Category {
    id: string;
    effective_enabled: boolean;
}
export declare function validateArticle(form: ArticleForm, categories: Category[], module: ArticleModule, status: 'draft' | 'published' | 'scheduled', now?: number): ArticleErrors;
export declare function articleFieldErrors(error: unknown, module: ArticleModule): {
    fields: Partial<Record<keyof ArticleForm, string>>;
    general: string;
};
export {};
