import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { compileScript, compileTemplate, parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import * as Vue from 'vue'
import {
    editsFor,
    fieldDone,
    jobActive,
    percent,
    readableError,
    valueKey,
    valuesFor
} from './model.ts'

const detail = () => ({
    id: '1',
    space_id: '7',
    title: '源标题',
    done: 1,
    total: 6,
    fields: [
        {
            key: 'title',
            label: '标题',
            max_length: 255,
            source: '源标题',
            source_hash: 'hash-title',
            translatable: true,
            translations: [
                { locale: 'en', text: 'Title', row_version: '3', status: 'ready' },
                { locale: 'ja', text: '', row_version: '0', status: 'missing' }
            ]
        },
        {
            key: 'body_html',
            label: '正文',
            max_length: 1000000,
            source: '<p>正文</p>',
            source_hash: 'hash-body',
            translatable: true,
            translations: [{ locale: 'en', text: '<p>Body</p>', row_version: '5', status: 'stale' }]
        }
    ]
})

test('collect only edited fields with their original source hash and target version', () => {
    const d = detail(),
        values = valuesFor(d)
    assert.deepEqual(editsFor(d, values), [])
    values[valueKey('title', 'ja')] = 'タイトル'
    assert.deepEqual(editsFor(d, values), [
        {
            field_name: 'title',
            locale: 'ja',
            text: 'タイトル',
            source_hash: 'hash-title',
            row_version: '0'
        }
    ])
    assert.equal(values[valueKey('body_html', 'en')], '<p>Body</p>')
    assert.equal(fieldDone(d.fields[0]), 1)
    assert.equal(fieldDone(d.fields[1]), 0)
})

test('zero denominator is safe and progress is capped; only active tasks poll', () => {
    assert.equal(percent(0, 0), 0)
    assert.equal(percent(1, 3), 33)
    assert.equal(percent(20, 10), 100)
    assert.equal(jobActive(null), false)
    for (const status of ['queued', 'running']) assert.equal(jobActive({ status }), true)
    for (const status of ['failed', 'succeeded', 'partial_failed', 'cancelled'])
        assert.equal(jobActive({ status }), false)
    assert.equal(readableError({ errors: { translation: ['版本冲突'] } }), '版本冲突')
})

const source = readFileSync(new URL('index.vue', import.meta.url), 'utf8')
const { descriptor, errors } = parse(source)
test('page compiles and uses installed 6mm components, not unsupported controls or unsafe HTML preview', () => {
    assert.deepEqual(errors, [])
    assert.doesNotThrow(() => compileScript(descriptor, { id: 'translation-test' }))
    assert.deepEqual(
        compileTemplate({
            source: descriptor.template.content,
            filename: 'index.vue',
            id: 'translation-test'
        }).errors,
        []
    )
    for (const component of [
        'MmButton',
        'MmSelect',
        'MmProgress',
        'MmTabs',
        'MmTabPane',
        'MmDialog',
        'MmForm',
        'MmInput',
        'MmCheckbox'
    ])
        assert.match(source, new RegExp(`<${component}\\b`))
    assert.doesNotMatch(source, /v-html|MmSwitch|localStorage/)
    assert.match(source, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
})

const script = compileScript(descriptor, { id: 'translation-test', inlineTemplate: true }).content
const transpile = (s) =>
    ts.transpileModule(s, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
    }).outputText
const modelModule = { exports: {} }
new Function(
    'require',
    'module',
    'exports',
    transpile(readFileSync(new URL('model.ts', import.meta.url), 'utf8'))
)(() => {}, modelModule, modelModule.exports)
const node = (type, text = '') => ({ type, text, props: {}, children: [], parent: null })
const renderer = Vue.createRenderer({
    createElement: node,
    createText: (t) => node('#text', t),
    createComment: (t) => node('#comment', t),
    setText: (n, t) => (n.text = t),
    setElementText: (n, t) => {
        n.text = t
        n.children = []
    },
    parentNode: (n) => n?.parent,
    nextSibling: (n) => n.parent?.children[n.parent.children.indexOf(n) + 1],
    patchProp: (n, k, _, v) => (n.props[k] = v),
    insert(n, p, a) {
        if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1)
        n.parent = p
        const i = a ? p.children.indexOf(a) : -1
        p.children.splice(i < 0 ? p.children.length : i, 0, n)
    },
    remove(n) {
        if (n.parent) n.parent.children.splice(n.parent.children.indexOf(n), 1)
        n.parent = null
    }
})
const walk = (n) => [n, ...n.children.flatMap(walk)]
const text = (n) => [n.text, ...n.children.map(text)].join('')
const flush = async () => {
    for (let i = 0; i < 15; i++) {
        await Promise.resolve()
        await Vue.nextTick()
    }
}
function mount(overrides = {}) {
    const calls = [],
        modules = ['news', 'academy', 'help', 'announcement'].flatMap((module) =>
            ['content', 'category'].map((kind) => ({
                key: `${module}:${kind}`,
                module,
                kind,
                label: kind === 'content' ? module : '分类',
                count: 2,
                available: true
            }))
        )
    const metadata = {
        spaces: [{ id: '7', label: 'Platform', is_enabled: true }],
        space_id: '7',
        space_enabled: true,
        source_locale: 'zh-CN',
        target_locales: ['en', 'ja'],
        locales: [
            { code: 'en', native: 'English', label: '英语', total: 4, done: 0 },
            { code: 'ja', native: '日本語', label: '日语', total: 4, done: 0 }
        ],
        modules,
        done: 0,
        total: 8
    }
    const api = {
        getTranslationMetadata: async () => metadata,
        getTranslationList: async (...args) => {
            calls.push(['list', ...args])
            return { lists: [detail(), { ...detail(), id: '2', title: '第二篇' }], count: 2 }
        },
        getTranslationDetail: async (scope, id, signal) => {
            calls.push(['detail', scope, id, signal])
            return { ...detail(), id }
        },
        saveTranslations: async (...args) => {
            calls.push(['save', ...args])
            return detail()
        },
        getTranslationJob: async () => ({ job: null }),
        ...overrides
    }
    const ui = Object.fromEntries(
        [
            'MmAlert',
            'MmButton',
            'MmCheckbox',
            'MmEmpty',
            'MmForm',
            'MmFormItem',
            'MmIcon',
            'MmInput',
            'MmInputNumber',
            'MmProgress',
            'MmSelect',
            'MmTabPane',
            'MmTabs',
            'MmTag'
        ].map((name) => [
            name,
            Vue.defineComponent({
                name,
                inheritAttrs: false,
                setup:
                    (_, { attrs, slots }) =>
                    () =>
                        Vue.h(name, attrs, [slots.default?.(), slots.icon?.()])
            })
        ])
    )
    ui.MmDialog = Vue.defineComponent({
        props: ['modelValue'],
        setup:
            (p, { attrs, slots }) =>
            () =>
                p.modelValue
                    ? Vue.h('MmDialog', attrs, [slots.default?.(), slots.footer?.()])
                    : null
    })
    ui.message = { success() {} }
    const module = { exports: {} }
    new Function('require', 'module', 'exports', transpile(script))(
        (name) => {
            if (name === 'vue') return { ...Vue, withDirectives: (vnode) => vnode }
            if (name.endsWith('/runtime')) return { useCmsRuntime: () => ({ hasPermission: () => true }), onBeforeCmsLeave() {} }
            if (name.endsWith('/index')) return ui
            if (name.endsWith('/api/content/translations')) return { useTranslationsApi: () => api }
            if (name === 'vue-router') return { onBeforeRouteLeave() {} }
            if (name === '@work-gpt/6mm-ui') return ui
            if (name === '@/utils/perm') return { hasPermission: () => true }
            if (name === '@/api/content/translations') return api
            if (name === './model') return modelModule.exports
            throw new Error(name)
        },
        module,
        module.exports
    )
    const previousWindow = globalThis.window
    globalThis.window = { addEventListener() {}, removeEventListener() {} }
    const root = node('root'),
        app = renderer.createApp(module.exports.default)
    app.mount(root)
    return {
        calls,
        root,
        nodes: () => walk(root),
        button: (label) => walk(root).find((n) => n.type === 'MmButton' && text(n).includes(label)),
        cleanup() {
            app.unmount()
            globalThis.window = previousWindow
        }
    }
}

