import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import MmUI, {
  message,
  MmPagination,
  MmSelect,
  type MmUILocaleName,
} from '../index'

const LocaleHost = defineComponent({
  components: { MmPagination, MmSelect },
  template: `
    <div>
      <MmPagination :current-page="2" :total="42" />
      <MmSelect :options="[]" />
      <MmSelect :options="[]" placeholder="Business placeholder" />
    </div>
  `,
})

afterEach(() => message.closeAll())

describe('MmUI locale', () => {
  it('uses English built-in text from a static plugin option', () => {
    const wrapper = mount(LocaleHost, {
      global: { plugins: [[MmUI, { locale: 'en-US' }]] },
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Pagination')
    expect(wrapper.get('.mm-pagination__total').text()).toBe('42 items')
    expect(wrapper.findAll('.mm-select__value')[0]?.text()).toBe('Select')
    expect(wrapper.findAll('.mm-select__value')[1]?.text()).toBe('Business placeholder')
  })

  it('updates components and service overlays when a locale ref changes', async () => {
    const locale = ref<MmUILocaleName>('zh-CN')
    const wrapper = mount(LocaleHost, {
      global: { plugins: [[MmUI, { locale }]] },
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('分页导航')
    expect(wrapper.get('.mm-pagination__total').text()).toBe('共 42 条')

    message.info({ duration: 0, message: 'Saved' })
    await nextTick()
    expect(document.body.querySelector('.mm-message-stack')?.getAttribute('aria-label')).toBe('消息通知')

    locale.value = 'en-US'
    await nextTick()

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Pagination')
    expect(wrapper.get('.mm-pagination__total').text()).toBe('42 items')
    expect(document.body.querySelector('.mm-message-stack')?.getAttribute('aria-label')).toBe('Notifications')
    expect(document.body.querySelector('.mm-message__close')?.getAttribute('aria-label')).toBe('Close message')
  })
})
