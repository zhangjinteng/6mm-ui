import { defineComponent, h } from 'vue'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cmsRuntimeKey, type CmsRuntime } from './runtime'

vi.mock('../index', async original => {
  const actual = await original<Record<string, unknown>>()
  return {
    ...actual,
    MmProTable: defineComponent({
      name: 'SourceFilterTestTable',
      props: ['columns', 'queryFields', 'filters', 'data', 'currentPage'],
      emits: ['update:filters', 'update:currentPage', 'query', 'reset'],
      setup: props => () => h('div', JSON.stringify(props.data)),
    }),
  }
})

import NewsCategories from './views/content/news/categories/index.vue'
import NewsList from './views/content/news/list/index.vue'
import AcademyCategories from './views/content/academy/categories/CategoryTable.vue'
import AcademyCourses from './views/content/academy/courses/index.vue'
import HelpCategories from './views/content/help/categories/index.vue'
import HelpArticles from './views/content/help/articles/index.vue'
import FeedbackList from './views/content/feedback/list/index.vue'
import AnnouncementCategories from './views/content/announcement/categories/index.vue'
import AnnouncementList from './views/content/announcement/list/index.vue'

const pages = [
  ['news/categories', NewsCategories], ['news/list', NewsList],
  ['academy/categories', AcademyCategories], ['academy/courses', AcademyCourses],
  ['help/categories', HelpCategories], ['help/articles', HelpArticles],
  ['feedback/list', FeedbackList], ['announcement/categories', AnnouncementCategories],
  ['announcement/list', AnnouncementList],
] as const
const wrappers: VueWrapper[] = []
afterEach(() => wrappers.splice(0).forEach(wrapper => wrapper.unmount()))

function fixture(Component = NewsCategories, mode: CmsRuntime['mode'] = 'platform',
  metadataReply?: (index: number, params: Record<string, any>) => Promise<Record<string, any>>) {
  const owners = [{ value: '10', label: 'Alpha' }, { value: '20', label: 'Beta' }]
  const rows = ['', '10', '20'].map((tenant, index) => ({
    id: String(index + 1), code: `ROW-${index + 1}`, name: `Category ${index + 1}`,
    parent_id: null, is_enabled: true, sort_order: index, publish_status: 'draft',
    cms_source_type: tenant ? 'white_label' : 'platform', cms_tenant_id: tenant,
    cms_source_name: tenant ? owners.find(owner => owner.value === tenant)!.label : 'Admin',
  }))
  const pending = new Map<string, object>()
  let metadataCount = 0
  const get = vi.fn(async (options: Record<string, any>) => {
    const params = { ...options.params }
    const key = JSON.stringify([options.url, params]), token = {}
    pending.set(key, token)
    await Promise.resolve()
    if (pending.get(key) !== token) throw new Error('ERR_CANCELED')
    pending.delete(key)
    if (options.url.endsWith('/metadata')) {
      const defaults = { cms_source_options: owners, source_locale: 'zh-CN', categories: [], scenes: [], issues: [] }
      const extra = metadataReply ? await metadataReply(++metadataCount, params) : (++metadataCount, {})
      return { ...defaults, ...extra }
    }
    const selected = rows.filter(row =>
      (!params.cms_source_type || row.cms_source_type === params.cms_source_type) &&
      (!params.cms_tenant_id || row.cms_tenant_id === params.cms_tenant_id) &&
      (mode !== 'white_label' || row.cms_tenant_id === '10'))
    return { lists: selected, count: selected.length }
  })
  const post = vi.fn().mockRejectedValue(new Error('Read-only fixture'))
  const runtime = { mode, request: { get, post }, hasPermission: () => false, formatDateTime: String } as CmsRuntime
  const wrapper = mount(Component, { global: { provide: { [cmsRuntimeKey as symbol]: runtime } } })
  wrappers.push(wrapper)
  const table = () => wrapper.findComponent({ name: 'SourceFilterTestTable' })
  const listCalls = () => get.mock.calls.map(([options]) => options).filter(options => !options.url.endsWith('/metadata'))
  const metadataCalls = () => get.mock.calls.map(([options]) => options).filter(options => options.url.endsWith('/metadata'))
  const field = (key: string) => table().props('queryFields').find((item: any) => item.key === key)
  const change = async (patch: Record<string, any>) => {
    table().vm.$emit('update:filters', { ...table().props('filters'), ...patch })
    await flushPromises()
  }
  return { wrapper, table, field, get, post, listCalls, metadataCalls, change }
}

