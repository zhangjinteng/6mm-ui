import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import Menu from '../Menu.vue'
import MenuItem from '../MenuItem.vue'
import SubMenu from '../SubMenu.vue'

const Host = defineComponent({
  components: { Menu, MenuItem, SubMenu },
  setup: () => ({ openKeys: ref<Array<string | number>>([]), selected: ref<string | number>('overview') }),
  template: `
    <Menu v-model="selected" v-model:open-keys="openKeys" aria-label="控制台导航">
      <MenuItem value="overview">概览</MenuItem>
      <MenuItem value="disabled" disabled>已停用</MenuItem>
      <SubMenu value="settings" label="设置">
        <MenuItem value="profile">账户资料</MenuItem>
        <MenuItem value="security">安全策略</MenuItem>
      </SubMenu>
      <MenuItem value="audit">审计日志</MenuItem>
    </Menu>
  `,
})

describe('MmMenu', () => {
  it('keeps selection controlled and exposes menu semantics', async () => {
    const wrapper = mount(Host)
    const root = wrapper.find('[role="menu"]')
    expect(root.attributes('aria-label')).toBe('控制台导航')
    expect(wrapper.find('[role="menuitem"][aria-current="page"]').text()).toContain('概览')

    const audit = wrapper.findAll('[role="menuitem"]').find((item) => item.text() === '审计日志')
    await audit!.trigger('click')
    expect(wrapper.find('[role="menuitem"][aria-current="page"]').text()).toContain('审计日志')
  })

  it('uses roving tabindex and skips disabled items with arrows, Home and End', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const rootItems = wrapper.findAll<HTMLElement>('[data-mm-menu-level="root"]')
    rootItems[0]!.element.focus()

    await rootItems[0]!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(rootItems[2]!.element)
    await rootItems[2]!.trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(rootItems[3]!.element)
    await rootItems[3]!.trigger('keydown', { key: 'Home' })
    expect(document.activeElement).toBe(rootItems[0]!.element)
    wrapper.unmount()
  })

  it('opens a submenu and supports nested keyboard navigation', async () => {
    const wrapper = mount(Host, { attachTo: document.body })
    const submenu = wrapper.find('.mm-sub-menu')
    const trigger = submenu.find<HTMLButtonElement>('.mm-sub-menu__trigger')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('keydown', { key: 'ArrowRight' })
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const nested = submenu.findAll<HTMLElement>('[data-mm-menu-level="nested"]')
    expect(document.activeElement).toBe(nested[0]!.element)

    await nested[0]!.trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(nested[1]!.element)
    await nested[1]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })
})
