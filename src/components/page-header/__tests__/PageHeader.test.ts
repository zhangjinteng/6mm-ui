import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PageHeader from '../PageHeader.vue'

describe('MmPageHeader', () => {
  it('renders title hierarchy, breadcrumbs and emits back', async () => {
    const wrapper = mount(PageHeader, {
      props: {
        breadcrumbs: [
          { href: '/strategies', label: '策略中心' },
          { label: '网格 #2048' },
        ],
        showBack: true,
        subtitle: 'BTC-USDT · 永续',
        title: '策略详情',
      },
    })
    expect(wrapper.attributes('aria-label')).toBe('策略详情')
    expect(wrapper.get('h1').text()).toBe('策略详情')
    expect(wrapper.get('.mm-page-header__subtitle').text()).toBe('BTC-USDT · 永续')
    expect(wrapper.get('nav').attributes('aria-label')).toBe('面包屑')
    expect(wrapper.findAll('.mm-page-header__breadcrumb-item').at(-1)?.attributes('aria-current')).toBe('page')

    await wrapper.get('.mm-page-header__back').trigger('click')
    expect(wrapper.emitted('back')).toHaveLength(1)
  })

  it('supports breadcrumb, title, extra and content slots', () => {
    const wrapper = mount(PageHeader, {
      props: { title: '后备标题' },
      slots: {
        breadcrumb: '<span class="custom-breadcrumb">自定义路径</span>',
        default: '<div class="page-summary">页面摘要</div>',
        extra: '<button class="page-action">创建任务</button>',
        title: '<span>自定义标题</span>',
      },
    })
    expect(wrapper.get('h1').text()).toBe('自定义标题')
    expect(wrapper.find('.custom-breadcrumb').exists()).toBe(true)
    expect(wrapper.find('.page-action').exists()).toBe(true)
    expect(wrapper.find('.page-summary').exists()).toBe(true)
  })
})
