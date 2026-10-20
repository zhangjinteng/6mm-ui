import type { LiquidationWarningRules } from './types'

export interface WarningRuleDraft {
    entryThreshold: string
    highRiskThreshold: string
    notifyEnabled: boolean
}

const percentage = (value: unknown): number | null => {
    if (typeof value !== 'number' && typeof value !== 'string') return null
    const text = String(value).trim()
    if (!/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(text)) return null
    const number = Number(text)
    return Number.isFinite(number) ? number : null
}

export const parseWarningRules = (value: unknown): LiquidationWarningRules => {
    if (!value || typeof value !== 'object') throw new Error('预警配置数据无效，请重新加载')
    const data = value as Record<string, unknown>
    const entry = percentage(data.min_large_position_value)
    const high = percentage(data.liquidation_high_risk_threshold)
    if (
        entry === null ||
        entry <= 0 ||
        high === null ||
        high <= 0 ||
        typeof data.liquidation_warning_notify_enabled !== 'boolean'
    ) {
        throw new Error('预警配置数据无效，请重新加载')
    }
    return {
        min_large_position_value: entry,
        liquidation_high_risk_threshold: high,
        liquidation_warning_notify_enabled: data.liquidation_warning_notify_enabled
    }
}

export const validateWarningDraft = (draft: WarningRuleDraft) => {
    const entry = percentage(draft.entryThreshold)
    const high = percentage(draft.highRiskThreshold)
    return {
        entryThreshold:
            entry === null || entry <= 0 || entry >= 100
                ? '请输入大于0且小于100的进入预警阈值'
                : (true as const),
        highRiskThreshold:
            high === null || high <= 0 || high >= 100
                ? '请输入大于0且小于100的高风险阈值'
                : entry !== null && high <= entry
                  ? '高风险阈值必须大于进入预警阈值'
                  : (true as const)
    }
}

export const toWarningRulePayload = (draft: WarningRuleDraft): LiquidationWarningRules | null => {
    const errors = validateWarningDraft(draft)
    if (errors.entryThreshold !== true || errors.highRiskThreshold !== true) return null
    return {
        min_large_position_value: Number(draft.entryThreshold),
        liquidation_high_risk_threshold: Number(draft.highRiskThreshold),
        liquidation_warning_notify_enabled: draft.notifyEnabled
    }
}

export const formatWarningThreshold = (value: unknown): string => {
    const number = percentage(value)
    return number === null ? '—' : `${number}%`
}

const riskRatioFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
    useGrouping: false
})

export const formatLiquidationRiskRatio = (value: unknown): string => {
    const ratio = percentage(value)
    if (ratio === null || !Number.isFinite(ratio * 100)) return '—'
    return riskRatioFormatter.format(ratio)
}

type WarningLevel = { label: '预警'; type: 'warning' } | { label: '高风险'; type: 'danger' }

export const resolveWarningLevel = (
    marginRatio: unknown,
    rules: LiquidationWarningRules | null | undefined
): WarningLevel | null => {
    const ratio = percentage(marginRatio)
    const entry = percentage(rules?.min_large_position_value)
    const high = percentage(rules?.liquidation_high_risk_threshold)
    if (
        ratio === null ||
        entry === null ||
        entry <= 0 ||
        high === null ||
        high <= entry ||
        high >= 100
    ) {
        return null
    }

    // The API returns a ratio; saved rule thresholds are percentages.
    if (ratio >= high / 100) return { label: '高风险', type: 'danger' }
    if (ratio >= entry / 100) return { label: '预警', type: 'warning' }
    return null
}
