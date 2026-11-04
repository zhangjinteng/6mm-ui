import { createGridJournal, type PendingCommand } from './journal'
import { canonicalDecimal, compareDecimal } from './model'

export const parameterFields = [
    ['target_rtp', '目标返奖率', '%'], ['min_multiplier', '最低赔率', 'x'], ['max_multiplier', '最高赔率', 'x'],
    ['min_order_amount', '单笔最小额', 'USDT'], ['max_order_amount', '单笔最大额', 'USDT']
] as const
type Field = typeof parameterFields[number][0]
export type Parameters = Record<Field,string>
export type LayoutFields = {price_band_width:string; column_duration_seconds:string; price_decimals:number|null}
type Layout = LayoutFields & {version:string;row_count:string;column_count:string}
export type GlobalSnapshot = {enabled?:boolean;availability_version?:string;scope:'GLOBAL'; symbol:string; global_version:string; effective_from_ms:string|null; parameters:Parameters|null;layout:Layout|null}
type ParameterCommand = {action?:'save_parameters';symbol:string; based_on_global_version:string; client_request_id:string; reason:string; changes:Parameters;based_on_layout_version?:string;layout?:Partial<LayoutFields>}
type AvailabilityCommand = {action:'set_enabled'; symbol:string; based_on_availability_version:string; client_request_id:string; reason:string; enabled:boolean}
export type GlobalCommand = ParameterCommand | AvailabilityCommand
type GlobalResult = {enabled?:boolean;availability_version?:string;scope:'GLOBAL';symbol:string;global_version:string;operation_id:string;operation_status:'SUCCEEDED';effective_from_ms:string|null;changed:boolean;cache_state:'PENDING'|'DONE'|'NOT_REQUIRED'}
const symbolPattern=/^[A-Z0-9]{2,32}$/
const object=(v:unknown):v is Record<string,unknown>=>!!v && typeof v==='object' && !Array.isArray(v)
function check(v:unknown):asserts v { if(!v) throw Error('模板参数或版本无效') }
function exact(v:unknown,keys:readonly string[]):asserts v is Record<string,unknown> { check(object(v) && Object.keys(v).length===keys.length && keys.every(k=>Object.hasOwn(v,k))) }
function version(v:unknown):v is string { return typeof v==='string' && /^(0|[1-9]\d*)$/.test(v) && v.length<=19 && BigInt(v)<=9223372036854775807n }
function parameters(value:unknown):Parameters {
    exact(value,parameterFields.map(([key])=>key))
    const p={} as Parameters
    for(const [key] of parameterFields) p[key]=canonicalDecimal(value[key],key.includes('multiplier') ? 2 : key.includes('amount') ? 8 : undefined)
    check(compareDecimal(p.target_rtp,'0')>0 && compareDecimal(p.target_rtp,'1')<0)
    check(compareDecimal(p.min_multiplier,'1')>=0 && compareDecimal(p.max_multiplier,p.min_multiplier)>=0)
    check(compareDecimal(p.min_order_amount,'0')>0 && compareDecimal(p.max_order_amount,p.min_order_amount)>=0)
    const units=(n:string,scale:number)=>{const [i,f='']=n.split('.');return BigInt(i+f.padEnd(scale,'0'))}
    check(units(p.max_order_amount,8)*units(p.max_multiplier,2)<=9223372036854775807n*100n)
    return p
}
export function globalSnapshot(value:unknown,symbol:string):GlobalSnapshot {
    check(object(value))
    const availability = 'availability_version' in value || 'enabled' in value
    exact(value,['scope','symbol','global_version','effective_from_ms','parameters','layout', ...(availability ? ['availability_version','enabled'] : [])])
    if (availability) check(typeof value.enabled === 'boolean' && version(value.availability_version))
    const state = availability ? {enabled:value.enabled as boolean, availability_version:value.availability_version as string} : {}
    check(value.scope==='GLOBAL' && value.symbol===symbol && symbolPattern.test(symbol) && version(value.global_version))
    let layout:Layout|null=null
    if (value.layout!==null) {
        const l=value.layout
        exact(l,['version','row_count','column_count','column_duration_seconds','price_band_width','price_decimals'])
        check(version(l.version) && l.version!=='0' && typeof l.row_count==='string' && typeof l.column_count==='string' && typeof l.column_duration_seconds==='string')
        check(l.price_decimals===null || typeof l.price_decimals==='number' && Number.isInteger(l.price_decimals) && l.price_decimals>=0 && l.price_decimals<=18)
        layout={version:l.version,row_count:l.row_count,column_count:l.column_count,column_duration_seconds:l.column_duration_seconds,price_band_width:canonicalDecimal(l.price_band_width),price_decimals:l.price_decimals}
    }
    if (value.global_version==='0') {
        check(value.parameters===null && value.effective_from_ms===null)
        return {...state,scope:'GLOBAL',symbol,global_version:'0',effective_from_ms:null,parameters:null,layout}
    }
    check(version(value.effective_from_ms) && value.effective_from_ms!=='0' && layout!==null)
    return {...state,scope:'GLOBAL',symbol,global_version:value.global_version,effective_from_ms:value.effective_from_ms,parameters:parameters(value.parameters),layout}
}
function commandShape(value:unknown):asserts value is GlobalCommand {
    check(object(value) && typeof value.symbol==='string' && symbolPattern.test(value.symbol))
    check(typeof value.client_request_id==='string' && /^[A-Za-z0-9_-]{8,64}$/.test(value.client_request_id))
    check(typeof value.reason==='string' && value.reason.trim() && !value.reason.includes('\0') && new TextEncoder().encode(value.reason).length<=500)
    if (value.action==='set_enabled') {
        exact(value,['action','symbol','based_on_availability_version','client_request_id','reason','enabled'])
        check(typeof value.enabled==='boolean' && version(value.based_on_availability_version))
        return
    }
    check(value.action===undefined || value.action==='save_parameters')
    const fields=['symbol','based_on_global_version','client_request_id','reason','changes',...('action' in value ? ['action'] : [])]
    if (object(value) && 'layout' in value) {
        fields.push('layout','based_on_layout_version')
        check(version(value.based_on_layout_version) && object(value.layout))
        const keys=Object.keys(value.layout)
        check(keys.length>0 && keys.every(k=>['price_band_width','column_duration_seconds','price_decimals'].includes(k)))
        if (value.based_on_layout_version==='0') check(keys.length===3)
        if ('price_decimals' in value.layout) check(typeof value.layout.price_decimals==='number' && Number.isInteger(value.layout.price_decimals) && value.layout.price_decimals>=0 && value.layout.price_decimals<=8)
        if ('column_duration_seconds' in value.layout) check(typeof value.layout.column_duration_seconds==='string' && /^(?:[1-9]|10)$/.test(value.layout.column_duration_seconds))
        if ('price_band_width' in value.layout) check(compareDecimal(canonicalDecimal(value.layout.price_band_width,8),'0')>0)
    }
    exact(value,fields)
    check(version(value.based_on_global_version))
    parameters(value.changes)
}
export function globalCommand(snapshot:GlobalSnapshot,changes:unknown,id:string,layout?:Partial<LayoutFields>):ParameterCommand {
    const original=globalSnapshot(snapshot,snapshot.symbol), next=parameters(changes)
    const cmd:ParameterCommand={action:'save_parameters',...(layout ? {based_on_layout_version:original.layout?.version??'0',layout}:{}),symbol:original.symbol,based_on_global_version:original.global_version,client_request_id:id,reason:'更新新建站点的默认网格参数',changes:next}
    commandShape(cmd);return cmd
}
function validResult(value:unknown,pending:PendingCommand<GlobalCommand>):value is GlobalResult {
    if (!object(value) || value.scope!=='GLOBAL' || value.symbol!==pending.command.symbol ||
        value.operation_status!=='SUCCEEDED' || !version(value.operation_id) || value.operation_id==='0' ||
        typeof value.changed!=='boolean' || !version(value.global_version)) return false
    if (pending.command.action==='set_enabled') {
        if (value.enabled!==pending.command.enabled || !version(value.availability_version) ||
            !(version(value.effective_from_ms) || (!value.changed && value.effective_from_ms===null))) return false
        const delta=BigInt(value.availability_version)-BigInt(pending.command.based_on_availability_version)
        return delta===(value.changed ? 1n : 0n) && ['PENDING','DONE','NOT_REQUIRED'].includes(String(value.cache_state))
    }
    if (!version(value.effective_from_ms)) return false
    const delta=BigInt(value.global_version)-BigInt(pending.command.based_on_global_version)
    if (delta<0n || delta>1n) return false
    let layoutDelta=0n
    if (pending.command.layout) {
        if (!version(value.layout_version)) return false
        layoutDelta=BigInt(value.layout_version)-BigInt(pending.command.based_on_layout_version!)
        if (layoutDelta<0n || layoutDelta>1n) return false
    }
    return value.changed===(delta+layoutDelta>0n) &&
        (value.changed ? ['PENDING','DONE','NOT_REQUIRED'].includes(String(value.cache_state)) : value.cache_state==='NOT_REQUIRED')
}
export const globalJournal=createGridJournal<GlobalCommand,GlobalResult>('grid.config.global.pending.v1',commandShape,validResult)
