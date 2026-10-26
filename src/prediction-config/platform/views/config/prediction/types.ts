export type PredictionGameType = 'UP_DOWN' | 'HIGH_LOW'
export type PredictionProtoGameType = 'GAME_TYPE_UP_DOWN' | 'GAME_TYPE_HIGH_LOW'

export interface DecimalConstraint {
    default_value: string
    minimum_value: string
    maximum_value: string
    agent_editable: boolean
}

export interface IntegerConstraint {
    default_value: string
    minimum_value: string
    maximum_value: string
    agent_editable: boolean
}

export interface DecimalConfigField extends DecimalConstraint {
    value: string
    template_value: string
    overridden: boolean
}

export interface IntegerConfigField extends IntegerConstraint {
    value: string
    template_value: string
    overridden: boolean
}

export interface PriceRule {
    price_decimals?: number | null
    max_age_milliseconds: string
    late_arrival_grace_milliseconds: string
}

export interface GameplayStakeTier {
    stake_tier_id: string
    enabled: boolean
    enabled_by_default: boolean
    display_order: number
    minimum_stake: DecimalConfigField
    maximum_stake: DecimalConfigField
    retired: boolean
}

export interface PredictionRule {
    validation_status: string
    game_type: PredictionProtoGameType
    symbol: string
    duration_seconds: string
    enabled: boolean
    enabled_by_default: boolean
    bet_open_seconds?: IntegerConfigField
    target_payout_rate?: DecimalConfigField
    minimum_odds?: DecimalConfigField
    maximum_odds?: DecimalConfigField
    fixed_odds?: DecimalConfigField
    // 涨跌规则的这两个字段在服务端可能缺省（下注限制只挂在 stake_tiers 上）。
    minimum_stake?: DecimalConfigField
    maximum_stake?: DecimalConfigField
    settlement_display_seconds: string
    price_rule: PriceRule
    market_id: string
    stake_tiers?: GameplayStakeTier[]
}

export interface PredictionConfiguration {
    symbol_enabled?: boolean
    scope: 'CONFIG_SCOPE_PLATFORM'
    agent_id?: string
    template_version: string
    agent_version: string
    effective_version: string
    rules: PredictionRule[]
    updated_at_ms: string
}

export interface PlatformStakeTierInput {
    stake_tier_id?: string
    enabled_by_default: boolean
    display_order: number
    minimum_stake: DecimalConstraint
    maximum_stake: DecimalConstraint
    retired: boolean
}

export interface PlatformRuleInput {
    duration_seconds: string
    enabled_by_default: boolean
    bet_open_seconds?: IntegerConstraint
    target_payout_rate?: DecimalConstraint
    minimum_odds?: DecimalConstraint
    maximum_odds?: DecimalConstraint
    fixed_odds?: DecimalConstraint
    minimum_stake: DecimalConstraint
    maximum_stake: DecimalConstraint
    settlement_display_seconds: string
    price_rule: PriceRule
    market_id?: string
    stake_tiers?: PlatformStakeTierInput[]
}

export interface PredictionEditModel {
    is_new?: boolean
    game_type: PredictionGameType
    symbol: string
    based_on_template_version: string
    enabled: boolean
    rules: PlatformRuleInput[]
}

export type PlatformRulePayload = Omit<PlatformRuleInput, 'minimum_stake' | 'maximum_stake'> & {
    minimum_stake?: DecimalConstraint
    maximum_stake?: DecimalConstraint
}

export interface SavePredictionConfigurationPayload {
    client_request_id: string
    reason: string
    based_on_template_version: string
    game_type: PredictionGameType
    symbol: string
    platform_template: {
        enabled: boolean
        rules: PlatformRulePayload[]
    }
}

export interface PredictionRpcError {
    error_code?: string
    grpc_status_code?: number
    detail?: Record<string, unknown>
    request_id?: string
}
