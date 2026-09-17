import { mount } from '@vue/test-utils'
import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'

import { vMmLoading } from '../loading'

afterEach(() => {
  document.querySelectorAll('.mm-loading').forEach((element) => element.remove())
})

describe('v-mm-loading', () => {
  it('mounts, updates, and destroys a scoped loading layer', async () => {
    const active = ref(true)
    const text = ref('正在校验')
    const host = defineComponent({
      setup: () => ({ active, text }),
      template: '<section data-host v-mm-loading="{ visible: active, text }"><span>内容</span></section>',
    })
    const wrapper = mount(host, {
      attachTo: document.body,
      global: { directives: { 'mm-loading': vMmLoading } },
    })

    expect(wrapper.get('[data-host]').find('.mm-loading').text()).toContain('正在校验')
    text.value = '正在提交'
    await nextTick()
    expect(wrapper.get('[data-host]').find('.mm-loading').text()).toContain('正在提交')
    active.value = false
    await nextTick()
    expect(wrapper.get('[data-host]').find('.mm-loading').exists()).toBe(false)

    wrapper.unmount()
    expect(document.querySelector('.mm-loading')).toBeNull()
  })

  it('cleans up a fullscreen layer idempotently', async () => {
    const active = ref(true)
    const host = defineComponent({
      setup: () => ({ active }),
      template: '<div v-mm-loading="{ visible: active, fullscreen: true }" />',
    })
    const wrapper = mount(host, {
      global: { directives: { 'mm-loading': vMmLoading } },
    })

    expect(document.body.querySelector('.mm-loading.is-fullscreen')).not.toBeNull()
    wrapper.unmount()
    wrapper.unmount()
    await nextTick()
    expect(document.body.querySelector('.mm-loading.is-fullscreen')).toBeNull()
  })
})
