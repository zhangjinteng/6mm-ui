import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
    updatePlatformStake,
    createEditModel,
    createSavePayload,
    summarizePredictionValidationErrors,
    nextDurationSeconds,
    validatePredictionModel
} from './form.ts'
import { createInitialModel } from './creation.ts'

const decimalField = (value, minimum = '0.10', maximum = '100000.00') => ({
    value,
    template_value: value,
    default_value: value,
    minimum_value: minimum,
    maximum_value: maximum,
    agent_editable: true,
    overridden: false
})

const configurationFixture = () => ({
    scope: 'CONFIG_SCOPE_PLATFORM',
    template_version: '9223372036854775807',
    agent_version: '0',
    effective_version: 'platform:8',
    updated_at_ms: '1788192000000',
    rules: [
        {
            validation_status: 'CONFIG_VALIDATION_STATUS_VALID',
            game_type: 'GAME_TYPE_UP_DOWN',
            symbol: 'BTCUSDT',
            duration_seconds: '60',
            enabled: true,
            enabled_by_default: true,
            bet_open_seconds: {
                value: '55',
                template_value: '55',
                default_value: '55',
                minimum_value: '1',
                maximum_value: '59',
                agent_editable: true,
                overridden: false
            },
            target_payout_rate: decimalField('0.90', '0.50', '0.99'),
            minimum_odds: decimalField('1.10', '1.01', '2.00'),
            maximum_odds: decimalField('3.00', '2.00', '10.00'),
            minimum_stake: decimalField('1.00'),
            maximum_stake: decimalField('3000.00'),
            settlement_display_seconds: '3',
            price_rule: {
                max_age_milliseconds: '3000',
                late_arrival_grace_milliseconds: '1000'
            },
            market_id: 'up_down:BTCUSDT:60',
            stake_tiers: [
                {
                    stake_tier_id: 'tier-1',
                    enabled: true,
                    enabled_by_default: true,
                    display_order: 1,
                    minimum_stake: decimalField('1.00'),
                    maximum_stake: decimalField('100.00'),
                    retired: false
                }
            ]
        }
    ]
})

test('detail conversion preserves identifiers and precise strings in save payload', () => {
    const model = createEditModel(configurationFixture())
    const payload = createSavePayload(model, '调整测试配置', 'request-1')

    assert.equal(model.game_type, 'UP_DOWN')
    assert.equal(model.based_on_template_version, '9223372036854775807')
    assert.equal(payload.based_on_template_version, '9223372036854775807')
    assert.equal(payload.platform_template.rules[0].stake_tiers[0].minimum_stake.default_value, '1.00')
    assert.equal(payload.platform_template.rules[0].stake_tiers?.[0].stake_tier_id, 'tier-1')
    assert.deepEqual(payload.platform_template.rules[0].minimum_odds, { default_value: '1', minimum_value: '1', maximum_value: '1', agent_editable: false })
    assert.equal('game_type' in payload.platform_template.rules[0], false)
    assert.equal('symbol' in payload.platform_template.rules[0], false)
})

test('validation rejects duplicate durations and decimal defaults outside configured bounds', () => {
    const model = createEditModel(configurationFixture())
    const duplicatedRule = structuredClone(model.rules[0])
    model.rules.push(duplicatedRule)
    model.rules[0].minimum_stake.default_value = '100000.01'

    const errors = validatePredictionModel(model)

    assert.equal(errors.includes('周期 60 秒重复'), true)
    assert.equal(errors.includes('60 秒周期的最低下注额默认值必须处于上下限之间'), true)
})

test('new payout and fixed odds must stay strictly below their business ceilings', () => {
    const up = createInitialModel('UP_DOWN', 'BTCUSDT', '1')
    up.rules[0].target_payout_rate.default_value = '1'
    assert.ok(validatePredictionModel(up).includes('35 秒周期的目标返奖率必须小于 100%'))
    up.rules[0].target_payout_rate.default_value = '1.01'
    assert.ok(validatePredictionModel(up).includes('35 秒周期的目标返奖率必须小于 100%'))

    const highLow = createInitialModel('HIGH_LOW', 'BTCUSDT', '1')
    highLow.rules[0].fixed_odds.default_value = '2'
    assert.ok(validatePredictionModel(highLow).includes('5 秒周期的固定赔率必须小于 2'))
    highLow.rules[0].fixed_odds.default_value = '2.01'
    assert.ok(validatePredictionModel(highLow).includes('5 秒周期的固定赔率必须小于 2'))
})

test('first-save errors identify the current room without dumping every field of five rooms', () => {
    const model = createInitialModel('UP_DOWN', 'LTCUSDT', '1')
    const errors = validatePredictionModel(model)
    const summary = summarizePredictionValidationErrors(errors, model.game_type, '35')
    assert.match(summary, /5 秒/)
    assert.match(summary, /10、15、30、60 秒/)
    assert.ok(summary.length < 180, summary)
})

test('legacy configuration is readable but cannot be published as final UP_DOWN', () => {
    assert.notEqual(validatePredictionModel(createEditModel(configurationFixture())).length, 0)
})

