import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { build } = require('esbuild')
import { fileURLToPath } from 'node:url'
const modules = new Map()
async function subject(name) {
 if (!modules.has(name)) {
  const entry=fileURLToPath(new URL('./'+name+'.ts',import.meta.url))
  const r=await build({entryPoints:[entry],bundle:true,write:false,platform:'node',format:'esm'})
  modules.set(name,await import('data:text/javascript;base64,'+Buffer.from(r.outputFiles[0].text).toString('base64')))
 }
 return modules.get(name)
}
const periods=['35','40','45','60','90']
const fixture=()=>({stored:{site_id:'910003',game_type:'GAME_TYPE_UP_DOWN',symbol:'BTCUSDT',version:'8',based_on_public_version:'9',enabled:false,overrides:periods.map(duration_seconds=>({game_type:'GAME_TYPE_UP_DOWN',symbol:'BTCUSDT',duration_seconds,enabled:true,stake_tiers:[{stake_tier_id:'tier-'+duration_seconds,enabled:true,maximum_stake:'500'}]}))},effective:{site_id:'910003',game_type:'GAME_TYPE_UP_DOWN',symbol:'BTCUSDT',public_version:'7',site_version:'8',based_on_public_version:'9',enabled:false,rules:periods.map(duration_seconds=>({game_type:'GAME_TYPE_UP_DOWN',symbol:'BTCUSDT',duration_seconds,enabled:false,bet_open_seconds:'30',target_payout_rate:'0.9',minimum_odds:'1',maximum_odds:'5',stake_tiers:[{stake_tier_id:'tier-'+duration_seconds,enabled:false,retired:false,minimum_stake:'1',maximum_stake:'100'}]}))},adjustments:[]})
const actor={operator_id:'101',agent_id:'100'}
const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k),data}}
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return {promise,resolve,reject}}
async function sample(){const m=await subject('site-model'),config=fixture();return m.makeSiteBody(config,m.siteRows(config),false,'调整限额','original-request')}
const success=body=>({stored:{...fixture().stored,version:'9',based_on_public_version:body.based_on_public_version,enabled:body.enabled},receipt:{operation_id:'receipt-original',operator_id:'101',client_request_id:body.client_request_id,source_service:'agent_admin',action:'ADMIN_ACTION_SITE_CONFIG_PUBLISH',capability:'prediction.site.config.publish',target_type:'site_config',target_id:'site-v1:'+ 'a'.repeat(64),reason:body.reason,result:'OPERATION_RESULT_SUCCEEDED',error_code:'',trace_id:'original-trace',created_at_ms:'1',completed_at_ms:'2',before_json:'e30=',after_json:'e30='}})
test('stored enables and clamped maximum survive aggregate disable; absent overrides remain absent',async()=>{
 const m=await subject('site-model'),c=fixture();delete c.stored.overrides[1].enabled;delete c.stored.overrides[1].stake_tiers[0].enabled;delete c.stored.overrides[1].stake_tiers[0].maximum_stake
 const rows=m.siteRows(c);assert.equal(rows[0].enabled,true);assert.equal(rows[0].maximum_stake,'500')
 const body=m.makeSiteBody(c,rows,false,'调整限额','request');assert.equal(body.enabled,false);assert.equal(body.overrides[0].enabled,true);assert.equal(body.overrides[0].stake_tiers[0].maximum_stake,'500')
 assert.equal(Object.hasOwn(body.overrides[1],'enabled'),false);assert.equal(Object.hasOwn(body.overrides[1].stake_tiers[0],'maximum_stake'),false)
 rows[0].maximum_stake='9007199254740993.000001';const raised=m.makeSiteBody(c,rows,true,'调整限额','request');assert.equal(raised.overrides[0].stake_tiers[0].maximum_stake,'9007199254740993.000001')
 assert.equal(raised.based_on_public_version,'7');assert.equal(raised.based_on_site_version,'8')
})
test('unknown pending replays original once, survives later rejection, leaves legacy key untouched',async()=>{
 const m=await subject('site-mutation'),storage=memory(),body=await sample();storage.setItem('prediction.agent.pending.v1','legacy-unchanged')
 const p=m.persistSitePending(storage,actor,body);let calls=0;const d=deferred();const send=b=>{calls++;assert.deepEqual(b,body);return d.promise}
 const a=m.dispatchSitePending(storage,p,send),b=m.dispatchSitePending(storage,p,send);assert.equal(a,b);await Promise.resolve();assert.equal(calls,1)
 d.reject({error_code:'UNKNOWN'});assert.equal((await a).status,'unknown');assert.throws(()=>{body.reason='rewritten'});const restored=m.readSitePending(storage);assert.equal(restored.body.reason,'调整限额')
 assert.equal((await m.dispatchSitePending(storage,restored,async b=>{calls++;assert.equal(b.client_request_id,'original-request');throw {error_code:'CONFLICT'}})).status,'unknown')
 assert.equal(calls,2);assert.ok(m.readSitePending(storage));assert.equal(storage.getItem('prediction.agent.pending.v1'),'legacy-unchanged')
})
test('success commits receipt before detail refresh fails and cannot dispatch completed pending again',async()=>{
 const m=await subject('site-mutation'),storage=memory(),body=await sample(),p=m.persistSitePending(storage,actor,body);let writes=0
 let reads=0
 const result=await m.dispatchSitePendingWithRefresh(storage,p,async()=>{writes++;return success(body)},async()=>{reads++;assert.equal(m.readSitePending(storage),null);throw new Error('detail unavailable')})
 assert.equal(result.status,'success');assert.equal(m.readSitePending(storage),null)
 assert.equal(result.refreshFailed,true);assert.equal(result.latest,null);assert.equal(reads,1);assert.equal(m.readSitePending(storage),null)
 assert.throws(()=>m.dispatchSitePending(storage,p,async()=>{writes++;return success(body)}));assert.equal(writes,1)
})
test('receipt for different actor or stored target is unknown and preserves pending',async()=>{
 const m=await subject('site-mutation'),body=await sample()
 for(const mutate of [r=>r.stored.site_id='910004',r=>r.receipt.operator_id='102',r=>r.receipt.action='ADMIN_ACTION_AGENT_CONFIG_PUBLISH']){
  const storage=memory(),p=m.persistSitePending(storage,actor,body),r=success(body);mutate(r)
  assert.equal((await m.dispatchSitePending(storage,p,async()=>r)).status,'unknown');assert.ok(m.readSitePending(storage))
 }
})
test('confirmation/read binding expires on actor root site symbol or version switch',async()=>{
 const m=await subject('site-model'),c=fixture(),original=m.siteBinding(actor,c),gate=new m.SiteIntentGate();const ticket=gate.next(original)
 assert.equal(ticket.current(original),true)
 for(const change of [x=>x.operator_id='102',x=>x.agent_id='999',x=>x.site_id='910004',x=>x.symbol='ETHUSDT',x=>x.public_version='8',x=>x.site_version='9']){const other={...original};change(other);assert.equal(ticket.current(other),false)}
 gate.close();assert.equal(ticket.current(original),false)
})

