export type UploadStatus = 'fail' | 'ready' | 'success' | 'uploading';
export interface UploadFile {
    error?: string;
    name: string;
    percentage: number;
    raw?: File;
    response?: unknown;
    size: number;
    status: UploadStatus;
    type?: string;
    uid: string;
    url?: string;
}
export interface UploadRequestOptions {
    file: File;
    onProgress: (percentage: number) => void;
    signal: AbortSignal;
}
export interface UploadRequestTask {
    abort?: () => void;
    promise: Promise<unknown>;
}
export type UploadRequest = (options: UploadRequestOptions) => Promise<unknown> | UploadRequestTask;
export interface UploadProps {
    accept?: string;
    autoUpload?: boolean;
    beforeUpload?: (file: File) => boolean | void | Promise<boolean | void>;
    directory?: boolean;
    disabled?: boolean;
    drag?: boolean;
    id?: string;
    limit?: number;
    maxSize?: number;
    modelValue?: UploadFile[];
    multiple?: boolean;
    name?: string;
    readonly?: boolean;
    request?: UploadRequest;
    size?: import('../../shared/form').FormControlSize;
    status?: import('../../shared/form').FormControlStatus;
}
export interface UploadExpose {
    abort: (uid?: string) => void;
    clearFiles: () => void;
    open: () => void;
    submit: () => void;
}
