type __VLS_Props = {
    canIncrease: boolean;
    canDecrease: boolean;
    canResetPassword: boolean;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    increase: () => any;
    decrease: () => any;
    "reset-password": () => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onIncrease?: (() => any) | undefined;
    onDecrease?: (() => any) | undefined;
    "onReset-password"?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
