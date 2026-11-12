import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import * as Vue from 'vue'
import { parse, compileScript as compile, compileStyle, compileTemplate } from '@vue/compiler-sfc'

function compileScript(descriptor, options) {
    if (descriptor.scriptSetup?.content.includes('TenantSeoSettingsProps')) descriptor.filename = filename
    return compile(descriptor, { ...options, fs: { fileExists: existsSync, readFile: path => readFileSync(path, 'utf8') } })
}

const filename = new URL('./TenantSeoSettings.vue', import.meta.url).pathname
const source = readFileSync(filename, 'utf8')
test('translation toolbar, notice and rows are spaced by the parent gap without double padding', () => {
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    const bodyStyles = editor.match(/\.seo-translations-panel > \.mm-dialog__body\s*\{([^}]+)\}/)[1]
    assert.match(bodyStyles, /display: flex/)
    assert.match(bodyStyles, /flex-direction: column/)
    assert.match(bodyStyles, /gap: 16px/)
    assert.match(bodyStyles, /overflow-y: auto/)
    assert.match(editor, /\.seo-translations-panel > \.mm-dialog__body > \*\s*\{\s*flex-shrink: 0/)
    const toolbarStyles = editor.match(/\.translation-toolbar\s*\{([^}]+)\}/)[1]
    assert.doesNotMatch(toolbarStyles, /padding-bottom|margin-bottom/)
})
test('translation settings uses the centered button icon slot instead of an inline label icon', () => {
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    const headerActions = editor.split('<template #header-actions>')[1].split('</MmButton>')[0]
    assert.match(
        headerActions,
        /<template #icon><MmIcon name="sliders-horizontal" :size="14" \/><\/template>/
    )
    assert.doesNotMatch(headerActions, /<MmIcon[^>]+\/>翻译配置/)
})
test('SEO page script, template and scoped styles compile', () => {
    const { descriptor, errors } = parse(source)
    assert.deepEqual(errors, [])
    const script = compileScript(descriptor, { id: 'seo-verification' })
    assert.deepEqual(
        compileTemplate({
            source: descriptor.template.content,
            filename,
            id: 'seo-verification',
            compilerOptions: { bindingMetadata: script.bindings }
        }).errors,
        []
    )
    for (const style of descriptor.styles)
        assert.deepEqual(
            compileStyle({
                source: style.content,
                filename,
                id: 'seo-verification',
                scoped: style.scoped
            }).errors,
            []
        )
})
test('verification is an optional, labelled card with token-only guidance', () => {
    assert.match(source, /class="seo-section seo-verification"/)
    assert.match(source, /用于确认当前白标域名的所有权/)
    assert.match(source, /class="seo-optional">选填/)
    assert.match(source, /aria-label="Google Search Console 验证"/)
    assert.match(source, /aria-label="HTML 标记验证码"/)
    assert.match(source, /placeholder="只填写 content 中的验证码"/)
    assert.match(source, /通过 DNS 验证则留空/)
    assert.match(source, /seo-verification-fields[\s\S]*border-top: 1px solid/)
})
test('collapse, domain binding and save behavior are retained without unimplemented SEO claims', () => {
    assert.match(source, /:aria-expanded="verificationOpen"/)
    assert.match(source, /v-if="verificationOpen"/)
    assert.match(source, /@update:model-value="setToken"/)
    assert.match(
        source,
        /draft\.value\.verification_domain = draft\.value\.google_verification_token/
    )
    assert.match(source, /v-if="domainMismatch"/)
    assert.match(source, /expected_version: detail\.value\.version/)
    assert.doesNotMatch(source, /由系统自动处理/)
})
test('SEO dialog matches the reference three-card layout and compact language toolbar', () => {
    assert.match(source, /class="mm-tenant-seo-settings"/)
    assert.match(source, /height: calc\(100vh - var\(--navbar-height, 60px\) - 24px\)/)
    assert.match(source, /class="seo-indexing-actions"/)
    assert.match(source, /class="seo-section seo-copy-card"/)
    assert.match(source, /class="seo-locale-actions"/)
    assert.match(source, /flex: 0 1 260px/)
    assert.match(source, /建议不超过 60 个字符/)
    assert.match(source, /建议 80–160 个字符/)
    assert.match(source, /\.tenant-seo-panel > \.mm-dialog__header\s*\{\s*min-height: 64px/)
    assert.match(source, /backdrop-filter: none/)
    assert.doesNotMatch(source, /--mm-color-text-secondary/)
})
test('multilingual editor uses a separate draft and applies without saving', () => {
    const mainCard = source
        .split('<section class="seo-section seo-copy-card">')[1]
        .split('</section>')[0]
    assert.doesNotMatch(mainCard, /aria-label="默认语言"/)
    assert.match(source, /<TenantSeoTranslations/)
    assert.match(source, /@apply="applyTranslations"/)
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    assert.match(source, /:editing-locale="locale"/)
    assert.match(editor, /aria-label="编辑语言"\s+readonly/)
    assert.doesNotMatch(editor, /aria-label="默认语言"|aria-label="翻译来源"/)
    assert.match(editor, /JSON.parse\(JSON.stringify\(props.translations\)\)/)
    assert.doesNotMatch(editor, /saveTenantSeo\(/)
    const { descriptor, errors } = parse(editor)
    assert.deepEqual(errors, [])
    const script = compileScript(descriptor, { id: 'seo-translations' })
    assert.deepEqual(
        compileTemplate({
            source: descriptor.template.content,
            filename: 'TenantSeoTranslations.vue',
            id: 'seo-translations',
            compilerOptions: { bindingMetadata: script.bindings }
        }).errors,
        []
    )
    for (const style of descriptor.styles)
        assert.deepEqual(
            compileStyle({
                source: style.content,
                filename: 'TenantSeoTranslations.vue',
                id: 'seo-translations',
                scoped: style.scoped
            }).errors,
            []
        )
})
test('multilingual source is locked to the parent editing language and leaves the default unchanged', () => {
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    assert.match(editor, /editingLocale: string/)
    assert.match(editor, /sourceLocale = computed\(\(\) => props.editingLocale\)/)
    assert.match(editor, /item.value === props.editingLocale\)\?\.label \|\|\s+props.editingLocale/)
    assert.doesNotMatch(editor, /v-model="sourceLocale"|defaultLocale/)
    assert.match(editor, /source_locale: from, target_locale: job.code/)
    const applyHandler = source
        .split('function applyTranslations(')[1]
        .split('let requestedSiteId')[0]
    assert.doesNotMatch(applyHandler, /default_locale|defaultLocale/)
    assert.match(applyHandler, /draft.value.translations = value.translations/)
})
test('English passed by the parent is readonly and used as the actual translation source', async () => {
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    const { descriptor } = parse(editor)
    const script = compileScript(descriptor, { id: 'seo-language-behavior' }).content
    const javascript = ts.transpileModule(script, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText
    const requests = []
    const emitted = []
    const module = { exports: {} }
    vm.runInNewContext(javascript, {
        module,
        exports: module.exports,
        AbortController,
        require(name) {
            if (name === 'vue') return { ...Vue, onMounted() {}, onBeforeUnmount() {} }
            if (name === '@/utils/perm') return { hasPermission: () => false }
            if (name === '@/api/agent/tenantSeo')
                return {
                    translateSeoCopy: async (request) => {
                        requests.push(request)
                        return {
                            values: {
                                title: 'Translated title',
                                description: 'Translated description'
                            },
                            errors: {}
                        }
                    }
                }
            return {}
        }
    })
    const state = module.exports.default.setup(
        {
            callbacks: {
                loadContext: async () => ({ available: false, settings: null }),
                translate: async request => { requests.push(request); return { values: { title: 'Translated title', description: 'Translated description' }, errors: {} } }
            },
            siteId: 'test-site',
            readonly: false,
            editingLocale: 'en',
            locales: [
                { value: 'zh-CN', label: '简体中文 · zh-CN' },
                { value: 'en', label: '英语 · en' },
                { value: 'ja', label: '日语 · ja' }
            ],
            translations: { en: { title: 'English title', description: 'English description' } }
        },
        { expose() {}, emit: (...args) => emitted.push(args) }
    )
    assert.equal(state.sourceLocale.value, 'en')
    assert.equal(state.editingLanguageLabel.value, '英语 · en')
    assert.equal(Vue.isReadonly(state.sourceLocale), true)
    assert.equal(state.shownLocales.value[0].value, 'en')
    state.context.value = {
        available: true,
        source_locale: 'zh-CN',
        settings: {
            is_enabled: true,
            supported: true,
            credential_configured: true,
            target_locales: ['en', 'ja'],
            concurrency_limit: 1
        }
    }
    await state.translate(false)
    assert.deepEqual(
        requests.map((request) => request.source_locale),
        ['en']
    )
    assert.deepEqual(
        requests.map((request) => request.target_locale),
        ['ja']
    )
    assert.equal(requests[0].fields.title, 'English title')
    state.apply()
    assert.equal(emitted[0][0], 'apply')
    assert.equal('defaultLocale' in emitted[0][1], false)
})

test('SEO delegates canonical settings and credential lifecycle to the shared dialog', async () => {
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    assert.match(editor, /<MmTranslationSettingsDialog/)
    assert.doesNotMatch(editor, /v-model="apiKey"|mm-translation-settings__credential/)
    const state = translationLanguageFixture({ callbacks: { loadContext: async () => ({}), saveSettings: async s => s, testConnection: async () => ({}) } }).state
    const canonical = { space_id: '41', space_revision: '7', source_locale: 'zh-CN', configuration_scope: 'platform', target_locales: ['en'] }
    state.context.value = { available: true, source_locale: 'en', settings: canonical }
    state.openSettings()
    assert.equal(state.settingsOpen.value, true)
    state.settingsSaved({ ...canonical, space_revision: '8', target_locales: ['ja'] })
    assert.equal(state.context.value.settings.space_id, '41')
    assert.equal(state.context.value.settings.space_revision, '8')
    assert.equal(state.context.value.source_locale, 'en')
    assert.deepEqual(Array.from(state.context.value.settings.target_locales), ['ja'])
})

function translationLanguageFixture(overrides = {}) {
    const editor = readFileSync(new URL('./TenantSeoTranslations.vue', import.meta.url), 'utf8')
    const { descriptor } = parse(editor)
    const script = compileScript(descriptor, { id: 'configured-seo-languages' }).content
    const javascript = ts.transpileModule(script, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText
    const module = { exports: {} }, emitted = []
    vm.runInNewContext(javascript, {
        module, exports: module.exports, AbortController,
        require(name) {
            if (name === 'vue') return { ...Vue, onMounted() {}, onBeforeUnmount() {} }
            if (name === '@/utils/perm') return { hasPermission: () => true }
            return {}
        }
    })
    const props = {
        callbacks: {}, siteId: 'site', readonly: false, editingLocale: 'zh-CN',
        locales: ['zh-CN', 'en', 'ja', 'zh-TW', 'fr'].map(value => ({ value, label: value })),
        translations: { 'zh-CN': { title: 'Source title', description: 'Source description' } },
        ...overrides
    }
    const state = module.exports.default.setup(props, { expose() {}, emit: (...args) => emitted.push(args) })
    const setTargets = (target_locales) => {
        state.context.value = {
            available: true, source_locale: 'zh-CN',
            settings: { target_locales, is_enabled: false, source_locale: 'zh-CN' }
        }
    }
    return { state, emitted, setTargets }
}

test('SEO language rows and counts follow configured targets even with automatic translation disabled', () => {
    const { state, setTargets } = translationLanguageFixture()
    setTargets(['en', 'zh-TW'])
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['zh-CN', 'en', 'zh-TW'])
    assert.equal(state.automaticEnabled.value, false)
    assert.equal(state.completeCount.value, 0)
    assert.deepEqual(Array.from(state.filterOptions.value, item => item.label), ['全部 2', '待完善 2', '失败 0'])
})

test('SEO keeps the source visible under filters and counts only configured language errors', () => {
    const { state, setTargets } = translationLanguageFixture({
        translations: {
            'zh-CN': { title: 'Source', description: 'Source description' },
            en: { title: 'English', description: 'English description' },
            ja: { title: 'Japanese', description: 'Japanese description' }
        }
    })
    setTargets(['en', 'zh-TW'])
    state.errors.ja = { title: 'Hidden error' }
    state.errors['zh-TW'] = { title: 'Visible error' }
    assert.equal(state.completeCount.value, 1)
    assert.equal(state.failureCount.value, 1)
    state.filter.value = 'missing'
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['zh-CN', 'zh-TW'])
    state.filter.value = 'failed'
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['zh-CN', 'zh-TW'])
})

