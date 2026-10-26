import { FIXED_DURATIONS, FIXED_HIGH_LOW_DURATIONS } from './form'
import type { DecimalConstraint, PredictionConfiguration, PredictionEditModel, PredictionGameType } from './types'
const blank = (agentEditable = false): DecimalConstraint => ({
    default_value: '', minimum_value: '', maximum_value: '', agent_editable: agentEditable
})

export function createInitialModel(game: PredictionGameType, symbol: string, version: string): PredictionEditModel {
    return {
        is_new: true, game_type: game, symbol, based_on_template_version: version, enabled: false,
        rules: (game === 'UP_DOWN' ? FIXED_DURATIONS : FIXED_HIGH_LOW_DURATIONS).map(duration => ({
            duration_seconds: duration, enabled_by_default: true,
            minimum_stake: blank(true), maximum_stake: blank(true),
            // Test environment template 851, verified read-only on 2026-09-24. New rooms only.
            settlement_display_seconds: '10',
            price_rule: { max_age_milliseconds: '5000', late_arrival_grace_milliseconds: '500', price_decimals: 3 },
            ...(game === 'UP_DOWN' ? {
                bet_open_seconds: { default_value: '30', minimum_value: '30', maximum_value: '30', agent_editable: false },
                target_payout_rate: blank(),
                minimum_odds: { default_value: '1', minimum_value: '1', maximum_value: '1', agent_editable: false },
                maximum_odds: blank(),
                stake_tiers: [{ enabled_by_default: true, display_order: 1, minimum_stake: blank(true), maximum_stake: blank(true), retired: false }]
            } : { fixed_odds: blank(true) })
        }))
    }
}

// Read the unfiltered list: both games publish into the same template version.
// A failed/malformed read must never be interpreted as an empty database.
export function creationSnapshot(response: unknown, game: PredictionGameType, symbol: string): {
    version: string; existing: PredictionConfiguration | undefined
} {
    const rows = (response as { configurations?: PredictionConfiguration[] } | null)?.configurations
    if (!Array.isArray(rows)) throw Error('配置列表格式异常，请重新加载')
    let version = '0'
    let existing: PredictionConfiguration | undefined
    const keys = new Set<string>()
    for (const row of rows) {
        if (!row || row.scope !== 'CONFIG_SCOPE_PLATFORM' ||
            typeof row.template_version !== 'string' || !/^[1-9]\d*$/.test(row.template_version) ||
            BigInt(row.template_version) > 9223372036854775807n ||
            !Array.isArray(row.rules) || !row.rules.length) throw Error('配置列表格式异常，请重新加载')
        if (version !== '0' && version !== row.template_version) throw Error('配置版本不一致，请重新加载')
        version = row.template_version
        const first = row.rules[0]
        if (!first || !['GAME_TYPE_UP_DOWN', 'GAME_TYPE_HIGH_LOW'].includes(first.game_type) ||
            !/^[A-Z0-9]{2,32}$/.test(first.symbol) ||
            row.rules.some(rule => !rule || rule.symbol !== first.symbol || rule.game_type !== first.game_type)) throw Error('配置列表格式异常，请重新加载')
        const key = `${first.game_type}:${first.symbol}`
        if (keys.has(key)) throw Error('配置列表重复，请重新加载')
        keys.add(key)
        if (first.game_type === `GAME_TYPE_${game}` && first.symbol === symbol) existing = row
    }
    return { version, existing }
}
