<script
  setup
  lang="ts"
  generic="Row extends HandlingFeeConfigRow = HandlingFeeConfigRow"
>
import { computed, nextTick, reactive, ref, shallowRef } from "vue";

import { useLocale } from "../../composables/use-locale";
import { useMmProTable } from "../../composables/use-pro-table";
import type { FormRules } from "../../shared/form";
import { MmAlert } from "../alert";
import { MmButton } from "../button";
import { MmDialog } from "../dialog";
import { MmForm, MmFormItem } from "../form";
import type { FormExpose } from "../form";
import { MmIcon } from "../icon";
import { MmInput } from "../input";
import { MmProTable } from "../pro-table";
import type { ProTableColumn } from "../pro-table";
import type { QueryBarField, QueryBarValue } from "../query-bar";
import { MmTag } from "../tag";
import type {
  HandlingFeeConfigActionName,
  HandlingFeeConfigFormValue,
  HandlingFeeConfigProps,
  HandlingFeeConfigRow,
} from "./types";

defineOptions({ inheritAttrs: false, name: "MmHandlingFeeConfig" });

const props = withDefaults(defineProps<HandlingFeeConfigProps<Row>>(), {
  actions: () => ({}),
  ariaLabel: undefined,
  canEditRow: undefined,
  columnsConfigurable: true,
  fillHeight: true,
  initialAgentId: 0,
  initialPageSize: 20,
  ownerOptions: () => [],
  pageSizes: () => [20, 30, 40],
  platformAgentId: 0,
  showOwnerFilter: true,
  volumeEditable: true,
  writeAgentId: undefined,
});

const emit = defineEmits<{
  "action-error": [action: HandlingFeeConfigActionName, error: unknown];
  "action-success": [action: "create" | "delete" | "update", row?: Row];
}>();

const { messages } = useLocale();
const copy = computed(() => messages.value.handlingFeeConfigs);
const selectedAgentId = ref(normalizeAgentId(props.initialAgentId));
const formRef = shallowRef<FormExpose>();
const editingRow = shallowRef<Row>();
const deleteTarget = shallowRef<Row>();
const formVisible = ref(false);
const deleteVisible = ref(false);
const formMode = ref<"create" | "edit">("create");
const loadingForm = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const formError = ref("");
const deleteError = ref("");

function normalizeAgentId(value: unknown): number {
  const normalized = Number(value);
  return Number.isInteger(normalized) && normalized >= 0
    ? normalized
    : props.platformAgentId;
}

function emptyForm(): HandlingFeeConfigFormValue {
  return {
    agent_id: normalizeAgentId(props.writeAgentId ?? props.platformAgentId),
    id: undefined,
    level_name: "",
    maker_fee_rate: "",
    taker_fee_rate: "",
    volume_30d: "",
    volume_30d_min: "0",
  };
}

const form = reactive<HandlingFeeConfigFormValue>(emptyForm());
const numberRule = computed(() => ({
  message: copy.value.nonNegativeNumber,
  pattern: /^\d+(?:\.\d+)?$/,
  trigger: "blur" as const,
}));
const formRules = computed<FormRules>(() => ({
  level_name: [
    { message: copy.value.levelRequired, required: true, trigger: "blur" },
  ],
  maker_fee_rate: [
    { message: copy.value.makerFeeRequired, required: true, trigger: "blur" },
    numberRule.value,
  ],
  taker_fee_rate: [
    { message: copy.value.takerFeeRequired, required: true, trigger: "blur" },
    numberRule.value,
  ],
  volume_30d: [
    { message: copy.value.volumeRequired, required: true, trigger: "blur" },
    numberRule.value,
  ],
}));

const ownerOptions = computed(() => {
  const options = props.ownerOptions.map((option) => ({ ...option }));
  const platformValue = String(props.platformAgentId);
  if (!options.some((option) => String(option.value) === platformValue)) {
    options.unshift({
      label: copy.value.platformDefault,
      value: platformValue,
    });
  }
  return options;
});

const defaultQueryFields = computed<QueryBarField[]>(() =>
  props.showOwnerFilter
    ? [
        {
          defaultValue: String(normalizeAgentId(props.initialAgentId)),
          key: "agent_id",
          label: copy.value.owner,
          options: ownerOptions.value,
          type: "select",
          width: 220,
        },
      ]
    : [],
);

const queryFields = computed<QueryBarField[]>(() => {
  const defaults = defaultQueryFields.value.map((field) => ({ ...field }));
  const resolved = !props.queryFields
    ? defaults
    : typeof props.queryFields === "function"
      ? props.queryFields(defaults)
      : props.queryFields;
  return Array.isArray(resolved)
    ? resolved.map((field) => ({ ...field }))
    : defaults;
});

