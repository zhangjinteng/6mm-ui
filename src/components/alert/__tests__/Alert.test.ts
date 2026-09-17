import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Alert from '../Alert.vue'

describe('MmAlert', () => {
  it('renders semantic content and closes once', async () => {
    const wrapper = mount(Alert, {
      props: {
        closable: true,
        description: '签名将在 15 分钟后失效',
        title: '凭证即将过期',
        type: 'warning',
      },
    })

    expect(wrapper.attributes('role')).toBe('alert')
    expect(wrapper.attributes('aria-live')).toBe('assertive')
    expect(wrapper.text()).toContain('凭证即将过期')
    expect(wrapper.text()).toContain('签名将在 15 分钟后失效')

    await wrapper.get('button[aria-label="关闭提醒"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.find('[data-mm-component="alert"]').exists()).toBe(false)
  })

  it('uses a polite live region for informational banners', () => {
    const wrapper = mount(Alert, {
      props: { banner: true, title: '系统维护窗口已更新', type: 'info' },
    })

    expect(wrapper.classes()).toContain('is-banner')
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-live')).toBe('polite')
  })
})
