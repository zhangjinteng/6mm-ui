<script setup lang="ts" generic="Row extends TableRow = TableRow">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { CSSProperties } from 'vue'

import { useControlled } from '../../composables/use-controlled'
import { useLocale } from '../../composables/use-locale'
import { debugWarn } from '../../shared/warn'
import { MmEmpty } from '../empty'
import { MmIcon } from '../icon'
import type { TableColumn, TableKey, TableProps, TableRow, TableSortOrder, TableSortState } from './types'

defineOptions({ name: 'MmTable' })

const props = withDefaults(defineProps<TableProps<Row>>(), {
  bordered: false,
  columns: () => [],
  data: () => [],
  expandedRowKeys: () => [],
  hoverable: true,
  loading: false,
  maxHeight: undefined,
  rowDisabled: undefined,
  rowKey: 'id',
  selectable: false,
  selectedRowKeys: () => [],
  showCellTitle: false,
  sort: undefined,
  sortMode: 'client',
  striped: false,
})
const emit = defineEmits<{
  expand: [expanded: boolean, row: Row]
  'row-click': [row: Row, index: number, event: MouseEvent]
  'selection-change': [keys: TableKey[], rows: Row[]]
  'sort-change': [state: TableSortState]
  'update:expandedRowKeys': [keys: TableKey[]]
  'update:selectedRowKeys': [keys: TableKey[]]
  'update:sort': [state: TableSortState]
}>()
const { locale, messages } = useLocale()
const resolvedEmptyText = computed(() => props.emptyText ?? messages.value.common.noData)
const slots = useSlots()
const { value: activeSort } = useControlled<TableSortState>(
  () => props.sort,
  { key: '', order: null },
  (state) => {
    emit('update:sort', state)
    emit('sort-change', state)
  },
)
const hasExpand = computed(() => Boolean(slots['expanded-row']))
const headerScrollRef = ref<HTMLElement>()
const bodyScrollRef = ref<HTMLElement>()
const bodyTableRef = ref<HTMLTableElement>()
const headerHeight = ref(0)
const scrollbarWidth = ref(0)
let resizeObserver: ResizeObserver | undefined
const selectableRows = computed(() => props.data.filter((row) => !props.rowDisabled?.(row)))
const allSelected = computed(() => selectableRows.value.length > 0 && selectableRows.value.every(isSelected))
const someSelected = computed(() => !allSelected.value && selectableRows.value.some(isSelected))
const columnCount = computed(() => props.columns.length + (props.selectable ? 1 : 0) + (hasExpand.value ? 1 : 0))
const sortedData = computed(() => {
  if (props.sortMode === 'manual') return props.data
  const state = activeSort.value
  if (state.order === null) return props.data
  const column = props.columns.find((item) => item.key === state.key && item.sortable)
  if (!column) return props.data

  return props.data
    .map((row, index) => ({ index, row, value: getValue(row, column) }))
    .sort((left, right) => {
      const result = compareValues(left.value, right.value)
      const ordered = state.order === 'desc' ? -result : result
      return ordered || left.index - right.index
    })
    .map(({ row }) => row)
})
const viewportStyle = computed<CSSProperties>(() => ({
  maxHeight: cssValue(props.maxHeight),
}))
const bodyStyle = computed<CSSProperties>(() => {
  const maxHeight = cssValue(props.maxHeight)
  if (!maxHeight) return {}
  return { maxHeight: `max(0px, calc(${maxHeight} - ${headerHeight.value}px))` }
})

function cssValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

function syncHeaderScroll(): void {
  if (!bodyScrollRef.value || !headerScrollRef.value) return
  headerScrollRef.value.scrollLeft = bodyScrollRef.value.scrollLeft
}

function updateScrollLayout(): void {
  const body = bodyScrollRef.value
  if (!body) return
  headerHeight.value = headerScrollRef.value?.offsetHeight ?? 0
  scrollbarWidth.value = Math.max(0, body.offsetWidth - body.clientWidth)
  syncHeaderScroll()
}

