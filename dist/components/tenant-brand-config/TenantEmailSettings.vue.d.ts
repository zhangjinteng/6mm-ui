import { TenantEmailAdapter, TenantEmailConfig } from './model';
type __VLS_Props = {
    siteId: string;
    adapter: TenantEmailAdapter;
    canEdit?: boolean;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    state: (value: {
        dirty: boolean;
        busy: boolean;
    }) => any;
    saved: (detail: TenantEmailConfig) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onState?: ((value: {
        dirty: boolean;
        busy: boolean;
    }) => any) | undefined;
    onSaved?: ((detail: TenantEmailConfig) => any) | undefined;
}>, {
    canEdit: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
