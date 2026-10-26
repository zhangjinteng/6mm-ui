import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {dirname,resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {build} from 'esbuild'
import {parse,compileScript} from '@vue/compiler-sfc'
import {createRenderer,reactive,nextTick} from 'vue'
import {persistPending,readPending} from './model.ts'
const root=dirname(fileURLToPath(import.meta.url)),src=resolve(root,'../../..')
const output=await build({stdin:{contents:compileScript(parse(await readFile(resolve(root,'index.vue'),'utf8')).descriptor,{id:'grid-directory'}).content.replace(/import \{ El(?!MessageBox)[^\n]+from 'element-plus'\n/g,''),resolveDir:root,loader:'ts'},bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'fixtures',setup(b){
 b.onResolve({filter:/runtime$/},a=>({path:a.path,namespace:'sdk-runtime'}));
 b.onLoad({filter:/.*/,namespace:'sdk-runtime'},()=>({contents:`export const useConfigSymbol=()=>({});export const useConfigUser=()=>globalThis.__gridPage.user;export const useConfigBeforeLeave=()=>{};export const useAgentConfigRuntime=()=>({grid:new Proxy({}, {get:(_,key)=>(...a)=>globalThis.__gridPage.api[key](...a)})});`}));

 b.onResolve({filter:/^vue$/},()=>({path:import.meta.resolve('vue'),external:true}))
 b.onResolve({filter:/^(vue-router|element-plus|@\/stores\/modules\/user|@\/api\/grid\/config)$/},a=>({path:a.path,namespace:'fixture'}))
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:a.path==='vue-router'?'export const onBeforeRouteLeave=()=>{}':a.path==='element-plus'?'export const ElMessageBox={confirm:(...args)=>globalThis.__gridPage.confirm(...args)}':a.path.includes('/stores/')?'export default ()=>globalThis.__gridPage.user':['initializeGridMerchant','gridConfigSymbols','gridConfigCatalog','gridConfigReceipt','gridConfigSite','saveGridConfig'].map(n=>`export const ${n}=(...a)=>globalThis.__gridPage.api.${n}(...a)`).join(';')}))
 b.onResolve({filter:/^@\//},a=>({path:resolve(src,a.path.slice(2)+(a.path.endsWith('/format')?'.ts':''))}))
 b.onLoad({filter:/\.vue$/},()=>({contents:'export default {}',loader:'ts'}))
}}]})
const Component=(await import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text).toString('base64'))).default
Component.render=()=>null
const renderer=createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),setText(){},setElementText(){},parentNode(){},nextSibling(){},patchProp(){},insert(){},remove(){}})
const flush=async()=>{for(let i=0;i<25;i++){await Promise.resolve();await nextTick()}}
const command={site_id:'site-A',symbol:'BTCUSDT',based_on_layout_version:'1',based_on_site_version:'1',client_request_id:'original_grid_request',reason:'original reason',changes:{enabled:false}}
async function mount({initError=null,products=[],pending=false,canEdit=true,directory=['BTCUSDT','ETHUSDT','SOLUSDT']}={}) {
 globalThis.window={addEventListener(){},removeEventListener(){}}
 const values=new Map();globalThis.sessionStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}
 if(pending)persistPending(sessionStorage,'101',command)
 const calls=[],detailCalls=[],initialization=[];globalThis.__gridPage={confirm:async()=>{},user:reactive({userInfo:{id:'101'},perms:['*']}),api:{initializeGridMerchant:async()=>{initialization.push('initialize');if(initError)throw initError;return {created:0}},gridConfigCatalog:async()=>{initialization.push('catalog');return ({sites:[{site_id:'site-A',can_edit:canEdit,can_edit_limits:false,products}]})},gridConfigSymbols:async()=>directory,gridConfigSite:async(site,symbol)=>{detailCalls.push([site,symbol]);throw Error('detail unavailable')},gridConfigReceipt:async body=>{calls.push(body);throw {error_code:'OUTCOME_UNKNOWN'}},saveGridConfig:async()=>{throw Error('must not save')}}}
 const app=renderer.createApp(Component);app.config.warnHandler=()=>{};const vm=app.mount({});await flush();return {s:vm.$.setupState,calls,detailCalls,initialization,unmount:()=>app.unmount()}
}
test('Grid page hides platform-off and generic-only entries but keeps merchant-off',async()=>{
 const h=await mount({products:[{symbol:'BTCUSDT',enabled:false,default_enabled:false},{symbol:'ETHUSDT',enabled:false,default_enabled:true}]})
 try{assert.deepEqual(h.s.products.map(p=>p.symbol),['ETHUSDT']);assert.equal(h.s.symbol,'ETHUSDT')}finally{h.unmount()}
})
test('Grid receipt remains queryable with the original command after platform hides its product',async()=>{
 const h=await mount({pending:true})
 try{assert.equal(h.s.pendingCanQuery,true);await h.s.queryReceipt();await flush();assert.deepEqual(h.calls,[command]);assert.deepEqual(readPending(sessionStorage).command,command)}finally{h.unmount()}
})
test('Grid receipt still requires authorized editable site',async()=>{
 const h=await mount({pending:true,canEdit:false})
 try{assert.equal(h.s.pendingCanQuery,false);await h.s.queryReceipt();assert.deepEqual(h.calls,[])}finally{h.unmount()}
})