function scheduleScrollLayoutUpdate(): void {
  void nextTick(updateScrollLayout)
}

onMounted(() => {
  updateScrollLayout()
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateScrollLayout)
    if (bodyScrollRef.value) resizeObserver.observe(bodyScrollRef.value)
    if (bodyTableRef.value) resizeObserver.observe(bodyTableRef.value)
  }
  window.addEventListener('resize', updateScrollLayout)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateScrollLayout)
})

watch(
  () => [props.columns, props.data, props.maxHeight, hasExpand.value, props.selectable],
  scheduleScrollLayoutUpdate,
  { deep: true },
)

function keyFor(row: Row, index = 0): TableKey {
  const key = typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey]
  if (typeof key === 'string' || typeof key === 'number') return key
  debugWarn('Table', `row at index ${index} is missing a stable row key`)
  return `__row-${index}`
}

function rowLabel(row: Row, index: number): string {
  return String(row.name ?? row.label ?? keyFor(row, index))
}

function isSelected(row: Row): boolean {
  const key = keyFor(row)
  return props.selectedRowKeys.some((selected) => Object.is(selected, key))
}

function isExpanded(row: Row): boolean {
  const key = keyFor(row)
  return props.expandedRowKeys.some((expanded) => Object.is(expanded, key))
}

function emitSelection(keys: TableKey[]): void {
  const rows = props.data.filter((row, index) => keys.some((key) => Object.is(key, keyFor(row, index))))
  emit('update:selectedRowKeys', keys)
  emit('selection-change', keys, rows)
}

function toggleRow(row: Row, index: number, checked: boolean): void {
  if (props.rowDisabled?.(row)) return
  const key = keyFor(row, index)
  const next = checked
    ? [...props.selectedRowKeys.filter((item) => !Object.is(item, key)), key]
    : props.selectedRowKeys.filter((item) => !Object.is(item, key))
  emitSelection(next)
}

function toggleAll(checked: boolean): void {
  const selectableKeys = selectableRows.value.map((row, index) => keyFor(row, index))
  const retained = props.selectedRowKeys.filter((key) => !selectableKeys.some((item) => Object.is(item, key)))
  emitSelection(checked ? [...retained, ...selectableKeys] : retained)
}

function toggleExpand(row: Row, index: number): void {
  const key = keyFor(row, index)
  const expanded = !isExpanded(row)
  const next = expanded ? [...props.expandedRowKeys, key] : props.expandedRowKeys.filter((item) => !Object.is(item, key))
  emit('update:expandedRowKeys', next)
  emit('expand', expanded, row)
}

function sortColumn(column: TableColumn<Row>): void {
  if (!column.sortable) return
  const current: TableSortOrder = activeSort.value.key === column.key ? activeSort.value.order : null
  const order: TableSortOrder = current === null ? 'asc' : current === 'asc' ? 'desc' : null
  activeSort.value = { key: column.key, order }
}

function getValue(row: Row, column: TableColumn<Row>): unknown {
  if (!column.dataIndex) return row[column.key]
  return String(column.dataIndex).split('.').reduce<unknown>((value, segment) => value && typeof value === 'object' ? (value as TableRow)[segment] : undefined, row)
}

function normalizeSortValue(value: unknown): null | number | string {
  const text = String(value ?? '').trim()
  if (!text || text === '-') return null
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const timestamp = Date.parse(text.replace(' ', 'T'))
    if (!Number.isNaN(timestamp)) return timestamp
  }
  const numericText = text.replace(/,/g, '').replace(/%$/, '')
  if (/^-?\d+(\.\d+)?$/.test(numericText)) return Number(numericText)
  return text
}

function compareValues(leftValue: unknown, rightValue: unknown): number {
  const left = normalizeSortValue(leftValue)
  const right = normalizeSortValue(rightValue)
  if (left === null && right === null) return 0
  if (left === null) return 1
  if (right === null) return -1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), locale.value, { numeric: true, sensitivity: 'base' })
}

function formatCell(row: Row, column: TableColumn<Row>, index: number): string | number {
  const value = getValue(row, column)
  return column.formatter?.(value, row, index) ?? (value === null || value === undefined ? '—' : String(value))
}

