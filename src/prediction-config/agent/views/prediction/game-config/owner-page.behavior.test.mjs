import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {dirname,resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {build} from 'esbuild'
import {parse,compileScript} from '@vue/compiler-sfc'
import {createRenderer,h,nextTick,reactive} from 'vue'
import {actor,fixture,memory,deferred,success} from './owner-test-helpers.mjs'
const root=dirname(fileURLToPath(import.meta.url)),src=resolve(root,'../../..'),cache=new Map()
async function component(name){
 if(cache.has(name))return cache.get(name)
 const entry=resolve(root,name+'.vue'),out=await build({entryPoints:[entry],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'owner-real-page',setup(b){
 b.onResolve({filter:/ui$/},()=>({path:'ui',namespace:'sdk-ui'}));
 b.onLoad({filter:/.*/,namespace:'sdk-ui'},()=>({contents:`import {h} from 'vue';export const MmInput={inheritAttrs:false,setup:(_,{attrs,slots})=>()=>h('mm-input',attrs,[slots.suffix?.(),slots.append?.()])};`}));
 b.onResolve({filter:/runtime$/},a=>({path:a.path,namespace:'sdk-runtime'}));
 b.onLoad({filter:/.*/,namespace:'sdk-runtime'},()=>({contents:`import {h} from 'vue';export const useConfigSymbol=()=>({render(){return h('stub',this.$attrs)}});export const useConfigUser=()=>globalThis.__ownerPage.user;export const useAgentConfigRuntime=()=>({api:{siteDirectorySymbols:async()=>globalThis.__ownerPage.api.directory?.()??['BTCUSDT'],ownerConfigurationModel:(...a)=>globalThis.__ownerPage.api.model(...a),ownerConfigurations:(...a)=>globalThis.__ownerPage.api.list(...a),ownerConfiguration:(...a)=>globalThis.__ownerPage.api.detail(...a),saveOwnerConfiguration:(...a)=>globalThis.__ownerPage.api.save(...a)}});`}));

  b.onResolve({filter:/^element-plus$/},()=>({path:'elements',namespace:'elements'}));
 b.onLoad({filter:/.*/,namespace:'elements'},()=>({contents: "import {h,computed} from 'vue';export const useFormDisabled=()=>computed(()=>false);"+['Button','Input','Tag','FormItem','Switch','Dialog','Select','Option'].map(n=>`export const El${n}={inheritAttrs:false,setup:(_,{attrs,slots})=>()=>h('el-'+${JSON.stringify(n.replace(/[A-Z]/g,(s,i)=>(i?'-':'')+s.toLowerCase()))},attrs,[slots.default?.(),slots.footer?.()])};`).join('')}))
  b.onResolve({filter:/^vue$/},()=>({path:import.meta.resolve('vue'),external:true}))
  b.onResolve({filter:/^@\/(api\/prediction|stores\/modules\/user)$/},a=>({path:a.path,namespace:'fixture'}))
  b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:a.path.includes('/stores/')?'export default ()=>globalThis.__ownerPage.user':`const call=(name,...a)=>globalThis.__ownerPage.api[name](...a);export const siteDirectorySymbols=async()=>globalThis.__ownerPage.api.directory?.()??['BTCUSDT'];export const ownerConfigurationModel=(...a)=>call('model',...a),ownerConfigurations=(...a)=>call('list',...a),ownerConfiguration=(...a)=>call('detail',...a),saveOwnerConfiguration=(...a)=>call('save',...a);`}))
  b.onResolve({filter:/^@\//},a=>({path:resolve(src,a.path.slice(2))}))
  b.onLoad({filter:/\.vue$/},async a=>({contents:(a.path===entry||a.path.endsWith('/FixedRoomControls.vue')||a.path.endsWith('/DecimalInput.vue'))?compileScript(parse(await readFile(a.path,'utf8')).descriptor,{id:'owner-page',inlineTemplate:true}).content:`import {h} from 'vue';export default {render:()=>h('stub',{'data-component':${JSON.stringify(a.path)} })}`,loader:'ts'}))
 }}]})
 const c=(await import('data:text/javascript;base64,'+Buffer.from(out.outputFiles[0].text).toString('base64'))).default;cache.set(name,c);return c
}
const node=(type,text='')=>({type,text,props:{},children:[],parent:null})
const renderer=createRenderer({createElement:node,createText:t=>node('#text',t),createComment:t=>node('#comment',t),setText:(n,t)=>n.text=t,setElementText:(n,t)=>{n.text=t;n.children=[]},parentNode:n=>n?.parent??null,nextSibling:n=>n?.parent?.children[n.parent.children.indexOf(n)+1]??null,patchProp:(n,k,_,v)=>n.props[k]=v,insert(n,p,anchor){if(n.parent){const at=n.parent.children.indexOf(n);if(at>=0)n.parent.children.splice(at,1)}n.parent=p;const i=anchor?p.children.indexOf(anchor):-1;i<0?p.children.push(n):p.children.splice(i,0,n)},remove(n){if(n.parent){const i=n.parent.children.indexOf(n);if(i>=0)n.parent.children.splice(i,1)}}})
const walk=n=>[n,...n.children.flatMap(walk)],text=n=>n.text+n.children.map(text).join('')
const tick=async()=>{for(let i=0;i<12;i++){await Promise.resolve();await nextTick()}}
async function mount(name,{main=true,api={}}={}){
 const calls=[],user=reactive({userInfo:{id:main?'100':'101',can_manage_prediction_config:main},token:'fixture',perms:['*']});globalThis.localStorage=memory()
 globalThis.__ownerPage={user,api:{model:async()=>{calls.push('model');return {config_model:'OWNER_V1',actor}},list:async()=>{calls.push('list');return {items:[fixture()]}},detail:async()=>({configuration:fixture()}),save:async b=>{calls.push(b);return success(b)},...api}}
 const app=renderer.createApp(await component(name),name==='OwnerConfig'?{actor}:{}),root=node('root');app.config.warnHandler=()=>{}
 for(const tag of ['el-button','el-input','el-tag','el-form-item','el-switch','el-dialog','el-select','el-option'])app.component(tag,{inheritAttrs:false,setup:(_,{attrs,slots})=>()=>h(tag,attrs,[slots.default?.(),slots.footer?.()])})
 app.mount(root);await tick();return {root,calls,user,unmount:()=>app.unmount()}
}
test('child direct page performs no configuration API request',async()=>{const v=await mount('index',{main:false});try{assert.deepEqual(v.calls,[]);assert.match(text(v.root),/仅代理商主账号/)}finally{v.unmount()}})
test('late model response cannot install previous account page',async()=>{const d=deferred();const v=await mount('index',{api:{model:()=>d.promise}});try{v.user.userInfo.id='101';v.user.userInfo.can_manage_prediction_config=false;await tick();d.resolve({config_model:'OWNER_V1',actor});await tick();assert.equal(walk(v.root).some(n=>n.type==='stub'),false);assert.match(text(v.root),/仅代理商主账号/)}finally{v.unmount()}})
test('owner page edits minimum only and has one save control',async()=>{const v=await mount('OwnerConfig');try{
 assert.equal(walk(v.root).filter(n=>n.type==='el-button'&&text(n)==='保存配置').length,1);assert.doesNotMatch(text(v.root),/35 秒/);assert.match(text(v.root),/5 秒/)
 const input=walk(v.root).find(n=>n.type==='mm-input'&&n.props['aria-label']==='5秒单笔最小额');assert.ok(input);input.props['onUpdate:modelValue']('0.5')
 await tick()
 const button=walk(v.root).find(n=>n.type==='el-button'&&text(n)==='保存配置');assert.equal(button.props.disabled,false);await button.props.onClick();await tick()
 const saved=v.calls.find(c=>typeof c==='object');assert.equal(saved.changes.length,1);assert.equal(saved.changes[0].minimum_stake,'0.5');assert.equal('fixed_odds' in saved.changes[0],false);assert.equal(localStorage.getItem('prediction.owner.pending.v1'),null)
 }finally{v.unmount()}})
