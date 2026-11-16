import { HistoryInterval, HistoryMetric, HistoryRange } from './history';
export interface MarketSymbol extends Record<string, unknown> {
    id?: number | string;
    symbol: string;
}
export interface MarketPreviewRow extends MarketSymbol {
    id: number | string;
    remain?: string;
}
export type MarketPriceMap = Record<string, Record<string, unknown>>;
export type SymbolTradeStats24hMap = Record<string, {
    trade_volume_24h: string;
    trade_quantity_24h: string;
}>;
export interface MarketCurrentApi {
    preview(params: {
        keyword: string;
        sym: string;
        page_no: number;
        page_size: number;
    }, signal: AbortSignal): Promise<{
        lists: MarketPreviewRow[];
        count: number;
    }>;
    symbols(signal: AbortSignal): Promise<MarketSymbol[]>;
    tradeStats(symbols: string[], signal: AbortSignal): Promise<SymbolTradeStats24hMap>;
}
export interface MarketHistoryParams {
    metric: HistoryMetric;
    interval: HistoryInterval;
    range: HistoryRange;
    symbol?: string;
    page_no?: number;
    page_size?: number;
    end_ms?: number;
}
export interface MarketHistoryRow {
    timestamp_ms: number;
    symbol: string;
    open: string | null;
    high: string | null;
    low: string | null;
    close: string | null;
}
export interface MarketHistoryApi {
    history(params: MarketHistoryParams, signal: AbortSignal): Promise<{
        lists: MarketHistoryRow[];
        count: number;
        end_ms?: number;
    }>;
    symbols(signal: AbortSignal): Promise<MarketSymbol[]>;
}
