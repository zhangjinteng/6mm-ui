import {sortConfigSymbols} from '../../grid/config/directory'
import type { SiteGame } from '../../../api/prediction/site-types'
function symbol(value: unknown): string {
    if (typeof value !== 'string' || !/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(value)) throw Error('INVALID_SYMBOL_DIRECTORY')
    return value
}

// Platform defaults determine visibility independently of the merchant effective switch.
export function publicSymbols(value: unknown, game: SiteGame): string[] {
    const rows = (value as { configurations?: unknown })?.configurations
    if (!Array.isArray(rows)) throw Error('INVALID_SYMBOL_DIRECTORY')
    return [...new Set(rows.flatMap(config => {
        if (!Array.isArray(config?.rules) || !config.rules.length) throw Error('INVALID_SYMBOL_DIRECTORY')
        return config.rules.flatMap((rule: { game_type?: unknown; symbol?: unknown; enabled_by_default?: unknown }) => {
            if (rule.game_type !== `GAME_TYPE_${game}` || typeof rule.enabled_by_default !== 'boolean') throw Error('INVALID_SYMBOL_DIRECTORY')
            const key = symbol(rule.symbol)
            return rule.enabled_by_default ? [key] : []
        })
    }))] as string[]
}

export function symbolDirectory(allowed: string[], configured: string[], common: string[], enabled: string[] = []) {
    const permitted = new Set(allowed.map(symbol)), publicKeys = new Set(configured.map(symbol))
    common.forEach(symbol)
    const all = [...permitted].filter(value => publicKeys.has(value))
    const active = new Set(enabled.map(symbol))
    return sortConfigSymbols([...all].map(value => ({symbol:value, allowed:permitted.has(value), publicConfigured:publicKeys.has(value)})), common, row=>active.has(row.symbol))
}
