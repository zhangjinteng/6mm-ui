<script setup lang="ts">
import { computed, ref } from 'vue'

import { MmButton } from '../button'
import { MmFilterDrawer, type FilterDrawerExpose } from '../filter-drawer'
import { MmIcon } from '../icon'
import ProTableTools from '../pro-table/ProTableTools.vue'
import type { ProTableColumn } from '../pro-table'
import { MmQueryBar, type QueryBarField, type QueryBarValue } from '../query-bar'

const props = withDefaults(defineProps<{
  columns: Pick<ProTableColumn, 'key' | 'title' | 'hideable' | 'defaultHidden'>[]
  fields: QueryBarField[]
  loading?: boolean
  modelValue: QueryBarValue
  title: string
  visibleColumnKeys?: string[]
}>(), { loading: false, visibleColumnKeys: () => [] })
const emit = defineEmits<{
  query: [value: QueryBarValue]
  reset: [value: QueryBarValue]
  refresh: []
  'source-query': [value: QueryBarValue]
  'update:modelValue': [value: QueryBarValue]
  'update:visibleColumnKeys': [keys: string[]]
}>()
const queryBar = ref<{ query: () => void }>()
const drawer = ref<FilterDrawerExpose>()
const visibleKeys = computed(() => props.visibleColumnKeys.length
  ? props.visibleColumnKeys
  : props.columns.map(column => column.key))
let submittingSource = false

function query(value: QueryBarValue) {
  if (submittingSource) emit('source-query', value)
  else emit('query', value)
}

function searchSource(inDrawer = false) {
  if (props.loading) return
  submittingSource = true
  try {
    if (inDrawer) drawer.value?.query()
    else queryBar.value?.query()
  } finally {
    submittingSource = false
  }
}
</script>

<template>
  <div class="mm-pro-table__query mm-hedging-query-bar">
    <MmQueryBar
      ref="queryBar"
      :fields="fields"
      :loading="loading"
      :model-value="modelValue"
      single-line
      size="sm"
      @update:model-value="emit('update:modelValue', $event)"
      @query="query"
      @reset="emit('reset', $event)"
    >
      <template v-if="$slots['source-filter']" #field-agentId>
        <slot name="source-filter" :loading="loading" :search="() => searchSource()" />
      </template>
      <template #buttons="context">
        <ProTableTools
          :auto-refreshable="false"
          :columns="columns"
          :disabled="context.disabled"
          :refreshing="loading"
          :visible-column-keys="visibleKeys"
          @refresh="emit('refresh')"
          @update:visible-column-keys="emit('update:visibleColumnKeys', $event)"
        >
          <MmButton
            data-query-action="query"
            :disabled="context.disabled"
            :loading="context.loading"
            size="sm"
            variant="primary"
            @click="context.query"
          ><template #icon><MmIcon name="search" :size="13" /></template>{{ context.queryText }}</MmButton>
          <MmButton
            data-query-action="reset"
            :disabled="context.disabled"
            size="sm"
            @click="context.reset"
          ><template #icon><MmIcon name="rotate-ccw" :size="13" /></template>{{ context.resetText }}</MmButton>
          <template #after-columns>
            <MmFilterDrawer
              ref="drawer"
              data-pro-table-tool="filter-drawer"
              :disabled="context.disabled"
              :fields="fields"
              :loading="loading"
              :model-value="modelValue"
              :title="title"
              @query="query"
              @reset="emit('reset', $event)"
            >
              <template v-if="$slots['source-filter']" #field-agentId>
                <slot name="source-filter" :loading="loading" :search="() => searchSource(true)" />
              </template>
            </MmFilterDrawer>
          </template>
        </ProTableTools>
      </template>
    </MmQueryBar>
  </div>
</template>

<style scoped>
.mm-hedging-query-bar {
  min-width: 0;
  flex: 0 0 auto;
}
</style>
