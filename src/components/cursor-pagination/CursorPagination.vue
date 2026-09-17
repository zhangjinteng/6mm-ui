<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import type { CursorPaginationProps } from './types'

defineOptions({ name: 'MmCursorPagination' })

const props = withDefaults(defineProps<CursorPaginationProps>(), {
  currentPage: 1,
  disabled: false,
  hasMore: false,
  hasPrevious: undefined,
  loading: false,
  size: 'md',
})

const emit = defineEmits<{
  next: []
  prev: []
}>()
const { messages } = useLocale()

const current = computed(() => Math.max(1, Math.floor(props.currentPage)))
const resolvedAriaLabel = computed(() => props.ariaLabel ?? messages.value.pagination.navigation)
const resolvedNextLabel = computed(() => props.nextLabel ?? messages.value.pagination.next)
const resolvedPreviousLabel = computed(() => props.previousLabel ?? messages.value.pagination.previous)
const canGoPrevious = computed(
  () => props.hasPrevious ?? current.value > 1,
)
const interactionsDisabled = computed(() => props.disabled || props.loading)

function goPrevious(): void {
  if (interactionsDisabled.value || !canGoPrevious.value) return
  emit('prev')
}

function goNext(): void {
  if (interactionsDisabled.value || !props.hasMore) return
  emit('next')
}
</script>

<template>
  <nav
    class="mm-pagination mm-cursor-pagination"
    :class="[
      `mm-pagination--${size}`,
      {
        'is-disabled': disabled,
        'is-loading': loading,
      },
    ]"
    data-mm-component="cursor-pagination"
    role="navigation"
    :aria-label="resolvedAriaLabel"
    :aria-busy="loading || undefined"
  >
    <div class="mm-pagination__pages">
      <button
        type="button"
        class="mm-pagination__control"
        :disabled="interactionsDisabled || !canGoPrevious"
        :aria-label="resolvedPreviousLabel"
        @click="goPrevious"
      >
        ‹
      </button>
      <span
        class="mm-cursor-pagination__current"
        aria-current="page"
        :aria-label="messages.pagination.currentPage(current)"
      >
        {{ current }}
      </span>
      <button
        type="button"
        class="mm-pagination__control"
        :disabled="interactionsDisabled || !hasMore"
        :aria-label="resolvedNextLabel"
        @click="goNext"
      >
        ›
      </button>
    </div>
  </nav>
</template>

<style src="../pagination/pagination.css"></style>
<style src="./cursor-pagination.css"></style>
