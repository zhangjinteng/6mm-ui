<template>
    <MmDialog
        :model-value="true"
        title="多语言 SEO 文案"
        :subtitle="`已配置 ${completeCount}/${configuredLocales.length}`"
        width="1100px"
        :panel-style="{ height: 'min(780px, calc(100dvh - 40px))' }"
        panel-class="seo-translations-panel"
        :close-on-click-modal="false"
        @close="close"
    >
        <template #header-actions>
            <MmTranslationSettingsButton
                v-if="canConfigure && context?.settings"
                :disabled="running"
                @click="openSettings"
            />
        </template>
        <div class="translation-toolbar">
            <label
                >编辑语言<MmInput
                    :model-value="editingLanguageLabel"
                    aria-label="编辑语言"
                    readonly
            /></label>
            <MmSegmented
                v-model="filter"
                :options="filterOptions"
                size="sm"
                aria-label="语言状态"
            />
        </div>
        <div v-if="contextLoading" class="translation-notice">
            <MmLoading size="sm" />正在读取翻译配置
        </div>
        <MmAlert v-else-if="contextError" type="warning">
            翻译配置读取失败，请重试。
            <MmButton size="sm" @click="loadContext">重试</MmButton>
        </MmAlert>
        <MmAlert v-else-if="!automaticEnabled" type="info">{{
            context?.reason || '当前翻译服务未启用，仍可手动编辑。'
        }}</MmAlert>
        <div v-if="running || progress.total" class="translation-progress" role="status">
            {{ running ? '翻译中' : '翻译结束' }} {{ progress.done }}/{{ progress.total }}
            <MmButton v-if="running" size="sm" @click="stop">停止</MmButton>
        </div>
        <MmMultilingualFields :locales="shownLocales" :fields="editorFields" :values="copies"
            :errors="errors" :source-locale="sourceLocale" :disabled="readonly"
            @edit="(code, field, value) => edit(code, field as Field, value)" />
        <template #footer>
            <span class="translation-footer-status">{{ readonly ? '只读' : '尚未保存' }}</span>
            <MmButton @click="close">{{ readonly ? '关闭' : '取消' }}</MmButton>
            <MmButton
                v-if="!readonly && failureCount"
                :disabled="!automaticEnabled || running || !sourceComplete"
                @click="translate(true)"
                >重试失败项</MmButton
            >
            <MmButton
                v-if="!readonly"
                :disabled="!automaticEnabled || running || !sourceComplete"
                @click="translate(false)"
            >
                <MmIcon name="languages" :size="14" />Google 一键翻译
            </MmButton>
            <MmButton v-if="!readonly" variant="primary" :disabled="running" @click="apply"
                >应用到配置</MmButton
            >
        </template>
    </MmDialog>
    <MmTranslationSettingsDialog v-model="settingsOpen" :actions="settingsActions" :locales="locales"
        @saved="settingsSaved" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { MmAlert } from '../alert'
import { MmButton } from '../button'
import { MmTranslationSettingsButton, MmTranslationSettingsDialog, type TranslationSettingsActions } from '../translation-settings'
import { MmDialog } from '../dialog'
import { MmIcon } from '../icon'
import { MmInput } from '../input'
import { MmLoading } from '../loading'
import { MmSegmented } from '../segmented'
import { MmMultilingualFields, type TranslationField } from '../multilingual-fields'
import { message } from '../../services/message'
import type { SeoCopy, SeoTranslationContext, SeoTranslationCallbacks, TranslationSettings } from './model'

const props = defineProps<{
    siteId: string
    callbacks: SeoTranslationCallbacks
    locales: { value: string; label: string }[]
    translations: Record<string, SeoCopy>
    editingLocale: string
    readonly: boolean
}>()
const emit = defineEmits<{
    close: []
    apply: [value: { translations: Record<string, SeoCopy> }]
    'context-change': [value: SeoTranslationContext]
}>()
const fields = ['title', 'description'] as const
const editorFields: TranslationField[] = [
    { key: 'title', label: '首页标题', maxLength: 200 },
    { key: 'description', label: '首页描述', maxLength: 1000, multiline: true },
]
type Field = (typeof fields)[number]
const copies = ref<Record<string, SeoCopy>>(JSON.parse(JSON.stringify(props.translations)))
const sourceLocale = computed(() => props.editingLocale)
const editingLanguageLabel = computed(
    () =>
        props.locales.find((item) => item.value === props.editingLocale)?.label ||
        props.editingLocale
)
const filter = ref('all')
const errors = reactive<Record<string, Partial<SeoCopy>>>({})
const revisions: Record<string, number> = {}
const context = ref<SeoTranslationContext | null>(null),
    contextLoading = ref(false),
    contextError = ref(false)