test('Grid initial selection follows enabled-first platform display order, not raw catalog order',async()=>{
 const h=await mount({products:[{symbol:'ADAUSDT',enabled:false,default_enabled:true},{symbol:'BTCUSDT',enabled:true,default_enabled:true},{symbol:'ETHUSDT',enabled:true,default_enabled:true}],directory:['ADAUSDT','ETHUSDT','BTCUSDT']})
 try{assert.equal(h.s.symbol,'ETHUSDT');assert.deepEqual(h.detailCalls,[['site-A','ETHUSDT']])}finally{h.unmount()}
})
test('Grid site switch chooses the first configurable displayed product',async()=>{
 const h=await mount()
 try{
  h.s.sites=[{site_id:'site-B',can_edit:true,can_edit_limits:false,products:[{symbol:'ETHUSDT',enabled:false,default_enabled:true},{symbol:'SOLUSDT',enabled:true,default_enabled:true}]}]
  h.s.selectSite('site-B');await flush()
  assert.equal(h.s.symbol,'SOLUSDT');assert.deepEqual(h.detailCalls,[['site-B','SOLUSDT']])
 }finally{h.unmount()}
})
test('Grid pending operation preserves its original target ahead of default display selection',async()=>{
 const h=await mount({pending:true,products:[{symbol:'ETHUSDT',enabled:true,default_enabled:true},{symbol:'BTCUSDT',enabled:false,default_enabled:true}]})
 try{assert.equal(h.s.symbol,'BTCUSDT');assert.deepEqual(h.detailCalls,[['site-A','BTCUSDT']]);assert.equal(h.s.pending.command.client_request_id,command.client_request_id)}finally{h.unmount()}
})


const receiptMissing = { error_code: 'RECEIPT_UNCONFIRMED', operation_status: 'UNKNOWN' }
const recoverProducts = [{ symbol: 'BTCUSDT', enabled: false, default_enabled: true }]
async function recoveryPage() {
 const h = await mount({ pending: true, products: recoverProducts })
 globalThis.__gridPage.api.gridConfigReceipt = async () => { throw receiptMissing }
 await h.s.queryReceipt(); await flush()
 return h
}

