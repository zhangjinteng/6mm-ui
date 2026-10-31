export type AcademyKind = 'categories' | 'courses';
export interface AcademyRow {
    [key: string]: unknown;
    id: string;
    row_version: string;
    code: string;
    name: string;
    title: string;
    sort_order: number;
    is_enabled: boolean;
    difficulty_levels: number[];
    course_count: number;
    updated_by_name: string;
    updated_at: string;
}
export interface AcademyCourse extends AcademyRow {
    category_ids: string[];
    categories: {
        id: string;
        name: string;
    }[];
    summary: string | null;
    body_html: string;
    seo_description: string | null;
    cover_url: string | null;
    difficulty_level: number | null;
    estimated_minutes: number | null;
    publish_status: 'draft' | 'scheduled' | 'published';
    scheduled_at: string | null;
    published_at: string | null;
}
export interface AcademyMetadata {
    cms_source_options?: {
        value: string;
        label: string;
    }[];
    source_locale: string;
    enabled_locales: string[];
    categories: Pick<AcademyRow, 'id' | 'name' | 'is_enabled' | 'difficulty_levels'>[];
}
export declare function useAcademyApi(): {
    getAcademyMetadata: (signal?: AbortSignal, scope?: {
        space_id?: string;
        cms_source_type?: string;
        cms_tenant_id?: string;
    }) => Promise<AcademyMetadata>;
    getAcademyList: <T = AcademyRow>(kind: AcademyKind, params: Record<string, unknown>, signal?: AbortSignal) => Promise<{
        lists: T[];
        count: number;
    }>;
    getAcademyDetail: <T = AcademyRow>(kind: AcademyKind, id: string, signal?: AbortSignal) => Promise<T>;
    saveAcademy: <T = AcademyRow>(kind: AcademyKind, params: Record<string, unknown>) => Promise<T>;
    uploadAcademyCover: (file: File, signal?: AbortSignal) => Promise<{
        url: string;
    }>;
    deleteAcademyCourse: (params: Pick<AcademyRow, "id" | "row_version">) => Promise<{
        id: string;
    }>;
    deleteAcademyCategory: (params: Pick<AcademyRow, "id" | "row_version">) => Promise<{
        id: string;
    }>;
    academyDifficulties: {
        label: string;
        value: number;
    }[];
    academyPublishStates: {
        label: string;
        value: string;
    }[];
    academyError: (error: unknown) => string;
};