test('SEO does not duplicate a source language that is also a configured target', () => {
    const { state, setTargets } = translationLanguageFixture({ editingLocale: 'en' })
    setTargets(['en', 'en', 'zh-TW', 'unsupported'])
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['en', 'zh-TW'])
    assert.equal(state.filterOptions.value[0].label, '全部 2')
})

test('SEO never falls back to the full language catalog while configuration is loading or unavailable', () => {
    const { state, setTargets } = translationLanguageFixture()
    state.contextLoading.value = true
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['zh-CN'])
    state.contextLoading.value = false
    state.contextError.value = true
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['zh-CN'])
    setTargets([])
    assert.deepEqual(Array.from(state.shownLocales.value, item => item.value), ['zh-CN'])
    assert.equal(state.filterOptions.value[0].label, '全部 0')
})

test('hiding an unconfigured SEO language does not delete its saved or unsaved copy on apply', () => {
    const hidden = { title: 'Existing Japanese', description: 'Keep this description' }
    const { state, emitted, setTargets } = translationLanguageFixture({
        translations: { ja: hidden, 'zh-CN': { title: 'Source', description: 'Description' } }
    })
    setTargets(['en', 'zh-TW'])
    assert.equal(state.shownLocales.value.some(item => item.value === 'ja'), false)
    state.edit('en', 'title', 'English draft')
    state.apply()
    const applied = JSON.parse(JSON.stringify(emitted.find(item => item[0] === 'apply')[1].translations))
    assert.deepEqual(applied.ja, hidden)
    assert.equal(applied.en.title, 'English draft')
    assert.equal(applied['zh-CN'].title, 'Source')
})

