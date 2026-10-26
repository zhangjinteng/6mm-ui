import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeGridDirectory } from './directory.ts'

test('通用目录只补展示，不生成站点配置或启用权限', () => {
    const products = [{ symbol: 'BTCUSDT', enabled: true }, { symbol: 'ETHUSDT', enabled: false }]
    const result = mergeGridDirectory(products, ['BTCUSDT', 'SOLUSDT', ' solusdt ', 'BAD/PAIR'])
    assert.deepEqual(result, [
        { symbol: 'BTCUSDT', enabled: true, configured: true },
        { symbol: 'SOLUSDT', enabled: false, configured: false },
        { symbol: 'ETHUSDT', enabled: false, configured: true },
    ])
    assert.equal(products.length, 2)
    assert.deepEqual(mergeGridDirectory([], ['BTCUSDT']), [{symbol: 'BTCUSDT', enabled: false, configured: false}])
})

test('目录缺失时保留全部已授权配置，切换站点不沿用上个站点的配置状态', () => {
    assert.deepEqual(mergeGridDirectory([{symbol: 'ABCUSDT', enabled: true}], []), [{symbol: 'ABCUSDT', enabled: true, configured: true}])
    assert.deepEqual(mergeGridDirectory([], ['ABCUSDT']), [{symbol: 'ABCUSDT', enabled: false, configured: false}])
})


test('开启优先后严格沿用平台sort顺序，不以配置存在或字母覆盖排序', () => {
    const result = mergeGridDirectory([
        {symbol:'ADAUSDT',enabled:false}, {symbol:'BTCUSDT',enabled:true},
        {symbol:'ETHUSDT',enabled:true}, {symbol:'SOLUSDT',enabled:false}
    ], ['SOLUSDT','ETHUSDT','BTCUSDT','ADAUSDT'])
    assert.deepEqual(result.map(row=>row.symbol), ['ETHUSDT','BTCUSDT','SOLUSDT','ADAUSDT'])
})
