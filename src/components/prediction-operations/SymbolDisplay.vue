<script setup lang="ts">
import { usePresentation } from './context'
const context = usePresentation()
defineProps<{symbol?: unknown}>()
</script>
<template><component v-if="context().symbolComponent" :is="context().symbolComponent" :symbol="symbol" /><span v-else>{{ symbol || '-' }}</span></template>
