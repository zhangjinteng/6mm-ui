import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import UserDetailDialog from '../UserDetailDialog.vue'

afterEach(() => {
  document.body.querySelectorAll('[data-mm-component="dialog"]').forEach(element => element.remove())
})

describe('MmUserDetailDialog', () => {
  it('loads and renders the shared user detail contract', async () => {
    const request = vi.fn(async () => ({
      agent_user_id: 'external-9001',
      contract: {
        order_count: 2,
        pnl_30d: '-4.5',
        position_amount: '1200',
        position_count: 1,
        wallet_balance: '88.2',
      },
      prediction: {
        orders_30d: 12,
        net_profit_30d: '-2.25',
      },
      nice_name: 'Alice',
      online_status: 1,
      user_id: 9001,
      user_type: 1,
      vip_level: 2,
    }))
    mount(UserDetailDialog, { props: { modelValue: true, request, userId: 9001 } })
    await flushPromises()

    expect(request).toHaveBeenCalledWith(9001, expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(document.body.textContent).toContain('Alice · UID 9001')
    expect(document.body.textContent).toContain('1,200.00')
    expect(document.body.textContent).toContain('-4.50')
    expect(document.body.textContent).toContain('用户预测')
  })

  it('renders prediction metrics in the prediction tab and emits their metric key', async () => {
    const wrapper = mount(UserDetailDialog, {
      props: {
        modelValue: true,
        request: async () => ({
          contract: {},
          prediction: { orders_30d: 12, win_orders: 7 },
          user_id: 9001,
        }),
        userId: 9001,
      },
    })
    await flushPromises()

    const tabs = Array.from(document.body.querySelectorAll<HTMLElement>('[role="tab"]'))
    tabs.find(tab => tab.textContent?.includes('用户预测'))?.click()
    await flushPromises()

    expect(document.body.textContent).toContain('30日订单')
    expect(document.body.textContent).toContain('12')
    const predictionLink = Array.from(document.body.querySelectorAll<HTMLButtonElement>('.mm-user-detail-metric__link'))
      .find(button => button.closest('.mm-user-detail-metric')?.textContent?.includes('30日订单'))
    predictionLink?.click()
    await flushPromises()
    expect(wrapper.emitted('metric-click')?.at(-1)?.[0]).toBe('prediction_orders_30d')
  })

  it('emits the selected metric without owning application routes', async () => {
    const wrapper = mount(UserDetailDialog, {
      props: {
        modelValue: true,
        request: async () => ({ contract: { wallet_balance: 1 }, user_id: 9001 }),
        userId: 9001,
      },
    })
    await flushPromises()
    const firstLink = document.body.querySelector<HTMLButtonElement>('.mm-user-detail-metric__link')
    firstLink?.click()
    await flushPromises()

    expect(wrapper.emitted('metric-click')?.[0]?.[0]).toBe('wallet_balance')
  })
})
