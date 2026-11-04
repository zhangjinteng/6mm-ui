import { TenantCustomerServiceDetail, TenantCustomerServiceTransport } from './model';
type __VLS_Props = {
    transport: TenantCustomerServiceTransport;
    canEdit?: boolean;
    disabled?: boolean;
};
declare function load(): Promise<void>;
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {
    reload: typeof load;
    isBusy: import('vue').ComputedRef<boolean>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "state-change": (value: TenantCustomerServiceDetail | null) => any;
    "busy-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    "onState-change"?: ((value: TenantCustomerServiceDetail | null) => any) | undefined;
    "onBusy-change"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    canEdit: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
