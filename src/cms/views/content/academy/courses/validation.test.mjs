import assert from 'node:assert/strict'
import test from 'node:test'
import { validateCourse, courseFieldErrors } from './validation.ts'

const categories = [
    { id: '1', is_enabled: true, difficulty_levels: [1, 2] },
    { id: '2', is_enabled: false, difficulty_levels: [1] },
    { id: '3', is_enabled: true, difficulty_levels: [3] }
]
const form = (changes = {}) => ({
    title: '课程',
    category_ids: ['1'],
    summary: '',
    body_html: '<p>正文</p>',
    cover_url: '',
    seo_description: '',
    difficulty_level: 1,
    sort_order: 10,
    is_enabled: true,
    scheduled_local: '',
    ...changes
})
const now = new Date('2026-10-28T12:00:00+08:00').getTime()
const validate = (changes, status = 'published') =>
    validateCourse(form(changes), categories, status, now)

test('valid publish and draft pass without requiring optional cover or summary', () => {
    assert.deepEqual(validate({}), {})
    assert.deepEqual(
        validate(
            { category_ids: [], body_html: '', difficulty_level: '' },
            'draft'
        ),
        {}
    )
})

test('collects all missing publish fields; draft still requires title and sort', () => {
    const empty = {
        title: '  ',
        sort_order: null,
        category_ids: [],
        body_html: '<p><br></p>',
        difficulty_level: ''
    }
    assert.deepEqual(
        Object.keys(validate(empty)).sort(),
        [
            'title',
            'sort_order',
            'category_ids',
            'body_html',
            'difficulty_level'
        ].sort()
    )
    assert.deepEqual(Object.keys(validate(empty, 'draft')).sort(), ['sort_order', 'title'])
})

test('recomputes errors as fields are corrected and validates numeric bounds', () => {
    assert.ok(validate({ title: '' }).title)
    assert.equal(validate({ title: '已填写' }).title, undefined)
    for (const sort_order of [-1, 1.2, 2147483648, NaN])
        assert.ok(validate({ sort_order }).sort_order)
    assert.equal(validate({ sort_order: 0 }).sort_order, undefined)
    for (const difficulty_level of [0, -1, 1.5, 4])
        assert.ok(validate({ difficulty_level }).difficulty_level)
})

test('category availability is enforced independently of course difficulty', () => {
    assert.ok(validate({ category_ids: ['missing'] }, 'draft').category_ids)
    assert.ok(validate({ category_ids: ['2'] }).category_ids)
    assert.deepEqual(validate({ category_ids: ['2'] }, 'draft'), {})
    for (const difficulty_level of [1, 2, 3]) {
        for (const status of ['draft', 'published', 'scheduled']) {
            assert.deepEqual(validate({ category_ids: ['1', '3'], difficulty_level, scheduled_local: '2099-01-01T00:00:00Z' }, status), {})
        }
    }
})

test('empty rich text, image-only and non-content markup do not satisfy body requirement', () => {
    for (const body_html of [
        '',
        '<p><br></p>',
        '<p>&nbsp;&#160;&#xA0; </p>',
        '<img src="/a.png">',
        '<!-- text --><script>alert(1)</script>'
    ]) {
        assert.ok(validate({ body_html }).body_html, body_html)
    }
    assert.equal(validate({ body_html: '<p>&lt;示例&gt;</p>' }).body_html, undefined)
})

test('scheduled publish requires a future date, but draft ignores scheduling', () => {
    for (const scheduled_local of [
        '',
        'bad-date',
        '2026-10-28T03:00:00Z',
        '2026-10-28T04:00:00Z'
    ]) {
        assert.ok(validate({ scheduled_local }, 'scheduled').scheduled_local)
    }
    assert.deepEqual(validate({ scheduled_local: '2026-10-28T04:01:00Z' }, 'scheduled'), {})
    assert.deepEqual(validate({ scheduled_local: 'bad-date' }, 'draft'), {})
})

test('cover address and text limits are reported on their own fields', () => {
    for (const cover_url of [
        'javascript:alert(1)',
        '//other.example/a.png',
        '/a b.png',
        '/a\\b.png'
    ])
        assert.ok(validate({ cover_url }).cover_url)
    for (const cover_url of ['/storage/a.png', 'https://example.com/a.png'])
        assert.equal(validate({ cover_url }).cover_url, undefined)
    assert.ok(
        validate({
            title: '字'.repeat(256),
            summary: 'a'.repeat(10001),
            seo_description: 'a'.repeat(2001)
        }).seo_description
    )
    assert.equal(validate({ title: '字'.repeat(255) }).title, undefined)
})

test('server fields and nested category indexes map to the editor fields', () => {
    assert.deepEqual(
        courseFieldErrors({
            errors: {
                title: ['标题不正确'],
                'category_ids.0': ['分类不可用'],
                scheduled_at: ['时间已过期']
            }
        }),
        {
            fields: {
                title: '标题不正确',
                category_ids: '分类不可用',
                scheduled_local: '时间已过期'
            },
            general: ''
        }
    )
    assert.deepEqual(
        courseFieldErrors({ errors: { academy: ['发布课程需要填写正文和课程难度'] } }).fields,
        { body_html: '发布课程需要填写正文和课程难度' }
    )
})

test('conflicts and unknown errors are not attributed to unrelated form fields', () => {
    assert.deepEqual(
        courseFieldErrors({ errors: { academy: ['资料已被其他人修改，请重新打开后编辑'] } }),
        { fields: {}, general: '资料已被其他人修改，请重新打开后编辑' }
    )
    assert.deepEqual(courseFieldErrors(new Error('网络不可用')), {
        fields: {},
        general: '网络不可用'
    })
})
