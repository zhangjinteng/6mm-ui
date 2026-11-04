type __VLS_Props = {
    modelValue: string;
    label?: string;
    disabled?: boolean;
    upload: (file: File, signal: AbortSignal) => Promise<{
        url: string;
    }>;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    success: () => any;
    error: (error: unknown) => any;
    "update:modelValue": (value: string) => any;
    start: () => any;
    "busy-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSuccess?: (() => any) | undefined;
    onError?: ((error: unknown) => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onStart?: (() => any) | undefined;
    "onBusy-change"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    label: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
