import { CmsRuntime } from './runtime';
type __VLS_Props = {
    page: CmsPage;
    runtime: CmsRuntime;
    identityKey: string;
};
export type CmsPage = 'news/categories' | 'news/list' | 'academy/categories' | 'academy/courses' | 'help/categories' | 'help/articles' | 'feedback/list' | 'announcement/categories' | 'announcement/list' | 'localization/translations';
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
