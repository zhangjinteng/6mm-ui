import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SocialChannels from './SocialChannels.vue'
import TenantChannelSettings from './TenantChannelSettings.vue'
import { channelLinkError, createChannelLinkDraft, normalizeChannelLinks, tenantSocialChannels, type TenantChannelDetail } from './model'

const fixture = (): TenantChannelDetail => ({ tenant_id: '101', tenant_name: 'Alpha', social_links: { x: 'https://x.com/alpha' }, expected_updated_at: null, can_edit: true })
const button = (wrapper: ReturnType<typeof mount>, text: string) => wrapper.findAll('button').find(item => item.text().includes(text))!

describe('shared social channels', () => {
  it('shares 12 supported keys, removes blanks and rejects unsafe URLs', () => {
    expect(tenantSocialChannels).toHaveLength(12)
    expect(Object.keys(createChannelLinkDraft(tenantSocialChannels, { future: 'x' }))).toHaveLength(12)
    expect(normalizeChannelLinks({ x: ' https://x.com/a ', telegram: '' })).toEqual({ x: 'https://x.com/a' })
    for (const value of ['', ' ', 'https://x.com/alpha']) expect(channelLinkError(value)).toBe('')
    for (const value of ['http://x.com', 'javascript:alert(1)', 'https:example.com', 'https:///example.com',
      'https://@example.com', 'https://u:p@example.com', 'https://example.com/a b', 'https://example.com/\\a']) expect(channelLinkError(value)).not.toBe('')
  })

  it('renders accessible fields and only counts valid configured links', async () => {
    const wrapper = mount(SocialChannels, { props: { modelValue: { x: 'https://x.com/a', telegram: 'http://bad.test' }, displayStatus: true } })
    expect(wrapper.findAll('input')).toHaveLength(12)
    expect(wrapper.text()).toContain('1 个已显示')
    expect(wrapper.find('input[aria-label="Telegram 链接"]').attributes('aria-invalid')).toBe('true')
    for (const label of wrapper.findAll('label')) expect(wrapper.find(`input[id="${label.attributes('for')}"]`).exists()).toBe(true)
    await wrapper.find('input').setValue('https://x.com/b')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual({ x: 'https://x.com/b', telegram: 'http://bad.test' })
    wrapper.unmount()
  })
})

describe('tenant channel settings page', () => {
  it('loads, edits, discards and saves with the original version', async () => {
    const save = vi.fn(async () => ({ changed: true, detail: { ...fixture(), social_links: { x: 'https://x.com/b' }, expected_updated_at: '2026-11-03 10:00:00+00:00' } }))
    const wrapper = mount(TenantChannelSettings, { props: { load: vi.fn(async () => fixture()), save } })
    await flushPromises()
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    expect(button(wrapper, '保存配置').get('.mm-button__icon .mm-icon').attributes('stroke')).toBe('currentColor')
    await wrapper.find('input').setValue('https://x.com/discard')
    await button(wrapper, '放弃修改').trigger('click')
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('https://x.com/alpha')
    await wrapper.find('input').setValue('https://x.com/b')
    await button(wrapper, '保存配置').trigger('click'); await flushPromises()
    expect(save).toHaveBeenCalledExactlyOnceWith({ social_links: { x: 'https://x.com/b' }, expected_updated_at: null })
    expect(wrapper.text()).toContain('当前配置已保存')
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
    wrapper.unmount()
  })

  it('enforces host and server read-only permission, and prevents invalid saves', async () => {
    for (const options of [{ canEdit: false, detail: fixture() }, { canEdit: true, detail: { ...fixture(), can_edit: false } }]) {
      const save = vi.fn()
      const wrapper = mount(TenantChannelSettings, { props: { load: async () => options.detail, save, canEdit: options.canEdit } })
      await flushPromises()
      expect(wrapper.findAll('input').every(input => input.attributes('disabled') !== undefined)).toBe(true)
      expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined()
      expect(save).not.toHaveBeenCalled(); wrapper.unmount()
    }
    const wrapper = mount(TenantChannelSettings, { props: { load: async () => fixture(), save: vi.fn() } })
    await flushPromises(); await wrapper.find('input').setValue('http://bad.test')
    expect(button(wrapper, '保存配置').attributes('disabled')).toBeDefined(); wrapper.unmount()
  })

  it('supports load retry, preserves failed drafts and requires explicit reload after conflicts', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(fixture())
    const wrapper = mount(TenantChannelSettings, { props: { load, save: vi.fn().mockRejectedValue(new Error('conflict')) } })
    await flushPromises(); expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    await button(wrapper, '重新加载').trigger('click'); await flushPromises()
    await wrapper.find('input').setValue('https://x.com/unsaved')
    await button(wrapper, '保存配置').trigger('click'); await flushPromises()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('https://x.com/unsaved')
    await button(wrapper, '放弃并重新加载').trigger('click'); await flushPromises()
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('https://x.com/alpha')
    wrapper.unmount()
  })

  it('aborts pending reads and suppresses duplicate saves', async () => {
    let signal: AbortSignal | undefined
    const pending = mount(TenantChannelSettings, { props: { load: async next => { signal = next; return new Promise(() => {}) }, save: vi.fn() } })
    await nextTick()
    expect(pending.find('[data-mm-component="loading"]').exists()).toBe(true)
    pending.unmount(); expect(signal?.aborted).toBe(true)
    let resolve!: (value: { changed: boolean; detail: TenantChannelDetail }) => void
    const save = vi.fn(() => new Promise<{ changed: boolean; detail: TenantChannelDetail }>(done => { resolve = done }))
    const wrapper = mount(TenantChannelSettings, { props: { load: async () => fixture(), save } })
    await flushPromises(); await wrapper.find('input').setValue('https://x.com/b')
    await button(wrapper, '保存配置').trigger('click'); await button(wrapper, '保存中').trigger('click')
    expect(save).toHaveBeenCalledTimes(1)
    resolve({ changed: true, detail: fixture() }); await flushPromises(); wrapper.unmount()
  })
})
