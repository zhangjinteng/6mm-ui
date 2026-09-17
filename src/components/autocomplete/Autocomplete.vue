<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import { MmInput } from '../input'
import { MmPopover } from '../popover'
import type { AutocompleteOption, AutocompleteProps } from './types'

defineOptions({ name: 'MmAutocomplete' })

const props = withDefaults(defineProps<AutocompleteProps>(), {
  clearable: true,
  debounce: 180,
  disabled: false,
  fetchSuggestions: undefined,
  labelKey: 'label',
  minLength: 1,
  modelValue: '',
  readonly: false,
  size: undefined,
  status: undefined,
  suggestions: () => [],
  valueKey: 'value',
})
const emit = defineEmits<{
  blur: [event: FocusEvent]
  error: [error: Error]
  focus: [event: FocusEvent]
  select: [option: AutocompleteOption]
  'update:modelValue': [value: string]
}>()
const { messages } = useLocale()

const listboxId = useId('mm-autocomplete-listbox')
const query = ref(props.modelValue)
const options = ref<AutocompleteOption[]>([])
const open = ref(false)
const loading = ref(false)
const error = ref('')
const activeIndex = ref(-1)
let request = 0
let controller: AbortController | undefined
let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(() => props.modelValue, (value) => { query.value = value })

function optionLabel(option: AutocompleteOption): string {
  if (typeof option === 'string') return option
  return String(option[props.labelKey] ?? option[props.valueKey] ?? '')
}

function optionValue(option: AutocompleteOption): string {
  if (typeof option === 'string') return option
  return String(option[props.valueKey] ?? option[props.labelKey] ?? '')
}

async function search(value: string): Promise<void> {
  controller?.abort()
  const current = ++request
  error.value = ''
  activeIndex.value = -1
  if (value.length < props.minLength) {
    options.value = []
    loading.value = false
    open.value = false
    return
  }

  controller = new AbortController()
  loading.value = true
  open.value = true
  try {
    const source = props.fetchSuggestions
      ? await props.fetchSuggestions(value, controller.signal)
      : props.suggestions.filter((option) => optionLabel(option).toLowerCase().includes(value.toLowerCase()))
    if (current !== request || controller.signal.aborted) return
    options.value = source
  } catch (reason) {
    if (current !== request || controller.signal.aborted) return
    const nextError = reason instanceof Error ? reason : new Error(messages.value.autocomplete.loadFailed)
    error.value = nextError.message
    options.value = []
    emit('error', nextError)
  } finally {
    if (current === request) loading.value = false
  }
}

function scheduleSearch(value: string): void {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (props.debounce <= 0) void search(value)
  else debounceTimer = setTimeout(() => void search(value), props.debounce)
}

function update(value: string): void {
  query.value = value
  emit('update:modelValue', value)
  scheduleSearch(value)
}

function selectOption(option: AutocompleteOption): void {
  const value = optionValue(option)
  query.value = value
  emit('update:modelValue', value)
  emit('select', option)
  open.value = false
  activeIndex.value = -1
}

function move(direction: 1 | -1): void {
  if (!options.value.length) return
  activeIndex.value = (activeIndex.value + direction + options.value.length) % options.value.length
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) {
      open.value = true
      scheduleSearch(query.value)
    }
    move(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' && activeIndex.value >= 0) {
    event.preventDefault()
    const option = options.value[activeIndex.value]
    if (option !== undefined) selectOption(option)
  } else if (event.key === 'Escape') {
    open.value = false
  }
}

function onFocus(event: FocusEvent): void {
  emit('focus', event)
  if (query.value.length >= props.minLength) scheduleSearch(query.value)
}

function onClear(): void {
  controller?.abort()
  options.value = []
  open.value = false
}

onBeforeUnmount(() => {
  controller?.abort()
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <div class="mm-autocomplete" data-mm-component="autocomplete">
    <MmPopover v-model="open" trigger="manual" placement="bottom-start" :offset="5" :show-arrow="false" :width="280" role="presentation">
      <MmInput
        :id="id"
        :model-value="query"
        :name="name"
        :placeholder="placeholder"
        :clearable="clearable"
        :disabled="disabled"
        :readonly="readonly"
        :size="size"
        :status="error ? 'error' : status"
        role="combobox"
        autocomplete="off"
        :aria-autocomplete="'list'"
        :aria-controls="listboxId"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-activedescendant="activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined"
        @update:model-value="update"
        @keydown="onKeydown"
        @focus="onFocus"
        @blur="emit('blur', $event)"
        @clear="onClear"
      >
        <template v-if="loading" #suffix><span class="mm-autocomplete__spinner" :aria-label="messages.autocomplete.loading" /></template>
      </MmInput>

      <template #content>
        <div class="mm-autocomplete__dropdown">
          <p v-if="error" class="mm-autocomplete__state is-error" role="alert">{{ error }}</p>
          <p v-else-if="loading" class="mm-autocomplete__state">{{ messages.autocomplete.querying }}</p>
          <div v-else-if="options.length" :id="listboxId" class="mm-autocomplete__list" role="listbox">
            <button
              v-for="(option, index) in options"
              :id="`${listboxId}-${index}`"
              :key="`${optionValue(option)}-${index}`"
              class="mm-autocomplete__option"
              :class="{ 'is-active': index === activeIndex }"
              type="button"
              role="option"
              :aria-selected="index === activeIndex"
              @mouseenter="activeIndex = index"
              @mousedown.prevent
              @click="selectOption(option)"
            ><slot name="option" :option="option" :index="index">{{ optionLabel(option) }}</slot></button>
          </div>
          <p v-else class="mm-autocomplete__state">{{ messages.autocomplete.noMatches }}</p>
        </div>
      </template>
    </MmPopover>
  </div>
</template>

<style src="./autocomplete.css"></style>
