import { unsigned } from '../../prediction/format'
import type {
    DecimalConfigField,
    DecimalConstraint,
    GameplayStakeTier,
    IntegerConfigField,
    IntegerConstraint,
    PlatformRuleInput,
    PlatformRulePayload,
    PlatformStakeTierInput,
    PredictionConfiguration,
    PredictionEditModel,
    PredictionGameType,
    SavePredictionConfigurationPayload
} from './types'
const DECIMAL_PATTERN = /^(?:0|[1-9]\d*)(?:\.\d+)?$/
const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/
const INTEGER_PATTERN = /^\d+$/
export const FIXED_DURATIONS = ['35', '40', '45', '60', '90'] as const
export const FIXED_HIGH_LOW_DURATIONS = ['5', '10', '15', '30', '60'] as const
export function nextDurationSeconds(currentDuration: string): string {
    try {
        const parsed = BigInt(currentDuration || '0')
        return parsed >= 0n ? (parsed + 60n).toString() : '60'
    } catch {
        return '60'
    }
}

const gameTypeFromProto = (value: string): PredictionGameType => {
    if (value === 'GAME_TYPE_UP_DOWN') return 'UP_DOWN'
    if (value === 'GAME_TYPE_HIGH_LOW') return 'HIGH_LOW'
    throw new Error(`不支持的预测玩法类型：${value || '空'}`)
}

const decimalConstraint = (field: DecimalConfigField): DecimalConstraint => ({
    default_value: field.default_value,
    minimum_value: field.minimum_value,
    maximum_value: field.maximum_value,
    agent_editable: field.agent_editable
})

const integerConstraint = (field: IntegerConfigField): IntegerConstraint => ({
    default_value: field.default_value,
    minimum_value: field.minimum_value,
    maximum_value: field.maximum_value,
    agent_editable: field.agent_editable
})

const stakeTierInput = (tier: GameplayStakeTier) => {
    const input: PlatformStakeTierInput = {
        enabled_by_default: tier.enabled_by_default,
        display_order: tier.display_order,
        minimum_stake: decimalConstraint(tier.minimum_stake),
        maximum_stake: decimalConstraint(tier.maximum_stake),
        retired: tier.retired
    }
    if (tier.stake_tier_id) input.stake_tier_id = tier.stake_tier_id
    return input
}

// 生产数据里涨跌规则只把最低/最高下注额放在 stake_tiers（房间档位）上，
// 规则级 minimum_stake/maximum_stake 会缺省；这里回落到当前生效档位，
// 保证页面能打开，且保存时（createSavePayload 会回写档位）保持一致。
const stakeConstraintSource = (
    rule: PredictionConfiguration['rules'][number],
    field: 'minimum_stake' | 'maximum_stake'
): DecimalConfigField => {
    const tiers = rule.stake_tiers ?? []
    const live = tiers.find((tier) => !tier.retired) ?? tiers[0]
    const source = rule[field] ?? live?.[field]
    if (!source) {
        throw new Error(
            `周期 ${rule.duration_seconds || '--'} 秒缺少${field === 'minimum_stake' ? '最低' : '最高'}下注限制配置，请刷新后重试`
        )
    }
    return source
}

const ruleInput = (rule: PredictionConfiguration['rules'][number]): PlatformRuleInput => {
    const input: PlatformRuleInput = {
        duration_seconds: rule.duration_seconds,
        enabled_by_default: rule.enabled_by_default,
        minimum_stake: decimalConstraint(stakeConstraintSource(rule, 'minimum_stake')),
        maximum_stake: decimalConstraint(stakeConstraintSource(rule, 'maximum_stake')),
        settlement_display_seconds: rule.settlement_display_seconds,
        price_rule: {
            max_age_milliseconds: rule.price_rule.max_age_milliseconds,
            late_arrival_grace_milliseconds: rule.price_rule.late_arrival_grace_milliseconds,
            price_decimals: rule.price_rule.price_decimals === undefined ? 3 : rule.price_rule.price_decimals
        }
    }
    if (rule.market_id) input.market_id = rule.market_id
    if (rule.bet_open_seconds) input.bet_open_seconds = integerConstraint(rule.bet_open_seconds)
    if (rule.target_payout_rate) {
        input.target_payout_rate = decimalConstraint(rule.target_payout_rate)
    }
    // Legacy wire field: new submissions use the formula baseline, not an admission floor.
    if (rule.minimum_odds) {
        input.minimum_odds = {
            default_value: '1',
            minimum_value: '1',
            maximum_value: '1',
            agent_editable: false
        }
    }
    if (rule.maximum_odds) input.maximum_odds = decimalConstraint(rule.maximum_odds)
    if (rule.fixed_odds) input.fixed_odds = decimalConstraint(rule.fixed_odds)
    const stakeTiers = rule.stake_tiers ?? []
    if (stakeTiers.length > 0) input.stake_tiers = stakeTiers.map(stakeTierInput)

    return input
}

