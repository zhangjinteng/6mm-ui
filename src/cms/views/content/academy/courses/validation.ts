export interface CourseForm {
    title: string
    category_ids: string[]
    summary: string
    body_html: string
    cover_url: string
    seo_description: string
    difficulty_level: number | ''
    estimated_minutes: number | null
    sort_order: number | null
    is_enabled: boolean
    scheduled_local: string
}
export type CourseField = keyof CourseForm
export type CourseErrors = Partial<Record<CourseField, string>>
export const courseFields: CourseField[] = [
    'category_ids',
    'cover_url',
    'difficulty_level',
    'estimated_minutes',
    'sort_order',
    'is_enabled',
    'scheduled_local',
    'title',
    'summary',
    'body_html',
    'seo_description'
]
interface Category {
    id: string
    is_enabled: boolean
    difficulty_levels: number[]
}

function safeCoverUrl(value: string): boolean {
    if (/[\x00-\x20\\]/.test(value)) return false
    if (value.startsWith('/') && !value.startsWith('//')) return true
    try {
        const url = new URL(value)
        return /^https?:\/\//i.test(value) && ['http:', 'https:'].includes(url.protocol)
    } catch {
        return false
    }
}

function hasBodyText(html: string): boolean {
    // The server sanitizes HTML authoritatively; reject common empty editor markup locally.
    return (
        html
            .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;|&#0*(?:160|9|10|13|32);|&#x0*(?:a0|9|a|d|20);/gi, ' ')
            .trim().length > 0
    )
}

export function validateCourse(
    form: CourseForm,
    categories: Category[],
    status: 'draft' | 'published' | 'scheduled',
    now = Date.now()
): CourseErrors {
    const errors: CourseErrors = {}
    const publishing = status !== 'draft'
    if (!form.title.trim()) errors.title = '请填写课程标题'
    for (const [field, max, label] of [
        ['title', 255, '课程标题'],
        ['summary', 10000, '摘要'],
        ['body_html', 1000000, '正文'],
        ['seo_description', 2000, 'SEO 描述'],
        ['cover_url', 2048, '封面地址']
    ] as const) {
        if ([...form[field]].length > max) errors[field] = `${label}不能超过 ${max} 个字符`
    }
    if (
        form.sort_order === null ||
        !Number.isInteger(form.sort_order) ||
        form.sort_order < 0 ||
        form.sort_order > 2147483647
    ) {
        errors.sort_order = '请填写 0–2147483647 之间的整数'
    }
    if (form.cover_url && !safeCoverUrl(form.cover_url))
        errors.cover_url = '封面地址必须为 HTTP(S) 或站内绝对路径'
    const selected = form.category_ids.map((id) => categories.find((c) => c.id === id))
    if (publishing && !selected.length) errors.category_ids = '请选择课程分类'
    else if (selected.some((c) => !c)) errors.category_ids = '所选分类已不可用，请重新选择'
    else if (publishing && selected.some((c) => !c?.is_enabled))
        errors.category_ids = '发布课程必须选择已启用的分类'
    else if (selected.length > 50) errors.category_ids = '最多选择 50 个课程分类'
    if (publishing && !form.difficulty_level) errors.difficulty_level = '请选择课程难度'
    else if (form.difficulty_level !== '' && ![1, 2, 3].includes(form.difficulty_level))
        errors.difficulty_level = '请选择有效的课程难度'
    else if (
        form.difficulty_level &&
        selected.some((c) => c && !c.difficulty_levels.includes(Number(form.difficulty_level)))
    )
        errors.difficulty_level = '课程难度不在所选分类的适用范围内'
    if (publishing && form.estimated_minutes === null) errors.estimated_minutes = '请填写预计课时'
    else if (
        form.estimated_minutes !== null &&
        (!Number.isInteger(form.estimated_minutes) ||
            form.estimated_minutes < 1 ||
            form.estimated_minutes > 100000)
    )
        errors.estimated_minutes = '预计课时须为 1–100000 之间的整数'
    if (publishing && !hasBodyText(form.body_html)) errors.body_html = '请填写课程正文'
    if (status === 'scheduled') {
        const time = new Date(form.scheduled_local).getTime()
        if (!Number.isFinite(time) || time <= now)
            errors.scheduled_local = '计划发布时间必须晚于当前时间'
    }
    return errors
}

// Older endpoints group business validation under "academy"; retain their field association.
const legacyFields: Record<string, CourseField> = {
    课程标题不能为空: 'title',
    '封面地址必须为 HTTP(S) 或站内绝对路径': 'cover_url',
    计划发布时间必须晚于当前时间: 'scheduled_local',
    发布课程必须选择分类: 'category_ids',
    所选分类不存在或不属于当前学院模板: 'category_ids',
    '发布课程必须选择已启用的分类，存在已停用分类': 'category_ids',
    课程难度不在所选分类的适用范围内: 'difficulty_level',
    // Local validation already checks difficulty/minutes before a request is sent.
    '发布课程需要填写正文、课程难度及预计课时': 'body_html'
}

export function courseFieldErrors(error: unknown): { fields: CourseErrors; general: string } {
    const fields: CourseErrors = {}
    const general: string[] = []
    const value =
        error && typeof error === 'object'
            ? (error as { errors?: Record<string, unknown>; msg?: string; message?: string })
            : {}
    for (const [key, messages] of Object.entries(value.errors || {})) {
        const name = key.split('.')[0]
        const field = name === 'scheduled_at' ? 'scheduled_local' : name
        for (const message of Array.isArray(messages) ? messages : [messages]) {
            if (typeof message !== 'string' || !message) continue
            const target = courseFields.includes(field as CourseField)
                ? (field as CourseField)
                : key === 'academy'
                  ? legacyFields[message]
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
