import { SeoCopy, SeoTranslationContext, SeoTranslationCallbacks } from './model';
type __VLS_Props = {
    siteId: string;
    callbacks: SeoTranslationCallbacks;
    locales: {
        value: string;
        label: string;
    }[];
    translations: Record<string, SeoCopy>;
    editingLocale: string;
    readonly: boolean;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => any;
    apply: (value: {
        translations: Record<string, SeoCopy>;
    }) => any;
    "context-change": (value: SeoTranslationContext) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClose?: (() => any) | undefined;
    onApply?: ((value: {
        translations: Record<string, SeoCopy>;
    }) => any) | undefined;
    "onContext-change"?: ((value: SeoTranslationContext) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