const running = ref(false),
    progress = reactive({ done: 0, total: 0 })
const settingsOpen = ref(false)
const settingsActions: TranslationSettingsActions = {
    load: async () => {
        await loadContext()
        if (!context.value?.settings || contextError.value) throw new Error('翻译配置读取失败')
        return context.value.settings
    },
    save: (settings, key) => props.callbacks.saveSettings!(settings, key),
    testConnection: (settings, key) => props.callbacks.testConnection!(settings.space_id, settings.space_revision, key),
}
let generation = 0,
    disposed = false
let contextController: AbortController | undefined
const requests = new Set<AbortController>()
const scope = { site_id: props.siteId }
const canConfigure = computed(() => !props.readonly && !!props.callbacks.saveSettings && !!props.callbacks.testConnection)
const automaticEnabled = computed(
    () =>
        !!(
            !contextLoading.value &&
            !contextError.value &&
            context.value?.available &&
            context.value.settings?.is_enabled &&
            context.value.settings.supported &&
            context.value.settings.credential_configured
        )
)
const sourceComplete = computed(() => isComplete(sourceLocale.value))
const configuredLocales = computed(() => {
    const targets = new Set(context.value?.settings?.target_locales || [])
    return props.locales.filter((item) => targets.has(item.value))
})
const completeCount = computed(() => configuredLocales.value.filter((item) => isComplete(item.value)).length)
const failureCount = computed(() => configuredLocales.value.filter((item) => hasError(item.value)).length)
const filterOptions = computed(() => [
    { label: `全部 ${configuredLocales.value.length}`, value: 'all' },
    { label: `待完善 ${configuredLocales.value.length - completeCount.value}`, value: 'missing' },
    { label: `失败 ${failureCount.value}`, value: 'failed' }
])
const shownLocales = computed(() => {
    const source = props.locales.find((item) => item.value === sourceLocale.value)
    const targets = configuredLocales.value.filter(
        (item) =>
            item.value !== sourceLocale.value &&
            (filter.value === 'all' ||
                (filter.value === 'failed' ? hasError(item.value) : !isComplete(item.value)))
    )
    return source ? [source, ...targets] : targets
})
function isComplete(code: string) {
    return !!(copies.value[code]?.title.trim() && copies.value[code]?.description.trim())
}
function hasError(code: string) {
    return !!Object.keys(errors[code] || {}).length
}
function stop() {
    generation++
    for (const controller of requests) controller.abort()
    requests.clear()
    running.value = false
}
function edit(code: string, field: Field, value: string) {
    if (props.readonly) return
    if (code === sourceLocale.value && running.value) stop()
    copies.value[code] = {
        ...(copies.value[code] || { title: '', description: '' }),
        [field]: value
    }
    revisions[`${code}.${field}`] = (revisions[`${code}.${field}`] || 0) + 1
    if (errors[code]) delete errors[code][field]
}
watch(sourceLocale, () => {
    stop()
    for (const code of Object.keys(errors)) delete errors[code]
})
async function loadContext() {
    contextController?.abort()
    const controller = (contextController = new AbortController())
    contextLoading.value = true
    contextError.value = false
    try {
        const value = await props.callbacks.loadContext(scope, controller.signal)
        if (!disposed && !controller.signal.aborted) {
            context.value = value
            emit('context-change', value)
        }
    } catch {
        if (!disposed && !controller.signal.aborted) contextError.value = true
    } finally {
        if (!disposed && !controller.signal.aborted) contextLoading.value = false
    }
}
async function translate(failedOnly: boolean) {
    if (props.readonly || running.value || !automaticEnabled.value || !sourceComplete.value) return
    const source = { ...copies.value[sourceLocale.value] },
        from = sourceLocale.value
    const jobs = configuredLocales.value
        .filter((item) => item.value !== from)
        .map((item) => {
            const selected = fields.filter(
                (field) =>
                    !copies.value[item.value]?.[field]?.trim() &&
                    (!failedOnly || errors[item.value]?.[field])
            )
            return {
                code: item.value,
                fields: Object.fromEntries(
                    selected.map((field) => [field, source[field]])
                ) as Partial<SeoCopy>,
                revisions: Object.fromEntries(
                    selected.map((field) => [field, revisions[`${item.value}.${field}`] || 0])
                )
            }
        })
        .filter((job) => Object.keys(job.fields).length)
    if (!jobs.length) {
        message.info('已启用的目标语言没有待翻译字段')
        return
    }
    running.value = true
    progress.done = 0
    progress.total = jobs.length
    const current = ++generation
    let next = 0
    async function worker() {
        while (current === generation && next < jobs.length) {
            const job = jobs[next++],
                controller = new AbortController()
            requests.add(controller)
            try {
                const result = await props.callbacks.translate(
                    { ...scope, source_locale: from, target_locale: job.code, fields: job.fields },
                    controller.signal
                )
                if (current !== generation || disposed) return
                for (const field of fields) {
                    if (
                        !(field in job.fields) ||
                        (revisions[`${job.code}.${field}`] || 0) !== job.revisions[field] ||
                        copies.value[job.code]?.[field]?.trim()
                    )
                        continue
                    if (result.values[field]) {
                        copies.value[job.code] = {
                            ...(copies.value[job.code] || { title: '', description: '' }),
                            [field]: result.values[field]
                        }
                        if (errors[job.code]) delete errors[job.code][field]
                    } else {
                        errors[job.code] = {
                            ...errors[job.code],
                            [field]: result.errors[field] || '翻译失败，请重试'
                        }
                    }
                }
            } catch {
                if (current !== generation || disposed) return
                for (const field of fields)
                    if (
                        field in job.fields &&
                        !copies.value[job.code]?.[field]?.trim() &&
                        (revisions[`${job.code}.${field}`] || 0) === job.revisions[field]
                    )
                        errors[job.code] = { ...errors[job.code], [field]: '翻译失败，请重试' }
            } finally {
                requests.delete(controller)
                if (current === generation && !disposed) progress.done++
            }
        }
    }
    await Promise.all(
        Array.from(
            { length: Math.min(jobs.length, context.value?.settings?.concurrency_limit || 1, 3) },
            worker
        )
    )
    if (current === generation && !disposed) running.value = false
}
function close() {
    stop()
    emit('close')
}
function apply() {
    if (running.value || props.readonly) return
    emit('apply', {
        translations: JSON.parse(JSON.stringify(copies.value))
    })
    close()
}
function openSettings() {
    if (canConfigure.value && context.value?.settings) settingsOpen.value = true
}
function settingsSaved(value: TranslationSettings) {
    if (!disposed && context.value) {
        context.value = { ...context.value, settings: value }
        emit('context-change', context.value)
    }
}
onMounted(loadContext)
onBeforeUnmount(() => {
    disposed = true
    stop()
    contextController?.abort()
})
</script>