// This is a save preview only; original pending operations never pass through this conversion.
function fixedHighLowInputs(configuration: PredictionConfiguration): PlatformRuleInput[] {
    const inputs = configuration.rules.map(ruleInput)
    if (new Set(inputs.map(row => row.duration_seconds)).size !== inputs.length) throw Error('自选周期重复')
    return FIXED_HIGH_LOW_DURATIONS.map(duration => {
        const existing = inputs.find(row => row.duration_seconds === duration)
        if (existing) return existing
        const maximum = duration === '60' ? '5000' : '3000'
        return {
            duration_seconds: duration, enabled_by_default: true,
            fixed_odds: {default_value:'1.85',minimum_value:'1.01',maximum_value:'1.85',agent_editable:true},
            minimum_stake: {default_value:'1',minimum_value:'1',maximum_value:maximum,agent_editable:true},
            maximum_stake: {default_value:maximum,minimum_value:'1',maximum_value:maximum,agent_editable:true},
            settlement_display_seconds: inputs[0].settlement_display_seconds,
            price_rule: structuredClone(inputs[0].price_rule)
        }
    })
}

export function createEditModel(configuration: PredictionConfiguration): PredictionEditModel {
    const firstRule = configuration.rules[0]
    if (!firstRule) throw new Error('当前配置没有可编辑周期')

    return {
        game_type: gameTypeFromProto(firstRule.game_type),
        symbol: firstRule.symbol,
        based_on_template_version: configuration.template_version,
        enabled: configurationEnabled(configuration),
        rules: (firstRule.game_type === 'GAME_TYPE_HIGH_LOW' ? fixedHighLowInputs(configuration) : configuration.rules.map(ruleInput)).map(rule => ({ ...rule, enabled_by_default: legacyMasterOff(configuration) || rule.enabled_by_default }))
    }
}

export function createSavePayload(
    model: PredictionEditModel,
    reason: string,
    requestId: string
): SavePredictionConfigurationPayload {
    model = initialConstraints(model)
    const rules: PlatformRulePayload[] = structuredClone(model.rules)
    if (model.game_type === 'UP_DOWN') {
        for (const [index, rule] of rules.entries()) {
            const modelRule = model.rules[index]
            const live = rule.stake_tiers?.find((tier) => !tier.retired)
            if (live) {
                live.minimum_stake = structuredClone(modelRule.minimum_stake)
                live.maximum_stake = structuredClone(modelRule.maximum_stake)
                live.enabled_by_default = rule.enabled_by_default
            }
            // 固定涨跌房间仅通过技术档位提交下注范围；顶层字段只用于页面编辑。
            delete rule.minimum_stake
            delete rule.maximum_stake
        }
    }
    return {
        client_request_id: requestId,
        reason: reason.trim(),
        based_on_template_version: model.based_on_template_version,
        game_type: model.game_type,
        symbol: model.symbol,
        platform_template: {
            enabled: model.is_new ? false : model.enabled,
            rules
        }
    }
}

