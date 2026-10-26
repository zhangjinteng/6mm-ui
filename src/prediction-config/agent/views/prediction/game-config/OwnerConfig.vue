<template>
<section class="prediction-config prediction-table-page" data-prediction-page="OWNER_CONFIG">
    <nav class="game-tabs" aria-label="选择预测玩法">
        <el-button v-for="tab in tabs" :key="tab.key" :type="mode===tab.key?'primary':undefined" :aria-pressed="mode===tab.key" :disabled="locked" @click="selectGame(tab.key)"><svg class="game-choice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><template v-if="tab.key === 'UP_DOWN'"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V8"/></template><template v-else-if="tab.key === 'HIGH_LOW'"><path d="m9 9 5 12 1.8-5.2L21 14Z"/><path d="M7.2 2.2 8 5.1M5.1 8l-2.9-.8M14 4.1 12 6M6 12l-1.9 2"/></template><template v-else><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/></template></svg><span class="game-choice-content"><strong>{{tab.label}}</strong><small>{{tab.description}}</small></span></el-button>
    </nav>
    <p v-if="legacyBlocked" role="alert">发现旧配置模式尚未确认的请求，已保留原请求。请联系管理员核对原操作回执后完成迁移，当前暂停新配置保存。</p>
    <p v-if="storageError" role="alert">无法读取或保全待确认请求，当前暂停配置保存。</p>
    <GridConfig v-if="mode==='GRID'" ref="gridRef" class="grid-mode" />
    <div v-else class="config-layout">
        <aside class="symbol-directory" aria-label="交易对配置">
            <h3>交易对配置 <small>{{items.filter(i=>i.platform_enabled).length}} 条</small></h3>
            <MmInput v-model="search" placeholder="搜索币种" aria-label="搜索币种" clearable />
            <p v-if="loading" role="status">正在加载配置…</p>
            <div v-if="loadError" class="catalog-error" role="alert">{{loadError}} <el-button size="small" :disabled="busy||!!pending||loading" @click="load">读取最新配置（放弃未保存修改）</el-button></div>
            <div class="symbol-list">
                <div v-for="item in visible" :key="item.symbol" class="symbol-entry" :class="{selected:item.symbol===symbol}">
                    <button class="symbol-option" :aria-pressed="item.symbol===symbol" :disabled="locked" @click="selectSymbol(item.symbol)"><SymbolCell :symbol="item.symbol" /><span class="symbol-status" :title="periodSummary(item)">{{periodSummary(item)}}</span></button>
                    <div class="symbol-all-control"><el-switch :aria-label="item.symbol===symbol?'币种开关':`${item.symbol} 币种开关`" :modelValue="item.symbol===symbol?coinEnabled:item.enabled" :disabled="item.symbol!==symbol||!editable||busy||!!pending||!item.platform_enabled" @update:model-value="coinEnabled=Boolean($event)" /></div>
                </div>
            </div>
            <p v-if="!loading&&!loadError&&!visible.length">当前没有可用的交易对配置。</p>
        </aside>
        <main class="config-content">
            <header class="config-title">
                <div><h3>{{symbol||'请选择交易对'}} · {{mode==='UP_DOWN'?'涨跌预测':'自选预测'}}</h3><p>当前商户生效</p></div>
                <div class="config-title-actions"><span v-if="dirty" class="draft-label">有未保存修改</span><el-button v-if="selected||pending" type="primary" :loading="busy" :disabled="!editable||busy||(!pending&&!dirty)||(!!pending&&pending.operator_id!==actor.operator_id)" @click="save">{{pending?'确认原保存结果':'保存配置'}}</el-button></div>
            </header>
            <p v-if="pending" role="alert">存在待确认操作（{{pending.body.symbol}}），请使用原请求确认结果。{{pending.operator_id!==actor.operator_id?'该操作属于另一个账号，需切回原账号处理。':''}}</p>
            <p v-if="message" role="status">{{message}}</p>
            <template v-if="selected">
                <p class="config-note">可关闭自己的币种或房间，并在平台范围内调整{{mode==='UP_DOWN'&&!maximumOddsEditingEnabled?'限额和目标返奖率，最高赔率使用平台配置':'限额和赔率'}}。平台修改对应房间后，限额和赔率恢复平台值，您主动关闭的选择会保留。</p>
                <p v-if="!coinEnabled" class="config-note">交易对已关闭；以下房间设置仍会保留。</p>
                <article class="parameter-card room-config"><header class="parameter-heading"><h4>房间配置</h4><p class="field-description">{{symbol}} · 当前商户生效</p></header><div class="room-config-body"><span class="field-label">支持周期</span>
                <FixedRoomControls :description="`${symbol} · ${mode==='UP_DOWN'?'涨跌预测':'自选预测'}`" :rooms="roomChoices" :selected="selectedRoom" :disabled="!editable||busy||!!pending||loading" :context="`${actor.operator_id}:${actor.agent_id}:${mode}:${symbol}:${roomGeneration}`" @select="selectedRoom=$event" @change="changeRoom" /><p class="config-note">变更只影响新订单，历史订单保留原配置快照。</p></div></article>
                <div class="parameter-cards">
                    <article class="parameter-card" :data-price-precision="true">
                        <header class="parameter-heading"><h4>价格精度</h4><p class="field-description">由平台统一设置，商户只读</p></header>
                        <div class="room-config-body">
                            <p class="field-label">价格小数位：{{selected.rules[0]?.rule.price_rule?.price_decimals === undefined ? '未设置（沿用原规则）' : `${selected.rules[0].rule.price_rule.price_decimals} 位`}}</p>
                            <p class="config-note">按所选位数截断，不四舍五入；旧订单保留原规则。</p>
                        </div>
                    </article>
                <template v-if="activeRow">

                    <p v-if="!activeRow.platform_enabled" class="config-note">平台已关闭此房间，暂不能开启。</p>
                        <article class="parameter-card"><header class="parameter-heading"><h4>赔率配置 · {{activeRow.observation_seconds}} 秒</h4>
                            <p class="field-description">{{mode==='UP_DOWN'?'上涨/下跌赔率按资金池动态计算':'下单时锁定当前周期固定赔率，上涨和下跌使用相同赔率。'}}</p></header>
                            <div v-if="mode==='UP_DOWN'" class="limit-fields odds-fields">
                                <el-form-item :label="`目标返奖率（平台上限 ${shiftDecimalText(activeRow.platform_target_payout_rate, 2)}%，且必须小于 100%）`"><DecimalInput :input-component="MmInput" v-model="activeRow.target_payout_rate" percentage unit="%" :max="shiftDecimalText(activeRow.platform_target_payout_rate, 2)" :disabled="!editable||busy||!!pending" :aria-label="`${activeRow.observation_seconds}秒目标返奖率`" /></el-form-item>
                                <el-form-item v-if="maximumOddsEditingEnabled" :label="`最高赔率（上限 ${activeRow.platform_maximum_odds}）`"><DecimalInput :input-component="MmInput" v-model="activeRow.maximum_odds" step="0.01" min="1" :max="activeRow.platform_maximum_odds" unit="x" :disabled="!editable||busy||!!pending" :aria-label="`${activeRow.observation_seconds}秒最高赔率`" /></el-form-item>
                            </div>
                            <div v-else class="limit-fields"><el-form-item :label="`固定赔率（平台上限 ${activeRow.platform_fixed_odds}，且必须小于 2，含本金）`"><DecimalInput :input-component="MmInput" v-model="activeRow.fixed_odds" step="0.01" min="1.01" :max="activeRow.platform_fixed_odds" unit="x" :disabled="!editable||busy||!!pending" :aria-label="`${activeRow.observation_seconds}秒固定赔率`" /></el-form-item></div>
                        </article>
                        <article class="parameter-card"><header class="parameter-heading"><h4>下注限制 · {{activeRow.observation_seconds}} 秒</h4><p class="field-description">平台单笔范围：{{activeRow.platform_minimum}} ~ {{activeRow.platform_maximum}} USDT。变更不影响已受理订单。</p></header>
                            <div class="limit-fields"><el-form-item label="单笔最小额"><DecimalInput :input-component="MmInput" v-model="activeRow.minimum_stake" :min="activeRow.platform_minimum" :max="activeRow.maximum_stake" :disabled="!editable||busy||!!pending" :aria-label="`${activeRow.observation_seconds}秒单笔最小额`"><template #append>USDT</template></DecimalInput></el-form-item><el-form-item label="单笔最大额"><DecimalInput :input-component="MmInput" v-model="activeRow.maximum_stake" :min="activeRow.minimum_stake" :max="activeRow.platform_maximum" :disabled="!editable||busy||!!pending" :aria-label="`${activeRow.observation_seconds}秒单笔最大额`"><template #append>USDT</template></DecimalInput></el-form-item></div>
                        </article>
                </template>
                </div>
            </template>
        </main>
    </div>
