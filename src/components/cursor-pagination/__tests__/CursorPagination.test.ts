import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CursorPagination from '../CursorPagination.vue'

describe('MmCursorPagination', () => {
  it('emits sequential cursor navigation events', async () => {
    const wrapper = mount(CursorPagination, {
      props: {
        currentPage: 2,
        hasMore: true,
      },
    })

    expect(wrapper.attributes('role')).toBe('navigation')
    expect(wrapper.attributes('data-mm-component')).toBe('cursor-pagination')
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2')

    await wrapper.get('[aria-label="上一页"]').trigger('click')
    await wrapper.get('[aria-label="下一页"]').trigger('click')

    expect(wrapper.emitted('prev')).toHaveLength(1)
    expect(wrapper.emitted('next')).toHaveLength(1)
  })

  it('disables unavailable directions and all actions while loading', async () => {
    const firstPage = mount(CursorPagination, {
      props: {
        currentPage: 1,
        hasMore: false,
      },
    })

    expect(firstPage.get('[aria-label="上一页"]').attributes('disabled')).toBeDefined()
    expect(firstPage.get('[aria-label="下一页"]').attributes('disabled')).toBeDefined()

    const loading = mount(CursorPagination, {
      props: {
        currentPage: 3,
        hasMore: true,
        loading: true,
      },
    })

    expect(loading.attributes('aria-busy')).toBe('true')
    expect(loading.findAll('button').every((button) => button.attributes('disabled') !== undefined)).toBe(true)
  })

  it('supports an explicit previous-page capability', async () => {
    const wrapper = mount(CursorPagination, {
      props: {
        currentPage: 1,
        hasPrevious: true,
      },
    })

    await wrapper.get('[aria-label="上一页"]').trigger('click')
    expect(wrapper.emitted('prev')).toHaveLength(1)
  })
})
