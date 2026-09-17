<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'

import { useControlled } from '../../composables/use-controlled'
import { useLocale } from '../../composables/use-locale'
import { MmBadge } from '../badge'
import { MmButton } from '../button'
import { MmDrawer } from '../drawer'
import { MmIcon } from '../icon'
import { MmQueryBar } from '../query-bar'
import type { QueryBarFieldValue, QueryBarValue } from '../query-bar'
import { cloneQueryBarValue, createQueryBarValue, materializeQueryBarValue } from '../query-bar'
import type { FilterDrawerExpose, FilterDrawerProps } from './types'

defineOptions({ name: 'MmFilterDrawer' })

const props = withDefaults(defineProps<FilterDrawerProps>(), {
  activeCount: undefined,
  disabled: false,
  fields: () => [],
  loading: false,
  modelValue: undefined,
  open: undefined,
  size: 420,
  subtitle: undefined,
  triggerAriaLabel: undefined,
  triggerTitle: undefined,
})
const emit = defineEmits<{
  query: [value: QueryBarValue]
  reset: [value: QueryBarValue]
  'update:modelValue': [value: QueryBarValue]
  'update:open': [value: boolean]
}>()
const { messages } = useLocale()
const resolvedTitle = computed(() => props.title ?? messages.value.filterDrawer.title)
const resolvedQueryText = computed(() => props.queryText ?? messages.value.common.query)
const resolvedResetText = computed(() => props.resetText ?? messages.value.common.reset)
const slots = useSlots()
const blocked = computed(() => props.disabled || props.loading)
const { value: appliedValue } = useControlled<QueryBarValue>(
  () => props.modelValue,
  createQueryBarValue(props.fields),
  (value) => emit('update:modelValue', cloneQueryBarValue(value)),
)
const { value: activeOpen } = useControlled<boolean>(
  () => props.open,
  false,
  (value) => emit('update:open', value),
)
const draft = ref<QueryBarValue>(materializeQueryBarValue(appliedValue.value, props.fields))
const fieldSlotNames = computed(() => Object.keys(slots).filter((name) => name.startsWith('field-')))

function isActiveValue(value: QueryBarFieldValue | undefined): boolean {
  if (Array.isArray(value)) return value.some(Boolean)
  return value !== '' && value !== null && value !== undefined && value !== 'all'
}

const resolvedActiveCount = computed(() => {
  if (props.activeCount !== undefined) return Math.max(0, Math.floor(props.activeCount))
  return props.fields.reduce((count, field) => count + Number(isActiveValue(appliedValue.value[field.key])), 0)
})
const drawerSubtitle = computed(() => {
  const context = props.subtitle?.trim()
  return messages.value.filterDrawer.fieldCount(props.fields.length, context)
})
const baseTriggerLabel = computed(() => {
  if (props.triggerAriaLabel) return props.triggerAriaLabel
  const context = props.subtitle?.trim()
  return context
    ? messages.value.filterDrawer.moreFiltersWithContext(context)
    : messages.value.filterDrawer.moreFilters
})
const resolvedTriggerLabel = computed(() => resolvedActiveCount.value > 0
  ? messages.value.filterDrawer.triggerWithCount(baseTriggerLabel.value, resolvedActiveCount.value)
  : baseTriggerLabel.value)
const resolvedTriggerTitle = computed(() => props.triggerTitle
  || (resolvedActiveCount.value > 0
    ? messages.value.filterDrawer.moreFiltersWithCount(resolvedActiveCount.value)
    : messages.value.filterDrawer.moreFilters))
const triggerAttrs = computed(() => ({
  'aria-expanded': activeOpen.value ? 'true' : 'false',
  'aria-haspopup': 'dialog' as const,
  'aria-label': resolvedTriggerLabel.value,
  disabled: blocked.value,
  onClick: open,
  title: resolvedTriggerTitle.value,
}))

function syncDraft(): void {
  draft.value = materializeQueryBarValue(appliedValue.value, props.fields)
}

function open(): void {
  if (blocked.value) return
  syncDraft()
  activeOpen.value = true
}

function close(): void {
  activeOpen.value = false
}

function updateOpen(value: boolean): void {
  activeOpen.value = value
}

function updateDraft(value: QueryBarValue): void {
  draft.value = cloneQueryBarValue(value)
}

function query(): void {
  if (blocked.value) return
  const value = materializeQueryBarValue(draft.value, props.fields)
  appliedValue.value = value
  emit('query', cloneQueryBarValue(value))
  close()
}

function reset(): void {
  if (blocked.value) return
  const value = createQueryBarValue(props.fields)
  draft.value = cloneQueryBarValue(value)
  appliedValue.value = value
  emit('reset', cloneQueryBarValue(value))
  close()
}

watch(activeOpen, (value) => {
  if (value) syncDraft()
}, { immediate: true })

defineExpose<FilterDrawerExpose>({ close, open, query, reset })
</script>

<template>
  <span class="mm-filter-drawer" data-mm-component="filter-drawer">
    <slot
      name="trigger"
      :active-count="resolvedActiveCount"
      :disabled="blocked"
      :open="open"
      :open-state="activeOpen"
      :trigger-attrs="triggerAttrs"
    >
      <MmBadge
        class="mm-filter-drawer__badge"
        :hidden="resolvedActiveCount === 0"
        :value="resolvedActiveCount"
        :aria-label="messages.filterDrawer.activeFilterCount(resolvedActiveCount)"
        type="primary"
      >
        <MmButton
          v-bind="triggerAttrs"
          data-filter-drawer-trigger
          icon-only
          size="sm"
        >
          <template #icon><MmIcon name="filter" :size="15" /></template>
        </MmButton>
      </MmBadge>
    </slot>

    <MmDrawer
      class="mm-filter-drawer__overlay"
      :model-value="activeOpen"
      placement="right"
      :size="size"
      @update:model-value="updateOpen"
    >
      <template #header>
        <div class="mm-filter-drawer__header">
          <strong>{{ resolvedTitle }}</strong>
          <small>{{ drawerSubtitle }}</small>
        </div>
      </template>

      <MmQueryBar
        class="mm-filter-drawer__query"
        :model-value="draft"
        :aria-label="messages.filterDrawer.conditions(resolvedTitle)"
        :disabled="disabled"
        :fields="fields"
        :loading="loading"
        :show-reset="false"
        size="sm"
        @query="query"
        @update:model-value="updateDraft"
      >
        <template v-for="slotName in fieldSlotNames" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps" />
        </template>
        <template #buttons />
      </MmQueryBar>

      <template #footer>
        <div class="mm-filter-drawer__footer-meta" aria-live="polite">
          <span>{{ messages.filterDrawer.appliedFilters }}</span>
          <b>{{ resolvedActiveCount }}</b>
        </div>
        <MmButton
          data-filter-drawer-action="reset"
          :disabled="blocked"
          size="sm"
          @click="reset"
        >{{ resolvedResetText }}</MmButton>
        <MmButton
          data-filter-drawer-action="query"
          :disabled="disabled"
          :loading="loading"
          size="sm"
          variant="primary"
          @click="query"
        >
          <template #icon><MmIcon name="search" :size="13" /></template>
          {{ resolvedQueryText }}
        </MmButton>
      </template>
    </MmDrawer>
  </span>
</template>

<style src="./filter-drawer.css"></style>
