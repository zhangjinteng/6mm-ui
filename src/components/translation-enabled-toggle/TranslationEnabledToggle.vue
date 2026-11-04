<script setup lang="ts">
import { useId } from '../../composables/use-id'

defineProps<{ modelValue: boolean; disabled?: boolean; credentialReady: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()
const id = useId('translation-enabled')
</script>

<template>
  <div class="mm-translation-enabled">
    <div class="mm-translation-enabled__copy">
      <span :id="`${id}-label`" class="mm-translation-enabled__title">开启自动翻译</span>
      <p :id="`${id}-hint`">{{ credentialReady ? '使用 Google 翻译服务，保存配置后生效。' : '请先配置 Google API Key；未开启时仍可人工翻译。' }}</p>
    </div>
    <div class="mm-translation-enabled__control">
      <span aria-hidden="true">{{ modelValue ? '已开启' : '已关闭' }}</span>
      <button
        type="button"
        class="mm-translation-enabled__switch"
        role="switch"
        :aria-checked="modelValue"
        :aria-labelledby="`${id}-label`"
        :aria-describedby="`${id}-hint`"
        :disabled="disabled || !credentialReady"
        @click="emit('update:modelValue', !modelValue)"
      ><span /></button>
    </div>
  </div>
</template>

<style scoped>
.mm-translation-enabled { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px; border:1px solid var(--mm-color-line); border-radius:8px; background:var(--mm-color-panel); }
.mm-translation-enabled__copy { min-width:0; }
.mm-translation-enabled__title { color:var(--mm-color-text); font-size:13px; font-weight:600; }
.mm-translation-enabled__copy p { margin:5px 0 0; color:var(--mm-color-text-muted); font-size:12px; line-height:1.6; }
.mm-translation-enabled__control { display:flex; align-items:center; gap:8px; flex-shrink:0; color:var(--mm-color-text-muted); font-size:12px; }
.mm-translation-enabled__switch { display:inline-flex; align-items:center; width:36px; height:20px; padding:2px; border:0; border-radius:999px; background:var(--mm-color-line-strong); cursor:pointer; }
.mm-translation-enabled__switch > span { width:16px; height:16px; border-radius:50%; background:#fff; box-shadow:0 1px 2px #0002; }
.mm-translation-enabled__switch[aria-checked="true"] { background:var(--mm-color-primary); }
.mm-translation-enabled__switch[aria-checked="true"] > span { transform:translateX(16px); }
.mm-translation-enabled__switch:focus-visible { outline:2px solid var(--mm-color-primary); outline-offset:3px; }
.mm-translation-enabled__switch:disabled { opacity:.5; cursor:not-allowed; }
@media (max-width:400px) { .mm-translation-enabled__control { flex-direction:column-reverse; gap:4px; } }
</style>