function seoEditorFixture(overrides = {}, preferences = new Map()) {
    const { descriptor } = parse(readFileSync(filename, 'utf8'))
    const script = compileScript(descriptor, { id: 'seo-reopen-behavior' }).content
    const javascript = ts.transpileModule(script, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
    }).outputText
    const fixture = {
        detail: {
            tenant_id: '900002',
            site_id: '910002',
            tenant_name: 'Demo',
            site_name: 'Demo',
            default_locale: 'zh-CN',
            indexing_enabled: false,
            translations: { en: { title: 'English title', description: 'English description' } },
            google_verification_token: null,
            verification_domain: null,
            primary_domain: 'demo.example.com',
            version: 1,
            locales: [
                { value: 'zh-CN', label: '简体中文 · zh-CN' },
                { value: 'en', label: '英语 · en' },
                { value: 'ja', label: '日语 · ja' }
            ],
            ...overrides
        },
        preferences,
        requests: [],
        failSave: false,
        failContext: false,
        waitForContext: null,
        translationContext: {
            available: true, source_locale: 'zh-CN',
            settings: { target_locales: ['en', 'ja'], is_enabled: false }
        }
    }
    const module = { exports: {} }
    vm.runInNewContext(javascript, {
        module,
        exports: module.exports,
        AbortController,
        localStorage: { getItem: key => preferences.get(key), setItem: (key, value) => preferences.set(key, value) },
        require(name) {
            if (name === 'vue') return { ...Vue, onMounted() {}, onBeforeUnmount() {} }
            if (name === '@/utils/perm') return { hasPermission: () => true }
            if (name === '@/utils/cache')
                return {
                    default: {
                        get: (key) => preferences.get(key),
                        set: (key, value) => preferences.set(key, value)
                    }
                }
            if (name === '../../services/message')
                return {
                    useMmProTable: () => ({ proTableBindings: {}, reload: async () => {} }),
                    message: { success() {}, error() {} }
                }
            if (name === '@/api/agent/tenantSeo')
                return {
                    getTenantSeoDetail: async () => structuredClone(fixture.detail),
                    getSeoTranslationContext: async () => {
                        if (fixture.failContext) throw new Error('fixture configuration unavailable')
                        const result = structuredClone(fixture.translationContext)
                        if (fixture.waitForContext) await fixture.waitForContext
                        return result
                    },
                    saveTenantSeo: async (input) => {
                        fixture.requests.push(JSON.parse(JSON.stringify(input)))
                        if (fixture.failSave) throw new Error('fixture conflict')
                        fixture.detail = {
                            ...fixture.detail,
                            ...JSON.parse(JSON.stringify(input)),
                            version: fixture.detail.version + 1
                        }
                        return { changed: true, version: fixture.detail.version }
                    }
                }
            return {}
        }
    })
    const state = module.exports.default.setup({
        canEdit: true, fullPage: false,
        load: async () => structuredClone(fixture.detail),
        save: async input => {
            fixture.requests.push(JSON.parse(JSON.stringify(input)))
            if (fixture.failSave) throw new Error('fixture conflict')
            fixture.detail = { ...fixture.detail, ...JSON.parse(JSON.stringify(input)), version: fixture.detail.version + 1 }
            return { changed: true, version: fixture.detail.version }
        },
        translation: {
            loadContext: async () => {
                if (fixture.failContext) throw new Error('fixture configuration unavailable')
                const result = structuredClone(fixture.translationContext)
                if (fixture.waitForContext) await fixture.waitForContext
                return result
            },
        },
    }, { expose() {}, emit() {} })
    fixture.open = async () => {
        state.visible.value = true
        await state.loadDetail()
        await new Promise((resolve) => setImmediate(resolve))
        assert.equal(state.loadFailed.value, false, 'fixture detail should load')
        assert.equal(state.loading.value, false)
    }
    return { state, fixture }
}

