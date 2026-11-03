<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmIcon } from '../icon'
import { MmLoading } from '../loading'
import SocialChannels from './SocialChannels.vue'
import { channelLinkError, channelLinksEqual, createChannelLinkDraft, normalizeChannelLinks, tenantSocialChannels,
  type TenantChannelDetail, type TenantChannelSettingsProps } from './model'

defineOptions({ name: 'MmTenantChannelSettings' })
const props = withDefaults(defineProps<TenantChannelSettingsProps>(), { canEdit: true })
const { locale } = useLocale()
const english = computed(() => locale.value === 'en-US')
const copy = computed(() => english.value ? {
  title: 'Channel settings', description: 'Manage official social channels for your white-label sites.', tab: 'Social channels',
  updated: 'Last updated', never: 'Not configured', loading: 'Loading channel settings…', retry: 'Reload',
  loadFailed: 'Could not load channel settings. Please retry.', saveFailed: 'Could not save. Check your connection and retry. If this configuration changed elsewhere, discard and reload first.',
  saved: 'Current settings are saved', dirty: 'You have unsaved changes', readonly: 'Read-only: you do not have permission to save.',
  discard: 'Discard changes', save: 'Save settings', saving: 'Saving…', reload: 'Discard and reload',
} : {
  title: '渠道配置', description: '配置官方社交渠道，所属站点共用此白标配置。', tab: '社交渠道',
  updated: '最近更新', never: '尚未配置', loading: '正在读取渠道配置…', retry: '重新加载',
  loadFailed: '读取渠道配置失败，请重试。', saveFailed: '保存失败，请检查网络后重试。如配置已被其他操作员修改，请放弃并重新加载后再保存。',
  saved: '当前配置已保存', dirty: '有未保存的修改', readonly: '当前为只读模式，暂无保存权限。',
  discard: '放弃修改', save: '保存配置', saving: '保存中…', reload: '放弃并重新加载',
})
const detail = ref<TenantChannelDetail | null>(null)
const draft = ref(createChannelLinkDraft(tenantSocialChannels, {}))
const loading = ref(false), saving = ref(false), loadError = ref(''), saveError = ref('')
const editable = computed(() => props.canEdit && detail.value?.can_edit !== false)
const dirty = computed(() => detail.value !== null && !channelLinksEqual(draft.value, detail.value.social_links))
const invalid = computed(() => Object.values(draft.value).some(value => channelLinkError(value)))
const busy = computed(() => loading.value || saving.value)
const updatedAt = computed(() => {
  const value = detail.value?.expected_updated_at
  if (!value) return copy.value.never
  if (props.formatUpdatedAt) return props.formatUpdatedAt(value)
  const date = new Date(value.replace(' ', 'T'))
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(english.value ? 'en-GB' : 'zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date)
})
let controller: AbortController | undefined
let disposed = false
function accept(next: TenantChannelDetail): void {
  detail.value = next
  draft.value = createChannelLinkDraft(tenantSocialChannels, next.social_links)
}
async function load(): Promise<void> {
  if (busy.value) return
  controller?.abort()
  controller = new AbortController()
  loading.value = true; loadError.value = ''; saveError.value = ''
  try { const next = await props.load(controller.signal); if (!disposed) accept(next) }
  catch { if (!disposed) loadError.value = copy.value.loadFailed }
  finally { if (!disposed) loading.value = false }
}
function discard(): void {
  if (busy.value || !detail.value) return
  draft.value = createChannelLinkDraft(tenantSocialChannels, detail.value.social_links)
  saveError.value = ''
}
async function save(): Promise<void> {
  if (busy.value || !editable.value || !detail.value || !dirty.value || invalid.value) return
  saving.value = true; saveError.value = ''
  try {
    const result = await props.save({ social_links: normalizeChannelLinks(draft.value), expected_updated_at: detail.value.expected_updated_at })
    if (!disposed) accept(result.detail)
  } catch { if (!disposed) saveError.value = copy.value.saveFailed }
  finally { if (!disposed) saving.value = false }
}
function beforeUnload(event: BeforeUnloadEvent): void {
  if (!dirty.value) return
  event.preventDefault(); event.returnValue = ''
}
onMounted(() => { window.addEventListener('beforeunload', beforeUnload); void load() })
onBeforeUnmount(() => { disposed = true; controller?.abort(); window.removeEventListener('beforeunload', beforeUnload) })
defineExpose({ hasUnsavedChanges: dirty })
</script>

<template>
  <section class="mm-tenant-channel-settings" data-mm-component="tenant-channel-settings" :aria-label="copy.title" :aria-busy="busy">
    <header class="mm-tenant-channel-settings__header">
      <span class="mm-tenant-channel-settings__icon"><MmIcon name="message-square-more" :size="22" /></span>
      <div><h1>{{ copy.title }}</h1><p>{{ copy.description }}</p></div>
      <div class="mm-tenant-channel-settings__updated"><span><MmIcon name="clock" :size="12" /> {{ copy.updated }}</span><time>{{ updatedAt }}</time></div>
    </header>
    <div class="mm-tenant-channel-settings__tabs"><span><MmIcon name="share-2" :size="16" />{{ copy.tab }}</span></div>
    <div class="mm-tenant-channel-settings__body">
      <MmLoading v-if="loading" :text="copy.loading" />
      <div v-else-if="loadError" class="mm-tenant-channel-settings__error" role="alert">
        <p>{{ loadError }}</p><MmButton @click="load">{{ copy.retry }}</MmButton>
      </div>
      <SocialChannels v-else-if="detail" v-model="draft" :disabled="busy || !editable" display-status />
    </div>
    <footer class="mm-tenant-channel-settings__footer">
      <div class="mm-tenant-channel-settings__feedback">
        <span v-if="saveError" class="mm-social-channels__error" role="alert">{{ saveError }}</span>
        <span v-else-if="detail" role="status"><MmIcon :name="dirty ? 'alert' : 'circle-check'" :size="14" />
          {{ !editable ? copy.readonly : dirty ? copy.dirty : copy.saved }}</span>
      </div>
      <MmButton v-if="saveError" :disabled="busy" @click="load">{{ copy.reload }}</MmButton>
      <MmButton :disabled="busy || !dirty || !editable" @click="discard">{{ copy.discard }}</MmButton>
      <MmButton variant="primary" :loading="saving" :disabled="busy || !detail || !editable || !dirty || invalid" @click="save">
        <MmIcon name="save" :size="14" /> {{ saving ? copy.saving : copy.save }}
      </MmButton>
    </footer>
  </section>
</template>

<style src="./tenant-channels.css"></style>