test('Grid recovery requires a missing receipt and explicitly confirms the original write', async () => {
 const h = await mount({ pending: true, products: recoverProducts }), writes = [], reviews = []
 try {
  globalThis.__gridPage.confirm = async (...args) => { reviews.push(args) }
  globalThis.__gridPage.api.saveGridConfig = async body => {
   writes.push(structuredClone(body))
   return { operation_status: 'SUCCEEDED', operation_id: '91', site_id: body.site_id, symbol: body.symbol,
    layout_version: '1', site_version: '2', effective_from_ms: '123', changed: true, cache_state: 'DONE' }
  }
  assert.equal(h.s.pendingCanRecover, false)
  await h.s.recoverOriginal(); await flush(); assert.equal(writes.length, 0)
  globalThis.__gridPage.api.gridConfigReceipt = async () => { throw receiptMissing }
  await h.s.queryReceipt(); await flush(); assert.equal(h.s.pendingCanRecover, true)
  assert.equal(writes.length, 0)
  await h.s.recoverOriginal(); await flush()
  assert.deepEqual(writes, [command]); assert.equal(reviews.length, 1)
  assert.match(reviews[0][0], /original_grid_request/)
  assert.equal(readPending(sessionStorage), null); assert.equal(h.s.pending, null)
  assert.equal(h.s.busy, false); assert.equal(h.s.pendingCanRecover, false)
 } finally { h.unmount() }
})

test('Grid recovery of a superseded request clears its local journal and refreshes current config', async () => {
 const h = await recoveryPage(); let catalogReads = 0
 try {
  globalThis.__gridPage.api.gridConfigCatalog = async () => {
   catalogReads++
   return { sites: [{ site_id: 'site-A', can_edit: true, can_edit_limits: false, products: [
    { symbol: 'ETHUSDT', enabled: true, default_enabled: true }, ...recoverProducts
   ] }] }
  }
  globalThis.__gridPage.api.saveGridConfig = async () => {
   throw { error_code: 'VERSION_CONFLICT', operation_status: 'FAILED' }
  }
  await h.s.recoverOriginal(); await flush()
  assert.equal(readPending(sessionStorage), null)
  assert.equal(h.s.pending, null)
  assert.equal(catalogReads, 1)
  assert.equal(h.s.symbol, 'BTCUSDT')
  assert.deepEqual(h.detailCalls.at(-1), ['site-A', 'BTCUSDT'])
  assert.match(h.s.message, /旧请求未生效.*版本/)
 } finally { h.unmount() }
})

test('Grid recovery never reports a replacement journal as cleared', async () => {
 const h = await recoveryPage(); let catalogReads = 0
 try {
  globalThis.__gridPage.api.gridConfigCatalog = async () => { catalogReads++; return { sites: [] } }
  globalThis.__gridPage.api.saveGridConfig = async () => {
   sessionStorage.setItem('grid.config.pending.v1', JSON.stringify({ schema: 1, operator_id: '101', command: { ...command, reason: 'other request' } }))
   throw { error_code: 'VERSION_CONFLICT', operation_status: 'FAILED' }
  }
  await h.s.recoverOriginal(); await flush()
  assert.equal(readPending(sessionStorage).command.reason, 'other request')
  assert.equal(catalogReads, 0)
  assert.match(h.s.message, /待确认记录已变化/)
  assert.doesNotMatch(h.s.message, /已清除/)
 } finally { h.unmount() }
})

test('Grid recovery reports when the original target is no longer visible', async () => {
 const h = await recoveryPage()
 try {
  globalThis.__gridPage.api.gridConfigCatalog = async () => ({ sites: [{ site_id: 'site-A', can_edit: true, can_edit_limits: false,
   products: [{ symbol: 'ETHUSDT', enabled: true, default_enabled: true }] }] })
  globalThis.__gridPage.api.saveGridConfig = async () => {
   throw { error_code: 'VERSION_CONFLICT', operation_status: 'FAILED' }
  }
  await h.s.recoverOriginal(); await flush()
  assert.equal(readPending(sessionStorage), null)
  assert.equal(h.s.symbol, 'ETHUSDT')
  assert.match(h.s.message, /原目标当前不可见/)
 } finally { h.unmount() }
})

