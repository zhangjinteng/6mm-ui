<script setup lang="ts">
import { computed } from 'vue'
import { MmInput } from '../input'
import { MmTag } from '../tag'

export interface TranslationField { key: string; label: string; maxLength: number; multiline?: boolean }
const props = withDefaults(defineProps<{
  locales: { value: string; label: string; placeholder?: string }[]
  fields: TranslationField[]
  values: Record<string, object | undefined>
  errors?: Record<string, Record<string, string | undefined> | undefined>
  sourceLocale?: string
  disabled?: boolean
  emptyText?: string
  locale?: string
}>(), { disabled: false, emptyText: '暂无匹配语言' })
const emit = defineEmits<{ edit: [locale: string, field: string, value: string] }>()
const value = (locale: string, key: string) => String((props.values[locale] as Record<string, unknown> | undefined)?.[key] ?? '')
const failed = (locale: string) => Object.values(props.errors?.[locale] || {}).some(Boolean)
const complete = (locale: string) => props.fields.every(field => value(locale, field.key).trim())
const copy = computed(() => props.locale?.startsWith('en')
  ? { source: 'Source', failed: 'Failed', configured: 'Configured', missing: 'Pending' }
  : { source: '源语言', failed: '翻译失败', configured: '已配置', missing: '待完善' })
function edit(locale: string, field: string, next: unknown) {
  if (!props.disabled) emit('edit', locale, field, String(next ?? ''))
}
</script>

<template>
  <div class="mm-multilingual-fields" data-mm-component="multilingual-fields">
    <section v-for="locale in locales" :key="locale.value" class="mm-multilingual-fields__row"
      :class="{ 'is-source': locale.value === sourceLocale }" :style="{ '--translation-field-count': fields.length }">
      <div class="mm-multilingual-fields__language">
        <strong>{{ locale.label }}</strong>
        <MmTag size="sm" :type="failed(locale.value) ? 'danger' : complete(locale.value) ? 'success' : 'info'">
          {{ locale.value === sourceLocale ? copy.source : failed(locale.value) ? copy.failed : complete(locale.value) ? copy.configured : copy.missing }}
        </MmTag>
      </div>
      <label v-for="field in fields" :key="field.key">
        {{ field.label }}
        <textarea v-if="field.multiline" :value="value(locale.value, field.key)" :rows="2"
          :maxlength="field.maxLength" :disabled="disabled" :aria-label="`${locale.value} ${field.label}`"
          @input="edit(locale.value, field.key, ($event.target as HTMLTextAreaElement).value)" />
        <MmInput v-else :model-value="value(locale.value, field.key)" :maxlength="field.maxLength"
          :placeholder="locale.placeholder" :disabled="disabled" :aria-label="`${locale.value} ${field.label}`"
          @update:model-value="edit(locale.value, field.key, $event)" />
        <small v-if="errors?.[locale.value]?.[field.key]" class="mm-multilingual-fields__error">{{ errors[locale.value]![field.key] }}</small>
      </label>
    </section>
    <div v-if="!locales.length" class="mm-multilingual-fields__empty">{{ emptyText }}</div>
  </div>
</template>

<style scoped>
.mm-multilingual-fields { min-height: 0; color: var(--mm-color-text); }
.mm-multilingual-fields__row { display: grid; grid-template-columns: 145px repeat(var(--translation-field-count), minmax(0, 1fr)); gap: 16px; border-bottom: 1px solid var(--mm-color-line); padding: 18px 8px; }
.mm-multilingual-fields__row.is-source { background: var(--mm-color-primary-soft); border-left: 2px solid var(--mm-color-primary); }
.mm-multilingual-fields__language { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 8px; font-size: 12px; overflow-wrap: anywhere; }
.mm-multilingual-fields__row > label { display: grid; align-content: start; gap: 7px; min-width: 0; font-size: 12px; color: var(--mm-color-text-muted); }
.mm-multilingual-fields__error { color: var(--mm-color-danger); }
.mm-multilingual-fields textarea { box-sizing: border-box; width: 100%; padding: 8px 11px; border: 1px solid var(--mm-color-line-strong); border-radius: 5px; color: var(--mm-color-text); background: var(--mm-color-panel); font: inherit; line-height: 1.6; resize: vertical; }
.mm-multilingual-fields textarea:focus { outline: 1px solid var(--mm-color-primary); border-color: var(--mm-color-primary); }
.mm-multilingual-fields textarea:disabled { color: var(--mm-color-text-muted); cursor: not-allowed; }
.mm-multilingual-fields__empty { padding: 48px 16px; text-align: center; color: var(--mm-color-text-muted); }
@media(max-width:650px) { .mm-multilingual-fields__row { grid-template-columns: minmax(0, 1fr); } .mm-multilingual-fields__language { flex-direction: row; flex-wrap: wrap; justify-content: flex-start; } }
</style>
