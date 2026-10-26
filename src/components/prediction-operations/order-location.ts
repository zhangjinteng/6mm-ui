export type LocationView = 'current' | 'history'
export type LocationInput = { order_id: string } | { scope: string; business_id: string }
export interface OrderLocation {
    segment: 'up-down' | 'high-low' | 'grid'
    order_id: string
    created_at_ms?: string
    view?: LocationView
}
export function locationInput(query: Record<string, unknown> = {}): LocationInput | null {
    const value = (key: string) => typeof query[key] === 'string' ? query[key].trim() : ''
    if (value('order_id')) return { order_id: value('order_id') }
    if (value('scope') && value('business_id')) return { scope: value('scope'), business_id: value('business_id') }
    if (query.order_id !== undefined || query.scope !== undefined || query.business_id !== undefined) throw Error('订单定位参数不完整')
    return null
}
export function locationPlan(target: OrderLocation, segment: string, view: LocationView, permitted: (permission: string) => boolean): { redirect: string | null; range: [Date, Date] } {
    if (!target || !['up-down','high-low','grid'].includes(target.segment) || typeof target.order_id !== 'string' || !target.order_id) throw Error('订单定位响应无效')
    const gridHandoff = target.segment === 'grid' && segment !== 'grid' && target.created_at_ms === undefined && target.view === undefined
    const targetView = gridHandoff ? 'history' : target.view
    if (targetView !== 'current' && targetView !== 'history') throw Error('订单列表归属无效')
    const permission = target.segment === 'grid' ? 'grid_order:lists' : `prediction_operation:${targetView === 'current' ? 'current_orders' : 'history_orders'}`
    if (!permitted(permission)) throw Error('无权查看目标订单列表')
    let range: [Date, Date] = [new Date(0), new Date(0)]
    if (!gridHandoff) {
        const raw = target.created_at_ms
        if (typeof raw !== 'string' || !/^(0|[1-9][0-9]*)$/.test(raw)) throw Error('订单创建时间无效')
        const ms = Number(raw)
        if (!Number.isSafeInteger(ms) || ms < 0 || ms > 253402300799999) throw Error('订单创建时间无效')
        const start = new Date(ms); start.setHours(0,0,0,0)
        const end = new Date(start); end.setDate(end.getDate()+1)
        if (!Number.isFinite(+start) || !Number.isFinite(+end) || +start < 0 || +end > 253402300799999 || +end <= +start) throw Error('订单创建日期超出查询范围')
        range = [start,end]
    }
    return {range, redirect: target.segment === segment && targetView === view ? null : `/prediction/${target.segment}/${targetView === 'current' ? 'current-orders' : 'order-history'}`}
}
/** One lifecycle shared by locator and list result. The retry count travels with redirects. */
export class LinkSession {
    private version = 0
    private controller?: AbortController
    private attempts: number
    private hops: number
    constructor(retry: unknown = '0', hops: unknown = '0') { this.attempts = retry === '1' ? 1 : 0; this.hops = hops === '3' ? 3 : hops === '2' ? 2 : hops === '1' ? 1 : 0 }
    begin() {
        this.cancel()
        this.controller = new AbortController()
        const version = this.version
        return { signal: this.controller.signal, current: () => version === this.version }
    }
    cancel() { this.version++; this.controller?.abort() }
    retry() { if (this.attempts >= 1) throw Error('订单状态已变化或未找到，请重新定位'); return ++this.attempts }
    // The single status retry may need one more hop after the two-step Grid handoff.
    redirect() { if (this.hops >= 2 + this.attempts) throw Error('订单定位跳转次数已达上限，请重新定位'); return ++this.hops }
    get retryCount() { return this.attempts }
}
