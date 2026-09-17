<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import { useEventListener } from '../../composables/use-event-listener'
import { useLocale } from '../../composables/use-locale'
import { useLockScroll } from '../../composables/use-lock-scroll'
import type { ImageExpose, ImageProps } from './types'

defineOptions({ inheritAttrs: false, name: 'MmImage' })

const props = withDefaults(defineProps<ImageProps>(), {
  alt: '',
  fit: 'cover',
  height: undefined,
  lazy: false,
  preview: false,
  previewSrcList: () => [],
  width: undefined,
})
const emit = defineEmits<{ error: [event: Event]; load: [event: Event]; 'preview-close': []; 'preview-open': [] }>()
const { messages } = useLocale()
const loading = ref(true)
const failed = ref(false)
const previewOpen = ref(false)
const currentIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const overlayRef = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null
const scrollLock = useLockScroll()

const sources = computed(() => props.previewSrcList.length ? props.previewSrcList : [props.src])
const previewSource = computed(() => sources.value[currentIndex.value] || props.src)
const rootStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}))

watch(() => props.src, () => {
  loading.value = true
  failed.value = false
})

watch(previewOpen, (open) => {
  if (open) {
    scrollLock.lock()
    void nextTick(() => overlayRef.value?.focus())
  } else scrollLock.unlock()
})

function onLoad(event: Event): void {
  loading.value = false
  failed.value = false
  emit('load', event)
}

function onError(event: Event): void {
  loading.value = false
  failed.value = true
  emit('error', event)
}

function openPreview(): void {
  if (!props.preview || failed.value) return
  previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : triggerRef.value ?? null
  const sourceIndex = sources.value.indexOf(props.src)
  currentIndex.value = sourceIndex >= 0 ? sourceIndex : 0
  previewOpen.value = true
  emit('preview-open')
}

function closePreview(): void {
  if (!previewOpen.value) return
  previewOpen.value = false
  emit('preview-close')
  const target = previousFocus
  previousFocus = null
  void nextTick(() => target?.focus())
}

function move(amount: number): void {
  if (sources.value.length < 2) return
  currentIndex.value = (currentIndex.value + amount + sources.value.length) % sources.value.length
}

useEventListener<KeyboardEvent>(
  () => typeof document === 'undefined' ? undefined : document,
  'keydown',
  (event) => {
    if (!previewOpen.value) return
    if (event.key === 'Escape') {
      event.preventDefault()
      closePreview()
    } else if (event.key === 'ArrowLeft') move(-1)
    else if (event.key === 'ArrowRight') move(1)
  },
)

defineExpose<ImageExpose>({ closePreview, openPreview })
</script>

<template>
  <figure v-bind="$attrs" class="mm-image" :class="{ 'is-error': failed, 'is-loading': loading }" :style="rootStyle" data-mm-component="image">
    <component
      :is="preview ? 'button' : 'div'"
      ref="triggerRef"
      class="mm-image__trigger"
      :type="preview ? 'button' : undefined"
      :aria-label="preview ? messages.image.previewActionFor(alt || messages.image.image) : undefined"
      @click="openPreview"
    >
      <img
        v-if="!failed"
        class="mm-image__native"
        :class="{ 'is-pending': loading }"
        :src="src"
        :alt="alt"
        :loading="lazy ? 'lazy' : 'eager'"
        :style="{ objectFit: fit }"
        @load="onLoad"
        @error="onError"
      >
      <div v-if="loading && !failed" class="mm-image__state mm-image__placeholder" aria-hidden="true"><slot name="placeholder"><span class="mm-image__spinner" /></slot></div>
      <div v-if="failed" class="mm-image__state mm-image__error" role="img" :aria-label="messages.image.loadFailedFor(alt || messages.image.image)"><slot name="error"><span aria-hidden="true">◇</span><small>{{ messages.image.loadFailed }}</small></slot></div>
      <span v-if="preview && !failed && !loading" class="mm-image__preview-hint" aria-hidden="true">⌕</span>
    </component>
  </figure>

  <Teleport to="body">
    <div
      v-if="previewOpen"
      ref="overlayRef"
      class="mm-image-preview"
      data-mm-component="image-preview"
      role="dialog"
      aria-modal="true"
      :aria-label="alt ? messages.image.previewFor(alt) : messages.image.preview"
      tabindex="-1"
      @click.self="closePreview"
    >
      <button class="mm-image-preview__close" type="button" :aria-label="messages.image.closePreview" @click="closePreview">×</button>
      <button v-if="sources.length > 1" class="mm-image-preview__previous" type="button" :aria-label="messages.image.previous" @click="move(-1)">‹</button>
      <img class="mm-image-preview__image" :src="previewSource" :alt="alt">
      <button v-if="sources.length > 1" class="mm-image-preview__next" type="button" :aria-label="messages.image.next" @click="move(1)">›</button>
      <span v-if="sources.length > 1" class="mm-image-preview__counter">{{ currentIndex + 1 }} / {{ sources.length }}</span>
    </div>
  </Teleport>
</template>

<style src="./image.css"></style>
