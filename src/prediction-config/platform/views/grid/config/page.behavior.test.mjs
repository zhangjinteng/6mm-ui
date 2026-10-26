import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {dirname,resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {build} from 'esbuild'
import {parse,compileScript} from '@vue/compiler-sfc'
import {createRenderer,reactive,nextTick} from 'vue'
import {persistPending,readPending,normalizeSnapshot} from './model.ts'
const root=dirname(fileURLToPath(import.meta.url)),src=resolve(root,'../../..')
const output=await build({stdin:{contents:compileScript(parse(await readFile(resolve(root,'index.vue'),'utf8')).descriptor,{id:'grid-directory'}).content.replace(/import \{ El(?!MessageBox)[^\n]+from 'element-plus'\n/g,''),resolveDir:root,loader:'ts'},bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'fixtures',setup(b){
 b.onResolve({filter:/runtime$/},a=>({path:a.path,namespace:'sdk-runtime'}));
 b.onLoad({filter:/.*/,namespace:'sdk-runtime'},()=>({contents:`export const useConfigSymbol=()=>({});export const useConfigUser=()=>globalThis.__gridPage.user;export const useConfigBeforeLeave=()=>{};export const usePlatformConfigRuntime=()=>({grid:new Proxy({}, {get:(_,key)=>(...a)=>globalThis.__gridPage.api[key](...a)})});`}));

 b.onResolve({filter:/^vue$/},()=>({path:import.meta.resolve('vue'),external:true}))
 b.onResolve({filter:/^(vue-router|element-plus|@\/stores\/modules\/user|@\/api\/grid\/config)$/},a=>({path:a.path,namespace:'fixture'}))
 b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:a.path==='vue-router'?'export const onBeforeRouteLeave=()=>{}':a.path==='element-plus'?'export const ElMessageBox={confirm:(...args)=>globalThis.__gridPage.confirm(...args)}':a.path.includes('/stores/')?'export default ()=>globalThis.__gridPage.user':['gridConfigSymbols','gridConfigCatalog','gridConfigReceipt','gridConfigSite','gridConfigCreation','saveGridConfig'].map(n=>`export const ${n}=(...a)=>globalThis.__gridPage.api.${n}(...a)`).join(';')}))
 b.onResolve({filter:/^@\//},a=>({path:resolve(src,a.path.slice(2)+(a.path.endsWith('/format')?'.ts':''))}))
 b.onLoad({filter:/\.vue$/},()=>({contents:'export default {}',loader:'ts'}))
}}]})
const Component=(await import('data:text/javascript;base64,'+Buffer.from(output.outputFiles[0].text).toString('base64'))).default
Component.render=()=>null
const renderer=createRenderer({createElement:()=>({}),createText:()=>({}),createComment:()=>({}),setText(){},setElementText(){},parentNode(){},nextSibling(){},patchProp(){},insert(){},remove(){}})
const flush=async()=>{for(let i=0;i<25;i++){await Promise.resolve();await nextTick()}}
const command={site_id:'site-A',symbol:'BTCUSDT',based_on_layout_version:'1',based_on_site_version:'1',client_request_id:'original_grid_request',reason:'original reason',changes:{enabled:false}}
async function mount({products=[],pending=false,canEdit=true,directory=['BTCUSDT','ETHUSDT','SOLUSDT']}={}) {
 globalThis.window={addEventListener(){},removeEventListener(){}}
 const values=new Map();globalThis.sessionStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)}
 if(pending)persistPending(sessionStorage,'101',command)
 const calls=[],detailCalls=[];globalThis.__gridPage={confirm:async()=>{},user:reactive({userInfo:{id:'101'},perms:['*']}),api:{gridConfigCatalog:async()=>({sites:[{site_id:'site-A',can_edit:canEdit,can_edit_limits:false,products}]}),gridConfigSymbols:async()=>directory,gridConfigSite:async(site,symbol)=>{detailCalls.push([site,symbol]);throw Error('detail unavailable')},gridConfigReceipt:async body=>{calls.push(body);throw {error_code:'OUTCOME_UNKNOWN'}},saveGridConfig:async()=>{throw Error('must not save')}}}
 const app=renderer.createApp(Component);app.config.warnHandler=()=>{};const vm=app.mount({});await flush();return {s:vm.$.setupState,calls,detailCalls,unmount:()=>app.unmount()}
}

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

test('Grid generic unconfigured products cannot become the default editable selection',async()=>{
 const h=await mount({products:[{symbol:'ETHUSDT',enabled:false}],directory:['BTCUSDT','ETHUSDT']})
 try{assert.equal(h.s.products[0].symbol,'BTCUSDT');assert.equal(h.s.symbol,'ETHUSDT')}finally{h.unmount()}
})

