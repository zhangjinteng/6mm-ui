import { compareDecimal, normalizeLayout } from './model'
import type { GridSnapshot } from './model'
export function initialGridConfiguration(value: unknown, symbol: string): GridSnapshot {
    const options = value as { site_id?: string; symbol?: string; layout_version?: string; layout?: Record<string, unknown> | null }
    const validVersion = (v: unknown) => typeof v === 'string' && /^(0|[1-9]\d{0,18})$/.test(v) && compareDecimal(v, '9223372036854775807') <= 0
    if (!options || options.symbol !== symbol || !/^[A-Z0-9]{2,32}$/.test(symbol) || !validVersion(options.site_id) || options.site_id === '0' || !validVersion(options.layout_version)) throw Error('INVALID_GRID_TARGET')
    const creatingLayout = options.layout_version === '0'
    if (creatingLayout !== (options.layout === null)) throw Error('INVALID_GRID_LAYOUT')
    const layout = creatingLayout ? {
        row_count: '10', column_count: '10', column_duration_seconds: '', price_band_width: '',
        effective_from_ms: '0', editable: true, affected_site_ids: [options.site_id!]
    } : normalizeLayout({ ...options.layout, effective_from_ms: '0', editable: false, affected_site_ids: [options.site_id!] })
    return {
        site_id: options.site_id!, symbol, layout_version: options.layout_version!, site_version: '0', effective_from_ms: '0',
        enabled: false, target_rtp: '', min_multiplier: '', max_multiplier: '', min_order_amount: '', max_order_amount: '', layout
    }
}
