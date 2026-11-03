<template>
    <section class="grid-config mm-ui" data-grid-config="platform">
        <el-alert v-if="message" :title="message" type="warning" :closable="false" />
        <el-alert v-if="!canRead" title="当前账号没有预测网格配置查询权限" type="warning" :closable="false" />
        <div v-if="pending" class="pending-bar">
            <strong>{{ pending.command.symbol }} 配置结果待确认</strong>
            <el-button :disabled="busy || !canSave" @click="submit('receipt')">查询原操作回执</el-button>
            <el-button v-if="recoverable" :disabled="busy || !canSave" @click="submit('recover')">恢复原请求</el-button>
        </div>
        <div class="grid-layout">
            <aside class="symbol-panel">
                <div class="panel-heading"><strong>币种配置</strong><span>{{ filtered.length }} 条</span></div>
                <MmInput v-model="keyword" clearable placeholder="搜索交易对" aria-label="搜索交易对" />
                <div class="symbol-list">
                    <div v-for="item in filtered" :key="item.symbol" class="symbol-row" :class="{active:item.symbol===symbol}">
                        <button type="button" class="symbol-button" :disabled="busy || !!pending" @click="switchSymbol(item.symbol)"><SymbolDisplay :symbol="item.symbol" /></button>
                        <span class="symbol-unconfigured">{{ item.configured ? '已配置' : '待配置' }}</span>
                    </div>
                </div>
            </aside>
            <main class="config-panel">
                <header v-if="symbol" class="config-heading">
                    <div><h2>{{ symbol }} · 预测网格</h2><p>平台模板</p></div>
                    <div class="config-heading__actions">
                        <el-button @click="guide=true">玩法说明</el-button>
                        <el-button v-if="canSave" type="primary" :disabled="locked || !dirty" :loading="busy" @click="save">保存配置</el-button>
                    </div>
                </header>
                <PredictionLoadingRegion :loading="busy && !snapshot" :hide-content="busy && !snapshot" min-height="0px" class="grid-config__detail">
                    <el-button v-if="loadFailed" :disabled="busy" @click="refresh">重新加载</el-button>
                    <el-empty v-else-if="!snapshot && !busy" description="请选择交易对查看配置" />
                    <div v-if="snapshot" class="grid-config__parameters">
                        <article class="parameter-card">
                            <header class="parameter-heading"><h3>网格区间配置</h3><p class="parameter-description">该币种的网格区间由平台统一设置。</p></header>
                            <el-form class="fields limit-fields" label-position="top" @submit.prevent>
                                <el-form-item label="纵向格子区间"><DecimalInput v-model="layoutDraft.price_band_width" :input-component="MmInput" unit="USDT" :disabled="locked" /></el-form-item>
                                <el-form-item label="横向格子区间"><DecimalInput v-model="layoutDraft.column_duration_seconds" :input-component="MmInput" unit="秒" min="1" max="10" :disabled="locked" /></el-form-item>
                            </el-form>
                        </article>
                        <article class="parameter-card">
                            <header class="parameter-heading"><h3>价格精度</h3></header>
                            <el-form class="fields limit-fields" label-position="top" @submit.prevent>
                                <el-form-item label="价格小数位"><DecimalInput v-model="layoutDraft.price_decimals" :input-component="MmInput" unit="位" min="0" max="8" :disabled="locked" /></el-form-item>
                            </el-form>
                        </article>
                        <article v-for="(group,i) in groups" :key="group.title" class="parameter-card">
                            <header class="parameter-heading"><h3>{{ group.title }}</h3></header>
                            <el-form class="fields" :class="i===0?'odds-fields':'limit-fields'" label-position="top" @submit.prevent>
                                <el-form-item v-for="[key,label,unit] in group.fields" :key="key" :label="label">
                                    <DecimalInput v-model="draft[key]" :input-component="MmInput" :unit="unit" :percentage="key==='target_rtp'" :step="unit==='x'?'0.01':'1'" :disabled="locked" />
                                </el-form-item>
                            </el-form>
                        </article>
                    </div>
                </PredictionLoadingRegion>
            </main>
        </div>
        <GridGuide v-model="guide" />
    </section>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { ElAlert, ElButton, ElEmpty, ElForm, ElFormItem, ElMessageBox } from 'element-plus'
