declare function refresh(): Promise<void>;
declare function confirmLeave(): Promise<boolean>;
declare const __VLS_export: import('vue').DefineComponent<{}, {
    confirmLeave: typeof confirmLeave;
    refresh: typeof refresh;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
