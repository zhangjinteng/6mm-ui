<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useControlled } from '../../composables/use-controlled'
import { useLocale } from '../../composables/use-locale'
import { MmAvatar } from '../avatar'
import { MmButton } from '../button'
import { MmDropdown, type DropdownItem } from '../dropdown'
import { MmIcon } from '../icon'
import { MmMenuItem } from '../menu'
import type {
  AppHeaderAction,
  AppHeaderProfileItem,
  AppHeaderProps,
  AppHeaderTheme,
} from './types'

defineOptions({ name: 'MmAppHeader' })

const props = withDefaults(defineProps<AppHeaderProps>(), {
  contextActions: () => [],
  display: 'auto',
  metrics: () => [],
  mobileBreakpoint: 900,
  mobileOpen: undefined,
  pageTitle: '',
  showMobileToggle: true,
  showSidebarToggle: true,
  showThemeToggle: true,
  sidebarCollapsed: undefined,
  theme: undefined,
})

const emit = defineEmits<{
  action: [action: AppHeaderAction, event: MouseEvent]
  'identity-click': [event: MouseEvent]
  'profile-click': [event: MouseEvent]
  'profile-select': [item: AppHeaderProfileItem]
  'theme-change': [theme: AppHeaderTheme]
  'toggle-mobile': [open: boolean]
  'toggle-sidebar': [collapsed: boolean]
  'update:mobileOpen': [open: boolean]
  'update:sidebarCollapsed': [collapsed: boolean]
  'update:theme': [theme: AppHeaderTheme]
}>()
const { messages } = useLocale()
const resolvedAriaLabel = computed(() => props.ariaLabel ?? messages.value.appHeader.ariaLabel)
const resolvedSummaryLabel = computed(() => props.summaryLabel ?? messages.value.appHeader.keyMetrics)

const { value: activeSidebarCollapsed } = useControlled<boolean>(
  () => props.sidebarCollapsed,
  false,
  (value) => emit('update:sidebarCollapsed', value),
)
const { value: activeMobileOpen } = useControlled<boolean>(
  () => props.mobileOpen,
  false,
  (value) => emit('update:mobileOpen', value),
)
const { value: activeTheme } = useControlled<AppHeaderTheme>(
  () => props.theme,
  'light',
  (value) => emit('update:theme', value),
)

const viewportMobile = ref(false)
let mediaQuery: MediaQueryList | undefined

const mobileMode = computed(() => props.display === 'mobile'
  || (props.display === 'auto' && viewportMobile.value))
const mode = computed(() => mobileMode.value ? 'mobile' : 'desktop')
const identityTone = computed(() => props.identity?.tone ?? 'default')
const profileDropdownItems = computed<DropdownItem[]>(() => (props.profile?.items ?? []).map((item) => ({
  disabled: item.disabled,
  label: item.label,
  value: item.key,
})))

function updateViewport(event: MediaQueryListEvent | MediaQueryList): void {
  viewportMobile.value = event.matches
}

function unbindMediaQuery(): void {
  if (!mediaQuery) return
  if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', updateViewport)
  else mediaQuery.removeListener?.(updateViewport)
  mediaQuery = undefined
}

function bindMediaQuery(): void {
  unbindMediaQuery()
  if (props.display !== 'auto' || typeof window === 'undefined' || !window.matchMedia) return
  mediaQuery = window.matchMedia(`(max-width: ${Math.max(0, props.mobileBreakpoint)}px)`)
  updateViewport(mediaQuery)
  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', updateViewport)
  else mediaQuery.addListener?.(updateViewport)
}

function toggleSidebar(): void {
  const next = !activeSidebarCollapsed.value
  activeSidebarCollapsed.value = next
  emit('toggle-sidebar', next)
}

function toggleMobile(): void {
  const next = !activeMobileOpen.value
  activeMobileOpen.value = next
  emit('toggle-mobile', next)
}

function toggleTheme(): void {
  const next: AppHeaderTheme = activeTheme.value === 'light' ? 'dark' : 'light'
  activeTheme.value = next
  emit('theme-change', next)
}

function handleAction(action: AppHeaderAction, event: MouseEvent): void {
  if (!action.disabled) emit('action', action, event)
}

