import { mount } from '@vue/test-utils'
import axe from 'axe-core'
import { defineComponent, nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { MmCalendar } from '../../calendar'
import { MmImage } from '../../image'
import { MmPagination } from '../../pagination'
import Table from '../Table.vue'

describe('advanced data display accessibility', () => {
  it('has no automated violations with image preview open', async () => {
    const Host = defineComponent({
      components: { MmCalendar, MmImage, MmPagination, Table },
      setup: () => ({
        columns: [{ dataIndex: 'name', key: 'name', sortable: true, title: '策略' }],
        date: ref('2026-07-16'),
        rows: [{ id: 1, name: '网格策略' }],
      }),
      template: `
        <main>
          <MmImage alt="权益曲线" preview src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E" />
          <MmCalendar v-model="date" displayed-month="2026-07" />
          <Table :columns="columns" :data="rows" selectable />
          <MmPagination :current-page="1" :total="42" />
        </main>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await wrapper.get('.mm-image__native').trigger('load')
    await wrapper.get('.mm-image__trigger').trigger('click')
    await nextTick()
    const result = await axe.run(document.body, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    })
    expect(result.violations).toEqual([])
  })
})
