<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmCursorPagination } from '../cursor-pagination'
import type { ProTableCursorPaginationProps } from './types'

defineOptions({ name: 'MmProTableCursorPagination' })

const props = withDefaults(defineProps<ProTableCursorPaginationProps>(), {
  currentPage: 1,
  disabled: false,
  hasMore: false,
  hasPrevious: undefined,
  loading: false,
  pageSize: 20,
  rowCount: 0,
  size: 'md',
})

const emit = defineEmits<{
  next: []
  prev: []
}>()
const { messages } = useLocale()

const current = computed(() => Math.max(1, Math.floor(props.currentPage)))
const count = computed(() => Math.max(0, Math.floor(props.rowCount)))
const normalizedPageSize = computed(() => Math.max(1, Math.floor(props.pageSize)))
const summary = computed(() => {
  if (count.value === 0) return messages.value.proTablePagination.emptySummary(current.value)
  const start = (current.value - 1) * normalizedPageSize.value + 1
  return messages.value.proTablePagination.summary(start, start + count.value - 1, current.value)
})
</script>

<template>
  <footer class="mm-pro-table__pagination">
    <span class="mm-pro-table__pagination-summary">
      <slot name="summary" :current-page="current" :row-count="count">
        {{ summary }}
      </slot>
    </span>
    <MmCursorPagination
      :current-page="current"
      :disabled="disabled"
      :has-more="hasMore"
      :has-previous="hasPrevious"
      :loading="loading"
      :size="size"
      @next="emit('next')"
      @prev="emit('prev')"
    />
  </footer>
</template>

<style src="./pro-table.css"></style>
