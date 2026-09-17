<template>
  <MmDialog
    :model-value="modelValue"
    :close-on-click-modal="false"
    panel-class="mm-tag-translation-dialog"
    :show-close="!busy"
    width="920px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #header>
      <div class="mm-tag-translation__title">
        <strong>{{ copy.title }}</strong>
        <span>{{ copy.configured }} {{ configuredCount }}/{{ languages.length || 20 }}</span>
      </div>
    </template>
    <template #header-actions>
      <MmButton v-if="showGoogleSettings" size="sm" @click="emit('open-settings')">
        <template #icon><span class="mm-tag-translation__provider-dot" aria-hidden="true"></span></template>
        Google {{ copy.settings }} <MmIcon name="sliders-horizontal" :size="13" />
      </MmButton>
    </template>

    <div class="mm-tag-translation">
      <MmAlert
        v-if="message.text"
        closable
        :description="message.description"
        :title="message.text"
        :type="message.type"
        @close="message.text = ''"
      />

      <div class="mm-tag-translation__toolbar">
        <div class="mm-tag-translation__source">
          <label>{{ copy.source }}</label>
          <MmSelect
            v-model="sourceLocale"
            :disabled="busy"
            :options="sourceOptions"
            :placeholder="copy.chooseSource"
          />
          <span>{{ copy.original }}</span>
        </div>
        <MmSegmented v-model="statusFilter" :disabled="busy" :options="statusOptions" size="sm" />
      </div>

      <div v-if="loading" class="mm-tag-translation__loading" role="status">
        <MmIcon name="loader-circle" :size="18" />{{ copy.loading }}
      </div>
      <div v-else class="mm-tag-translation__grid">
        <div v-for="language in visibleLanguages" :key="language.locale" class="mm-tag-translation__language">
          <div class="mm-tag-translation__language-head">
            <strong>{{ languageLabel(language) }}</strong>
            <code>{{ language.locale }}</code>
            <span :class="languageStatus(language).className">{{ languageStatus(language).label }}</span>
          </div>
          <MmInput
            :model-value="values[language.locale] || ''"
            :disabled="busy"
            :maxlength="100"
            :placeholder="placeholder(language)"
            @update:model-value="updateValue(language.locale, $event)"
          />
          <small v-if="failures[language.locale]" class="mm-tag-translation__failure">
            {{ failures[language.locale] }}
          </small>
        </div>
        <div v-if="visibleLanguages.length === 0" class="mm-tag-translation__empty">{{ copy.noMatches }}</div>
      </div>
    </div>

    <template #footer>
      <div class="mm-tag-translation__footer">
        <span><MmIcon name="circle-help" :size="13" />{{ copy.translateHint }}</span>
        <div>
          <MmButton :disabled="busy" @click="emit('update:modelValue', false)">{{ copy.cancel }}</MmButton>
          <MmButton :disabled="loading || saving || pendingCount === 0" :loading="translating" @click="translateAll">
            <template #icon><MmIcon name="globe" :size="14" /></template>{{ copy.translateAll }}
          </MmButton>
          <MmButton :disabled="loading || translating" :loading="saving" variant="primary" @click="save">
            {{ copy.apply }}
          </MmButton>
        </div>
      </div>
    </template>
  </MmDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import MmAlert from "../alert/Alert.vue";
import type { AlertType } from "../alert";
import MmButton from "../button/Button.vue";
import MmDialog from "../dialog/Dialog.vue";
import MmIcon from "../icon/Icon.vue";
import MmInput from "../input/Input.vue";
import MmSegmented from "../segmented/Segmented.vue";
import MmSelect from "../select/Select.vue";
import type { SelectOption } from "../select";
import type { SegmentedOption, SegmentedValue } from "../segmented";
import type { SymbolTagTranslationActions, SymbolTagTranslationLanguage } from "./types";

const props = withDefaults(defineProps<{
  actions: SymbolTagTranslationActions;
  draftMode?: boolean;
  initialValues?: Record<string, string>;
  locale?: string;
  modelValue: boolean;
  showGoogleSettings?: boolean;
  tagId?: number;
}>(), {
  draftMode: false,
  initialValues: () => ({}),
  locale: "zh-CN",
  showGoogleSettings: true,
  tagId: 0,
});
const emit = defineEmits<{
  apply: [translations: Record<string, string>];
  "open-settings": [];
  saved: [];
  "update:modelValue": [value: boolean];
}>();