test('Grid empty catalog permits explicit blank creation at the backend site and preserves unknown receipt without a catalog row',async()=>{
 const h=await mount();const writes=[],reads=[]
 globalThis.__gridPage.api.gridConfigCatalog=async()=>({sites:[]})
 globalThis.__gridPage.api.gridConfigCreation=async symbol=>{reads.push(symbol);return {site_id:'1',symbol,layout_version:'0',layout:null}}
 globalThis.__gridPage.api.saveGridConfig=async body=>{writes.push(structuredClone(body));throw {operation_status:'UNKNOWN'}}
 try{
  await h.s.refresh();await flush();assert.equal(h.s.symbol,'');assert.equal(reads.length,0)
  h.s.selectProduct('BTCUSDT');await flush();assert.deepEqual(reads,['BTCUSDT']);assert.equal(h.s.siteId,'1')
  assert.equal(h.s.draft.target_rtp,'');assert.equal(h.s.draft.layout.row_count,'10');assert.equal(h.s.draft.layout.column_count,'10');assert.equal(h.s.draft.enabled,false)
  await h.s.reviewSave();await flush();assert.equal(writes.length,0)
  Object.assign(h.s.draft,{min_multiplier:'1.02',max_multiplier:'20',min_order_amount:'1',max_order_amount:'3000'})
  Object.assign(h.s.draft.layout,{column_duration_seconds:'2',price_band_width:'5'});h.s.rtpPercent='95'
  await h.s.reviewSave();await flush();assert.equal(writes.length,1);assert.equal(writes[0].changes.enabled,false);assert.equal(writes[0].changes.row_count,'10');assert.equal(writes[0].changes.column_count,'10');assert.equal(writes[0].site_id,'1');assert.equal(h.s.pendingCanQuery,true)
  const original=structuredClone(writes[0]);await h.s.loadCatalog();await flush();assert.equal(h.s.pendingCanQuery,true)
  await h.s.queryReceipt();await flush();assert.deepEqual(h.calls[0],original);assert.deepEqual(readPending(sessionStorage).command,original)
  globalThis.__gridPage.api.gridConfigReceipt=async()=>{throw receiptMissing}
  await h.s.queryReceipt();await flush();assert.equal(h.s.pendingCanRecover,true)
  globalThis.__gridPage.api.saveGridConfig=async body=>{
   writes.push(structuredClone(body))
   return {operation_status:'SUCCEEDED',operation_id:'91',site_id:'1',symbol:'BTCUSDT',layout_version:'1',site_version:'1',effective_from_ms:'123',changed:true,cache_state:'PENDING'}
  }
  await h.s.recoverOriginal();await flush()
  assert.deepEqual(writes,[original,original]);assert.equal(readPending(sessionStorage),null)

 }finally{h.unmount()}
})
test('Grid save distinguishes price read failure and clears a definitely failed request',async()=>{
 const h=await mount();let writes=0
 globalThis.__gridPage.api.gridConfigCatalog=async()=>({sites:[]})
 globalThis.__gridPage.api.gridConfigCreation=async symbol=>({site_id:'1',symbol,layout_version:'0',layout:null})
 globalThis.__gridPage.api.saveGridConfig=async()=>{writes++;throw {error_code:'LAYOUT_PRICE_READ_FAILED',operation_status:'FAILED'}}
 try {
  await h.s.refresh();await flush();h.s.selectProduct('BTCUSDT');await flush()
  Object.assign(h.s.draft,{min_multiplier:'1.02',max_multiplier:'20',min_order_amount:'1',max_order_amount:'3000'})
  Object.assign(h.s.draft.layout,{column_duration_seconds:'2',price_band_width:'5'});h.s.rtpPercent='95'
  await h.s.reviewSave();await flush()
  assert.equal(writes,1);assert.match(h.s.message,/行情读取暂时失败/)
  assert.doesNotMatch(h.s.message,/当前标记价暂不可用|LAYOUT_PRICE_READ_FAILED/)
  assert.equal(readPending(sessionStorage),null);assert.equal(h.s.busy,false)
 } finally {h.unmount()}
})
test('Grid creation respects edit permission, stale identity and failed context reads',async()=>{
 const h=await mount();let reads=0,resolveContext
 globalThis.__gridPage.api.gridConfigCatalog=async()=>({sites:[]})
 globalThis.__gridPage.api.gridConfigCreation=()=>{reads++;return new Promise(resolve=>{resolveContext=resolve})}
 try{
  await h.s.refresh();await flush();globalThis.__gridPage.user.perms=['grid_config:read'];await flush();h.s.selectProduct('BTCUSDT');await flush();assert.equal(reads,0)
  globalThis.__gridPage.user.perms=['*'];await flush();h.s.selectProduct('BTCUSDT');await flush();assert.equal(reads,1)
  globalThis.__gridPage.user.userInfo.id='102';await flush();resolveContext({site_id:'1',symbol:'BTCUSDT',layout_version:'0',layout:null});await flush();assert.equal(h.s.draft,null)
  globalThis.__gridPage.api.gridConfigCreation=async()=>{throw Error('context unavailable')};h.s.selectProduct('ETHUSDT');await flush();assert.equal(h.s.draft,null);assert.match(h.s.error,/context unavailable/)
 }finally{h.unmount()}
})

