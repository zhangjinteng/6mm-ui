export interface CourseForm {
    title: string;
    category_ids: string[];
    summary: string;
    body_html: string;
    cover_url: string;
    seo_description: string;
    difficulty_level: number | '';
    estimated_minutes: number | null;
    sort_order: number | null;
    is_enabled: boolean;
    scheduled_local: string;
}
export type CourseField = keyof CourseForm;
export type CourseErrors = Partial<Record<CourseField, string>>;
export declare const courseFields: CourseField[];
interface Category {
    id: string;
    is_enabled: boolean;
    difficulty_levels: number[];
}
export declare function validateCourse(form: CourseForm, categories: Category[], status: 'draft' | 'published' | 'scheduled', now?: number): CourseErrors;
export declare function courseFieldErrors(error: unknown): {
    fields: CourseErrors;
    general: string;
};
export {};
