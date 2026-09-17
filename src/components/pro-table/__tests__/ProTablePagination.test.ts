import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ProTablePagination from '../ProTablePagination.vue'

describe('MmProTablePagination', () => {
  it('renders the pro table range summary around pagination controls', () => {
    const wrapper = mount(ProTablePagination, {
      props: {
        currentPage: 1,
        pageSize: 15,
        pageSizes: [15, 30],
        total: 15,
      },
    })

    expect(wrapper.get('footer').classes()).toContain('mm-pro-table__pagination')
    expect(wrapper.get('.mm-pro-table__pagination-summary').text()).toBe('显示 1-15 条，第 1 页')
    expect(wrapper.get('.mm-pagination__total').text()).toBe('共 15 条')
    expect(wrapper.get('.mm-pagination__size').text()).toContain('15 条/页')
  })

  it('emits page and size changes from the underlying pagination', async () => {
    const wrapper = mount(ProTablePagination, {
      props: {
        currentPage: 1,
        pageSize: 15,
        pageSizes: [15, 30],
        total: 45,
      },
    })

    await wrapper.get('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:currentPage')?.at(-1)).toEqual([2])
    expect(wrapper.emitted('current-change')?.at(-1)).toEqual([2])
  })
})