</section>
</template>
<script setup lang="ts">
import { ElButton, ElSwitch, ElFormItem } from 'element-plus'
import { MmInput } from '../../../../ui'

import { useAgentConfigRuntime } from '../../../../runtime'
const { ownerConfigurations, ownerConfiguration, saveOwnerConfiguration, siteDirectorySymbols } = useAgentConfigRuntime().api

import {computed,onBeforeUnmount,ref,shallowRef,watch} from 'vue'
import DecimalInput from '../../../../platform/views/prediction/components/DecimalInput.vue'
import { shiftDecimalText } from '../../../../platform/views/prediction/components/decimal-step'
import FixedRoomControls from '../../../../platform/views/prediction/components/FixedRoomControls.vue'
import {sortConfigSymbols} from '../../grid/config/directory'
import GridConfig from '../../grid/config/index.vue'
import { useConfigSymbol } from '../../../../runtime'
const SymbolCell = useConfigSymbol()
import { useConfigUser as useUserStore } from '../../../../runtime'
import type {OwnerActor,OwnerConfig} from '../../../api/prediction/owner-types'
import type {SiteGame} from '../../../api/prediction/site-types'
import {assertOwnerConfig,canManageOwnerConfig,ownerRows,makeOwnerBody,OwnerReadGate,type OwnerRow} from './owner-model'
import {readOwnerPending,persistOwnerPending,dispatchOwnerPendingWithRefresh,type OwnerPending} from './owner-mutation'
import {siteRequestId} from './site-model'
import {identity} from '../shared/format'
const props=defineProps<{actor:OwnerActor}>(),user=useUserStore()
// 暂时隐藏商户涨跌最高赔率入口；保留编辑与原请求恢复能力，后续开放时可恢复。
const maximumOddsEditingEnabled=false
const tabs=[{key:'UP_DOWN',label:'涨跌预测',description:'按系统场次预测结算价格相对开盘价格上涨或下跌'},{key:'HIGH_LOW',label:'自选预测',description:'用户自主选择方向和预测周期，生成独立预测订单'},{key:'GRID',label:'预测网格',description:'按时间格与价格区间展示网格预测规则'}] as const
const mode=ref<SiteGame|'GRID'>('UP_DOWN'),items=shallowRef<OwnerConfig[]>([]),symbol=ref(''),search=ref(''),rows=ref<OwnerRow[]>([]),loading=ref(false),busy=ref(false),loadError=ref(''),message=ref(''),pending=shallowRef<OwnerPending|null>(null),legacyBlocked=ref(false),storageError=ref(false)
const gate=new OwnerReadGate();let mounted=true
const current=()=>mounted&&canManageOwnerConfig(props.actor)&&identity(user.userInfo.id)===props.actor.operator_id&&user.userInfo.can_manage_prediction_config===true&&(user.perms.includes('*')||user.perms.includes('prediction_config:lists'))
const editable=computed(()=>current()&&(user.perms.includes('*')||user.perms.includes('prediction_config:edit'))&&!legacyBlocked.value&&!storageError.value)
const selected=computed(()=>items.value.find(i=>i.symbol===symbol.value))
const selectedRoom=ref('35'),roomGeneration=ref(0)
const presentRows=computed(()=>rows.value.filter(row=>row.owner_enabled&&row.platform_enabled))
const activeRow=computed(()=>presentRows.value.find(row=>row.duration_seconds===selectedRoom.value))
const roomChoices=computed(()=>rows.value.map(row=>({key:row.duration_seconds,label:`${row.observation_seconds}秒`,present:row.owner_enabled&&row.platform_enabled,allowed:row.platform_enabled})))
function changeRoom(key:string,present:boolean){
    if(!editable.value||busy.value||pending.value||loading.value)return
    const row=rows.value.find(row=>row.duration_seconds===key)
    if(!row||row.owner_enabled===present||(present&&!row.platform_enabled))return
    row.owner_enabled=present;selectedRoom.value=present?key:presentRows.value[0]?.duration_seconds??''
}
function periodSummary(item:OwnerConfig){
    const durations=item.symbol===symbol.value?presentRows.value.map(row=>row.observation_seconds):item.rules.filter(row=>row.owner_enabled&&row.platform_enabled).map(row=>mode.value==='UP_DOWN'?String(BigInt(row.rule.duration_seconds)-30n):row.rule.duration_seconds)
    return durations.length?durations.map(duration=>`${duration}秒`).join(' · '):'暂无房间'
}
const coinEnabled=ref(true),formState=()=>JSON.stringify([coinEnabled.value,rows.value.map(r=>[r.minimum_stake,r.maximum_stake,r.owner_enabled,r.target_payout_rate,r.maximum_odds,r.fixed_odds])])
const initial=ref(''),dirty=computed(()=>formState()!==initial.value)
const gridRef=shallowRef<InstanceType<typeof GridConfig>>()
const locked=computed(()=>busy.value||dirty.value||!!pending.value||(mode.value==='GRID'&&!!gridRef.value?.hasBlockingWork))
const directoryOrder=ref<string[]>([])
const visible=computed(()=>sortConfigSymbols(items.value.filter(i=>i.platform_enabled),directoryOrder.value,i=>i.platform_enabled&&i.enabled).filter(i=>i.symbol.includes(search.value.trim().toUpperCase())))
function readPending() {try {pending.value=readOwnerPending(localStorage);legacyBlocked.value=['prediction.agent.pending.v1','prediction.site.pending.v1'].some(k=>localStorage.getItem(k)!==null);storageError.value=false}catch{storageError.value=true}}
function project(){roomGeneration.value++;rows.value=selected.value?ownerRows(selected.value,props.actor):[];coinEnabled.value=selected.value?.enabled??true;if(!presentRows.value.some(row=>row.duration_seconds===selectedRoom.value))selectedRoom.value=presentRows.value[0]?.duration_seconds??'';initial.value=formState()}
function selectSymbol(value:string){if(locked.value)return;symbol.value=value;message.value='';project()}
function selectGame(value:SiteGame|'GRID'){if(locked.value)return;mode.value=value;void load()}
async function load(){
    const game=mode.value,ticket=gate.begin(props.actor,game,'');items.value=[];symbol.value='';project();loadError.value='';loading.value=false
    if(!current()||game==='GRID')return
    loading.value=true
    try{const [result,ordered]=await Promise.all([ownerConfigurations(game),siteDirectorySymbols()]);if(!gate.current(ticket,props.actor,mode.value,'')||!current())return
        if(!Array.isArray(result.items)||new Set(result.items.map(i=>i.symbol)).size!==result.items.length)throw Error('INVALID_CATALOG')
        for(const item of result.items){assertOwnerConfig(item,props.actor);if(item.game_type!=='GAME_TYPE_'+game)throw Error('WRONG_GAME')}
        if(!Array.isArray(ordered)||!ordered.every(s=>typeof s==='string'))throw Error('INVALID_SYMBOL_DIRECTORY');directoryOrder.value=ordered;items.value=result.items;symbol.value=visible.value[0]?.symbol??'';project()
    }catch{if(gate.current(ticket,props.actor,mode.value,'')&&current())loadError.value='配置加载失败，请重试。'}
    finally{if(gate.current(ticket,props.actor,mode.value,''))loading.value=false}
}
async function save(){
    readPending();if(!editable.value||busy.value)return
    const game=mode.value,selectedSymbol=symbol.value
    try{
        if(!pending.value){if(!selected.value)return;pending.value=persistOwnerPending(localStorage,props.actor,makeOwnerBody(selected.value,props.actor,rows.value,'通过商户玩法配置页面保存配置',siteRequestId(),coinEnabled.value))}
        const original=pending.value;if(original.operator_id!==props.actor.operator_id||original.agent_id!==props.actor.agent_id)return
        busy.value=true;message.value=''
        const result=await dispatchOwnerPendingWithRefresh(localStorage,original,body=>{if(!current())throw Error('IDENTITY_CHANGED');return saveOwnerConfiguration(body)},async body=>{
            if(!current())throw Error('IDENTITY_CHANGED');const value=await ownerConfiguration(body.game_type,body.symbol);assertOwnerConfig(value.configuration,props.actor)
            if(value.configuration.symbol!==body.symbol||value.configuration.game_type!=='GAME_TYPE_'+body.game_type)throw Error('WRONG_CONFIGURATION');return value.configuration
        })
        if(!current()||mode.value!==game||symbol.value!==selectedSymbol)return
        readPending()
        if(result.status==='success'){
            message.value=result.refreshFailed?'保存已成功，配置刷新失败，请重新打开页面查看；无需再次保存。':'配置已保存并生效。'
            if(result.latest && result.latest.symbol===symbol.value && result.latest.game_type==='GAME_TYPE_'+mode.value){items.value=items.value.map(i=>i.symbol===symbol.value?result.latest!:i);project()}
            else {items.value=[];symbol.value='';project();loadError.value='保存已确认，请重试读取最新配置。'}
        }else {message.value=result.status==='rejected'?'保存未通过，请重新读取配置后调整。':'暂未确认保存结果，请稍后使用原请求确认。';if(result.status==='rejected')loadError.value='保存被拒绝，请读取最新配置后修改。'}
    }catch(error){message.value=error instanceof Error&&error.message==='NO_CHANGES'?'配置没有变化。':'无法保存，请检查金额、赔率范围及待确认请求。'}
    finally{busy.value=false}
}
readPending();void load()
watch(()=>[user.userInfo.id,user.token,user.userInfo.can_manage_prediction_config,user.perms.join('|')],()=>{gate.close();items.value=[];rows.value=[];initial.value='[]';symbol.value='';message.value='';readPending()},{flush:'sync'})
onBeforeUnmount(()=>{mounted=false;gate.close()})
</script>
<style scoped>
.prediction-config { font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; font-size:12px; color:var(--el-text-color-primary); display:flex; flex-direction:column; gap:12px; height:calc(100dvh - var(--mm-navbar-height, 64px) - 24px); min-height:420px; }
h3,h4,p { margin:0; }
.game-tabs { display:flex; flex-shrink:0; border:1px solid var(--el-border-color-lighter); border-radius:8px; overflow:hidden; background:var(--el-bg-color); }
.game-tabs .el-button { flex:1; min-width:0; height:72px; margin:0; padding:12px 16px; border:0; border-right:1px solid var(--el-border-color-lighter); border-bottom:3px solid transparent; border-radius:0; background:transparent; text-align:left; justify-content:flex-start; }
.game-tabs .el-button:last-child { border-right:0; }
.game-tabs .el-button[aria-pressed='true'] { border-bottom-color:var(--el-color-primary); background:var(--el-color-primary-light-9); color:var(--el-color-primary); }
.game-tabs :deep(.el-button > span) { display:block; white-space:normal; }
.game-tabs strong { font-size:13px; font-weight:700; }
.game-tabs small { display:block; margin-top:5px; font-size:10px; font-weight:400; line-height:14px; color:var(--el-text-color-secondary); }
.config-layout { display:grid; grid-template-columns:290px minmax(0,1fr); flex:1; min-height:0; border:1px solid var(--el-border-color-lighter); border-radius:8px; overflow:hidden; background:var(--el-bg-color); }
.symbol-directory { min-height:0; padding:14px 10px 10px; border-right:1px solid var(--el-border-color-lighter); display:flex; flex-direction:column; }
.symbol-directory h3 { display:flex; justify-content:space-between; align-items:center; margin:2px 3px 10px; font-size:13px; font-weight:700; }
.symbol-directory h3 small { font-size:10px; color:var(--el-text-color-secondary); font-weight:400; }
.symbol-directory > :deep(.mm-input) { flex-shrink:0; }
.symbol-list { display:grid; align-content:start; gap:6px; margin-top:8px; overflow-y:auto; min-height:0; }
.symbol-entry { display:flex; align-items:center; border:1px solid transparent; border-radius:6px; }
.symbol-entry.selected { border-color:var(--el-color-primary); background:var(--el-color-primary-light-9); box-shadow:inset 2px 0 var(--el-color-primary); }
.symbol-option { flex:1; min-width:0; position:relative; display:grid; align-content:center; gap:2px; text-align:left; border:0; padding:5px 7px 5px 41px; min-height:46px; color:inherit; background:transparent; cursor:pointer; }
.symbol-option:disabled { cursor:not-allowed; opacity:.55; }
.symbol-option :deep(.symbol-cell__icon) { position:absolute; left:7px; top:50%; transform:translateY(-50%); width:26px!important; height:26px!important; }
.symbol-option :deep(.symbol-cell__text) { font-size:11px; font-weight:700; }
.symbol-status { min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--el-text-color-secondary); font-size:10px; line-height:14px; }
.symbol-all-control { flex-shrink:0; padding-right:7px; }
.symbol-all-control :deep(.el-switch) { --el-switch-height:20px; --el-switch-button-size:14px; --el-switch-width:34px; }
.symbol-all-control :deep(.el-switch__core) { min-width:34px; }
.config-content { min-width:0; padding:14px; overflow-y:auto; }
.config-title { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; margin:-14px -14px 12px; padding:18px 16px; border-bottom:1px solid var(--el-border-color-lighter); }
.config-title h3 { font-size:15px; font-weight:700; line-height:19px; }
.config-title p { margin-top:4px; font-size:10px; line-height:14px; color:var(--el-text-color-secondary); }
.config-title-actions { display:flex; align-items:center; gap:10px; }
.config-title-actions .el-button { height:30px; padding:5px 10px; border-radius:6px; font-size:10px; font-weight:650; }
.config-note { font-size:10px; line-height:16px; color:var(--el-text-color-secondary); }
.config-content > .config-note { margin:8px 0; }
.parameter-cards { display:grid; gap:10px; }
.parameter-card { border:1px solid var(--el-border-color-lighter); border-radius:8px; min-width:0; overflow:hidden; }
.parameter-heading { padding:12px; border-bottom:1px solid var(--el-border-color-lighter); }
.parameter-heading h4 { font-size:12px; font-weight:700; line-height:16px; }
.field-description { margin:3px 0 0; font-size:10px; line-height:14px; color:var(--el-text-color-secondary); }
.room-config { margin:10px 0; }
.room-config-body { padding:12px; }
.field-label { font-size:10px; font-weight:650; }
.room-heading { margin:10px 0; }
.room-heading h3 { font-size:11px; font-weight:650; }
.limit-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; padding:12px; }
.odds-fields { grid-template-columns:repeat(3,minmax(0,1fr)); }
@media(max-width:1100px) { .odds-fields { grid-template-columns:minmax(0,1fr); } }
.parameter-card :deep(.el-form-item) { display:block; margin-bottom:0; }
.parameter-card :deep(.el-form-item__label) { font-size:10px; font-weight:650; line-height:14px; height:auto; margin-bottom:6px; color:var(--el-text-color-primary); }
.room-config :deep(.room-tag) { height:34px; }
.room-config :deep(.room-tag button) { height:32px; font-size:10px; }
.room-config :deep(.room-tag .room-remove) { height:22px; }
.room-config :deep(.room-add) { height:34px; font-size:10px; padding:3px 9px; border-radius:5px; }
.draft-label { color:var(--el-color-warning); font-size:10px; }
p[role=alert], .catalog-error { color:var(--el-color-danger); font-size:11px; line-height:1.6; margin:8px 0; }
@media(max-width:1000px) { .config-layout { grid-template-columns:290px minmax(0,1fr); } }
@media(max-width:760px) { .prediction-config { height:auto; } .config-layout { grid-template-columns:1fr; } .symbol-directory { border-right:0; border-bottom:1px solid var(--el-border-color-lighter); } .symbol-list { max-height:220px; } .limit-fields { grid-template-columns:1fr; } .game-tabs .el-button { height:auto; min-height:72px; padding:10px; } }
.game-choice-icon { flex:none; width:20px; height:20px; margin-right:12px; }
.game-tabs :deep(.el-button > span) { display:flex; align-items:center; min-width:0; }
.game-choice-content { display:block; min-width:0; }
.game-choice-content strong { display:block; }

.prediction-config :deep(button), .prediction-config :deep(input) { font-family:inherit; }
</style>
