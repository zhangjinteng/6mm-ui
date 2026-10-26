import { validatePredictionModel } from '../config/prediction/form'
import { secureRequestId } from '../grid/config/model'
import type { PredictionEditModel } from '../config/prediction/types'
export interface Receipt {
    operation_id: string
    client_request_id: string
    result: string
    [key: string]: unknown
}
export interface PendingWrite {
    action: string
    body: Record<string, unknown>
    state: 'submitting' | 'unverified'
    // Missing on legacy records: conservatively treat them as already attempted.
    attempted?: boolean
    // Incremented synchronously before every send, including reconstructed journals.
    attemptGeneration?: number
}
type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
const fields: Record<string, string[]> = { 'config.save': ['game_type','symbol','based_on_template_version','platform_template'] }
export function unwrapEnvelope<T>(value: unknown): T {
    const r = value as { code?: number; data?: unknown; msg?: string }
    if (!r || typeof r.code !== 'number') throw Error('服务响应格式异常')
    if (r.code === 1) return r.data as T
    const e = Object.assign(
        new Error(r.msg || '请求未成功'),
        r.data && typeof r.data === 'object' && !Array.isArray(r.data) ? r.data : {},
        { http_business_code: r.code },
        r.code === -1 ? { error_code: 'ERROR_CODE_UNAUTHENTICATED' } : {}
    )
    throw e
}
export function receiptFor(action: string, response: unknown): Receipt | undefined {
    const r = response as {
        receipt?: Receipt
        change?: { receipt?: Receipt }
        binding?: { receipt?: Receipt }
    }
    return action === 'routing.prepare' || action === 'routing.cancel'
        ? r?.change?.receipt
        : action === 'routing.commit'
          ? r?.binding?.receipt
          : r?.receipt
}
export class SubmissionJournal {
    private busy = false
    private readonly key: string
    private storage: StoragePort
    private action: string
    constructor(storage: StoragePort, actor: string, action: string, target: string) {
        if (!actor || !fields[action] || !target) throw Error('无法确认当前操作上下文')
        this.storage = storage
        this.action = action
        this.key = `prediction:pending:${encodeURIComponent(actor)}:${action}:${encodeURIComponent(target)}`
    }
    read(): PendingWrite | null {
        const raw = this.storage.getItem(this.key)
        if (!raw) return null
        const p = JSON.parse(raw) as PendingWrite
        if (
            p.action !== this.action ||
            !p.body ||
            typeof p.body !== 'object' ||
            !['submitting', 'unverified'].includes(p.state) ||
            (p.attempted !== undefined && typeof p.attempted !== 'boolean') ||
            (p.state === 'submitting' && p.attempted === false) ||
            (p.attemptGeneration !== undefined &&
                (!Number.isSafeInteger(p.attemptGeneration) ||
                    p.attemptGeneration < 0 ||
                    (p.attempted === false && p.attemptGeneration !== 0) ||
                    (p.attempted === true && p.attemptGeneration === 0) ||
                    (p.state === 'submitting' && p.attemptGeneration === 0)))
        )
            throw Error('上次操作记录无法读取，请先核验处理结果')
        this.validate(p.body)
        return p
    }
    private validate(body: Record<string, unknown>) {
        const allowed = [...fields[this.action], 'reason', 'client_request_id']
        if (
            Object.keys(body).some((k) => !allowed.includes(k)) ||
            typeof body.reason !== 'string' ||
            !body.reason.trim() ||
            body.reason.length > 500 ||
            typeof body.client_request_id !== 'string' ||
            !body.client_request_id ||
            body.client_request_id.length > 128
        )
            throw Error('操作记录字段无效')
        if (fields[this.action].some((k) => !Object.hasOwn(body, k)))
            throw Error('操作记录缺少必要字段')
        const text = (key: string) =>
            typeof body[key] === 'string' &&
            Boolean((body[key] as string).trim()) &&
            (body[key] as string).length <= 128
        if (this.action === 'config.save') {
            const template = body.platform_template as { enabled?: unknown; rules?: unknown }
            if (
                !['UP_DOWN', 'HIGH_LOW'].includes(String(body.game_type)) ||
                !text('symbol') ||
                !template ||
                typeof template.enabled !== 'boolean' ||
                !Array.isArray(template.rules)
            )
                throw Error('配置操作记录无效')
            const model = {
                game_type: body.game_type,
                symbol: body.symbol,
                based_on_template_version: body.based_on_template_version,
                enabled: template.enabled,
                rules: structuredClone(template.rules)
            } as PredictionEditModel
            // 校验副本补齐页面虚拟字段，原请求体保持不变以便 UNKNOWN 原号重试。
            if (model.game_type === 'UP_DOWN') {
                for (const rule of model.rules) {
                    const live = rule.stake_tiers?.find((tier) => !tier.retired)
                    if (live) {
                        rule.minimum_stake ??= live.minimum_stake
                        rule.maximum_stake ??= live.maximum_stake
                    }
                }
            }
            // New closed configurations ask the service to generate every identity.
            // Validate the frozen body as-is; never rebuild it during receipt recovery.
            const newIdentifiers = template.enabled === false && model.rules.every(rule =>
                rule.market_id === undefined && (rule.stake_tiers ?? []).every(tier => tier.stake_tier_id === undefined))
            if (validatePredictionModel(model, newIdentifiers).length) throw Error('配置操作记录无效')
        }
    }

