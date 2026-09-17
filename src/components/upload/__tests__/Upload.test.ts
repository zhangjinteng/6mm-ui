import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import Upload from '../Upload.vue'

async function choose(wrapper: ReturnType<typeof mount>, files: File[]): Promise<void> {
  const input = wrapper.get<HTMLInputElement>('input[type="file"]')
  Object.defineProperty(input.element, 'files', { configurable: true, value: files })
  await input.trigger('change')
  await flushPromises()
  await nextTick()
}

describe('MmUpload', () => {
  it('validates files and uploads through the injected request', async () => {
    const request = vi.fn(async ({ onProgress }: { onProgress: (percentage: number) => void }) => {
      onProgress(42)
      return { id: 'file-1' }
    })
    const wrapper = mount(Upload, {
      props: { accept: '.csv', maxSize: 1024, modelValue: [], request },
    })
    await choose(wrapper, [new File(['a,b'], 'ledger.csv', { type: 'text/csv' })])
    await flushPromises()
    await nextTick()

    expect(request).toHaveBeenCalledTimes(1)
    expect(wrapper.get('.mm-upload__file').classes()).toContain('is-success')
    expect(wrapper.text()).toContain('ledger.csv')
    expect(wrapper.emitted('success')).toHaveLength(1)
    const latest = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as Array<{ percentage: number; status: string }>
    expect(latest[0]).toMatchObject({ percentage: 100, status: 'success' })
  })

  it('reports type, size, and beforeUpload validation failures', async () => {
    const request = vi.fn(async () => ({}))
    const wrapper = mount(Upload, {
      props: {
        accept: '.csv',
        beforeUpload: async (file: File) => file.name !== 'blocked.csv',
        maxSize: 3,
        modelValue: [],
        multiple: true,
        request,
      },
    })
    await choose(wrapper, [
      new File(['image'], 'chart.png', { type: 'image/png' }),
      new File(['long'], 'large.csv', { type: 'text/csv' }),
      new File(['ok'], 'blocked.csv', { type: 'text/csv' }),
    ])

    expect(request).not.toHaveBeenCalled()
    expect(wrapper.findAll('.mm-upload__file.is-fail')).toHaveLength(3)
    expect(wrapper.emitted('error')).toHaveLength(3)
  })

  it('aborts active uploads when a file is removed', async () => {
    let signal: AbortSignal | undefined
    const request = vi.fn(({ signal: nextSignal }: { signal: AbortSignal }) => {
      signal = nextSignal
      return new Promise(() => undefined)
    })
    const wrapper = mount(Upload, { props: { modelValue: [], request } })
    await choose(wrapper, [new File(['payload'], 'payload.txt', { type: 'text/plain' })])
    expect(signal?.aborted).toBe(false)

    await wrapper.get('[aria-label="移除 payload.txt"]').trigger('click')
    expect(signal?.aborted).toBe(true)
    expect(wrapper.find('.mm-upload__file').exists()).toBe(false)
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('enforces file limits and supports drag state', async () => {
    const wrapper = mount(Upload, { props: { drag: true, limit: 1, modelValue: [] } })
    const dropzone = wrapper.get('.mm-upload__dropzone')
    await dropzone.trigger('dragenter')
    expect(wrapper.get('.mm-upload').classes()).toContain('is-dragging')
    await dropzone.trigger('dragleave')
    expect(wrapper.get('.mm-upload').classes()).not.toContain('is-dragging')

    await choose(wrapper, [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')])
    expect(wrapper.emitted('exceed')).toHaveLength(1)
  })
})
