import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Table from '../Table.vue'
import type { TableColumn, TableRow } from '../types'

const columns: TableColumn[] = [
  { dataIndex: 'market', fixed: 'left', key: 'market', sortable: true, title: '市场', width: 160 },
  { dataIndex: 'pnl', key: 'pnl', title: '盈亏', width: 120 },
]
const data: TableRow[] = [
  { id: 'btc', market: 'BTC-USDT', name: 'BTC-USDT', pnl: 128.4 },
  { id: 'eth', market: 'ETH-USDT', name: 'ETH-USDT', pnl: -21.3 },
]

describe('MmTable', () => {
  it('renders stable rows, cell slots, fixed columns, and controlled sorting', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, hoverable: true, rowKey: 'id', sort: { key: 'market', order: null }, striped: true },
      slots: { 'cell-pnl': ({ value }: { value: unknown }) => `${Number(value)} USDT` },
    })
    expect(wrapper.get('[data-row-key="btc"]').text()).toContain('128.4 USDT')
    expect(wrapper.get('th.is-fixed-left').attributes('style')).toContain('left: 0px')
    await wrapper.get('[aria-label="按市场升序排列"]').trigger('click')
    expect(wrapper.emitted('update:sort')?.[0]).toEqual([{ key: 'market', order: 'asc' }])
    expect(wrapper.emitted('sort-change')?.[0]).toEqual([{ key: 'market', order: 'asc' }])
  })

  it('caps fixed-right columns at their configured width', () => {
    const fixedColumns: TableColumn[] = [
      { dataIndex: 'market', fixed: 'left', key: 'market', title: '市场', width: 160 },
      { dataIndex: 'pnl', key: 'pnl', title: '盈亏', width: 120 },
      { fixed: 'right', key: 'action', title: '操作', width: 40 },
    ]
    const wrapper = mount(Table, { props: { columns: fixedColumns, data: [data[0]!] } })
    const fixedRightHeaderStyle = wrapper.get('th.is-fixed-right').attributes('style')
    const fixedRightCellStyle = wrapper.get('td.is-fixed-right').attributes('style')

    expect(fixedRightHeaderStyle).toContain('width: 40px')
    expect(fixedRightHeaderStyle).toContain('min-width: 40px')
    expect(fixedRightHeaderStyle).toContain('max-width: 40px')
    expect(fixedRightCellStyle).toContain('max-width: 40px')
    expect(wrapper.get('th.is-fixed-left').attributes('style')).not.toContain('max-width')
  })

  it('keeps the header outside the bounded body scroller and synchronizes horizontal scrolling', async () => {
    const wrapper = mount(Table, {
      props: { columns, data, maxHeight: 'min(380px, 45vh)' },
    })
    const viewport = wrapper.get('.mm-table__viewport')
    const header = wrapper.get('.mm-table__header-scroll')
    const body = wrapper.get('.mm-table__scroll')

    expect(viewport.attributes('style')).toContain('max-height: min(380px, 45vh)')
    expect(viewport.element.children[0]).toBe(header.element.parentElement)
    expect(viewport.element.children[1]).toBe(body.element)

    Object.defineProperty(body.element, 'scrollLeft', { configurable: true, value: 96, writable: true })
    await body.trigger('scroll')
    expect((header.element as HTMLElement).scrollLeft).toBe(96)
  })

  it('sorts local rows through ascending, descending, and default order', async () => {
    const sortableColumns: TableColumn[] = [
      { dataIndex: 'value', key: 'value', sortable: true, title: '数值' },
    ]
    const sortableData: TableRow[] = [
      { id: 'original-first', value: '10' },
      { id: 'original-second', value: '2' },
      { id: 'empty', value: '-' },
      { id: 'same-first', value: '2' },
    ]
    const wrapper = mount(Table, { props: { columns: sortableColumns, data: sortableData, rowKey: 'id' } })
    const rowKeys = () => wrapper.findAll('tbody tr').map((row) => row.attributes('data-row-key'))

    expect(rowKeys()).toEqual(['original-first', 'original-second', 'empty', 'same-first'])
    expect(wrapper.get('th').attributes('aria-sort')).toBe('none')

    await wrapper.get('[aria-label="按数值升序排列"]').trigger('click')
    expect(rowKeys()).toEqual(['original-second', 'same-first', 'original-first', 'empty'])
    expect(wrapper.get('th').attributes('aria-sort')).toBe('ascending')
    expect(wrapper.get('[aria-label="按数值降序排列"]')).toBeTruthy()

    await wrapper.get('[aria-label="按数值降序排列"]').trigger('click')
    expect(rowKeys()).toEqual(['empty', 'original-first', 'original-second', 'same-first'])
    expect(wrapper.get('th').attributes('aria-sort')).toBe('descending')

    await wrapper.get('[aria-label="按数值默认顺序排列"]').trigger('click')
    expect(rowKeys()).toEqual(['original-first', 'original-second', 'empty', 'same-first'])
    expect(wrapper.get('th').attributes('aria-sort')).toBe('none')
  })

  it('updates sorting when controlled with v-model', async () => {
    const Host = defineComponent({
      components: { Table },
      setup: () => ({ columns, data, sort: ref({ key: 'market', order: null as 'asc' | 'desc' | null }) }),
      template: '<Table v-model:sort="sort" :columns="columns" :data="data" row-key="id" />',
    })
    const wrapper = mount(Host)

    await wrapper.get('[aria-label="按市场升序排列"]').trigger('click')
    expect(wrapper.get('th').attributes('aria-sort')).toBe('ascending')
    expect(wrapper.get('[aria-label="按市场降序排列"]')).toBeTruthy()
  })

  it('emits manual sorting without reordering server-supplied rows', async () => {
    const Host = defineComponent({
      components: { Table },
      setup: () => ({ columns, data: [...data].reverse(), sort: ref({ key: 'market', order: null as 'asc' | 'desc' | null }) }),
      template: '<Table v-model:sort="sort" :columns="columns" :data="data" row-key="id" sort-mode="manual" />',
    })
    const wrapper = mount(Host)
    const rowKeys = () => wrapper.findAll('tbody tr').map((row) => row.attributes('data-row-key'))

    await wrapper.get('[aria-label="按市场升序排列"]').trigger('click')

    expect(rowKeys()).toEqual(['eth', 'btc'])
  })

  it('supports controlled row selection and expansion', async () => {
    const Host = defineComponent({
      components: { Table },
      setup: () => ({ columns, data, expanded: ref<Array<number | string>>([]), selected: ref<Array<number | string>>([]) }),
      template: `
        <Table v-model:selected-row-keys="selected" v-model:expanded-row-keys="expanded" :columns="columns" :data="data" selectable>
          <template #expanded-row="{ row }"><div data-detail>详情 {{ row.market }}</div></template>
        </Table>
      `,
    })
    const wrapper = mount(Host)
    await wrapper.get('[aria-label="选择 BTC-USDT"]').setValue(true)
    expect(wrapper.get('[aria-label="选择 BTC-USDT"]').attributes('checked')).toBeDefined()
    await wrapper.get('[aria-label="展开 BTC-USDT"]').trigger('click')
    expect(wrapper.get('[data-detail]').text()).toContain('BTC-USDT')
  })

  it('renders loading and empty states', async () => {
    const wrapper = mount(Table, { props: { columns, data: [], emptyText: '没有成交', loading: true } })
    expect(wrapper.get('.mm-table__loading').attributes('role')).toBe('status')
    await wrapper.setProps({ loading: false })
    expect(wrapper.text()).toContain('没有成交')
  })

  it('adds native titles to default cells when enabled without overriding custom cells', () => {
    const titleColumns: TableColumn[] = [
      { dataIndex: 'market', key: 'market', title: '市场' },
      { dataIndex: 'pnl', formatter: (value) => `${value} USDT`, key: 'pnl', title: '盈亏' },
      { dataIndex: 'note', key: 'note', title: '备注' },
    ]
    const wrapper = mount(Table, {
      props: { columns: titleColumns, data: [data[0]!], showCellTitle: true },
      slots: { 'cell-pnl': ({ value }: { value: unknown }) => `${value} USDT` },
    })
    const cells = wrapper.findAll('tbody td')

    expect(cells[0]?.attributes('title')).toBe('BTC-USDT')
    expect(cells[1]?.attributes('title')).toBeUndefined()
    expect(cells[2]?.attributes('title')).toBeUndefined()
  })
})
