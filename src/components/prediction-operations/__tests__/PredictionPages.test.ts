import { defineComponent, h, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Operation from '../components/OperationPage.vue'
import Grid from '../grid/components/GridOrders.vue'
import { lastSevenDaysRange } from '../calendar-range'
import { errorMessage } from '../format'
import { tableFieldText } from '../fields'
import { formatUserName } from '../format-user-name'
import type { PredictionPageContext } from '../types'

const Table = defineComponent({
    name: 'MmProTable',
    props: ['data','columns','filters','total','currentPage','pageSize','queryFields','error'],
    emits: ['update:filters','update:current-page','update:page-size','query','reset','refresh'],
    setup(props, { slots }) {
        return () => h('main', {}, props.data?.[0] && [slots['cell-operation']?.({ row: props.data[0] }), slots['cell-source_type']?.({ row: props.data[0] })])
    }
})
const Drawer = defineComponent({
    name: 'MmDrawer', props: ['modelValue'],
    setup(props,{slots}) { return () => props.modelValue ? h('aside',{},slots.default?.()) : null }
})
const context = (): PredictionPageContext => ({
    actorId: '101', identityKey: 'merchant-100', permissions: ['*'], route: {fullPath: '/test', query: {}}
})
const mounted: ReturnType<typeof mount>[] = []
afterEach(() => { mounted.splice(0).forEach(wrapper => wrapper.unmount()); vi.useRealTimers() })
function render(component: any, props: any, slots = {}) {
    const wrapper = mount(component, {props, slots, global: { stubs: { MmProTable: Table, MmDrawer: Drawer } }})
    mounted.push(wrapper)
    return wrapper
}
function order(game: string) {
    return {order_id:'9007199254740993', order_no:'UD261023142726ABCDEF', game_type:'GAME_TYPE_'+game,
        user_id:'501', public_user_id:'4845987868', user_name:'account',nick_name:'Nick',
        symbol:'1000PEPEUSDT',agent_id:'100',business_status:'BUSINESS_STATUS_SETTLED',
        fund_status:'FUND_STATUS_SETTLED',stake:'1',result_price:'0.000001234567890123',
        debit_ledger_id:'9007199254740994',settlement_ledger_id:'9007199254740995'}
}
function operationAdapter(game: string) {
    const orders = vi.fn(async (_view, query, _signal?: AbortSignal) => ({
        items:[order(game)], page_number:query.page_number,page_size:query.page_size,total_count:'100',total_pages:'5'
    }))
    return { orders, rounds:vi.fn(async query => ({
        items:[{round_id:'round-1',agent_id:'0',symbol:'BTCUSDT'}],page_number:query.page_number,page_size:query.page_size,total_count:'100',total_pages:'5'
    })),locate:vi.fn(),navigate:vi.fn() }
}
const gridRow = (status: number) => ({
    order_id:'9007199254740993',order_no:'GC261023142726ABCDEF',user_id:'501',order_version:'1',
    time_start_ms:'1788739200000',time_end_ms:'1788739260000',home_site_id:'site-A',entry_site_id:'site-A',
    symbol:'BTCUSDT',settlement_asset:'USDT',cell_id:'cell',price_low:'1',price_high:'2',status_name:'ACTIVE',
    stake_amount:'1',locked_gross_payout:'2',locked_net_profit:'1',locked_multiplier:'2',
    created_at_ms:'1788739200000',updated_at_ms:'1788739200000',settled_at_ms:status===6?'1788739260000':null,
    result_code:1,status,...(status===6?{realized_net_profit:'-1'}:{}),user_name:'account',nick_name:'Nick',
    debit_ledger_id:'9007199254740994',settlement_ledger_id:null,funding_read_available:true
})
function gridAdapter(view: string) {
    return {orders:vi.fn(async (query:string) => {
        const q=new URLSearchParams(query)
        return {lists:[gridRow(view==='history'?6:2)],page_no:Number(q.get('page_no')),page_size:Number(q.get('page_size')),count:100,extend:{query_snapshot_at_ms:'1788739200000'}}
    }),locate:vi.fn(),navigate:vi.fn()}
}
describe('shared prediction pages', () => {
    for (const [game, view] of [['UP_DOWN','current'],['UP_DOWN','history'],['HIGH_LOW','current'],['HIGH_LOW','history'],['GRID','current'],['GRID','history']]) {
        it(game+' '+view+' supports host source columns and tag slots without changing default layout or requests',async()=>{
            const adapter=game==='GRID'?gridAdapter(view):operationAdapter(game)
            const columns=vi.fn(defaults=>defaults.map((column:any)=>column.key==='source_name'
                ? {...column,title:'统一来源名称',formatter:()=> '统一名称'} : column))
            const wrapper=render(game==='GRID'?Grid:Operation,{game,view,adapter,context:context(),showSources:true,columns},
                {'cell-source_type':()=>h('mark','统一来源标签')})
            await flushPromises()
            const before=columns.mock.calls.at(-1)![0], actual=wrapper.findComponent(Table).props('columns')
            expect(actual.map((c:any)=>[c.key,c.width])).toEqual(before.map((c:any)=>[c.key,c.width]))
            expect(actual.find((c:any)=>c.key==='source_name').formatter(null,{},0)).toBe('统一名称')
            expect(before.find((c:any)=>c.key==='source_name').title).toBe('来源名称')
            expect(wrapper.get('mark').text()).toBe('统一来源标签')
            expect(adapter.orders).toHaveBeenCalledTimes(1)
            await wrapper.setProps({showSources:false});await flushPromises()
            expect(wrapper.findComponent(Table).props('columns').some((c:any)=>c.key==='source_name')).toBe(false)
            expect(adapter.orders).toHaveBeenCalledTimes(1)
        })
    }
    for (const [game,view] of [['UP_DOWN','rounds'],['UP_DOWN','current'],['UP_DOWN','history'],['HIGH_LOW','current'],['HIGH_LOW','history']]) {
        it(game+' '+view+' preserves committed rows and pagination while editing dates', async () => {
            const adapter=operationAdapter(game), wrapper=render(Operation,{game,view,adapter,context:context()})
            await flushPromises()
            const table=wrapper.findComponent(Table), request=view==='rounds'?adapter.rounds:adapter.orders
            expect(request).toHaveBeenCalledTimes(1)
            table.vm.$emit('update:current-page',2)
            await nextTick();await flushPromises()
            expect(table.props('currentPage')).toBe(2)
            const before=table.props('data'),count=table.props('total'), calls=request.mock.calls.length
            const drafts={...table.props('filters'),created_range:['1788739200000','1788825600000']}
            table.vm.$emit('update:filters',drafts)
            await flushPromises()
            expect(request).toHaveBeenCalledTimes(calls)
            expect(table.props('data')).toEqual(before)
            expect(table.props('total')).toBe(count)
            expect(table.props('currentPage')).toBe(2)
            table.vm.$emit('query',drafts)
            await flushPromises()
            expect(request).toHaveBeenCalledTimes(calls+1)
            expect(table.props('currentPage')).toBe(1)
            const call=request.mock.calls.at(-1)!, query=view==='rounds'?call[0]:call[1]
            expect(query.time_from_ms).toBe('1788739200000')
            if(view==='history') {
                expect(table.props('columns').find((c:any)=>c.key==='operation').align).toBe('center')
                expect(table.props('columns').some((c:any)=>c.key==='debit_ledger_id')).toBe(false)
                await wrapper.get('button').trigger('click')
                expect(wrapper.find('[data-detail-field="debit_ledger_id"]').text()).toContain('9007199254740994')
            }
        })
    }
    for(const view of ['current','history']) {
        it('GRID '+view+' keeps draft filters separate from pagination and refresh',async()=>{
            const adapter=gridAdapter(view),wrapper=render(Grid,{view,adapter,context:context()})
            await flushPromises()
            const table=wrapper.findComponent(Table)
            expect(table.props('data')).toHaveLength(1)
            table.vm.$emit('update:current-page',2)
            await nextTick();await flushPromises()
            const before=table.props('data'),calls=adapter.orders.mock.calls.length
            table.vm.$emit('update:filters',{...table.props('filters'),date_range:['2026-09-07 00:00:00','2026-09-08 00:00:00']})
            await flushPromises()
            expect(adapter.orders).toHaveBeenCalledTimes(calls)
            expect(table.props('data')).toEqual(before);expect(table.props('total')).toBe(100);expect(table.props('currentPage')).toBe(2)
            table.vm.$emit('refresh');await flushPromises()
            expect(adapter.orders.mock.calls.at(-1)![0]).toBe(adapter.orders.mock.calls.at(-2)![0])
        })
    }
    it('defaults rounds to the last seven calendar days and retains both host scopes',async()=>{
        const adapter=operationAdapter('UP_DOWN')
        const wrapper=render(Operation,{game:'UP_DOWN',view:'rounds',adapter,context:context(),showSources:false,locale:'en-US'})
        await flushPromises()
        const query=adapter.rounds.mock.calls[0][0], [start,end]=lastSevenDaysRange()
        expect(query.time_from_ms).toBe(String(+start));expect(query.time_to_ms).toBe(String(+end))
        expect(query.agent_id).toBeUndefined()
        const table=wrapper.findComponent(Table)
        expect(table.props('columns').find((c:any)=>c.key==='symbol').title).toBe('Trading pair')
    })
    it('aborts and discards old identity responses and closes detail data',async()=>{
        let resolve!: (value:any)=>void
        const adapter=operationAdapter('UP_DOWN')
        adapter.orders.mockImplementationOnce((_view,_query)=>new Promise(done=>{resolve=done}))
        const wrapper=render(Operation,{game:'UP_DOWN',view:'history',adapter,context:context()})
        const signal=adapter.orders.mock.calls[0][2] as AbortSignal
        await wrapper.setProps({context:{...context(),identityKey:'merchant-200',permissions:[]}})
        resolve({items:[order('UP_DOWN')],page_number:1,page_size:20,total_count:'1',total_pages:'1'})
        await flushPromises()
        expect(signal.aborted).toBe(true)
        expect(wrapper.findComponent(Table).exists()).toBe(false)
        expect(wrapper.text()).not.toContain('account')
    })
    it('uses nickname fallback and never exposes transport details',()=>{
        expect(formatUserName('  Nick  ','account')).toBe('Nick')
        expect(formatUserName('  ','account')).toBe('account')
        expect(formatUserName(undefined,undefined)).toBe('-')
        expect(errorMessage(new Error('SQL password=secret'))).not.toContain('secret')
        expect(errorMessage({response:{status:401}})).toContain('登录')
        expect(errorMessage({error_code:{secret:'password'}})).not.toContain('password')
        expect(tableFieldText({result_price:'0.000001234567890123'},{key:'result_price',label:''},'UP_DOWN')).toContain('0.000001234567890123')
    })
    for (const [game, view] of [['UP_DOWN','rounds'],['UP_DOWN','current'],['UP_DOWN','history'],['HIGH_LOW','current'],['HIGH_LOW','history']]) {
        it(game+' '+view+' requires both a host identity and permission',async()=>{
            const adapter=operationAdapter(game)
            const wrapper=render(Operation,{game,view,adapter,context:{...context(),actorId:''}})
            await flushPromises()
            expect(adapter.orders).not.toHaveBeenCalled();expect(adapter.rounds).not.toHaveBeenCalled()
            await wrapper.setProps({context:{...context(),permissions:[]}})
            await flushPromises()
            expect(adapter.orders).not.toHaveBeenCalled();expect(adapter.rounds).not.toHaveBeenCalled()
            await wrapper.setProps({context:context()});await flushPromises()
            expect(view==='rounds'?adapter.rounds:adapter.orders).toHaveBeenCalledTimes(1)
        })
    }
    for (const view of ['current','history']) {
        it('GRID '+view+' rejects missing identity or permissions',async()=>{
            const adapter=gridAdapter(view)
            const wrapper=render(Grid,{view,adapter,context:{...context(),actorId:''}})
            await flushPromises();expect(adapter.orders).not.toHaveBeenCalled()
            await wrapper.setProps({context:{...context(),permissions:[]}})
            await flushPromises();expect(adapter.orders).not.toHaveBeenCalled()
        })
    }
    it('identity changes reset operation pagination and clear an open drawer',async()=>{
        const adapter=operationAdapter('UP_DOWN')
        const wrapper=render(Operation,{game:'UP_DOWN',view:'history',adapter,context:context()})
        await flushPromises()
        const table=wrapper.findComponent(Table)
        table.vm.$emit('update:current-page',2);await flushPromises()
        await wrapper.get('button').trigger('click')
        expect(wrapper.find('aside').exists()).toBe(true)
        await wrapper.setProps({context:{...context(),identityKey:'merchant-200'}})
        await flushPromises()
        expect(table.props('currentPage')).toBe(1)
        expect(wrapper.find('aside').exists()).toBe(false)
    })
    it('GRID discards a late previous-account response',async()=>{
        let finish!:(value:any)=>void
        const adapter=gridAdapter('history')
        adapter.orders.mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve}))
        const wrapper=render(Grid,{view:'history',adapter,context:context()})
        await wrapper.setProps({context:{...context(),identityKey:'other',permissions:[]}})
        finish({lists:[gridRow(6)],page_no:1,page_size:20,count:1,extend:{query_snapshot_at_ms:'1788739200000'}})
        await flushPromises()
        expect(wrapper.findComponent(Table).exists()).toBe(false)
        expect(wrapper.text()).not.toContain('account')
    })
    it('history width, time ordering and ledger-only drawers stay shared',async()=>{
        for(const game of ['UP_DOWN','HIGH_LOW']) {
            const wrapper=render(Operation,{game,view:'history',adapter:operationAdapter(game),context:context(),showSources:true})
            await flushPromises()
            const columns=wrapper.findComponent(Table).props('columns')
            expect(columns.reduce((sum:number,column:any)=>sum+Number(column.width),0)).toBe(1750)
            expect(columns.at(-2).key).toBe('funds_completed_at_ms')
            if(game==='HIGH_LOW') expect(columns.at(-3).key).toBe('expire_at_ms')
            expect(columns.at(-1).align).toBe('center')
        }
        const wrapper=render(Grid,{view:'history',adapter:gridAdapter('history'),context:context(),showSources:true})
        await flushPromises()
        const columns=wrapper.findComponent(Table).props('columns')
        expect(columns.reduce((sum:number,column:any)=>sum+Number(column.width),0)).toBe(1750)
        expect(columns.slice(-3).map((column:any)=>column.key)).toEqual(['created_at_ms','settled_at_ms','operation'])
        expect(columns.some((column:any)=>column.key==='debit_ledger_id')).toBe(false)
        await wrapper.get('button').trigger('click')
        expect(wrapper.text()).toContain('9007199254740994')
    })
    it('locale changes translate the shared table without issuing a new query',async()=>{
        const adapter=operationAdapter('UP_DOWN')
        const wrapper=render(Operation,{game:'UP_DOWN',view:'history',adapter,context:context(),locale:'zh-CN'})
        await flushPromises()
        await wrapper.setProps({locale:'en-US'});await flushPromises()
        expect(adapter.orders).toHaveBeenCalledTimes(1)
        expect(wrapper.findComponent(Table).props('columns').find((column:any)=>column.key==='user_name').title).toBe('Username')
    })
})
