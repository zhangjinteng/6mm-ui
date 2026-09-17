<script setup lang="ts">
import { computed, ref, useAttrs, watch } from "vue";

import { useFormField } from "../../composables/use-form-field";
import { useLocale } from "../../composables/use-locale";
import { MmInput } from "../input";
import type { InputNumberProps } from "./types";

defineOptions({ inheritAttrs: false, name: "MmInputNumber" });

const props = withDefaults(defineProps<InputNumberProps>(), {
  controls: true,
  disabled: false,
  max: Number.POSITIVE_INFINITY,
  min: Number.NEGATIVE_INFINITY,
  modelValue: null,
  precision: undefined,
  readonly: false,
  size: undefined,
  status: undefined,
  step: 1,
});
const emit = defineEmits<{
  blur: [event: FocusEvent];
  change: [value: number | null];
  focus: [event: FocusEvent];
  "update:modelValue": [value: number | null];
}>();
const { messages } = useLocale();
const attrs = useAttrs();
const draft = ref(format(props.modelValue));
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id,
  size: () => props.size,
  status: () => props.status,
});

watch(
  () => props.modelValue,
  (value) => {
    draft.value = format(value);
  },
);

const numericDraft = computed(() => parse(draft.value));
const canDecrease = computed(
  () =>
    !field.disabled.value &&
    !props.readonly &&
    (numericDraft.value ?? 0) > props.min,
);
const canIncrease = computed(
  () =>
    !field.disabled.value &&
    !props.readonly &&
    (numericDraft.value ?? 0) < props.max,
);

function inferredPrecision(): number {
  if (props.precision !== undefined) return Math.max(0, props.precision);
  const decimals = String(props.step).split(".")[1];
  return decimals?.length ?? 0;
}

function format(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value))
    return "";
  return props.precision === undefined
    ? String(value)
    : value.toFixed(inferredPrecision());
}

function parse(value: string): number | null {
  if (value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalize(value: number): number {
  const precision = inferredPrecision();
  const rounded = Number(value.toFixed(precision));
  return Math.min(props.max, Math.max(props.min, rounded));
}

function commit(value = numericDraft.value): void {
  if (value === null) {
    if (draft.value.trim() !== "") {
      draft.value = format(props.modelValue);
      return;
    }
    emit("update:modelValue", null);
    emit("change", null);
    return;
  }
  const next = normalize(value);
  draft.value = format(next);
  emit("update:modelValue", next);
  emit("change", next);
}

function stepBy(direction: 1 | -1): void {
  if (field.disabled.value || props.readonly) return;
  const fallback = Number.isFinite(props.min) ? props.min : 0;
  commit((numericDraft.value ?? fallback) + props.step * direction);
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  stepBy(event.key === "ArrowUp" ? 1 : -1);
}
</script>

<template>
  <span
    class="mm-input-number"
    :class="{ 'is-with-controls': controls }"
    data-mm-component="input-number"
  >
    <MmInput
      v-bind="attrs"
      :id="field.id.value"
      :model-value="draft"
      :name="name"
      :placeholder="placeholder"
      :disabled="field.disabled.value"
      :readonly="readonly"
      :size="field.size.value"
      :status="field.status.value"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      :aria-valuemin="Number.isFinite(min) ? min : undefined"
      :aria-valuemax="Number.isFinite(max) ? max : undefined"
      :aria-valuenow="numericDraft ?? undefined"
      @update:model-value="draft = $event"
      @focus="emit('focus', $event)"
      @blur="
        commit();
        emit('blur', $event);
      "
      @keydown="onKeydown"
    >
      <template v-if="$slots.suffix" #suffix><slot name="suffix" /></template>
    </MmInput>
    <span v-if="controls" class="mm-input-number__controls">
      <button
        class="mm-input-number__control mm-input-number__increase"
        type="button"
        tabindex="-1"
        :aria-label="messages.input.increase"
        :disabled="!canIncrease"
        @click="stepBy(1)"
      >
        +
      </button>
      <button
        class="mm-input-number__control mm-input-number__decrease"
        type="button"
        tabindex="-1"
        :aria-label="messages.input.decrease"
        :disabled="!canDecrease"
        @click="stepBy(-1)"
      >
        −
      </button>
    </span>
  </span>
</template>

<style src="./input-number.css"></style>
