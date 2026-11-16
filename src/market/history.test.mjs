import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { build } from 'esbuild'
import { parse } from '@vue/compiler-sfc'
import ts from 'typescript'
import { computed } from 'vue'

const { outputFiles } = await build({
    entryPoints: [new URL('./history.ts', import.meta.url).pathname],
    bundle: true,
    write: false,
    platform: 'node',
    format: 'esm'
})
const history = await import(
    'data:text/javascript;base64,' + Buffer.from(outputFiles[0].text).toString('base64')
)

test('only mark and index prices are available, with index price as the default', () => {
    assert.deepEqual(history.metricOptions, [
        { label: '标记价格', value: 'mark_price' },
        { label: '指数价格', value: 'index_price' }
    ])
    assert.equal(history.defaultMetric, 'index_price')
})

test('both available metrics use price OHLC labels', () => {
    assert.deepEqual(history.valueColumnTitles(), ['开盘价', '最高价', '最低价', '收盘价'])
})

async function tableConfig(getMarketHistory) {
    const source = await readFile(new URL('./MarketHistoryPage.vue', import.meta.url), 'utf8')
    const { descriptor } = parse(source)
    const ast = ts.createSourceFile(
        'history.ts',
        descriptor.scriptSetup.content,
        ts.ScriptTarget.Latest,
        true
    )
    const declarations = ast.statements
        .filter(ts.isVariableStatement)
        .flatMap((statement) => statement.declarationList.declarations)
    const queryFieldsCode = declarations
        .find((declaration) => declaration.name.getText(ast) === 'queryFields')
        .initializer.getText(ast)
    const tableCode = declarations
        .find(
            (declaration) =>
                declaration.initializer &&
                ts.isCallExpression(declaration.initializer) &&
                declaration.initializer.expression.getText(ast) === 'useMmProTable'
        )
        .initializer.getText(ast)
    const transpile = (code) =>
        ts.transpileModule(`(${code})`, {
            compilerOptions: { target: ts.ScriptTarget.ES2022 }
        }).outputText.replace(/^"use strict";\s*/, '')
    const queryFields = new Function(
        'computed',
        'optionsData',
        'metricOptions',
        'intervalOptions',
        'defaultMetric',
        `return ${transpile(queryFieldsCode)}`
    )(
        computed,
        { symbolList: [] },
        history.metricOptions,
        history.intervalOptions,
        history.defaultMetric
    )
    const config = new Function(
        'useMmProTable',
        'queryFields',
        'defaultMetric',
        'props',
        `let queryEndMs; return ${transpile(tableCode)}`
    )(
        (options) => options,
        queryFields,
        history.defaultMetric,
        { api: { history: getMarketHistory } }
    )
    return { config, queryFields }
}

test('initial query, reset field defaults and request fallback all use index price', async () => {
    const calls = []
    const { config, queryFields } = await tableConfig(async (params) => {
        calls.push(params)
        return { lists: [] }
    })
    const field = queryFields.value.find((field) => field.key === 'metric')
    assert.equal(field.defaultValue, 'index_price')
    assert.deepEqual(field.options, history.metricOptions)
    assert.equal(config.initialFilters.metric, 'index_price')
    for (const metric of [undefined, 'index_price', 'mark_price']) {
        await config.request({ filters: { metric }, signal: new AbortController().signal })
    }
    assert.deepEqual(
        calls.map((call) => call.metric),
        ['index_price', 'index_price', 'mark_price']
    )
})

test('paging sends the page and size and uses the server total instead of the current row count', async () => {
    const calls = []
    const row = { symbol: 'BTCUSDT', timestamp_ms: 1791439200000, open: '1', high: '2', low: '0', close: '1.5' }
    const { config } = await tableConfig(async (params) => {
        calls.push(params)
        return { lists: [row], count: 123, end_ms: 1791440520000 }
    })
    const result = await config.request({
        filters: { symbol: 'BTCUSDT', metric: 'mark_price', interval: '1h', range: '7d' },
        page: 3,
        pageSize: 40,
        reason: 'state-change',
        signal: new AbortController().signal
    })
    assert.deepEqual(calls[0], {
        symbol: 'BTCUSDT', metric: 'mark_price', interval: '1h', range: '7d',
        page_no: 3, page_size: 40, end_ms: undefined
    })
    assert.equal(result.total, 123)
    assert.equal(result.rows.length, 1)
    assert.equal(result.rows[0]._rowKey, `mark_price-BTCUSDT-${row.timestamp_ms}`)
})