function displayValue(value: unknown): string {
  return value === null || value === undefined || value === ""
    ? "-"
    : String(value);
}

function formatNumber(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("en-US") : "-";
}

function ownerLabel(agentId: unknown): string {
  const normalized = normalizeAgentId(agentId);
  if (normalized === props.platformAgentId) return copy.value.platformDefault;
  return copy.value.agentOwner(normalized);
}

function isPlatformRow(row: Row): boolean {
  return normalizeAgentId(row.agent_id) === props.platformAgentId;
}

function isEditableRow(row: Row): boolean {
  return props.canEditRow ? props.canEditRow(row) : isPlatformRow(row);
}

const defaultColumns = computed<ProTableColumn<Row>[]>(() => [
  {
    key: "level_name",
    dataIndex: "level_name",
    title: copy.value.level,
    width: 220,
    hideable: false,
    formatter: displayValue,
  },
  {
    key: "agent_id",
    dataIndex: "agent_id",
    title: copy.value.agentId,
    width: 160,
  },
  {
    key: "volume_30d",
    dataIndex: "volume_30d",
    title: copy.value.volume30d,
    width: 240,
  },
  {
    key: "maker_fee_rate",
    dataIndex: "maker_fee_rate",
    title: copy.value.makerFee,
    width: 220,
    formatter: displayValue,
  },
  {
    key: "taker_fee_rate",
    dataIndex: "taker_fee_rate",
    title: copy.value.takerFee,
    width: 220,
    formatter: displayValue,
  },
  {
    key: "operation",
    title: copy.value.operation,
    width: 120,
    fixed: "right",
    hideable: false,
    align: "center",
  },
]);

const columns = computed<ProTableColumn<Row>[]>(() => {
  const defaults = defaultColumns.value.map((column) => ({
    align: "left" as const,
    ...column,
  }));
  const resolved = !props.columns
    ? defaults
    : typeof props.columns === "function"
      ? props.columns(defaults)
      : props.columns;
  return Array.isArray(resolved)
    ? resolved.map((column) => ({ ...column }))
    : defaults;
});

const initialFilters: QueryBarValue = props.showOwnerFilter
  ? { agent_id: String(normalizeAgentId(props.initialAgentId)) }
  : {};

const { proTableBindings, reload } = useMmProTable<Row>({
  initialAutoRefreshSeconds: 0,
  initialFilters,
  initialPageSize: props.initialPageSize,
  queryFields,
  request: async ({ filters, page, pageSize, signal }) => {
    const agentId = props.showOwnerFilter
      ? normalizeAgentId(filters.agent_id)
      : normalizeAgentId(props.initialAgentId);
    selectedAgentId.value = agentId;
    return props.request(
      { agent_id: agentId, page_no: page, page_size: pageSize },
      { filters, signal },
    );
  },
});

const canCreate = computed(
  () =>
    selectedAgentId.value === props.platformAgentId &&
    Boolean(props.actions.create),
);
const formTitle = computed(() =>
  formMode.value === "edit" ? copy.value.editTitle : copy.value.createTitle,
);
const formBusy = computed(() => loadingForm.value || submitting.value);
const volumePlaceholder = computed(() =>
  form.volume_30d_min && form.volume_30d_min !== "0"
    ? copy.value.volumeMinimum(form.volume_30d_min)
    : copy.value.volumePlaceholder,
);

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  return String(error || copy.value.actionFailed);
}

function resetForm(): void {
  Object.assign(form, emptyForm());
  editingRow.value = undefined;
  formError.value = "";
  formRef.value?.clearValidate();
}

function setFormData(value: Partial<HandlingFeeConfigFormValue>): void {
  const fields: Array<keyof HandlingFeeConfigFormValue> = [
    "agent_id",
    "id",
    "level_name",
    "maker_fee_rate",
    "taker_fee_rate",
    "volume_30d",
    "volume_30d_min",
  ];
  for (const field of fields) {
    if (value[field] !== null && value[field] !== undefined) {
      (form[field] as unknown) =
        field === "agent_id"
          ? normalizeAgentId(value[field])
          : String(value[field]);
    }
  }
}

async function openCreate(): Promise<void> {
  if (!canCreate.value) return;
  resetForm();
  formMode.value = "create";
  formVisible.value = true;
  if (!props.actions.loadCreateDefaults) return;
  loadingForm.value = true;
  try {
    setFormData(await props.actions.loadCreateDefaults());
  } catch (error) {
    formError.value = errorMessage(error);
    emit("action-error", "load-create", error);
  } finally {
    loadingForm.value = false;
  }
}

