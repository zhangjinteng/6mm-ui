import { TenantSeoSettingsProps } from './model';
declare function requestClose(): void;
declare const __VLS_export: import('vue').DefineComponent<TenantSeoSettingsProps, {
    hasUnsavedChanges: import('vue').ComputedRef<boolean>;
    isSaving: import('vue').ComputedRef<boolean>;
    isBusy: import('vue').ComputedRef<boolean>;
    requestClose: typeof requestClose;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    close: () => any;
    saved: () => any;
}, string, import('vue').PublicProps, Readonly<TenantSeoSettingsProps> & Readonly<{
    onClose?: (() => any) | undefined;
    onSaved?: (() => any) | undefined;
}>, {
    canEdit: boolean;
    fullPage: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
