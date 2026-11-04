<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import type { TenantCustomerServiceDetail, TenantCustomerServiceTransport } from './model'

defineOptions({ name: 'MmTenantCustomerServiceCard' })
const props = withDefaults(defineProps<{ transport: TenantCustomerServiceTransport; canEdit?: boolean; disabled?: boolean }>(), { canEdit: true, disabled: false })
const emit = defineEmits<{ 'state-change': [value: TenantCustomerServiceDetail | null]; 'busy-change': [value: boolean] }>()
const { locale } = useLocale()
const copy = computed(() => locale.value === 'en-US' ? {
  name: '6MM Customer Service', description: 'Create and manage the customer-service account for this white label.',
  scope: 'Effective immediately · Applies to all sites of this white label', hint: 'Turning off does not delete the account. Re-enabling does not reset its password.',
  loading: 'Loading…', writing: 'Processing…', enabled: 'Enabled', disabled: 'Disabled', pending: 'Needs verification', failed: 'Operation failed',
  ready: 'Customer service is not configured. Contact the platform administrator.', unsupported: 'Another provider is configured. Contact the platform administrator.',
  error: 'Could not load the customer-service status.', uncertain: 'The operation was not confirmed. Reload the status before trying again.',
  reload: 'Reload status', verify: 'Verify', readonly: 'You do not have permission to change customer service.', cooldown: 'Please wait before verifying again.',
} : {
  name: '6MM客服', description: '开通并管理当前白标的客服服务。', scope: '即时生效 · 影响当前白标所有站点',
  hint: '首次开启自动开户；关闭不删除账号，再次开启不重置账号密码。',
  loading: '加载中', writing: '处理中', enabled: '已启用', disabled: '已关闭', pending: '待核验', failed: '操作失败',
  ready: '客服服务未配置，请联系平台管理员。', unsupported: '已有其他客服服务商，请联系平台管理员处理。',
  error: '客服状态读取失败。', uncertain: '操作结果未确认，请先重新加载状态后核验。', reload: '重新加载状态', verify: '核验',
  readonly: '当前账号没有修改客服的权限。', cooldown: '核验冷却中，请稍后操作。',
})
const detail = ref<TenantCustomerServiceDetail | null>(null)
const reading = ref(false), writing = ref(false), failedRead = ref(false), uncertain = ref(false), error = ref('')
const clock = ref(Date.now())
let controller: AbortController | undefined, disposed = false, timer: ReturnType<typeof setTimeout> | undefined
const busy = computed(() => reading.value || writing.value)
const unresolved = computed(() => !!detail.value?.operation && ['pending', 'inflight', 'confirmed'].includes(detail.value.operation.status))
const editable = computed(() => props.canEdit && detail.value?.can_edit !== false)
const retryable = computed(() => {
  const op = detail.value?.operation
  return !!op && (op.status === 'confirmed' || (['pending', 'inflight'].includes(op.status) && op.attempts < 5 && clock.value >= (op.retry_after || 0) * 1000))
})
const disabled = computed(() => props.disabled || busy.value || !detail.value || !editable.value || failedRead.value || uncertain.value || unresolved.value || !detail.value.service_ready || detail.value.binding_status === 'unsupported')
const status = computed(() => {
  if (writing.value) return copy.value.writing
  if (reading.value) return copy.value.loading
  if (uncertain.value || unresolved.value || failedRead.value) return copy.value.pending
  if (detail.value?.operation?.status === 'failed') return copy.value.failed
  return detail.value?.enabled ? copy.value.enabled : copy.value.disabled
})
const notice = computed(() => error.value || detail.value?.operation?.message || (!editable.value ? copy.value.readonly
  : detail.value && !detail.value.service_ready ? copy.value.ready : detail.value?.binding_status === 'unsupported' ? copy.value.unsupported : ''))
