import type { GameplayConfig, SaveBody, SaveResult } from '../../../api/prediction/types'
import { compareDecimal, decimal, identity, integer, text } from './format'
const durations=['35','40','45','60','90'] as const
const storageKey='prediction.agent.pending.v1'
export type PendingStorage=Pick<Storage,'getItem'|'setItem'|'removeItem'>
export interface EditableRow {
    duration_seconds:string;observation_seconds:string;stake_tier_id:string
    enabled:boolean;maximum_stake:string;minimum:string;maximum:string;editable:boolean
    rule_enabled:boolean;tier_enabled:boolean
}
export interface Pending {
    schema:1;operator_id:string;agent_id:string;body:SaveBody;attempted:boolean;attempt:number
}
const object=(v:unknown):v is Record<string,unknown> => !!v&&typeof v==='object'&&!Array.isArray(v)
function requireTrue(ok:unknown,code='INVALID_CONFIGURATION'):asserts ok {if(!ok)throw new Error(code)}
function shape(value:unknown):asserts value is GameplayConfig {
    requireTrue(object(value))
    requireTrue(value.scope==='CONFIG_SCOPE_AGENT' && identity(value.agent_id)===value.agent_id)
    requireTrue(integer(value.template_version)&&integer(value.agent_version)&&text(value.effective_version,256)&&integer(value.updated_at_ms))
    requireTrue(Array.isArray(value.rules)&&value.rules.length===5)
    const rules=value.rules as Array<Record<string,unknown>>,symbol=rules[0]?.symbol
    requireTrue(text(symbol,64,true))
    requireTrue(new Set(rules.map(r=>r.duration_seconds)).size===5)
    for(const r of rules) {
        requireTrue(object(r)&&r.game_type==='GAME_TYPE_UP_DOWN'&&r.symbol===symbol&&durations.includes(r.duration_seconds as typeof durations[number])&&typeof r.enabled==='boolean')
        requireTrue(Array.isArray(r.stake_tiers)&&r.stake_tiers.every(t=>object(t)&&text(t.stake_tier_id)&&typeof t.enabled==='boolean'&&typeof t.retired==='boolean'))
    }
}
export function configSymbol(config:GameplayConfig):string {
    shape(config)
    return config.rules[0].symbol
}
export function editableRows(value:unknown):EditableRow[] {
    shape(value)
    return durations.map(duration=>{
        const rule=value.rules.find(r=>r.duration_seconds===duration)!
        const live=rule.stake_tiers.filter(t=>!t.retired)
        requireTrue(live.length===1)
        const tier=live[0],maximum=tier.maximum_stake
        requireTrue(maximum&&decimal(maximum.value)&&decimal(maximum.minimum_value)&&decimal(maximum.maximum_value)&&typeof maximum.agent_editable==='boolean')
        requireTrue(compareDecimal(maximum.minimum_value,'1')>=0&&compareDecimal(maximum.minimum_value,maximum.maximum_value)<=0&&compareDecimal(maximum.value,maximum.minimum_value)>=0&&compareDecimal(maximum.value,maximum.maximum_value)<=0)
        requireTrue(rule.bet_open_seconds?.value==='30'&&tier.minimum_stake?.value==='1')
        return {duration_seconds:duration,observation_seconds:String(Number(duration)-30),stake_tier_id:tier.stake_tier_id,enabled:rule.enabled&&tier.enabled,maximum_stake:maximum.value,minimum:maximum.minimum_value,maximum:maximum.maximum_value,editable:maximum.agent_editable,rule_enabled:rule.enabled,tier_enabled:tier.enabled}
    })
}
export function makeBody(config:GameplayConfig,rows:EditableRow[],reason:string,key:string):SaveBody {
    const original=editableRows(config)
    requireTrue(rows.length===5&&new Set(rows.map(r=>r.duration_seconds)).size===5)
    requireTrue(text(reason,500)&&text(key,128),'INVALID_REASON')
    const overrides=original.map(old=>{
        const row=rows.find(r=>r.duration_seconds===old.duration_seconds)
        requireTrue(row&&row.stake_tier_id===old.stake_tier_id&&typeof row.enabled==='boolean')
        requireTrue(decimal(row.maximum_stake)&&compareDecimal(row.maximum_stake,'1')>=0&&compareDecimal(row.maximum_stake,old.minimum)>=0&&compareDecimal(row.maximum_stake,old.maximum)<=0,'INVALID_MAXIMUM')
        requireTrue(old.editable||row.maximum_stake===old.maximum_stake,'READ_ONLY_MAXIMUM')
        return {duration_seconds:old.duration_seconds,enabled:row.enabled,stake_tiers:[{stake_tier_id:old.stake_tier_id,enabled:row.enabled,maximum_stake:row.maximum_stake}]}
    })
    return {client_request_id:key,reason,based_on_template_version:config.template_version,based_on_agent_version:config.agent_version,game_type:'UP_DOWN',symbol:config.rules[0].symbol,agent_override:{enabled:overrides.some(r=>r.enabled),overrides}}
}
function keys(v:Record<string,unknown>,expected:string[]) { requireTrue(Object.keys(v).length===expected.length&&Object.keys(v).every(k=>expected.includes(k)),'PENDING_CORRUPT') }
function bodyShape(v:unknown):asserts v is SaveBody {
    requireTrue(object(v),'PENDING_CORRUPT')
    keys(v,['client_request_id','reason','based_on_template_version','based_on_agent_version','game_type','symbol','agent_override'])
    requireTrue(text(v.client_request_id,128)&&text(v.reason,500)&&integer(v.based_on_template_version)&&integer(v.based_on_agent_version)&&v.game_type==='UP_DOWN'&&text(v.symbol,64,true),'PENDING_CORRUPT')
    const override=v.agent_override
    requireTrue(object(override),'PENDING_CORRUPT');keys(override,['enabled','overrides'])
    requireTrue(typeof override.enabled==='boolean'&&Array.isArray(override.overrides)&&override.overrides.length===5,'PENDING_CORRUPT')
    const rows=override.overrides as Array<Record<string,unknown>>
    requireTrue(new Set(rows.map(r=>r.duration_seconds)).size===5,'PENDING_CORRUPT')
    for(const row of rows) {
        requireTrue(object(row),'PENDING_CORRUPT');keys(row,['duration_seconds','enabled','stake_tiers'])
        requireTrue(durations.includes(row.duration_seconds as typeof durations[number])&&typeof row.enabled==='boolean'&&Array.isArray(row.stake_tiers)&&row.stake_tiers.length===1,'PENDING_CORRUPT')
        const tier=row.stake_tiers[0];requireTrue(object(tier),'PENDING_CORRUPT');keys(tier,['stake_tier_id','enabled','maximum_stake'])
        requireTrue(text(tier.stake_tier_id)&&tier.enabled===row.enabled&&decimal(tier.maximum_stake)&&compareDecimal(tier.maximum_stake,'1')>=0,'PENDING_CORRUPT')
    }
    requireTrue(override.enabled===rows.some(r=>r.enabled),'PENDING_CORRUPT')
}
function frozen<T>(value:T):T {
    if(value&&typeof value==='object') {Object.freeze(value);for(const child of Object.values(value))frozen(child)}
    return value
}
export function readPending(storage:PendingStorage):Pending|null {
    const raw=storage.getItem(storageKey)
    if(raw===null)return null
    requireTrue(raw.length<=32768,'PENDING_CORRUPT')
    let value:unknown
    try {value=JSON.parse(raw)} catch {throw new Error('PENDING_CORRUPT')}
    requireTrue(object(value),'PENDING_CORRUPT');keys(value,['schema','operator_id','agent_id','body','attempted','attempt'])
    requireTrue(value.schema===1&&identity(value.operator_id)===value.operator_id&&identity(value.agent_id)===value.agent_id&&typeof value.attempted==='boolean'&&Number.isSafeInteger(value.attempt)&&Number(value.attempt)>=0&&value.attempted===(Number(value.attempt)>0),'PENDING_CORRUPT')
    bodyShape(value.body)
    return frozen(value as unknown as Pending)
}
const same=(a:Pending|null,b:Pending)=>!!a&&a.operator_id===b.operator_id&&a.agent_id===b.agent_id&&JSON.stringify(a.body)===JSON.stringify(b.body)
export function persistPending(storage:PendingStorage,operator:string,agent:string,body:SaveBody):Pending {
    requireTrue(identity(operator)===operator&&identity(agent)===agent,'IDENTITY_UNCONFIRMED')
    requireTrue(readPending(storage)===null,'PENDING_EXISTS');bodyShape(body)
    const value:Pending={schema:1,operator_id:operator,agent_id:agent,body:JSON.parse(JSON.stringify(body)),attempted:false,attempt:0}
    storage.setItem(storageKey,JSON.stringify(value))
    requireTrue(same(readPending(storage),value),'PERSISTENCE_UNAVAILABLE')
    return frozen(value)
}
export function restorePending(storage:PendingStorage,operator:string,agent:string):Pending|null {
    const value=readPending(storage)
    return value&&value.operator_id===operator&&value.agent_id===agent?value:null
}
export function clearPending(storage:PendingStorage,pending:Pending):void {
    if(same(readPending(storage),pending))storage.removeItem(storageKey)
}
export function validSuccess(value:unknown,body:SaveBody,operator:string,agent:string):value is SaveResult {
    try {
        requireTrue(object(value)&&object(value.receipt));shape(value.configuration)
        requireTrue(value.configuration.agent_id===agent&&value.configuration.rules[0].symbol===body.symbol)
        const receipt=value.receipt
        const strings=['operation_id','operator_id','client_request_id','capability','action','target_type','target_id','reason','before_json','after_json','result','error_code','created_at_ms','completed_at_ms','source_service','trace_id']
        requireTrue(strings.every(k=>typeof receipt[k]==='string'))
        requireTrue(text(receipt.operation_id,256)&&text(receipt.trace_id,256)&&integer(receipt.created_at_ms)&&integer(receipt.completed_at_ms))
        requireTrue(receipt.client_request_id===body.client_request_id&&receipt.operator_id===operator&&receipt.source_service==='agent_admin'&&receipt.result==='OPERATION_RESULT_SUCCEEDED'&&receipt.reason===body.reason)
        return true
    } catch {return false}
}
export function isDeterminate(error:unknown):boolean {
    if(!object(error))return false
    if(['INVALID_ARGUMENT','UNAUTHENTICATED','PERMISSION_DENIED','NOT_FOUND','CONFLICT'].includes(String(error.error_code)))return true
    return object(error.response)&&[401,403,422].includes(Number(error.response.status))
}
export type DispatchResult={status:'success';value:SaveResult}|{status:'rejected'|'unknown'|'superseded';error:unknown}
const active=new WeakMap<PendingStorage,{pending:Pending;promise:Promise<DispatchResult>}>()
export function dispatchPending(storage:PendingStorage,pending:Pending,send:(body:SaveBody)=>Promise<unknown>):Promise<DispatchResult> {
    const running=active.get(storage)
    if(running) {
        requireTrue(same(running.pending,pending),'PENDING_EXISTS')
        return running.promise
    }
    const stored=readPending(storage)
    requireTrue(same(stored,pending),'PENDING_CHANGED')
    const hadAttempt=stored!.attempted
    const attempt=stored!.attempt+1
    requireTrue(Number.isSafeInteger(attempt),'ATTEMPT_LIMIT')
    storage.setItem(storageKey,JSON.stringify({...stored,attempted:true,attempt}))
    const saved=readPending(storage)
    requireTrue(saved?.attempt===attempt&&same(saved,pending),'PERSISTENCE_UNAVAILABLE')
    const promise=Promise.resolve().then(async():Promise<DispatchResult>=>{
        try {
            const value=await send(pending.body)
            if(!same(readPending(storage),pending))return {status:'superseded',error:null}
            if(!validSuccess(value,pending.body,pending.operator_id,pending.agent_id))return {status:'unknown',error:new Error('INVALID_RECEIPT')}
            clearPending(storage,pending)
            return {status:'success',value}
        } catch(error) {
            const current=readPending(storage)
            if(!same(current,pending))return {status:'superseded',error}
            const wrongKey=object(error)&&error.client_request_id!==undefined&&error.client_request_id!==pending.body.client_request_id
            if(!hadAttempt&&current!.attempt===attempt&&!wrongKey&&isDeterminate(error)) {
                clearPending(storage,pending)
                return {status:'rejected',error}
            }
            return {status:'unknown',error}
        }
    }).finally(()=>{if(active.get(storage)?.promise===promise)active.delete(storage)})
    active.set(storage,{pending,promise})
    return promise
}
export class IntentGate {
    private generation=0
    next():()=>boolean { const generation=++this.generation;return ()=>generation===this.generation }
    close():void { this.generation++ }
}
