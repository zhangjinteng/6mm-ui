<script setup lang="ts">
import { computed, provide } from "vue";

import { infoGridKey, type InfoGridProps } from "./types";

defineOptions({ name: "MmInfoGrid" });

const props = withDefaults(defineProps<InfoGridProps>(), {
  columns: 2,
  size: "md",
});

const columns = computed(() => Math.max(1, Math.floor(props.columns)));

provide(infoGridKey, { columns });
</script>

<template>
  <dl
    class="mm-info-grid"
    :class="[`mm-info-grid--${size}`, `mm-info-grid--columns-${columns}`]"
    :style="{ '--mm-info-grid-columns': columns }"
    data-mm-component="info-grid"
  >
    <slot />
  </dl>
</template>

<style src="./info-grid.css"></style>
