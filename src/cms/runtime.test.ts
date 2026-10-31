import { defineComponent, h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { useCmsRuntime, type CmsRequest, type CmsRuntime } from './runtime'
const requests: CmsRequest[] = []
const Child = defineComponent({ setup() { requests.push(useCmsRuntime().request); return () => h('div', 'CMS child') } })
vi.mock('./views/content/news/categories/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/news/list/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/academy/categories/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/academy/courses/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/help/categories/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/help/articles/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/feedback/list/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/announcement/categories/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/announcement/list/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
vi.mock('./views/content/localization/translations/index.vue', () => ({ default: { setup() { return () => h(Child) } } }))
import MmCmsPage, { type CmsPage } from './MmCmsPage.vue'

function runtime(mode: CmsRuntime['mode'] = 'white_label') {
  const get = vi.fn().mockResolvedValue({ sites: [{ site_id: '1', space_id: '11', label: 'A' }, { site_id: '2', space_id: '22', label: 'B' }] })
  const post = vi.fn().mockResolvedValue({})
  return { mode, request: { get, post }, hasPermission: () => true, formatDateTime: String } as CmsRuntime & { request: { get: typeof get; post: typeof post } }
}
describe('CMS site runtime', () => {
  it.each<CmsPage>([
    'news/categories', 'news/list', 'academy/categories', 'academy/courses',
    'help/categories', 'help/articles', 'feedback/list',
    'announcement/categories', 'announcement/list'
  ])('can hide the site toolbar on %s without dropping space isolation', async page => {
    requests.length = 0
    const adapter = runtime()
    const wrapper = mount(MmCmsPage, { props: { page, runtime: adapter, identityKey: 'session', showSiteSelector: false } })
    await flushPromises()
    expect(wrapper.find('.mm-cms-site').exists()).toBe(false)
    expect(wrapper.find('select').exists()).toBe(false)
    expect(wrapper.text()).toContain('CMS child')
    await requests[0].get({ url: '/cms/test', params: { space_id: 'foreign' } })
    expect(adapter.request.get.mock.calls.at(-1)?.[0].params.space_id).toBe('11')
    wrapper.unmount()
  })
  it('keeps loading and missing-space handling when the site toolbar is hidden', async () => {
    const adapter = runtime()
    adapter.request.get.mockResolvedValue({ sites: [] })
    const wrapper = mount(MmCmsPage, { props: { page: 'news/list', runtime: adapter, identityKey: 'session', showSiteSelector: false } })
    expect(wrapper.get('[role="status"]').text()).toContain('正在加载')
    await flushPromises()
    expect(wrapper.text()).toContain('尚未初始化')
    expect(wrapper.text()).not.toContain('CMS child')
    expect(adapter.request.post).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('pins requests to the selected space and invalidates old page adapters on site change', async () => {
    requests.length = 0
    const adapter = runtime(), wrapper = mount(MmCmsPage, { props: { page: 'news/list', runtime: adapter, identityKey: 'session' } })
    await flushPromises()
    const old = requests[0]
    await old.post({ url: '/cms/news/articles/create', params: { title: 'A', space_id: 'foreign' } })
    expect(adapter.request.post.mock.calls[0][0].params.space_id).toBe('11')
    await wrapper.get('select').setValue('2'); await nextTick()
    expect(() => old.post({ url: '/cms/news/articles/create' })).toThrow('站点已切换')
    await requests[1].get({ url: '/cms/news/articles' })
    expect(adapter.request.get.mock.calls.at(-1)?.[0].params.space_id).toBe('22')
    const current = requests[1]; wrapper.unmount()
    expect(() => current.post({ url: '/cms/news/articles/create' })).toThrow()
  })
  it('does not create content spaces during reads', async () => {
    const adapter = runtime(); adapter.request.get.mockResolvedValue({ sites: [{ site_id: '1', space_id: null, label: 'A' }] })
    const wrapper = mount(MmCmsPage, { props: { page: 'news/list', runtime: adapter, identityKey: 'session' } })
    await flushPromises()
    expect(wrapper.text()).toContain('尚未初始化')
    expect(adapter.request.post).not.toHaveBeenCalled()
    wrapper.unmount()
  })
  it('keeps platform transport unchanged', async () => {
    requests.length = 0
    const adapter = runtime('platform'), wrapper = mount(MmCmsPage, { props: { page: 'news/list', runtime: adapter, identityKey: 'session' } })
    const options = { url: '/cms/news/articles', params: { keyword: 'test' } }
    await requests[0].get(options)
    expect(adapter.request.get).toHaveBeenCalledWith(options, undefined)
    expect(wrapper.find('select').exists()).toBe(false)
    wrapper.unmount()
  })
})
