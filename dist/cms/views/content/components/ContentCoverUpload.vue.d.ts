import { MediaUploadResult } from '../../../../services/media-upload';
type __VLS_Props = {
    modelValue: string;
    label?: string;
    disabled?: boolean;
    upload: (file: File, signal: AbortSignal) => Promise<MediaUploadResult>;
};
declare const __VLS_export: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    error: (error: unknown) => any;
    success: () => any;
    "update:modelValue": (value: string) => any;
    "busy-change": (value: boolean) => any;
    start: () => any;
    "update:mediaId": (value: string | null) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onError?: ((error: unknown) => any) | undefined;
    onSuccess?: (() => any) | undefined;
    "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    "onBusy-change"?: ((value: boolean) => any) | undefined;
    onStart?: (() => any) | undefined;
    "onUpdate:mediaId"?: ((value: string | null) => any) | undefined;
}>, {
    disabled: boolean;
    label: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
