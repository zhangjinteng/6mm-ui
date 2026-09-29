import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import UserMappingTable from '../UserMappingTable.vue'

describe('MmUserMappingTable', () => {
  it('requests the first page by descending mapping ID', async () => {
    const request = vi.fn(async () => ({
      rows: [{ id: 388, mapping_id: 388, agent_user_id: 'user-100916', user_uid: 8811711436, mapping_status: 'normal' as const }],
      total: 1,
    }))
    const wrapper = mount(UserMappingTable, { props: { request } })
    await flushPromises()

    expect(request).toHaveBeenCalledWith({
      keyword: '', mapping_status: '', exception_type: '', start_time: '', end_time: '',
      order_by: 'mapping_id', order_dir: 'desc', page_no: 1, page_size: 20,
    }, expect.objectContaining({ signal: expect.any(AbortSignal) }))
    expect(wrapper.text()).toContain('user-100916')
    expect(wrapper.text()).toContain('8811711436')
    wrapper.unmount()
  })

  it('passes the optional agent filter when agent options are supplied', async () => {
    const request = vi.fn(async () => ({ rows: [], total: 0 }))
    const wrapper = mount(UserMappingTable, {
      props: { agentOptions: [{ label: 'Agent A', value: '2' }], request },
    })
    await flushPromises()
    expect(request).toHaveBeenCalledWith(expect.objectContaining({ agent_id: '', order_by: 'mapping_id' }), expect.anything())
    wrapper.unmount()
  })
})