describe.each(pages)('%s CMS ownership filters', (_page, Component) => {
  it('keeps ownership columns for platform but removes them entirely for white-label accounts', async () => {
    const platform = fixture(Component, 'platform')
    const whiteLabel = fixture(Component, 'white_label')
    await flushPromises()
    const platformColumns = platform.table().props('columns')
    const whiteLabelColumns = whiteLabel.table().props('columns')
    expect(platformColumns.filter((column: any) => column.key.startsWith('cms_source_'))
      .map((column: any) => column.title)).toEqual(['来源昵称', '来源类型'])
    expect(whiteLabelColumns.some((column: any) => ['cms_source_name', 'cms_source_type'].includes(column.key))).toBe(false)
    expect(whiteLabelColumns.map((column: any) => column.key)).toEqual(
      platformColumns.filter((column: any) => !['cms_source_name', 'cms_source_type'].includes(column.key))
        .map((column: any) => column.key),
    )
    // Presentation changes must not strip ownership data or change the request scope.
    expect(whiteLabel.table().props('data')[0]).toMatchObject({ cms_source_type: 'white_label', cms_tenant_id: '10' })
  })

  it('loads metadata once and submits owner and tenant changes without a search click', async () => {
    const f = fixture(Component)
    await flushPromises()
    expect(f.metadataCalls()).toHaveLength(1)
    expect(f.field('cms_tenant_id').options.map((item: any) => item.value)).toEqual(['', '10', '20'])
    const initialCalls = f.listCalls().length
    await f.change({ cms_source_type: 'white_label' })
    expect(f.listCalls()).toHaveLength(initialCalls + 1)
    expect(f.listCalls().at(-1)!.params.cms_source_type).toBe('white_label')
    expect(f.table().props('data')).toHaveLength(2)
    await f.change({ cms_tenant_id: '10' })
    expect(f.listCalls()).toHaveLength(initialCalls + 2)
    expect(f.listCalls().at(-1)!.params.cms_tenant_id).toBe('10')
    expect(f.table().props('data')).toHaveLength(1)
    await f.change({ cms_source_type: 'platform' })
    expect(f.listCalls()).toHaveLength(initialCalls + 3)
    expect(f.listCalls().at(-1)!.params.cms_tenant_id).toBeUndefined()
    expect(f.field('cms_tenant_id').disabled).toBe(true)
    expect(f.table().props('data')[0].cms_source_type).toBe('platform')
    expect(f.post).not.toHaveBeenCalled()
  })

  it('retains manual keyword queries and submits reset only once', async () => {
    const f = fixture(Component)
    await flushPromises()
    const defaults = { ...f.table().props('filters') }
    const initialCalls = f.listCalls().length
    await f.change({ code: 'ROW' })
    expect(f.listCalls()).toHaveLength(initialCalls)
    f.table().vm.$emit('query', f.table().props('filters'))
    await flushPromises()
    expect(f.listCalls()).toHaveLength(initialCalls + 1)
    await f.change({ cms_source_type: 'white_label', cms_tenant_id: '10' })
    const beforeReset = f.listCalls().length
    f.table().vm.$emit('reset', defaults)
    await flushPromises()
    expect(f.listCalls()).toHaveLength(beforeReset + 1)
    expect(f.listCalls().at(-1)!.params.cms_source_type).toBeUndefined()
    expect(f.table().props('data')).toHaveLength(3)
  })

  it('does not expose cross-owner filters in agent white-label mode', async () => {
    const f = fixture(Component, 'white_label')
    await flushPromises()
    expect(f.field('cms_source_type')).toBeUndefined()
    expect(f.field('cms_tenant_id')).toBeUndefined()
    expect(f.metadataCalls()).toHaveLength(Component === AcademyCategories ? 0 : 1)
    expect(f.listCalls()).toHaveLength(1)
    expect(f.listCalls()[0].params.cms_source_type).toBeUndefined()
    expect(f.table().props('data')).toHaveLength(1)
    expect(f.post).not.toHaveBeenCalled()
  })
})

