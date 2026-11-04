import { TenantFeatureSettingsProps } from './model';
declare const __VLS_export: import('vue').DefineComponent<TenantFeatureSettingsProps, {
    hasUnsavedChanges: import('vue').ComputedRef<boolean>;
    isSaving: import('vue').Ref<boolean, boolean>;
    isBusy: import('vue').ComputedRef<boolean>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => any;
    saved: () => any;
}, string, import('vue').PublicProps, Readonly<TenantFeatureSettingsProps> & Readonly<{
    onClose?: (() => any) | undefined;
    onSaved?: (() => any) | undefined;
}>, {
    canEdit: boolean;
    fullPage: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
