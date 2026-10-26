<template>
    <div
        :class="['prediction-constraint', { 'is-compact': compact }]"
        role="group"
        :aria-label="title"
    >
        <div class="prediction-constraint__title">{{ title }}<ParameterHelp :label="title" /></div>
        <DecimalInput :input-component="MmInput" :step="percentage ? '1' : '0.01'" v-model="businessValue" :aria-label="title" :disabled="disabled">
            <template v-if="percentage || unit" #append>{{ percentage ? '%' : unit }}</template>
        </DecimalInput>
        <p v-if="description" class="constraint-description">{{ description }}</p>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { MmInput } from '../../../../ui'
import DecimalInput from '../../prediction/components/DecimalInput.vue'
import ParameterHelp from '../../prediction/components/ParameterHelp.vue'
import type { DecimalConstraint, IntegerConstraint } from './types'
import { decimalToPercentage, percentageToDecimal } from './form'
const props = withDefaults(
    defineProps<{
        title: string
        description?: string
        disabled?: boolean
        agentLocked?: boolean
        compact?: boolean
        field?: 'default_value' | 'maximum_value'
        percentage?: boolean
        unit?: string
    }>(),
    {
        disabled: false,
        agentLocked: false,
        compact: false,
        field: 'default_value',
        percentage: false,
        unit: ''
    }
)
const model = defineModel<DecimalConstraint | IntegerConstraint>({ required: true })
const businessValue = computed({
    get: () =>
        props.percentage ? decimalToPercentage(model.value[props.field]) : model.value[props.field],
    set: (value: string) => {
        const previous = model.value[props.field]
        const next = props.percentage ? percentageToDecimal(value) : value
        if (props.field === 'default_value' && model.value.maximum_value === previous) {
            // A new platform value also establishes its limit; later edits move
            // that limit with the value instead of trapping it at the first save.
            if (props.agentLocked && model.value.minimum_value === previous) model.value.minimum_value = next
            model.value.maximum_value = next
        }
        model.value[props.field] = next
    }
})
</script>

<style scoped>
.constraint-description { margin:8px 0 0; color:var(--el-text-color-secondary); font-size:10px; line-height:1.6; }
.prediction-constraint {
    min-width: 0;
}
.prediction-constraint__title {
    color: var(--el-text-color-primary);
    font-size:11px;
    font-weight:650;
    line-height:16px;
    margin-bottom:6px;
}
</style>