test('HTTP request ID works with randomUUID absent and only secure getRandomValues available', async () => {
 const m=await subject('site-model')
 const insecureCrypto={getRandomValues(bytes){bytes.forEach((_,index)=>{bytes[index]=index});return bytes}}
 assert.equal(insecureCrypto.randomUUID,undefined)
 const descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto')
 try {
  Object.defineProperty(globalThis,'crypto',{configurable:true,value:insecureCrypto})
  const id=m.siteRequestId()
  assert.equal(id,'00010203-0405-4607-8809-0a0b0c0d0e0f')
  const c=fixture(),body=m.makeSiteBody(c,m.siteRows(c),false,'调整限额',id)
  assert.equal(body.client_request_id,id);assert.ok(Object.isFrozen(body))
 } finally {
  if(descriptor) Object.defineProperty(globalThis,'crypto',descriptor)
  else delete globalThis.crypto
 }
})

const highlowFixture=()=>({stored:{site_id:'910003',game_type:'GAME_TYPE_HIGH_LOW',symbol:'BTCUSDT',version:'8',based_on_public_version:'9',enabled:false,overrides:[{game_type:'GAME_TYPE_HIGH_LOW',symbol:'BTCUSDT',duration_seconds:'30',stake_tiers:[],fixed_odds:'1.95',maximum_stake:'5000'},{game_type:'GAME_TYPE_HIGH_LOW',symbol:'BTCUSDT',duration_seconds:'300',stake_tiers:[]}]},effective:{site_id:'910003',game_type:'GAME_TYPE_HIGH_LOW',symbol:'BTCUSDT',public_version:'7',site_version:'8',based_on_public_version:'9',enabled:false,rules:['30','300'].map(duration_seconds=>({game_type:'GAME_TYPE_HIGH_LOW',symbol:'BTCUSDT',duration_seconds,enabled:false,bet_open_seconds:'0',fixed_odds:'1.85',minimum_stake:'1',maximum_stake:'3000',stake_tiers:[]}))},adjustments:[]})
test('site catalog keeps both games separate and rejects duplicated games',async()=>{
 const m=await subject('site-model');const catalog={actor,sites:[{site_id:'910003',games:[{game_type:'HIGH_LOW',symbols:['BTCUSDT']},{game_type:'UP_DOWN',symbols:['ETHUSDT']}]}]}
 assert.doesNotThrow(()=>m.assertTargets(catalog));catalog.sites[0].games[1].game_type='HIGH_LOW';assert.throws(()=>m.assertTargets(catalog))
})
test('highlow uses real periods, preserves inherited and clamped fields, and rejects invalid odds or limits',async()=>{
 const m=await subject('site-model'),c=highlowFixture();m.assertSiteRead(c,'910003','BTCUSDT','HIGH_LOW')
 const rows=m.siteRows(c);assert.deepEqual(rows.map(r=>r.duration_seconds),['30','300']);assert.equal(rows[0].fixed_odds,'1.95');assert.equal(rows[0].maximum_stake,'5000')
 let body=m.makeSiteBody(c,rows,false,'自选参数','original-highlow');assert.equal(body.game_type,'HIGH_LOW');assert.equal(Object.hasOwn(body.overrides[0],'stake_tiers'),false);assert.equal(body.overrides[0].fixed_odds,'1.95');assert.equal(body.overrides[0].maximum_stake,'5000');assert.equal(Object.hasOwn(body.overrides[1],'fixed_odds'),false)
 rows[1].maximum_stake='9007199254740993.000001';body=m.makeSiteBody(c,rows,true,'自选参数','original-highlow');assert.equal(body.overrides[1].maximum_stake,'9007199254740993.000001')
 rows[0].fixed_odds='1';assert.throws(()=>m.makeSiteBody(c,rows,true,'自选参数','id'));rows[0].fixed_odds='1.9';rows[0].minimum_stake='6000';assert.throws(()=>m.makeSiteBody(c,rows,true,'自选参数','id'))
 rows[0].minimum_stake='1';rows[0].fixed_odds='2';assert.throws(()=>m.makeSiteBody(c,rows,true,'自选参数','id'))
 assert.throws(()=>m.assertSiteRead(c,'910003','BTCUSDT','UP_DOWN'))
})
test('highlow UNKNOWN replays the original game and rejects a receipt from UP_DOWN',async()=>{
 const m=await subject('site-model'),s=await subject('site-mutation'),c=highlowFixture(),storage=memory();const body=m.makeSiteBody(c,m.siteRows(c),false,'自选参数','highlow-original'),p=s.persistSitePending(storage,actor,body)
 assert.equal((await s.dispatchSitePending(storage,p,async()=>{throw {error_code:'UNKNOWN'}})).status,'unknown')
 let restored=s.readSitePending(storage);assert.equal(restored.body.game_type,'HIGH_LOW')
 const wrong=success(body);assert.equal((await s.dispatchSitePending(storage,restored,async()=>wrong)).status,'unknown');assert.ok(s.readSitePending(storage))
 const right={...success(body),stored:{...c.stored,version:'9',based_on_public_version:body.based_on_public_version}};
 const result=await s.dispatchSitePending(storage,s.readSitePending(storage),async request=>{assert.deepEqual(request,body);return right});assert.equal(result.status,'success');assert.equal(s.readSitePending(storage),null)
 const binding=m.siteBinding(actor,c),gate=new m.SiteIntentGate(),ticket=gate.next(binding);assert.equal(binding.game_type,'HIGH_LOW');assert.equal(ticket.current({...binding,game_type:'UP_DOWN'}),false)
})


