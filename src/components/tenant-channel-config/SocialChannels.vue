<script setup lang="ts">
import { computed, useId } from 'vue'
import { useLocale } from '../../composables/use-locale'
import { MmInput } from '../input'
import { channelLinkError, tenantSocialChannels, type ChannelLinks } from './model'

defineOptions({ name: 'MmSocialChannels' })
const props = withDefaults(defineProps<{ modelValue: ChannelLinks; disabled?: boolean; displayStatus?: boolean }>(), {
  disabled: false, displayStatus: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: ChannelLinks] }>()
const id = useId()
const { locale } = useLocale()
const english = computed(() => locale.value === 'en-US')
const copy = computed(() => english.value ? {
  title: 'Official social channels', description: 'Enter HTTPS links. Blank links are hidden. All sites of this white label share these settings.',
  configured: 'Configured', empty: 'Not configured', visible: 'Shown on site', hidden: 'Hidden', count: 'configured', shown: 'shown', link: 'link',
} : {
  title: '官方社交渠道', description: '配置后在白标前台展示对应平台图标；不限展示数量，未填写的平台自动隐藏。所属站点共用此白标配置。',
  configured: '已配置', empty: '未配置', visible: '前台显示', hidden: '未显示', count: '个已配置', shown: '个已显示', link: '链接',
})
const value = (key: string) => props.modelValue[key] || ''
const error = (key: string) => channelLinkError(value(key), english.value)
const configured = (key: string) => Boolean(value(key).trim()) && !error(key)
const count = computed(() => tenantSocialChannels.filter(item => configured(item.key)).length)
function update(key: string, next: string): void {
  if (!props.disabled) emit('update:modelValue', { ...props.modelValue, [key]: next })
}
</script>

<template>
  <section class="mm-social-channels" data-mm-component="social-channels" :aria-label="copy.title">
    <header class="mm-social-channels__heading">
      <div><h3>{{ copy.title }}</h3><p>{{ copy.description }}</p></div>
      <span class="mm-social-channels__count">{{ count }} {{ displayStatus ? copy.shown : copy.count }}</span>
    </header>
    <div class="mm-social-channels__grid">
      <div v-for="item in tenantSocialChannels" :key="item.key" class="mm-social-channels__field">
        <label :for="`${id}-${item.key}`" class="mm-social-channels__label">
          <span class="mm-social-channels__mark" :style="{ background: item.color }" aria-hidden="true">{{ item.mark }}</span>
          <span>{{ item.label }}</span>
          <span class="mm-social-channels__status" :class="{ 'is-configured': configured(item.key) }">
            {{ configured(item.key) ? (displayStatus ? copy.visible : copy.configured) : (displayStatus ? copy.hidden : copy.empty) }}
          </span>
        </label>
        <MmInput :id="`${id}-${item.key}`" :model-value="value(item.key)" :placeholder="item.placeholder"
          :aria-label="`${item.label} ${copy.link}`" :aria-describedby="error(item.key) ? `${id}-${item.key}-error` : undefined"
          :status="error(item.key) ? 'error' : undefined" :disabled="disabled" :maxlength="2048" autocomplete="off"
          @update:model-value="update(item.key, $event)" />
        <p v-if="error(item.key)" :id="`${id}-${item.key}-error`" class="mm-social-channels__error">{{ error(item.key) }}</p>
      </div>
    </div>
  </section>
</template>

<style src="./tenant-channels.css"></style>
