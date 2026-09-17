<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmPopover } from '../popover'
import { MmSelect } from '../select'
import type { SelectValue } from '../select'
import type { ProTableColumn } from './types'

const props = withDefaults(defineProps<{
  autoRefreshOptions?: number[]
  autoRefreshSeconds?: number
  columns?: ProTableColumn<any>[]
  columnsConfigurable?: boolean
  disabled?: boolean
  lastUpdatedAt?: Date | string
  refreshable?: boolean
  refreshing?: boolean
  visibleColumnKeys?: string[]
}>(), {
  autoRefreshOptions: () => [0, 5, 10, 30, 60],
  autoRefreshSeconds: 0,
  columns: () => [],
  columnsConfigurable: true,
  disabled: false,
  lastUpdatedAt: undefined,
  refreshable: true,
  refreshing: false,
  visibleColumnKeys: () => [],
})
const emit = defineEmits<{
  refresh: []
  'update:autoRefreshSeconds': [seconds: number]
  'update:visibleColumnKeys': [keys: string[]]
}>()
const { locale, messages } = useLocale()

const refreshOptions = computed(() => props.autoRefreshOptions.map((seconds) => ({
  label: seconds > 0
    ? messages.value.proTable.autoRefresh(seconds)
    : messages.value.proTable.autoRefreshDisabled,
  value: seconds,
})))
const requiredColumnKeys = computed(() => props.columns
  .filter((column) => column.hideable === false)
  .map((column) => column.key))
const visibleColumnCount = computed(() => props.columns
  .filter((column) => column.hideable === false || props.visibleColumnKeys.includes(column.key))
  .length)
const refreshTitle = computed(() => {
  if (!props.lastUpdatedAt) return messages.value.proTable.refresh
  const value = typeof props.lastUpdatedAt === 'string'
    ? props.lastUpdatedAt.trim()
    : props.lastUpdatedAt.toLocaleString(locale.value, { hour12: false })
  return value
    ? messages.value.proTable.refreshWithTime(value)
    : messages.value.proTable.refresh
})

function defaultColumnKeys(): string[] {
  return props.columns
    .filter((column) => column.hideable === false || !column.defaultHidden)
    .map((column) => column.key)
}

function updateAutoRefresh(value: SelectValue | SelectValue[]): void {
  if (Array.isArray(value)) return
  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) emit('update:autoRefreshSeconds', seconds)
}

function isColumnVisible(column: ProTableColumn<any>): boolean {
  return column.hideable === false || props.visibleColumnKeys.includes(column.key)
}

function toggleColumn(column: ProTableColumn<any>, checked: boolean): void {
  if (column.hideable === false) return
  const next = checked
    ? [...props.visibleColumnKeys.filter((key) => key !== column.key), column.key]
    : props.visibleColumnKeys.filter((key) => key !== column.key)
  if (!next.some((key) => !requiredColumnKeys.value.includes(key))) return
  emit('update:visibleColumnKeys', props.columns
    .filter((item) => item.hideable === false || next.includes(item.key))
    .map((item) => item.key))
}

function showAllColumns(): void {
  emit('update:visibleColumnKeys', props.columns.map((column) => column.key))
}

function resetColumns(): void {
  emit('update:visibleColumnKeys', defaultColumnKeys())
}
</script>

<template>
  <div class="mm-pro-table__tools" data-query-overflow-group>
    <label v-if="refreshable" class="mm-pro-table__auto-refresh">
      <span class="mm-sr-only">{{ messages.proTable.autoRefreshInterval }}</span>
      <MmSelect
        :model-value="autoRefreshSeconds"
        :options="refreshOptions"
        :disabled="disabled"
        size="sm"
        :aria-label="messages.proTable.autoRefreshInterval"
        @update:model-value="updateAutoRefresh"
      />
    </label>
    <slot />
    <MmButton
      v-if="refreshable"
      data-pro-table-tool="refresh"
      :disabled="disabled"
      icon-only
      :loading="refreshing"
      size="sm"
      :aria-label="messages.proTable.refresh"
      :title="refreshTitle"
      @click="emit('refresh')"
    >
      <template #icon><MmIcon name="refresh-cw" :size="14" /></template>
    </MmButton>
    <MmPopover
      v-if="columnsConfigurable && columns.length"
      floating-class="mm-pro-table__columns-popover"
      :offset="6"
      placement="bottom-end"
      :show-arrow="false"
      :width="270"
    >
      <template #default="{ triggerAttrs }">
        <MmButton v-bind="triggerAttrs" data-pro-table-tool="columns" icon-only size="sm" :aria-label="messages.proTable.columns">
          <template #icon><MmIcon name="columns" :size="14" /></template>
        </MmButton>
      </template>
      <template #content>
        <div class="mm-pro-table__columns">
          <header><div><span>{{ messages.proTable.columnsMatrix }}</span><strong>{{ messages.proTable.columns }}</strong></div><b>{{ visibleColumnCount }}/{{ columns.length }}</b></header>
          <div class="mm-pro-table__column-list">
            <label v-for="column in columns" :key="column.key">
              <input
                type="checkbox"
                :aria-label="messages.proTable.showColumn(column.title)"
                :checked="isColumnVisible(column)"
                :data-column-key="column.key"
                :disabled="column.hideable === false"
                @change="toggleColumn(column, ($event.target as HTMLInputElement).checked)"
              >
              <span>{{ column.title }}</span><small>{{ column.hideable === false ? messages.proTable.requiredColumn : column.key }}</small>
            </label>
          </div>
          <footer><button type="button" @click="resetColumns">{{ messages.proTable.resetColumns }}</button><button type="button" @click="showAllColumns">{{ messages.proTable.showAllColumns }}</button></footer>
        </div>
      </template>
    </MmPopover>
    <slot name="after-columns" />
  </div>
</template>
