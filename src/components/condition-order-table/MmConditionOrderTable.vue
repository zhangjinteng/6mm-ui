<script setup lang="ts">
import { ref } from 'vue'

import ConditionOrderTableCore from './ConditionOrderTableCore.vue'
import type { ConditionOrderTableExpose, ConditionOrderTablePresetProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmConditionOrderTable' })
withDefaults(defineProps<ConditionOrderTablePresetProps>(), {
  fillHeight: true,
  showUserType: true,
})
const coreRef = ref<ConditionOrderTableExpose | null>(null)
defineExpose({ reload: () => coreRef.value?.reload() ?? Promise.resolve() })
</script>

<template>
  <ConditionOrderTableCore ref="coreRef" v-bind="{ ...$attrs, ...$props }" kind="condition">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps || {}" />
    </template>
  </ConditionOrderTableCore>
</template>
