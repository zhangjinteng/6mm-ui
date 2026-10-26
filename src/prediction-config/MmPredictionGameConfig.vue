<script setup lang="ts">
import { computed, provide } from 'vue'
import type { Component } from 'vue'
import PlatformConfig from './platform/views/config/prediction/index.vue'
import AgentConfig from './agent/views/prediction/game-config/index.vue'
import { predictionConfigRuntimeKey, type PredictionConfigAdapter, type PredictionConfigContext } from './runtime'

defineOptions({ name: 'MmPredictionGameConfig' })
const props = withDefaults(defineProps<{
  adapter: PredictionConfigAdapter
  context: PredictionConfigContext
  symbolComponent: Component
  locale?: string
  translate?: (key: string) => string
  hasTranslation?: (key: string) => boolean
  registerBeforeLeave?: (guard: () => boolean | Promise<boolean>) => void
}>(), { locale: 'zh-CN' })
provide(predictionConfigRuntimeKey, {
  get context() { return props.context },
  get adapter() { return props.adapter },
  get symbolComponent() { return props.symbolComponent },
  get locale() { return props.locale },
  translate: key => props.translate?.(key) ?? key,
  hasTranslation: key => props.hasTranslation?.(key) ?? false,
  registerBeforeLeave: guard => props.registerBeforeLeave?.(guard),
})
const identity = computed(() => `${props.adapter.role}:${props.context.operatorId}:${props.context.identityKey}`)
const authenticated = computed(() => /^[1-9]\d*$/.test(props.context.operatorId) && Boolean(props.context.identityKey))
</script>
<template>
  <section class="mm-prediction-game-config mm-ui" data-mm-component="prediction-game-config">
    <p v-if="!authenticated" role="alert">无法确认当前操作人身份</p>
    <component v-else :is="adapter.role === 'platform' ? PlatformConfig : AgentConfig" :key="identity" />
  </section>
</template>
<style>
.mm-prediction-game-config { min-height:0; min-width:0; }
</style>