test('next duration keeps int64 precision', () => {
    assert.equal(nextDurationSeconds('9223372036854775747'), '9223372036854775807')
    assert.equal(nextDurationSeconds('invalid'), '60')
})

test('room stake limits fall back to the live stake tier when the rule omits them', () => {
    // 测试服真实数据形态：涨跌规则只在 stake_tiers 里带最低/最高下注额，
    // 规则级 minimum_stake/maximum_stake 缺省；页面必须能正常打开。
    const configuration = configurationFixture()
    const rule = configuration.rules[0]
    delete rule.minimum_stake
    delete rule.maximum_stake
    rule.stake_tiers[0].minimum_stake = decimalField('1', '1', '1')
    rule.stake_tiers[0].maximum_stake = decimalField('3000', '100', '100000')

    const model = createEditModel(configuration)

    assert.equal(model.rules[0].minimum_stake.default_value, '1')
    assert.equal(model.rules[0].maximum_stake.default_value, '3000')
    const payload = createSavePayload(model, '载入生产配置', 'request-2')
    assert.equal(payload.platform_template.rules[0].stake_tiers[0].minimum_stake.default_value, '1')
    assert.equal(
        payload.platform_template.rules[0].stake_tiers[0].maximum_stake.default_value,
        '3000'
    )
})

test('retired tiers are skipped and a rule without stake_tiers still loads', () => {
    const retired = configurationFixture()
    retired.rules[0].stake_tiers = [
        { ...retired.rules[0].stake_tiers[0], stake_tier_id: 'tier-old', retired: true, minimum_stake: decimalField('5', '5', '5'), maximum_stake: decimalField('900', '900', '900') },
        { ...retired.rules[0].stake_tiers[0], stake_tier_id: 'tier-live', retired: false, minimum_stake: decimalField('1', '1', '1'), maximum_stake: decimalField('3000', '100', '100000') }
    ]
    delete retired.rules[0].minimum_stake
    delete retired.rules[0].maximum_stake
    assert.equal(createEditModel(retired).rules[0].minimum_stake.default_value, '1')

    const withoutTiers = configurationFixture()
    withoutTiers.rules[0].stake_tiers = undefined
    const model = createEditModel(withoutTiers)
    assert.equal(model.rules[0].maximum_stake.default_value, '3000.00')
    assert.equal(model.rules[0].stake_tiers, undefined)
})

test('a rule with neither rule-level nor tier stake limits reports a readable error', () => {
    const broken = configurationFixture()
    delete broken.rules[0].minimum_stake
    delete broken.rules[0].maximum_stake
    broken.rules[0].stake_tiers = []

    assert.throws(() => createEditModel(broken), /缺少.*下注限制/)
})

test('every configuration captured from the test server opens in the editor', () => {
    // 2026-09-12 从 192.168.10.250 管理端 gRPC 真实抓取的 ListSymbolConfigs 样本
    // （涨跌 + 自选各一条，含全部房间/周期）。
    const payload = JSON.parse(
        readFileSync(new URL('./fixtures/test-server-configs.sample.json', import.meta.url), 'utf8')
    )

    assert.equal(payload.length > 0, true)
    for (const configuration of payload) {
        const model = createEditModel(configuration)
        assert.equal(model.rules.length, configuration.rules[0].game_type === 'GAME_TYPE_HIGH_LOW' ? 5 : configuration.rules.length)
        for (const rule of model.rules) {
            assert.equal(typeof rule.minimum_stake.default_value, 'string')
            assert.equal(typeof rule.maximum_stake.default_value, 'string')
            assert.equal(rule.minimum_stake.default_value.length > 0, true)
            assert.equal(rule.maximum_stake.default_value.length > 0, true)
        }
    }
})


test('prototype percentage conversion keeps every decimal digit and incomplete input', async () => {
    const f = await import('./form.ts')
    assert.equal(typeof f.percentageToDecimal, 'function', 'exact percentage input conversion is required')
    assert.equal(typeof f.decimalToPercentage, 'function')
    assert.equal(f.decimalToPercentage('0.970000000000000001'), '97.0000000000000001')
    assert.equal(f.percentageToDecimal('97.0000000000000001'), '0.970000000000000001')
    assert.equal(f.decimalToPercentage('0.9'), '90')
    assert.equal(f.percentageToDecimal('90'), '0.90')
    assert.equal(f.percentageToDecimal(''), '')
    assert.equal(f.percentageToDecimal('invalid'), 'invalid')
})