function cellTitle(row: Row, column: TableColumn<Row>, index: number): string | undefined {
  if (!props.showCellTitle || slots[`cell-${column.key}`]) return undefined
  const text = String(formatCell(row, column, index)).trim()
  return text && text !== '—' ? text : undefined
}

function widthPixels(width: number | string | undefined): number {
  if (typeof width === 'number') return width
  const parsed = Number.parseFloat(width || '')
  return Number.isFinite(parsed) ? parsed : 120
}

function columnWidthStyle(column: TableColumn<Row>): CSSProperties {
  if (column.width === undefined) return {}
  return { width: typeof column.width === 'number' ? `${column.width}px` : column.width }
}

function columnStyle(column: TableColumn<Row>, index: number): CSSProperties {
  const style: CSSProperties = {}
  if (column.width !== undefined) {
    const width = typeof column.width === 'number' ? `${column.width}px` : column.width
    style.width = width
    style.minWidth = width
    if (column.fixed === 'right') style.maxWidth = width
  }
  if (column.fixed === 'left') {
    style.left = `${props.columns.slice(0, index).filter((item) => item.fixed === 'left').reduce((sum, item) => sum + widthPixels(item.width), 0)}px`
  } else if (column.fixed === 'right') {
    style.right = `${props.columns.slice(index + 1).filter((item) => item.fixed === 'right').reduce((sum, item) => sum + widthPixels(item.width), 0)}px`
  }
  return style
}

function ariaSort(column: TableColumn<Row>): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (activeSort.value.key !== column.key || activeSort.value.order === null) return 'none'
  return activeSort.value.order === 'asc' ? 'ascending' : 'descending'
}

function isSortActive(column: TableColumn<Row>): boolean {
  return activeSort.value.key === column.key && activeSort.value.order !== null
}

function sortIcon(column: TableColumn<Row>): 'arrow-down' | 'arrow-up' | 'arrow-up-down' {
  if (!isSortActive(column)) return 'arrow-up-down'
  return activeSort.value.order === 'asc' ? 'arrow-up' : 'arrow-down'
}

function nextSortLabel(column: TableColumn<Row>): string {
  if (!isSortActive(column)) return messages.value.table.sortAscending(column.title)
  return activeSort.value.order === 'asc'
    ? messages.value.table.sortDescending(column.title)
    : messages.value.table.defaultSort(column.title)
}
</script>