test('Grid pending write releases busy after permission change even when the catalog has not returned',async()=>{
 const h=await mount();let finishSave,finishCatalog,written
 globalThis.__gridPage.api.gridConfigCatalog=async()=>({sites:[]})
 globalThis.__gridPage.api.gridConfigCreation=async symbol=>({site_id:'1',symbol,layout_version:'0',layout:null})
 globalThis.__gridPage.api.saveGridConfig=body=>{written=structuredClone(body);return new Promise(resolve=>{finishSave=resolve})}
 try{
  await h.s.refresh();await flush();h.s.selectProduct('ETHUSDT');await flush()
  Object.assign(h.s.draft,{min_multiplier:'1.02',max_multiplier:'20',min_order_amount:'1',max_order_amount:'3000'})
  Object.assign(h.s.draft.layout,{column_duration_seconds:'2',price_band_width:'5'});h.s.rtpPercent='95'
  await h.s.reviewSave();await flush();assert.equal(h.s.busy,true)
  globalThis.__gridPage.api.gridConfigCatalog=()=>new Promise(resolve=>{finishCatalog=resolve})
  globalThis.__gridPage.user.perms=['grid_config:read'];await flush()
  finishSave({operation_status:'SUCCEEDED',operation_id:'1',site_id:written.site_id,symbol:written.symbol,layout_version:'1',site_version:'1',effective_from_ms:'123',changed:true,cache_state:'PENDING'})
  await flush();assert.equal(h.s.busy,false);assert.equal(h.s.pending,null)
  finishCatalog({sites:[]});await flush()
  globalThis.__gridPage.api.gridConfigCatalog=async()=>({sites:[]});globalThis.__gridPage.user.perms=['*'];await flush()
  assert.equal(h.s.canCreate,true)
 }finally{h.unmount()}
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

test('Grid precision control preserves null, writes zero/eight, and cannot edit a readonly layout',async()=>{
 const h=await mount({products:[{symbol:'BTCUSDT',enabled:true}]})
 try {
  h.s.snapshot={site_id:'site-A',symbol:'BTCUSDT',layout:{editable:true,price_decimals:null}}
  h.s.draft={site_id:'site-A',symbol:'BTCUSDT',layout:{editable:true,price_decimals:null}}
  assert.equal(h.s.priceDecimals,undefined)
  h.s.priceDecimals=0;assert.equal(h.s.draft.layout.price_decimals,0)
  h.s.priceDecimals=8;assert.equal(h.s.draft.layout.price_decimals,8)
  assert.equal(h.s.snapshot.layout.price_decimals,null)
  h.s.snapshot.layout.editable=false
  h.s.priceDecimals=2;assert.equal(h.s.draft.layout.price_decimals,8)
  h.s.snapshot.layout.editable=true;h.s.snapshot.layout.price_decimals=18;h.s.draft.layout.price_decimals=18
  assert.equal(h.s.priceDecimals,undefined);assert.equal(h.s.draft.layout.price_decimals,18)
 }finally{h.unmount()}
})

test('Grid default precision can be saved without blocking browsing until the user edits', async()=>{
 const h=await mount({products:[{symbol:'BTCUSDT',enabled:true}]})
 try {
  const source={site_id:'site-A',symbol:'BTCUSDT',site_version:'1',target_rtp:'0.6',enabled:true,min_multiplier:'1',max_multiplier:'10',min_order_amount:'1',max_order_amount:'100',layout:{editable:true,price_decimals:null,price_band_width:'5',column_duration_seconds:'2',row_count:'10',column_count:'10'}}
  h.s.snapshot=source;h.s.draft=structuredClone(source);h.s.draft.layout.price_decimals=3;h.s.rtpPercent='60'
  await flush();assert.equal(h.s.dirty,true);assert.equal(h.s.blockingWork,false)
  h.s.priceDecimals=4;await flush();assert.equal(h.s.blockingWork,true)
  h.s.priceDecimals=3;await flush();assert.equal(h.s.blockingWork,false)
  h.s.rtpPercent='59';await flush();assert.equal(h.s.blockingWork,true)
 }finally{h.unmount()}
})


test('Grid successful save refreshes silently and retains refresh-failure warnings',async()=>{
 for (const failsRefresh of [false,true]) {
  const h=await mount({pending:true,products:[{symbol:'BTCUSDT',enabled:true}]})
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

test('Grid precision rejects noninteger text without silently coercing or sending it', async()=>{
 const h=await mount({products:[{symbol:'BTCUSDT',enabled:true}]})
 let writes=0
 globalThis.__gridPage.api.saveGridConfig=async()=>{writes++;throw Error('unexpected write')}
 try {
  const source={config_id:'11',requested_agent_id:'0',agent_id:null,inherited:false,default_config_id:'11',default_version:'7',default_resolution_epoch:'2',default_enabled:true,effective_enabled:true,default_target_rtp:'0.6',default_min_order_amount:'1',default_max_order_amount:'100',layout_version:'1',effective_from_ms:'1792200000000',site_id:'site-A',symbol:'BTCUSDT',site_version:'1',target_rtp:'0.6',enabled:true,min_multiplier:'1',max_multiplier:'10',min_order_amount:'1',max_order_amount:'100',layout:{effective_from_ms:'1792200000000',affected_site_ids:['site-A'],editable:true,price_decimals:3,price_band_width:'5',column_duration_seconds:'2',row_count:'10',column_count:'10'}}
  normalizeSnapshot(source);h.s.snapshot=source;h.s.draft=structuredClone(source);h.s.rtpPercent='60'
  for(const text of ['3.0000000000000001','0x8','9','-1','2.5']) {
   h.s.priceDecimalsInput=text;await flush()
   assert.equal(h.s.priceDecimalsInput,text)
   assert.equal(Number.isNaN(h.s.draft.layout.price_decimals),true)
   await h.s.reviewSave();assert.equal(writes,0);assert.match(h.s.message,/价格精度须为 0～8 位/)
  }
  assert.equal(writes,0)
  h.s.priceDecimalsInput='0';assert.equal(h.s.draft.layout.price_decimals,0)
  h.s.priceDecimalsInput='8';assert.equal(h.s.draft.layout.price_decimals,8)
 }finally{h.unmount()}
})

test('Grid detail stays loading without a snapshot and ignores late results from the previous coin', async()=>{
 const h=await mount({products:[{symbol:'BTCUSDT',enabled:true},{symbol:'ETHUSDT',enabled:true}]})
 const reads=[]
 globalThis.__gridPage.api.gridConfigSite=(site,symbol,signal)=>new Promise((resolve,reject)=>reads.push({site,symbol,signal,resolve,reject}))
 try {
  h.s.selectProduct('ETHUSDT');await flush()
  assert.equal(h.s.detailLoading,true);assert.equal(h.s.snapshot,null);assert.equal(h.s.draft,null)
  h.s.selectProduct('BTCUSDT');await flush()
  assert.equal(reads[0].signal.aborted,true)
  reads[0].reject(Error('old ETH failure'));await flush()
  assert.equal(h.s.detailLoading,true);assert.equal(h.s.error,'')
  reads[1].reject(Error('current BTC failure'));await flush()
  assert.equal(h.s.detailLoading,false);assert.equal(h.s.snapshot,null);assert.match(h.s.error,/current BTC failure/)
 } finally {h.unmount()}
})

test('Grid MmLoading boundary is outside snapshot rendering and no Element overlay remains',async()=>{
 const source=await readFile(resolve(root,'index.vue'),'utf8')
 const {descriptor}=parse(source)
 assert.doesNotMatch(descriptor.template.content,/v-loading/)
 const visit=(node,ancestors=[])=>{
  if(node.type===1&&node.tag==='PredictionLoadingRegion'&&node.props.some(prop=>prop.type===7&&prop.arg?.content==='loading'&&prop.exp?.content.includes('detailLoading'))) {
   assert.equal(ancestors.some(parent=>parent.type===1&&parent.props.some(prop=>prop.type===7&&['if','else-if'].includes(prop.name)&&/snapshot|draft/.test(prop.exp?.content||''))),false)
   return 1
  }
  return (node.children||[]).reduce((count,child)=>count+visit(child,[...ancestors,node]),0)
 }
 assert.equal(visit(descriptor.template.ast),1,'one stable detail boundary is present before a snapshot exists')
})
