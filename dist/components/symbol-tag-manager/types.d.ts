export interface SymbolTagRow {
    created_at?: string;
    id: number;
    is_enable: number;
    parent_id: number;
    sort: number;
    symbol_count: number;
    tag_code: string;
    tag_name: string;
    tag_name_en: string;
    tag_name_zh: string;
    updated_at?: string;
}
export interface SymbolTagListQuery {
    is_enable?: number | string;
    keyword?: string;
    parent_id?: number | string;
}
export interface SymbolTagListResult {
    count: number;
    lists: SymbolTagRow[];
    parent_count: number;
}
export interface SymbolTagFormValue {
    is_enable: number;
    parent_id: number;
    sort: number;
    tag_code: string;
    tag_name: string;
    tag_name_en: string;
    tag_name_zh: string;
    translations?: Record<string, string>;
}
export interface SymbolTagActions {
    create: (value: SymbolTagFormValue) => Promise<unknown>;
    list: (query: SymbolTagListQuery) => Promise<SymbolTagListResult>;
    loadOptions: () => Promise<SymbolTagRow[]>;
    remove: (id: number) => Promise<unknown>;
    update: (id: number, value: SymbolTagFormValue) => Promise<unknown>;
}
export interface TranslationConfig {
    api_key_mask: string | null;
    api_key_set: boolean;
    api_version: "v2";
    concurrency: number;
    is_enabled: boolean;
    last_error: string | null;
    provider: "google";
    verified_at: string | null;
    verify_status: "pending" | "valid" | "invalid";
}
export interface TranslationConfigFormValue {
    api_key?: string;
    api_version: "v2";
    concurrency: number;
    is_enabled: boolean;
}
export interface TranslationConfigTestResult {
    last_error: string | null;
    valid: boolean;
    verified_at: string | null;
    verify_status: "valid" | "invalid";
}
export interface TranslationConfigActions {
    load: () => Promise<TranslationConfig>;
    save: (value: TranslationConfigFormValue) => Promise<TranslationConfig>;
    test: (apiKey?: string) => Promise<TranslationConfigTestResult>;
}
export interface SymbolTagTranslationLanguage {
    label: string;
    label_en: string;
    locale: string;
    value: string;
}
export interface SymbolTagTranslationDetail {
    configured_count: number;
    languages: SymbolTagTranslationLanguage[];
    tag_id: number;
    tag_name: string;
    total: number;
}
export interface SymbolTagTranslationRequest {
    source_locale: string;
    source_text: string;
    target_locales: string[];
}
export interface SymbolTagTranslationResult {
    failures: Record<string, string>;
    translations: Record<string, string>;
}
export interface SymbolTagTranslationActions {
    load: (tagId: number) => Promise<SymbolTagTranslationDetail>;
    save: (tagId: number, translations: Record<string, string>) => Promise<SymbolTagTranslationDetail>;
    translate: (tagId: number, value: SymbolTagTranslationRequest) => Promise<SymbolTagTranslationResult>;
}
export interface SymbolTagManagerLabels {
    actions: string;
    add: string;
    addChild: string;
    all: string;
    availableActions: string;
    cancel: string;
    childTag: string;
    close: string;
    code: string;
    codeHint: string;
    codePlaceholder: string;
    collapseAll: string;
    collapseTag: string;
    confirm: string;
    delete: string;
    deleteConfirm: string;
    deleteDescription: string;
    deleteTitle: string;
    detail: string;
    dialogCreate: string;
    dialogEdit: string;
    dialogSubtitleCreate: string;
    dialogSubtitleEdit: string;
    disabled: string;
    display: string;
    displayHint: string;
    edit: string;
    editTranslation: string;
    enabled: string;
    enName: string;
    expandAll: string;
    expandTag: string;
    filterSubtitle: string;
    filterTitle: string;
    frontendDisplay: string;
    hideTag: string;
    invalidCode: string;
    loadingDescription: string;
    loadingTitle: string;
    name: string;
    nameHint: string;
    namePlaceholder: string;
    noData: string;
    notice: string;
    pairCount: string;
    pairHint: string;
    parent: string;
    parentFilter: string;
    parentHint: string;
    query: string;
    refresh: string;
    required: string;
    reset: string;
    rootOnly: string;
    rootOption: string;
    rootTag: string;
    save: string;
    searchPlaceholder: string;
    sort: string;
    sortHint: string;
    status: string;
    statusFilter: string;
    showTag: string;
    tableAria: string;
    tagId: string;
    tagInfo: string;
    total: string;
    translation: string;
    translationCount: string;
    updatedAt: string;
    zhName: string;
}
export interface SymbolTagManagerProps {
    actions: SymbolTagActions;
    canCreate?: boolean;
    canDelete?: boolean;
    canUpdate?: boolean;
    labels?: Partial<SymbolTagManagerLabels>;
    locale?: "en-US" | "zh-CN" | string;
    translationConfigActions?: TranslationConfigActions;
    translationActions?: SymbolTagTranslationActions;
}
export type SymbolTagActionName = "create" | "delete" | "list" | "translation-config" | "translations" | "update";
