import type {
    TranslationDetail,
    TranslationEdit,
    TranslationField,
    TranslationJob
} from '../../../../api/content/translations'

export const percent = (done: number, total: number) =>
    total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
export const valueKey = (field: string, locale: string) => `${field}:${locale}`
export function editsFor(
    detail: TranslationDetail | undefined,
    values: Record<string, string>
): TranslationEdit[] {
    if (!detail) return []
    return detail.fields.flatMap((field) =>
        field.translations.flatMap((value) => {
            const text = values[valueKey(field.key, value.locale)] ?? value.text
            return text === value.text
                ? []
                : [
                      {
                          field_name: field.key,
                          locale: value.locale,
                          text,
                          source_hash: field.source_hash,
                          row_version: value.row_version
                      }
                  ]
        })
    )
}
export function valuesFor(detail: TranslationDetail): Record<string, string> {
    return Object.fromEntries(
        detail.fields.flatMap((field) =>
            field.translations.map((value) => [valueKey(field.key, value.locale), value.text])
        )
    )
}
export function fieldDone(field?: TranslationField): number {
    return field?.translations.filter((value) => value.status === 'ready').length ?? 0
}
export const jobActive = (job?: TranslationJob | null) =>
    !!job && ['queued', 'running'].includes(job.status)
export const jobLabels: Record<string, string> = {
    queued: '等待处理',
    running: '翻译中',
    succeeded: '翻译完成',
    partial_failed: '部分未完成',
    failed: '翻译未完成',
    cancelled: '已取消'
}
export const publishLabels: Record<string, string> = {
    draft: '草稿',
    scheduled: '定时发布',
    published: '已发布'
}
export function readableError(error: unknown): string {
    if (error && typeof error === 'object') {
        const e = error as { msg?: string; message?: string; errors?: Record<string, string[]> }
        return (
            Object.values(e.errors || {}).flat()[0] || e.msg || e.message || '操作失败，请稍后重试'
        )
    }
    return '操作失败，请稍后重试'
}
