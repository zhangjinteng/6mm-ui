<script setup lang="ts">
import { computed, ref } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmSelect, type SelectValue } from '../select'
import type { PaginationProps } from './types'

defineOptions({ name: 'MmPagination' })

const props = withDefaults(defineProps<PaginationProps>(), {
  currentPage: 1,
  disabled: false,
  pageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  pagerCount: 7,
  showJumper: false,
  showSizeChanger: false,
  showTotal: true,
  size: 'md',
  total: 0,
})
const emit = defineEmits<{
  'current-change': [page: number]
  'size-change': [size: number]
  'update:currentPage': [page: number]
  'update:pageSize': [size: number]
}>()
const { messages } = useLocale()
const jumpValue = ref('')
const pageCount = computed(() => Math.max(1, Math.ceil(Math.max(0, props.total) / Math.max(1, props.pageSize))))
const current = computed(() => Math.min(pageCount.value, Math.max(1, props.currentPage)))
const sizeOptions = computed(() => props.pageSizes.map((value) => ({
  label: messages.value.pagination.pageSizeOption(value),
  value,
})))
const pages = computed<Array<number | string>>(() => {
  const count = pageCount.value
  const maximum = Math.max(5, props.pagerCount)
  if (count <= maximum) return Array.from({ length: count }, (_, index) => index + 1)
  const windowSize = maximum - 2
  let start = Math.max(2, current.value - Math.floor(windowSize / 2))
  let end = Math.min(count - 1, start + windowSize - 1)
  start = Math.max(2, end - windowSize + 1)
  const result: Array<number | string> = [1]
  if (start > 2) result.push('ellipsis-start')
  for (let page = start; page <= end; page++) result.push(page)
  if (end < count - 1) result.push('ellipsis-end')
  result.push(count)
  return result
})

function changePage(page: number): void {
  if (props.disabled) return
  const next = Math.min(pageCount.value, Math.max(1, Math.round(page)))
  if (next === current.value) return
  emit('update:currentPage', next)
  emit('current-change', next)
}

function changePageSize(value: SelectValue | SelectValue[]): void {
  if (props.disabled || Array.isArray(value)) return
  const next = Number(value)
  if (!Number.isFinite(next) || next <= 0 || next === props.pageSize) return
  emit('update:pageSize', next)
  emit('size-change', next)
  if (current.value !== 1) {
    emit('update:currentPage', 1)
    emit('current-change', 1)
  }
}

function jump(): void {
  const value = Number(jumpValue.value)
  if (Number.isFinite(value)) changePage(value)
  jumpValue.value = ''
}
</script>

<template>
  <nav class="mm-pagination" :class="[`mm-pagination--${size}`, { 'is-disabled': disabled }]" data-mm-component="pagination" role="navigation" :aria-label="messages.pagination.navigation">
    <span v-if="showTotal" class="mm-pagination__total">{{ messages.pagination.total(total) }}</span>
    <MmSelect
      v-if="showSizeChanger"
      class="mm-pagination__size"
      :disabled="disabled"
      :model-value="pageSize"
      :options="sizeOptions"
      :size="size"
      :aria-label="messages.pagination.pageSize"
      @update:model-value="changePageSize"
    />
    <div class="mm-pagination__pages">
      <button type="button" class="mm-pagination__control" :disabled="disabled || current <= 1" :aria-label="messages.pagination.previous" @click="changePage(current - 1)">‹</button>
      <template v-for="item in pages" :key="item">
        <span v-if="typeof item === 'string'" class="mm-pagination__ellipsis" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="mm-pagination__page"
          :class="{ 'is-current': item === current }"
          :data-page="item"
          :disabled="disabled"
          :aria-current="item === current ? 'page' : undefined"
          :aria-label="messages.pagination.currentPage(item)"
          @click="changePage(item)"
        >{{ item }}</button>
      </template>
      <button type="button" class="mm-pagination__control" :disabled="disabled || current >= pageCount" :aria-label="messages.pagination.next" @click="changePage(current + 1)">›</button>
    </div>
    <label v-if="showJumper" class="mm-pagination__jumper">
      <span>{{ messages.pagination.jump }}</span>
      <input v-model="jumpValue" type="number" inputmode="numeric" min="1" :max="pageCount" :disabled="disabled" :aria-label="messages.pagination.jumpInput" @keydown.enter.prevent="jump">
      <span>{{ messages.pagination.page }}</span>
    </label>
  </nav>
</template>

<style src="./pagination.css"></style>