test('Grid recovery keeps product navigation blocked until the original target refresh finishes', async () => {
 const h = await recoveryPage(); let finishDetail
 try {
  globalThis.__gridPage.api.gridConfigCatalog = async () => ({ sites: [{ site_id: 'site-A', can_edit: true, can_edit_limits: false,
   products: [{ symbol: 'ETHUSDT', enabled: true, default_enabled: true }, ...recoverProducts] }] })
  globalThis.__gridPage.api.gridConfigSite = () => new Promise((_, reject) => { finishDetail = reject })
  globalThis.__gridPage.api.saveGridConfig = async () => { throw { error_code: 'VERSION_CONFLICT', operation_status: 'FAILED' } }
  const recovery = h.s.recoverOriginal(); await flush()
  assert.equal(h.s.busy, true)
  h.s.selectProduct('ETHUSDT')
  assert.equal(h.s.symbol, 'BTCUSDT')
  finishDetail(new Error('detail unavailable'))
  await recovery; await flush()
  assert.equal(h.s.busy, false)
 } finally { h.unmount() }
})

test('Grid recovery never turns a general 503 or a changed receipt into a write', async () => {
 const h = await recoveryPage(); let writes = 0
 try {
  assert.equal(h.s.pendingCanRecover, true)
  globalThis.__gridPage.api.saveGridConfig = async () => { writes++ }
  globalThis.__gridPage.api.gridConfigReceipt = async () => { throw { error_code: 'DEPENDENCY_UNAVAILABLE', operation_status: 'UNKNOWN' } }
  await h.s.queryReceipt(); await flush()
  assert.equal(h.s.pendingCanRecover, false)
  await h.s.recoverOriginal(); await flush(); assert.equal(writes, 0)
  assert.deepEqual(readPending(sessionStorage).command, command)
 } finally { h.unmount() }
})

test('Grid recovery cancellation and confirmation races cannot send an unreviewed request', async () => {
 for (const change of ['cancel', 'operator', 'permission', 'journal']) {
  const h = await recoveryPage(); let approve, writes = 0
  try {
   globalThis.__gridPage.api.saveGridConfig = async () => { writes++ }
   globalThis.__gridPage.confirm = () => new Promise((resolve, reject) => { approve = change === 'cancel' ? reject : resolve })
   const pendingRecovery = h.s.recoverOriginal(); await flush()
   if (change === 'operator') globalThis.__gridPage.user.userInfo.id = '102'
   if (change === 'permission') globalThis.__gridPage.user.perms = ['grid_config:read']
   if (change === 'journal') sessionStorage.setItem('grid.config.pending.v1', JSON.stringify({ schema: 1, operator_id: '101', command: { ...command, reason: 'changed after review' } }))
   await flush(); approve(); await pendingRecovery; await flush()
   assert.equal(writes, 0, change); assert.notEqual(readPending(sessionStorage), null)
  } finally { h.unmount() }
 }
})

test('Grid recovery keeps failed and unknown writes pending and releases busy after identity changes', async () => {
 for (const scenario of ['conflict', 'permission', 'timeout', 'operator-change']) {
  const h = await recoveryPage(); let finish, writes = 0
  try {
   globalThis.__gridPage.api.saveGridConfig = () => { writes++; return new Promise((resolve, reject) => { finish = reject }) }
   const request = h.s.recoverOriginal(); await flush(); assert.equal(writes, 1)
   if (scenario === 'operator-change') globalThis.__gridPage.user.userInfo.id = '102'
   await flush()
   finish({ error_code: scenario === 'conflict' ? 'IDEMPOTENCY_CONFLICT' : scenario === 'permission' ? 'FORBIDDEN' : 'DEPENDENCY_UNAVAILABLE', operation_status: 'FAILED' })
   await request; await flush()
   assert.deepEqual(readPending(sessionStorage).command, command)
   assert.equal(h.s.busy, false, scenario); assert.equal(h.s.pendingCanRecover, false)
  } finally { h.unmount() }
 }
})


test('Grid recovery of a hidden product preserves merchant site authorization and the old body', async () => {
 for (const canEdit of [true, false]) {
  const h=await mount({pending:true,canEdit,products:[{symbol:'BTCUSDT',enabled:false,default_enabled:false}]}),writes=[]
  try {
   globalThis.__gridPage.api.gridConfigReceipt=async()=>{throw receiptMissing}
   globalThis.__gridPage.api.saveGridConfig=async body=>{writes.push(structuredClone(body));throw {operation_status:'UNKNOWN'}}
   await h.s.queryReceipt();await flush()
   assert.equal(h.s.pendingCanRecover,canEdit)
   await h.s.recoverOriginal();await flush()
   assert.deepEqual(writes,canEdit?[command]:[])
   assert.deepEqual(readPending(sessionStorage).command,command)
  } finally {h.unmount()}
 }
})


