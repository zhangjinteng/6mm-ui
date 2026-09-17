import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import MarginChangeLogTable from '../MarginChangeLogTable.vue'

describe('MmMarginChangeLogTable', () => {
  it('normalizes the initial query and renders margin-change rows', async () => {
    const request = vi.fn(async () => ({
      rows: [{
        balance_after: '109',
        balance_before: '100',
        biz_type: 'FEE_COMMISSION',
        created_at: '2026-08-19 17:16:20.900410+08:00',
        currency: 'USDT',
        delta_amount: '9',
        id: 10,
        user_id: 9001,
        user_type: 1,
        username: 'alice',
      }],
      total: 1,
    }))
    const wrapper = mount(MarginChangeLogTable, { props: { request } })

    await flushPromises()

    expect(request).toHaveBeenCalledWith(
      {
        biz_type: '',
        end_time: '',
        include_zero_amount: 0,
        order_by: 'created_at',
        order_dir: 'desc',
        page_no: 1,
        page_size: 20,
        start_time: '',
        user_id: '',
        user_type: '',
        username: '',
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
    expect(wrapper.get('[data-mm-component="pro-table"]').attributes('aria-label')).toBe('保证金账变记录')
    expect(wrapper.text()).toContain('手续费返佣')
    expect(wrapper.text()).toContain('+9.00')
    expect(wrapper.text()).toContain('109.00')
    expect(wrapper.text()).toContain('2026-08-19 17:16:20')
    expect(wrapper.text()).not.toContain('.900410+08:00')
    wrapper.unmount()
  })

  it('normalizes filters and expands grouped business-type options', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(MarginChangeLogTable, {
      props: { includeZeroAmount: true, request },
    })
    await flushPromises()

    wrapper.findComponent(MmQueryBar).vm.$emit('query', {
      biz_type: 'fee,handling_fee',
      time_range: ['2026-08-01', '2026-08-02'],
      user_id: ' 9002 ',
      user_type: 2,
      username: ' bob ',
    })
    await flushPromises()

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        biz_types: ['fee', 'handling_fee'],
        end_time: '2026-08-02 23:59:59',
        include_zero_amount: 1,
        start_time: '2026-08-01 00:00:00',
        user_id: '9002',
        user_type: 2,
        username: 'bob',
      }),
      expect.any(Object),
    )
    wrapper.unmount()
  })

  it('supports transfer mode, hidden types, business slots, and reload', async () => {
    const request = vi.fn(async () => ({
      rows: [{
        biz_type: 'TRANSFER_OUT',
        currency: 'USDT',
        delta_amount: '0',
        id: 1,
        transfer_amount: '-200',
        user_id: 9001,
      }],
      total: 1,
    }))
    const wrapper = mount(MarginChangeLogTable, {
      props: {
        allowedBizTypes: ['TRANSFER_IN', 'TRANSFER_OUT', 'FEE_COMMISSION', 'COMMISSION_REBATE'],
        hiddenBizTypes: ['fee_commission', 'commission_rebate'],
        includeZeroAmount: true,
        request,
        showTransferAmount: true,
        showTransferStatus: true,
      },
      slots: {
        'cell-currency': ({ row }: { row: { currency: string } }) => `COIN:${row.currency}`,
        'cell-user_id': ({ row }: { row: { user_id: number } }) => `UID:${row.user_id}`,
      },
    })
    await flushPromises()

    expect(wrapper.findAll('thead th').map(header => header.text())).toEqual(expect.arrayContaining([
      '划转金额',
      '状态',
    ]))
    expect(wrapper.text()).toContain('200.00')
    expect(wrapper.text()).toContain('已完成')
    expect(wrapper.text()).toContain('COIN:USDT')
    expect(wrapper.text()).toContain('UID:9001')
    const queryFields = wrapper.findComponent(MmQueryBar).props('fields') as Array<{
      key: string
      options?: Array<{ label: string }>
    }>
    const bizTypeField = queryFields.find(field => field.key === 'biz_type')
    expect(bizTypeField?.options?.map(option => option.label)).not.toContain('手续费返佣')

    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    expect(request).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })
})
