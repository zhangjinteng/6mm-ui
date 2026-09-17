import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { MmCursorPagination } from '../../cursor-pagination'
import ProTableCursorPagination from '../ProTableCursorPagination.vue'

describe('MmProTableCursorPagination', () => {
  it('renders the visible cursor range and forwards navigation events', () => {
    const wrapper = mount(ProTableCursorPagination, {
      props: {
        currentPage: 2,
        hasMore: true,
        pageSize: 15,
        rowCount: 7,
      },
    })

    expect(wrapper.get('.mm-pro-table__pagination-summary').text()).toBe(
      '显示 16-22 条，第 2 页',
    )

    const pagination = wrapper.getComponent(MmCursorPagination)
    pagination.vm.$emit('prev')
    pagination.vm.$emit('next')

    expect(wrapper.emitted('prev')).toHaveLength(1)
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

  it('renders an empty-page summary', () => {
    const wrapper = mount(ProTableCursorPagination, {
      props: {
        currentPage: 3,
        rowCount: 0,
      },
    })

    expect(wrapper.get('.mm-pro-table__pagination-summary').text()).toBe(
      '第 3 页，暂无记录',
    )
  })
})
