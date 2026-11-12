import { TranslationSettings, TranslationSettingsActions } from './types';
type __VLS_Props = {
    modelValue: boolean;
    actions: TranslationSettingsActions;
    locales?: {
        label: string;
        value: string;
    }[];
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (args_0: boolean) => any;
    busy: (args_0: boolean) => any;
    saved: (args_0: TranslationSettings) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onUpdate:modelValue"?: ((args_0: boolean) => any) | undefined;
    onBusy?: ((args_0: boolean) => any) | undefined;
    onSaved?: ((args_0: TranslationSettings) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