function finalFiveRoomModel() {
 const model=createEditModel(configurationFixture())
 model.rules=['35','40','45','60','90'].map(duration=>{const r=structuredClone(model.rules[0]);r.duration_seconds=duration;r.bet_open_seconds={default_value:'30',minimum_value:'30',maximum_value:'30',agent_editable:false};r.market_id='market-'+duration;r.stake_tiers[0].stake_tier_id='tier-'+duration;for(const k of ['target_payout_rate','minimum_odds','maximum_odds'])r[k].agent_editable=false;return r})
 return model
}
test('platform rooms allow editable positive minimum and reject inverted effective limits',()=>{
 const model=finalFiveRoomModel()
 model.rules[0].minimum_stake={default_value:'0.5',minimum_value:'0.5',maximum_value:'100',agent_editable:true}
 model.rules[0].maximum_stake={default_value:'100',minimum_value:'0.5',maximum_value:'100',agent_editable:true}
 assert.deepEqual(validatePredictionModel(model),[])
 const payload=createSavePayload(model,'调整单笔范围','min-change')
 assert.equal(payload.platform_template.rules[0].stake_tiers[0].minimum_stake.default_value,'0.5')
 model.rules[0].minimum_stake={default_value:'101',minimum_value:'101',maximum_value:'101',agent_editable:true}
 assert.ok(validatePredictionModel(model).some(e=>e.includes('最小额不能大于最大额')))
})

test('editing displayed platform limits updates the effective default and both envelopes',()=>{
 const model=finalFiveRoomModel(), rule=model.rules[0]
 updatePlatformStake(rule,'minimum_stake','0.5')
 updatePlatformStake(rule,'maximum_stake','200')
 assert.equal(rule.minimum_stake.default_value,'0.5')
 assert.equal(rule.maximum_stake.default_value,'200')
 for(const c of [rule.minimum_stake,rule.maximum_stake]){assert.equal(c.minimum_value,'0.5');assert.equal(c.maximum_value,'200')}
 assert.equal(model.rules[1].minimum_stake.default_value,'1.00')
})


test('自选编辑为固定五周期，保留同周期身份，新增按原型且不挪用旧market', () => {
    const saved = JSON.parse(readFileSync(new URL('./fixtures/test-server-configs.sample.json', import.meta.url), 'utf8')).find(c=>c.rules[0].game_type==='GAME_TYPE_HIGH_LOW')
    const model=createEditModel(saved)
    assert.deepEqual(model.rules.map(r=>r.duration_seconds),['5','10','15','30','60'])
    for(const row of model.rules.slice(0,4)) {
        assert.equal(row.market_id,undefined)
        assert.equal(row.fixed_odds.default_value,'1.85')
        assert.equal(row.minimum_stake.default_value,'1')
        assert.equal(row.maximum_stake.default_value,'3000')
    }
    assert.equal(model.rules[4].market_id,saved.rules[0].market_id)
    assert.equal(validatePredictionModel(model).length,0)
    model.rules[0].duration_seconds='180'
    assert.ok(validatePredictionModel(model).some(error=>error.includes('五个固定')))
})

test('explicit coin switch remains independent from room presence including all rooms deleted', () => {
    const config = configurationFixture()
    config.symbol_enabled = true
    for (const rule of config.rules) { rule.enabled = false; rule.enabled_by_default = false }
    const model = createEditModel(config)
    assert.equal(model.enabled, true)
    assert.equal(model.rules[0].enabled_by_default, false)
    model.enabled = false
    const body = createSavePayload(model, '删除房间', 'delete-room')
    assert.equal(body.platform_template.enabled, false)
    assert.equal(body.platform_template.rules[0].enabled_by_default, false)
    assert.equal(body.platform_template.rules[0].stake_tiers[0].enabled_by_default, false)
    assert.equal(body.platform_template.rules[0].stake_tiers[0].stake_tier_id, 'tier-1')
})
test('legacy master-off configuration displays preserved rooms without treating them as deleted', () => {
    const config = configurationFixture()
    for (const rule of config.rules) { rule.enabled = false; rule.enabled_by_default = false }
    const model = createEditModel(config)
    assert.equal(model.enabled, false)
    assert.equal(model.rules[0].enabled_by_default, true)
    config.symbol_enabled = false
    assert.equal(createEditModel(config).rules[0].enabled_by_default, false)
})

test('price precision defaults to three only in the edit draft and preserves explicit zero',()=>{
 for(const n of [undefined,0,8]){
  const cfg=configurationFixture();for(const r of cfg.rules)if(n!==undefined)r.price_rule.price_decimals=n
  const model=createEditModel(cfg),payload=createSavePayload(model,'精度','precision')
  assert.ok(model.rules.every(r=>r.price_rule.price_decimals===(n ?? 3)))
  assert.ok(payload.platform_template.rules.every(r=>r.price_rule.price_decimals===(n ?? 3)))
  if(n===undefined)assert.ok(cfg.rules.every(r=>!Object.hasOwn(r.price_rule,'price_decimals')))
 }
})
test('price precision validates integer zero through eight and consistent periods',()=>{
 for(const n of [-1,9,1.5,null,'8']){
  const model=createEditModel(configurationFixture());for(const r of model.rules)r.price_rule.price_decimals=n
  assert.ok(validatePredictionModel(model).some(e=>e.includes('价格小数位')),String(n))
 }
 const model=createEditModel(configurationFixture());model.rules.push(structuredClone(model.rules[0]));model.rules[0].price_rule.price_decimals=0;model.rules[1].price_rule.price_decimals=8
 assert.ok(validatePredictionModel(model).some(e=>e.includes('价格小数位')))
})
