import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Table from '../LiquidationWarningTable.vue'
import Dialog from '../LiquidationWarningRulesDialog.vue'
import { formatLiquidationRiskRatio, resolveWarningLevel, toWarningRulePayload } from '../rules'

const rules = { min_large_position_value: 20, liquidation_high_risk_threshold: 90, liquidation_warning_notify_enabled: false }
describe('shared liquidation warnings', () => {
  it('converts ratios to percentages without inventing missing values and classifies exact thresholds', () => {
    expect(formatLiquidationRiskRatio('0.00011135')).toBe('0.011135%')
    expect(formatLiquidationRiskRatio(null)).toBe('—')
    expect(resolveWarningLevel(.2, rules)?.label).toBe('预警')
    expect(resolveWarningLevel(.9, rules)?.label).toBe('高风险')
    expect(resolveWarningLevel(.1999, rules)).toBeNull()
    expect(resolveWarningLevel(null, rules)).toBeNull()
    expect(toWarningRulePayload({ entryThreshold: '20', highRiskThreshold: '19', notifyEnabled: false })).toBeNull()
  })
  it('shares the table/filter request contract, risk columns, tags and identity slots', async () => {
    const request = vi.fn(async () => ({ rows: [{ id: '99', user_id: '9001', margin_ratio: '.9', symbol: 'BTCUSDT', liq_price: '70000' }], total: 1 }))
    const wrapper = mount(Table, { props: { request, loadRules: async () => rules }, slots: { 'cell-user_id': '<b>scoped-user</b>' } })
    await flushPromises()
    expect(request).toHaveBeenCalledWith(expect.objectContaining({ page_no: 1, page_size: 20 }), expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.text()).toContain('风险率 ≥ 20%')
    expect(wrapper.text()).toContain('90.00%')
    expect(wrapper.text()).toContain('高风险')
    expect(wrapper.text()).toContain('scoped-user')
    expect(wrapper.findAll('thead th').map(c => c.text())).not.toContain('操作')
    expect(wrapper.find('.mm-pro-table').classes()).toContain('is-fill-height')
    wrapper.unmount()
  })
  it('does not overwrite a newer loaded rule with a slow initial request', async () => {
    let resolve!: (r: unknown) => void
    const initial = new Promise(r => { resolve = r })
    const wrapper = mount(Table, { props: { request: async () => ({ rows: [], total: 0 }), loadRules: () => initial } })
    wrapper.findComponent(Dialog).vm.$emit('loaded', { ...rules, min_large_position_value: 35 })
    resolve(rules)
    await flushPromises()
    expect(wrapper.text()).toContain('风险率 ≥ 35%')
    wrapper.unmount()
  })
  it('keeps read-only rules unsaveable and offers retry when the configuration fails to load', async () => {
    const load = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(rules)
    const wrapper = mount(Dialog, { props: { canEdit: false, loadRules: load }, attachTo: document.body })
    ;(wrapper.vm as unknown as { open: () => void }).open()
    await flushPromises()
    expect(document.body.textContent).toContain('预警规则加载失败')
    const retry = [...document.body.querySelectorAll('button')].find(b => b.textContent?.includes('重新加载'))!
    retry.click()
    await flushPromises()
    expect(document.body.textContent).not.toContain('保存规则')
    expect(load).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
  it('saves only valid percentages, propagates saved rules and reloads the list', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const save = vi.fn(async r => r)
    const wrapper = mount(Table, { props: { request, loadRules: async () => rules, saveRules: save, canEditRules: true }, attachTo: document.body })
    await flushPromises()
    await wrapper.get('[aria-label="强平预警规则"]').trigger('click')
    await flushPromises()
    const saveButton = [...document.body.querySelectorAll('button')].find(b => b.textContent?.includes('保存规则'))!
    saveButton.click()
    await flushPromises()
    expect(save).toHaveBeenCalledWith(rules)
    expect(request).toHaveBeenCalledTimes(2)
    expect(wrapper.emitted('rules-saved')?.[0]).toEqual([rules])
    wrapper.unmount()
  })
})