test('owner catalog late result ignored after account changes',async()=>{const d=deferred(),v=await mount('OwnerConfig',{api:{list:()=>d.promise}});try{v.user.userInfo.id='200';await tick();d.resolve({items:[fixture()]});await tick();assert.equal(walk(v.root).filter(n=>n.type==='article').length,0)}finally{v.unmount()}})
test('rejected stale save offers a usable fresh-read recovery',async()=>{const v=await mount('OwnerConfig',{api:{save:async()=>{throw {error_code:'CONFLICT'}}}});try{
 walk(v.root).find(n=>n.type==='mm-input'&&n.props['aria-label']==='5秒单笔最小额').props['onUpdate:modelValue']('0.5');await tick();await walk(v.root).find(n=>n.type==='el-button'&&text(n)==='保存配置').props.onClick();await tick()
 const retry=walk(v.root).find(n=>n.type==='el-button'&&text(n).includes('读取最新配置'));assert.ok(retry);assert.equal(retry.props.disabled,false);await retry.props.onClick();await tick();assert.equal(walk(v.root).find(n=>n.type==='mm-input'&&n.props['aria-label']==='5秒单笔最小额').props.modelValue,'0.1')
 }finally{v.unmount()}})
test('owner up-down edits payout rate but hides maximum odds and preserves its platform value',async()=>{const v=await mount('OwnerConfig');try{
 assert.equal(walk(v.root).some(n=>n.type==='mm-input'&&n.props['aria-label']==='5秒最高赔率'),false)
 const payout=walk(v.root).find(n=>n.type==='mm-input'&&n.props['aria-label']==='5秒目标返奖率');assert.ok(payout);assert.equal(payout.props.disabled,false);payout.props['onUpdate:modelValue']('75');await tick()
 assert.match(text(v.root),/赔率配置/)
 walk(v.root).find(n=>n.props['data-room-remove']==='35').props.onClick();await tick();walk(v.root).find(n=>n.props['data-room-confirm']===true).props.onClick();await tick()
 const coin=walk(v.root).find(n=>n.type==='el-switch'&&n.props['aria-label']==='币种开关');assert.ok(coin);coin.props['onUpdate:modelValue'](false);await tick()
 const save=walk(v.root).find(n=>n.type==='el-button'&&text(n)==='保存配置');assert.equal(save.props.disabled,false);await save.props.onClick();await tick()
 const sent=v.calls.find(x=>typeof x==='object');assert.equal(sent.enabled,false);assert.equal(sent.changes[0].enabled,false);assert.equal(sent.changes[0].maximum_odds,'10');assert.equal(sent.changes[0].target_payout_rate,'0.75');assert.equal(localStorage.getItem('prediction.owner.pending.v1'),null)
 }finally{v.unmount()}})