export function validatePredictionModel(model: PredictionEditModel, allowNewIdentifiers = model.is_new === true): string[] {
    model = initialConstraints(model)
    const errors: string[] = []
    if (!model.symbol) errors.push('交易对不能为空')
    if (!unsigned(model.based_on_template_version)) errors.push('配置版本无效')
    if (model.rules.length === 0) errors.push('至少保留一个周期')
    if (
        model.game_type === 'UP_DOWN' &&
        [...model.rules.map((r) => r.duration_seconds)].sort().join(',') !==
            FIXED_DURATIONS.join(',')
    ) {
        errors.push('涨跌配置必须包含5、10、15、30、60秒五个固定房间')
    }

    if (model.game_type === 'HIGH_LOW' && [...model.rules.map(r=>r.duration_seconds)].sort().join(',') !== [...FIXED_HIGH_LOW_DURATIONS].sort().join(',')) errors.push('自选配置必须包含5、10、15、30、60秒五个固定房间')

    if (new Set(model.rules.map(r => r.price_rule.price_decimals)).size > 1) errors.push('同一币种各周期的价格小数位必须一致')
    const durations = new Set<string>()
    model.rules.forEach((rule) => {
        const durationLabel = `${rule.duration_seconds || '--'} 秒周期`
        if (!POSITIVE_INTEGER_PATTERN.test(rule.duration_seconds)) {
            errors.push(`${durationLabel}的周期必须是正整数`)
        }
        if (durations.has(rule.duration_seconds)) {
            errors.push(`周期 ${rule.duration_seconds} 秒重复`)
        }
        durations.add(rule.duration_seconds)

        const precision = rule.price_rule.price_decimals
        if (precision !== undefined && (typeof precision !== 'number' || !Number.isInteger(precision) || precision < 0 || precision > 8)) errors.push('价格小数位必须是0～8的整数')
        validateInteger(rule.settlement_display_seconds, `${durationLabel}的结算展示时间`, errors)
        validateInteger(
            rule.price_rule.max_age_milliseconds,
            `${durationLabel}的行情最大年龄`,
            errors
        )
        validateInteger(
            rule.price_rule.late_arrival_grace_milliseconds,
            `${durationLabel}的行情延迟宽限`,
            errors
        )
        validateDecimalConstraint(rule.minimum_stake, durationLabel, '最低下注额', errors)
        validateDecimalConstraint(rule.maximum_stake, durationLabel, '最高下注额', errors)
        const min = rule.minimum_stake?.default_value, max = rule.maximum_stake?.default_value
        const amount = /^(0|[1-9]\d{0,17})(\.\d{1,18})?$/
        if (typeof min !== 'string' || typeof max !== 'string' || !amount.test(min) || !amount.test(max) || compareDecimalStrings(min, '0') <= 0 || compareDecimalStrings(max, '0') <= 0)
            errors.push(`${durationLabel}的单笔限额必须为正数，整数及小数最多18位`)
        else if (compareDecimalStrings(min, max) > 0) errors.push(`${durationLabel}的最小额不能大于最大额`)


        if (model.game_type === 'UP_DOWN') {
            const fixed = (c: DecimalConstraint | undefined, value: string) =>
                Boolean(c) &&
                c!.agent_editable === false &&
                [c!.minimum_value, c!.default_value, c!.maximum_value].every(
                    (v) =>
                        typeof v === 'string' &&
                        DECIMAL_PATTERN.test(v) &&
                        compareDecimalStrings(v, value) === 0
                )
            if (!fixed(rule.bet_open_seconds, '30'))
                errors.push('下注开放固定30秒且不可由代理调整')
            if ((!allowNewIdentifiers && !rule.market_id) || rule.stake_tiers?.filter((t) => !t.retired).length !== 1)
                errors.push('房间配置不完整，请重新加载')
            rule.stake_tiers
                ?.filter((t) => !t.retired)
                .forEach((t) => {
                    if (!allowNewIdentifiers && !t.stake_tier_id) errors.push('房间标识无效')
                })
            if (
                [rule.target_payout_rate, rule.minimum_odds, rule.maximum_odds].some(
                    (c) => c?.agent_editable !== false
                )
            )
                errors.push('返奖率和赔率不能由代理调整')
            validateIntegerConstraint(rule.bet_open_seconds, durationLabel, '下注开放时间', errors)
            validateDecimalConstraint(rule.target_payout_rate, durationLabel, '目标返奖率', errors)
            if (typeof rule.target_payout_rate?.default_value === 'string' && DECIMAL_PATTERN.test(rule.target_payout_rate.default_value) &&
                compareDecimalStrings(rule.target_payout_rate.default_value, '1') >= 0)
                errors.push(`${durationLabel}的目标返奖率必须小于 100%`)
            validateDecimalConstraint(rule.minimum_odds, durationLabel, '最低赔率', errors)
            validateDecimalConstraint(rule.maximum_odds, durationLabel, '最高赔率', errors)
            if (!rule.stake_tiers?.length) errors.push(`${durationLabel}的房间配置不完整`)
            rule.stake_tiers?.forEach((tier, index) => {
                const tierLabel = `${durationLabel}历史设置 ${index + 1}`
                validateDecimalConstraint(tier.minimum_stake, tierLabel, '最低下注额', errors)
                validateDecimalConstraint(tier.maximum_stake, tierLabel, '最高下注额', errors)
            })
        } else {
            validateDecimalConstraint(rule.fixed_odds, durationLabel, '固定赔率', errors)
            if (typeof rule.fixed_odds?.default_value === 'string' && DECIMAL_PATTERN.test(rule.fixed_odds.default_value) &&
                compareDecimalStrings(rule.fixed_odds.default_value, '2') >= 0)
                errors.push(`${durationLabel}的固定赔率必须小于 2`)
        }
    })

    return [...new Set(errors)]
}

