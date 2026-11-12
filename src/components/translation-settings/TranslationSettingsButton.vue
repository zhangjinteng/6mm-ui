<script setup lang="ts">
import { computed } from 'vue'
import MmButton from '../button/Button.vue'
import MmIcon from '../icon/Icon.vue'

defineOptions({ name: 'MmTranslationSettingsButton' })
const props = withDefaults(defineProps<{ disabled?: boolean; locale?: string }>(), {
  disabled: false,
  locale: 'zh-CN',
})
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const label = computed(() => props.locale.toLowerCase().startsWith('en') ? 'Translation settings' : '翻译设置')
</script>

<template>
  <MmButton class="mm-translation-settings-button" size="sm" :disabled="disabled" @click="emit('click', $event)">
    <template #icon><span class="mm-translation-settings-button__provider-dot" aria-hidden="true" /></template>
    {{ label }} <MmIcon name="settings-2" :size="15" />
  </MmButton>
</template>

<style>
.mm-translation-settings-button .mm-button__label { display: inline-flex; align-items: center; gap: 6px; }
.mm-translation-settings-button__provider-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--mm-color-success); box-shadow: 0 0 0 3px var(--mm-color-success-soft); }
</style>
