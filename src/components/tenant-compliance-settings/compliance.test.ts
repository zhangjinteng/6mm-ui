import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { MmSelect } from '../select'
import { MmDatePicker } from '../date-picker'
import Settings from './TenantComplianceSettings.vue'
import { complianceTypes } from './model'
import type { ComplianceDetail, ComplianceSaveInput, ComplianceSettingsProps } from './types'

export const detail = (site_id = '10'): ComplianceDetail => ({
    tenant_id: '1', tenant_name: 'Alpha', site_id, site_name: 'Site ' + site_id,
    legal_entity_name: 'Alpha Ltd', platform_count: 5, updated_at: null, revision: 'a'.repeat(64),
    profile: { legal_entity_name: 'Alpha Ltd', registration_number: 'R-1', registered_address: 'Address', support_email: 'support@example.com', effective_date: '2028-02-29' },
    agreements: complianceTypes.map(t => ({ agreement_type: t.value, label: t.label, mode: 'platform', is_enabled: true, url: '', state: 'ready', template_code: t.value, published_chapters: 2, published_version: '1' })),
    sites: [{ site_id: '10', site_name: 'Main' }, { site_id: '11', site_name: 'Second' }], can_edit: true
})
const button = (w: ReturnType<typeof mount>, text: string) => w.findAll('button').find(b => b.text().trim() === text)!
function setup(extra: Partial<ComplianceSettingsProps> = {}) {
    const load = vi.fn(async (_signal, siteId) => detail(siteId))
    const save = vi.fn(async (input: ComplianceSaveInput) => ({ changed: true, detail: { ...detail(input.site_id), ...input, agreements: detail().agreements.map((a, i) => ({ ...a, ...input.agreements[i] })), revision: 'b'.repeat(64) } }))
    const w = mount(Settings, { props: { load, save, ...extra }, global: { stubs: { teleport: true } } })
    return { w, load, save }
}
describe('shared compliance editor', () => {
    it('places single-site information below the profile description', async () => {
        const { w } = setup({ load: async () => ({ ...detail(), sites: [detail().sites![0]] }) })
        await flushPromises()
        const intro = w.get('.section-intro')
        expect(intro.get('.compliance-site').text()).toBe('站点：Site 10 · 10')
        expect(intro.get('.compliance-site').element.previousElementSibling?.textContent).toContain('各站点独立管理。')
        expect(w.find('.compliance-body > .compliance-site').exists()).toBe(false)
        w.unmount()
    })
    it('keeps site selection available on both tabs', async () => {
        const { w, load } = setup(); await flushPromises()
        expect(w.get('.section-intro').findComponent(MmSelect).exists()).toBe(true)
        expect(w.find('.compliance-body > .compliance-site').exists()).toBe(false)
        await button(w, '协议文件').trigger('click')
        expect(w.find('.compliance-body > .compliance-site').exists()).toBe(false)
        const site = w.get('.intro-row .compliance-site')
        expect(site.findComponent(MmSelect).exists()).toBe(true)
        expect(site.element.previousElementSibling?.textContent).toContain('使用平台最新已发布模板')
        site.getComponent(MmSelect).vm.$emit('update:modelValue', '11')
        await flushPromises()
        expect(load).toHaveBeenLastCalledWith(expect.any(AbortSignal), '11')
        w.unmount()
    })
    it('places agreement site information below its description in full-page and embedded editors', async () => {
        for (const fullPage of [true, false]) {
            const { w } = setup({ fullPage, load: async () => ({ ...detail(), sites: [detail().sites![0]] }) })
            await flushPromises()
            await button(w, '协议文件').trigger('click')
            const site = w.get('.intro-row .compliance-site')
            expect(site.text()).toBe('站点：Site 10 · 10')
            expect(site.element.previousElementSibling?.textContent).toContain('使用平台最新已发布模板，或填写本站点的公开 HTTPS 协议链接。')
            expect(w.find('.compliance-body > .compliance-site').exists()).toBe(false)
            w.unmount()
        }
    })
    it('uses the shared date picker and saves calendar selections as YYYY-MM-DD', async () => {
        for (const fullPage of [true, false]) {
            const { w, save } = setup({ fullPage }); await flushPromises()
            expect(w.find('input[type="date"]').exists()).toBe(false)
            const picker = w.getComponent(MmDatePicker)
            expect(picker.props('format')).toBe('YYYY-MM-DD')
            expect(picker.props('modelValue')).toBe('2028-02-29')
            await picker.get('input').trigger('click'); await nextTick()
            await w.get('[data-date="2028-02-28"]').trigger('click')
            await button(w, '保存配置').trigger('click'); await flushPromises()
            expect(save.mock.calls[0][0].profile.effective_date).toBe('2028-02-28')
            w.unmount()
        }
    })
    it('blocks invalid typed dates, including when other profile fields change, and restores discarded input', async () => {
        Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
        const { w, save } = setup(); await flushPromises()
        let input = w.getComponent(MmDatePicker).get('input')
        await input.setValue('2028-02-30'); await input.trigger('blur')
        await w.get('input[aria-label="公司主体名称"]').setValue('Other edit')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save).not.toHaveBeenCalled()
        expect(w.text()).toContain('请输入有效日期')
        await button(w, '放弃修改').trigger('click'); await nextTick()
        input = w.getComponent(MmDatePicker).get('input')
        expect(input.element.value).toBe('2028-02-29')
        await input.setValue('2028-02-28'); await input.trigger('blur')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save.mock.calls[0][0].profile.effective_date).toBe('2028-02-28')
        w.unmount()
    })
    it('normalizes cleared dates to an empty string and retains platform-template required validation', async () => {
        Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
        const { w, save } = setup(); await flushPromises()
        await w.getComponent(MmDatePicker).get('.mm-input__clear').trigger('click')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save).not.toHaveBeenCalled()
        expect(w.getComponent(MmDatePicker).props('status')).toBe('error')
        await button(w, '协议文件').trigger('click')
        for (const toggle of w.findAll('[role="switch"]')) await toggle.trigger('click')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save.mock.calls[0][0].profile.effective_date).toBe('')
        w.unmount()
    })
    it('loads without saving defaults and keeps the tenant name read-only', async () => {
        const { w, save } = setup(); await flushPromises()
        expect(w.get<HTMLInputElement>('input[aria-label="公司主体名称"]').element.value).toBe('Alpha Ltd')
        expect(w.get('input[aria-label="白标名称"]').attributes('disabled')).toBeDefined()
        expect(button(w, '保存配置').attributes('disabled')).toBeDefined()
        expect(save).not.toHaveBeenCalled(); w.unmount()
    })
    it('saves only the selected site, revision and draft, then advances the revision', async () => {
        const { w, save } = setup(); await flushPromises()
        await w.get('input[aria-label="公司主体名称"]').setValue(' Updated ')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save.mock.calls[0][0]).toEqual({ site_id: '10', expected_revision: 'a'.repeat(64), profile: { ...detail().profile, legal_entity_name: 'Updated' }, agreements: detail().agreements.map(({ agreement_type, mode, is_enabled, url }) => ({ agreement_type, mode, is_enabled, url })) })
        expect(w.emitted('saved')).toHaveLength(1)
        await w.get('input[aria-label="公司主体名称"]').setValue('Again')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save.mock.calls[1][0].expected_revision).toBe('b'.repeat(64)); w.unmount()
    })
    it('discards the local draft without making another request', async () => {
        const { w, load, save } = setup(); await flushPromises()
        await w.get('input[aria-label="公司主体名称"]').setValue('Draft')
        await button(w, '放弃修改').trigger('click')
        expect(w.get<HTMLInputElement>('input[aria-label="公司主体名称"]').element.value).toBe('Alpha Ltd')
        expect(load).toHaveBeenCalledTimes(1); expect(save).not.toHaveBeenCalled(); w.unmount()
    })
    it('validates and focuses the first missing profile field', async () => {
        const scroll = vi.fn()
        Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: scroll })
        const { w, save } = setup(); await flushPromises()
        await w.get('input[aria-label="公司主体名称"]').setValue('')
        await button(w, '保存配置').trigger('click'); await flushPromises()
        expect(save).not.toHaveBeenCalled()
        expect(w.get('input[aria-label="公司主体名称"]').attributes('aria-invalid')).toBe('true')
        expect(scroll).toHaveBeenCalled(); w.unmount()
    })
    it('renders agreement modes and switches with accessible names', async () => {
        const { w, save } = setup(); await flushPromises()
        await button(w, '协议文件').trigger('click'); await nextTick()
        expect(w.findAll('[role="switch"]')).toHaveLength(5)
        await w.get('[role="switch"][aria-label="用户协议启用"]').trigger('click')
        expect(w.get('[role="switch"][aria-label="用户协议启用"]').attributes('aria-checked')).toBe('false')
        expect(save).not.toHaveBeenCalled(); w.unmount()
    })
    it('retains an uncertain draft, blocks duplicate saves and requires reload confirmation', async () => {
        let fail!: (e: Error) => void
        const save = vi.fn(() => new Promise((_, reject) => { fail = reject }))
        const { w, load } = setup({ save: save as ComplianceSettingsProps['save'] }); await flushPromises()
        await w.get('input[aria-label="公司主体名称"]').setValue('Keep')
        await button(w, '保存配置').trigger('click'); await button(w, '保存配置').trigger('click')
        expect(save).toHaveBeenCalledTimes(1)
        expect(w.get('input[aria-label="公司主体名称"]').attributes('disabled')).toBeDefined()
        fail(new Error('network')); await flushPromises()
        expect(w.text()).toContain('保存未确认')
        expect(button(w, '保存配置').attributes('disabled')).toBeDefined()
        expect(w.get<HTMLInputElement>('input[aria-label="公司主体名称"]').element.value).toBe('Keep')
        await button(w, '重新加载核验').trigger('click'); await nextTick()
        await button(w, '确认重新加载').trigger('click'); await flushPromises()
        expect(load).toHaveBeenCalledTimes(2); w.unmount()
    })
    it('understands both host validation envelopes and keeps stale revisions blocked after edits', async () => {
        for (const error of [{ errors: { expected_revision: ['配置已改变'] } }, { response: { data: { data: { errors: { expected_revision: ['配置已改变'] } } } } }]) {
            const { w } = setup({ save: async () => { throw error } }); await flushPromises()
            await w.get('input[aria-label="公司主体名称"]').setValue('Keep')
            await button(w, '保存配置').trigger('click'); await flushPromises()
            await w.get('input[aria-label="公司主体名称"]').setValue('Still keep')
            expect(w.text()).toContain('配置已改变')
            expect(button(w, '保存配置').attributes('disabled')).toBeDefined(); w.unmount()
        }
    })
    it('enforces both host and server read-only permissions', async () => {
        for (const extra of [{ canEdit: false }, { load: async () => ({ ...detail(), can_edit: false }) }]) {
            const { w, save } = setup(extra); await flushPromises()
            expect(w.get('input[aria-label="公司主体名称"]').attributes('disabled')).toBeDefined()
            expect(w.getComponent(MmDatePicker).get('input').attributes('disabled')).toBeDefined()
            expect(button(w, '保存配置')).toBeUndefined()
            expect(save).not.toHaveBeenCalled(); w.unmount()
        }
    })
    it('only switches owned sites and prompts before discarding unsaved changes', async () => {
        const { w, load } = setup(); await flushPromises()
        await w.get('input[aria-label="公司主体名称"]').setValue('Draft')
        w.findComponent(MmSelect).vm.$emit('update:modelValue', '99'); await nextTick()
        expect(load).toHaveBeenCalledTimes(1)
        w.findComponent(MmSelect).vm.$emit('update:modelValue', '11'); await nextTick()
        expect(load).toHaveBeenCalledTimes(1)
        await button(w, '继续编辑').trigger('click')
        expect(w.get<HTMLInputElement>('input[aria-label="公司主体名称"]').element.value).toBe('Draft')
        w.findComponent(MmSelect).vm.$emit('update:modelValue', '11'); await nextTick()
        await button(w, '确认重新加载').trigger('click'); await flushPromises()
        expect(load.mock.calls.at(-1)?.[1]).toBe('11'); w.unmount()
    })
    it('retries failed reads and aborts pending loads on unmount', async () => {
        const load = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValue(detail())
        const { w } = setup({ load }); await flushPromises()
        await button(w, '重新加载').trigger('click'); await flushPromises()
        expect(w.get<HTMLInputElement>('input[aria-label="公司主体名称"]').element.value).toBe('Alpha Ltd'); w.unmount()
        let signal: AbortSignal | undefined
        const pending = setup({ load: async s => { signal = s; return new Promise(() => {}) } }).w
        await nextTick(); pending.unmount(); expect(signal?.aborted).toBe(true)
    })
})