test('a newer public period set can coexist with stored historical periods',async()=>{
 const m=await subject('site-model'),c=highlowFixture();c.effective.public_version='10';c.effective.rules=c.effective.rules.slice(0,1);c.effective.rules[0].duration_seconds='60'
 assert.doesNotThrow(()=>m.assertSiteRead(c,'910003','BTCUSDT','HIGH_LOW'))
 const body=m.makeSiteBody(c,m.siteRows(c),false,'使用当前周期','new-public');assert.deepEqual(body.overrides.map(r=>r.duration_seconds),['60'])
 c.effective.public_version=c.stored.based_on_public_version;assert.throws(()=>m.assertSiteRead(c,'910003','BTCUSDT','HIGH_LOW'))
})

test('saving another field cannot silently enable a new public HIGH_LOW period',async()=>{
 const m=await subject('site-model'),c=highlowFixture();c.stored.enabled=true;c.effective.enabled=true;c.effective.public_version='10'
 c.effective.rules.push({...c.effective.rules[0],duration_seconds:'600',enabled:false})
 const rows=m.siteRows(c);rows[0].maximum_stake='6000'
 const body=m.makeSiteBody(c,rows,true,'修改既有周期','keep-new-disabled')
 assert.equal(body.overrides.find(r=>r.duration_seconds==='600').enabled,false)
})


