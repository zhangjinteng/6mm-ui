import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import LiquidationTradesDialog from '../LiquidationTradesDialog.vue'

afterEach(() => {
  document.body.style.overflow = ''
  document.querySelectorAll('[data-mm-component="dialog"]').forEach(element => element.remove())
})

describe('MmLiquidationTradesDialog', () => {
  it('loads aggregated liquidation orders and preserves the current layout contract', async () => {
    const request = vi.fn(async () => ({
      rows: [{
        handling_fee: '72.448463',
        order_id: '101331223',
        position_id: '10019033',
        price: '64976.2',
        quantity: '2.23',
        role_type: 'TAKER',
        side: 'buy',
        trade_time: '2026-08-10 06:14:26',
        trade_value: '144896.926',
      }],
      total: 1,
    }))
    const wrapper = mount(LiquidationTradesDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        orderTradesHref: id => `/fills/${id}`,
        positionHref: id => `/positions/${id}`,
        request,
        row: {
          average_execution_price: '64976.2',
          liquidation_quantity: '2.23',
          occurred_at: '2026-08-10 06:14:26',
          position_id: '10019033',
          position_side: 'long',
          symbol: 'BTCUSDT',
          user_id: '9117305547',
        },
      },
    })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      { page_no: 1, page_size: 15, position_id: '10019033' },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    const panel = document.body.querySelector<HTMLElement>('[role="dialog"]')!
    expect(panel.textContent).toContain('强平成交记录')
    expect(panel.textContent).toContain('仓位 10019033 · 每个强平单聚合展示一次')
    expect(panel.textContent).toContain('64,976.20')
    expect(panel.textContent).toContain('144,896.926')
    expect(panel.querySelector('a[href="/positions/10019033"]')).not.toBeNull()
    expect(panel.querySelector('a[href="/fills/101331223"]')).not.toBeNull()
    wrapper.unmount()
  })

  it('emits navigation events and closes without retaining request state', async () => {
    const request = vi.fn(async () => ({
      rows: [{ order_id: 202, position_id: 101, quantity: 1 }],
      total: 1,
    }))
    const wrapper = mount(LiquidationTradesDialog, {
      attachTo: document.body,
      props: {
        modelValue: true,
        orderTradesHref: id => `/fills/${id}`,
        positionHref: id => `/positions/${id}`,
        request,
        row: { position_id: 101 },
      },
    })
    await flushPromises()

    const links = document.body.querySelectorAll<HTMLAnchorElement>('.mm-liquidation-trades-dialog__body a')
    links[0]?.click()
    links[2]?.click()
    expect(wrapper.emitted('position-click')?.[0]?.[0]).toBe(101)
    expect(wrapper.emitted('order-click')?.[0]?.[0]).toBe(202)

    await wrapper.setProps({ modelValue: false })
    await flushPromises()
    expect(document.body.querySelector('[data-mm-component="dialog"]')).toBeNull()
    wrapper.unmount()
  })
})
