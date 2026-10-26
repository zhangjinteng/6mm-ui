export interface GridDirectoryProduct { row_count?: string; column_count?: string; symbol: string; enabled: boolean; configured: boolean }

// 通用币种仅供展示，只有本站授权目录中的产品才能读写配置。
export function mergeGridDirectory(products: Array<{symbol: string; enabled: boolean}>, symbols: string[]): GridDirectoryProduct[] {
    const rows = new Map<string, GridDirectoryProduct>()
    for (const product of products) rows.set(product.symbol, {...product, configured: true})
    for (const value of symbols) {
        const symbol = value.trim().toUpperCase()
        if (/^[A-Z0-9]{2,32}$/.test(symbol) && !rows.has(symbol)) rows.set(symbol, {symbol, enabled: false, configured: false})
    }
    return sortConfigSymbols([...rows.values()], symbols)
}

// The directory is already ordered by the authoritative platform sort and id fields.
export function sortConfigSymbols<T extends {symbol: string}>(rows: readonly T[], symbols: readonly string[], enabled: (row: T) => boolean = row => Boolean((row as T & {enabled?: boolean}).enabled)): T[] {
    const rank = new Map<string, number>()
    for (const value of symbols) { const key = value.trim().toUpperCase(); if (!rank.has(key)) rank.set(key, rank.size) }
    return [...rows].sort((a, b) => Number(enabled(b)) - Number(enabled(a)) ||
        (rank.get(a.symbol) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.symbol) ?? Number.MAX_SAFE_INTEGER) || a.symbol.localeCompare(b.symbol))
}
