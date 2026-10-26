declare function confirmLeave(): Promise<boolean>;
declare function refresh(): Promise<void>;
declare const __VLS_export: import('vue').DefineComponent<{}, {
    hasBlockingWork: import('vue').ComputedRef<boolean>;
    confirmLeave: typeof confirmLeave;
    refresh: typeof refresh;
    loading: import('vue').Ref<boolean, boolean>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
