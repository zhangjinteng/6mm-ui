import test from 'node:test'
import assert from 'node:assert/strict'
import { createInitialModel, creationSnapshot } from './creation.ts'
import { createSavePayload, validatePredictionModel, updatePlatformStake } from './form.ts'

function fill(model) {
    for (const rule of model.rules) {
        updatePlatformStake(rule, 'minimum_stake', '1')
        updatePlatformStake(rule, 'maximum_stake', '3000')
        if (rule.target_payout_rate) rule.target_payout_rate.default_value = '0.9'
        if (rule.maximum_odds) rule.maximum_odds.default_value = '5'
        if (rule.fixed_odds) rule.fixed_odds.default_value = '1.85'
    }
    return model
}

for (const game of ['UP_DOWN', 'HIGH_LOW']) {
    test(`${game} starts blank and cannot submit until required parameters are filled`, () => {
        const model = createInitialModel(game, 'BTCUSDT', '0')
        assert.equal(model.enabled, false)
        assert.equal(model.rules.length, 5)
        assert.ok(model.rules.every(r => r.price_rule.price_decimals === 3))
        assert.ok(model.rules.every(r => r.minimum_stake.default_value === '' && r.maximum_stake.default_value === ''))
        assert.ok(validatePredictionModel(model).length > 0)
        fill(model)
        assert.deepEqual(validatePredictionModel(model), [])
        model.enabled = true // Initial save must stay closed even if an old UI switch fires.
        const payload = createSavePayload(model, '首次创建', 'create-1')
        assert.equal(payload.platform_template.enabled, false)
        assert.ok(payload.platform_template.rules.every(r => r.settlement_display_seconds === '10' && r.price_rule.max_age_milliseconds === '5000' && r.price_rule.late_arrival_grace_milliseconds === '500'))
        assert.equal(payload.based_on_template_version, '0')
        assert.deepEqual(payload.platform_template.rules.map(r => r.duration_seconds), game === 'UP_DOWN' ? ['35','40','45','60','90'] : ['5','10','15','30','60'])
        assert.ok(payload.platform_template.rules.every(r => !r.market_id))
        if (game === 'UP_DOWN') {
            assert.ok(payload.platform_template.rules.every(r => !r.minimum_stake && r.stake_tiers.length === 1 && !r.stake_tiers[0].stake_tier_id && r.stake_tiers[0].maximum_stake.default_value === '3000'))
        }
    })
}

test('new models do not share mutable room constraints and existing edits still require identifiers', () => {
    const first = fill(createInitialModel('UP_DOWN', 'BTCUSDT', '0'))
    first.rules[0].maximum_stake.default_value = '4000'
    assert.equal(first.rules[1].maximum_stake.default_value, '3000')
    assert.equal(createInitialModel('UP_DOWN', 'ETHUSDT', '0').rules[0].maximum_stake.default_value, '')
    delete first.is_new
    assert.ok(validatePredictionModel(first).some(e => /房间.*(完整|标识)/.test(e)))
})

const existing = (game, symbol, version) => ({scope:'CONFIG_SCOPE_PLATFORM',template_version:version,rules:[{game_type:`GAME_TYPE_${game}`,symbol}]})
test('creation takes the shared template version from the other game and preserves int64 precision', () => {
    const row = existing('HIGH_LOW','ETHUSDT','9007199254740993')
    assert.deepEqual(creationSnapshot({configurations:[row]},'UP_DOWN','BTCUSDT'),{version:'9007199254740993',existing:undefined})
    assert.equal(creationSnapshot({configurations:[]},'UP_DOWN','BTCUSDT').version,'0')
    assert.equal(creationSnapshot({configurations:[row]},'HIGH_LOW','ETHUSDT').existing,row)
})
test('malformed or mixed-version reads cannot become an empty database initialization', () => {
    for (const response of [undefined,{}, {configurations:null},{configurations:[{rules:[]}]},
        {configurations:[existing('UP_DOWN','BTCUSDT','0')]},
        {configurations:[existing('UP_DOWN','BTCUSDT','1'),existing('HIGH_LOW','ETHUSDT','2')]}]) {
        assert.throws(()=>creationSnapshot(response,'UP_DOWN','BTCUSDT'))
    }
})
