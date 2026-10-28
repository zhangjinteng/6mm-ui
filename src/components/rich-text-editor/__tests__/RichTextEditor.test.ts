import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

import { createMmLocaleContext, mmLocaleKey } from '../../../composables/use-locale'
import { MmForm, MmFormItem } from '../../form'
import RichTextEditor from '../RichTextEditor.vue'
import type { RichTextEditorExpose, RichTextEditorProps } from '../types'

const mounted: VueWrapper[] = []
async function render(props: RichTextEditorProps = {}) {
  const wrapper = mount(RichTextEditor, { attachTo: document.body, props })
  mounted.push(wrapper)
  await flushPromises()
  return { wrapper, api: wrapper.vm as unknown as RichTextEditorExpose }
}

afterEach(() => { mounted.splice(0).forEach(wrapper => wrapper.unmount()) })

describe('MmRichTextEditor', () => {
  it('imports supported HTML and filters unsupported attributes and unsafe URLs', async () => {
    const { wrapper, api } = await render({ modelValue: '<h2>公告</h2><p><strong>加粗</strong><a href="https://6mm.com">链接</a></p><table><tr><th>币种</th></tr><tr><td>BTC</td></tr></table><img src="https://6mm.com/image.png" onerror="alert(1)"><p><a href="javascript:alert(1)">无效链接</a></p><img src="javascript:alert(1)"><script>alert(1)</script>' })

    expect(wrapper.get('h2').text()).toBe('公告')
    expect(wrapper.get('strong').text()).toBe('加粗')
    expect(wrapper.findAll('table tr')).toHaveLength(2)
    expect(wrapper.findAll('img')).toHaveLength(1)
    expect(wrapper.get('img').attributes('onerror')).toBeUndefined()
    expect(api.getHTML()).not.toContain('javascript:')
    expect(api.getHTML()).not.toContain('<script')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('syncs external HTML without emitting back, and emits content updates and empty values', async () => {
    const { wrapper, api } = await render({ modelValue: '<p>初始</p>' })
    await wrapper.setProps({ modelValue: '<h3>回填</h3><p>正文</p>' })
    expect(wrapper.get('h3').text()).toBe('回填')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    api.editor!.commands.insertContentAt(1, '新增')
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toContain('新增')
    expect(wrapper.emitted('update')?.at(-1)?.[0]).toMatchObject({ text: expect.stringContaining('新增'), json: { type: 'doc' } })
    expect(api.clear()).toBe(true)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
    expect(api.getHTML()).toBe('')
  })

  it('applies HTML source only after confirmation and discards cancelled edits', async () => {
    const { wrapper, api } = await render({ modelValue: '<p>原内容</p>' })
    await wrapper.get('button[aria-label="HTML 源码"]').trigger('click')
    let textarea = document.querySelector('textarea')!
    textarea.value = '<h2>不应用</h2>'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()
    const cancel = Array.from(document.querySelectorAll<HTMLButtonElement>('.mm-dialog__footer button')).find(button => button.textContent === '取消')!
    cancel.click()
    await flushPromises()
    expect(api.getHTML()).toBe('<p>原内容</p>')

    await wrapper.get('button[aria-label="HTML 源码"]').trigger('click')
    textarea = document.querySelector('textarea')!
    textarea.value = '<h2>已导入</h2><p><em>正文</em></p>'
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()
    document.querySelector('form.mm-rich-text-editor__dialog-form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    await flushPromises()
    expect(wrapper.get('h2').text()).toBe('已导入')
    expect(wrapper.get('em').text()).toBe('正文')
    expect(wrapper.emitted('change')?.at(-1)?.[0]).toContain('已导入')
  })

  it('enforces readonly and disabled controls while still allowing parent updates', async () => {
    const { wrapper, api } = await render({ modelValue: '<p>不可编辑</p>', readonly: true })
    expect(api.editor?.isEditable).toBe(false)
    expect(api.setContent('<p>不应修改</p>')).toBe(false)
    expect(api.insertContent('<p>不应追加</p>')).toBe(false)
    expect(api.clear()).toBe(false)
    expect(wrapper.get('[role="textbox"]').attributes('aria-readonly')).toBe('true')
    expect(wrapper.findAll('button').every(button => button.attributes('disabled') !== undefined)).toBe(true)

    await wrapper.setProps({ modelValue: '<p>服务端更新</p>', readonly: false, disabled: true })
    expect(api.getHTML()).toBe('<p>服务端更新</p>')
    expect(api.editor?.isEditable).toBe(false)
    expect(wrapper.get('[role="textbox"]').attributes('tabindex')).toBe('-1')
    await wrapper.setProps({ disabled: false })
    expect(api.editor?.isEditable).toBe(true)
    expect(api.clear()).toBe(true)
  })

  it('inherits form disabled and validation accessibility state', async () => {
    const host = defineComponent({
      components: { MmForm, MmFormItem, RichTextEditor },
      template: '<MmForm disabled :model="{ html: \'\' }"><MmFormItem label="公告正文" error="请输入正文"><RichTextEditor /></MmFormItem></MmForm>',
    })
    const wrapper = mount(host, { attachTo: document.body })
    mounted.push(wrapper)
    await flushPromises()
    const textbox = wrapper.get('[role="textbox"]')
    expect(textbox.attributes('aria-disabled')).toBe('true')
    expect(textbox.attributes('aria-invalid')).toBe('true')
    expect(textbox.attributes('aria-labelledby')).toBe(wrapper.get('.mm-form-item__label').attributes('id'))
    expect(textbox.attributes('aria-describedby')).toBe(wrapper.get('.mm-form-item__error').attributes('id'))
  })

  it('uses the library locale for editor controls', async () => {
    const wrapper = mount(RichTextEditor, { global: { provide: { [mmLocaleKey as symbol]: createMmLocaleContext('en-US') } } })
    mounted.push(wrapper)
    await flushPromises()
    expect(wrapper.get('[role="textbox"]').attributes('aria-label')).toBe('Rich text editor')
    expect(wrapper.find('button[aria-label="Bold"]').exists()).toBe(true)
    expect(wrapper.get('.mm-rich-text-editor__footer').text()).toBe('0 characters')
  })
})
