<script setup lang="ts">
import { computed, inject } from 'vue'

import { useId } from '../../composables/use-id'
import { collapseKey, type CollapseItemProps } from './types'

defineOptions({ name: 'MmCollapseItem' })

const props = withDefaults(defineProps<CollapseItemProps>(), { disabled: false, title: undefined })
const context = inject(collapseKey)
if (!context) throw new Error('[MmCollapseItem] must be used inside MmCollapse')
const triggerId = useId('mm-collapse-trigger')
const panelId = useId('mm-collapse-panel')
const active = computed(() => context.isActive(props.name))
</script>

<template>
  <section class="mm-collapse-item" :class="{ 'is-active': active, 'is-disabled': disabled }">
    <h3 class="mm-collapse-item__heading">
      <button
        :id="triggerId"
        class="mm-collapse-item__trigger"
        type="button"
        :disabled="disabled"
        :aria-controls="panelId"
        :aria-expanded="active ? 'true' : 'false'"
        @click="context.toggle(name)"
        @keydown="context.moveHeader($event.currentTarget as HTMLButtonElement, $event)"
      >
        <span><slot name="title">{{ title }}</slot></span>
        <span class="mm-collapse-item__arrow" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" focusable="false">
            <path d="m3.5 6 4.5 4 4.5-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>
    </h3>
    <div v-show="active" :id="panelId" class="mm-collapse-item__panel" role="region" :aria-labelledby="triggerId">
      <div class="mm-collapse-item__content"><slot /></div>
    </div>
  </section>
</template>
