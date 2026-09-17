<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'

import { useId } from '../../composables/use-id'
import { tabsKey, type TabPaneProps } from './types'

defineOptions({ name: 'MmTabPane' })

const props = withDefaults(defineProps<TabPaneProps>(), {
  disabled: false,
  forceRender: false,
  lazy: false,
})
const tabs = inject(tabsKey)
if (!tabs) throw new Error('[MmTabPane] must be used inside MmTabs')

const tabId = useId('mm-tab')
const panelId = useId('mm-tab-panel')
const disabled = computed(() => props.disabled)
const label = computed(() => props.label)
const active = computed(() => Object.is(tabs.activeValue.value, props.name))
const visited = ref(active.value)
const shouldRender = computed(() => props.forceRender || !(props.lazy || tabs.isLazy.value) || active.value || visited.value)

watch(active, (value) => {
  if (value) visited.value = true
})

tabs.register({ disabled, label, name: props.name, panelId, tabId })
onBeforeUnmount(() => tabs.unregister(props.name))
</script>

<template>
  <div
    v-if="shouldRender"
    v-show="active"
    :id="panelId"
    class="mm-tab-pane"
    role="tabpanel"
    :aria-labelledby="tabId"
    tabindex="0"
  >
    <slot />
  </div>
</template>
