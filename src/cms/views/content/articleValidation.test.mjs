import assert from 'node:assert/strict'
import test from 'node:test'
import { validateArticle, articleFieldErrors } from './articleValidation.ts'

const categories = [
    { id: '1', effective_enabled: true },
    { id: '2', effective_enabled: false }
]
const form = (extra = {}) => ({
    title: '标题',
    category_id: '1',
    body_html: '<p>正文</p>',
    summary: '',
    seo_description: '',
    cover_url: '',
    content_source: '',
    author_name: '',
    sort_order: 10,
    is_enabled: true,
    scheduled_local: '',
    ...extra
})
for (const module of ['news', 'help', 'announcement']) {
    const validate = (extra, status = 'published') =>
        validateArticle(form(extra), categories, module, status, 1000)
    test(`${module}: collect required fields and allow incomplete drafts`, () => {
        assert.deepEqual(validate({}), {})
        assert.deepEqual(
            Object.keys(validate({ title: '', category_id: '', body_html: '' })).sort(),
            ['body_html', 'category_id', 'title']
        )
        assert.deepEqual(validate({ category_id: '', body_html: '' }, 'draft'), {})
        assert.ok(validate({ category_id: '2' }).category_id)
        assert.ok(validate({ category_id: 'missing' }, 'draft').category_id)
    })
    test(`${module}: optional field limits and schedule`, () => {
        assert.ok(validate({ sort_order: -1 }).sort_order)
        assert.ok(validate({ sort_order: null }).sort_order)
        assert.ok(validate({ scheduled_local: 'bad' }, 'scheduled').scheduled_local)
        assert.deepEqual(validate({ scheduled_local: '2099-01-01T00:00:00Z' }, 'scheduled'), {})
        assert.ok(validate({ cover_url: 'javascript:alert(1)' }).cover_url)
        assert.deepEqual(validate({ cover_url: '/storage/a.png' }), {})
        assert.ok(validate({ seo_description: 'a'.repeat(2001) }).seo_description)
        for (const body_html of [
            '<p><br></p>',
            '<p>&nbsp;</p>',
            '<img src="/a.png">',
            '<script>text</script>'
        ])
            assert.ok(validate({ body_html }).body_html)
    })
    test(`${module}: map server fields, nested fields, and general errors separately`, () => {
        assert.deepEqual(
            articleFieldErrors(
                {
                    errors: {
                        title: ['标题错误'],
                        scheduled_at: ['日期错误'],
                        'related_content_ids.0': ['关联错误']
                    }
                },
                module
            ),
            {
                fields: {
                    title: '标题错误',
                    scheduled_local: '日期错误',
                    related_content_ids: '关联错误'
                },
                general: ''
            }
        )
        assert.deepEqual(articleFieldErrors(new Error('网络错误'), module), {
            fields: {},
            general: '网络错误'
        })
        const label = { news: '新闻', help: '文章', announcement: '公告' }[module]
        assert.deepEqual(
            articleFieldErrors({ errors: { [module]: [`发布${label}必须选择分类`] } }, module)
                .fields,
            { category_id: `发布${label}必须选择分类` }
        )
    })
}
