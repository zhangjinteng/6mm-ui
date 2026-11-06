import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { parse, compileScript, compileTemplate } from '@vue/compiler-sfc'

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
    assert.match(source, /cmsSources\.bindTable\(useMmProTable/)
    assert.doesNotMatch(source, /onMounted\(loadMetadata\)|metadata\.value = await get\w+Metadata/)
    assert.match(source, /#cell-cms_source_type/)
    assert.match(source, /Object\.entries\(filters\)/)
    assert.doesNotMatch(source, /appendToUserRows|createContractSourceColumns/)
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
