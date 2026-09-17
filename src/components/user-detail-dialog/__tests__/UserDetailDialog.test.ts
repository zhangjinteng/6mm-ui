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
