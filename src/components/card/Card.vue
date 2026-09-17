<script setup lang="ts">
import type { CardProps } from './types'

defineOptions({ name: 'MmCard' })

withDefaults(defineProps<CardProps>(), {
  bordered: true,
  hoverable: false,
  shadow: 'never',
  subtitle: undefined,
  title: undefined,
})
</script>

<template>
  <article
    class="mm-card"
    :class="[`is-shadow-${shadow}`, { 'is-bordered': bordered, 'is-hoverable': hoverable }]"
    data-mm-component="card"
  >
    <header v-if="$slots.header || title || subtitle" class="mm-card__header">
      <slot name="header">
        <div>
          <h3 v-if="title" class="mm-card__title">{{ title }}</h3>
          <p v-if="subtitle" class="mm-card__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <div v-if="$slots.extra" class="mm-card__extra"><slot name="extra" /></div>
    </header>
    <div class="mm-card__body"><slot /></div>
    <footer v-if="$slots.footer" class="mm-card__footer"><slot name="footer" /></footer>
  </article>
</template>

<style src="./card.css"></style>
