<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmPagination } from '../pagination'
import type { PaginationSize } from '../pagination'

defineOptions({ name: 'MmProTablePagination' })

interface ProTablePaginationProps {
  currentPage?: number
  disabled?: boolean
  pageSize?: number
  pageSizes?: number[]
  showJumper?: boolean
  showSizeChanger?: boolean
  size?: PaginationSize
  total?: number
}

const props = withDefaults(defineProps<ProTablePaginationProps>(), {
  currentPage: 1,
  disabled: false,
  pageSize: 20,
  pageSizes: () => [10, 20, 50, 100],
  showJumper: false,
  showSizeChanger: true,
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

const paginationRange = computed(() => {
  const total = Math.max(0, Math.floor(props.total))
  const pageSize = Math.max(1, Math.floor(props.pageSize))
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(pageCount, Math.max(1, Math.floor(props.currentPage)))
  return {
    currentPage,
    end: total ? Math.min(total, currentPage * pageSize) : currentPage * pageSize,
    start: (currentPage - 1) * pageSize + 1,
  }
})

function handlePage(page: number): void {
  emit('update:currentPage', page)
  emit('current-change', page)
}

function handlePageSize(size: number): void {
  emit('update:pageSize', size)
  emit('size-change', size)
}
</script>

<template>
  <footer class="mm-pro-table__pagination">
    <span class="mm-pro-table__pagination-summary">
      {{ messages.proTablePagination.summary(paginationRange.start, paginationRange.end, paginationRange.currentPage) }}
    </span>
    <MmPagination
      :current-page="currentPage"
      :disabled="disabled"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :show-jumper="showJumper"
      :show-size-changer="showSizeChanger"
      :show-total="true"
      :size="size"
      :total="total"
      @current-change="handlePage"
      @size-change="handlePageSize"
    />
  </footer>
</template>
