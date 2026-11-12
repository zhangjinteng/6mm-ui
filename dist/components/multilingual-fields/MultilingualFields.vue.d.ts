export interface TranslationField {
    key: string;
    label: string;
    maxLength: number;
    multiline?: boolean;
}
type __VLS_Props = {
    locales: {
        value: string;
        label: string;
        placeholder?: string;
    }[];
    fields: TranslationField[];
    values: Record<string, object | undefined>;
    errors?: Record<string, Record<string, string | undefined> | undefined>;
    sourceLocale?: string;
    disabled?: boolean;
    emptyText?: string;
    locale?: string;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    edit: (locale: string, field: string, value: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onEdit?: ((locale: string, field: string, value: string) => any) | undefined;
}>, {
    disabled: boolean;
    emptyText: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