const zh = {
  all: "全部", apply: "应用到表单", cancel: "取消", chooseSource: "请选择翻译源", configured: "已配置", failed: "失败",
  loadFailed: "标签多语言加载失败", loading: "正在加载标签语言", noMatches: "当前状态下没有语言", original: "原文", pending: "待完善", settings: "设置", source: "翻译来源",
  sourceRequired: "请先填写翻译源语言内容", title: "标签多语言", translateAll: "Google 一键翻译", translateFailed: "部分语言翻译失败，可重试或手动填写。",
  translateHint: "仅翻译空白项 · 应用后保存主表单", translateSuccess: "空白语言已翻译，请检查后应用。", unwritten: "未填写", written: "已配置",
  saveFailed: "标签多语言保存失败", saved: "标签多语言已保存",
};
const en = {
  all: "All", apply: "Apply to Form", cancel: "Cancel", chooseSource: "Choose source language", configured: "Configured", failed: "Failed",
  loadFailed: "Failed to load tag languages", loading: "Loading tag languages", noMatches: "No languages in this state", original: "Source", pending: "Pending", settings: "Settings", source: "Translation source",
  sourceRequired: "Enter the source language value first", title: "Tag Languages", translateAll: "Translate with Google", translateFailed: "Some languages failed. Retry or enter them manually.",
  translateHint: "Only blank values are translated · Apply to save", translateSuccess: "Blank languages translated. Review them before applying.", unwritten: "Empty", written: "Configured",
  saveFailed: "Failed to save tag languages", saved: "Tag languages saved",
};
const copy = computed(() => props.locale.toLowerCase().startsWith("en") ? en : zh);

const languages = ref<SymbolTagTranslationLanguage[]>([]);
const values = reactive<Record<string, string>>({});
const failures = reactive<Record<string, string>>({});
const sourceLocale = ref("zh-CN");
const statusFilter = ref<SegmentedValue>("all");
const loading = ref(false);
const translating = ref(false);
const saving = ref(false);
const message = reactive<{ description?: string; text: string; type: AlertType }>({ text: "", type: "info" });
const busy = computed(() => loading.value || translating.value || saving.value);
const configuredCount = computed(() => languages.value.filter((item) => Boolean(values[item.locale]?.trim())).length);
const pendingCount = computed(() => languages.value.filter((item) => item.locale !== sourceLocale.value && !values[item.locale]?.trim()).length);
const sourceOptions = computed<SelectOption[]>(() => languages.value
  .filter((item) => Boolean(values[item.locale]?.trim()))
  .map((item) => ({ label: `${languageLabel(item)} · ${item.locale}`, value: item.locale })));
const statusOptions = computed<SegmentedOption[]>(() => [
  { label: `${copy.value.all} ${languages.value.length}`, value: "all" },
  { label: `${copy.value.pending} ${pendingCount.value}`, value: "pending" },
  { label: `${copy.value.failed} ${Object.keys(failures).length}`, value: "failed" },
]);
const visibleLanguages = computed(() => languages.value.filter((item) => {
  if (statusFilter.value === "failed") return Boolean(failures[item.locale]);
  if (statusFilter.value === "pending") return !values[item.locale]?.trim();
  return true;
}));

watch(() => props.modelValue, (visible) => {
  if (visible) void load();
});

function languageLabel(language: SymbolTagTranslationLanguage): string {
  return props.locale.toLowerCase().startsWith("en") ? language.label_en : language.label;
}
function placeholder(language: SymbolTagTranslationLanguage): string {
  return props.locale.toLowerCase().startsWith("en")
    ? `Enter ${language.label_en} tag name`
    : `请输入${language.label}标签显示名称`;
}
function languageStatus(language: SymbolTagTranslationLanguage): { className: string; label: string } {
  if (failures[language.locale]) return { className: "is-failed", label: `• ${copy.value.failed}` };
  if (values[language.locale]?.trim()) return { className: "is-configured", label: `• ${copy.value.written}` };
  return { className: "is-empty", label: `• ${copy.value.unwritten}` };
}
function updateValue(locale: string, value: unknown) {
  values[locale] = String(value ?? "");
  delete failures[locale];
}
function setMessage(text: string, type: AlertType, description?: string) {
  Object.assign(message, { text, type, description });
}
async function load() {
  loading.value = true;
  message.text = "";
  languages.value = [];
  Object.keys(values).forEach((key) => delete values[key]);
  Object.keys(failures).forEach((key) => delete failures[key]);
  try {
    const detail = await props.actions.load(props.tagId);
    languages.value = detail.languages || [];
    languages.value.forEach((item) => {
      values[item.locale] = props.draftMode
        ? String(props.initialValues[item.locale] ?? item.value ?? "")
        : (item.value || "");
    });
    sourceLocale.value = values["zh-CN"]?.trim() ? "zh-CN" : (values.en?.trim() ? "en" : (sourceOptions.value[0]?.value as string || "zh-CN"));
    statusFilter.value = "all";
  } catch (error) {
    setMessage(error instanceof Error ? error.message : copy.value.loadFailed, "error");
  } finally { loading.value = false; }
}
async function translateAll() {
  const sourceText = values[sourceLocale.value]?.trim() || "";
  if (!sourceText) {
    setMessage(copy.value.sourceRequired, "warning");
    return;
  }
  const targetLocales = languages.value
    .map((item) => item.locale)
    .filter((locale) => locale !== sourceLocale.value && !values[locale]?.trim());
  if (!targetLocales.length) return;

  translating.value = true;
  message.text = "";
  Object.keys(failures).forEach((key) => delete failures[key]);
  try {
    const result = await props.actions.translate(props.tagId, {
      source_locale: sourceLocale.value,
      source_text: sourceText,
      target_locales: targetLocales,
    });
    Object.entries(result.translations || {}).forEach(([locale, value]) => {
      if (!values[locale]?.trim()) values[locale] = value;
    });
    Object.assign(failures, result.failures || {});
    setMessage(Object.keys(failures).length ? copy.value.translateFailed : copy.value.translateSuccess, Object.keys(failures).length ? "warning" : "success");
  } catch (error) {
    setMessage(error instanceof Error ? error.message : copy.value.translateFailed, "error");
  } finally { translating.value = false; }
}
async function save() {
  if (props.draftMode) {
    emit("apply", { ...values });
    emit("update:modelValue", false);
    return;
  }
  saving.value = true;
  message.text = "";
  try {
    await props.actions.save(props.tagId, { ...values });
    setMessage(copy.value.saved, "success");
    emit("saved");
    emit("update:modelValue", false);
  } catch (error) {
    setMessage(error instanceof Error ? error.message : copy.value.saveFailed, "error");
  } finally { saving.value = false; }
}
</script>

