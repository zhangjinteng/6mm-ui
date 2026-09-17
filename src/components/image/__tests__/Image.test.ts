import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'

import Image from '../Image.vue'

describe('MmImage', () => {
  it('supports lazy loading, fit, load, and error fallback', async () => {
    const wrapper = mount(Image, {
      props: { alt: '策略图', fit: 'contain', lazy: true, src: '/chart.png' },
      slots: { error: '<span data-error>无法加载</span>', placeholder: '<span data-loading>加载中</span>' },
    })

    const image = wrapper.get('img')
    expect(image.attributes('loading')).toBe('lazy')
    expect(image.attributes('style')).toContain('object-fit: contain')
    expect(wrapper.find('[data-loading]').exists()).toBe(true)
    await image.trigger('load')
    expect(wrapper.find('[data-loading]').exists()).toBe(false)
    expect(wrapper.emitted('load')).toHaveLength(1)

    await wrapper.setProps({ src: '/broken.png' })
    await wrapper.get('img').trigger('error')
    expect(wrapper.get('[data-error]').text()).toBe('无法加载')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('opens preview, navigates images, closes with Escape, and restores focus', async () => {
    const wrapper = mount(Image, {
      attachTo: document.body,
      props: { alt: '凭证', preview: true, previewSrcList: ['/a.png', '/b.png'], src: '/a.png' },
    })
    const trigger = wrapper.get<HTMLButtonElement>('.mm-image__trigger')
    trigger.element.focus()
    await trigger.trigger('click')
    await nextTick()
    expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')

    const next = document.body.querySelector<HTMLButtonElement>('[aria-label="下一张图片"]')!
    next.click()
    await nextTick()
    expect(document.body.querySelector<HTMLImageElement>('.mm-image-preview__image')?.src).toContain('/b.png')

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(trigger.element)
  })
})
