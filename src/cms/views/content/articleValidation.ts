export interface ArticleForm {
    title: string
    category_id: string
    summary: string
    body_html: string
    seo_description: string
    cover_url: string
    content_source: string
    author_name: string
    sort_order: number | null
    is_enabled: boolean
    scheduled_local: string
    search_keywords?: string
    helpful_enabled?: boolean
    related_content_ids?: string[]
}
export type ArticleField = keyof ArticleForm
export type ArticleErrors = Partial<Record<ArticleField, string>>
export type ArticleModule = 'news' | 'help' | 'announcement'
export const articleLabels = { news: '新闻', help: '文章', announcement: '公告' }
export const articleFields: ArticleField[] = [
    'category_id',
    'title',
    'body_html',
    'sort_order',
    'summary',
    'seo_description',
    'cover_url',
    'content_source',
    'author_name',
    'is_enabled',
    'scheduled_local',
    'search_keywords',
    'helpful_enabled',
    'related_content_ids'
]
interface Category {
    id: string
    effective_enabled: boolean
}

export function validateArticle(
    form: ArticleForm,
    categories: Category[],
    module: ArticleModule,
    status: 'draft' | 'published' | 'scheduled',
    now = Date.now()
): ArticleErrors {
    const errors: ArticleErrors = {}
    const label = articleLabels[module]
    if (!form.title.trim()) errors.title = `请填写${label}标题`
    for (const [field, max, name] of [
        ['title', 255, `${label}标题`],
        ['summary', 10000, '摘要'],
        ['body_html', 1000000, '正文'],
        ['seo_description', 2000, 'SEO 描述'],
        ['cover_url', 2048, '封面地址'],
        ['content_source', 160, '内容来源'],
        ['author_name', 120, '作者署名'],
        ['search_keywords', 2000, '搜索关键词']
    ] as const) {
        if ([...(form[field] || '')].length > max) errors[field] = `${name}不能超过 ${max} 个字符`
    }
    if (
        form.sort_order === null ||
        !Number.isInteger(form.sort_order) ||
        form.sort_order < 0 ||
        form.sort_order > 2147483647
    )
        errors.sort_order = '请填写 0–2147483647 之间的整数'
    if (form.cover_url) {
        let valid = !/[\x00-\x20\\]/.test(form.cover_url)
        if (!(form.cover_url.startsWith('/') && !form.cover_url.startsWith('//'))) {
            try {
                valid &&=
                    /^https?:\/\//i.test(form.cover_url) &&
                    ['http:', 'https:'].includes(new URL(form.cover_url).protocol)
            } catch {
                valid = false
            }
        }
        if (!valid) errors.cover_url = '封面地址必须为 HTTP(S) 或站内绝对路径'
    }
    const category = categories.find((c) => c.id === form.category_id)
    if (form.category_id && !category) errors.category_id = '所选分类已不可用，请重新选择'
    if (status !== 'draft') {
        if (!form.category_id) errors.category_id = `请选择${label}分类`
        else if (category && !category.effective_enabled)
            errors.category_id = `发布${label}的分类及父分类必须已启用`
        const text = form.body_html
            .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, ' ')
            .trim()
        if (!text) errors.body_html = `请填写${label}正文`
    }
    if ((form.related_content_ids?.length || 0) > 20)
        errors.related_content_ids = `相关${label}最多选择 20 篇`
    if (status === 'scheduled') {
        const time = new Date(form.scheduled_local).getTime()
        if (!Number.isFinite(time) || time <= now)
            errors.scheduled_local = '计划发布时间必须晚于当前时间'
    }
    return errors
}

export function articleFieldErrors(error: unknown, module: ArticleModule) {
    const fields: ArticleErrors = {}
    const general: string[] = []
    const label = articleLabels[module]
    const legacy: Record<string, ArticleField> = {
        [`${label}标题不能为空`]: 'title',
        [`发布${label}必须选择分类`]: 'category_id',
        [`发布${label}的分类及父分类必须已启用`]: 'category_id',
        [`发布${label}需要填写正文`]: 'body_html',
        '封面地址必须为 HTTP(S) 或站内绝对路径': 'cover_url',
        计划发布时间必须晚于当前时间: 'scheduled_local'
    }
    const value =
        error && typeof error === 'object'
            ? (error as { errors?: Record<string, unknown>; msg?: string; message?: string })
            : {}
    for (const [key, messages] of Object.entries(value.errors || {})) {
        const name = key.split('.')[0]
        const field = name === 'scheduled_at' ? 'scheduled_local' : name
        for (const message of Array.isArray(messages) ? messages : [messages]) {
            if (typeof message !== 'string' || !message) continue
            const target = articleFields.includes(field as ArticleField)
                ? (field as ArticleField)
                : key === module
                  ? legacy[message]
                  : undefined
            if (target) fields[target] ||= message
            else general.push(message)
        }
    }
    return {
        fields,
        general:
            general.join('；') ||
            (Object.keys(fields).length ? '' : value.msg || value.message || '操作失败，请稍后重试')
    }
}
