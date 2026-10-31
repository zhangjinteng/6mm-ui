<template>
    <section class="translations-page" aria-label="多语言翻译管理" :aria-busy="loading">
        <header class="translation-toolbar surface">
            <div class="translation-title">
                <span class="translation-title__icon"><MmIcon name="globe" :size="21" /></span>
                <div>
                    <h1>语言翻译管理</h1>
                    <div class="translation-progress">
                        <strong>{{ overall }}%</strong>
                        <MmProgress
                            :percentage="overall"
                            :show-text="false"
                            :stroke-width="4"
                            aria-label="全部翻译完成度"
                        />
                        <span
                            >{{ metadata?.done.toLocaleString() || 0 }} /
                            {{ metadata?.total.toLocaleString() || 0 }} 个目标字段</span
                        >
                    </div>
                </div>
            </div>
            <div class="translation-toolbar__actions">
                <MmSelect
                    :model-value="spaceId"
                    :options="spaceOptions"
                    size="sm"
                    :disabled="loading || busy"
                    placeholder="内容空间"
                    aria-label="内容空间"
                    @update:model-value="changeSpace(String($event))"
                />
                <span class="source-language"
                    >内容源语言 <b>{{ sourceLabel }}</b></span
                >
                <MmButton
                    v-if="canConfig"
                    size="sm"
                    :disabled="!spaceId || busy"
                    @click="openSettings"
                    ><template #icon><MmIcon name="sliders-horizontal" :size="14" /></template
                    >翻译配置</MmButton
                >
                <MmButton
                    v-if="canTranslate"
                    size="sm"
                    :disabled="!canStartJob"
                    @click="openJob('batch')"
                    ><template #icon><MmIcon name="rocket" :size="14" /></template
                    >批量翻译</MmButton
                >
                <MmButton
                    v-if="canTranslate"
                    size="sm"
                    :disabled="!canStartJob || !detail || !currentField?.translatable"
                    @click="openJob('field')"
                    ><template #icon><MmIcon name="globe" :size="14" /></template
                    >翻译当前字段</MmButton
                >
                <MmButton
                    v-if="canEdit"
                    size="sm"
                    variant="primary"
                    :loading="saving"
                    :disabled="!dirty || busy || !metadata?.space_enabled"
                    @click="save"
                    ><template #icon><MmIcon name="save" :size="14" /></template>保存翻译</MmButton
                >
            </div>
        </header>

        <MmAlert v-if="error" type="error" :closable="true" @close="error = ''">{{
            error
        }}</MmAlert>
        <MmAlert v-if="metadata && !metadata.space_enabled && spaceId" type="warning"
            >当前内容空间已停用，仅可查看翻译。</MmAlert
        >
        <MmAlert v-if="metadata && !metadata.target_locales.length && spaceId" type="info"
            >尚未启用目标语言，请在“翻译配置”中选择语言后开始翻译。</MmAlert
        >

        <div v-if="job" class="translation-job surface" role="status">
            <MmIcon :name="jobActive(job) ? 'loader-circle' : 'info'" :size="15" />
            <strong>{{ jobLabels[job.status] || job.status }}</strong
            ><span>任务 #{{ job.id }}</span>
            <MmProgress :percentage="jobPercent" :show-text="false" :stroke-width="4" />
            <span
                >{{ job.counts.succeeded || 0 }} / {{ job.total }} 已完成<span
                    v-if="job.counts.failed"
                >
                    · {{ job.counts.failed }} 失败</span
                ><span v-if="job.counts.skipped"> · {{ job.counts.skipped }} 冲突跳过</span></span
            >
            <MmButton
                v-if="jobActive(job) && canTranslate"
                size="sm"
                variant="text"
                :disabled="busy"
                @click="cancelJob"
                >取消任务</MmButton
            >
            <MmButton v-else size="sm" variant="text" @click="job = null">收起</MmButton>
            <span
                v-if="job.errors.length"
                class="translation-job__error"
                :title="job.errors.map((e) => `${e.target_locale}: ${e.error_code}`).join('；')"
                >{{ job.errors[0].error_code }}（可重新提交补翻）</span
            >
        </div>

        <div class="language-overview surface" aria-label="目标语言完成度">
            <button
                v-for="locale in targetOptions"
                :key="locale.code"
                type="button"
                class="language-card"
                :class="{
                    'is-active': focusedLocale === locale.code,
                    'is-disabled': !isEnabled(locale.code)
                }"
                :disabled="!isEnabled(locale.code)"
                :title="
                    isEnabled(locale.code)
                        ? `${locale.native}：${locale.done} / ${locale.total}`
                        : '请在翻译配置中启用'
                "
                @click="focusLocale(locale.code)"
            >
                <span>{{ locale.flag }}</span
                ><span>{{ locale.label }}</span
                ><strong>{{
                    isEnabled(locale.code) ? percent(locale.done, locale.total) + '%' : '未启用'
                }}</strong>
                <MmProgress
                    :percentage="percent(locale.done, locale.total)"
                    :show-text="false"
                    :stroke-width="2"
                />
            </button>
        </div>

        <nav class="module-bar surface" aria-label="翻译内容模块">
            <div v-for="group in moduleGroups" :key="group[0].module" class="module-group">
                <MmButton
                    v-for="item in group"
                    :key="item.key"
                    :variant="moduleKey === item.key ? 'primary' : 'text'"
                    :plain="moduleKey === item.key"
                    size="sm"
                    :disabled="!item.available || busy"
                    :title="item.reason"
                    :aria-pressed="moduleKey === item.key"
                    @click="changeModule(item)"
                >
                    <MmIcon
                        v-if="item.kind !== 'category'"
                        :name="moduleIcon(item.module)"
                        :size="14"
                    />{{ item.label }}<span class="module-count">{{ item.count }}</span>
                </MmButton>
            </div>
        </nav>

        <main class="translation-workspace surface">
            <aside class="content-browser">
                <div class="content-browser__header">
                    <div>
                        <strong>{{ currentModuleLabel }}</strong
                        ><span
                            >{{ count }} 条{{ scope.kind === 'category' ? '分类' : '内容' }}</span
                        >
                    </div>
                    <MmInput
                        v-model="keyword"
                        size="sm"
                        clearable
                        placeholder="搜索内容"
                        aria-label="搜索内容"
                        @keydown.enter="search"
                        ><template #prefix><MmIcon name="search" :size="14" /></template
                    ></MmInput>
                </div>
                <div class="content-browser__list" :aria-busy="listLoading">
                    <p v-if="listLoading" class="region-status" role="status">加载内容中…</p>
                    <template v-else>
                        <button
                            v-for="row in rows"
                            :key="row.id"
                            type="button"
                            class="content-item"
                            :class="{ 'is-selected': selectedId === row.id }"
                            :aria-current="selectedId === row.id ? 'true' : undefined"
                            :disabled="busy"
                            @click="selectRow(row.id)"
                        >
                            <span class="content-item__text"
                                ><strong :title="row.title">{{ row.title }}</strong
                                ><small
                                    >{{ publishLabels[row.publish_status || ''] || '分类' }} ·
                                    {{ row.done }}/{{ row.total }}</small
                                ></span
                            >
                            <MmProgress
                                type="circle"
                                :percentage="percent(row.done, row.total)"
                                :show-text="false"
                                :size="16"
                                :stroke-width="2"
                                :status="
                                    row.total && row.done === row.total ? 'success' : 'warning'
                                "
                            />
                        </button>
                        <p v-if="!rows.length" class="region-status">
                            {{ appliedKeyword ? '没有匹配的内容' : '暂无可翻译内容' }}
                        </p>
                    </template>
                </div>
                <footer class="content-browser__footer">
                    <MmButton
                        size="sm"
                        icon-only
                        aria-label="上一页"
                        :disabled="page <= 1 || listLoading || busy"
                        @click="changePage(page - 1)"
                        ><MmIcon name="chevron-left" :size="14" /></MmButton
                    ><span>{{ page }} / {{ Math.max(1, Math.ceil(count / 30)) }}</span
                    ><MmButton
                        size="sm"
                        icon-only
                        aria-label="下一页"
                        :disabled="page * 30 >= count || listLoading || busy"
                        @click="changePage(page + 1)"
                        ><MmIcon name="chevron-right" :size="14"
                    /></MmButton>
                </footer>
            </aside>

            <section class="translation-editor" :aria-busy="detailLoading">
                <div v-if="detailLoading" class="editor-state" role="status">
                    <MmIcon name="loader-circle" :size="28" />
                    <p>加载译文中…</p>
                </div>
                <template v-else-if="detail">
                    <header class="translation-editor__header">
                        <div class="translation-editor__title">
                            <span>{{ currentModuleLabel }} <em v-if="dirty">有未保存修改</em></span>
                            <h2 :title="detail.title">{{ detail.title }}</h2>
                        </div>
                        <MmTabs v-model="fieldKey"
                            ><MmTabPane
                                v-for="field in detail.fields"
                                :key="field.key"
                                :name="field.key"
                                :label="`${field.label} ${field.translatable ? fieldDone(field) + '/' + field.translations.length : '—'}`"
                        /></MmTabs>
                    </header>
                    <div v-if="currentField" class="translation-editor__body" ref="editorBody">
                        <section class="source-field">
                            <div class="section-heading">
                                <strong
                                    >{{ sourceLabel }}
                                    <MmTag size="sm" type="primary" effect="soft"
                                        >内容源语言</MmTag
                                    ></strong
                                ><span>只读原文</span>
                            </div>
                            <textarea
                                :value="currentField.source"
                                readonly
                                :rows="currentField.key === 'body_html' ? 5 : 2"
                                class="translation-textarea source-textarea"
                                :aria-label="`原文${currentField.label}`"
                            />
                        </section>
                        <div class="section-heading target-heading">
                            <strong>目标语言</strong
                            ><span
                                >{{
                                    detail.fields.find((f) => f.key === fieldKey)?.translations
                                        .length || 0
                                }}
                                种语言 · 手工修改后请保存</span
                            >
                        </div>
                        <div v-if="!currentField.translatable" class="empty-source">
                            <MmIcon name="info" :size="18" />原文字段为空，不参与翻译和完成度统计。
                        </div>
                        <div v-else-if="!currentField.translations.length" class="empty-source">
                            请先在“翻译配置”中启用目标语言。
                        </div>
                        <div
                            v-else
                            class="target-grid"
                            :class="{ 'is-body': fieldKey === 'body_html' }"
                        >
                            <div
                                v-for="value in currentField.translations"
                                :key="value.locale"
                                class="target-field"
                                :class="{ 'is-focused': focusedLocale === value.locale }"
                                :data-locale="value.locale"
                            >
                                <div class="target-field__heading">
                                    <label :for="`translation-${fieldKey}-${value.locale}`"
                                        >{{ localeInfo(value.locale)?.native || value.locale }}
                                        <small>{{ value.locale }}</small></label
                                    ><span v-if="value.status === 'stale'" class="status-stale"
                                        >原文已更新</span
                                    ><span
                                        v-else-if="value.status === 'ready'"
                                        class="status-ready"
                                        >{{
                                            value.method === 'machine' ? '机器翻译' : '已保存'
                                        }}</span
                                    >
                                </div>
                                <textarea
                                    :id="`translation-${fieldKey}-${value.locale}`"
                                    v-model="values[valueKey(fieldKey, value.locale)]"
                                    class="translation-textarea"
                                    :rows="fieldKey === 'body_html' ? 10 : 2"
                                    :maxlength="currentField.max_length"
                                    :disabled="!canEdit || !metadata?.space_enabled || busy"
                                    :dir="value.locale === 'ar' ? 'rtl' : 'auto'"
                                    :placeholder="`请输入${localeInfo(value.locale)?.native || value.locale}翻译${fieldKey === 'body_html' ? '（HTML）' : ''}`"
                                />
                                <div class="target-field__count">
                                    {{
                                        (
                                            values[valueKey(fieldKey, value.locale)] || ''
                                        ).length.toLocaleString()
                                    }}
                                    / {{ currentField.max_length.toLocaleString() }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <div v-else class="editor-state">
                    <MmEmpty
                        :description="
                            error ? '内容加载失败，可点击刷新重试' : '选择左侧内容开始翻译'
                        "
                    /><MmButton v-if="error" size="sm" @click="refresh">重新加载</MmButton>
                </div>
            </section>
        </main>

        <MmDialog
            v-model="settingsOpen"
            title="翻译配置"
            subtitle="当前内容空间共用 · Google Cloud Translation Basic v2"
            width="560px"
            :close-on-click-modal="false"
            :before-close="() => !configSaving"
        >
            <MmAlert v-if="settingsError" type="error">{{ settingsError }}</MmAlert>
            <div v-if="settingsLoading" class="region-status">加载配置中…</div>
            <MmForm
                v-else-if="settings"
                :model="settings"
                class="translation-config"
                label-position="top"
            >
                <MmFormItem label="目标语言"
                    ><MmSelect
                        v-model="settings.target_locales"
                        :options="localeOptions"
                        multiple
                        filterable
                        :max-tag-count="4"
                        placeholder="选择需要维护的目标语言"
                        :disabled="configSaving"
                    /></MmFormItem
                >
                <MmFormItem label="Google Translate"
                    ><div class="config-service">
                        <strong>Google Cloud Translation · Basic v2</strong
                        ><MmCheckbox
                            v-model="settings.is_enabled"
                            :disabled="configSaving || !settings.credential_configured"
                            >开启自动翻译</MmCheckbox
                        >
                    </div>
                </MmFormItem
                >
                <MmFormItem label="服务端密钥引用"
                    ><MmInput :model-value="settings.credential_ref" readonly /><small
                        v-if="!settings.credential_configured"
                        >服务端尚未配置 GOOGLE_TRANSLATE_API_KEY，人工翻译仍可正常使用。</small
                    ></MmFormItem
                >
                <div class="config-grid">
                    <MmFormItem label="并发上限"
                        ><MmInputNumber
                            v-model="settings.concurrency_limit"
                            :min="1"
                            :max="20"
                            :disabled="configSaving" /></MmFormItem
                    ><MmFormItem label="请求超时（秒）"
                        ><MmInputNumber
                            v-model="settings.request_timeout_seconds"
                            :min="1"
                            :max="120"
                            :disabled="configSaving" /></MmFormItem
                    ><MmFormItem label="最大尝试次数"
                        ><MmInputNumber
                            v-model="settings.max_attempts"
                            :min="1"
                            :max="10"
                            :disabled="configSaving"
                    /></MmFormItem>
                </div>
                <MmAlert v-if="!settings.supported" type="warning"
                    >当前空间关联了其他版本的翻译配置。保存将为该空间创建独立的 Google v2
                    配置，不修改其他空间。</MmAlert
                >
            </MmForm>
            <template #footer
                ><MmButton
                    size="sm"
                    :loading="testing"
                    :disabled="!settings?.credential_configured || configSaving || settingsLoading"
                    @click="testConnection"
                    >测试连接</MmButton
                ><span class="footer-spacer" /><MmButton
                    size="sm"
                    :disabled="configSaving"
                    @click="settingsOpen = false"
                    >取消</MmButton
                ><MmButton
                    size="sm"
                    variant="primary"
                    :loading="configSaving"
                    :disabled="!settings || settingsLoading || testing"
                    @click="saveConfig"
                    >保存配置</MmButton
                ></template
            >
        </MmDialog>

        <MmDialog
            v-model="jobOpen"
            :title="jobMode === 'field' ? '翻译当前字段' : '批量翻译'"
            subtitle="Google Translate · 仅补齐缺失及原文已更新的译文"
            width="520px"
            :close-on-click-modal="false"
            :before-close="() => !submittingJob"
        >
            <div class="job-confirm">
                <p>
                    {{
                        jobMode === 'field'
                            ? `当前内容的「${currentField?.label}」`
                            : `当前空间「${currentModuleLabel}」${appliedKeyword ? '中匹配搜索条件的内容' : '全部内容'}`
                    }}
                </p>
                <MmFormItem label="目标语言"
                    ><MmSelect
                        v-model="jobLocales"
                        :options="enabledLocaleOptions"
                        multiple
                        filterable
                        :max-tag-count="5"
                        :disabled="submittingJob" /></MmFormItem
                ><MmAlert type="warning"
                    >内容将发送至 Google
                    Translate，并可能产生翻译费用。已有有效译文不会覆盖；单次最多 200 条内容、5,000
                    个字段任务。后台任务需要已启动翻译 worker。</MmAlert
                ><MmAlert v-if="jobError" type="error">{{ jobError }}</MmAlert>
            </div>
            <template #footer
                ><MmButton size="sm" :disabled="submittingJob" @click="jobOpen = false"
                    >取消</MmButton
                ><MmButton
                    variant="primary"
                    size="sm"
                    :loading="submittingJob"
                    :disabled="!jobLocales.length"
                    @click="submitJob"
                    >确认翻译</MmButton
                ></template
            >
        </MmDialog>
        <MmDialog
            v-model="discardOpen"
            title="有未保存的翻译"
            subtitle="切换后将丢弃当前修改，是否继续？"
            width="380px"
            @close="dismissDiscard"
            ><template #footer
                ><MmButton size="sm" @click="dismissDiscard">继续编辑</MmButton
                ><MmButton size="sm" variant="warning" @click="discard"
                    >放弃修改并继续</MmButton
                ></template
            ></MmDialog
        >
    </section>
</template>

<script setup lang="ts">
import { useCmsRuntime } from "../../../../runtime"
const { cancelTranslationJob, createTranslationJob, getTranslationDetail, getTranslationJob, getTranslationList, getTranslationMetadata, getTranslationSettings, saveTranslations, saveTranslationSettings, testTranslationConnection } = useTranslationsApi()
const { hasPermission } = useCmsRuntime()

import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { onBeforeCmsLeave as onBeforeRouteLeave } from "../../../../runtime"
import {
    MmAlert,
    MmButton,
    MmCheckbox,
    MmDialog,
    MmEmpty,
    MmForm,
    MmFormItem,
    MmIcon,
    MmInput,
    MmInputNumber,
    MmProgress,
    MmSelect,
    MmTabPane,
    MmTabs,
    MmTag,
    message,
    type IconName
} from "../../../../../index"
import { useTranslationsApi, type TranslationDetail, type TranslationJob, type TranslationMetadata, type TranslationModule, type TranslationRow, type TranslationScope, type TranslationSettings } from "../../../../api/content/translations"

import {
    editsFor,
    fieldDone,
    jobActive,
    jobLabels,
    percent,
    publishLabels,
    readableError,
    valueKey,
    valuesFor
} from './model'

const metadata = ref<TranslationMetadata>(),
    spaceId = ref(''),
    moduleKey = ref('news:content')
const rows = ref<TranslationRow[]>([]),
    detail = ref<TranslationDetail>(),
    selectedId = ref(''),
    fieldKey = ref('title')
const keyword = ref(''),
    appliedKeyword = ref(''),
    page = ref(1),
    count = ref(0),
    values = ref<Record<string, string>>({})
const loading = ref(false),
    listLoading = ref(false),
    detailLoading = ref(false),
    saving = ref(false),
    error = ref('')
const focusedLocale = ref(''),
    editorBody = ref<HTMLElement>(),
    job = ref<TranslationJob | null>(null)
const settingsOpen = ref(false),
    settingsLoading = ref(false),
    settings = ref<TranslationSettings>(),
    settingsError = ref(''),
    configSaving = ref(false),
    testing = ref(false)
const jobOpen = ref(false),
    jobMode = ref<'batch' | 'field'>('field'),
    jobLocales = ref<string[]>([]),
    jobError = ref(''),
    submittingJob = ref(false)
const discardOpen = ref(false)
let pendingChange: (() => void) | undefined,
    listController: AbortController | undefined,
    detailController: AbortController | undefined,
    metadataController: AbortController | undefined
let routeDecision: ((leave: boolean) => void) | undefined
const lifetime = new AbortController()
let pollTimer: ReturnType<typeof setTimeout> | undefined,
    jobRequestKey = ''
const canEdit = computed(() => hasPermission(['cms_translation:edit']))
const canConfig = computed(() => hasPermission(['cms_translation:config']))
const canTranslate = computed(() => hasPermission(['cms_translation:translate']))
const busy = computed(() => saving.value || configSaving.value || submittingJob.value)
const dirty = computed(() => editsFor(detail.value, values.value).length > 0)
const overall = computed(() => percent(metadata.value?.done || 0, metadata.value?.total || 0))
const scope = computed<TranslationScope>(() => ({
    space_id: spaceId.value,
    module: moduleKey.value.split(':')[0],
    kind: moduleKey.value.endsWith(':category') ? 'category' : 'content'
}))
const spaceOptions = computed(
    () =>
        metadata.value?.spaces.map((s) => ({
            label: s.label + (s.is_enabled ? '' : '（已停用）'),
            value: s.id
        })) || []
)
const targetOptions = computed(
    () => metadata.value?.locales.filter((l) => l.code !== metadata.value?.source_locale) || []
)
const localeOptions = computed(() =>
    targetOptions.value.map((l) => ({ label: `${l.flag} ${l.label}`, value: l.code }))
)
const enabledLocaleOptions = computed(() =>
    localeOptions.value.filter((l) => isEnabled(String(l.value)))
)
const sourceLabel = computed(
    () =>
        metadata.value?.locales.find((l) => l.code === metadata.value?.source_locale)?.label ||
        metadata.value?.source_locale ||
        '简体中文'
)
const currentField = computed(() => detail.value?.fields.find((f) => f.key === fieldKey.value))
const currentModuleLabel = computed(() => {
    const m = metadata.value?.modules.find((m) => m.key === moduleKey.value)
    return m?.kind === 'category'
        ? `${metadata.value?.modules.find((x) => x.module === m.module && x.kind === 'content')?.label || ''}分类`
        : m?.label || '新闻'
})
const moduleGroups = computed(() => {
    const groups: TranslationModule[][] = []
    for (const m of metadata.value?.modules || []) {
        const g = groups.find((g) => g[0].module === m.module)
        if (g) g.push(m)
        else groups.push([m])
    }
    return groups
})
const canStartJob = computed(
    () =>
        !!spaceId.value &&
        metadata.value?.space_enabled &&
        !!metadata.value.target_locales.length &&
        !jobActive(job.value) &&
        !busy.value &&
        !dirty.value &&
        !loading.value &&
        !listLoading.value
)
const jobPercent = computed(() =>
    job.value
        ? percent(
              ['succeeded', 'skipped', 'cancelled'].reduce(
                  (n, s) => n + (job.value?.counts[s] || 0),
                  0
              ) + (!jobActive(job.value) ? job.value.counts.failed || 0 : 0),
              job.value.total
          )
        : 0
)
const isEnabled = (locale: string) => metadata.value?.target_locales.includes(locale) ?? false
const localeInfo = (locale: string) => metadata.value?.locales.find((l) => l.code === locale)
const moduleIcon = (module: string): IconName =>
    (
        ({
            news: 'file-text',
            academy: 'landmark',
            help: 'info',
            announcement: 'megaphone'
        }) as Record<string, IconName>
    )[module] || 'info'

function guard(action: () => void) {
    if (busy.value) return
    if (dirty.value) {
        pendingChange = action
        discardOpen.value = true
    } else action()
}
function discard() {
    const action = pendingChange
    pendingChange = undefined
    discardOpen.value = false
    values.value = detail.value ? valuesFor(detail.value) : {}
    action?.()
}
function dismissDiscard() {
    discardOpen.value = false
    pendingChange = undefined
    routeDecision?.(false)
    routeDecision = undefined
}
function changeSpace(id: string) {
    if (id !== spaceId.value)
        guard(() => {
            spaceId.value = id
            keyword.value = ''
            appliedKeyword.value = ''
            page.value = 1
            job.value = null
            void refresh()
        })
}
function changeModule(item: TranslationModule) {
    if (item.available && moduleKey.value !== item.key)
        guard(() => {
            moduleKey.value = item.key
            keyword.value = ''
            appliedKeyword.value = ''
            page.value = 1
            void loadList()
        })
}
function changePage(n: number) {
    guard(() => {
        page.value = n
        void loadList()
    })
}
function search() {
    guard(() => {
        appliedKeyword.value = keyword.value.trim()
        page.value = 1
        void loadList()
    })
}
function selectRow(id: string) {
    if (id !== selectedId.value)
        guard(() => {
            void loadDetail(id)
        })
}
async function refresh() {
    metadataController?.abort()
    const c = (metadataController = new AbortController())
    loading.value = true
    error.value = ''
    try {
        const result = await getTranslationMetadata(spaceId.value || undefined, c.signal)
        if (c.signal.aborted) return
        metadata.value = result
        spaceId.value = result.space_id || ''
        await loadList()
        void pollJob()
    } catch (e) {
        if (!c.signal.aborted) error.value = readableError(e)
    } finally {
        if (!c.signal.aborted) loading.value = false
    }
}
async function refreshStats() {
    const id = spaceId.value
    if (!id) return
    try {
        const result = await getTranslationMetadata(id, lifetime.signal)
        if (id === spaceId.value) metadata.value = result
    } catch {
        /* foreground actions report errors */
    }
}
async function loadList() {
    listController?.abort()
    detailController?.abort()
    const c = (listController = new AbortController())
    listLoading.value = true
    detailLoading.value = false
    detail.value = undefined
    selectedId.value = ''
    values.value = {}
    error.value = ''
    if (!spaceId.value) {
        rows.value = []
        count.value = 0
        listLoading.value = false
        return
    }
    const snapshot = { ...scope.value }
    try {
        const result = await getTranslationList(
            snapshot,
            appliedKeyword.value,
            page.value,
            c.signal
        )
        if (c.signal.aborted) return
        rows.value = result.lists
        count.value = result.count
        if (rows.value[0]) await loadDetail(rows.value[0].id)
    } catch (e) {
        if (!c.signal.aborted) {
            rows.value = []
            count.value = 0
            error.value = readableError(e)
        }
    } finally {
        if (!c.signal.aborted) listLoading.value = false
    }
}
async function loadDetail(id: string) {
    detailController?.abort()
    const c = (detailController = new AbortController())
    detailLoading.value = true
    selectedId.value = id
    detail.value = undefined
    values.value = {}
    error.value = ''
    try {
        const result = await getTranslationDetail({ ...scope.value }, id, c.signal)
        if (c.signal.aborted) return
        detail.value = result
        values.value = valuesFor(result)
        if (!result.fields.some((f) => f.key === fieldKey.value))
            fieldKey.value = result.fields[0]?.key || ''
        editorBody.value?.scrollTo({ top: 0 })
    } catch (e) {
        if (!c.signal.aborted) error.value = readableError(e)
    } finally {
        if (!c.signal.aborted) detailLoading.value = false
    }
}
async function save() {
    if (!detail.value || !canEdit.value || busy.value) return
    const items = editsFor(detail.value, values.value)
    if (!items.length) return
    if (items.some((i) => !i.text.trim())) {
        error.value = '译文不能为空；未翻译的语言请保持未填写。'
        return
    }
    saving.value = true
    error.value = ''
    try {
        const result = await saveTranslations({ ...scope.value }, detail.value.id, items)
        detail.value = result
        values.value = valuesFor(result)
        const index = rows.value.findIndex((r) => r.id === result.id)
        if (index >= 0) rows.value[index] = result
        message.success('翻译已保存')
        void refreshStats()
    } catch (e) {
        error.value = readableError(e)
    } finally {
        saving.value = false
    }
}
async function focusLocale(code: string) {
    focusedLocale.value = code
    await nextTick()
    const target = editorBody.value?.querySelector<HTMLElement>(`[data-locale="${code}"]`)
    target?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    target?.querySelector('textarea')?.focus()
}
async function openSettings() {
    if (!canConfig.value || !spaceId.value) return
    settingsOpen.value = true
    settingsLoading.value = true
    settingsError.value = ''
    settings.value = undefined
    try {
        settings.value = await getTranslationSettings(spaceId.value, lifetime.signal)
    } catch (e) {
        settingsError.value = readableError(e)
    } finally {
        settingsLoading.value = false
    }
}
async function saveConfig() {
    if (!settings.value || configSaving.value) return
    if (dirty.value) {
        settingsError.value = '请先保存或放弃当前译文修改，再修改配置。'
        return
    }
    configSaving.value = true
    settingsError.value = ''
    try {
        await saveTranslationSettings(settings.value)
        settingsOpen.value = false
        message.success('翻译配置已保存')
        await refresh()
    } catch (e) {
        settingsError.value = readableError(e)
    } finally {
        configSaving.value = false
    }
}
async function testConnection() {
    if (!spaceId.value) return
    testing.value = true
    settingsError.value = ''
    try {
        await testTranslationConnection(spaceId.value)
        message.success('Google Translate 连接成功')
    } catch (e) {
        settingsError.value = readableError(e)
    } finally {
        testing.value = false
    }
}
function openJob(mode: 'batch' | 'field') {
    jobMode.value = mode
    jobLocales.value = [...(metadata.value?.target_locales || [])]
    jobError.value = ''
    jobRequestKey = crypto.randomUUID()
    jobOpen.value = true
}
async function submitJob() {
    if (!jobLocales.value.length || submittingJob.value) return
    submittingJob.value = true
    jobError.value = ''
    try {
        const result = await createTranslationJob(
            { ...scope.value },
            {
                request_key: jobRequestKey,
                target_locales: jobLocales.value,
                ...(jobMode.value === 'field'
                    ? { id: selectedId.value, field_name: fieldKey.value }
                    : { keyword: appliedKeyword.value })
            }
        )
        job.value = result.job
        jobOpen.value = false
        message.success('翻译任务已提交')
        schedulePoll()
    } catch (e) {
        jobError.value = readableError(e)
    } finally {
        submittingJob.value = false
    }
}
function schedulePoll() {
    clearTimeout(pollTimer)
    if (jobActive(job.value))
        pollTimer = setTimeout(() => {
            void pollJob()
        }, 3000)
}
async function pollJob() {
    const id = spaceId.value
    if (!id || lifetime.signal.aborted) return
    const wasActive = jobActive(job.value)
    try {
        const result = await getTranslationJob(id, lifetime.signal)
        if (id !== spaceId.value) return
        job.value = result.job
        if (wasActive && !jobActive(job.value)) {
            await refreshStats()
            if (!dirty.value && !busy.value && selectedId.value) await loadDetail(selectedId.value)
        }
    } catch {
        /* retry without discarding editing state */
    }
    schedulePoll()
}
async function cancelJob() {
    if (!job.value) return
    try {
        const result = await cancelTranslationJob(spaceId.value, job.value.id)
        job.value = result.job
        clearTimeout(pollTimer)
        void refreshStats()
    } catch (e) {
        error.value = readableError(e)
    }
}
function preventUnload(event: BeforeUnloadEvent) {
    if (dirty.value || busy.value) {
        event.preventDefault()
        event.returnValue = ''
    }
}
onBeforeRouteLeave(() => {
    if (!dirty.value && !busy.value) return true
    if (busy.value) return false
    return new Promise<boolean>((resolve) => {
        routeDecision?.(false)
        routeDecision = resolve
        pendingChange = () => {
            routeDecision = undefined
            resolve(true)
        }
        discardOpen.value = true
    })
})
onMounted(() => {
    window.addEventListener('beforeunload', preventUnload)
    void refresh()
})
onBeforeUnmount(() => {
    routeDecision?.(false)
    lifetime.abort()
    listController?.abort()
    detailController?.abort()
    metadataController?.abort()
    clearTimeout(pollTimer)
    window.removeEventListener('beforeunload', preventUnload)
})
</script>

<style scoped>
.translations-page {
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: calc(100dvh - var(--navbar-height, 54px) - 24px);
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    font-size: 12px;
    color: var(--mm-text-primary, #172137);
}
.surface {
    background: var(--mm-bg, #fff);
    border: 1px solid var(--mm-border-color, #dfe4ec);
    border-radius: 11px;
}
.translation-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 14px;
    flex-shrink: 0;
}
.translation-title {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
}
.translation-title__icon {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: var(--mm-color-primary-light-9, #edf4ff);
    color: var(--mm-color-primary, #1677ff);
}
h1,
h2,
p {
    margin: 0;
}
h1 {
    font-size: 15px;
    font-weight: 650;
    line-height: 22px;
}
.translation-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #8191a9;
    font-size: 10px;
    white-space: nowrap;
}
.translation-progress strong {
    color: #12804e;
}
.translation-progress :deep(.mm-progress) {
    width: 110px;
}
.translation-toolbar__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
    flex-wrap: wrap;
}
.translation-toolbar__actions > :deep(.mm-select) {
    width: 185px;
}
.source-language {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #7c889c;
    padding: 0 8px;
    white-space: nowrap;
    font-size: 11px;
}
.source-language b {
    color: var(--mm-text-primary, #27364d);
    font-weight: 500;
}
.language-overview {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px;
    flex-shrink: 0;
}
.language-card {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 8px 9px 11px;
    background: var(--mm-bg-secondary, #f5f7fb);
    color: #41526c;
    cursor: pointer;
    font-size: 11px;
}
.language-card strong {
    margin-left: 2px;
    font-size: 10px;
    color: var(--mm-color-primary, #1677ff);
}
.language-card :deep(.mm-progress) {
    position: absolute;
    left: 9px;
    right: 9px;
    bottom: 5px;
    width: auto;
}
.language-card:hover,
.language-card.is-active {
    border-color: var(--mm-color-primary, #1677ff);
    background: #edf4ff;
}
.language-card.is-disabled {
    cursor: not-allowed;
    opacity: 0.48;
}
.language-card.is-disabled:hover {
    border-color: transparent;
    background: #f5f7fb;
}
.module-bar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 5px;
    overflow-x: auto;
    flex-shrink: 0;
}
.module-group {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
    border-radius: 7px;
    background: #f7f9fc;
    padding: 2px;
}
.module-group :deep(.mm-button__label) {
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
}
.module-count {
    background: #e9edf4;
    color: #5e708b;
    border-radius: 8px;
    padding: 0 5px;
    line-height: 16px;
    font-size: 10px;
}
.translation-workspace {
    display: grid;
    grid-template-columns: 270px minmax(0, 1fr);
    flex: 1;
    overflow: hidden;
    min-height: 0;
}
.content-browser {
    border-right: 1px solid #e3e8ef;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;
}
.content-browser__header {
    padding: 12px 10px 10px;
    border-bottom: 1px solid #e7ebf2;
}
.content-browser__header > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
.content-browser__header span {
    color: #8695aa;
    font-size: 11px;
}
.content-browser__list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 6px;
}
.content-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    text-align: left;
    padding: 10px 9px;
    border: 0;
    background: transparent;
    color: inherit;
    border-radius: 6px;
    margin-bottom: 3px;
    cursor: pointer;
}
.content-item:hover {
    background: #f5f8fc;
}
.content-item.is-selected {
    background: #eaf2ff;
    color: #1260ed;
}
.content-item__text {
    flex: 1;
    min-width: 0;
}
.content-item strong {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 11px;
    line-height: 18px;
    font-weight: 600;
}
.content-item small {
    display: block;
    font-size: 10px;
    color: #8b9db7;
    line-height: 18px;
}
.content-browser__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    border-top: 1px solid #e7ebf2;
    color: #8492a7;
    font-size: 11px;
}
.translation-editor {
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
}
.translation-editor__header {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 16px;
    min-height: 62px;
    padding-left: 14px;
    border-bottom: 1px solid #e3e8ef;
    flex-shrink: 0;
}
.translation-editor__title {
    padding: 10px 0;
    min-width: 100px;
    flex: 1;
}
.translation-editor__title > span {
    color: var(--mm-color-primary, #1677ff);
    font-size: 10px;
    font-weight: 600;
}
.translation-editor__title em {
    color: #c36b07;
    font-style: normal;
    margin-left: 6px;
    font-weight: 400;
}
.translation-editor__title h2 {
    font-size: 13px;
    font-weight: 600;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.translation-editor__header :deep(.mm-tabs) {
    flex-shrink: 0;
    max-width: 60%;
}
.translation-editor__header :deep(.mm-tabs__list) {
    height: 100%;
}
.translation-editor__header :deep(.mm-tabs__tab) {
    font-size: 11px;
    padding: 13px 12px;
}
.translation-editor__header :deep(.mm-tabs__panels) {
    display: none;
}
.translation-editor__body {
    padding: 12px 14px 20px;
    flex: 1;
    min-height: 0;
    overflow: auto;
    scroll-behavior: smooth;
}
.section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
}
.section-heading strong {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
}
.section-heading > span {
    font-size: 11px;
    color: #8697ae;
}
.source-field {
    padding-bottom: 12px;
    border-bottom: 1px solid #e6ebf2;
}
.translation-textarea {
    width: 100%;
    display: block;
    min-height: 52px;
    padding: 9px 10px;
    border: 1px solid var(--mm-border-color, #d7dfeb);
    border-radius: 6px;
    background: var(--mm-bg, #fff);
    color: inherit;
    font: inherit;
    line-height: 1.7;
    resize: vertical;
    outline: none;
    transition:
        border-color 0.15s,
        box-shadow 0.15s;
}
.translation-textarea:focus {
    border-color: var(--mm-color-primary, #1677ff);
    box-shadow: 0 0 0 2px #1677ff14;
}
.translation-textarea:disabled {
    background: #f7f9fc;
    color: #8492a5;
}
.source-textarea {
    background: #f7f9fc;
    color: #40516b;
}
.target-heading {
    margin-top: 16px;
    margin-bottom: 14px;
}
.target-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 14px;
    row-gap: 12px;
}
.target-field {
    min-width: 0;
    border-bottom: 1px solid #edf0f5;
    padding-bottom: 4px;
    scroll-margin: 14px;
}
.target-field__heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    margin-bottom: 7px;
}
.target-field label {
    font-weight: 600;
    color: #344862;
}
.target-field label small {
    margin-left: 5px;
    font-size: 10px;
    color: #8799b3;
    font-weight: 400;
}
.target-field__count {
    text-align: right;
    color: #8b9cb5;
    font-size: 10px;
    margin-top: 2px;
}
.status-stale {
    font-size: 10px;
    color: #b36a05;
}
.status-ready {
    font-size: 10px;
    color: #13996c;
}
.target-field.is-focused label {
    color: #1677ff;
}
.target-field.is-focused textarea {
    border-color: #1677ff;
}
.editor-state {
    display: flex;
    flex: 1;
    min-height: 200px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    color: #8a97aa;
}
.region-status {
    padding: 30px 12px;
    text-align: center;
    color: #8a97aa;
}
.empty-source {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 28px 0;
    color: #8998ad;
}
.translation-job {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    flex-shrink: 0;
    font-size: 11px;
    color: #72839d;
    flex-wrap: wrap;
}
.translation-job > :deep(.mm-progress) {
    width: 130px;
}
.translation-job strong {
    color: #344761;
}
.translation-job__error {
    font-size: 10px;
    color: #ba5c18;
}
.translation-config {
    padding: 4px 0;
}
.translation-config small {
    display: block;
    color: #8793a6;
    font-size: 11px;
    line-height: 1.7;
    margin-top: 6px;
}
.config-service {
    display: flex;
    align-items: center;
    gap: 10px;
}
.config-service strong {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
}
.config-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}
.config-grid :deep(.mm-input-number) {
    width: 100%;
}
.footer-spacer {
    flex: 1;
}
.job-confirm {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 0;
}
.job-confirm p {
    font-weight: 600;
}
.translations-page > :deep(.mm-alert) {
    flex-shrink: 0;
}
@media (max-width: 1200px) {
    .translation-toolbar {
        align-items: flex-start;
    }
    .translation-title {
        padding-top: 4px;
    }
    .translation-workspace {
        grid-template-columns: 230px minmax(0, 1fr);
    }
    .translation-editor__header {
        flex-wrap: wrap;
        gap: 0;
        padding-right: 12px;
    }
    .translation-editor__header :deep(.mm-tabs) {
        max-width: 100%;
    }
    .source-language {
        display: none;
    }
}
@media (max-width: 800px) {
    .translation-toolbar {
        flex-wrap: wrap;
    }
    .translation-toolbar__actions {
        justify-content: flex-start;
    }
    .translation-workspace {
        grid-template-columns: 195px minmax(0, 1fr);
    }
    .target-grid {
        grid-template-columns: 1fr;
    }
    .language-overview {
        max-height: 110px;
        overflow: auto;
    }
    .config-grid {
        grid-template-columns: 1fr;
    }
}
</style>