export function summarizePredictionValidationErrors(errors: string[], game: PredictionGameType, currentDuration: string): string {
    if (errors.length <= 3) return errors.join('；')
    const room = (duration: string) => game === 'UP_DOWN' ? String(Number(duration) - 30) : duration
    const currentPrefix = `${currentDuration} 秒周期`
    const current = errors.filter(error => error.startsWith(currentPrefix))
    const otherDurations = [...new Set(errors.flatMap(error => {
        const match = /^(\d+) 秒周期/.exec(error)
        return match && match[1] !== currentDuration ? [match[1]] : []
    }))]
    const global = errors.filter(error => !/^\d+ 秒周期/.test(error))
    const parts = [...global.slice(0, 1), ...current.slice(0, 2)]
    if (current.length > 2) parts.push(`${room(currentDuration)} 秒周期还有 ${current.length - 2} 项需检查`)
    if (otherDurations.length) parts.push(`请补全 ${otherDurations.map(room).join('、')} 秒周期参数`)
    return parts.join('；').slice(0, 180)
}

// Only the first creation derives its constraint envelopes from entered values.
// Existing configuration and pending requests keep their original envelopes.
function initialConstraints(model: PredictionEditModel): PredictionEditModel {
    if (!model.is_new) return model
    const result = structuredClone(model)
    for (const rule of result.rules) {
        for (const constraint of [rule.target_payout_rate, rule.maximum_odds]) {
            if (constraint) constraint.minimum_value = constraint.maximum_value = constraint.default_value
        }
        if (rule.fixed_odds) {
            rule.fixed_odds.minimum_value = '1.000000000000000001'
            rule.fixed_odds.maximum_value = rule.fixed_odds.default_value
        }
        for (const tier of rule.stake_tiers ?? []) {
            tier.minimum_stake = structuredClone(rule.minimum_stake)
            tier.maximum_stake = structuredClone(rule.maximum_stake)
        }
    }
    return result
}

function validateInteger(value: string, label: string, errors: string[]): void {
    if (!unsigned(value)) errors.push(`${label}必须是非负整数`)
}

function validateIntegerConstraint(
    constraint: IntegerConstraint | undefined,
    ruleLabel: string,
    fieldLabel: string,
    errors: string[]
): void {
    if (!constraint) {
        errors.push(`${ruleLabel}缺少${fieldLabel}`)
        return
    }
    const values = [constraint.minimum_value, constraint.default_value, constraint.maximum_value]
    if (values.some((value) => typeof value !== 'string' || !INTEGER_PATTERN.test(value))) {
        errors.push(`${ruleLabel}的${fieldLabel}必须是非负整数`)
        return
    }
    if (
        compareDecimalStrings(constraint.minimum_value, constraint.default_value) > 0 ||
        compareDecimalStrings(constraint.default_value, constraint.maximum_value) > 0
    ) {
        errors.push(`${ruleLabel}的${fieldLabel}默认值必须处于上下限之间`)
    }
}

