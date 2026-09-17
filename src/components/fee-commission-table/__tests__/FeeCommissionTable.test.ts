import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import FeeCommissionTable from '../FeeCommissionTable.vue'

describe('MmFeeCommissionTable', () => {
  it('normalizes the initial query and renders exact identifiers and trade values', async () => {
    const request = vi.fn(async () => ({
      rows: [{
        agent_user_id: 'external-alice',
        commission_amount: '0.32',
        handling_fee: '3.2',
        id: '301',
        margin_mode: 'cross',
        order_id: '2085983764139225087',
        position_id: '2085983764139225088',
        price: '64000',
        quantity: '0.1',
        role_type: 'maker',
        side: 'buy',
        symbol: 'BTCUSDT',
        trade_time: '2026-08-11 10:00:00',
        trade_value: '6400',
        user_id: '9001',
      }],
      total: 1,
    }))
    const wrapper = mount(FeeCommissionTable, { props: { request } })

    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        end_time: '',
        keyword: '',
        margin_mode: '',
        order_by: 'trade_time',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        role_type: '',
        side: '',
        start_time: '',
        symbol: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('手续费返佣明细')
    expect(wrapper.text()).toContain('2085983764139225087')
    expect(wrapper.text()).toContain('2085983764139225088')
    expect(wrapper.text()).toContain('0.100 BTC')
    expect(wrapper.text()).toContain('6400.00')
    expect(wrapper.text()).toContain('0.3200')
    wrapper.unmount()
  })

  it('normalizes filter values and date boundaries', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(FeeCommissionTable, { props: { request } })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      keyword: ' 9002 ',
      margin_mode: 'isolated',
      role_type: 'taker',
      side: 'sell',
      symbol: ' xau ',
      time_range: ['2026-08-01', '2026-08-02'],
    })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        end_time: '2026-08-02 23:59:59',
        keyword: '9002',
        margin_mode: 'isolated',
        role_type: 'taker',
        side: 'sell',
        start_time: '2026-08-01 00:00:00',
        symbol: 'xau',
      }),
      expect.any(Object),
    )
    wrapper.unmount()
  })

  it('supports host identity slots, commission-column visibility, and reload', async () => {
    const request = vi.fn(async () => ({
      rows: [{
        agent_user_id: 'external-bob',
        commission_amount: '2',
        id: '1',
        symbol: 'XAUUSDT',
        user_id: '9002',
      }],
      total: 1,
    }))
    const wrapper = mount(FeeCommissionTable, {
      props: { request, showCommissionAmount: false },
      slots: {
        'cell-agent_user_id': ({ row }: { row: { agent_user_id: string } }) => `EXT:${row.agent_user_id}`,
        'cell-public_user_id': ({ row }: { row: { user_id: string } }) => `UID:${row.user_id}`,
        'cell-symbol': ({ row }: { row: { symbol: string } }) => `PAIR:${row.symbol}`,
      },
    })
    await flushPromises()

    expect(wrapper.findAll('thead th').map(header => header.text())).not.toContain('返佣金额(U)')
    expect(wrapper.text()).toContain('EXT:external-bob')
    expect(wrapper.text()).toContain('UID:9002')
    expect(wrapper.text()).toContain('PAIR:XAUUSDT')

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
})
