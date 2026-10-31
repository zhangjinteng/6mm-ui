import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { cmsRuntimeKey, type CmsRuntime } from './runtime'

vi.mock('../index', () => {
  const control = defineComponent({ inheritAttrs: false, setup: (_, ctx) => () => h('div', ctx.attrs, [ctx.slots.default?.(), ctx.slots.footer?.()]) })
  const button = defineComponent({ inheritAttrs: false, setup: (_, ctx) => () => h('button', ctx.attrs, ctx.slots.default?.()) })
  return { ...Object.fromEntries(['MmButton', 'MmIcon', 'MmAlert', 'MmForm', 'MmFormItem', 'MmInput', 'MmInputNumber', 'MmSelect', 'MmCheckbox', 'MmDialog', 'MmRichTextEditor'].map(key => [key, key === 'MmButton' ? button : control])), message: { success: vi.fn() } }
})
vi.mock('./views/content/components/ContentCoverUpload.vue', () => ({ default: defineComponent({ render: () => h('div') }) }))
import NewsEditor from './views/content/news/list/ArticleEditor.vue'
import HelpEditor from './views/content/help/articles/ArticleEditor.vue'
import AnnouncementEditor from './views/content/announcement/list/ArticleEditor.vue'
import CourseEditor from './views/content/academy/courses/CourseEditor.vue'

const modules = [
  ['news', NewsEditor, 'articleId'], ['help', HelpEditor, 'articleId'],
  ['announcement', AnnouncementEditor, 'articleId'], ['academy', CourseEditor, 'courseId'],
] as const

describe.each(modules)('%s shared white-label editor', (module, Editor, idProp) => {
  function editor(grants: string[], existing = false, status = 'draft') {
    const runtime: CmsRuntime = {
      mode: 'white_label', hasPermission: required => required.some(value => grants.includes(value)),
      formatDateTime: String, registerBeforeLeave: () => {},
      request: {
        async get<T>(options: Record<string, any>): Promise<T> {
          return (options.url.endsWith('/metadata') ? { categories: [{ id: '7', name: 'Category', is_enabled: true, effective_enabled: true, difficulty_levels: [1, 2, 3] }], source_locale: 'zh-CN' } : {
            id: '1', space_id: '11', row_version: '1', title: 'Draft', category_ids: [], difficulty_level: 1,
            category_id: null, sort_order: 0, is_enabled: true, body_html: '<p>Body</p>', publish_status: status,
          }) as T
        },
        post: vi.fn().mockResolvedValue({}),
      },
    }
    const wrapper = mount(Editor, { props: existing ? { [idProp]: '1' } : {}, global: { provide: { [cmsRuntimeKey as symbol]: runtime } } })
    return Object.assign(wrapper, { post: runtime.request.post })
  }
  const buttons = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('button').map(button => button.text())
  it('list-only permission does not expose save/delete/publication controls', async () => {
    const wrapper = editor([`cms_${module}:lists`], true)
    await flushPromises()
    expect(buttons(wrapper).some(label => /保存草稿|发布|删除(?:新闻|文章|公告|课程)/.test(label))).toBe(false)
    wrapper.unmount()
  })
  it('creation grant exposes draft saving, not publication', async () => {
    const wrapper = editor([`cms_${module}:add`])
    await flushPromises()
    expect(buttons(wrapper)).toContain('保存草稿')
    expect(buttons(wrapper).some(label => /^发布|^定时发布/.test(label))).toBe(false)
    wrapper.unmount()
  })
  it('edit/delete/publish grants expose the corresponding controls', async () => {
    const wrapper = editor(['edit', 'delete', 'publish'].map(action => `cms_${module}:${action}`), true)
    await flushPromises()
    expect(buttons(wrapper)).toContain('保存草稿')
    expect(buttons(wrapper).some(label => /^发布/.test(label))).toBe(true)
    expect(buttons(wrapper).some(label => /^删除/.test(label))).toBe(true)
    wrapper.unmount()
  })
  it('editing published content still requires publication permission', async () => {
    const wrapper = editor(['edit', 'delete'].map(action => `cms_${module}:${action}`), true, 'published')
    await flushPromises()
    expect(buttons(wrapper).some(label => /保存草稿|发布|删除(?:新闻|文章|公告|课程)/.test(label))).toBe(false)
    wrapper.unmount()
  })
  it.each(['draft', 'published', 'scheduled'] as const)('sends %s through the shared save API with UTC schedule and version', async status => {
    const wrapper = editor(['edit', 'publish'].map(action => `cms_${module}:${action}`), true)
    await flushPromises()
    const setup = (wrapper.vm as any).$.setupState
    Object.assign(setup.form, { title: 'Ready', body_html: '<p>Ready body</p>', category_id: '7', category_ids: ['7'],
      difficulty_level: 1, estimated_minutes: 10, scheduled_local: status === 'scheduled' ? '2099-01-01T12:00' : '' })
    await setup.save(status)
    expect(wrapper.post).toHaveBeenCalledWith(expect.objectContaining({
      url: `/cms/${module}/${module === 'academy' ? 'courses' : 'articles'}/edit`,
      params: expect.objectContaining({ id: '1', row_version: '1', publish_status: status,
        scheduled_at: status === 'scheduled' ? new Date('2099-01-01T12:00').toISOString() : null }),
    }), { isOpenRetry: false })
    expect(wrapper.emitted('saved')).toHaveLength(1)
    wrapper.unmount()
  })
  it('deletes through the shared API with an optimistic version, and refuses a read-only deletion', async () => {
    for (const allowed of [false, true]) {
      const wrapper = editor(allowed ? [`cms_${module}:delete`] : [], true)
      await flushPromises()
      const setup = (wrapper.vm as any).$.setupState
      await setup[module === 'academy' ? 'removeCourse' : 'removeArticle']()
      if (allowed) expect(wrapper.post).toHaveBeenCalledWith({
        url: `/cms/${module}/${module === 'academy' ? 'courses' : 'articles'}/delete`, params: { id: '1', row_version: '1' },
      }, { isOpenRetry: false })
      else expect(wrapper.post).not.toHaveBeenCalled()
      wrapper.unmount()
    }
  })
})
