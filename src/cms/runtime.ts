import { inject, type InjectionKey } from 'vue'

export interface CmsRequest {
  get<T = unknown>(options: Record<string, any>, config?: Record<string, any>): Promise<T>
  post<T = unknown>(options: Record<string, any>, config?: Record<string, any>): Promise<T>
}
export interface CmsRuntime {
  request: CmsRequest
  hasPermission: (permissions: string[]) => boolean
  formatDateTime: (value: unknown) => string
  mode: 'platform' | 'white_label'
  registerBeforeLeave?: (guard: () => boolean | Promise<boolean>) => void
}
export const cmsRuntimeKey: InjectionKey<CmsRuntime> = Symbol('MmCms')
export function useCmsRuntime(): CmsRuntime {
  const runtime = inject(cmsRuntimeKey)
  if (!runtime) throw new Error('CMS host adapter is missing')
  return runtime
}
export function onBeforeCmsLeave(guard: () => boolean | Promise<boolean>): void {
  useCmsRuntime().registerBeforeLeave?.(guard)
}
