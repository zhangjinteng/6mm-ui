import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Dashboard from './BusinessDashboard.vue'
import { dashboardView, dashboardNumber, dashboardChart, type DashboardPayload } from './model'

function payload(scope: DashboardPayload['scope'] = 'platform'): DashboardPayload {
  return { scope, currency: 'USDT', range: { start: '2026-11-17', end: '2026-11-18' }, blocks: {
    users: { state: 'ready', data: { total: 42, new: 2, daily: [{ date: '2026-11-18', value: 2 }] } },
    trade: { state: 'ready', data: { totals: { trade_amount: '5.25', trading_user_count: 1, order_count: 2, fill_count: 3 },
      daily: [{ date: '2026-11-18', value: '0' }], coverage: { missing_dates: ['2026-11-17'] } } },
    assets: { state: 'error', data: null },
  } }
}
describe('supported dashboard data', () => {
  it('distinguishes zero, unavailable and invalid data', () => {
    expect(dashboardNumber(null)).toBe('—'); expect(dashboardNumber(undefined)).toBe('—')
    expect(dashboardNumber('')).toBe('—'); expect(dashboardNumber('invalid')).toBe('—')
    expect(dashboardNumber('0', 'USDT')).toBe('0.00'); expect(dashboardNumber('12.1234', '%')).toBe('12.12')
    expect(dashboardNumber('9007199254740993.99', 'USDT')).toBe('9,007,199,254,740,993.99')
  })
  it('keeps missing dates as gaps but preserves published zero', () => {
    const content = dashboardView(payload(), 'contracts')
    expect(content.panels.find(p => p.key === 'trade-trend')?.series?.[0]?.values).toEqual([null, 0])
    expect(content.cards[1]?.value).toBe(1)
    expect(content.cards[0]?.detail).toContain('缺少 1 天')
    expect(content.cards.find(c => c.key === 'positions')?.value).toBeUndefined()
    expect(dashboardChart(content.panels[0]!).series[0].connectNulls).toBe(false)
  })
  it('does not invent prediction user counts or include unsupported businesses', () => {
    const content = dashboardView(payload(), 'prediction')
    expect(content.cards.map(c => c.key)).toEqual(['stake', 'returned', 'prediction-orders', 'prediction-pnl'])
    expect(content.cards.every(c => c.value === undefined)).toBe(true)
  })
  it('keeps current orders separate from settled reports and labels the scoped round list', () => {
    const data = payload('tenant')
    data.blocks.prediction_runtime = { state: 'ready', data: { as_of: '2026-11-18T00:00:00Z',
      pending: [{ play: 'high_low', count: 2, amount: '3.25' }], orders: [{ id: 'o1', symbol: 'BTCUSDT', play: 'high_low', amount: '3.25', state: 'ACTIVE / DEBITED', created_at: '2026-11-18' }],
      rounds: [{ id: 'r1', symbol: 'BTCUSDT', state: 'BETTING', closes_at: '2026-11-18' }] } }
    const panels = dashboardView(data, 'prediction').panels
    expect(panels.find(p => p.key === 'pending')?.items?.map(r => r.value)).toEqual([2, 0, 0])
    expect(panels.find(p => p.key === 'current-rounds')?.title).toBe('本站路由当前场次')
    expect(panels.find(p => p.key === 'current-rounds')?.items?.[0]?.display).toBe('下注中')
    expect(panels.find(p => p.key === 'current-orders')?.items?.[0]?.detail).toContain('进行中 / 已扣款')
  })
  it('does not present absent online snapshot or immature retention as zero', () => {
    const data = payload('merchant')
    data.merchant_users = { kpis: { current_online: { value: 0 } }, snapshot_at: null,
      retention: [{ label: '30日留存', is_matured: false, rate: 0 }], online_status: { trading: 0 } }
    const content = dashboardView(data, 'users')
    expect(content.cards.find(c => c.key === 'current_online')?.value).toBeNull()
    expect(content.panels.find(p => p.key === 'retention')?.items?.[0]?.value).toBeNull()
    expect(content.panels.find(p => p.key === 'online')?.items?.every(r => r.value === null)).toBe(true)
  })
})
describe('shared workbench interactions', () => {
  it.each([
    ['assets', '资产概览'], ['contracts', '合约数据'],
    ['prediction', '预测概览'], ['partners', '合作概览'],
  ])('opens the requested %s view', async (view, title) => {
    const w = mount(Dashboard, { props: { request: async () => payload(), view } })
    await flushPromises()
    expect(w.get('.mm-business-dashboard__title').text()).toBe(title)
    w.unmount()
  })
  it('reacts to menu navigation without reloading dashboard data', async () => {
    const request = vi.fn(async () => payload())
    const w = mount(Dashboard, { props: { request, view: 'assets' } })
    await flushPromises()
    for (const [view, title] of [['contracts', '合约数据'], ['partners', '合作概览'], ['overview', '经营总览']]) {
      await w.setProps({ view })
      expect(w.get('.mm-business-dashboard__title').text()).toBe(title)
    }
    expect(request).toHaveBeenCalledTimes(1)
    w.unmount()
  })
  it('falls back for views unavailable to the current scope', async () => {
    const w = mount(Dashboard, { props: { request: async () => payload(), view: 'assets' } })
    await flushPromises()
    await w.setProps({ view: 'unknown' })
    expect(w.get('.mm-business-dashboard__title').text()).toBe('经营总览')
    w.unmount()
    const merchant = mount(Dashboard, { props: { request: async () => payload('merchant'), view: 'partners' } })
    await flushPromises()
    expect(merchant.get('.mm-business-dashboard__title').text()).toBe('用户数据')
    merchant.unmount()
  })
  it('loads once and preserves the genuine error state without the category switcher', async () => {
    const request = vi.fn(async () => payload())
    const w = mount(Dashboard, { props: { request } }); await flushPromises()
    expect(request).toHaveBeenCalledWith('7')
    expect(w.find('[aria-label="看板分类"]').exists()).toBe(false)
    expect(w.text()).toContain('资产数据暂不可用'); expect(w.text()).toContain('总用户数')
    expect(w.text()).not.toContain('C2C'); w.unmount()
  })
  it('keeps the merchant menu-selected view when refreshing', async () => {
    const request = vi.fn(async () => payload('merchant'))
    const w = mount(Dashboard, { props: { request, view: 'funds' } }); await flushPromises()
    expect(w.text()).toContain('总保证金')
    await w.get('button[aria-label="刷新看板"]').trigger('click'); await flushPromises()
    expect(w.text()).toContain('总保证金'); expect(w.text()).not.toContain('合作概览'); w.unmount()
  })
  it.each(['platform', 'tenant', 'merchant'] as const)('hides category controls for %s while keeping period and refresh controls', async scope => {
    const request = vi.fn(async () => payload(scope))
    const w = mount(Dashboard, { props: { request } }); await flushPromises()
    expect(w.find('[aria-label="看板分类"]').exists()).toBe(false)
    expect(w.find('[aria-label="统计周期"]').exists()).toBe(true)
    await w.findAll('button').find(b => b.text() === '今日')!.trigger('click'); await flushPromises()
    expect(request).toHaveBeenLastCalledWith('today')
    expect(w.find('button[aria-label="刷新看板"]').exists()).toBe(true)
    w.unmount()
  })
  it('retries rejected reads without leaving stale metrics', async () => {
    const request = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(payload())
    const w = mount(Dashboard, { props: { request } }); await flushPromises()
    expect(w.text()).toContain('加载失败')
    await w.findAll('button').find(b => b.text() === '重新加载')!.trigger('click'); await flushPromises()
    expect(w.text()).toContain('42'); expect(request).toHaveBeenCalledTimes(2); w.unmount()
  })
})
