import { SymbolTagTranslationActions } from './types';
type __VLS_Props = {
    actions: SymbolTagTranslationActions;
    draftMode?: boolean;
    initialValues?: Record<string, string>;
    locale?: string;
    modelValue: boolean;
    showGoogleSettings?: boolean;
    tagId?: number;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
    apply: (translations: Record<string, string>) => any;
    "open-settings": () => any;
    saved: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
    onApply?: ((translations: Record<string, string>) => any) | undefined;
    "onOpen-settings"?: (() => any) | undefined;
    onSaved?: (() => any) | undefined;
}>, {
    locale: string;
    draftMode: boolean;
    initialValues: Record<string, string>;
    showGoogleSettings: boolean;
    tagId: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
