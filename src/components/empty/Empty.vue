<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import type { EmptyProps } from './types'

defineOptions({ name: 'MmEmpty' })

const props = withDefaults(defineProps<EmptyProps>(), {
  image: undefined,
  imageSize: 88,
})
const { messages } = useLocale()
const resolvedDescription = computed(() => props.description ?? messages.value.common.noData)
const imageStyle = computed(() => ({
  '--mm-empty-image-size': typeof props.imageSize === 'number' ? `${props.imageSize}px` : props.imageSize,
}))
</script>

<template>
  <section class="mm-empty" data-mm-component="empty" role="status" :aria-label="resolvedDescription">
    <div class="mm-empty__image" :style="imageStyle" aria-hidden="true">
      <slot name="image">
        <img v-if="image" :src="image" alt="">
        <svg v-else viewBox="0 0 120 82" fill="none">
          <path d="M19 59 34 29h52l15 30" />
          <path d="M9 59h34l6 9h22l6-9h34v15H9V59Z" />
          <path d="M43 42h34M49 32h22" />
        </svg>
      </slot>
    </div>
    <p class="mm-empty__description"><slot name="description">{{ resolvedDescription }}</slot></p>
    <div v-if="$slots.default" class="mm-empty__actions"><slot /></div>
  </section>
</template>

<style src="./empty.css"></style>
