import type { OperationReceipt } from './types'
export type SiteGame = 'UP_DOWN' | 'HIGH_LOW'
export type SiteProtoGame = 'GAME_TYPE_UP_DOWN' | 'GAME_TYPE_HIGH_LOW'
export interface SiteActor { operator_id: string; agent_id: string }
export interface SiteTarget { site_id: string; game_type: SiteGame; symbol: string }
export interface SiteTargets { actor: SiteActor; sites: Array<{site_id: string; games: Array<{game_type: SiteGame; symbols: string[]}>}> }
export interface SiteTierOverride { stake_tier_id: string; enabled?: boolean; maximum_stake?: string }
export interface SiteOverride { duration_seconds: string; enabled?: boolean; stake_tiers?: SiteTierOverride[]; fixed_odds?: string; minimum_stake?: string; maximum_stake?: string }
export interface SiteStored {
    site_id: string; game_type: SiteProtoGame; symbol: string; version: string
    based_on_public_version: string; enabled: boolean
    overrides: Array<SiteOverride & {game_type: SiteProtoGame; symbol: string; stake_tiers: SiteTierOverride[]}>
}
export interface SiteEffectiveTier { stake_tier_id: string; enabled: boolean; display_order: number; minimum_stake: string; maximum_stake: string; retired: boolean }
export interface SiteEffectiveRule {
    price_rule?: { max_age_milliseconds: string; late_arrival_grace_milliseconds: string; price_decimals?: number }
    game_type: SiteProtoGame; symbol: string; duration_seconds: string; market_id: string
    fixed_odds: string; minimum_stake: string; maximum_stake: string
    enabled: boolean; bet_open_seconds: string; target_payout_rate: string; minimum_odds: string; maximum_odds: string
    stake_tiers: SiteEffectiveTier[]; [key: string]: unknown
}
export interface SiteConfigRead {
    stored: SiteStored
    effective: {site_id: string; game_type: SiteProtoGame; symbol: string; public_version: string; site_version: string; based_on_public_version: string; enabled: boolean; rules: SiteEffectiveRule[]}
    adjustments: Array<{game_type: string; symbol: string; duration_seconds: string; field: string; before_value: string; after_value: string; reason: string}>
}
export interface SiteSaveBody extends SiteTarget {
    client_request_id: string; reason: string; based_on_public_version: string; based_on_site_version: string
    enabled: boolean; overrides: SiteOverride[]
}
export interface SiteSaveResult { stored: SiteStored; receipt: OperationReceipt }