function validateDecimalConstraint(
    constraint: DecimalConstraint | undefined,
    ruleLabel: string,
    fieldLabel: string,
    errors: string[]
): void {
    if (!constraint) {
        errors.push(`${ruleLabel}缺少${fieldLabel}`)
        return
    }
    const values = [constraint.minimum_value, constraint.default_value, constraint.maximum_value]
    if (values.some((value) => typeof value !== 'string' || !DECIMAL_PATTERN.test(value))) {
        errors.push(`${ruleLabel}的${fieldLabel}必须是非负十进制字符串`)
        return
    }
    if (
        compareDecimalStrings(constraint.minimum_value, constraint.default_value) > 0 ||
        compareDecimalStrings(constraint.default_value, constraint.maximum_value) > 0
    ) {
        errors.push(`${ruleLabel}的${fieldLabel}默认值必须处于上下限之间`)
    }
}

function compareDecimalStrings(left: string, right: string): number {
    const [leftIntegerRaw, leftFraction = ''] = left.split('.')
    const [rightIntegerRaw, rightFraction = ''] = right.split('.')
    const leftInteger = leftIntegerRaw.replace(/^0+(?=\d)/, '')
    const rightInteger = rightIntegerRaw.replace(/^0+(?=\d)/, '')
    if (leftInteger.length !== rightInteger.length) {
        return leftInteger.length > rightInteger.length ? 1 : -1
    }
    if (leftInteger !== rightInteger) return leftInteger > rightInteger ? 1 : -1

    const scale = Math.max(leftFraction.length, rightFraction.length)
    const normalizedLeft = leftFraction.padEnd(scale, '0')
    const normalizedRight = rightFraction.padEnd(scale, '0')
    if (normalizedLeft === normalizedRight) return 0
    return normalizedLeft > normalizedRight ? 1 : -1
}

// Decimal point movement only: UI percentages never pass through floating point.
function shiftDecimal(value: string, places: number): string {
    if (!DECIMAL_PATTERN.test(value)) return value
    const [whole, fraction = ''] = value.split('.')
    const digits = whole + fraction
    const point = whole.length + places
    const shifted =
        point <= 0
            ? '0.' + '0'.repeat(-point) + digits
            : point >= digits.length
              ? digits + '0'.repeat(point - digits.length)
              : digits.slice(0, point) + '.' + digits.slice(point)
    return shifted.replace(/^0+(?=\d)/, '')
}
export const decimalToPercentage = (value: string): string => shiftDecimal(value, 2)
export const percentageToDecimal = (value: string): string => shiftDecimal(value, -2)

// The two displayed values are the effective platform limits. Keep legacy
// constraint envelopes consistent with the same range when either is edited.
export function updatePlatformStake(rule: PlatformRuleInput, field: 'minimum_stake' | 'maximum_stake', value: string): void {
    rule[field].default_value = value
    for (const key of ['minimum_stake', 'maximum_stake'] as const) {
        rule[key].minimum_value = rule.minimum_stake.default_value
        rule[key].maximum_value = rule.maximum_stake.default_value
    }
}

// Before symbol_enabled existed, closing a coin flattened all room flags.
const legacyMasterOff = (configuration: PredictionConfiguration): boolean =>
    configuration.symbol_enabled === undefined && !configuration.rules.some(rule => rule.enabled_by_default)
export const configurationEnabled = (configuration: PredictionConfiguration): boolean =>
    configuration.symbol_enabled ?? configuration.rules.some(rule => rule.enabled)
export const configuredRoomDurations = (configuration: PredictionConfiguration): string[] =>
    configuration.rules.filter(rule => legacyMasterOff(configuration) || rule.enabled_by_default).map(rule => rule.duration_seconds)
