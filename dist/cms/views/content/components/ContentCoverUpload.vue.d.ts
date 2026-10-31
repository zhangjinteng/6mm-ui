type __VLS_Props = {
    modelValue: string;
    label?: string;
    disabled?: boolean;
    upload: (file: File, signal: AbortSignal) => Promise<{
        url: string;
    }>;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    error: (error: unknown) => any;
    success: () => any;
    "update:modelValue": (value: string) => any;
    start: () => any;
    "busy-change": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onError?: ((error: unknown) => any) | undefined;
    onSuccess?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    onStart?: (() => any) | undefined;
    "onBusy-change"?: ((value: boolean) => any) | undefined;
}>, {
    disabled: boolean;
    label: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
