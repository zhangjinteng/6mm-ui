import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TagDialog from '../symbol-tag-manager/TagTranslationDialog.vue'
import Fields from './MultilingualFields.vue'

const detail = { tag_id: 1, tag_name: '热门', total: 3, configured_count: 2, languages: [
  { locale: 'zh-CN', label: '中文', label_en: 'Chinese', value: '热门' },
  { locale: 'en', label: '英文', label_en: 'English', value: 'Hot' },
  { locale: 'ja', label: '日文', label_en: 'Japanese', value: '' },
] }
const button = (w: ReturnType<typeof mount>, label: string) => w.findAll('button').find(item => item.text().includes(label))!
describe('tag adapter for the shared editor', () => {
  it('uses the shared settings-2 icon and vertically aligned translation settings label', async () => {
    const actions = { load: vi.fn(async () => detail), translate: vi.fn(), save: vi.fn() }
    const wrapper = mount(TagDialog, { props: { modelValue: true, tagId: 1, actions }, global: { stubs: { teleport: true } } })
    await flushPromises()
    const settings = wrapper.get('button.mm-tag-translation__settings')
    expect(settings.text()).toBe('翻译设置')
    expect(settings.get('svg path').attributes('d')).toBe('M20 7h-9M14 17H5')
    expect(settings.findAll('svg circle').map(node => node.attributes('r'))).toEqual(['3', '3'])
    expect(settings.get('svg').element.style.height).toBe('15px')
    const labelStyle = getComputedStyle(settings.get('.mm-button__label').element)
    expect(labelStyle.display).toBe('inline-flex')
    expect(labelStyle.alignItems).toBe('center')
    await settings.trigger('click')
    expect(wrapper.emitted('open-settings')).toHaveLength(1)
    await wrapper.setProps({ locale: 'en' })
    await flushPromises()
    expect(wrapper.get('button.mm-tag-translation__settings').text()).toBe('Translation settings')
    await wrapper.setProps({ showGoogleSettings: false })
    expect(wrapper.find('button.mm-tag-translation__settings').exists()).toBe(false)
    wrapper.unmount()
  })

  it('uses common fields and keeps translations in the draft until applied', async () => {
    const actions = { load: vi.fn(async () => detail), translate: vi.fn(async (_id: number, _input: { target_locales: string[] }) => ({ translations: { ja: '人気' }, failures: {} })), save: vi.fn() }
    const wrapper = mount(TagDialog, { props: { modelValue: true, tagId: 1, actions, draftMode: true,
      initialValues: { 'zh-CN': '热门', en: 'Existing English', ja: '' } }, global: { stubs: { teleport: true } } })
    await flushPromises()
    expect(wrapper.findComponent(Fields).exists()).toBe(true)
    await button(wrapper, 'Google 一键翻译').trigger('click'); await flushPromises()
    expect(actions.translate.mock.calls[0]![1].target_locales).toEqual(['ja'])
    expect(actions.save).not.toHaveBeenCalled()
    await button(wrapper, '应用到表单').trigger('click')
    expect(wrapper.emitted('apply')?.[0][0]).toEqual({ 'zh-CN': '热门', en: 'Existing English', ja: '人気' })
    wrapper.unmount()
  })

  it('ignores a late translation after a different tag is opened', async () => {
    let finish!: (value: { translations: Record<string, string>; failures: Record<string, string> }) => void
    const actions = { load: vi.fn(async () => detail), translate: vi.fn(() => new Promise<any>(resolve => { finish = resolve })), save: vi.fn() }
    const wrapper = mount(TagDialog, { props: { modelValue: true, tagId: 1, actions }, global: { stubs: { teleport: true } } })
    await flushPromises(); await button(wrapper, 'Google 一键翻译').trigger('click')
    await wrapper.setProps({ modelValue: false }); await wrapper.setProps({ modelValue: true, tagId: 2 }); await flushPromises()
    finish({ translations: { ja: 'Wrong tag' }, failures: {} }); await flushPromises()
    expect(wrapper.get<HTMLInputElement>('input[aria-label="ja 标签名称"]').element.value).toBe('')
    expect(button(wrapper, 'Google 一键翻译').attributes('disabled')).toBeUndefined()
    wrapper.unmount()
  })
})