import { useConfigBeforeLeave, useConfigRuntime, useConfigSymbol, usePlatformConfigRuntime } from '../../../../runtime'
import { MmInput } from '../../../../ui'
import DecimalInput from '../../prediction/components/DecimalInput.vue'
import GridGuide from '../../prediction/components/GridGuide.vue'
import PredictionLoadingRegion from '../../prediction/components/PredictionLoadingRegion.vue'
import { globalCommand, globalJournal, globalSnapshot, parameterFields, type GlobalCommand, type GlobalSnapshot, type LayoutFields, type Parameters } from './global-template'
import { isUnconfirmedReceipt, secureRequestId } from './model'
import type { PendingCommand } from './journal'

const grid=usePlatformConfigRuntime().grid
const api=grid.globalTemplate!
const runtime=useConfigRuntime(), SymbolDisplay=useConfigSymbol()
const groups=[{title:'赔率配置',fields:parameterFields.slice(0,3)},{title:'下注限制',fields:parameterFields.slice(3)}]
const can=(p:string)=>runtime.context.permissions.includes('*') || runtime.context.permissions.includes(p)
const operator=computed(()=>runtime.context.operatorId)
const canRead=computed(()=>!!runtime.context.identityKey && /^[1-9]\d*$/.test(operator.value) && can('grid_config:read'))
const canSave=computed(()=>canRead.value && can('grid_config:save'))
const products=ref<Array<{symbol:string;configured:boolean}>>([]), symbol=ref(''), keyword=ref('')
const filtered=computed(()=>products.value.filter(p=>p.symbol.includes(keyword.value.trim().toUpperCase())))
const snapshot=shallowRef<GlobalSnapshot|null>(null)
const empty=():Parameters=>({target_rtp:'',min_multiplier:'',max_multiplier:'',min_order_amount:'',max_order_amount:''})
const draft=ref(empty()),layoutDraft=ref({price_band_width:'',column_duration_seconds:'',price_decimals:'3'})
const guide=ref(false),busy=ref(false),loadFailed=ref(false),message=ref(''),recoverable=ref(false),journalBlocked=ref(false)
const pending=shallowRef<PendingCommand<GlobalCommand>|null>(null)
const layoutValues=(v:GlobalSnapshot)=>({price_band_width:v.layout?.price_band_width??'',column_duration_seconds:v.layout?.column_duration_seconds??'',price_decimals:String(v.layout?.price_decimals??3)})
const dirty=computed(()=>!!snapshot.value && (JSON.stringify(layoutDraft.value)!==JSON.stringify(layoutValues(snapshot.value)) || parameterFields.some(([k])=>draft.value[k] !== (snapshot.value?.parameters?.[k]??''))))
const locked=computed(()=>!canSave.value || busy.value || !!pending.value || journalBlocked.value)
let epoch=0,reader:AbortController|undefined
function journal(){
    try {
        const result=globalJournal.pendingForActor(sessionStorage,operator.value)
        pending.value=result.pending??null; journalBlocked.value=result.status==='foreign'
        if(journalBlocked.value) message.value='请切回原账号核对尚未确认的模板操作。'
    } catch { pending.value=null;journalBlocked.value=true;message.value='无法读取待确认操作，请先核对原请求。' }
}
function resetRead() {epoch++; reader?.abort();reader=new AbortController();return epoch}
async function detail(target:string){
    const seq=resetRead();busy.value=true;loadFailed.value=false;message.value='';symbol.value=target;snapshot.value=null
    try{
        const data=globalSnapshot(await api.detail(target,reader!.signal),target)
        if(seq!==epoch)return
        snapshot.value=data;draft.value={...(data.parameters??empty())};layoutDraft.value=layoutValues(data)
        const row=products.value.find(p=>p.symbol===target);if(row)row.configured=data.parameters!==null
    }catch{if(seq===epoch){loadFailed.value=true;message.value='读取平台模板失败，请重试。'}}
    finally{if(seq===epoch)busy.value=false}
}
async function refresh(){
    if(!canRead.value || dirty.value || busy.value)return
    journal();if(pending.value || journalBlocked.value)return
    const seq=resetRead();busy.value=true;message.value='';loadFailed.value=false
    try{
        const [catalog,symbols]=await Promise.all([api.catalog(reader!.signal),grid.gridConfigSymbols(reader!.signal)])
        if(seq!==epoch)return
        const statuses=new Map(catalog.products.map(p=>[p.symbol,p.configured]))
        products.value=[...new Set([...symbols,...statuses.keys()])].filter(s=>/^[A-Z0-9]{2,32}$/.test(s)).map(s=>({symbol:s,configured:statuses.get(s)===true}))
        const next=products.value.find(p=>p.symbol===symbol.value)??products.value[0]
        if(next)await detail(next.symbol)
    }catch{if(seq===epoch){loadFailed.value=true;message.value='读取平台币种目录失败，请重试。'}}
    finally{if(seq===epoch)busy.value=false}
}
async function confirmLeave(){
    if(busy.value || pending.value)return false
    if(!dirty.value)return true
    try{await ElMessageBox.confirm('放弃未保存的配置？','离开配置');return true}catch{return false}
}
async function switchSymbol(target:string){if(target!==symbol.value && await confirmLeave())await detail(target)}
function layoutChanges():Partial<LayoutFields>|undefined{
    const src=snapshot.value!, initial=layoutValues(src), change:Partial<LayoutFields>={}
    for(const k of ['price_band_width','column_duration_seconds'] as const){
        if(!src.layout || initial[k]!==layoutDraft.value[k])change[k]=layoutDraft.value[k]
    }
    if(!src.layout || initial.price_decimals!==layoutDraft.value.price_decimals){
        if(!/^[0-8]$/.test(layoutDraft.value.price_decimals))throw Error('价格小数位须为 0～8 的整数')
        change.price_decimals=Number(layoutDraft.value.price_decimals)
    }
    return Object.keys(change).length ? change : undefined
}
async function save(){
    if(locked.value || !snapshot.value || !dirty.value)return
    try{
        const command=globalCommand(snapshot.value,draft.value,secureRequestId(),layoutChanges())
        const review=globalJournal.captureSaveReview(operator.value,command)
        pending.value=globalJournal.persistReviewedCommand(sessionStorage,review,operator.value,command)
    }catch(e){message.value=e instanceof Error?e.message:'请核对模板参数';return}
    await submit('save')
}
async function submit(mode:'save'|'receipt'|'recover'){
    journal()
    if(busy.value || !pending.value || journalBlocked.value || !canSave.value)return
    const original=pending.value,seq=epoch;busy.value=true;recoverable.value=false
    try{
        const result=await globalJournal.attemptPending(sessionStorage,original,mode,(route,cmd)=>route==='save'?api.save(cmd):api.receipt(cmd))
        if(seq!==epoch)return
        journal()
        if(result.status==='success' || result.status==='rejected' && result.journalCleared){
            busy.value=false;snapshot.value=null;symbol.value=original.command.symbol;await refresh()
            if(result.status==='rejected')message.value='保存未生效，请核对最新配置后再提交。'
        }else{
            recoverable.value=mode==='receipt' && isUnconfirmedReceipt(result.error)
            message.value='保存结果待确认，请先查询原操作回执。'
        }
    }catch{if(seq===epoch)message.value='保存结果待确认，请先查询原操作回执。'}
    finally{if(seq===epoch)busy.value=false}
}
watch(()=>[operator.value,runtime.context.identityKey,canRead.value,canSave.value],()=>{
    resetRead();busy.value=false;snapshot.value=null;products.value=[];symbol.value='';message.value='';pending.value=null;journalBlocked.value=false
    if(canRead.value)void refresh()
},{immediate:true,flush:'sync'})
onBeforeUnmount(resetRead)
useConfigBeforeLeave(confirmLeave)
defineExpose({confirmLeave,refresh})
</script>
<style scoped src="./grid-config.css"></style>
