export interface GridDirectoryProduct { row_count?: string; column_count?: string; symbol: string; enabled: boolean; configured: boolean }

// 通用币种目录仅提供排序；可见范围由平台开关决定，保留商户自行关闭的配置。
export function mergeGridDirectory(products: Array<{symbol: string; enabled: boolean; default_enabled: boolean}>, symbols: string[]): GridDirectoryProduct[] {
    return sortConfigSymbols(products.filter(product => product.default_enabled).map(product => ({...product, configured: true})), symbols)
}

// The directory is already ordered by the authoritative platform sort and id fields.
export function sortConfigSymbols<T extends {symbol: string}>(rows: readonly T[], symbols: readonly string[], enabled: (row: T) => boolean = row => Boolean((row as T & {enabled?: boolean}).enabled)): T[] {
    const rank = new Map<string, number>()
    for (const value of symbols) { const key = value.trim().toUpperCase(); if (!rank.has(key)) rank.set(key, rank.size) }
    return [...rows].sort((a, b) => Number(enabled(b)) - Number(enabled(a)) ||
        (rank.get(a.symbol) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.symbol) ?? Number.MAX_SAFE_INTEGER) || a.symbol.localeCompare(b.symbol))
}
