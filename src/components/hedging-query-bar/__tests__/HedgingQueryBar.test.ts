import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import HedgingQueryBar from '../HedgingQueryBar.vue'
import { MmFilterDrawer } from '../../filter-drawer'
import type { QueryBarField } from '../../query-bar'

const fields: QueryBarField[] = [
  { key: 'keyword', label: '任务编号', type: 'keyword', width: 220 },
  { key: 'agentId', label: '来源', type: 'select', options: [] },
  { key: 'enabled', label: '对冲开关', type: 'select', options: [{ label: '开启', value: '1' }, { label: '关闭', value: '0' }], defaultValue: '1' },
]
const columns = [{ key: 'task_no', title: '任务编号' }, { key: 'symbol', title: '合约' }]
afterEach(() => { document.body.innerHTML = '' })

describe('hedging query workspace', () => {
  it('uses the standard single-line query bar with query, reset, refresh, columns and filters', async () => {
    const wrapper = mount(HedgingQueryBar, {
      props: { columns, fields, modelValue: { keyword: '', agentId: '', enabled: '1' }, title: '筛选对冲' },
    })
    expect(wrapper.get('.mm-query-bar').classes()).toContain('mm-query-bar--single-line')
    expect(wrapper.findAll('[data-pro-table-tool]').map(tool => tool.attributes('data-pro-table-tool')))
      .toEqual(['refresh', 'columns', 'filter-drawer'])
    expect(wrapper.find('[aria-label="自动刷新间隔"]').exists()).toBe(false)
    await wrapper.get('[data-query-field="keyword"] input').setValue('task-12')
    await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')!.at(-1)![0] as Record<string, string> })
    await wrapper.get('[data-query-action="query"]').trigger('click')
    expect(wrapper.emitted('query')?.at(-1)).toEqual([{ keyword: 'task-12', agentId: '', enabled: '1' }])
    await wrapper.get('[data-query-action="reset"]').trigger('click')
    expect(wrapper.emitted('reset')?.at(-1)).toEqual([{ keyword: '', agentId: '', enabled: '1' }])
    await wrapper.get('[data-pro-table-tool="refresh"]').trigger('click')
    expect(wrapper.emitted('refresh')).toHaveLength(1)
    wrapper.unmount()
  })

  it('submits the current drawer draft when a custom source changes, without a nested form', async () => {
    const wrapper = mount(HedgingQueryBar, {
      attachTo: document.body,
      props: { columns, fields, modelValue: { keyword: 'initial', agentId: '', enabled: '1' }, title: '筛选对冲' },
      slots: { 'source-filter': ({ search }) => h('button', { type: 'button', 'data-source-submit': '', onClick: search }, 'Source') },
    })
    expect(wrapper.findAll('form form')).toHaveLength(0)
    await wrapper.getComponent(MmFilterDrawer).vm.open()
    await flushPromises()
    const drawer = document.body.querySelector<HTMLElement>('[data-mm-component="drawer"]')!
    const input = drawer.querySelector<HTMLInputElement>('[data-query-field="keyword"] input')!
    input.value = 'drawer-task'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await flushPromises()
    drawer.querySelector<HTMLButtonElement>('[data-source-submit]')!.click()
    await flushPromises()
    expect(wrapper.emitted('source-query')?.at(-1)).toEqual([{ keyword: 'drawer-task', agentId: '', enabled: '1' }])
    expect(wrapper.emitted('query')).toBeUndefined()
    expect(wrapper.getComponent(MmFilterDrawer).props('open')).not.toBe(true)
    wrapper.unmount()
  })
})
