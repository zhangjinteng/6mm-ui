import type { SiteActor, SiteEffectiveRule, SiteGame, SiteConfigRead, SiteSaveBody, SiteStored, SiteTargets } from '../../../api/prediction/site-types'
import { compareDecimal, decimal, identity, integer, text } from '../shared/format'
export const siteGame = (value: SiteConfigRead): SiteGame => value.stored.game_type === 'GAME_TYPE_HIGH_LOW' ? 'HIGH_LOW' : 'UP_DOWN'
export const periods = ['35', '40', '45', '60', '90']
export const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
export function ensure(ok: unknown, code = 'INVALID_SITE_CONFIGURATION'): asserts ok { if (!ok) throw new Error(code) }
export function frozen<T>(value: T): T {
    if (value && typeof value === 'object') { Object.freeze(value); for (const child of Object.values(value)) frozen(child) }
    return value
}
// getRandomValues is available on HTTP; randomUUID requires a secure context.
export function siteRequestId(source: {getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>} = globalThis.crypto): string {
    ensure(source && typeof source.getRandomValues === 'function', 'SECURE_RANDOM_UNAVAILABLE')
    const bytes = source.getRandomValues(new Uint8Array(16))
    ensure(bytes instanceof Uint8Array && bytes.length === 16, 'SECURE_RANDOM_UNAVAILABLE')
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
export function assertActor(value: unknown): asserts value is SiteActor {
    ensure(object(value) && identity(value.operator_id) === value.operator_id && identity(value.agent_id) === value.agent_id, 'IDENTITY_UNCONFIRMED')
}
export function assertTargets(value: unknown): asserts value is SiteTargets {
    ensure(object(value)); assertActor(value.actor)
    ensure(Array.isArray(value.sites) && value.sites.length <= 100)
    const ids = new Set()
    for (const site of value.sites) {
        ensure(object(site) && text(site.site_id, 128) && !ids.has(site.site_id) && Array.isArray(site.games)); ids.add(site.site_id)
        ensure(site.games.length > 0 && site.games.length <= 2)
        const games = new Set()
        for (const game of site.games) {
            ensure(object(game) && ['UP_DOWN', 'HIGH_LOW'].includes(String(game.game_type)) && !games.has(game.game_type) && Array.isArray(game.symbols) && game.symbols.length <= 100 && game.symbols.every(s => text(s, 64, true)) && new Set(game.symbols).size === game.symbols.length)
            games.add(game.game_type)
        }
    }
}
function allowed(value: Record<string, unknown>, keys: string[]) { ensure(Object.keys(value).every(k => keys.includes(k))) }
export function assertStored(value: unknown): asserts value is SiteStored {
    ensure(object(value) && text(value.site_id, 128) && ['GAME_TYPE_UP_DOWN', 'GAME_TYPE_HIGH_LOW'].includes(String(value.game_type)) && text(value.symbol, 64, true))
    ensure(integer(value.version, true) && integer(value.based_on_public_version, true) && typeof value.enabled === 'boolean' && Array.isArray(value.overrides))
    const upDown = value.game_type === 'GAME_TYPE_UP_DOWN'
    ensure(value.overrides.length <= (upDown ? 5 : 100) && new Set(value.overrides.map(r => r.duration_seconds)).size === value.overrides.length)
    for (const row of value.overrides) {
        ensure(object(row)); allowed(row, ['game_type', 'symbol', 'duration_seconds', 'enabled', 'stake_tiers', ...(!upDown ? ['fixed_odds', 'minimum_stake', 'maximum_stake'] : [])])
        ensure(row.game_type === value.game_type && row.symbol === value.symbol && (upDown ? periods.includes(String(row.duration_seconds)) : integer(row.duration_seconds, true)))
        ensure(!Object.hasOwn(row, 'enabled') || typeof row.enabled === 'boolean')
        ensure(Array.isArray(row.stake_tiers) && row.stake_tiers.length <= (upDown ? 1 : 0))
        if (!upDown) assertHighLowValues(row)
        for (const tier of row.stake_tiers) {
            ensure(object(tier)); allowed(tier, ['stake_tier_id', 'enabled', 'maximum_stake'])
            ensure(text(tier.stake_tier_id) && (!Object.hasOwn(tier, 'enabled') || typeof tier.enabled === 'boolean') && (!Object.hasOwn(tier, 'maximum_stake') || decimal(tier.maximum_stake)))
        }
    }
}
export function assertSiteRead(value: unknown, site: string, symbol: string, game?: SiteGame): asserts value is SiteConfigRead {
    ensure(object(value)); assertStored(value.stored)
    const stored = value.stored, effective = value.effective
    ensure(stored.site_id === site && stored.symbol === symbol && object(effective) && (!game || stored.game_type === 'GAME_TYPE_' + game))
    const upDown = stored.game_type === 'GAME_TYPE_UP_DOWN'
    ensure(effective.site_id === site && effective.symbol === symbol && effective.game_type === stored.game_type)
    ensure(integer(effective.public_version, true) && effective.site_version === stored.version && effective.based_on_public_version === stored.based_on_public_version && typeof effective.enabled === 'boolean')
    ensure(Array.isArray(effective.rules) && (upDown ? effective.rules.length === 5 : effective.rules.length > 0 && effective.rules.length <= 100) && new Set(effective.rules.map(r => r.duration_seconds)).size === effective.rules.length)
    const rules = effective.rules as SiteEffectiveRule[]
    for (const rule of rules) {
        ensure(object(rule) && rule.game_type === stored.game_type && rule.symbol === symbol && (upDown ? periods.includes(String(rule.duration_seconds)) : integer(rule.duration_seconds, true)) && typeof rule.enabled === 'boolean')
        ensure(Array.isArray(rule.stake_tiers))
        if (!upDown) {
            ensure(rule.stake_tiers.length === 0); assertHighLowValues(rule, true); continue
        }
        ensure(rule.bet_open_seconds === '30')
        ensure(rule.stake_tiers.every(t => object(t) && text(t.stake_tier_id) && typeof t.enabled === 'boolean' && typeof t.retired === 'boolean'))
        const live = rule.stake_tiers.filter(t => !t.retired)
        ensure(live.length === 1 && live[0].minimum_stake === '1' && decimal(live[0].maximum_stake))
        const override = stored.overrides.find(r => r.duration_seconds === rule.duration_seconds)
        ensure(!override?.stake_tiers.length || override.stake_tiers[0].stake_tier_id === live[0].stake_tier_id)
    }
    if (effective.public_version === stored.based_on_public_version) ensure(stored.overrides.every(row => rules.some(rule => rule.duration_seconds === row.duration_seconds)))
    ensure(Array.isArray(value.adjustments))
}
export function assertHighLowValues(row: Record<string, unknown>, required = false) {
    for (const key of ['fixed_odds', 'minimum_stake', 'maximum_stake']) {
        if (required || Object.hasOwn(row, key)) ensure(decimal(row[key]) && compareDecimal(row[key] as string, key === 'fixed_odds' ? '1' : '0') > 0)
    }
    if (row.minimum_stake !== undefined && row.maximum_stake !== undefined) ensure(compareDecimal(row.minimum_stake as string, row.maximum_stake as string) <= 0)
}
export interface SiteRow { fixed_odds?: string; minimum_stake?: string; effective_fixed_odds?: string; effective_minimum?: string; duration_seconds: string; observation_seconds: string; stake_tier_id: string; enabled: boolean; maximum_stake: string; effective_maximum: string; effective_enabled: boolean; inherited_enabled: boolean; editable: boolean }
export function siteRows(config: SiteConfigRead): SiteRow[] {
    assertSiteRead(config, config.stored.site_id, config.stored.symbol)
    if (siteGame(config) === 'HIGH_LOW') return [...config.effective.rules].sort((a,b) => BigInt(a.duration_seconds) < BigInt(b.duration_seconds) ? -1 : 1).map(rule => {
        const saved = config.stored.overrides.find(r => r.duration_seconds === rule.duration_seconds)
        return {duration_seconds: rule.duration_seconds, observation_seconds: rule.duration_seconds, stake_tier_id: '',
            enabled: saved?.enabled ?? rule.enabled, fixed_odds: saved?.fixed_odds ?? rule.fixed_odds,
            minimum_stake: saved?.minimum_stake ?? rule.minimum_stake, maximum_stake: saved?.maximum_stake ?? rule.maximum_stake,
            effective_fixed_odds: rule.fixed_odds, effective_minimum: rule.minimum_stake, effective_maximum: rule.maximum_stake,
            effective_enabled: rule.enabled, inherited_enabled: saved?.enabled === undefined, editable: true}
    })
    return periods.map(duration => {
        const rule = config.effective.rules.find(r => r.duration_seconds === duration)!, tier = rule.stake_tiers.find(t => !t.retired)!
        const saved = config.stored.overrides.find(r => r.duration_seconds === duration), savedTier = saved?.stake_tiers[0]
        return {duration_seconds: duration, observation_seconds: String(Number(duration) - 30), stake_tier_id: tier.stake_tier_id,
            enabled: (saved?.enabled ?? rule.enabled) && (savedTier?.enabled ?? tier.enabled), maximum_stake: savedTier?.maximum_stake ?? tier.maximum_stake,
            effective_maximum: tier.maximum_stake, effective_enabled: rule.enabled && tier.enabled, inherited_enabled: saved?.enabled === undefined || savedTier?.enabled === undefined, editable: true}
    })
}
export function makeSiteBody(config: SiteConfigRead, rows: SiteRow[], enabled: boolean, reason: string, request: string): SiteSaveBody {
    const original = siteRows(config)
    ensure(typeof enabled === 'boolean' && text(reason, 500) && text(request, 128), 'INVALID_REASON')
    ensure(rows.length === original.length && new Set(rows.map(r => r.duration_seconds)).size === original.length)
    const game = siteGame(config)
    const overrides = original.map(old => {
        const row = rows.find(r => r.duration_seconds === old.duration_seconds)!
        ensure(row && row.stake_tier_id === old.stake_tier_id && typeof row.enabled === 'boolean')
        const stored = config.stored.overrides.find(r => r.duration_seconds === old.duration_seconds)
        if (game === 'HIGH_LOW') {
            assertHighLowValues(row as unknown as Record<string, unknown>, true)
            ensure(compareDecimal(row.fixed_odds!, '2') < 0, 'INVALID_ODDS')
            const next: SiteSaveBody['overrides'][number] = {duration_seconds: old.duration_seconds}
            if (!stored) next.enabled = row.enabled
            else if (stored.enabled !== undefined) next.enabled = stored.enabled
            if (row.enabled !== old.enabled) next.enabled = row.enabled
            for (const key of ['fixed_odds', 'minimum_stake', 'maximum_stake'] as const) {
                if (stored?.[key] !== undefined) next[key] = stored[key]
                if (row[key] !== old[key]) next[key] = row[key]
            }
            return next
        }
        ensure(decimal(row.maximum_stake) && compareDecimal(row.maximum_stake, '1') >= 0, 'INVALID_MAXIMUM')
        const tier = {...(stored?.stake_tiers[0] ?? {stake_tier_id: old.stake_tier_id})}
        const next = {duration_seconds: old.duration_seconds, ...(stored?.enabled === undefined ? {} : {enabled: stored.enabled}), stake_tiers: [tier]}
        if (row.enabled !== old.enabled) { next.enabled = row.enabled; tier.enabled = row.enabled }
        if (row.maximum_stake !== old.maximum_stake) tier.maximum_stake = row.maximum_stake
        return next
    })
    return frozen({site_id: config.stored.site_id, game_type: game, symbol: config.stored.symbol, client_request_id: request, reason,
        based_on_public_version: config.effective.public_version, based_on_site_version: config.stored.version, enabled, overrides})
}
export interface SiteBinding extends SiteActor { site_id: string; game_type: SiteGame; symbol: string; public_version: string; site_version: string }
export function siteBinding(actor: SiteActor, config: SiteConfigRead): SiteBinding {
    return {...actor, site_id: config.stored.site_id, game_type: siteGame(config), symbol: config.stored.symbol, public_version: config.effective.public_version, site_version: config.stored.version}
}
export class SiteIntentGate {
    private generation = 0
    next(binding: SiteBinding) {
        const generation = ++this.generation, key = JSON.stringify(binding)
        return {current: (current: SiteBinding | null) => generation === this.generation && !!current && JSON.stringify(current) === key}
    }
    close() { this.generation++ }
}