<template>
  <div class="mm-table" :class="{ 'is-bordered': bordered, 'is-hoverable': hoverable, 'is-loading': loading, 'is-striped': striped }" data-mm-component="table">
    <div class="mm-table__viewport" :class="{ 'is-bounded': maxHeight !== undefined }" :style="viewportStyle">
      <div class="mm-table__header-frame">
        <div ref="headerScrollRef" class="mm-table__header-scroll">
          <table class="mm-table__header-table">
            <colgroup>
              <col v-if="hasExpand" class="mm-table__utility-column">
              <col v-if="selectable" class="mm-table__utility-column">
              <col v-for="column in columns" :key="column.key" :style="columnWidthStyle(column)">
            </colgroup>
            <thead>
              <tr>
                <th v-if="hasExpand" class="mm-table__utility"><span class="mm-sr-only">{{ messages.table.expand }}</span></th>
                <th v-if="selectable" class="mm-table__utility">
                  <input type="checkbox" :checked="allSelected" :indeterminate="someSelected" :disabled="!selectableRows.length" :aria-label="messages.table.selectAll" @change="toggleAll(($event.target as HTMLInputElement).checked)">
                </th>
                <th
                  v-for="(column, columnIndex) in columns"
                  :key="column.key"
                  :class="[`is-align-${column.align || 'left'}`, column.fixed && `is-fixed-${column.fixed}`]"
                  :style="columnStyle(column, columnIndex)"
                  :aria-sort="ariaSort(column)"
                >
                  <button v-if="column.sortable" class="mm-table__sort" :class="{ 'is-active': isSortActive(column) }" type="button" :aria-label="nextSortLabel(column)" @click="sortColumn(column)">
                    <slot :name="`header-${column.key}`" :column="column">{{ column.title }}</slot>
                    <MmIcon class="mm-table__sort-icon" :name="sortIcon(column)" :size="12" :stroke-width="2" />
                  </button>
                  <slot v-else :name="`header-${column.key}`" :column="column">{{ column.title }}</slot>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <span v-if="scrollbarWidth" class="mm-table__header-gutter" :style="{ width: `${scrollbarWidth}px` }" aria-hidden="true" />
      </div>

      <div ref="bodyScrollRef" class="mm-table__scroll" :style="bodyStyle" @scroll.passive="syncHeaderScroll">
        <table ref="bodyTableRef" class="mm-table__body-table">
          <colgroup>
            <col v-if="hasExpand" class="mm-table__utility-column">
            <col v-if="selectable" class="mm-table__utility-column">
            <col v-for="column in columns" :key="column.key" :style="columnWidthStyle(column)">
          </colgroup>
          <thead class="mm-table__a11y-head">
            <tr>
              <th v-if="hasExpand" class="mm-table__utility" scope="col"><span class="mm-sr-only">{{ messages.table.expand }}</span></th>
              <th v-if="selectable" class="mm-table__utility" scope="col"><span class="mm-sr-only">{{ messages.table.selectAll }}</span></th>
              <th
                v-for="(column, columnIndex) in columns"
                :key="column.key"
                :class="[`is-align-${column.align || 'left'}`, column.fixed && `is-fixed-${column.fixed}`]"
                :style="columnStyle(column, columnIndex)"
                scope="col"
                :aria-sort="ariaSort(column)"
              ><span class="mm-sr-only">{{ column.title }}</span></th>
            </tr>
          </thead>
          <tbody v-if="sortedData.length">
          <template v-for="(row, rowIndex) in sortedData" :key="keyFor(row, rowIndex)">
            <tr :data-row-key="String(keyFor(row, rowIndex))" :class="{ 'is-selected': isSelected(row) }" @click="emit('row-click', row, rowIndex, $event)">
              <td v-if="hasExpand" class="mm-table__utility">
                <button class="mm-table__expand" type="button" :aria-label="isExpanded(row) ? messages.table.collapseRow(rowLabel(row, rowIndex)) : messages.table.expandRow(rowLabel(row, rowIndex))" :aria-expanded="isExpanded(row)" @click.stop="toggleExpand(row, rowIndex)">›</button>
              </td>
              <td v-if="selectable" class="mm-table__utility">
                <input type="checkbox" :checked="isSelected(row)" :disabled="rowDisabled?.(row)" :aria-label="messages.table.selectRow(rowLabel(row, rowIndex))" @click.stop @change="toggleRow(row, rowIndex, ($event.target as HTMLInputElement).checked)">
              </td>
              <td
                v-for="(column, columnIndex) in columns"
                :key="column.key"
                :class="[`is-align-${column.align || 'left'}`, column.fixed && `is-fixed-${column.fixed}`]"
                :style="columnStyle(column, columnIndex)"
                :title="cellTitle(row, column, rowIndex)"
              ><slot :name="`cell-${column.key}`" :value="getValue(row, column)" :row="row" :column="column" :index="rowIndex">{{ formatCell(row, column, rowIndex) }}</slot></td>
            </tr>
            <tr v-if="hasExpand && isExpanded(row)" class="mm-table__expanded-row">
              <td :colspan="columnCount"><slot name="expanded-row" :row="row" :index="rowIndex" /></td>
            </tr>
          </template>
          </tbody>
          <tbody v-else>
            <tr><td class="mm-table__empty-cell" :colspan="columnCount"><MmEmpty :description="resolvedEmptyText" :image-size="64" /></td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="loading" class="mm-table__loading" role="status" aria-live="polite"><span class="mm-table__spinner" aria-hidden="true" />{{ messages.table.loading }}</div>
  </div>
</template>

<style src="./table.css"></style>
