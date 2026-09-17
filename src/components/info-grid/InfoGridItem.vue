<script setup lang="ts">
import { computed, inject, ref } from "vue";

import { infoGridKey, type InfoGridItemProps } from "./types";

defineOptions({ name: "MmInfoGridItem" });

const props = withDefaults(defineProps<InfoGridItemProps>(), {
  label: undefined,
  span: 1,
  valueClass: undefined,
});
const context = inject(infoGridKey, { columns: ref(2) });
const safeSpan = computed(() =>
  Math.min(context.columns.value, Math.max(1, Math.floor(props.span))),
);
const isFull = computed(() => safeSpan.value === context.columns.value);
</script>

<template>
  <div
    class="mm-info-grid-item"
    :class="{ 'is-full': isFull }"
    :style="{ '--mm-info-grid-span': safeSpan }"
    data-mm-component="info-grid-item"
  >
    <dt class="mm-info-grid-item__label">
      <slot name="label">{{ label }}</slot>
    </dt>
    <dd class="mm-info-grid-item__value" :class="valueClass">
      <slot />
    </dd>
  </div>
</template>