test('owner directory hides platform-disabled coin but retains merchant-disabled coin and platform order',async()=>{
 const items=['BTCUSDT','ETHUSDT','SOLUSDT','ADAUSDT'].map(symbol=>{const c=fixture();c.symbol=symbol;c.platform_enabled=symbol!=='SOLUSDT';c.enabled=symbol==='BTCUSDT';for(const r of c.rules){r.rule.symbol=symbol;r.platform_enabled=c.platform_enabled;r.rule.enabled=c.enabled&&r.platform_enabled&&r.owner_enabled}return c})
 const v=await mount('OwnerConfig',{api:{list:async()=>({items}),directory:async()=>['SOLUSDT','ADAUSDT','ETHUSDT','BTCUSDT','XRPUSDT']}})
 try {
  const buttons=walk(v.root).filter(n=>n.type==='button'&&n.props.class?.includes('symbol-option'))
  assert.deepEqual(buttons.map(n=>walk(n).find(child=>child.type==='stub')?.props.symbol),['BTCUSDT','ADAUSDT','ETHUSDT'])
  buttons[2].props.onClick();await tick()
  const toggle=walk(v.root).find(n=>n.type==='el-switch'&&n.props['aria-label']==='币种开关')
  assert.equal(toggle.props.modelValue,false);assert.equal(toggle.props.disabled,false)
 }finally{v.unmount()}
})

