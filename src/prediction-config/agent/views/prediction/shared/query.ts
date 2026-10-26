import { todayRange } from '../calendar-range'
import type { Game } from '../../../api/prediction/types'
import { integer, text } from './format'
export const options = {
    result:['PENDING','WIN','LOSE','DRAW','CANCELED'],
    sort_direction:['ASC','DESC'],
    status:['PREPARING','BETTING','LOCKED','OBSERVING','RESULTING','SETTLING','FINISHED'],
    direction:['UP','DOWN'],
    order_source:['PLAYER','MARKET_MAKER'],
    business_status:['PENDING','ACTIVE','RESULT_READY','SETTLED','CANCELED'],
    fund_status:['PENDING','DEBITED','SETTLE_PENDING','SETTLED','REFUND_PENDING','REFUNDED','UNKNOWN','REJECTED','MANUAL_REQUIRED']
}
export function makeQuery(game: Game, kind: 'orders' | 'rounds', input: Record<string,unknown>): Record<string,string|number> {
    const round = kind === 'rounds'
    if (!['UP_DOWN','HIGH_LOW'].includes(game) || (round && game !== 'UP_DOWN')) throw new Error('INVALID_QUERY')
    const newTime = ['time_field','time_from_ms','time_to_ms'].some(key => key in input)
    if (newTime && ['created_from_ms','created_to_ms'].some(key => key in input)) throw new Error('INVALID_TIME_RANGE')
    const enums: Record<string,string[]> = {
        ...(newTime ? { time_field: round ? ['CREATED_AT','DRAW_AT'] : ['CREATED_AT','FUNDS_COMPLETED_AT'] } : {}),
        result:options.result, sort_direction:options.sort_direction,
        sort_field:round ? ['BET_OPEN_AT','BET_CLOSE_AT','TOTAL_STAKE','AGENT_REVENUE'] : ['CREATED_AT','SETTLED_AT','STAKE','FINAL_RETURN'],
        ...(round ? {status:options.status} : {direction:options.direction,order_source:options.order_source,business_status:options.business_status,fund_status:options.fund_status})
    }
    const strings=['symbol','market_id','round_id',...(round?[]:['order_id','public_user_id','user_name'])]
    const integers=['duration_seconds',...(newTime?['time_from_ms','time_to_ms']:['created_from_ms','created_to_ms']),...(round?[]:['user_id'])]
    const allowed=new Set([...Object.keys(enums),...strings,...integers,'page_number','page_size'])
    const result:Record<string,string|number>={game_type:game}
    for (const [key,value] of Object.entries(input)) {
        if (!allowed.has(key)) throw new Error('INVALID_QUERY')
        if (value === '' || value === undefined) continue
        if (key in enums) {
            if (typeof value !== 'string' || !enums[key].includes(value)) throw new Error('INVALID_QUERY')
        } else if (strings.includes(key)) {
            if (!text(value,key==='user_name'?128:64,key==='symbol')) throw new Error('INVALID_QUERY')
        } else if (integers.includes(key)) {
            if (!integer(value,key==='user_id')) throw new Error('INVALID_QUERY')
        } else {
            if (!(typeof value==='number' && Number.isSafeInteger(value)) && !(typeof value==='string' && /^[1-9][0-9]*$/.test(value))) throw new Error('INVALID_QUERY')
            const page=Number(value),max=key==='page_size'?200:2147483647
            if (!Number.isSafeInteger(page)||page<1||page>max) throw new Error('INVALID_QUERY')
            result[key]=page
            continue
        }
        result[key]=value as string
    }
    const from=result[newTime?'time_from_ms':'created_from_ms'],to=result[newTime?'time_to_ms':'created_to_ms']
    if (newTime && (!result.time_field || !integer(from,true) || !integer(to,true))) throw new Error('INVALID_TIME_RANGE')
    if (!integer(from)||!integer(to)||BigInt(from)>=BigInt(to)||BigInt(to)-BigInt(from)>2678400000n) throw new Error('INVALID_TIME_RANGE')
    result.page_number ??= 1
    result.page_size ??= 20
    return result
}
export function defaultQueryRange(_round: boolean, now = new Date()): [Date, Date] {
    return todayRange(now)
}
export class ReadGate {
    private generation=0
    private controller?: AbortController
    next() {
        this.controller?.abort()
        this.controller=new AbortController()
        const generation=++this.generation,controller=this.controller
        return {signal:controller.signal,current:()=>generation===this.generation&&!controller.signal.aborted}
    }
    close() { this.generation++;this.controller?.abort() }
}

export const orderFields = 'order_no order_id debit_ledger_id settlement_ledger_id agent_id user_id home_site_id order_source game_type symbol market_id direction settlement_asset stake estimated_net_profit estimated_return final_net_profit final_return business_status fund_status unknown_from result config_version created_at_ms accepted_at_ms expire_at_ms result_at_ms settled_at_ms round_id duration_seconds open_price result_price funds_transaction_id agent_profit client_request_id order_version'.split(' ')
export const roundFields = 'agent_id round_id generation_id market_id symbol duration_seconds room_code status result cancel_reason config_version settlement_asset pool_share up_pool down_pool locked_up_pool locked_down_pool up_odds down_odds start_price end_price bet_open_at_ms bet_close_at_ms observe_end_at_ms display_end_at_ms draw_at_ms result_at_ms settled_at_ms participant_count order_count total_stake total_return platform_revenue truncation_tail agent_profit player_stake market_maker_stake player_order_count market_maker_order_count'.split(' ')
export function validatePage(value: unknown, game: Game, kind: 'orders' | 'rounds', page: number, size: number): void {
    const v = value as Record<string, unknown> | null
    if (!v || !Array.isArray(v.items) || v.page_number !== page || v.page_size !== size || !integer(v.total_count) || !integer(v.total_pages)) throw Error('INVALID_RESPONSE')
    for (const row of v.items) {
        if (!row || typeof row !== 'object' || Array.isArray(row) || !text(row[kind === 'orders' ? 'order_id' : 'round_id']) || (kind === 'orders' && row.game_type !== 'GAME_TYPE_' + game)) throw Error('INVALID_RESPONSE')
    }
}

export function validateDetail(value: unknown, id: string, game: Game): void {
    const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
    if (!object(value) || !object(value.summary)) throw Error('INVALID_RESPONSE')
    const branch = game === 'UP_DOWN' ? 'up_down' : 'high_low', other = game === 'UP_DOWN' ? 'high_low' : 'up_down'
    if (value.summary.order_id !== id || value.summary.game_type !== 'GAME_TYPE_' + game || !object(value[branch]) || value[other] !== undefined) throw Error('INVALID_RESPONSE')
}
