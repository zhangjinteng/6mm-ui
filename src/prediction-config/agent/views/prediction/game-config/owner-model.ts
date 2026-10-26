import type { SiteEffectiveRule, SiteEffectiveTier } from '../../../api/prediction/site-types'
import type { OwnerActor, OwnerConfig, OwnerLimitChange, OwnerSaveBody } from '../../../api/prediction/owner-types'
import { normalizeDecimal } from '../../../utils/decimal'
import { compareDecimal, integer, text, decimal } from '../shared/format'
import { ensure, object, periods } from './site-model'
export type { OwnerActor, OwnerConfig, OwnerLimitChange, OwnerSaveBody }
// Only the unique live tier is editable; retired entries remain in the protocol for history.
export function ownerTier(rule: SiteEffectiveRule): SiteEffectiveTier { return rule.stake_tiers.find(t=>!t.retired)! }
export function canManageOwnerConfig(actor: OwnerActor): boolean { return integer(actor?.operator_id, true) && actor.operator_id === actor.agent_id }
export const money = (v: unknown): v is string => typeof v === 'string' && /^(0|[1-9][0-9]{0,17})(\.[0-9]{1,18})?$/.test(v) && compareDecimal(v,'0')>0
export function validateOwnerBounds(platformMin: string,platformMax: string,minimum: string,maximum: string): boolean {
    return [platformMin,platformMax,minimum,maximum].every(money) && compareDecimal(platformMin,minimum)<=0 && compareDecimal(minimum,maximum)<=0 && compareDecimal(maximum,platformMax)<=0
}
export function assertOwnerConfig(value: unknown,actor: OwnerActor): asserts value is OwnerConfig {
    ensure(canManageOwnerConfig(actor),'IDENTITY_UNCONFIRMED'); ensure(object(value) && value.owner_agent_id===actor.agent_id && ['GAME_TYPE_UP_DOWN','GAME_TYPE_HIGH_LOW'].includes(String(value.game_type)) && text(value.symbol,64,true),'INVALID_OWNER_CONFIGURATION')
    ensure(integer(value.public_version,true) && integer(value.owner_revision) && Array.isArray(value.rules) && value.rules.length>0 && value.rules.length<=100)
    ensure(typeof value.enabled==='boolean' && typeof value.platform_enabled==='boolean'); const up=value.game_type==='GAME_TYPE_UP_DOWN', seen=new Set<string>()
    if(up) ensure(value.rules.length===5)
    for(const item of value.rules) {
        ensure(object(item) && object(item.rule) && integer(item.rule_epoch,true) && typeof item.custom==='boolean')
        const rule=item.rule
        ensure(typeof item.platform_enabled==='boolean' && typeof item.owner_enabled==='boolean' && rule.enabled===(value.enabled && item.platform_enabled && item.owner_enabled))
        if(up) ensure(money(item.platform_target_payout_rate) && money(item.platform_maximum_odds) && item.platform_fixed_odds==='' && money(rule.target_payout_rate) && money(rule.maximum_odds) && compareDecimal(rule.target_payout_rate,item.platform_target_payout_rate)<=0 && compareDecimal(rule.target_payout_rate,'1')<=0 && compareDecimal(rule.maximum_odds,item.platform_maximum_odds)<=0 && compareDecimal(rule.maximum_odds,'1')>=0)
        else ensure(money(item.platform_fixed_odds) && item.platform_target_payout_rate==='' && item.platform_maximum_odds==='' && money(rule.fixed_odds) && compareDecimal(rule.fixed_odds,'1')>0 && compareDecimal(rule.fixed_odds,item.platform_fixed_odds)<=0)
        ensure(rule.game_type===value.game_type && rule.symbol===value.symbol && integer(rule.duration_seconds,true) && !seen.has(rule.duration_seconds) && typeof rule.enabled==='boolean' && Array.isArray(rule.stake_tiers)); seen.add(rule.duration_seconds)
        let bounds=rule
        if(up) {
            ensure(periods.includes(rule.duration_seconds) && rule.bet_open_seconds==='30')
            const ids=new Set<string>();const live=rule.stake_tiers.filter(t=>{ensure(object(t) && text(t.stake_tier_id) && !ids.has(t.stake_tier_id) && typeof t.retired==='boolean' && typeof t.enabled==='boolean');ids.add(t.stake_tier_id);return !t.retired})
            ensure(live.length===1);bounds=live[0];ensure(object(bounds) && text(bounds.stake_tier_id) && typeof bounds.enabled==='boolean' && bounds.retired===false)
            ensure(decimal(rule.target_payout_rate) && decimal(rule.minimum_odds) && decimal(rule.maximum_odds))
        } else ensure(rule.stake_tiers.length===0 && decimal(rule.fixed_odds))
        ensure(validateOwnerBounds(item.platform_minimum_stake as string,item.platform_maximum_stake as string,bounds.minimum_stake as string,bounds.maximum_stake as string))
    }
}
export interface OwnerRow extends OwnerLimitChange {observation_seconds: string; enabled: boolean; platform_minimum: string; platform_maximum: string; odds: string; custom: boolean; owner_enabled: boolean; platform_enabled: boolean; target_payout_rate: string; maximum_odds: string; fixed_odds: string; platform_target_payout_rate: string; platform_maximum_odds: string; platform_fixed_odds: string; minimum_odds: string}
export function ownerRows(value: unknown,actor: OwnerActor): OwnerRow[] {
    assertOwnerConfig(value,actor); const up=value.game_type==='GAME_TYPE_UP_DOWN'
    return value.rules.map(item=>{const r=item.rule,b=up?ownerTier(r):r;return {owner_enabled:item.owner_enabled,platform_enabled:item.platform_enabled,target_payout_rate:r.target_payout_rate,maximum_odds:r.maximum_odds,fixed_odds:r.fixed_odds,minimum_odds:r.minimum_odds,platform_target_payout_rate:item.platform_target_payout_rate,platform_maximum_odds:item.platform_maximum_odds,platform_fixed_odds:item.platform_fixed_odds,duration_seconds:r.duration_seconds,observation_seconds:up?String(BigInt(r.duration_seconds)-30n):r.duration_seconds,stake_tier_id:up?ownerTier(r).stake_tier_id:'',based_rule_epoch:item.rule_epoch,minimum_stake:b.minimum_stake,maximum_stake:b.maximum_stake,platform_minimum:item.platform_minimum_stake,platform_maximum:item.platform_maximum_stake,enabled:r.enabled && (!up||ownerTier(r).enabled),odds:up?`${r.minimum_odds} ~ ${r.maximum_odds}`:r.fixed_odds,custom:item.custom}})
}
export function makeOwnerBody(value: OwnerConfig,actor: OwnerActor,rows: OwnerRow[],reason: string,key: string,enabled=value.enabled): OwnerSaveBody {
    const old=ownerRows(value,actor);ensure(rows.length===old.length && new Set(rows.map(r=>r.duration_seconds)).size===old.length)
    ensure(text(reason,500) && text(key,128),'INVALID_REASON'); const changes:OwnerLimitChange[]=[]
    for(const prior of old) {
        const row=rows.find(r=>r.duration_seconds===prior.duration_seconds)
        ensure(row && row.stake_tier_id===prior.stake_tier_id && row.based_rule_epoch===prior.based_rule_epoch && validateOwnerBounds(prior.platform_minimum,prior.platform_maximum,row.minimum_stake,row.maximum_stake),'INVALID_LIMITS')
        ensure(typeof row.owner_enabled==='boolean' && (row.owner_enabled===prior.owner_enabled || !row.owner_enabled || prior.platform_enabled),'PLATFORM_DISABLED')
        const up=value.game_type==='GAME_TYPE_UP_DOWN'
        const fields=up?['target_payout_rate','maximum_odds'] as const:['fixed_odds'] as const
        for(const field of fields) ensure(money(row[field]) && compareDecimal(row[field],prior[`platform_${field}`])<=0,'INVALID_ODDS')
        ensure(up ? compareDecimal(row.target_payout_rate,'1')<0 && compareDecimal(row.maximum_odds,'1')>=0 : compareDecimal(row.fixed_odds,'1')>0 && compareDecimal(row.fixed_odds,'2')<0,'INVALID_ODDS')
        const limits=compareDecimal(row.minimum_stake,prior.minimum_stake)!==0 || compareDecimal(row.maximum_stake,prior.maximum_stake)!==0
        const odds=fields.some(f=>compareDecimal(row[f],prior[f])!==0), toggle=row.owner_enabled!==prior.owner_enabled
        if(limits || odds || toggle) {
            const change:OwnerLimitChange={duration_seconds:prior.duration_seconds,stake_tier_id:prior.stake_tier_id,based_rule_epoch:prior.based_rule_epoch,minimum_stake:normalizeDecimal(row.minimum_stake)!,maximum_stake:normalizeDecimal(row.maximum_stake)!}
            if(toggle) change.enabled=row.owner_enabled
            if(odds) for(const field of fields) change[field]=normalizeDecimal(row[field])!
            changes.push(change)
        }
    }
    ensure(typeof enabled==='boolean' && (enabled===value.enabled || !enabled || value.platform_enabled),'PLATFORM_DISABLED')
    ensure(changes.length>0 || enabled!==value.enabled,'NO_CHANGES')
    return {...(enabled!==value.enabled?{enabled}:{}),game_type:value.game_type==='GAME_TYPE_UP_DOWN'?'UP_DOWN':'HIGH_LOW',symbol:value.symbol,based_owner_revision:value.owner_revision,changes,client_request_id:key,reason}
}
export class OwnerReadGate {
    private generation=0
    begin(actor: OwnerActor,game: string,symbol: string) {return {generation:++this.generation,operator:actor.operator_id,owner:actor.agent_id,game,symbol}}
    close() {this.generation++}
    current(ticket: ReturnType<OwnerReadGate['begin']>,actor: OwnerActor,game: string,symbol: string) { return ticket.generation===this.generation && ticket.operator===actor.operator_id && ticket.owner===actor.agent_id && ticket.game===game && ticket.symbol===symbol }
}
