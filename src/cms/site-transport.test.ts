import { describe, expect, it, vi } from 'vitest'
import { createCmsSiteTransport } from './site-transport'
import type { CmsRuntime, CmsSiteContext } from './runtime'

const context = (space = '11'): CmsSiteContext => ({
  sites: [{ site_id: '1', space_id: '11', label: 'A' }, { site_id: '2', space_id: '22', label: 'B' }],
  site_id: space === '11' ? '1' : '2', space_id: space,
})
function runtime() {
  return { mode: 'white_label', hasPermission: () => true, formatDateTime: String,
    request: { get: vi.fn().mockResolvedValue({ lists: [], count: 0, cms_context: context() }), post: vi.fn().mockResolvedValue({}) },
  } as CmsRuntime & { request: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> } }
}
describe('combined CMS data/site transport', () => {
  it('sends the initial business request directly, then pins writes and upload scope', async () => {
    const adapter = runtime(), adopt = vi.fn(), scope = createCmsSiteTransport(adapter, adopt)
    expect(() => scope.request.post({ url: '/cms/news/articles/create' })).toThrow('已初始化')
    await scope.request.get({ url: '/cms/news/articles', params: { page_no: 1, space_id: 'foreign' } })
    expect(adapter.request.get).toHaveBeenCalledExactlyOnceWith({ url: '/cms/news/articles', params: { page_no: 1 } }, undefined)
    expect(adopt).toHaveBeenCalledWith(context())
    await scope.request.post({ url: '/cms/news/articles/create', params: { space_id: 'foreign', title: 'A' } })
    expect(adapter.request.post.mock.calls.at(-1)?.[0].params.space_id).toBe('11')
    const data = new FormData(); data.set('space_id', 'foreign'); data.set('file', 'sample')
    await scope.request.post({ url: '/cms/news/upload', data })
    expect(adapter.request.post.mock.calls.at(-1)?.[0].data.get('space_id')).toBe('11')
    expect(data.get('space_id')).toBe('foreign')
  })
  it('accepts concurrent metadata/list responses for one site and rejects a mismatching site', async () => {
    const adapter = runtime(), scope = createCmsSiteTransport(adapter, vi.fn())
    await Promise.all([scope.request.get({ url: '/cms/news/metadata' }), scope.request.get({ url: '/cms/news/articles' })])
    adapter.request.get.mockResolvedValueOnce({ cms_context: context('22') })
    await expect(scope.request.get({ url: '/cms/news/articles' })).rejects.toThrow('站点已切换')
    await scope.request.post({ url: '/cms/news/articles/create' })
    expect(adapter.request.post.mock.calls.at(-1)?.[0].params.space_id).toBe('11')
  })
  it('ignores late responses and rejects old adapters after a site/session change', async () => {
    const adapter = runtime(), adopt = vi.fn()
    let resolve!: (value: unknown) => void
    adapter.request.get.mockReturnValueOnce(new Promise(value => { resolve = value }))
    const scope = createCmsSiteTransport(adapter, adopt)
    const pending = scope.request.get({ url: '/cms/news/articles' })
    scope.invalidate(); resolve({ cms_context: context() })
    await expect(pending).rejects.toThrow('站点已切换')
    expect(adopt).not.toHaveBeenCalled()
    expect(() => scope.request.get({ url: '/cms/news/articles' })).toThrow('站点已切换')
  })
  it('does not adopt an aborted response or silently accept an old backend without context', async () => {
    const adapter = runtime(), adopt = vi.fn(), scope = createCmsSiteTransport(adapter, adopt)
    const controller = new AbortController(); controller.abort()
    await expect(scope.request.get({ url: '/cms/news/articles', signal: controller.signal })).rejects.toThrow('Aborted')
    expect(adopt).not.toHaveBeenCalled()
    adapter.request.get.mockResolvedValueOnce({ lists: [], count: 0 })
    await expect(scope.request.get({ url: '/cms/news/articles' })).rejects.toThrow('未返回站点信息')
  })
})
