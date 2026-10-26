<template>
    <component
        :is="as"
        class="prediction-loading-region"
        :class="{ 'is-loading': loading }"
        :style="{ '--prediction-loading-min-height': minHeight }"
        :aria-busy="loading"
    >
        <div
            class="prediction-loading-region__content"
            :class="{ 'is-hidden': hideContent }"
            :inert="loading || undefined"
            :aria-hidden="hideContent || undefined"
        >
            <slot />
        </div>
        <MmLoading :visible="visible" size="md" :text="text" />
    </component>
</template>

<script setup lang="ts">
import { MmLoading } from '../../../../ui'
import { onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    as?: 'div' | 'aside' | 'main' | 'section'
    hideContent?: boolean
    loading: boolean
    minHeight?: string
    text?: string
}>(), {
    as: 'div',
    hideContent: false,
    minHeight: '280px',
    text: '正在加载配置…',
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
function clearTimer() {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
}
watch(() => props.loading, loading => {
    clearTimer()
    visible.value = false
    if (loading) {
        timer = setTimeout(() => {
            timer = undefined
            visible.value = props.loading
        }, 150)
    }
}, { immediate: true, flush: 'sync' })
onBeforeUnmount(clearTimer)
</script>

<style scoped>
.prediction-loading-region {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    isolation: isolate;
    /* Replacing a placeholder must not pull the configuration scroll position. */
    overflow-anchor: none;
}
.prediction-loading-region.is-loading {
    min-height: var(--prediction-loading-min-height);
}
.prediction-loading-region__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: inherit;
    min-width: 0;
    min-height: 0;
}
.prediction-loading-region__content.is-hidden { visibility: hidden; }
.prediction-loading-region__content[inert] { pointer-events: none; user-select: none; }
</style>
