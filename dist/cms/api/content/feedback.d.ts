export interface FeedbackAttachment {
    id: string;
    original_name: string | null;
    mime_type: string;
    byte_size: number;
}
export interface FeedbackRow {
    [key: string]: unknown;
    id: string;
    code: string;
    home_site_id: string;
    public_user_id_snapshot: string;
    username_snapshot: string | null;
    nickname_snapshot: string | null;
    source_type: 'merchant' | 'white_label' | 'platform';
    source_agent_id: string | null;
    source_name_snapshot: string | null;
    scene_name_snapshot: string;
    issue_category_name_snapshot: string;
    content: string;
    contact_display: string;
    submitted_at: string;
    attachments?: FeedbackAttachment[];
}
export interface FeedbackMetadata {
    cms_source_options?: {
        value: string;
        label: string;
    }[];
    scenes: {
        id: string;
        name: string;
    }[];
    issues: {
        id: string;
        scene_id: string;
        name: string;
    }[];
}
export declare function useFeedbackApi(): {
    getFeedbackList: (params: Record<string, unknown>, signal?: AbortSignal) => Promise<{
        lists: FeedbackRow[];
        count: number;
    }>;
    getFeedbackMetadata: (signal?: AbortSignal, scope?: {
        space_id?: string;
        cms_source_type?: string;
        cms_tenant_id?: string;
    }) => Promise<FeedbackMetadata>;
    getFeedbackDetail: (id: string, signal?: AbortSignal) => Promise<FeedbackRow>;
    getFeedbackAttachment: (id: string, attachment_id: string, signal?: AbortSignal) => Promise<{
        data_url: string;
    }>;
    feedbackSourceTypes: {
        label: string;
        value: string;
    }[];
    feedbackSourceLabel: (type: string) => string;
    feedbackError: (error: unknown) => string;
};
