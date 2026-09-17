import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { MmSelect } from '../../select'
import Pagination from '../Pagination.vue'

describe('MmPagination', () => {
  it('navigates pages, jumps, and changes page size through controlled events', async () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 5, pageSize: 10, showJumper: true, showSizeChanger: true, total: 230 },
    })
    expect(wrapper.attributes('role')).toBe('navigation')
    expect(wrapper.getComponent(MmSelect).attributes('aria-label')).toBeUndefined()
    expect(wrapper.getComponent(MmSelect).get('[role="combobox"]').attributes('aria-label')).toBe('每页条数')
    expect(wrapper.getComponent(MmSelect).text()).toContain('10 条/页')
    expect(wrapper.get('[aria-current="page"]').text()).toBe('5')
    expect(wrapper.findAll('.mm-pagination__ellipsis').length).toBeGreaterThan(0)

    await wrapper.get('[aria-label="下一页"]').trigger('click')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([6])

    wrapper.getComponent(MmSelect).vm.$emit('update:modelValue', 20)
    expect(wrapper.emitted('update:pageSize')?.[0]).toEqual([20])
    expect(wrapper.emitted('size-change')?.[0]).toEqual([20])

    const jumper = wrapper.get<HTMLInputElement>('.mm-pagination__jumper input')
    await jumper.setValue('99')
    await jumper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:currentPage')?.at(-1)).toEqual([23])
  })

  it('disables boundary navigation and reports totals', () => {
    const wrapper = mount(Pagination, { props: { currentPage: 1, disabled: true, pageSize: 20, total: 42 } })
    expect(wrapper.text()).toContain('共 42 条')
    expect(wrapper.findAll('button').every((button) => button.attributes('disabled') !== undefined)).toBe(true)
  })
})
