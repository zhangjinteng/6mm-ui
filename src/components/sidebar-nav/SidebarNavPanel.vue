<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmIcon } from '../icon'
import { MmMenu, MmMenuItem, MmSubMenu } from '../menu'
import type { MenuValue } from '../menu'
import { MmPopover } from '../popover'
import { MmScrollbar } from '../scrollbar'
import { MmTooltip } from '../tooltip'
import type { SidebarNavChildItem, SidebarNavItem } from './types'

const props = withDefaults(defineProps<{
  activeKey?: MenuValue
  ariaLabel?: string
  as?: string
  collapsed?: boolean
  items?: SidebarNavItem[]
  mobile?: boolean
  openKeys?: MenuValue[]
  placement?: 'left' | 'right'
  showBrand?: boolean
  style?: CSSProperties
}>(), {
  activeKey: undefined,
  as: 'aside',
  collapsed: false,
  items: () => [],
  mobile: false,
  openKeys: () => [],
  placement: 'left',
  showBrand: true,
  style: undefined,
})

const emit = defineEmits<{
  'open-change': [keys: MenuValue[]]
  select: [item: SidebarNavChildItem]
}>()
const { messages } = useLocale()
const resolvedAriaLabel = computed(() => props.ariaLabel ?? messages.value.sidebar.ariaLabel)

const activeParentKeys = computed(() => new Set(props.items
  .filter((item) => item.children?.some((child) => Object.is(child.key, props.activeKey)))
  .map((item) => item.key)))

function isActive(value: MenuValue): boolean {
  return Object.is(value, props.activeKey)
}

function isActivePath(item: SidebarNavItem): boolean {
  return isActive(item.key) || activeParentKeys.value.has(item.key)
}

function findItem(value: MenuValue): SidebarNavChildItem | undefined {
  for (const item of props.items) {
    if (Object.is(item.key, value)) return item
    const child = item.children?.find((entry) => Object.is(entry.key, value))
    if (child) return child
  }
  return undefined
}

function handleSelect(value: MenuValue): void {
  const item = findItem(value)
  if (item) emit('select', item)
}

function handleFlyoutSelect(value: MenuValue, close: (restoreFocus?: boolean) => void): void {
  handleSelect(value)
  close(true)
}
</script>

<template>
  <component
    :is="as"
    class="mm-sidebar-nav"
    :class="[
      `mm-sidebar-nav--${placement}`,
      { 'is-collapsed': collapsed, 'is-mobile': mobile },
    ]"
    data-mm-component="sidebar-nav"
    :data-sidebar-mode="mobile ? 'mobile' : collapsed ? 'collapsed' : 'expanded'"
    :aria-label="as === 'aside' ? resolvedAriaLabel : undefined"
    :style="style"
  >
    <header v-if="showBrand && $slots.brand" class="mm-sidebar-nav__brand">
      <slot name="brand" :collapsed="collapsed" :mobile="mobile" />
    </header>

    <div class="mm-sidebar-nav__main">
      <MmScrollbar :height="'100%'" :tabindex="collapsed ? -1 : 0">
        <MmMenu
          v-if="!collapsed"
          class="mm-sidebar-nav__expanded-menu"
          :model-value="activeKey"
          :open-keys="openKeys"
          :aria-label="resolvedAriaLabel"
          @open-change="emit('open-change', $event)"
          @select="handleSelect"
        >
          <template v-for="item in items" :key="item.key">
            <MmSubMenu
              v-if="item.children?.length"
              :value="item.key"
              :label="item.label"
              :disabled="item.disabled"
              :class="{ 'is-active-path': isActivePath(item) }"
              :data-sidebar-group="item.key"
            >
              <template v-if="item.icon" #icon><MmIcon :name="item.icon" :size="16" /></template>
              <template #chevron><MmIcon name="chevron-down" :size="13" /></template>
              <MmMenuItem
                v-for="child in item.children"
                :key="child.key"
                :value="child.key"
                :disabled="child.disabled"
                :data-sidebar-item="child.key"
              >
                <template v-if="child.icon" #icon><MmIcon :name="child.icon" :size="14" /></template>
                {{ child.label }}
              </MmMenuItem>
            </MmSubMenu>
            <MmMenuItem
              v-else
              :value="item.key"
              :disabled="item.disabled"
              :data-sidebar-item="item.key"
            >
              <template v-if="item.icon" #icon><MmIcon :name="item.icon" :size="16" /></template>
              {{ item.label }}
            </MmMenuItem>
          </template>
        </MmMenu>

        <nav v-else class="mm-sidebar-nav__collapsed-menu" :aria-label="resolvedAriaLabel">
          <template v-for="item in items" :key="item.key">
            <MmPopover
              v-if="item.children?.length"
              :close-delay="120"
              floating-class="mm-sidebar-nav__flyout"
              :offset="7"
              :open-delay="0"
              placement="right-start"
              role="menu"
              :show-arrow="false"
              trigger="hover-focus"
              :width="220"
            >
              <template #default="{ triggerAttrs }">
                <button
                  v-bind="triggerAttrs"
                  class="mm-sidebar-nav__collapsed-trigger"
                  :class="{ 'is-active-path': isActivePath(item) }"
                  type="button"
                  :disabled="item.disabled"
                  :aria-label="item.label"
                  :data-sidebar-collapsed-group="item.key"
                >
                  <MmIcon v-if="item.icon" :name="item.icon" :size="16" />
                  <span v-else aria-hidden="true">•</span>
                </button>
              </template>
              <template #content="{ close }">
                <header class="mm-sidebar-nav__flyout-header">{{ item.label }}</header>
                <MmMenu
                  :model-value="activeKey"
                  :aria-label="messages.sidebar.submenu(item.label)"
                  @select="handleFlyoutSelect($event, close)"
                >
                  <MmMenuItem
                    v-for="child in item.children"
                    :key="child.key"
                    :value="child.key"
                    :disabled="child.disabled"
                    :data-sidebar-item="child.key"
                  >
                    <template v-if="child.icon" #icon><MmIcon :name="child.icon" :size="14" /></template>
                    {{ child.label }}
                  </MmMenuItem>
                </MmMenu>
              </template>
            </MmPopover>

            <MmTooltip v-else :content="item.label" placement="right" :open-delay="0">
              <template #default="{ triggerAttrs }">
                <button
                  v-bind="triggerAttrs"
                  class="mm-sidebar-nav__collapsed-trigger"
                  :class="{ 'is-active-path': isActivePath(item) }"
                  type="button"
                  :disabled="item.disabled"
                  :aria-label="item.label"
                  :data-sidebar-collapsed-item="item.key"
                  @click="emit('select', item)"
                >
                  <MmIcon v-if="item.icon" :name="item.icon" :size="16" />
                  <span v-else aria-hidden="true">•</span>
                </button>
              </template>
            </MmTooltip>
          </template>
        </nav>
      </MmScrollbar>
    </div>

    <footer v-if="$slots.footer" class="mm-sidebar-nav__footer">
      <slot name="footer" :collapsed="collapsed" :mobile="mobile" />
    </footer>
  </component>
</template>
