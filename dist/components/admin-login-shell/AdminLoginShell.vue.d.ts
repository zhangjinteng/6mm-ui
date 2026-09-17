import { AdminLoginPartner, AdminLoginShellProps, AdminLoginShowcaseCard } from './types';
declare var __VLS_1: {}, __VLS_3: {}, __VLS_5: {}, __VLS_7: {};
type __VLS_Slots = {} & {
    tools?: (props: typeof __VLS_1) => any;
} & {
    brand?: (props: typeof __VLS_3) => any;
} & {
    form?: (props: typeof __VLS_5) => any;
} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_base: import('vue').DefineComponent<AdminLoginShellProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<AdminLoginShellProps> & Readonly<{}>, {
    accentColor: string;
    subtitle: string;
    accentRgb: string;
    brandLogo: string;
    brandLogoAlt: string;
    brandTitle: string;
    partnerTrustText: string;
    partners: AdminLoginPartner[];
    showcaseAriaLabel: string;
    showcaseLanes: AdminLoginShowcaseCard[][];
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