it('keeps the shared ownership controls and filterable tenant nicknames', async () => {
  const f = fixture()
  await flushPromises()
  expect(f.field('cms_source_type')).toMatchObject({ type: 'segmented', label: '来源类型', width: 200, defaultValue: '' })
  expect(f.field('cms_source_type').options).toEqual([
    { label: '全部', value: '' }, { label: '平台', value: 'platform' }, { label: '白标', value: 'white_label' },
  ])
  expect(f.field('cms_tenant_id')).toMatchObject({ type: 'select', filterable: true, disabled: false })
})

it('clears owner-dependent filters and resets pagination before submitting a scope change', async () => {
  const f = fixture(AcademyCourses)
  await flushPromises()
  f.table().vm.$emit('update:currentPage', 3)
  await flushPromises()
  await f.change({ category_id: 'old-owner-category' })
  const before = f.listCalls().length
  await f.change({ cms_source_type: 'white_label' })
  expect(f.listCalls()).toHaveLength(before + 1)
  expect(f.listCalls().at(-1)!.params).toMatchObject({ cms_source_type: 'white_label', page_no: 1 })
  expect(f.listCalls().at(-1)!.params.category_id).toBeUndefined()
})

it('does not duplicate a manual scope query or a reset from a later page', async () => {
  const f = fixture(AcademyCourses)
  await flushPromises()
  const defaults = { ...f.table().props('filters') }
  const initialCalls = f.listCalls().length
  const selected = { ...defaults, cms_source_type: 'white_label', cms_tenant_id: '10' }
  f.table().vm.$emit('update:filters', selected)
  f.table().vm.$emit('query', selected)
  await flushPromises()
  expect(f.listCalls()).toHaveLength(initialCalls + 1)
  f.table().vm.$emit('update:currentPage', 3)
  await flushPromises()
  const beforeReset = f.listCalls().length
  f.table().vm.$emit('reset', defaults)
  await flushPromises()
  expect(f.listCalls()).toHaveLength(beforeReset + 1)
  expect(f.listCalls().at(-1)!.params.page_no).toBe(1)
})

it('ignores stale metadata, and recovers tenant options after an initial metadata failure', async () => {
  let release!: (value: Record<string, any>) => void
  const f = fixture(NewsCategories, 'platform', index => index === 1
    ? new Promise(resolve => { release = resolve })
    : Promise.resolve({ cms_source_options: [{ value: '30', label: 'Current' }] }))
  await flushPromises()
  await f.change({ cms_source_type: 'white_label' })
  release({ cms_source_options: [{ value: '99', label: 'Stale' }] })
  await flushPromises()
  expect(f.field('cms_tenant_id').options.map((item: any) => item.value)).toEqual(['', '30'])

  const retry = fixture(NewsCategories, 'platform', index => index === 1
    ? Promise.reject(new Error('metadata unavailable')) : Promise.resolve({}))
  await flushPromises()
  expect(retry.field('cms_tenant_id').disabled).toBe(true)
  await retry.change({ cms_source_type: 'white_label' })
  expect(retry.field('cms_tenant_id').disabled).toBe(false)
  expect(retry.field('cms_tenant_id').options).toHaveLength(3)
})

it('coalesces rapid owner changes and never submits a queued query after unmount', async () => {
  const f = fixture()
  await flushPromises()
  const before = f.listCalls().length
  const defaults = f.table().props('filters')
  f.table().vm.$emit('update:filters', { ...defaults, cms_source_type: 'platform' })
  f.table().vm.$emit('update:filters', { ...defaults, cms_source_type: 'white_label', cms_tenant_id: '20' })
  await flushPromises()
  expect(f.listCalls()).toHaveLength(before + 1)
  expect(f.listCalls().at(-1)!.params).toMatchObject({ cms_source_type: 'white_label', cms_tenant_id: '20' })
  const beforeClose = f.listCalls().length
  f.table().vm.$emit('update:filters', { ...defaults, cms_source_type: 'platform' })
  f.wrapper.unmount()
  await flushPromises()
  expect(f.listCalls()).toHaveLength(beforeClose)
})