test('page and page-size changes reuse the query window, while new queries and refreshes reset it', async () => {
    const anchor = 1791440520000
    const calls = []
    const { config } = await tableConfig(async (params) => {
        calls.push(params)
        return { lists: [], count: 123, end_ms: anchor }
    })
    const request = (reason, page = 1, pageSize = 20) => config.request({
        filters: {}, page, pageSize, reason, signal: new AbortController().signal
    })
    await request('initial')
    await request('state-change', 2)
    await request('state-change', 1, 40)
    await request('retry', 2)
    await request('query')
    await request('reset')
    await request('manual')
    assert.deepEqual(calls.map((call) => call.end_ms), [undefined, anchor, anchor, anchor, undefined, undefined, undefined])
})

test('an aborted older response does not replace the active query window', async () => {
    const calls = []
    const { config } = await tableConfig(async (params, signal) => {
        calls.push(params)
        return { lists: [], count: 100, end_ms: signal.aborted ? 1 : 1791440520000 }
    })
    const active = { filters: {}, page: 1, pageSize: 20, reason: 'initial', signal: new AbortController().signal }
    await config.request(active)
    const aborted = new AbortController()
    aborted.abort()
    await config.request({ ...active, reason: 'state-change', page: 2, signal: aborted.signal })
    await config.request({ ...active, reason: 'state-change', page: 3 })
    assert.equal(calls[2].end_ms, 1791440520000)
})

test('decimals and zero keep their original precision', () => {
    assert.equal(
        history.formatHistoryValue('12345678901234567890.0000001234500'),
        '12,345,678,901,234,567,890.00000012345'
    )
    assert.equal(history.formatHistoryValue('0.00000001000'), '0.00000001')
    assert.equal(history.formatHistoryValue('0'), '0')
    assert.equal(history.formatHistoryValue(null), '-')
})

test('UTC buckets display in the requested browser timezone', () => {
    const timestamp = Date.UTC(2026, 8, 30, 5)
    assert.equal(history.formatHistoryTime(timestamp, 'Asia/Shanghai'), '2026-09-30 13:00')
    assert.equal(history.formatHistoryTime(timestamp, 'UTC'), '2026-09-30 05:00')
})

test('the page uses native pro-table pagination and the complete contract catalog', async () => {
    const source = await readFile(new URL('./MarketHistoryPage.vue', import.meta.url), 'utf8')
    assert.match(source, /props\.api\.history/)
    assert.match(source, /props\.api\.symbols/)
    assert.doesNotMatch(source, /symbolListAll/)
    assert.match(source, /key: 'symbol',\s*label: '合约',\s*type: 'coin'/)
    assert.doesNotMatch(source, /getFundingRateOther/)
    assert.doesNotMatch(source, /:show-pagination="false"|显示最近|rows\.length/)
    assert.match(source, /:page-sizes="\[20, 30, 40\]"/)
    assert.match(source, /initialPageSize: 20/)
    assert.match(source, /mm-segmented/)
    assert.doesNotMatch(source, /last_price|open_interest|isSnapshotMetric|分钟快照/)
})

test('the extra description and timezone footer are removed without changing time formatting', async () => {
    const source = await readFile(new URL('./MarketHistoryPage.vue', import.meta.url), 'utf8')
    assert.doesNotMatch(source, /<footer|history-page__footer|history-page__timezone|displayTimeZone|缺失数据不补值/)
    assert.doesNotMatch(source, /border-bottom-(left|right)-radius:\s*0/)
    assert.match(source, /formatter: \(value\) => formatHistoryTime\(value\)/)
})
