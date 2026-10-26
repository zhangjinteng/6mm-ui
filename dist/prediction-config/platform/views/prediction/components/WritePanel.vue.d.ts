type __VLS_Props = {
    action: string;
    target: string;
    permission: string;
    hideButton?: boolean;
    hideSuccess?: boolean;
    hidePendingDetails?: boolean;
    hideError?: boolean;
    label?: string;
    automaticReason?: string;
    disabled?: boolean;
    blocked?: boolean;
    newAllowed?: boolean;
    payload: () => Record<string, unknown>;
    send: (p: Record<string, unknown>) => Promise<unknown>;
};
declare function submit(): Promise<void>;
declare function clearFeedback(): void;
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {
    submit: typeof submit;
    success: import('vue').Ref<string, string>;
    error: import('vue').Ref<string, string>;
    clearFeedback: typeof clearFeedback;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    success: (response: unknown) => any;
    busy: (value: boolean) => any;
    pending: (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSuccess?: ((response: unknown) => any) | undefined;
    onBusy?: ((value: boolean) => any) | undefined;
    onPending?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    label: string;
    blocked: boolean;
    newAllowed: boolean;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