test('Grid late missing receipt cannot authorize recovery after an account switch and return', async () => {
 const h=await mount({pending:true,products:recoverProducts});let finish,writes=0
 try {
  globalThis.__gridPage.api.gridConfigReceipt=()=>new Promise((resolve,reject)=>{finish=reject})
  globalThis.__gridPage.api.saveGridConfig=async()=>{writes++}
  await h.s.queryReceipt();await flush()
  globalThis.__gridPage.user.userInfo.id='102';await flush()
  globalThis.__gridPage.user.userInfo.id='101';await flush()
  finish(receiptMissing);await flush()
  assert.equal(h.s.pendingCanRecover,false);assert.equal(h.s.busy,false)
  await h.s.recoverOriginal();await flush();assert.equal(writes,0)
 } finally {h.unmount()}
})

test('Grid double recovery click opens one confirmation and sends once', async () => {
 const h=await recoveryPage();let approve,reviews=0,writes=0
 try {
  globalThis.__gridPage.confirm=()=>{reviews++;return new Promise(resolve=>{approve=resolve})}
  globalThis.__gridPage.api.saveGridConfig=async()=>{writes++;throw {operation_status:'UNKNOWN'}}
  const first=h.s.recoverOriginal();await flush()
  await h.s.recoverOriginal();await flush();assert.equal(reviews,1);assert.equal(writes,0)
  approve();await first;await flush();assert.equal(writes,1)
  assert.deepEqual(readPending(sessionStorage).command,command)
 } finally {h.unmount()}
})


test('Grid recovery confirmation cannot write after leaving and unmounting the page', async () => {
 const h=await recoveryPage();let approve,writes=0,unmounted=false
 try {
  globalThis.__gridPage.confirm=()=>new Promise(resolve=>{approve=resolve})
  globalThis.__gridPage.api.saveGridConfig=async()=>{writes++;throw {operation_status:'UNKNOWN'}}
  const request=h.s.recoverOriginal();await flush()
  h.unmount();unmounted=true
  approve();await request;await flush()
  assert.equal(writes,0)
  assert.deepEqual(readPending(sessionStorage).command,command)
 } finally {if(!unmounted)h.unmount()}
})

test('Grid first entry initializes missing rows before reading the catalog',async()=>{
 const h=await mount();try{assert.deepEqual(h.initialization,['initialize','catalog'])}finally{h.unmount()}
})
test('Grid initialization failure blocks a misleading inherited catalog',async()=>{
 const h=await mount({initError:Error('initialization unavailable')});try{assert.deepEqual(h.initialization,['initialize']);assert.equal(h.s.catalogReady,false);assert.deepEqual(h.s.sites,[])}finally{h.unmount()}
})


test('Grid successful save refreshes silently and retains refresh-failure warnings',async()=>{
 for (const failsRefresh of [false,true]) {
  const h=await mount({pending:true})
  try {
   globalThis.__gridPage.api.gridConfigReceipt=async()=>({operation_status:'SUCCEEDED',operation_id:'91',site_id:command.site_id,symbol:command.symbol,layout_version:'1',site_version:'2',effective_from_ms:'123',changed:true,cache_state:'DONE'})
   globalThis.__gridPage.api.gridConfigCatalog=async()=>{if(failsRefresh)throw Error('refresh failed');return {sites:[]}}
   await h.s.queryReceipt();await flush()
   assert.equal(readPending(sessionStorage),null)
   if(failsRefresh){assert.equal(h.s.messageType,'warning');assert.match(h.s.message,/刷新失败/)}
   else assert.equal(h.s.message,'')
  }finally{h.unmount()}
 }
})
