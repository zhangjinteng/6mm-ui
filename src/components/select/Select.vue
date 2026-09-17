<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useAttrs, watch } from "vue";

import { useFormField } from "../../composables/use-form-field";
import { useId } from "../../composables/use-id";
import { useLocale } from "../../composables/use-locale";
import { MmIcon } from "../icon";
import { MmPopover } from "../popover";
import type { SelectOption, SelectProps, SelectValue } from "./types";

defineOptions({ inheritAttrs: false, name: "MmSelect" });

const props = withDefaults(defineProps<SelectProps>(), {
  clearable: false,
  disabled: false,
  filterable: false,
  loading: false,
  max: Number.POSITIVE_INFINITY,
  maxTagCount: Number.POSITIVE_INFINITY,
  modelValue: "",
  multiple: false,
  options: () => [],
  readonly: false,
  remoteMethod: undefined,
  size: undefined,
  status: undefined,
});
const emit = defineEmits<{
  change: [value: SelectValue | SelectValue[]];
  clear: [];
  error: [error: Error];
  "update:modelValue": [value: SelectValue | SelectValue[]];
  "visible-change": [value: boolean];
}>();
const { messages } = useLocale();
const attrs = useAttrs();
const resolvedPlaceholder = computed(
  () => props.placeholder ?? messages.value.select.placeholder,
);
const controlAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => key.startsWith("aria-") || key === "title",
    ),
  ),
);
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([key]) => !key.startsWith("aria-") && key !== "title",
    ),
  ),
);

const listboxId = useId("mm-select-listbox");
const controlRef = ref<HTMLElement>();
const searchRef = ref<HTMLInputElement>();
const open = ref(false);
const query = ref("");
const activeIndex = ref(-1);
const remoteOptions = ref<SelectOption[]>([]);
const remoteLoading = ref(false);
const remoteError = ref("");
let controller: AbortController | undefined;
let request = 0;
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id,
  size: () => props.size,
  status: () => props.status,
});

const selectedValues = computed<SelectValue[]>(() =>
  props.multiple
    ? Array.isArray(props.modelValue)
      ? props.modelValue
      : []
    : Array.isArray(props.modelValue)
      ? []
      : [props.modelValue],
);
const sourceOptions = computed(() =>
  props.remoteMethod ? remoteOptions.value : props.options,
);
const visibleOptions = computed(() => {
  if (props.remoteMethod || !props.filterable || !query.value)
    return sourceOptions.value;
  const normalized = query.value.toLowerCase();
  return sourceOptions.value.filter((option) =>
    option.label.toLowerCase().includes(normalized),
  );
});
const selectedOptions = computed(() =>
  props.options.filter((option) =>
    selectedValues.value.some((value) => Object.is(value, option.value)),
  ),
);
const visibleTagLimit = computed(() =>
  Number.isFinite(props.maxTagCount)
    ? Math.max(0, Math.floor(props.maxTagCount))
    : Number.POSITIVE_INFINITY,
);
const visibleSelectedOptions = computed(() =>
  selectedOptions.value.slice(0, visibleTagLimit.value),
);
const hiddenSelectedOptionsCount = computed(() =>
  Math.max(
    0,
    selectedOptions.value.length - visibleSelectedOptions.value.length,
  ),
);
const singleLabel = computed(() => selectedOptions.value[0]?.label ?? "");
const hasValue = computed(() =>
  props.multiple
    ? selectedValues.value.length > 0
    : selectedValues.value[0] !== "" && selectedValues.value[0] !== undefined,
);
const displayLabel = computed(() => {
  if (!hasValue.value) return resolvedPlaceholder.value;
  return singleLabel.value;
});
const disabled = computed(() => field.disabled.value);

watch(open, (value) => {
  emit("visible-change", value);
  if (value) {
    const selectedIndex = visibleOptions.value.findIndex((option) =>
      selectedValues.value.some((entry) => Object.is(entry, option.value)),
    );
    activeIndex.value =
      selectedIndex >= 0
        ? selectedIndex
        : visibleOptions.value.findIndex((option) => !option.disabled);
    if (props.filterable) void nextTick(() => searchRef.value?.focus());
  } else {
    query.value = "";
  }
});

function isSelected(option: SelectOption): boolean {
  return selectedValues.value.some((value) => Object.is(value, option.value));
}

function isOptionDisabled(option: SelectOption): boolean {
  return Boolean(
    option.disabled ||
    (props.multiple &&
      !isSelected(option) &&
      selectedValues.value.length >= props.max),
  );
}

function openMenu(): void {
  if (disabled.value || props.readonly) return;
  open.value = true;
}

function toggleMenu(): void {
  if (disabled.value || props.readonly) return;
  open.value = !open.value;
}

function commit(value: SelectValue | SelectValue[]): void {
  emit("update:modelValue", value);
  emit("change", value);
  void field.onChange();
}

function selectOption(option: SelectOption): void {
  if (isOptionDisabled(option) || props.readonly) return;
  if (props.multiple) {
    const next = isSelected(option)
      ? selectedValues.value.filter((value) => !Object.is(value, option.value))
      : [...selectedValues.value, option.value];
    commit(next);
  } else {
    commit(option.value);
    open.value = false;
    void nextTick(() => controlRef.value?.focus());
  }
}

function enabledIndexes(): number[] {
  return visibleOptions.value
    .map((option, index) => (isOptionDisabled(option) ? -1 : index))
    .filter((index) => index >= 0);
}

function move(direction: 1 | -1): void {
  const indexes = enabledIndexes();
  if (!indexes.length) return;
  const current = indexes.indexOf(activeIndex.value);
  activeIndex.value =
    indexes[(current + direction + indexes.length) % indexes.length] ??
    indexes[0]!;
}

