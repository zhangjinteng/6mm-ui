import test from 'node:test'
import assert from 'node:assert/strict'
import { mergeGridDirectory } from './directory.ts'

test('商户仅显示平台开启产品，自行关闭仍可见，通用目录不补回', () => {
    const products = [
        {symbol:'BTCUSDT', enabled:true, default_enabled:true},
        {symbol:'ETHUSDT', enabled:false, default_enabled:true},
        {symbol:'SOLUSDT', enabled:false, default_enabled:false}
    ]
    const result = mergeGridDirectory(products, ['SOLUSDT','ETHUSDT','BTCUSDT','ADAUSDT'])
    assert.deepEqual(result.map(p=>[p.symbol,p.enabled,p.configured]), [['BTCUSDT',true,true],['ETHUSDT',false,true]])
    assert.equal(products.length,3)
    assert.deepEqual(mergeGridDirectory([], ['BTCUSDT']), [])
})
test('平台排序仍按生效开启优先、同组平台顺序、缺目录时保留平台开启配置', () => {
    const products = ['ADAUSDT','BTCUSDT','ETHUSDT','SOLUSDT'].map(symbol=>({symbol,default_enabled:true,enabled:['BTCUSDT','ETHUSDT'].includes(symbol)}))
    assert.deepEqual(mergeGridDirectory(products,['SOLUSDT','ETHUSDT','BTCUSDT','ADAUSDT']).map(p=>p.symbol),['ETHUSDT','BTCUSDT','SOLUSDT','ADAUSDT'])
    assert.deepEqual(mergeGridDirectory([{symbol:'ABCUSDT',enabled:false,default_enabled:true}],[]).map(p=>p.symbol),['ABCUSDT'])
})
