import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Fields from './MultilingualFields.vue'

describe('shared multilingual fields', () => {
  it('supports names and SEO fields without owning storage', async () => {
    const wrapper = mount(Fields, { props: { locales: [{ value: 'en', label: 'English' }],
      fields: [{ key: 'name', label: '标签名称', maxLength: 100 }], values: { en: { name: 'Hot' } } } })
    await wrapper.get('input').setValue('Trending')
    expect(wrapper.emitted('edit')?.[0]).toEqual(['en', 'name', 'Trending'])
    expect(wrapper.get('input').attributes('maxlength')).toBe('100')
    await wrapper.setProps({ fields: [{ key: 'title', label: '首页标题', maxLength: 200 },
      { key: 'description', label: '首页描述', maxLength: 1000, multiline: true }],
      values: { en: { title: 'Title', description: 'Description' } }, errors: { en: { description: 'Failed' } } })
    expect(wrapper.get('textarea').element.value).toBe('Description')
    expect(wrapper.text()).toContain('Failed')
    await wrapper.setProps({ disabled: true })
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
    expect(wrapper.get('textarea').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })
})
