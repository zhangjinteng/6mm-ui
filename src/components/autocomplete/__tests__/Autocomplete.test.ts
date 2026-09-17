import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import Autocomplete from '../Autocomplete.vue'

describe('MmAutocomplete', () => {
  it('loads suggestions and selects an active option with the keyboard', async () => {
    const fetchSuggestions = vi.fn(async () => [
      { label: 'BTC / USDT', value: 'BTC-USDT' },
      { label: 'ETH / USDT', value: 'ETH-USDT' },
    ])
    const wrapper = mount(Autocomplete, {
      attachTo: document.body,
      props: { debounce: 0, fetchSuggestions, modelValue: '', placeholder: '搜索市场' },
    })
    const input = wrapper.get('input')

    await input.setValue('bt')
    await nextTick()
    await Promise.resolve()
    await nextTick()
    expect(fetchSuggestions).toHaveBeenCalledWith('bt', expect.any(AbortSignal))
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(2)
    const dropdown = document.body.querySelector<HTMLElement>('.mm-autocomplete__dropdown')
    expect(window.getComputedStyle(dropdown!).scrollbarGutter).toBe('auto')

    await input.trigger('keydown', { key: 'ArrowDown' })
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['BTC-USDT'])
    expect(wrapper.emitted('select')?.at(-1)?.[0]).toMatchObject({ value: 'BTC-USDT' })
    expect(document.body.querySelector('[role="listbox"]')).toBeNull()
  })

  it('aborts stale async requests and ignores their results', async () => {
    const signals: AbortSignal[] = []
    let resolveFirst: ((value: string[]) => void) | undefined
    const fetchSuggestions = vi.fn((query: string, signal: AbortSignal) => {
      signals.push(signal)
      if (query === 'b') return new Promise<string[]>((resolve) => { resolveFirst = resolve })
      return Promise.resolve(['ETH-USDT'])
    })
    const wrapper = mount(Autocomplete, {
      attachTo: document.body,
      props: { debounce: 0, fetchSuggestions, modelValue: '' },
    })
    const input = wrapper.get('input')

    await input.setValue('b')
    await input.setValue('e')
    await Promise.resolve()
    await nextTick()
    resolveFirst?.(['BTC-USDT'])
    await Promise.resolve()
    await nextTick()

    expect(signals[0]?.aborted).toBe(true)
    expect(document.body.textContent).toContain('ETH-USDT')
    expect(document.body.textContent).not.toContain('BTC-USDT')
  })

  it('renders an async error state without throwing', async () => {
    const wrapper = mount(Autocomplete, {
      attachTo: document.body,
      props: {
        debounce: 0,
        fetchSuggestions: async () => { throw new Error('行情服务不可用') },
        modelValue: '',
      },
    })
    await wrapper.get('input').setValue('btc')
    await Promise.resolve()
    await nextTick()

    expect(document.body.querySelector('[role="alert"]')?.textContent).toContain('行情服务不可用')
  })
})