async function openEdit(row: Row): Promise<void> {
  if (!isEditableRow(row) || !props.actions.update) return;
  resetForm();
  formMode.value = "edit";
  editingRow.value = row;
  setFormData(row as unknown as Partial<HandlingFeeConfigFormValue>);
  formVisible.value = true;
  if (!props.actions.loadEditData) return;
  loadingForm.value = true;
  try {
    setFormData(await props.actions.loadEditData(row));
  } catch (error) {
    formError.value = errorMessage(error);
    emit("action-error", "load-edit", error);
  } finally {
    loadingForm.value = false;
  }
}

function formSnapshot(): HandlingFeeConfigFormValue {
  return {
    agent_id: normalizeAgentId(props.writeAgentId ?? props.platformAgentId),
    id: form.id,
    level_name: form.level_name.trim(),
    maker_fee_rate: form.maker_fee_rate.trim(),
    taker_fee_rate: form.taker_fee_rate.trim(),
    volume_30d: form.volume_30d.trim(),
    volume_30d_min: form.volume_30d_min,
  };
}

async function submitForm(): Promise<void> {
  if (formBusy.value || !(await formRef.value?.validate())) return;
  const action =
    formMode.value === "edit" ? props.actions.update : props.actions.create;
  if (!action) return;
  submitting.value = true;
  formError.value = "";
  try {
    if (formMode.value === "edit" && editingRow.value) {
      await props.actions.update?.(editingRow.value, formSnapshot(), {
        reload,
      });
      emit("action-success", "update", editingRow.value);
    } else {
      await props.actions.create?.(formSnapshot(), { reload });
      emit("action-success", "create");
    }
    formVisible.value = false;
    resetForm();
    await reload();
  } catch (error) {
    const actionName = formMode.value === "edit" ? "update" : "create";
    formError.value = errorMessage(error);
    emit("action-error", actionName, error);
  } finally {
    submitting.value = false;
  }
}

function requestDelete(row: Row): void {
  if (!isPlatformRow(row) || !props.actions.remove || Number(row.level) === 0)
    return;
  deleteTarget.value = row;
  deleteError.value = "";
  deleteVisible.value = true;
}

function closeForm(): void {
  if (formBusy.value) return;
  formVisible.value = false;
  nextTick(resetForm);
}

function closeDelete(): void {
  if (deleting.value) return;
  deleteVisible.value = false;
  deleteTarget.value = undefined;
  deleteError.value = "";
}

async function confirmDelete(): Promise<void> {
  if (!deleteTarget.value || !props.actions.remove || deleting.value) return;
  deleting.value = true;
  deleteError.value = "";
  const row = deleteTarget.value;
  try {
    await props.actions.remove(row, { reload });
    emit("action-success", "delete", row);
    deleteVisible.value = false;
    deleteTarget.value = undefined;
    await reload();
  } catch (error) {
    deleteError.value = errorMessage(error);
    emit("action-error", "delete", error);
  } finally {
    deleting.value = false;
  }
}

defineExpose({ reload });
</script>