function onKeydown(event: KeyboardEvent): void {
  if (disabled.value || props.readonly) return;
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!open.value) openMenu();
    else move(event.key === "ArrowDown" ? 1 : -1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    if (!open.value) openMenu();
    else {
      const option = visibleOptions.value[activeIndex.value];
      if (option) selectOption(option);
    }
  } else if (event.key === "Escape") {
    open.value = false;
    controlRef.value?.focus();
  }
}

async function searchRemote(value: string): Promise<void> {
  if (!props.remoteMethod) return;
  controller?.abort();
  controller = new AbortController();
  const current = ++request;
  remoteLoading.value = true;
  remoteError.value = "";
  try {
    const result = await props.remoteMethod(value, controller.signal);
    if (current !== request || controller.signal.aborted) return;
    remoteOptions.value = result;
    activeIndex.value = result.findIndex((option) => !option.disabled);
  } catch (reason) {
    if (current !== request || controller.signal.aborted) return;
    const error =
      reason instanceof Error
        ? reason
        : new Error(messages.value.select.loadFailed);
    remoteError.value = error.message;
    emit("error", error);
  } finally {
    if (current === request) remoteLoading.value = false;
  }
}

function onSearch(event: Event): void {
  query.value = (event.target as HTMLInputElement).value;
  openMenu();
  void searchRemote(query.value);
}

function clear(): void {
  const value: SelectValue | SelectValue[] = props.multiple ? [] : "";
  commit(value);
  emit("clear");
  query.value = "";
}

onBeforeUnmount(() => controller?.abort());
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="mm-select"
    :class="[
      `mm-select--${field.size.value}`,
      field.status.value && `is-${field.status.value}`,
      { 'is-disabled': disabled, 'is-readonly': readonly, 'is-open': open },
    ]"
    data-mm-component="select"
  >
    <MmPopover
      v-model="open"
      trigger="manual"
      placement="bottom-start"
      :offset="5"
      :show-arrow="false"
      :width="280"
      role="presentation"
    >
      <div
        :id="field.id.value"
        ref="controlRef"
        class="mm-select__control"
        role="combobox"
        :tabindex="disabled ? -1 : 0"
        :aria-controls="listboxId"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-haspopup="'listbox'"
        :aria-labelledby="field.labelledBy.value"
        :aria-describedby="field.describedBy.value"
        :aria-invalid="field.status.value === 'error' ? 'true' : undefined"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-readonly="readonly ? 'true' : undefined"
        :aria-activedescendant="
          open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined
        "
        v-bind="controlAttrs"
        @click="toggleMenu"
        @keydown="onKeydown"
        @focusout="field.onBlur"
      >
        <span v-if="multiple && selectedOptions.length" class="mm-select__tags">
          <span
            v-for="option in visibleSelectedOptions"
            :key="String(option.value)"
            class="mm-select__tag"
            >{{ option.label }}</span
          >
          <span
            v-if="hiddenSelectedOptionsCount"
            class="mm-select__tag mm-select__tag--overflow"
            >+{{ hiddenSelectedOptionsCount }}</span
          >
        </span>
        <input
          v-if="filterable"
          ref="searchRef"
          class="mm-select__search"
          :value="query"
          :placeholder="hasValue ? '' : resolvedPlaceholder"
          :aria-label="messages.select.filter"
          autocomplete="off"
          @click.stop="openMenu"
          @input="onSearch"
          @keydown="onKeydown"
        />
        <span
          v-else
          class="mm-select__value"
          :class="{ 'is-placeholder': !hasValue }"
          >{{ displayLabel }}</span
        >
        <button
          v-if="clearable && hasValue && !disabled && !readonly"
          class="mm-select__clear"
          type="button"
          :aria-label="messages.select.clear"
          @click.stop="clear"
        >
          ×
        </button>
        <span v-else class="mm-select__arrow" aria-hidden="true">
          <MmIcon :name="open ? 'chevron-up' : 'chevron-down'" :size="14" />
        </span>
      </div>
      <input
        v-if="name"
        type="hidden"
        :name="name"
        :value="
          multiple
            ? JSON.stringify(selectedValues)
            : String(selectedValues[0] ?? '')
        "
      />

      <template #content>
        <div class="mm-select__dropdown">
          <p v-if="loading || remoteLoading" class="mm-select__state">
            {{ messages.select.loading }}
          </p>
          <p
            v-else-if="remoteError"
            class="mm-select__state is-error"
            role="alert"
          >
            {{ remoteError }}
          </p>
          <div
            v-else-if="visibleOptions.length"
            :id="listboxId"
            class="mm-select__list"
            role="listbox"
            :aria-multiselectable="multiple ? 'true' : undefined"
          >
            <button
              v-for="(option, index) in visibleOptions"
              :id="`${listboxId}-${index}`"
              :key="String(option.value)"
              class="mm-select__option"
              :class="{
                'is-active': index === activeIndex,
                'is-selected': isSelected(option),
              }"
              type="button"
              role="option"
              :data-value="String(option.value)"
              :disabled="isOptionDisabled(option)"
              :aria-selected="isSelected(option)"
              @mouseenter="!isOptionDisabled(option) && (activeIndex = index)"
              @mousedown.prevent
              @click="selectOption(option)"
            >
              <span
                ><slot name="option" :option="option">{{
                  option.label
                }}</slot></span
              ><b v-if="isSelected(option)" aria-hidden="true">✓</b>
            </button>
          </div>
          <p v-else class="mm-select__state">{{ messages.select.noOptions }}</p>
        </div>
      </template>
    </MmPopover>
  </div>
</template>

<style src="./select.css"></style>
