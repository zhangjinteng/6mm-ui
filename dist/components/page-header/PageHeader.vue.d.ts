import { PageHeaderProps } from './types';
declare var __VLS_1: {}, __VLS_13: {}, __VLS_15: {}, __VLS_17: {}, __VLS_19: {};
type __VLS_Slots = {} & {
    breadcrumb?: (props: typeof __VLS_1) => any;
} & {
    title?: (props: typeof __VLS_13) => any;
} & {
    subtitle?: (props: typeof __VLS_15) => any;
} & {
    extra?: (props: typeof __VLS_17) => any;
} & {
    default?: (props: typeof __VLS_19) => any;
};
declare const __VLS_base: import('vue').DefineComponent<PageHeaderProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    back: () => any;
}, string, import('vue').PublicProps, Readonly<PageHeaderProps> & Readonly<{
    onBack?: (() => any) | undefined;
}>, {
    subtitle: string;
    breadcrumbs: import('./types').PageHeaderBreadcrumb[];
    showBack: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
