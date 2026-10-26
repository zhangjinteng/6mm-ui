<template>
    <mm-tag effect="soft" round size="sm" :type="tagType">{{ label }}</mm-tag>
</template>

<script setup lang="ts">
import { MmTag, type TagType } from './ui'
import { computed } from 'vue'
import { usePredictionLocale } from './locale'
const t = usePredictionLocale()

type SourceType = 'merchant' | 'white_label' | 'platform'

const props = withDefaults(defineProps<{ sourceType?: SourceType | null }>(), {
    sourceType: 'merchant'
})

const labels = { merchant: '商户', white_label: '白标', platform: '平台' }
const types: Record<SourceType, TagType> = { merchant: 'primary', white_label: 'info', platform: 'success' }
const label = computed(() => props.sourceType ? t(labels[props.sourceType]) : '-')
const tagType = computed<TagType>(() => props.sourceType ? types[props.sourceType] : 'default')
</script>