test('main SEO editor counts only configured target-language drafts', async () => {
    const { state, fixture } = seoEditorFixture({
        translations: {
            'zh-CN': { title: 'Source title', description: 'Source description' },
            en: { title: 'English draft', description: '' }
        }
    })
    await fixture.open()
    assert.equal(state.translationCountLabel.value, '已配置 0/2')
    assert.equal(state.dirty.value, false)
    state.locale.value = 'en'
    state.description.value = 'English description'
    assert.equal(state.translationCountLabel.value, '已配置 1/2')
    state.description.value = ''
    assert.equal(state.translationCountLabel.value, '已配置 0/2')
})

test('main SEO editor receives configuration changes from the multilingual dialog immediately', async () => {
    const { state, fixture } = seoEditorFixture()
    await fixture.open()
    assert.equal(state.translationCountLabel.value, '已配置 1/2')
    state.updateTranslationContext({ available: true, settings: { target_locales: ['en'] } })
    assert.equal(state.translationCountLabel.value, '已配置 1/1')
    state.updateTranslationContext({ available: true, settings: { target_locales: [] } })
    assert.equal(state.translationCountLabel.value, '已配置 0/0')
    assert.equal(state.draft.value.translations.en.title, 'English title')
    assert.match(source, /@context-change="updateTranslationContext"/)
})