function handleProfileSelect(item: DropdownItem): void {
  const profileItem = props.profile?.items?.find((candidate) => candidate.key === item.value)
  if (profileItem && !profileItem.disabled) emit('profile-select', profileItem)
}

watch(() => props.mobileBreakpoint, bindMediaQuery)
watch(() => props.display, bindMediaQuery)
onMounted(bindMediaQuery)
onBeforeUnmount(unbindMediaQuery)
</script>

<template>
  <header
    class="mm-app-header"
    :class="[`is-${mode}`, `is-theme-${activeTheme}`]"
    data-mm-component="app-header"
    :data-app-header-mode="mode"
    :data-app-header-theme="activeTheme"
    :aria-label="resolvedAriaLabel"
  >
    <template v-if="mobileMode">
      <div class="mm-app-header__brand" data-app-header-brand>
        <slot name="brand" :brand="brand" :mobile="true" :page-title="pageTitle">
          <template v-if="brand">
            <img v-if="brand.logo" :src="brand.logo" :alt="brand.alt ?? brand.title">
            <span v-else class="mm-app-header__brand-mark" aria-hidden="true">{{ brand.title.slice(0, 1) }}</span>
            <div>
              <strong>{{ brand.title }}</strong>
              <small v-if="pageTitle">{{ pageTitle }}</small>
            </div>
          </template>
          <strong v-else>{{ pageTitle || messages.appHeader.applicationNavigation }}</strong>
        </slot>
      </div>
    </template>

    <MmButton
      v-else-if="showSidebarToggle"
      class="mm-app-header__icon-button mm-app-header__sidebar-toggle"
      data-app-header-toggle="sidebar"
      icon-only
      :aria-label="activeSidebarCollapsed ? messages.appHeader.expandMenu : messages.appHeader.collapseMenu"
      :title="activeSidebarCollapsed ? messages.appHeader.expandMenu : messages.appHeader.collapseMenu"
      @click="toggleSidebar"
    >
      <template #icon><MmIcon :name="activeSidebarCollapsed ? 'panel-right-open' : 'panel-left-close'" :size="18" /></template>
    </MmButton>

    <div v-if="!mobileMode" class="mm-app-header__center" data-app-header-center>
      <slot
        name="center"
        :context-actions="contextActions"
        :metrics="metrics"
        :on-action="handleAction"
      >
        <section v-if="metrics.length" class="mm-app-header__summary" :aria-label="resolvedSummaryLabel">
          <dl class="mm-app-header__metrics">
            <div
              v-for="metric in metrics"
              :key="metric.key"
              class="mm-app-header__metric"
              :class="`is-${metric.tone ?? 'default'}`"
              :data-app-header-metric="metric.key"
            >
              <dt>{{ metric.label }}</dt>
              <dd>{{ metric.value }}</dd>
            </div>
          </dl>
        </section>

        <div v-if="contextActions.length" class="mm-app-header__context-actions">
          <MmButton
            v-for="action in contextActions"
            :key="action.key"
            class="mm-app-header__context-action"
            :class="`is-${action.tone ?? 'default'}`"
            :data-app-header-action="action.key"
            :disabled="action.disabled"
            size="sm"
            :aria-label="action.ariaLabel ?? action.label"
            @click="handleAction(action, $event)"
          >
            <template v-if="action.icon" #icon><MmIcon :name="action.icon" :size="13" /></template>
            {{ action.label }}
          </MmButton>
        </div>
      </slot>
    </div>

    <div class="mm-app-header__actions">
      <slot
        name="actions"
        :identity="identity"
        :profile="profile"
        :theme="activeTheme"
        :toggle-theme="toggleTheme"
      >
        <slot name="identity" :identity="identity">
          <MmButton
            v-if="identity"
            class="mm-app-header__identity"
            data-app-header-identity
            :aria-label="messages.appHeader.identityMenu(identity.label)"
            @click="emit('identity-click', $event)"
          >
            <template #icon>
              <MmIcon
                v-if="mobileMode"
                class="mm-app-header__identity-icon"
                :class="`is-${identityTone}`"
                data-app-header-identity-icon
                :name="identity.icon ?? (identityTone === 'white-label' ? 'building-2' : 'store')"
                :size="16"
              />
              <span v-else class="mm-app-header__identity-dot" :class="`is-${identityTone}`" />
            </template>
            <span class="mm-app-header__identity-label">{{ identity.label }}</span>
            <MmIcon class="mm-app-header__identity-chevron" name="chevron-down" :size="13" />
          </MmButton>
        </slot>

        <MmButton
          v-if="showThemeToggle"
          class="mm-app-header__icon-button"
          data-app-header-toggle="theme"
          icon-only
          :aria-label="activeTheme === 'light' ? messages.appHeader.switchToDark : messages.appHeader.switchToLight"
          :title="activeTheme === 'light' ? messages.appHeader.switchToDark : messages.appHeader.switchToLight"
          @click="toggleTheme"
        >
          <template #icon><MmIcon :name="activeTheme === 'light' ? 'moon' : 'sun'" :size="16" :stroke-width="2" /></template>
        </MmButton>

        <slot
          name="utilities"
          :theme="activeTheme"
          :toggle-theme="toggleTheme"
        />

        <slot name="profile" :profile="profile">
          <MmDropdown
            v-if="profile?.items?.length"
            class="mm-app-header__profile-dropdown"
            floating-class="mm-app-header__profile-popover"
            :items="profileDropdownItems"
            placement="bottom-end"
            :width="250"
            @select="handleProfileSelect"
          >
            <template #trigger="{ open, triggerAttrs }">
              <button
                v-bind="triggerAttrs"
                class="mm-app-header__profile"
                :class="{ 'is-open': open }"
                data-app-header-profile
                type="button"
                :aria-label="profile.alt ? messages.appHeader.accountMenuFor(profile.alt) : messages.appHeader.accountMenu"
                @click="emit('profile-click', $event)"
              >
                <MmAvatar
                  :alt="profile.alt"
                  :fallback="profile.fallback"
                  :src="profile.src"
                  :size="28"
                />
              </button>
            </template>
            <template #header>
              <div class="mm-app-header__profile-summary" data-app-header-profile-menu>
                <MmAvatar
                  :alt="profile.alt"
                  :fallback="profile.fallback"
                  :src="profile.src"
                  :size="32"
                />
                <span>
                  <strong>{{ profile.alt || profile.fallback || messages.appHeader.account }}</strong>
                  <small v-if="profile.email">{{ profile.email }}</small>
                </span>
              </div>
            </template>
            <template #menu>
              <MmMenuItem
                v-for="item in profile.items"
                :key="item.key"
                class="mm-app-header__profile-item"
                :class="`is-${item.tone ?? 'default'}`"
                :data-app-header-profile-item="item.key"
                :disabled="item.disabled"
                :value="item.key"
              >
                <template v-if="item.icon" #icon><MmIcon :name="item.icon" :size="15" /></template>
                {{ item.label }}
              </MmMenuItem>
            </template>
          </MmDropdown>

          <button
            v-else-if="profile"
            class="mm-app-header__profile"
            data-app-header-profile
            type="button"
            :aria-label="profile.alt ? messages.appHeader.accountMenuFor(profile.alt) : messages.appHeader.accountMenu"
            @click="emit('profile-click', $event)"
          >
            <MmAvatar
              :alt="profile.alt"
              :fallback="profile.fallback"
              :src="profile.src"
              :size="28"
            />
          </button>
        </slot>
      </slot>
    </div>

    <MmButton
      v-if="mobileMode && showMobileToggle"
      class="mm-app-header__icon-button mm-app-header__mobile-toggle"
      data-app-header-toggle="mobile"
      icon-only
      :aria-expanded="activeMobileOpen"
      :aria-label="activeMobileOpen ? messages.appHeader.closeNavigation : messages.appHeader.openNavigation"
      :title="activeMobileOpen ? messages.appHeader.closeNavigation : messages.appHeader.openNavigation"
      @click="toggleMobile"
    >
      <template #icon><MmIcon :name="activeMobileOpen ? 'x' : 'menu'" :size="18" :stroke-width="2" /></template>
    </MmButton>
  </header>
</template>

<style src="./app-header.css"></style>
