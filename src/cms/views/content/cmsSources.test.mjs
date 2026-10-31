import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'
import ts from 'typescript'

const pages = [
    'news/categories/index.vue', 'news/list/index.vue',
    'academy/categories/CategoryTable.vue', 'academy/courses/index.vue',
    'help/categories/index.vue', 'help/articles/index.vue',
    'announcement/categories/index.vue', 'announcement/list/index.vue', 'feedback/list/index.vue'
]
for (const page of pages) test(`${page} compiles with shared CMS columns and source filters`, () => {
    const source = readFileSync(new URL(page, import.meta.url), 'utf8')
    const { descriptor, errors } = parse(source)
    assert.deepEqual(errors, [])
    assert.doesNotThrow(() => compileScript(descriptor, { id: page }))
    assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: page, id: page }).errors, [])
    assert.match(source, /\.\.\.createCmsSourceColumns\(\)/)
    assert.match(source, /\.\.\.cmsSources\.fields/)
    assert.match(source, /cmsSources\.bindFilters\(cmsSourceFilters\)/)
    assert.match(source, /#cell-cms_source_type/)
    assert.match(source, /Object\.entries\(filters\)/)
    assert.doesNotMatch(source, /appendToUserRows|createContractSourceColumns/)
})

test('shared fields load tenant nicknames, filter by ID and clear tenant when platform is selected', async () => {
    let mounted, unmounted, changed
    const module = { exports: {} }
    const source = readFileSync(new URL('cmsSources.ts', import.meta.url), 'utf8')
    const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText
    const vue = { reactive: value => value, onMounted: callback => { mounted = callback },
        onBeforeUnmount: callback => { unmounted = callback }, watch: (_get, callback) => { changed = callback } }
    new Function('require', 'module', 'exports', code)(name => name.includes('runtime') ? { useCmsRuntime: () => ({ mode: 'platform' }) } : vue, module, module.exports)
    assert.deepEqual(module.exports.createCmsSourceColumns().map(c => c.title), ['来源昵称', '来源类型'])
    const hook = module.exports.useCmsSourceFields(async () => ({ cms_source_options: [{ value: '10', label: '白标昵称甲' }] }))
    await mounted()
    assert.equal(hook.fields[1].filterable, true)
    assert.deepEqual(hook.fields[1].options[1], { value: '10', label: '白标昵称甲' })
    assert.equal(hook.fields[0].type, 'segmented')
    assert.equal(hook.fields[0].label, '来源类型')
    assert.equal(hook.fields[0].width, 200)
    assert.equal(hook.fields[0].defaultValue, '')
    assert.deepEqual(hook.fields[0].options.map(o => o.label), ['全部', '平台', '白标'])
    assert.deepEqual(hook.fields[0].options.map(o => o.value), ['', 'platform', 'white_label'])
    const filters = { value: { cms_source_type: 'white_label', cms_tenant_id: '10' } }
    hook.bindFilters(filters)
    changed('platform')
    assert.equal(filters.value.cms_tenant_id, '')
    assert.equal(hook.fields[1].disabled, true)
    changed('white_label')
    assert.equal(hook.fields[1].disabled, false)
    unmounted()
})

test('feedback ownership fields do not overwrite submitting user snapshots', () => {
    const source = readFileSync(new URL('feedback/list/index.vue', import.meta.url), 'utf8')
    assert.match(source, /用户来源类型/)
    assert.match(source, /用户来源名称/)
    assert.match(source, /source_name_snapshot/)
    assert.match(source, /\.\.\.createCmsSourceColumns/)
})

for (const [page, module] of [['news/list/ArticleEditor.vue', 'News'], ['help/articles/ArticleEditor.vue', 'Help'],
    ['announcement/list/ArticleEditor.vue', 'Announcement'], ['academy/courses/CourseEditor.vue', 'Academy']]) {
    test(`${page} scopes category metadata to the record space`, () => {
        const source = readFileSync(new URL(page, import.meta.url), 'utf8')
        const { descriptor } = parse(source)
        assert.doesNotThrow(() => compileScript(descriptor, { id: page }))
        assert.match(source, /cms_source_type: 'platform'/)
        assert.match(source, /editorSourceName\.value = String\(data.cms_source_name/)
        assert.match(source, new RegExp(`get${module}Metadata\\(current.signal, \\{ space_id: String\\(data.space_id\\)`))
    })
}
