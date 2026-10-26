import type { OperationReceipt } from './types'
import type { SiteEffectiveRule, SiteGame, SiteProtoGame } from './site-types'
export type OwnerActor = {operator_id: string; agent_id: string}
export type OwnerModel = {config_model: 'AGENT_V1' | 'SITE_V1' | 'OWNER_V1'; actor: OwnerActor}
export type OwnerLimitChange = {duration_seconds: string; stake_tier_id: string; based_rule_epoch: string; minimum_stake: string; maximum_stake: string; enabled?: boolean; target_payout_rate?: string; maximum_odds?: string; fixed_odds?: string}
export type OwnerConfig = {enabled: boolean; platform_enabled: boolean; owner_agent_id: string; game_type: SiteProtoGame; symbol: string; public_version: string; owner_revision: string; rules: Array<{rule: SiteEffectiveRule; rule_epoch: string; platform_minimum_stake: string; platform_maximum_stake: string; custom: boolean; platform_enabled: boolean; owner_enabled: boolean; platform_target_payout_rate: string; platform_maximum_odds: string; platform_fixed_odds: string}>}
export type OwnerSaveBody = {enabled?: boolean; game_type: SiteGame; symbol: string; based_owner_revision: string; changes: OwnerLimitChange[]; client_request_id: string; reason: string}
export type OwnerSaveResult = {configuration: OwnerConfig; receipt: OperationReceipt}