function accept(value: TenantCustomerServiceDetail): void {
  if (!value || typeof value.enabled !== 'boolean' || typeof value.service_ready !== 'boolean'
    || !/^[1-9][0-9]*$/.test(value.site_id) || !/^[1-9][0-9]*$/.test(value.entitlement_version)) throw new Error('Invalid customer-service response')
  detail.value = value; uncertain.value = false; failedRead.value = false
  emit('state-change', value)
  if (timer) clearTimeout(timer)
  clock.value = Date.now()
  const remaining = (value.operation?.retry_after || 0) * 1000 - clock.value
  // Local cooldown only: never automatically retry a provisioning/close request.
  if (remaining > 0) timer = setTimeout(() => { clock.value = Date.now() }, Math.min(remaining + 50, 86_400_050))
}
async function load(): Promise<void> {
  if (busy.value || disposed) return
  controller?.abort(); controller = new AbortController(); reading.value = true
  try { const result = await props.transport.load(controller.signal); if (!disposed) { accept(result); error.value = '' } }
  catch { if (!disposed) { failedRead.value = true; error.value = copy.value.error; emit('state-change', null) } }
  finally { if (!disposed) reading.value = false }
}
async function toggle(retry = false): Promise<void> {
  if (!detail.value || busy.value || props.disabled || !editable.value || failedRead.value || uncertain.value || !detail.value.service_ready
    || (retry ? !retryable.value : disabled.value)) return
  const enabled = retry ? detail.value.operation!.enabled : !detail.value.enabled
  const input = { site_id: detail.value.site_id, expected_entitlement_version: detail.value.entitlement_version,
    enabled, client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' }
  writing.value = true; error.value = ''
  try { const result = await props.transport.toggle(input); if (!disposed) accept(result.detail) }
  catch (cause) {
    if (!disposed) {
      uncertain.value = true
      const message = (cause as { response?: { data?: { msg?: unknown } } })?.response?.data?.msg
      error.value = typeof message === 'string' ? message : copy.value.uncertain
      // Refresh only the authoritative state; never repeat a write after a timeout.
      controller?.abort(); controller = new AbortController()
      try { const result = await props.transport.load(controller.signal); if (!disposed) accept(result) }
      catch { if (!disposed) failedRead.value = true }
    }
  } finally { if (!disposed) writing.value = false }
}
watch(busy, value => emit('busy-change', value), { flush: 'sync' })
onMounted(() => { void load() })
onBeforeUnmount(() => { disposed = true; controller?.abort(); if (timer) clearTimeout(timer); emit('busy-change', false) })
defineExpose({ reload: load, isBusy: busy })
</script>

<template>
  <div class="mm-tenant-customer" data-mm-component="tenant-customer-service" :aria-busy="busy">
    <article class="mm-tenant-feature-settings__card" :class="{ 'is-enabled': detail?.enabled && !unresolved && !uncertain }" data-service-code="customer_service">
      <span class="mm-tenant-feature-settings__card-icon"><MmIcon name="message-square-more" :size="20" /></span>
      <div class="mm-tenant-feature-settings__card-copy"><h4>{{ copy.name }}</h4><p>{{ copy.description }}</p><small>{{ copy.scope }}</small></div>
      <div class="mm-tenant-feature-settings__controls"><span role="status">{{ status }}</span>
        <button type="button" class="mm-tenant-feature-settings__switch" role="switch" :aria-label="copy.name" :aria-checked="detail?.enabled ?? false" :disabled="disabled" @click="toggle()"><span /></button>
      </div>
    </article>
    <p class="mm-tenant-customer__hint">{{ copy.hint }}</p>
    <div v-if="notice || failedRead || uncertain || unresolved" class="mm-tenant-customer__feedback" :class="{ 'is-error': error || detail?.operation?.status === 'failed' }">
      <p v-if="notice" role="alert">{{ notice }}</p>
      <MmButton v-if="failedRead || uncertain" size="sm" :disabled="busy || props.disabled" @click="load">{{ copy.reload }}</MmButton>
      <MmButton v-else-if="unresolved" size="sm" :disabled="busy || props.disabled || !editable || !retryable || !detail?.service_ready" @click="toggle(true)">{{ copy.verify }}</MmButton>
      <span v-if="unresolved && !retryable" class="mm-tenant-customer__hint">{{ copy.cooldown }}</span>
    </div>
  </div>
</template>

<style scoped>
.mm-tenant-customer { min-width: 0; }
.mm-tenant-customer__hint { margin: 8px 0 0; color: var(--mm-color-text-muted); font-size: 11px; line-height: 1.7; }
.mm-tenant-customer__feedback { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 8px; color: var(--mm-color-warning, #a65c00); font-size: 12px; }
.mm-tenant-customer__feedback p { flex-basis: 100%; margin: 0; line-height: 1.7; }
.mm-tenant-customer__feedback.is-error { color: var(--mm-color-danger); }
</style>
