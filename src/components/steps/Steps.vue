<script setup lang="ts">
import { MmIcon } from '../icon'
import type { StepItem, StepsProps, StepStatus } from './types'

defineOptions({ name: 'MmSteps' })

const props = withDefaults(defineProps<StepsProps>(), {
  clickable: false,
  current: 0,
  direction: 'horizontal',
  items: () => [],
  status: 'process',
})
const emit = defineEmits<{ change: [index: number, item: StepItem] }>()

function stepStatus(item: StepItem, index: number): StepStatus {
  if (item.status) return item.status
  if (index < props.current) return 'finish'
  if (index === props.current) return props.status
  return 'wait'
}

function change(index: number, item: StepItem): void {
  if (props.clickable && !item.disabled) emit('change', index, item)
}
</script>

<template>
  <ol
    class="mm-steps"
    :class="`mm-steps--${direction}`"
    data-mm-component="steps"
    role="list"
  >
    <li
      v-for="(item, index) in items"
      :key="`${index}-${item.title}`"
      class="mm-step"
      :class="[`is-${stepStatus(item, index)}`, { 'is-clickable': clickable, 'is-disabled': item.disabled }]"
      :data-status="stepStatus(item, index)"
      :aria-current="index === current ? 'step' : undefined"
    >
      <div class="mm-step__rail" aria-hidden="true">
        <span class="mm-step__line" />
        <span class="mm-step__icon">
          <slot name="icon" :index="index" :item="item" :status="stepStatus(item, index)">
            <component :is="item.icon" v-if="item.icon" />
            <MmIcon v-else-if="stepStatus(item, index) === 'finish'" name="check" :size="14" />
            <MmIcon v-else-if="stepStatus(item, index) === 'error'" name="close" :size="14" />
            <span v-else>{{ index + 1 }}</span>
          </slot>
        </span>
      </div>
      <component
        :is="clickable ? 'button' : 'div'"
        class="mm-step__body"
        :type="clickable ? 'button' : undefined"
        :disabled="clickable && item.disabled ? true : undefined"
        @click="change(index, item)"
      >
        <span class="mm-step__title"><slot name="title" :index="index" :item="item" :status="stepStatus(item, index)">{{ item.title }}</slot></span>
        <span v-if="item.description || $slots.description" class="mm-step__description">
          <slot name="description" :index="index" :item="item" :status="stepStatus(item, index)">{{ item.description }}</slot>
        </span>
      </component>
    </li>
  </ol>
</template>

<style src="./steps.css"></style>
