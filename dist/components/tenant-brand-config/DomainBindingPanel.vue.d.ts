import { DomainBindingRequest } from './model';
type __VLS_Props = {
    siteId: string;
    request: DomainBindingRequest;
    editable: boolean;
    disabled: boolean;
    english: boolean;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    updated: (names: string[]) => any;
    publication: () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onUpdated?: ((names: string[]) => any) | undefined;
    onPublication?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
