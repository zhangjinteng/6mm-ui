import { Ref } from 'vue';
import { ArticleForm, ArticleModule } from './articleValidation';
export declare function useArticleValidation(form: ArticleForm, categories: () => {
    id: string;
    effective_enabled: boolean;
}[], module: ArticleModule, seoOpen: Ref<boolean>): {
    editorRoot: Ref<HTMLElement | undefined, HTMLElement | undefined>;
    seoInput: Ref<HTMLTextAreaElement | undefined, HTMLTextAreaElement | undefined>;
    fieldRules: {
        [k: string]: {
            required: boolean;
            trigger: "submit";
        };
    };
    fieldErrors: import('vue').ComputedRef<Partial<Record<keyof ArticleForm, string>>>;
    pendingCount: import('vue').ComputedRef<number>;
    saveError: Ref<string, string>;
    validateSave: (status: "draft" | "published" | "scheduled") => Promise<boolean>;
    setSaveFailure: (error: unknown) => void;
    focusFirstError: () => Promise<void>;
    focusSeoError: () => void;
};