test('room tabs retain unsaved edits across rooms and submit them together',async()=>{
 const v=await mount('OwnerConfig');try {
 const input=label=>walk(v.root).find(n=>n.type==='mm-input'&&n.props['aria-label']===label)
 assert.ok(input('5秒单笔最小额'));assert.equal(input('10秒单笔最小额'),undefined)
 input('5秒单笔最小额').props['onUpdate:modelValue']('0.5');await tick()
 const ten=walk(v.root).find(n=>n.type==='button'&&n.props['data-room-choice']==='40');assert.ok(ten);ten.props.onClick();await tick()
 assert.equal(input('5秒单笔最小额'),undefined);input('10秒单笔最小额').props['onUpdate:modelValue']('0.6');await tick()
 walk(v.root).find(n=>n.type==='button'&&n.props['data-room-choice']==='35').props.onClick();await tick();assert.equal(input('5秒单笔最小额').props.modelValue,'0.5')
 await walk(v.root).find(n=>n.type==='el-button'&&text(n)==='保存配置').props.onClick();await tick()
 const body=v.calls.find(x=>typeof x==='object');assert.deepEqual(body.changes.map(r=>[r.duration_seconds,r.minimum_stake]),[['35','0.5'],['40','0.6']])
 }finally{v.unmount()}
})

 test('owner deletion cancel keeps settings, confirmed draft saves room disable without changing coin or identity',async()=>{const v=await mount('OwnerConfig');try{
 const find=(key,value)=>walk(v.root).find(n=>n.props[key]===value)
 find('data-room-remove','40').props.onClick();await tick();find('data-room-cancel',true).props.onClick();await tick();assert.ok(find('data-room-choice','40'));assert.equal(v.calls.filter(c=>typeof c==='object').length,0)
 find('data-room-remove','40').props.onClick();await tick();find('data-room-confirm',true).props.onClick();await tick();assert.equal(find('data-room-choice','40'),undefined);assert.equal(v.calls.filter(c=>typeof c==='object').length,0)
 await walk(v.root).find(n=>n.type==='el-button'&&text(n)==='保存配置').props.onClick();await tick();const sent=v.calls.find(c=>typeof c==='object');assert.equal(sent.enabled,undefined);assert.deepEqual(sent.changes.map(c=>[c.duration_seconds,c.stake_tier_id,c.enabled]),[['40','tier-40',false]])
 }finally{v.unmount()}})

test('merchant shows platform precision as read only including explicit zero and legacy absence',async()=>{
 for(const n of [undefined,0,3,8]) {
  const cfg=fixture();for(const row of cfg.rules)row.rule.price_rule={max_age_milliseconds:'3000',late_arrival_grace_milliseconds:'500',...(n===undefined?{}:{price_decimals:n})}
  const v=await mount('OwnerConfig',{api:{list:async()=>({items:[cfg]})}})
  try {
   const display=walk(v.root).find(node=>node.props['data-price-precision']===true)
   assert.ok(display);assert.match(text(display),n===undefined?/沿用原规则/:new RegExp(n+' 位'))
   assert.equal(walk(display).some(node=>node.type==='mm-input'||node.type==='el-input-number'),false)
  }finally{v.unmount()}
 }
})
