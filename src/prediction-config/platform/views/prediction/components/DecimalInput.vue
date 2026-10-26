<template>
    <component :is="inputComponent || elementInput" class="prediction-decimal-input" v-bind="$attrs" :modelValue="displayValue" :disabled="isDisabled" :inputmode="$attrs.inputmode || 'decimal'" @update:model-value="update" @keydown.up.prevent="adjust(1)" @keydown.down.prevent="adjust(-1)">
        <template #suffix>
            <span class="decimal-step-controls">
                <button type="button" tabindex="-1" aria-label="增加数值" :disabled="isDisabled || nextUp === null || nextUp === displayValue" @mousedown.prevent @click="adjust(1)"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 7 3-3 3 3" /></svg></button>
                <button type="button" tabindex="-1" aria-label="减少数值" :disabled="isDisabled || nextDown === null || nextDown === displayValue" @mousedown.prevent @click="adjust(-1)"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 5 3 3 3-3" /></svg></button>
            </span>
        </template>
        <template v-if="unit || $slots.append" #append><slot name="append">{{ unit }}</slot></template>
    </component>
</template>
<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { ElInput, useFormDisabled } from 'element-plus'
import { stepDecimal, shiftDecimalText } from './decimal-step'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ modelValue: string; step?: string; min?: string; max?: string; unit?: string; disabled?: boolean; percentage?: boolean; inputComponent?: Component }>(), { step:'1', min:'0', disabled:undefined, percentage:false })
const elementInput = ElInput
const emit = defineEmits<{ 'update:modelValue': [value: string]; input: [value: string] }>()
const isDisabled = useFormDisabled()
const displayValue = ref(props.percentage ? shiftDecimalText(props.modelValue, 2) : props.modelValue)
watch(() => [props.modelValue, props.percentage], () => {
    // Preserve a fractional edit such as 95. or 90.10 when its ratio is echoed by v-model.
    if (props.percentage && shiftDecimalText(displayValue.value, -2) === props.modelValue) return
    displayValue.value = props.percentage ? shiftDecimalText(props.modelValue, 2) : props.modelValue
})
const next = (direction: 1 | -1) => stepDecimal(displayValue.value, props.step, direction, props.min, props.max)
const nextUp = computed(() => next(1)), nextDown = computed(() => next(-1))
function update(value: string) { if (isDisabled.value) return; displayValue.value = value; const result = props.percentage ? shiftDecimalText(value, -2) : value; emit('update:modelValue', result); emit('input', result) }
function adjust(direction: 1 | -1) { if (isDisabled.value) return; const value = next(direction); if (value !== null && value !== displayValue.value) update(value) }
</script>
<style scoped>
.prediction-decimal-input { min-width:0; }
.prediction-decimal-input.el-input :deep(.el-input__wrapper) { padding-right:0; }
.prediction-decimal-input :deep(.el-input__suffix-inner) { align-self:stretch; }
.decimal-step-controls { display:grid; grid-template-rows:1fr 1fr; align-self:stretch; width:30px; margin:0; border-left:1px solid var(--el-border-color-lighter); }
.decimal-step-controls button { display:flex; align-items:center; justify-content:center; padding:0; border:0; background:var(--el-fill-color-lighter); color:var(--el-text-color-secondary); cursor:pointer; min-height:0; }
.decimal-step-controls button + button { border-top:1px solid var(--el-border-color-lighter); }
.decimal-step-controls button:hover:not(:disabled) { color:var(--el-color-primary); background:var(--el-color-primary-light-9); }
.decimal-step-controls button:disabled { cursor:not-allowed; opacity:.4; }
.decimal-step-controls svg { width:10px; height:10px; fill:none; stroke:currentColor; stroke-width:1.2; }
.prediction-decimal-input :deep(.el-input-group__append) { padding:0 10px; font-size:10px; font-family:inherit; }
.mm-input :deep(.mm-input__suffix) { align-self:stretch; padding-right:0; }
.mm-input .decimal-step-controls { border-color:var(--mm-color-line-strong); }
.mm-input .decimal-step-controls button { background:var(--mm-color-soft); color:var(--mm-color-text-muted); }
.mm-input .decimal-step-controls button + button { border-color:var(--mm-color-line-strong); }
.mm-input .decimal-step-controls button:hover:not(:disabled) { color:var(--mm-color-primary); background:var(--mm-color-primary-soft); }
</style>
