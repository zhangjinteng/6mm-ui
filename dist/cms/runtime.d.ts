import { InjectionKey } from 'vue';
export interface CmsRequest {
    get<T = unknown>(options: Record<string, any>, config?: Record<string, any>): Promise<T>;
    post<T = unknown>(options: Record<string, any>, config?: Record<string, any>): Promise<T>;
}
export interface CmsRuntime {
    request: CmsRequest;
    hasPermission: (permissions: string[]) => boolean;
    formatDateTime: (value: unknown) => string;
    mode: 'platform' | 'white_label';
    registerBeforeLeave?: (guard: () => boolean | Promise<boolean>) => void;
}
export declare const cmsRuntimeKey: InjectionKey<CmsRuntime>;
export declare function useCmsRuntime(): CmsRuntime;
export declare function onBeforeCmsLeave(guard: () => boolean | Promise<boolean>): void;