test('SITE directory uses platform defaults independently of merchant enabled and never restores generic symbols', async () => {
 const m=await subject('site-directory')
 const source={configurations:['BTCUSDT','ETHUSDT','SOLUSDT'].map(symbol=>({rules:[{game_type:'GAME_TYPE_HIGH_LOW',symbol,enabled:false,enabled_by_default:symbol!=='SOLUSDT'}]}))}
 const keys=m.publicSymbols(source,'HIGH_LOW');assert.deepEqual(keys,['BTCUSDT','ETHUSDT'])
 const allowed=['BTCUSDT','ETHUSDT','SOLUSDT'];const rows=m.symbolDirectory(allowed,keys,['SOLUSDT','ETHUSDT','BTCUSDT','ADAUSDT'])
 assert.deepEqual(rows.map(x=>x.symbol),['ETHUSDT','BTCUSDT'])
 assert.deepEqual(m.symbolDirectory(allowed,keys,['ETHUSDT','BTCUSDT'],['BTCUSDT']).map(x=>x.symbol),['BTCUSDT','ETHUSDT'])
 assert.deepEqual(m.symbolDirectory(allowed,[],['BTCUSDT']),[])
 assert.deepEqual(allowed,['BTCUSDT','ETHUSDT','SOLUSDT'])
 assert.throws(()=>m.publicSymbols(source,'UP_DOWN'));assert.throws(()=>m.publicSymbols({configurations:[{rules:[]}]},'HIGH_LOW'))
 assert.throws(()=>m.symbolDirectory(allowed,keys,['bad symbol']))
})
