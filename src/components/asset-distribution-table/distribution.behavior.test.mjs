import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { computed } from 'vue'
import { buildSync } from 'esbuild'

const source = readFileSync(new URL('./AssetDistributionTable.vue', import.meta.url), 'utf8')
const { descriptor, errors } = parse(source, { filename: new URL('./AssetDistributionTable.vue', import.meta.url).pathname })
const ast = ts.createSourceFile('Distribution.ts', descriptor.scriptSetup.content, ts.ScriptTarget.Latest, true)
const evaluate = (name, context = {}) => {
    if (name === 'formatBalance') return formatBalance
    if (name === 'formatCount') return formatCount
    if (name === 'formatShare') return formatShare
    const expression = ast.statements.filter(ts.isVariableStatement)
        .flatMap(statement => [...statement.declarationList.declarations])
        .find(item => item.name.getText(ast) === name)?.initializer.getText(ast)
    assert.ok(expression, name)
    const code = ts.transpileModule(`return (${expression})`, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText
    const deps = { computed, props: { showSources: true, request: context.getAssetDistribution }, ...context }
    const result = new Function(...Object.keys(deps), code)(...Object.values(deps))
    return result?.value ?? result
}
const formatterModule = { exports: {} }
new Function('module', 'exports', buildSync({
    entryPoints: [new URL('./formatters.ts', import.meta.url).pathname],
    bundle: true, write: false, platform: 'node', format: 'cjs',
}).outputFiles[0].text)(formatterModule, formatterModule.exports)
const { formatDistributionBalance: formatBalance, formatDistributionCount: formatCount,
    formatDistributionShare: formatShare } = formatterModule.exports

test('the asset distribution page compiles and uses the existing table and currency component', () => {
    assert.deepEqual(errors, [])
    assert.doesNotThrow(() => compileScript(descriptor, { id: 'asset-distribution', fs: { fileExists: existsSync, readFile: file => readFileSync(file, 'utf8') } }))
    assert.deepEqual(compileTemplate({ source: descriptor.template.content, filename: 'Distribution.vue', id: 'asset-distribution' }).errors, [])
    for (const style of descriptor.styles) {
        assert.deepEqual(compileStyle({ source: style.content, filename: 'Distribution.vue', id: 'asset-distribution', scoped: true }).errors, [])
    }
    assert.match(source, /<MmProTable/)
    assert.match(source, /<slot name="currency" :row="row"/)
    assert.match(source, /formatTimestamp\(row.updated_at\)/)
    assert.match(source, /row.snapshot_status === 'incomplete'/)
    assert.doesNotMatch(source, /余额调增|余额扣减|CreateFundingAdjustment|setInterval|user_type|home_site_id/)
})

test('columns cover both account balances, holders, price and actual snapshot update time', () => {
    const columns = evaluate('columns', { formatBalance: String, formatCount: String, formatShare: String })
    assert.deepEqual(columns.map(column => column.key), [
        'currency', 'account_type', 'source_name', 'source_type', 'funded_user_count',
        'total_balance', 'available_balance', 'restricted_balance', 'current_price', 'total_valuation', 'asset_share', 'updated_at'
    ])
    assert.deepEqual(columns.slice(0, 2).map(column => column.title), ['币种', '账户类型'])
    assert.deepEqual(columns.slice(4).map(column => column.title), [
        '持有用户数', '总余额（原币）', '可用余额（原币）', '受限余额（原币）', '当前价格（USDT）', '总估值（USDT）', '资产占比', '更新时间'
    ])
    assert.ok(columns.every(column => column.width >= 100))
    assert.equal(columns.at(-1).sortable, true)
    assert.equal(columns.find(column => column.key === 'current_price').sortable, undefined)
    assert.equal(columns.find(column => column.key === 'total_valuation').formatter, String)
    assert.equal(columns.find(column => column.key === 'total_valuation').sortable, true)
    assert.equal(columns.find(column => column.key === 'asset_share').sortable, true)
})

test('filters use user report aggregate scopes, rather than mutually exclusive user origins', () => {
    const fields = evaluate('queryFields')
    assert.deepEqual(fields.map(field => field.key), ['source_type', 'source_keyword', 'account_type'])
    assert.equal(fields[0].defaultValue, 'platform')
    assert.deepEqual(fields[0].options.map(option => option.value), ['platform', 'tenant', 'merchant'])
    assert.deepEqual(fields[2].options.map(option => option.value), ['', 'funding', 'contract'])
    assert.equal(fields[1].maxlength, 128)
})

test('balances display exactly two decimal places without float precision loss and preserve missing data', () => {
    const balance = evaluate('formatBalance')
    const count = evaluate('formatCount')
    for (const value of [null, undefined, '']) {
        assert.equal(balance(value), '-')
        assert.equal(count(value), '-')
    }
    assert.equal(balance('9007199254740993.1234567890123456'), '9,007,199,254,740,993.12')
    assert.equal(balance('0'), '0.00')
    assert.equal(balance('1234.1000000000000000'), '1,234.10')
    assert.equal(balance('0.00000001'), '0.00')
    assert.equal(balance('1234.125'), '1,234.13')
    assert.equal(balance('-1234.125'), '-1,234.13')
    assert.equal(count(1234), '1,234')
})

test('asset shares display two decimal percentage points without recalculating against visible rows', () => {
    const share = evaluate('formatShare')
    for (const value of [null, undefined, '']) assert.equal(share(value), '-')
    assert.equal(share('0'), '0.00%')
    assert.equal(share('75.0000000000000000'), '75.00%')
    assert.equal(share('100'), '100.00%')
    assert.equal(share('22.2222222222222222'), '22.22%')
    assert.equal(share('12.345'), '12.35%')
})

test('request forwards scope, account, sort, page and cancellation without mutating filters', async () => {
    const calls = []
    const request = evaluate('requestDistribution', { getAssetDistribution: async (...args) => { calls.push(args); return { rows: [], total: 0 } } })
    const signal = new AbortController().signal
    const filters = { source_type: 'tenant', source_keyword: ' 1001 ', account_type: 'funding' }
    await request({ filters, page: 2, pageSize: 30, signal, sort: { key: 'total_balance', order: 'desc' } })
    assert.deepEqual(calls[0], [{ source_type: 'tenant', source_keyword: '1001', account_type: 'funding',
        page_no: 2, page_size: 30, order_by: 'total_balance', order_dir: 'desc' }, { signal }])
    assert.equal(filters.source_keyword, ' 1001 ')
    await request({ filters: {}, page: 1, pageSize: 20, signal, sort: { key: '', order: null } })
    assert.equal(calls[1][0].source_type, 'platform')
    assert.equal(calls[1][0].account_type, '')
    assert.equal(calls[1][0].order_by, 'source_name')
    const failed = evaluate('requestDistribution', { getAssetDistribution: async () => { throw { msg: '无权访问' } } })
    await assert.rejects(failed({ filters, page: 1, pageSize: 20, signal, sort: { key: '', order: null } }), /无权访问/)
})