    begin(body: Record<string, unknown>, id: string = secureRequestId()): void {
        if (this.read()) throw Error('上次操作结果尚未确定，请先核验原操作')
        const frozen = JSON.parse(JSON.stringify({ ...body, client_request_id: id }))
        this.validate(frozen)
        this.storage.setItem(
            this.key,
            JSON.stringify({
                action: this.action,
                body: frozen,
                state: 'unverified',
                attempted: false,
                attemptGeneration: 0
            })
        )
    }
    private ownsStoredIntent(pending: PendingWrite): boolean {
        const current = this.read()
        return current !== null && JSON.stringify(current.body) === JSON.stringify(pending.body)
    }
    async attempt(send: (body: Record<string, unknown>) => Promise<unknown>): Promise<unknown> {
        if (this.busy) throw Error('操作正在提交')
        const p = this.read()
        if (!p) throw Error('没有待核验操作')
        const previouslyAttempted = p.attempted !== false
        const nextGeneration = (p.attemptGeneration ?? 0) + 1
        if (!Number.isSafeInteger(nextGeneration)) throw Error('操作尝试记录无法继续核验')
        this.busy = true
        try {
            p.state = 'submitting'
            p.attempted = true
            p.attemptGeneration = nextGeneration
            this.storage.setItem(this.key, JSON.stringify(p))
            const response = await send(structuredClone(p.body)),
                receipt = receiptFor(this.action, response)
            if (
                typeof receipt?.operation_id !== 'string' ||
                !receipt.operation_id ||
                receipt.client_request_id !== p.body.client_request_id ||
                receipt.result !== 'OPERATION_RESULT_SUCCEEDED'
            )
                throw Error('未收到可核验的成功回执')
            if (this.ownsStoredIntent(p)) this.storage.removeItem(this.key)
            return response
        } catch (error) {
            const e = error as {
                error_code?: string
                control?: { submission_outcome?: string }
                detail?: { control?: { submission_outcome?: string } }
            }
            const current = this.read()
            if (!current || JSON.stringify(current.body) !== JSON.stringify(p.body)) throw error
            const explicitlyUnverified =
                current.attemptGeneration !== p.attemptGeneration ||
                e.control?.submission_outcome === 'UNVERIFIED' ||
                e.detail?.control?.submission_outcome === 'UNVERIFIED'
            // Config saves return this error only after a failed operation receipt is
            // recorded (including replay). It is a terminal rejection, not a timeout.
            const marketRejected = this.action === 'config.save' &&
                e.error_code === 'ERROR_CODE_MARK_PRICE_UNAVAILABLE' && !explicitlyUnverified
            const unverified = previouslyAttempted || explicitlyUnverified
            if (marketRejected || (
                !unverified &&
                [
                    'ERROR_CODE_INVALID_ARGUMENT',
                    'ERROR_CODE_NOT_FOUND',
                    'ERROR_CODE_CONFLICT',
                    'ERROR_CODE_PERMISSION_DENIED',
                    'ERROR_CODE_UNAUTHENTICATED'
                ].includes(e.error_code || '')
            ))
                this.storage.removeItem(this.key)
            else {
                current.state = 'unverified'
                this.storage.setItem(this.key, JSON.stringify(current))
            }
            throw error
        } finally {
            this.busy = false
        }
    }
}
