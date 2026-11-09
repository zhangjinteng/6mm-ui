import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Cover from './views/content/components/ContentCoverUpload.vue'

describe('shared image upload formats', () => {
  it.each([
    ['jpg', 'image/jpeg'], ['png', 'image/png'], ['webp', 'image/webp'], ['svg', 'image/svg+xml'],
    ['ico', 'image/vnd.microsoft.icon'], ['ico', 'image/x-icon'], ['ico', ''], ['svg', ''],
  ])('accepts %s (%s) and renders the updated format hint', async (extension, type) => {
    const upload = vi.fn(async () => ({ url: `https://cdn.test/image.${extension}` }))
    const wrapper = mount(Cover, { props: { modelValue: '', upload } })
    expect(wrapper.text()).toContain('JPG / PNG / WebP / SVG / ICO，最大 5 MB')
    const input = wrapper.get('input[type=file]')
    const file = new File(['fixture'], `image.${extension}`, { type })
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
    await input.trigger('change'); await flushPromises()
    expect(upload).toHaveBeenCalledWith(file, expect.any(AbortSignal))
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([`https://cdn.test/image.${extension}`])
    wrapper.unmount()
  })

  it.each(['svg', 'ico'])('rejects oversized %s before sending a request', async extension => {
    const upload = vi.fn()
    const wrapper = mount(Cover, { props: { modelValue: '', upload } })
    const input = wrapper.get('input[type=file]')
    Object.defineProperty(input.element, 'files', { value: [new File([new Uint8Array(5242881)], `large.${extension}`)] })
    await input.trigger('change'); await flushPromises()
    expect(upload).not.toHaveBeenCalled()
    expect(wrapper.emitted('error')).toHaveLength(1)
    wrapper.unmount()
  })
})
