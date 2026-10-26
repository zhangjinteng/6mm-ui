import test from 'node:test'
import assert from 'node:assert/strict'
import { initialGridConfiguration } from './creation.ts'
import { makeCommand, persistPending, attemptPending, readPending } from './model.ts'
const options={site_id:'1',symbol:'BTCUSDT',layout_version:'0',layout:null}
function filled(source){return {...source,target_rtp:'0.95',min_multiplier:'1.02',max_multiplier:'20',min_order_amount:'1',max_order_amount:'3000',layout:{...source.layout,column_duration_seconds:'2',price_band_width:'5'}}}
test('Grid creation defaults hidden dimensions to 10 by 10 while business fields stay blank and first save stays disabled',()=>{
 const source=initialGridConfiguration(options,'BTCUSDT')
 assert.equal(source.site_id,'1');assert.equal(source.enabled,false);assert.equal(source.target_rtp,'');assert.equal(source.layout.row_count,'10');assert.equal(source.layout.column_count,'10');assert.equal(source.layout.column_duration_seconds,'');assert.equal(source.layout.price_band_width,'')
 assert.throws(()=>makeCommand(source,source,'create','grid_create_test1',true,true))
 const command=makeCommand(source,{...filled(source),enabled:true},'create','grid_create_test1',true,true)
 assert.equal(command.based_on_site_version,'0');assert.equal(command.changes.enabled,false);assert.equal(command.changes.row_count,'10');assert.equal(command.changes.column_count,'10');assert.equal(command.based_on_config_id,undefined)
 assert.throws(()=>initialGridConfiguration({...options,symbol:'ETHUSDT'},'BTCUSDT'))
 assert.throws(()=>initialGridConfiguration({...options,site_id:''},'BTCUSDT'))
 const imprecise=filled(source);imprecise.layout.price_band_width='5.000000000';assert.throws(()=>makeCommand(source,imprecise,'create','grid_create_precision',true,true),/INVALID_LAYOUT_PRECISION/)
})
test('Grid first save accepts 10 seconds per column and rejects 11 seconds',()=>{
 const source=initialGridConfiguration(options,'BTCUSDT')
 const ten=filled(source);ten.layout.column_duration_seconds='10'
 assert.equal(makeCommand(source,ten,'create','grid_create_duration10',true,true).changes.column_duration_seconds,'10')
 const eleven=filled(source);eleven.layout.column_duration_seconds='11'
 assert.throws(()=>makeCommand(source,eleven,'create','grid_create_duration11',true,true),/INVALID_LAYOUT_DURATION/)
})
test('Grid existing layout is read-only during creation and is not sent as a layout change',()=>{
 const source=initialGridConfiguration({...options,layout_version:'9007199254740993',layout:{row_count:'20',column_count:'4',column_duration_seconds:'2',price_band_width:'5'}},'BTCUSDT')
 const command=makeCommand(source,filled(source),'create','grid_create_test2',true,true)
 assert.equal(source.layout.row_count,'20');assert.equal(source.layout.column_count,'4');assert.equal(source.layout.editable,false);assert.equal(command.based_on_layout_version,'9007199254740993');assert.equal(command.changes.row_count,undefined);assert.equal(command.changes.price_band_width,undefined)
 const changed=filled(source);changed.layout.price_band_width='6';assert.throws(()=>makeCommand(source,changed,'create','grid_create_test2',true,true))
})
test('Grid first save UNKNOWN persists zero versions and original body until receipt success',async()=>{
 const source=initialGridConfiguration(options,'BTCUSDT'),command=makeCommand(source,filled(source),'create','grid_create_test3',true,true)
 const map=new Map(),storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)}
 const pending=persistPending(storage,'42',command)
 const sent=[]
 const unknown=await attemptPending(storage,pending,'save',async(route,body)=>{sent.push(body);throw Error('timeout')})
 assert.equal(unknown.status,'unknown');assert.deepEqual(readPending(storage).command,command)
 const result=await attemptPending(storage,pending,'receipt',async(route,body)=>{sent.push(body);return {operation_status:'SUCCEEDED',operation_id:'1',site_id:'1',symbol:'BTCUSDT',layout_version:'1',site_version:'1',effective_from_ms:'123',changed:true,cache_state:'PENDING'}})
 assert.equal(result.status,'success');assert.deepEqual(sent[0],sent[1]);assert.equal(readPending(storage),null)
})
test('Grid new layout preserves explicit zero and omission while existing precision is readonly',()=>{
 for(const decimals of [undefined,0,8]) {
  const source=initialGridConfiguration(options,'BTCUSDT'),draft=filled(source)
  if(decimals!==undefined)draft.layout.price_decimals=decimals
  const command=makeCommand(source,draft,'create','grid_create_precision',true,true)
  assert.equal(command.changes.price_decimals,decimals)
 }
 const source=initialGridConfiguration({...options,layout_version:'1',layout:{row_count:'10',column_count:'10',column_duration_seconds:'2',price_band_width:'5',price_decimals:0}},'BTCUSDT')
 assert.equal(source.layout.price_decimals,0)
 const draft=filled(source)
 assert.equal('price_decimals' in makeCommand(source,draft,'create','grid_existing_precision',true,true).changes,false)
 draft.layout.price_decimals=8
 assert.throws(()=>makeCommand(source,draft,'create','grid_existing_precision',true,true),/FIELD_FORBIDDEN/)
})
