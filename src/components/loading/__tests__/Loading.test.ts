import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import Loading from '../Loading.vue'

afterEach(() => {
  document.querySelectorAll('.mm-loading').forEach((element) => element.remove())
})

describe('MmLoading', () => {
  it('renders an accessible inline loading state', () => {
    const wrapper = mount(Loading, { props: { text: '同步审计记录', visible: true } })

    const loading = wrapper.get('[data-mm-component="loading"]')
    expect(loading.attributes('role')).toBe('status')
    expect(loading.attributes('aria-live')).toBe('polite')
    expect(loading.attributes('aria-label')).toBe('同步审计记录')
    expect(wrapper.text()).toContain('同步审计记录')
  })

  it('teleports fullscreen state and removes it when hidden', async () => {
    const wrapper = mount(Loading, {
      attachTo: document.body,
      props: { fullscreen: true, text: '正在发布', visible: true },
    })

    expect(document.body.querySelector('.mm-loading.is-fullscreen')).not.toBeNull()
    await wrapper.setProps({ visible: false })
    await nextTick()
    expect(document.body.querySelector('.mm-loading.is-fullscreen')).toBeNull()
  })
})
