export interface GridDirectoryProduct {
    row_count?: string;
    column_count?: string;
    symbol: string;
    enabled: boolean;
    configured: boolean;
}
export declare function mergeGridDirectory(products: Array<{
    symbol: string;
    enabled: boolean;
    default_enabled: boolean;
}>, symbols: string[]): GridDirectoryProduct[];
export declare function sortConfigSymbols<T extends {
    symbol: string;
}>(rows: readonly T[], symbols: readonly string[], enabled?: (row: T) => boolean): T[];