test('translation configuration failures do not prevent editing SEO or show a misleading count', async () => {
    const { state, fixture } = seoEditorFixture()
    fixture.failContext = true
    await fixture.open()
    assert.equal(state.translationCountLabel.value, '翻译配置读取失败')
    assert.equal(state.title.value, 'English title')
    assert.equal(state.loadFailed.value, false)
})

test('late translation-context responses cannot overwrite dialog changes or a closed editor', async () => {
    let release
    const { state, fixture } = seoEditorFixture()
    fixture.waitForContext = new Promise(resolve => { release = resolve })
    await fixture.open()
    assert.equal(state.translationCountLabel.value, '正在读取翻译配置')
    state.updateTranslationContext({ available: true, settings: { target_locales: ['en'] } })
    release()
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(state.translationCountLabel.value, '已配置 1/1')
    fixture.waitForContext = new Promise(resolve => { release = resolve })
    state.requestClose()
    await fixture.open()
    state.requestClose()
    release()
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(state.translationContext.value, null)
    assert.equal(state.detail.value, null)
})

test('reopening existing English-only SEO selects English instead of an empty default language', async () => {
    const { state, fixture } = seoEditorFixture()
    await fixture.open()
    assert.equal(state.locale.value, 'en')
    assert.equal(state.title.value, 'English title')
    assert.equal(state.description.value, 'English description')
    assert.equal(state.draft.value.default_locale, 'zh-CN')
    assert.equal(state.dirty.value, false)
    state.requestClose()
    await fixture.open()
    assert.equal(state.locale.value, 'en')
    assert.equal(state.title.value, 'English title')
    assert.equal(fixture.requests.length, 0)
})

