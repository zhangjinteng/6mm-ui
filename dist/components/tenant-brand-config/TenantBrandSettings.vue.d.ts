import { TenantBrandSettingsProps } from './model';
declare const __VLS_export: import('vue').DefineComponent<TenantBrandSettingsProps, {
    hasUnsavedChanges: import('vue').ComputedRef<boolean>;
    isSaving: import('vue').ComputedRef<boolean>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => any;
    saved: () => any;
}, string, import('vue').PublicProps, Readonly<TenantBrandSettingsProps> & Readonly<{
    onClose?: (() => any) | undefined;
    onSaved?: (() => any) | undefined;
}>, {
    canEdit: boolean;
    fullPage: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