<style>
.mm-tag-translation-dialog{max-height:min(760px,calc(100vh - 36px))}.mm-tag-translation-dialog .mm-dialog__body{padding:0;overflow:hidden}
.mm-tag-translation__title{display:flex;align-items:baseline;gap:12px}.mm-tag-translation__title strong{font-size:16px}.mm-tag-translation__title span{color:var(--mm-color-text-subtle);font-size:11px;font-weight:var(--mm-font-weight-medium)}
.mm-tag-translation__provider-dot{width:6px;height:6px;border-radius:50%;background:var(--mm-color-success);box-shadow:0 0 0 3px var(--mm-color-success-soft)}
.mm-tag-translation{display:grid;min-height:470px;grid-template-rows:auto auto minmax(0,1fr)}.mm-tag-translation>.mm-alert{margin:12px 20px 0}
.mm-tag-translation__toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 20px;border-bottom:1px solid var(--mm-color-line);background:var(--mm-color-fill-subtle)}
.mm-tag-translation__source{display:flex;align-items:center;gap:10px}.mm-tag-translation__source label,.mm-tag-translation__source>span{color:var(--mm-color-text-secondary);font-size:12px}.mm-tag-translation__source .mm-select{width:196px}
.mm-tag-translation__grid{display:grid;max-height:520px;overflow:auto;padding:12px 20px 20px;gap:0 24px;grid-template-columns:repeat(2,minmax(0,1fr));overscroll-behavior:contain}
.mm-tag-translation__language{display:grid;align-content:start;gap:7px;padding:10px 0;border-bottom:1px solid var(--mm-color-line)}.mm-tag-translation__language-head{display:flex;min-width:0;align-items:center;gap:7px}.mm-tag-translation__language-head strong{font-size:12px}.mm-tag-translation__language-head code{color:var(--mm-color-text-subtle);font:10px/1.2 var(--mm-font-family-mono)}.mm-tag-translation__language-head>span{margin-left:auto;font-size:10px;font-weight:var(--mm-font-weight-semibold)}
.mm-tag-translation__language-head .is-configured{color:var(--mm-color-success)}.mm-tag-translation__language-head .is-empty{color:var(--mm-color-text-subtle)}.mm-tag-translation__language-head .is-failed{color:var(--mm-color-danger)}
.mm-tag-translation__failure{overflow:hidden;color:var(--mm-color-danger);font-size:10px;text-overflow:ellipsis;white-space:nowrap}.mm-tag-translation__loading,.mm-tag-translation__empty{display:flex;min-height:360px;align-items:center;justify-content:center;gap:8px;color:var(--mm-color-text-subtle);font-size:12px}.mm-tag-translation__loading .mm-icon{animation:mm-tag-translation-spin .8s linear infinite}
.mm-tag-translation__footer{display:flex;width:100%;align-items:center;justify-content:space-between;gap:16px}.mm-tag-translation__footer>span{display:flex;align-items:center;gap:6px;color:var(--mm-color-text-subtle);font-size:11px}.mm-tag-translation__footer>div{display:flex;gap:8px}
@keyframes mm-tag-translation-spin{to{transform:rotate(360deg)}}
@media(max-width:720px){.mm-tag-translation-dialog{width:calc(100vw - 20px)!important}.mm-tag-translation__toolbar{align-items:stretch;flex-direction:column}.mm-tag-translation__source{flex-wrap:wrap}.mm-tag-translation__source .mm-select{min-width:0;width:100%}.mm-tag-translation__grid{grid-template-columns:1fr}.mm-tag-translation__footer{align-items:stretch;flex-direction:column}.mm-tag-translation__footer>div{justify-content:flex-end;flex-wrap:wrap}}
</style>