test('successful save restores the editing language across new page instances without changing SEO default', async () => {
    const translations = {
        'zh-CN': { title: '中文标题', description: '中文描述' },
        en: { title: 'English title', description: 'English description' }
    }
    const { state, fixture } = seoEditorFixture({ translations })
    await fixture.open()
    assert.equal(state.locale.value, 'zh-CN')
    state.locale.value = 'en'
    state.title.value = 'Updated English title'
    await state.save()
    assert.equal(fixture.requests[0].default_locale, 'zh-CN')
    assert.equal(fixture.preferences.get('tenant_seo_editing_locale:900002:910002'), 'en')
    const reopened = seoEditorFixture(fixture.detail, fixture.preferences)
    await reopened.fixture.open()
    assert.equal(reopened.state.locale.value, 'en')
    assert.equal(reopened.state.title.value, 'Updated English title')
})

test('language preferences are site-scoped and stale or empty choices fall back to configured content', async () => {
    const preferences = new Map([['tenant_seo_editing_locale:900002:910002', 'en']])
    const other = seoEditorFixture(
        {
            site_id: '910003',
            translations: {
                'zh-CN': { title: '另一个站点', description: '站点描述' },
                en: { title: 'Other site', description: 'Other description' }
            }
        },
        preferences
    )
    await other.fixture.open()
    assert.equal(other.state.locale.value, 'zh-CN')
    for (const preferred of ['unsupported', 'ja']) {
        preferences.set('tenant_seo_editing_locale:900002:910002', preferred)
        const next = seoEditorFixture({}, preferences)
        await next.fixture.open()
        assert.equal(next.state.locale.value, 'en')
    }
    const empty = seoEditorFixture({ translations: {} }, preferences)
    await empty.fixture.open()
    assert.equal(empty.state.locale.value, 'zh-CN')
    const partial = seoEditorFixture({
        translations: { en: { title: 'Draft title', description: '' } }
    })
    await partial.fixture.open()
    assert.equal(partial.state.locale.value, 'en')
})

test('failed saves and cancelled edits do not persist a new editing language', async () => {
    const { state, fixture } = seoEditorFixture({
        translations: {
            'zh-CN': { title: '中文标题', description: '中文描述' },
            en: { title: 'English title', description: 'English description' }
        }
    })
    await fixture.open()
    state.locale.value = 'en'
    state.title.value = 'Unsaved English title'
    fixture.failSave = true
    await state.save()
    assert.equal(state.saveFailed.value, true)
    assert.equal(state.title.value, 'Unsaved English title')
    assert.equal(fixture.preferences.size, 0)
    state.requestClose()
    assert.equal(state.confirmClose.value, true)
    state.discard()
    await fixture.open()
    assert.equal(state.locale.value, 'zh-CN')
    assert.equal(fixture.preferences.size, 0)
})
