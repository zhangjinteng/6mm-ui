<template>
    <button
        type="button"
        role="switch"
        class="news-toggle"
        :class="{ 'is-on': modelValue }"
        :aria-checked="modelValue"
        aria-label="启用状态"
        :disabled="disabled"
        @click="$emit('update:modelValue', !modelValue)"
    >
        <span class="news-toggle__track" aria-hidden="true"><span /></span>
        <span>{{ modelValue ? '已启用' : '已停用' }}</span>
    </button>
</template>
<script setup lang="ts">
defineProps<{ modelValue: boolean; disabled?: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
<style scoped>
.news-toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    border: 0;
    padding: 0;
    background: transparent;
    color: var(--mm-color-text-muted);
    font: inherit;
    cursor: pointer;
}
.news-toggle__track {
    width: 34px;
    height: 20px;
    border-radius: 20px;
    padding: 2px;
    background: var(--mm-color-line-strong, #cbd5e1);
    flex: none;
}
.news-toggle__track > span {
    display: block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    transition: transform 0.15s ease;
}
.is-on {
    color: var(--mm-color-primary);
}
.is-on .news-toggle__track {
    background: var(--mm-color-primary);
}
.is-on .news-toggle__track > span {
    transform: translateX(14px);
}
.news-toggle:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}
.news-toggle:focus-visible {
    outline: 2px solid var(--mm-color-primary);
    outline-offset: 4px;
    border-radius: 3px;
}
@media (prefers-reduced-motion: reduce) {
    .news-toggle__track > span {
        transition: none;
    }
}
</style>
