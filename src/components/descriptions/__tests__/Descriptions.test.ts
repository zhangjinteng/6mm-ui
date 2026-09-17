import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { describe, expect, it } from 'vitest'

import Descriptions from '../Descriptions.vue'
import DescriptionsItem from '../DescriptionsItem.vue'

describe('MmDescriptions', () => {
  it('renders responsive columns, borders, labels, and spans', () => {
    const wrapper = mount(Descriptions, {
      props: { bordered: true, column: 3, title: '账户信息' },
      slots: {
        default: () => [
          h(DescriptionsItem, { label: '账户' }, () => 'alpha'),
          h(DescriptionsItem, { label: '权限', span: 2 }, () => '管理员'),
        ],
        extra: '<button>编辑</button>',
      },
    })

    expect(wrapper.classes()).toContain('is-bordered')
    expect(wrapper.attributes('style')).toContain('--mm-descriptions-columns: 3')
    expect(wrapper.get('.mm-descriptions__title').text()).toBe('账户信息')
    expect(wrapper.findAll('.mm-descriptions-item')).toHaveLength(2)
    expect(wrapper.findAll('.mm-descriptions-item')[1]!.attributes('style')).toContain('--mm-descriptions-span: 2')
  })

  it('supports vertical direction and label slots', () => {
    const wrapper = mount(Descriptions, {
      props: { direction: 'vertical' },
      slots: {
        default: () => h(DescriptionsItem, {}, {
          default: () => '正常',
          label: () => h('strong', '状态'),
        }),
      },
    })
    expect(wrapper.classes()).toContain('mm-descriptions--vertical')
    expect(wrapper.get('strong').text()).toBe('状态')
  })
})
