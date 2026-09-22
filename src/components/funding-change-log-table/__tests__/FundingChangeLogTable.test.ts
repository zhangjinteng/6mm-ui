import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { MmQueryBar } from '../../query-bar'
import type { QueryBarField, QueryBarSelectField } from '../../query-bar'
import FundingChangeLogTable from '../FundingChangeLogTable.vue'

describe('MmFundingChangeLogTable', () => {
  it('exposes every supported funding change type filter', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(FundingChangeLogTable, { props: { request } })
    await flushPromises()

    const typeField = (
      wrapper.findComponent(MmQueryBar).props('fields') as QueryBarField[]
    ).find(field => field.key === 'change_type') as QueryBarSelectField | undefined

    expect(typeField?.options).toEqual([
      { label: '全部类型', value: '' },
      { label: '用户划入', value: 'deposit' },
      { label: '预测下单扣款', value: 'stake' },
      { label: '预测中奖结算', value: 'payout' },
      { label: '预测退款', value: 'refund' },
      { label: '划转冻结', value: 'transfer_hold_created' },
      { label: '划转失败解冻', value: 'transfer_hold_released' },
      { label: '划转转出', value: 'transfer_out' },
      { label: '划转转入', value: 'transfer_in' },
      { label: '合作商转入', value: 'agent_transfer_in' },
      { label: '合作商转出', value: 'agent_transfer_out' },
    ])

    wrapper.unmount()
  })
})