<template>
  <div
    v-bind="$attrs"
    class="mm-handling-fee-config"
    :class="{ 'is-fill-height': fillHeight }"
    data-mm-component="handling-fee-config"
  >
    <MmProTable
      v-bind="proTableBindings"
      :aria-label="ariaLabel || copy.tableAria"
      :columns="columns"
      :columns-configurable="columnsConfigurable"
      :fill-height="fillHeight"
      :inline-query-field-keys="showOwnerFilter ? ['agent_id'] : []"
      :page-sizes="pageSizes"
      row-key="id"
      show-cell-title
    >
      <template #toolbar-actions>
        <MmButton
          v-if="canCreate"
          size="sm"
          variant="primary"
          @click="openCreate"
        >
          <template #icon><MmIcon name="plus" :size="14" /></template>
          {{ copy.add }}
        </MmButton>
        <slot name="toolbar-actions" :reload="reload" />
      </template>

      <template #query-actions="slotProps">
        <slot name="query-actions" v-bind="slotProps" />
      </template>

      <template #cell-agent_id="{ row }">
        <MmTag
          :type="isPlatformRow(row) ? 'default' : 'info'"
          effect="outline"
          round
          size="sm"
        >
          {{ ownerLabel(row.agent_id) }}
        </MmTag>
      </template>

      <template #cell-volume_30d="{ row }">
        <span class="mm-handling-fee-config__number">
          {{
            Number(row.level) === 0
              ? `< ${formatNumber(row.volume_30d)}`
              : `≥ ${formatNumber(row.volume_30d)}`
          }}
        </span>
      </template>

      <template #cell-operation="{ row }">
        <div
          v-if="
            (actions.update && isEditableRow(row)) ||
            (actions.remove && isPlatformRow(row))
          "
          class="mm-handling-fee-config__actions"
        >
          <MmButton
            v-if="actions.update && isEditableRow(row)"
            :aria-label="copy.edit"
            icon-only
            size="sm"
            :title="copy.edit"
            @click.stop="openEdit(row)"
          >
            <MmIcon name="square-pen" :size="14" />
          </MmButton>
          <MmButton
            v-if="
              actions.remove && isPlatformRow(row) && Number(row.level) !== 0
            "
            :aria-label="copy.remove"
            class="mm-handling-fee-config__delete-button"
            icon-only
            size="sm"
            :title="copy.remove"
            @click.stop="requestDelete(row)"
          >
            <MmIcon name="trash-2" :size="14" />
          </MmButton>
        </div>
        <span v-else class="mm-handling-fee-config__locked">
          <MmIcon name="lock-keyhole" :size="14" />
          {{ copy.cannotEdit }}
        </span>
      </template>
    </MmProTable>

    <MmDialog
      :model-value="formVisible"
      :title="formTitle"
      width="540px"
      :close-on-click-modal="false"
      :show-close="!formBusy"
      @update:model-value="
        (value) => {
          if (!value) closeForm();
        }
      "
    >
      <MmForm
        ref="formRef"
        class="mm-handling-fee-config__form"
        :disabled="formBusy"
        label-position="top"
        :model="form"
        :rules="formRules"
        @submit.prevent="submitForm"
      >
        <MmAlert v-if="formError" :description="formError" type="error" />
        <div class="mm-handling-fee-config__summary">
          <MmFormItem :label="copy.vipLevel" prop="level_name" required>
            <MmInput v-model="form.level_name" disabled />
          </MmFormItem>
          <MmFormItem :label="copy.volumeThreshold" prop="volume_30d" required>
            <MmInput
              v-model="form.volume_30d"
              :disabled="!volumeEditable"
              inputmode="decimal"
              :placeholder="volumePlaceholder"
            >
              <template #suffix>USDT</template>
            </MmInput>
          </MmFormItem>
        </div>
        <div class="mm-handling-fee-config__rates">
          <MmFormItem
            :label="copy.makerFeeInput"
            prop="maker_fee_rate"
            required
          >
            <MmInput
              v-model="form.maker_fee_rate"
              inputmode="decimal"
              :placeholder="copy.makerFeePlaceholder"
            >
              <template #suffix>%</template>
            </MmInput>
          </MmFormItem>
          <MmFormItem
            :label="copy.takerFeeInput"
            prop="taker_fee_rate"
            required
          >
            <MmInput
              v-model="form.taker_fee_rate"
              inputmode="decimal"
              :placeholder="copy.takerFeePlaceholder"
            >
              <template #suffix>%</template>
            </MmInput>
          </MmFormItem>
        </div>
        <div class="mm-handling-fee-config__note">{{ copy.formNote }}</div>
      </MmForm>
      <template #footer>
        <div class="mm-handling-fee-config__footer">
          <MmButton size="sm" :disabled="formBusy" @click="closeForm">{{
            copy.cancel
          }}</MmButton>
          <MmButton
            size="sm"
            variant="primary"
            :loading="submitting"
            :disabled="loadingForm"
            @click="submitForm"
          >
            {{ copy.confirm }}
          </MmButton>
        </div>
      </template>
    </MmDialog>

    <MmDialog
      :model-value="deleteVisible"
      :title="copy.deleteTitle"
      width="460px"
      :close-on-click-modal="false"
      :show-close="!deleting"
      @update:model-value="
        (value) => {
          if (!value) closeDelete();
        }
      "
    >
      <MmAlert v-if="deleteError" :description="deleteError" type="error" />
      <div class="mm-handling-fee-config__delete-content">
        <div class="mm-handling-fee-config__delete-icon" aria-hidden="true">
          <MmIcon name="trash-2" :size="18" />
        </div>
        <div class="mm-handling-fee-config__delete-body">
          <div class="mm-handling-fee-config__delete-title">
            {{ copy.deleteMessage }}
          </div>
          <div class="mm-handling-fee-config__delete-description">
            {{ copy.deleteDescription }}
          </div>
        </div>
      </div>
      <template #footer>
        <div class="mm-handling-fee-config__footer">
          <MmButton size="sm" :disabled="deleting" @click="closeDelete">{{
            copy.cancel
          }}</MmButton>
          <MmButton
            size="sm"
            variant="danger"
            :loading="deleting"
            @click="confirmDelete"
          >
            {{ copy.confirmDelete }}
          </MmButton>
        </div>
      </template>
    </MmDialog>
  </div>
</template>

<style src="./handling-fee-config.css"></style>