test('real page loads scoped content and renders target inputs without changing source', async () => {
    const v = mount()
    try {
        await flush()
        assert.equal(v.calls[0][1].space_id, '7')
        assert.ok(
            v.nodes().some((n) => n.type === 'textarea' && n.props.id === 'translation-title-ja')
        )
        assert.equal(v.button('保存翻译').props.disabled, true)
    } finally {
        v.cleanup()
    }
})

test('editing blocks a content switch until discard is confirmed; save carries only changes', async () => {
    const v = mount()
    try {
        await flush()
        const input = v
            .nodes()
            .find((n) => n.type === 'textarea' && n.props.id === 'translation-title-ja')
        input.props['onUpdate:modelValue']('訳文')
        await flush()
        assert.equal(v.button('保存翻译').props.disabled, false)
        await v.button('保存翻译').props.onClick()
        await flush()
        assert.deepEqual(v.calls.find((c) => c[0] === 'save').slice(1), [
            { space_id: '7', module: 'news', kind: 'content' },
            '1',
            [
                {
                    field_name: 'title',
                    locale: 'ja',
                    text: '訳文',
                    source_hash: 'hash-title',
                    row_version: '0'
                }
            ]
        ])
        const again = v
            .nodes()
            .find((n) => n.type === 'textarea' && n.props.id === 'translation-title-ja')
        again.props['onUpdate:modelValue']('新訳文')
        await flush()
        const row = v.nodes().find((n) => n.type === 'button' && text(n).includes('第二篇'))
        row.props.onClick()
        await flush()
        assert.equal(v.calls.filter((c) => c[0] === 'detail').length, 1)
        v.button('放弃修改并继续').props.onClick()
        await flush()
        assert.equal(v.calls.filter((c) => c[0] === 'detail').at(-1)[2], '2')
    } finally {
        v.cleanup()
    }
})

test('failed save retains edited text and exposes a recoverable error', async () => {
    const v = mount({
        saveTranslations: async () => {
            throw { errors: { translation: ['原文已变化'] } }
        }
    })
    try {
        await flush()
        v.nodes()
            .find((n) => n.type === 'textarea' && n.props.id === 'translation-title-ja')
            .props['onUpdate:modelValue']('Keep me')
        await flush()
        await v.button('保存翻译').props.onClick()
        await flush()
        assert.ok(text(v.root).includes('原文已变化'))
        assert.equal(v.button('保存翻译').props.disabled, false)
    } finally {
        v.cleanup()
    }
})
