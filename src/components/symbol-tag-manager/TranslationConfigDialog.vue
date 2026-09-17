<template>
  <MmDialog
    :model-value="modelValue"
    :close-on-click-modal="false"
    :show-close="!busy"
    :title="copy.title"
    width="520px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="mm-translation-config">
      <div class="mm-translation-config__field">
        <label>{{ copy.apiVersion }}</label>
        <MmSelect
          v-model="form.api_version"
          :disabled="busy"
          :options="versionOptions"
        />
      </div>

      <div class="mm-translation-config__field">
        <label>{{ copy.apiKey }}</label>
        <MmInput
          v-model="form.api_key"
          autocomplete="new-password"
          :disabled="busy"
          :placeholder="apiKeyPlaceholder"
          show-password
          type="password"
        />
        <small>{{ copy.apiKeyHint }}</small>
      </div>

      <div class="mm-translation-config__field">
        <label>{{ copy.concurrency }}</label>
        <MmSelect
          v-model="form.concurrency"
          :disabled="busy"
          :options="concurrencyOptions"
        />
      </div>

      <MmAlert
        v-if="message.text"
        :description="message.description"
        show-icon
        :title="message.text"
        :type="message.type"
      />
    </div>

    <template #footer>
      <div class="mm-translation-config__footer">
        <MmButton :disabled="busy" @click="emit('update:modelValue', false)">{{ copy.cancel }}</MmButton>
        <div>
          <MmButton :disabled="loading || saving" :loading="testing" @click="testConnection">{{ copy.test }}</MmButton>
          <MmButton :disabled="loading || testing" :loading="saving" variant="primary" @click="saveConfig">{{ copy.save }}</MmButton>
        </div>
      </div>
    </template>
  </MmDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import MmAlert from "../alert/Alert.vue";
import MmButton from "../button/Button.vue";
import MmDialog from "../dialog/Dialog.vue";
import MmInput from "../input/Input.vue";
import MmSelect from "../select/Select.vue";
import type { AlertType } from "../alert";
import type { SelectOption } from "../select";
import type { TranslationConfig, TranslationConfigActions, TranslationConfigFormValue } from "./types";

const props = defineProps<{
  actions: TranslationConfigActions;
  locale?: string;
  modelValue: boolean;
}>();
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>();

const zh = {
  apiKey: "Google API Key", apiKeyHint: "API Key 将加密保存，页面不会返回完整密钥。", apiKeyPlaceholder: "请输入 Google API Key",
  cancel: "取消", concurrency: "并发任务数", invalid: "验证失败", loadFailed: "翻译配置加载失败", notConfigured: "尚未配置 Google API Key",
  pending: "待验证", save: "保存配置", saveFailed: "翻译配置保存失败", saved: "配置已保存", test: "测试连接",
  testFailed: "连接测试失败", testSuccess: "连接测试成功", title: "Google 翻译配置", valid: "验证通过", apiVersion: "接口版本",
};
const en = {
  apiKey: "Google API Key", apiKeyHint: "The API Key is encrypted at rest and is never returned in full.", apiKeyPlaceholder: "Enter Google API Key",
  cancel: "Cancel", concurrency: "Concurrent Tasks", invalid: "Verification failed", loadFailed: "Failed to load translation configuration", notConfigured: "Google API Key is not configured",
  pending: "Pending verification", save: "Save Configuration", saveFailed: "Failed to save translation configuration", saved: "Configuration saved", test: "Test Connection",
  testFailed: "Connection test failed", testSuccess: "Connection test succeeded", title: "Google Translate Configuration", valid: "Verified", apiVersion: "API Version",
};
const copy = computed(() => props.locale?.toLowerCase().startsWith("en") ? en : zh);
const versionOptions = computed<SelectOption[]>(() => [{ label: "Cloud Translation Basic v2", value: "v2" }]);
const concurrencyOptions = computed<SelectOption[]>(() => Array.from({ length: 10 }, (_, index) => ({
  label: props.locale?.toLowerCase().startsWith("en") ? `${index + 1} task${index ? "s" : ""}` : `${index + 1} 个任务`,
  value: index + 1,
})));

const form = reactive<TranslationConfigFormValue>({ api_key: "", api_version: "v2", concurrency: 3, is_enabled: true });
const config = ref<TranslationConfig>();
const loading = ref(false);
const saving = ref(false);
const testing = ref(false);
const message = reactive<{ description?: string; text: string; type: AlertType }>({ text: "", type: "info" });
const busy = computed(() => loading.value || saving.value || testing.value);
const apiKeyPlaceholder = computed(() => config.value?.api_key_mask || copy.value.apiKeyPlaceholder);

watch(() => props.modelValue, (visible) => { if (visible) void loadConfig(); });

function setMessage(text: string, type: AlertType, description?: string) {
  Object.assign(message, { text, type, description });
}

function applyConfig(value: TranslationConfig) {
  config.value = value;
  form.api_key = "";
  form.api_version = value.api_version || "v2";
  form.concurrency = Number(value.concurrency || 3);
  form.is_enabled = Boolean(value.is_enabled);
  if (!value.api_key_set) setMessage(copy.value.notConfigured, "info");
  else if (value.verify_status === "valid") setMessage(copy.value.valid, "success");
  else if (value.verify_status === "invalid") setMessage(copy.value.invalid, "error", value.last_error || undefined);
  else setMessage(copy.value.pending, "warning");
}

async function loadConfig() {
  loading.value = true;
  message.text = "";
  try { applyConfig(await props.actions.load()); }
  catch { setMessage(copy.value.loadFailed, "error"); }
  finally { loading.value = false; }
}

async function testConnection() {
  if (!form.api_key?.trim() && !config.value?.api_key_set) {
    setMessage(copy.value.notConfigured, "warning");
    return;
  }
  testing.value = true;
  try {
    const result = await props.actions.test(form.api_key?.trim() || undefined);
    setMessage(result.valid ? copy.value.testSuccess : copy.value.testFailed, result.valid ? "success" : "error", result.last_error || undefined);
  } catch (error) {
    const description = error && typeof error === "object" && "last_error" in error ? String(error.last_error || "") : undefined;
    setMessage(copy.value.testFailed, "error", description);
  } finally { testing.value = false; }
}

async function saveConfig() {
  if (!form.api_key?.trim() && !config.value?.api_key_set) {
    setMessage(copy.value.notConfigured, "warning");
    return;
  }
  saving.value = true;
  try {
    const value = await props.actions.save({
      api_key: form.api_key?.trim() || undefined,
      api_version: "v2",
      concurrency: Number(form.concurrency),
      is_enabled: Boolean(form.is_enabled),
    });
    applyConfig(value);
    setMessage(copy.value.saved, "success");
  } catch { setMessage(copy.value.saveFailed, "error"); }
  finally { saving.value = false; }
}
</script>

<style>
.mm-translation-config{display:grid;gap:16px}.mm-translation-config__field{display:grid;gap:7px}.mm-translation-config__field>label{color:var(--mm-color-text);font-size:13px;font-weight:var(--mm-font-weight-medium)}.mm-translation-config__field>small{color:var(--mm-color-text-muted);font-size:11px;line-height:1.5}.mm-translation-config__footer{display:flex;align-items:center;justify-content:space-between;gap:12px}.mm-translation-config__footer>div{display:flex;gap:8px}
</style>
