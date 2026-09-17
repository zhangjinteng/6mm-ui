<script setup lang="ts">
import { computed } from 'vue'

import { useLocale } from '../../composables/use-locale'
import { MmIcon } from '../icon'
import type { PageHeaderProps } from './types'

defineOptions({ name: 'MmPageHeader' })

const props = withDefaults(defineProps<PageHeaderProps>(), {
  breadcrumbs: () => [],
  showBack: false,
  subtitle: undefined,
})
defineEmits<{ back: [] }>()
const { messages } = useLocale()
const resolvedBackLabel = computed(() => props.backLabel ?? messages.value.pageHeader.back)
</script>

<template>
  <header class="mm-page-header" data-mm-component="page-header" :aria-label="title">
    <div v-if="$slots.breadcrumb || breadcrumbs.length" class="mm-page-header__breadcrumb-row">
      <slot name="breadcrumb">
        <nav :aria-label="messages.pageHeader.breadcrumb">
          <ol class="mm-page-header__breadcrumbs">
            <li
              v-for="(item, index) in breadcrumbs"
              :key="`${index}-${item.label}`"
              class="mm-page-header__breadcrumb-item"
              :aria-current="index === breadcrumbs.length - 1 ? 'page' : undefined"
            >
              <a v-if="item.href && index < breadcrumbs.length - 1" :href="item.href">{{ item.label }}</a>
              <span v-else>{{ item.label }}</span>
              <MmIcon v-if="index < breadcrumbs.length - 1" name="chevron-right" :size="12" aria-hidden="true" />
            </li>
          </ol>
        </nav>
      </slot>
    </div>
    <div class="mm-page-header__main">
      <button v-if="showBack" class="mm-page-header__back" type="button" :aria-label="resolvedBackLabel" @click="$emit('back')">
        <MmIcon name="arrow-left" :size="17" />
        <span>{{ resolvedBackLabel }}</span>
      </button>
      <div class="mm-page-header__heading">
        <h1 class="mm-page-header__title"><slot name="title">{{ title }}</slot></h1>
        <p v-if="subtitle || $slots.subtitle" class="mm-page-header__subtitle"><slot name="subtitle">{{ subtitle }}</slot></p>
      </div>
      <div v-if="$slots.extra" class="mm-page-header__extra"><slot name="extra" /></div>
    </div>
    <div v-if="$slots.default" class="mm-page-header__content"><slot /></div>
  </header>
</template>

<style src="./page-header.css"></style>
