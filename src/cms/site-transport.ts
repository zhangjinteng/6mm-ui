import type { CmsRequest, CmsRuntime, CmsSiteContext } from './runtime'

/** One page/site generation. Initial concurrent reads may bind it once, never retarget it. */
export function createCmsSiteTransport(
  runtime: CmsRuntime,
  onContext: (context: CmsSiteContext) => void,
  initialSpace?: string | null,
) {
  let active = true
  let space = initialSpace
  const check = () => { if (!active) throw new Error('站点已切换，请重新操作') }
  function scoped(options: Record<string, any>, write: boolean) {
    check()
    if (write && !space) throw new Error('请选择已初始化的站点')
    if (space === null) throw new Error('该站点尚未初始化内容空间')
    if (options.data instanceof FormData) {
      const data = new FormData()
      options.data.forEach((value: any, key: string) => data.append(key, value))
      if (space) data.set('space_id', space)
      return { ...options, data }
    }
    const params = { ...options.params }
    if (space) params.space_id = space
    else delete params.space_id
    return { ...options, params }
  }
  function received<T>(result: T, options: Record<string, any>, write: boolean): T {
    check()
    if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError')
    const context = (result as { cms_context?: CmsSiteContext })?.cms_context
    if (!context) {
      if (!write && space === undefined) throw new Error('内容接口未返回站点信息，请刷新或更新服务')
      return result
    }
    if (space !== undefined && context.space_id !== space) throw new Error('站点已切换，请重新操作')
    space = context.space_id
    onContext(context)
    return result
  }
  const request: CmsRequest = {
    get<T>(options: Record<string, any>, config?: Record<string, any>) {
      return runtime.request.get<T>(scoped(options, false), config).then(result => received(result, options, false))
    },
    post<T>(options: Record<string, any>, config?: Record<string, any>) {
      return runtime.request.post<T>(scoped(options, true), config).then(result => received(result, options, true))
    },
  }
  return { request, invalidate: () => { active = false } }
}