<style scoped>
.translation-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 16px;
}
.translation-toolbar label {
    width: 220px;
}
.translation-toolbar :deep(.mm-segmented) {
    margin-left: auto;
}
.translation-toolbar > label,
.translation-row > label {
    display: grid;
    gap: 7px;
    min-width: 0;
    font-size: 12px;
    color: var(--mm-color-text-muted);
}
.translation-rows {
    min-height: 0;
}
.translation-row {
    display: grid;
    grid-template-columns: 145px minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
    border-bottom: 1px solid var(--mm-color-line);
    padding: 18px 8px;
}
.translation-row.is-source {
    background: var(--mm-color-primary-soft);
    border-left: 2px solid var(--mm-color-primary);
}
.translation-language {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 8px;
    font-size: 12px;
    overflow-wrap: anywhere;
}
.translation-notice,
.translation-progress {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    font-size: 12px;
}
.translation-error {
    color: var(--mm-color-danger);
}
.translation-empty {
    padding: 48px 16px;
    text-align: center;
    color: var(--mm-color-text-muted);
}
.translation-footer-status {
    margin-right: auto;
    font-size: 12px;
    color: var(--mm-color-text-muted);
}
@media (max-width: 650px) {
    .translation-toolbar label {
        width: 100%;
    }
    .translation-toolbar :deep(.mm-segmented) {
        margin-left: 0;
    }
    .translation-row {
        grid-template-columns: minmax(0, 1fr);
    }
    .translation-language {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
}
</style>
<style>
.seo-translations-panel > .mm-dialog__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
}
.seo-translations-panel > .mm-dialog__body > * {
    flex-shrink: 0;
}
.seo-translations-panel {
    border-radius: 8px;
}
.seo-translations-panel > .mm-dialog__footer {
    flex-wrap: wrap;
}
</style>
