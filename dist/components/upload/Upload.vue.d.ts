import { UploadFile, UploadProps } from './types';
declare function open(): void;
declare function abort(uid?: string): void;
declare function submit(): void;
declare function clearFiles(): void;
declare var __VLS_1: {
    open: typeof open;
    files: {
        error?: string | undefined;
        name: string;
        percentage: number;
        raw?: {
            readonly lastModified: number;
            readonly name: string;
            readonly webkitRelativePath: string;
            readonly size: number;
            readonly type: string;
            arrayBuffer: () => Promise<ArrayBuffer>;
            bytes: () => Promise<Uint8Array<ArrayBuffer>>;
            slice: (start?: number, end?: number, contentType?: string) => Blob;
            stream: () => ReadableStream<Uint8Array<ArrayBuffer>>;
            text: () => Promise<string>;
        } | undefined;
        response?: unknown;
        size: number;
        status: import('./types').UploadStatus;
        type?: string | undefined;
        uid: string;
        url?: string | undefined;
    }[];
};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import('vue').DefineComponent<UploadProps, {
    abort: typeof abort;
    clearFiles: typeof clearFiles;
    open: typeof open;
    submit: typeof submit;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    progress: (file: UploadFile, percentage: number) => any;
    success: (file: UploadFile, response: unknown) => any;
    error: (file: UploadFile, error: Error) => any;
    change: (files: UploadFile[]) => any;
    "update:modelValue": (files: UploadFile[]) => any;
    abort: (file: UploadFile) => any;
    exceed: (files: File[], currentFiles: UploadFile[]) => any;
    remove: (file: UploadFile) => any;
}, string, import('vue').PublicProps, Readonly<UploadProps> & Readonly<{
    onProgress?: ((file: UploadFile, percentage: number) => any) | undefined;
    onSuccess?: ((file: UploadFile, response: unknown) => any) | undefined;
    onError?: ((file: UploadFile, error: Error) => any) | undefined;
    onChange?: ((files: UploadFile[]) => any) | undefined;
    "onUpdate:modelValue"?: ((files: UploadFile[]) => any) | undefined;
    onAbort?: ((file: UploadFile) => any) | undefined;
    onExceed?: ((files: File[], currentFiles: UploadFile[]) => any) | undefined;
    onRemove?: ((file: UploadFile) => any) | undefined;
}>, {
    name: string;
    size: import('../..').FormControlSize;
    status: import('../..').FormControlStatus;
    disabled: boolean;
    modelValue: UploadFile[];
    readonly: boolean;
    drag: boolean;
    multiple: boolean;
    request: import('./types').UploadRequest;
    limit: number;
    accept: string;
    autoUpload: boolean;
    beforeUpload: (file: File) => boolean | void | Promise<boolean | void>;
    directory: boolean;
    maxSize: number;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
