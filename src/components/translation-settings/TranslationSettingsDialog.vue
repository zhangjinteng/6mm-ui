<template>
  <MmDialog :model-value="modelValue" title="翻译配置" :subtitle="subtitle"
    width="560px" :close-on-click-modal="false" :before-close="() => !busy"
    @update:model-value="emit('update:modelValue', $event)">
    <MmAlert v-if="error" type="error">{{ error }}
      <MmButton size="sm" :disabled="busy" @click="load">重新加载配置</MmButton>
    </MmAlert>
    <div v-if="loading" role="status"><MmLoading size="sm" />加载配置中…</div>
    <div v-else-if="settings" class="mm-translation-settings">
      <label>目标语言<MmSelect v-model="settings.target_locales" :options="localeOptions"
        multiple filterable :max-tag-count="4" placeholder="选择需要维护的目标语言"
        :disabled="busy || readonly" aria-label="翻译目标语言" /></label>
      <TranslationEnabledToggle v-model="settings.is_enabled" :disabled="busy || readonly"
        :credential-ready="settings.credential_configured || !!apiKey.trim()" />
      <div class="mm-translation-settings__credential">
        <label>Google API Key<MmInput v-model="apiKey" type="password" autocomplete="new-password"
          :disabled="busy || readonly" aria-label="Google API Key"
          :placeholder="settings.credential_configured ? '已配置，留空保留原密钥；输入新密钥替换' : '请输入 Google Cloud Translation API Key'" /></label>
        <small v-if="settings.api_key_mask">{{ settings.credential_source === 'database' ? '数据库密钥' : '环境配置密钥' }}：{{ settings.api_key_mask }}</small>
        <small v-if="settings.credential_error === 'GOOGLE_CREDENTIAL_MIGRATION_REQUIRED'">旧密钥尚未转换，请先执行密钥迁移，或输入新密钥替换。</small>
        <small v-else>密钥原样存入数据库，不回显原文；留空保留原值。未配置密钥时仍可人工翻译。</small>
      </div>
      <div class="mm-translation-settings__grid">
        <label>并发上限<MmInputNumber v-model="settings.concurrency_limit" :min="1" :max="20" :disabled="busy || readonly" /></label>
        <label>请求超时（秒）<MmInputNumber v-model="settings.request_timeout_seconds" :min="1" :max="120" :disabled="busy || readonly" /></label>
        <label>最大尝试次数<MmInputNumber v-model="settings.max_attempts" :min="1" :max="10" :disabled="busy || readonly" /></label>
      </div>
      <MmAlert v-if="!settings.supported" type="warning">当前关联了其他版本的翻译配置，保存后使用 Google v2 配置。</MmAlert>
    </div>
    <MmAlert v-if="readonly" type="info">当前账号没有翻译配置权限，仅可查看。</MmAlert>
    <template #footer>
      <MmButton :loading="testing" :disabled="busy || readonly || !settings || (!settings.credential_configured && !apiKey.trim())" @click="test">测试连接</MmButton>
      <MmButton :disabled="busy" @click="emit('update:modelValue', false)">取消</MmButton>
      <MmButton variant="primary" :loading="saving" :disabled="busy || readonly || !settings" @click="save">保存翻译配置</MmButton>
    </template>
  </MmDialog>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import MmAlert from '../alert/Alert.vue';
import MmButton from '../button/Button.vue';
import MmDialog from '../dialog/Dialog.vue';
import MmInput from '../input/Input.vue';
import MmInputNumber from '../input-number/InputNumber.vue';
import MmLoading from '../loading/Loading.vue';
import MmSelect from '../select/Select.vue';
import TranslationEnabledToggle from '../translation-enabled-toggle/TranslationEnabledToggle.vue';
import { message } from '../../services/message';
import type { TranslationSettings, TranslationSettingsActions } from './types';

const props = defineProps<{ modelValue: boolean; actions: TranslationSettingsActions;
  locales?: { label: string; value: string }[] }>();
const emit = defineEmits<{ 'update:modelValue': [boolean]; saved: [TranslationSettings]; busy: [boolean] }>();
const settings = ref<TranslationSettings>();
const apiKey = ref(''), error = ref('');
const loading = ref(false), saving = ref(false), testing = ref(false);
const readonly = computed(() => settings.value?.can_edit === false);
const busy = computed(() => loading.value || saving.value || testing.value);
let generation = 0;
const subtitle = computed(() => `${settings.value?.configuration_scope === 'merchant' ? '当前主商户独立配置' : settings.value?.configuration_scope === 'platform' ? '平台统一配置' : '当前内容空间共用'} · Google Cloud Translation Basic v2`);
const localeOptions = computed(() => (props.locales || []).filter(item => item.value !== (settings.value?.source_locale || 'zh-CN')));
watch(busy, value => emit('busy', value));
watch(() => props.modelValue, open => {
  generation++; apiKey.value = ''; error.value = ''; settings.value = undefined;
  loading.value = saving.value = testing.value = false;
  if (open) void load();
}, { immediate: true });
onBeforeUnmount(() => { generation++; apiKey.value = ''; });
async function load() {
  const version = ++generation;
  apiKey.value = ''; error.value = ''; loading.value = true;
  try {
    const value = await props.actions.load();
    if (version === generation) settings.value = JSON.parse(JSON.stringify(value));
  } catch { if (version === generation) error.value = '翻译配置加载失败，请重试'; }
  finally { if (version === generation) loading.value = false; }
}
async function test() {
  if (!settings.value || busy.value || readonly.value) return;
  const version = generation;
  testing.value = true; error.value = '';
  try {
    await props.actions.testConnection(settings.value, apiKey.value.trim());
    if (version === generation) message.success('Google Translate 连接成功');
  } catch { if (version === generation) error.value = '连接失败，请检查翻译密钥与网络配置'; }
  finally { if (version === generation) testing.value = false; }
}
async function save() {
  if (!settings.value || busy.value || readonly.value) return;
  const version = generation;
  saving.value = true; error.value = '';
  try {
    const value = await props.actions.save(JSON.parse(JSON.stringify(settings.value)), apiKey.value.trim());
    if (version !== generation) return;
    apiKey.value = ''; emit('saved', value); emit('update:modelValue', false);
    message.success('翻译配置已保存');
  } catch { if (version === generation) error.value = '翻译配置保存失败，请重新加载后重试'; }
  finally { if (version === generation) saving.value = false; }
}
</script>
